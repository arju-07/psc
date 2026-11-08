-- ============================================================
-- Kerala PYQ Hub — Migration 002: Single Super Admin & User Roles
-- Enforces:
--  1. Exactly TWO roles: 'student' and 'super_admin'
--  2. At most ONE 'super_admin' in the entire system (enforced by DB index)
--  3. Automatic assignment of 'student' on public signup
--  4. Students cannot modify or elevate their own roles
--  5. Secure idempotent provisioning function for the Single Admin
-- ============================================================

-- Enable pgcrypto if not already enabled
create extension if not exists "pgcrypto";

-- 1. Create or ensure profiles table
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  name          text not null,
  email         text not null,
  role          text not null default 'student' check (role in ('student', 'super_admin')),
  target_exams  text[] not null default '{}',
  preferred_language text not null default 'Both' check (preferred_language in ('English', 'Malayalam', 'Both')),
  avatar_url    text,
  joined_date   date not null default current_date,
  theme_preference text not null default 'light' check (theme_preference in ('light', 'dark', 'system')),
  email_notifications boolean not null default true,
  daily_reminder boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 2. Create user_roles table
create table if not exists public.user_roles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        text not null check (role in ('student', 'super_admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, role)
);

-- 3. ENFORCE EXACTLY ONE SUPER ADMIN AT THE DATABASE LEVEL
-- A unique partial index ensures PostgreSQL will strictly reject any attempt to insert
-- or update a second user with role = 'super_admin'
create unique index if not exists single_super_admin_unique_idx
  on public.user_roles (role)
  where (role = 'super_admin');

-- 4. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;

-- Drop any older conflicting policies
drop policy if exists "user_roles: read own" on public.user_roles;
drop policy if exists "user_roles: no client insert" on public.user_roles;
drop policy if exists "user_roles: no client update" on public.user_roles;
drop policy if exists "user_roles: no client delete" on public.user_roles;

-- Users can ONLY read their own role
create policy "user_roles: read own"
  on public.user_roles
  for select
  using (auth.uid() = user_id);

-- Super admin can read all roles for administration
create policy "user_roles: super_admin read all"
  on public.user_roles
  for select
  using (
    exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid() and ur.role = 'super_admin'
    )
  );

-- No regular user can ever insert, update, or delete roles directly via client API
-- Role modifications must be performed by the database trigger or security definer function

-- Profiles policies
drop policy if exists "profiles: own read" on public.profiles;
drop policy if exists "profiles: own update" on public.profiles;
drop policy if exists "profiles: super_admin read all" on public.profiles;

create policy "profiles: own read"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "profiles: own update"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles: super_admin read all"
  on public.profiles
  for select
  using (
    exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid() and ur.role = 'super_admin'
    )
  );

-- 5. Trigger on public user signup
-- Enforces that any public registration is ALWAYS assigned the 'student' role
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  -- 1. Create student profile
  insert into public.profiles (id, name, email, role, preferred_language)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    'student', -- ALWAYS student for public signups!
    coalesce(new.raw_user_meta_data->>'preferred_language', 'Both')
  )
  on conflict (id) do update
  set
    name = coalesce(new.raw_user_meta_data->>'name', public.profiles.name),
    updated_at = now();

  -- 2. Automatically assign the 'student' role in user_roles
  insert into public.user_roles (user_id, role)
  values (new.id, 'student')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. Secure One-Time Provisioning Procedure for the Single Super Admin
-- Run this function with the administrator's email or user ID to assign the single super_admin role.
-- It strictly enforces that ONLY ONE super_admin can exist across the entire platform.
create or replace function public.provision_single_super_admin(
  target_user_id uuid
)
returns json language plpgsql security definer as $$
declare
  existing_admin_id uuid;
  user_email text;
begin
  -- Check if a super_admin already exists
  select user_id into existing_admin_id
  from public.user_roles
  where role = 'super_admin'
  limit 1;

  if existing_admin_id is not null then
    if existing_admin_id = target_user_id then
      return json_build_object(
        'success', true,
        'message', 'This user is already the single authorized Super Admin.'
      );
    else
      return json_build_object(
        'success', false,
        'error', 'A Super Admin already exists in Kerala PYQ Hub. Only ONE administrator account is permitted.'
      );
    end if;
  end if;

  -- Ensure target user exists in auth.users
  select email into user_email from auth.users where id = target_user_id;
  if user_email is null then
    return json_build_object(
      'success', false,
      'error', 'Target user does not exist in auth.users.'
    );
  end if;

  -- Remove default student role for this administrator
  delete from public.user_roles where user_id = target_user_id;

  -- Assign super_admin role
  insert into public.user_roles (user_id, role)
  values (target_user_id, 'super_admin');

  -- Update profiles table
  update public.profiles
  set role = 'super_admin', updated_at = now()
  where id = target_user_id;

  return json_build_object(
    'success', true,
    'message', 'Single Super Admin successfully provisioned.',
    'email', user_email
  );
end;
$$;
