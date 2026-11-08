-- ============================================================
-- Kerala PYQ Hub — Supabase Database Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- 1. PROFILES
-- ============================================================
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  name          text not null,
  email         text not null,
  role          text not null default 'student'
                  check (role in ('student','admin','moderator','content_admin','user_manager')),
  target_exams  text[]  not null default '{}',
  preferred_language text not null default 'Both'
                  check (preferred_language in ('English','Malayalam','Both')),
  avatar_url    text,
  joined_date   date not null default current_date,
  theme_preference text not null default 'light'
                  check (theme_preference in ('light','dark','system')),
  email_notifications boolean not null default true,
  daily_reminder      boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Students can read/update their own profile; admins can read all
create policy "profiles: own read"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: own update" on public.profiles for update using (auth.uid() = id);
create policy "profiles: insert own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles: admin read all" on public.profiles for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','moderator','content_admin','user_manager')));

-- Auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 2. EXAM CATEGORIES
-- ============================================================
create table if not exists public.exam_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  slug        text not null unique,
  icon_name   text not null default 'GraduationCap',
  description text not null default '',
  exam_count  integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.exam_categories enable row level security;
create policy "categories: public read" on public.exam_categories for select using (true);
create policy "categories: admin write" on public.exam_categories for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','content_admin')));

