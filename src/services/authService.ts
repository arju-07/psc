import { supabase } from '../lib/supabase';
import { UserRole } from '../types';
import { Session, User } from '@supabase/supabase-js';

export interface AuthSuccessResult {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  error: string | null;
  needsEmailVerification?: boolean;
}

export interface RegisterStudentParams {
  name: string;
  email: string;
  password: string;
  preferredLanguage: 'English' | 'Malayalam' | 'Both';
}

/**
 * Fetch the authenticated user's actual role from the Supabase "user_roles" table.
 * Falls back to "profiles" table and user_metadata to ensure resilience even before migrations run.
 */
export async function fetchUserRoleFromDatabase(
  userId: string,
  userMetadata?: Record<string, unknown>
): Promise<{
  role: UserRole | null;
  error: string | null;
}> {
  try {
    // 1. Primary check: user_roles table
    const { data: roleRow, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (!roleError && roleRow && (roleRow.role === 'student' || roleRow.role === 'super_admin')) {
      return { role: roleRow.role as UserRole, error: null };
    }

    // 2. Secondary check: profiles table
    const { data: profileRow, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    if (!profileError && profileRow) {
      if (profileRow.role === 'super_admin' || profileRow.role === 'admin') {
        return { role: 'super_admin', error: null };
      }
      if (profileRow.role === 'student') {
        return { role: 'student', error: null };
      }
    }

    // 3. Fallback: check Supabase user_metadata
    if (userMetadata) {
      if (userMetadata.role === 'super_admin' || userMetadata.role === 'admin') {
        return { role: 'super_admin', error: null };
      }
      return { role: 'student', error: null };
    }

    // Default to student so authenticated users are not locked out
    return {
      role: 'student',
      error: null,
    };
  } catch (_err) {
    if (userMetadata?.role === 'super_admin') {
      return { role: 'super_admin', error: null };
    }
    return { role: 'student', error: null };
  }
}

/**
 * Common Login: Verifies credentials via Supabase Auth and automatically retrieves
 * the user's database-assigned role.
 */
export async function loginWithEmailAndPassword(
  email: string,
  password: string
): Promise<AuthSuccessResult> {
  const cleanEmail = email.trim().toLowerCase();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });

  if (error) {
    return {
      user: null,
      session: null,
      role: null,
      error: error.message,
    };
  }

  if (!data.user) {
    return {
      user: null,
      session: null,
      role: null,
      error: 'Authentication failed. Please check your credentials.',
    };
  }

  // Retrieve actual database role from user_roles / metadata
  const { role, error: roleError } = await fetchUserRoleFromDatabase(
    data.user.id,
    data.user.user_metadata
  );

  return {
    user: data.user,
    session: data.session,
    role: role || 'student',
    error: role ? null : roleError,
  };
}

/**
 * Public Student Registration:
 * Creates account via Supabase Auth and strictly provisions the 'student' role.
 * Catches rate limits and provides clear instructions.
 */
export async function registerStudentAccount(
  params: RegisterStudentParams
): Promise<AuthSuccessResult> {
  const { name, email, password, preferredLanguage } = params;
  const cleanEmail = email.trim().toLowerCase();

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: {
        name: name.trim(),
        preferred_language: preferredLanguage,
        role: 'student', // Public signups are strictly students
      },
    },
  });

  if (error) {
    let friendlyMessage = error.message;

    if (error.message.toLowerCase().includes('rate limit')) {
      friendlyMessage =
        'Supabase Email Rate Limit Reached (Free tier allows 3 emails/hour). ' +
        'To enable unlimited registrations instantly: In your Supabase Dashboard -> Authentication -> Providers -> Email, toggle OFF "Confirm email". ' +
        'Or you can sign in directly if your account was already created!';
    }

    return {
      user: null,
      session: null,
      role: null,
      error: friendlyMessage,
    };
  }

  if (!data.user) {
    return {
      user: null,
      session: null,
      role: null,
      error: 'Registration failed. Please try again.',
    };
  }

  // Attempt client-side insert into profiles and user_roles in case triggers haven't fired
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('profiles') as any).upsert({
      id: data.user.id,
      name: name.trim(),
      email: cleanEmail,
      role: 'student',
      preferred_language: preferredLanguage,
      target_exams: [],
      joined_date: new Date().toISOString().split('T')[0],
      theme_preference: 'light',
      email_notifications: true,
      daily_reminder: true,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('user_roles') as any).upsert({
      user_id: data.user.id,
      role: 'student',
    });
  } catch {
    // Handled by database trigger
  }

  const needsEmailVerification = !data.session;

  return {
    user: data.user,
    session: data.session,
    role: 'student',
    error: null,
    needsEmailVerification,
  };
}

/**
 * Sign in with Google OAuth
 */
export async function loginWithGoogleOAuth(): Promise<{
  error: string | null;
  isNotConfigured?: boolean;
}> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      if (
        error.message?.toLowerCase().includes('not enabled') ||
        error.message?.toLowerCase().includes('unsupported')
      ) {
        return {
          error:
            'Google Sign-In is not enabled yet in your Supabase project. ' +
            'Please go to Supabase Dashboard -> Authentication -> Providers -> Google, toggle it ON, and add your Google Client ID & Secret.',
          isNotConfigured: true,
        };
      }
      return { error: error.message };
    }

    // Check if the returned authorization URL triggers a provider error
    if (data?.url) {
      // Allow browser to redirect
      window.location.href = data.url;
    }

    return { error: null };
  } catch (err) {
    const e = err as Error;
    return { error: e.message };
  }
}

/**
 * Request password recovery email
 */
export async function sendPasswordResetEmail(email: string): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: `${window.location.origin}/forgot-password`,
  });

  return { error: error?.message ?? null };
}

/**
 * Sign out of current session
 */
export async function logoutSession(): Promise<void> {
  await supabase.auth.signOut();
}