-- ============================================================
-- 3. EXAMS
-- ============================================================
create table if not exists public.exams (
  id                        uuid primary key default gen_random_uuid(),
  name                      text not null,
  slug                      text not null unique,
  category                  text not null,
  category_slug             text not null,
  short_description         text not null default '',
  paper_count               integer not null default 0,
  practice_questions_count  integer not null default 0,
  is_popular                boolean not null default false,
  is_recently_added         boolean not null default false,
  overview                  text not null default '',
  eligibility               text not null default '',
  exam_pattern              text not null default '',
  official_website_url      text,
  important_topics          text[] not null default '{}',
  published                 boolean not null default false,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

alter table public.exams enable row level security;
create policy "exams: public read published" on public.exams for select using (published = true);
create policy "exams: admin read all" on public.exams for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','content_admin','moderator')));
create policy "exams: admin write" on public.exams for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','content_admin')));

-- ============================================================
-- 4. PYQ PAPERS
-- ============================================================
create table if not exists public.pyq_papers (
  id                    uuid primary key default gen_random_uuid(),
  exam_id               uuid references public.exams(id) on delete set null,
  exam_slug             text not null,
  exam_name             text not null,
  category              text not null,
  year                  integer not null,
  paper_code            text not null unique,
  language              text not null default 'English'
                          check (language in ('Malayalam','English','Bilingual','Tamil','Kannada')),
  subject               text not null default '',
  total_marks           integer not null default 100,
  duration_minutes      integer not null default 90,
  verification_status   text not null default 'pending'
                          check (verification_status in ('verified','pending','rejected')),
  has_official_answer_key boolean not null default false,
  file_size             text not null default '',
  uploaded_at           timestamptz not null default now(),
  download_count        integer not null default 0,
  published             boolean not null default false,
  pdf_url               text,
  answer_key_pdf_url    text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.pyq_papers enable row level security;
create policy "papers: public read published" on public.pyq_papers for select using (published = true);
create policy "papers: admin all" on public.pyq_papers for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','content_admin','moderator')));

-- Increment downloads function (call via RPC)
create or replace function public.increment_paper_downloads(paper_id uuid)
returns void language sql security definer as $$
  update public.pyq_papers set download_count = download_count + 1 where id = paper_id;
$$;

-- ============================================================
-- 5. MCQ QUESTIONS
-- ============================================================
create table if not exists public.mcq_questions (
  id                    uuid primary key default gen_random_uuid(),
  paper_id              uuid references public.pyq_papers(id) on delete set null,
  exam_slug             text not null,
  exam_name             text not null,
  subject               text not null,
  topic                 text not null default '',
  difficulty            text not null default 'medium'
                          check (difficulty in ('easy','medium','hard')),
  year                  integer,
  question_text         text not null,
  question_malayalam    text,
  options               jsonb not null,
  correct_answer        text not null check (correct_answer in ('A','B','C','D')),
  explanation           jsonb not null default '{}',
  verification_status   text not null default 'pending'
                          check (verification_status in ('verified','pending','rejected')),
  is_verified_official_key boolean not null default false,
  source_paper_name     text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.mcq_questions enable row level security;
create policy "questions: public read verified" on public.mcq_questions
  for select using (verification_status = 'verified');
create policy "questions: admin all" on public.mcq_questions for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','content_admin','moderator')));

-- ============================================================
-- 6. BOOKMARKS (questions)
-- ============================================================
create table if not exists public.bookmarks_questions (
  user_id     uuid not null references public.profiles(id) on delete cascade,
  question_id uuid not null references public.mcq_questions(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, question_id)
);

alter table public.bookmarks_questions enable row level security;
create policy "bq: own" on public.bookmarks_questions for all using (auth.uid() = user_id);

-- ============================================================
-- 7. BOOKMARKS (papers)
-- ============================================================
create table if not exists public.bookmarks_papers (
  user_id   uuid not null references public.profiles(id) on delete cascade,
  paper_id  uuid not null references public.pyq_papers(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, paper_id)
);

alter table public.bookmarks_papers enable row level security;
create policy "bp: own" on public.bookmarks_papers for all using (auth.uid() = user_id);

-- ============================================================
-- 8. MISTAKE NOTEBOOK
-- ============================================================
create table if not exists public.mistake_notebook (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references public.profiles(id) on delete cascade,
  question_id          uuid not null references public.mcq_questions(id) on delete cascade,
  wrong_attempts_count integer not null default 1,
  last_attempted_date  date not null default current_date,
  selected_wrong_option text not null check (selected_wrong_option in ('A','B','C','D')),
  is_corrected         boolean not null default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  unique (user_id, question_id)
);

alter table public.mistake_notebook enable row level security;
create policy "mistakes: own" on public.mistake_notebook for all using (auth.uid() = user_id);

-- ============================================================
-- 9. STUDY PLAN
-- ============================================================
create table if not exists public.study_plan (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.profiles(id) on delete cascade,
  exam_slug          text not null,
  exam_name          text not null,
  subject            text not null,
  topic              text not null,
  target_date        date not null,
  estimated_minutes  integer not null default 60,
  status             text not null default 'pending'
                       check (status in ('pending','in_progress','completed')),
  priority           text not null default 'medium'
                       check (priority in ('low','medium','high')),
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

alter table public.study_plan enable row level security;
create policy "plan: own" on public.study_plan for all using (auth.uid() = user_id);

-- ============================================================
-- 10. NOTIFICATIONS
-- ============================================================
create table if not exists public.notifications (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid references public.profiles(id) on delete cascade, -- null = broadcast
  title     text not null,
  message   text not null,
  type      text not null check (type in ('paper','mock','challenge','announcement','system')),
  date      timestamptz not null default now(),
  read      boolean not null default false,
  link      text,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;
create policy "notif: own or broadcast" on public.notifications for select
  using (user_id = auth.uid() or user_id is null);
create policy "notif: mark read" on public.notifications for update
  using (user_id = auth.uid());
create policy "notif: admin all" on public.notifications for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','moderator')));

-- ============================================================
-- 11. PROCESSING DOCUMENTS (PDF Pipeline)
-- ============================================================
create table if not exists public.processing_documents (
  id                   uuid primary key default gen_random_uuid(),
  file_name            text not null,
  file_size_bytes      bigint not null,
  file_size_display    text not null,
  exam_slug            text not null,
  exam_name            text not null,
  year                 integer not null,
  paper_code           text not null,
  language             text not null default 'English',
  has_official_answer_key boolean not null default false,
  checksum_hash        text not null unique,
  is_scanned           boolean not null default false,
  status               text not null default 'queued',
  uploaded_bytes       bigint not null default 0,
  progress_percentage  numeric(5,2) not null default 0,
  current_step         integer not null default 0,
  steps_state          jsonb not null default '[]',
  total_extracted_count integer not null default 0,
  approved_count       integer not null default 0,
  rejected_count       integer not null default 0,
  pending_count        integer not null default 0,
  error_log            text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

alter table public.processing_documents enable row level security;
create policy "proc_docs: admin all" on public.processing_documents for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','content_admin','moderator')));

-- ============================================================
-- 12. EXTRACTED QUESTIONS (Pipeline Verification Queue)
-- ============================================================
create table if not exists public.extracted_questions (
  id                  uuid primary key default gen_random_uuid(),
  document_id         uuid not null references public.processing_documents(id) on delete cascade,
  question_number     integer not null,
  question_text       text not null,
  question_malayalam  text,
  options             jsonb not null,
  correct_answer      text not null check (correct_answer in ('A','B','C','D')),
  answer_source       text not null check (answer_source in ('official_key','ai_suggested')),
  explanation_text    text not null default '',
  confidence_score    numeric(5,2) not null default 0,
  is_duplicate        boolean not null default false,
  flagged_error       text,
  verification_status text not null default 'pending_verification'
                        check (verification_status in ('pending_verification','approved_published','rejected')),
  reviewed_by         uuid references public.profiles(id),
  exam_slug           text not null,
  exam_name           text not null,
  subject             text not null,
  topic               text not null default '',
  source_paper_code   text not null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.extracted_questions enable row level security;
create policy "ext_q: admin all" on public.extracted_questions for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','content_admin','moderator')));

-- ============================================================
-- 13. STORAGE BUCKETS (run separately or via dashboard)
-- ============================================================
-- Create these buckets in Supabase Dashboard → Storage:
--   • papers      (private, max upload size: unlimited)
--   • answer-keys (private, max upload size: unlimited)
--   • avatars     (public)
--
-- Or via CLI:
--   supabase storage create papers --no-public
--   supabase storage create answer-keys --no-public
--   supabase storage create avatars --public

-- ============================================================
-- Done!
-- ============================================================
