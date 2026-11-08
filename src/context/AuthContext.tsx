import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import {
  UserProfile,
  UserRole,
  MCQQuestion,
  MistakeNotebookItem,
  StudyPlanItem,
  NotificationItem,
} from '../types';
import {
  loginWithEmailAndPassword,
  registerStudentAccount,
  loginWithGoogleOAuth,
  sendPasswordResetEmail,
  logoutSession,
  fetchUserRoleFromDatabase,
  RegisterStudentParams,
} from '../services/authService';

interface AuthContextType {
  currentUser: UserProfile | null;
  supabaseUser: User | null;
  session: Session | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  authLoading: boolean;
  authError: string | null;
  setAuthError: (err: string | null) => void;

  // Real Supabase Authentication methods
  signIn: (email: string, password: string) => Promise<{
    success: boolean;
    role: UserRole | null;
    error: string | null;
  }>;
  register: (params: RegisterStudentParams) => Promise<{
    success: boolean;
    error: string | null;
    needsEmailVerification?: boolean;
  }>;
  loginWithGoogle: () => Promise<{ error: string | null }>;
  sendPasswordReset: (email: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;

  // User state & study features
  bookmarkedQuestionIds: string[];
  bookmarkedPaperIds: string[];
  toggleBookmarkQuestion: (id: string) => void;
  toggleBookmarkPaper: (id: string) => void;
  mistakes: MistakeNotebookItem[];
  recordMistake: (question: MCQQuestion, selectedWrong: 'A' | 'B' | 'C' | 'D') => void;
  removeMistake: (questionId: string) => void;
  markMistakeCorrected: (questionId: string) => void;
  studyPlan: StudyPlanItem[];
  addStudyPlanItem: (item: Omit<StudyPlanItem, 'id'>) => void;
  toggleStudyPlanStatus: (id: string) => void;
  deleteStudyPlanItem: (id: string) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateTargetExams: (exams: string[]) => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // User study data
  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('kerala_pyq_bookmarks_q');
    return saved ? JSON.parse(saved) : [];
  });

  const [bookmarkedPaperIds, setBookmarkedPaperIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('kerala_pyq_bookmarks_p');
    return saved ? JSON.parse(saved) : [];
  });

  const [mistakes, setMistakes] = useState<MistakeNotebookItem[]>(() => {
    const saved = localStorage.getItem('kerala_pyq_mistakes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.filter((m: any) => m?.id && !m.id.startsWith('mst-')) : [];
      } catch { return []; }
    }
    return [];
  });

  const [studyPlan, setStudyPlan] = useState<StudyPlanItem[]>(() => {
    const saved = localStorage.getItem('kerala_pyq_study_plan');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.filter((p: any) => p?.id && !p.id.startsWith('plan-')) : [];
      } catch { return []; }
    }
    return [];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('kerala_pyq_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.filter((n: any) => n?.id && !n.id.startsWith('notif-')) : [];
      } catch { return []; }
    }
    return [];
  });

  /**
   * Helper: Build UserProfile object from Supabase user and database role
   */
  const buildUserProfile = async (user: User, userRole: UserRole): Promise<UserProfile> => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profile) {
        return {
          id: profile.id,
          name: profile.name || user.email?.split('@')[0] || 'User',
          email: profile.email || user.email || '',
          role: userRole,
          targetExams: profile.target_exams ?? [],
          preferredLanguage: (profile.preferred_language as UserProfile['preferredLanguage']) || 'Both',
          avatarUrl: profile.avatar_url ?? undefined,
          joinedDate: profile.joined_date || new Date().toISOString().split('T')[0],
          themePreference: (profile.theme_preference as UserProfile['themePreference']) || 'light',
          emailNotifications: profile.email_notifications ?? true,
          dailyReminder: profile.daily_reminder ?? true,
        };
      }
    } catch (e) {
      console.warn('[buildUserProfile] Could not read profiles table:', e);
    }

    // Default profile from auth metadata
    return {
      id: user.id,
      name: (user.user_metadata?.name as string) || user.email?.split('@')[0] || 'User',
      email: user.email ?? '',
      role: userRole,
      targetExams: [],
      preferredLanguage: (user.user_metadata?.preferred_language as UserProfile['preferredLanguage']) || 'Both',
      joinedDate: new Date().toISOString().split('T')[0],
      themePreference: 'light',
      emailNotifications: true,
      dailyReminder: true,
    };
  };

  /**
   * Initialize Session & Listen to Auth State Changes
   * Restores session on page refresh without flashing unauthorized content.
   */
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        setAuthLoading(true);
        const { data: { session: activeSession } } = await supabase.auth.getSession();

        if (activeSession?.user) {
          const { role: detectedRole, error: roleError } = await fetchUserRoleFromDatabase(activeSession.user.id);

          if (isMounted) {
            if (detectedRole) {
              const profile = await buildUserProfile(activeSession.user, detectedRole);
              setCurrentUser(profile);
              setRole(detectedRole);
              setSession(activeSession);
              setSupabaseUser(activeSession.user);
              setAuthError(null);
            } else {
              // User exists in auth but has no role in database
              console.warn('[initializeAuth] User without assigned role in database:', roleError);
              setCurrentUser(null);
              setRole(null);
              setSession(null);
              setSupabaseUser(null);
              setAuthError('Your account has no assigned role in the system. Access denied.');
            }
          }
        } else {
          if (isMounted) {
            setCurrentUser(null);
            setRole(null);
            setSession(null);
            setSupabaseUser(null);
          }
        }
      } catch (err) {
        console.error('[initializeAuth] Exception during auth restoration:', err);
        if (isMounted) {
          setCurrentUser(null);
          setRole(null);
          setSession(null);
          setSupabaseUser(null);
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    }

    initializeAuth();

    // Listen for auth changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (event === 'SIGNED_OUT' || !newSession?.user) {
          setCurrentUser(null);
          setRole(null);
          setSession(null);
          setSupabaseUser(null);
          setAuthLoading(false);
          return;
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          setSession(newSession);
          setSupabaseUser(newSession.user);
          const { role: detectedRole, error: roleError } = await fetchUserRoleFromDatabase(newSession.user.id);

          if (detectedRole) {
            const profile = await buildUserProfile(newSession.user, detectedRole);
            setCurrentUser(profile);
            setRole(detectedRole);
            setAuthError(null);
          } else {
            setCurrentUser(null);
            setRole(null);
            setAuthError(roleError || 'No authorized role assigned to this account.');
          }
          setAuthLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Common Sign In for both Students and the Single Super Admin
   */
  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; role: UserRole | null; error: string | null }> => {
    setAuthError(null);
    const result = await loginWithEmailAndPassword(email, password);

    if (result.error || !result.user) {
      const errMsg = result.error || 'Failed to authenticate.';
      setAuthError(errMsg);
      return { success: false, role: null, error: errMsg };
    }

    if (!result.role) {
      const errMsg = result.error || 'Account role could not be verified in user_roles. Access denied.';
      setAuthError(errMsg);
      return { success: false, role: null, error: errMsg };
    }

    const profile = await buildUserProfile(result.user, result.role);
    setCurrentUser(profile);
    setRole(result.role);
    setSession(result.session);
    setSupabaseUser(result.user);
    setAuthError(null);

    return {
      success: true,
      role: result.role,
      error: null,
    };
  };

  /**
   * Public Student Registration (strictly assigns 'student' role)
   */
  const register = async (
    params: RegisterStudentParams
  ): Promise<{ success: boolean; error: string | null; needsEmailVerification?: boolean }> => {
    setAuthError(null);
    const result = await registerStudentAccount(params);

    if (result.error || !result.user) {
      const errMsg = result.error || 'Registration failed.';
      setAuthError(errMsg);
      return { success: false, error: errMsg };
    }

    if (result.needsEmailVerification) {
      return {
        success: true,
        error: null,
        needsEmailVerification: true,
      };
    }

    if (result.role) {
      const profile = await buildUserProfile(result.user, result.role);
      setCurrentUser(profile);
      setRole(result.role);
      setSession(result.session);
      setSupabaseUser(result.user);
    }

    return {
      success: true,
      error: null,
      needsEmailVerification: false,
    };
  };

  /**
   * Google OAuth
   */
  const loginWithGoogle = async (): Promise<{ error: string | null }> => {
    return await loginWithGoogleOAuth();
  };

  /**
   * Password Recovery
   */
  const sendPasswordReset = async (email: string): Promise<{ error: string | null }> => {
    return await sendPasswordResetEmail(email);
  };

  /**
   * Logout
   */
  const logout = async (): Promise<void> => {
    await logoutSession();
    setCurrentUser(null);
    setRole(null);
    setSession(null);
    setSupabaseUser(null);
    setAuthError(null);
    localStorage.removeItem('kerala_pyq_user');
  };

  // ── Sync bookmarks & state to localStorage ──────────────────────────────────
  useEffect(() => {
    localStorage.setItem('kerala_pyq_bookmarks_q', JSON.stringify(bookmarkedQuestionIds));
  }, [bookmarkedQuestionIds]);

  useEffect(() => {
    localStorage.setItem('kerala_pyq_bookmarks_p', JSON.stringify(bookmarkedPaperIds));
  }, [bookmarkedPaperIds]);

  useEffect(() => {
    localStorage.setItem('kerala_pyq_mistakes', JSON.stringify(mistakes));
  }, [mistakes]);

  useEffect(() => {
    localStorage.setItem('kerala_pyq_study_plan', JSON.stringify(studyPlan));
  }, [studyPlan]);

  useEffect(() => {
    localStorage.setItem('kerala_pyq_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // ── Bookmarks ─────────────────────────────────────────────────────────────
  const toggleBookmarkQuestion = useCallback(async (id: string) => {
    setBookmarkedQuestionIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      if (supabaseUser) {
        if (next.includes(id)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (supabase.from('bookmarks_questions') as any).upsert({
            user_id: supabaseUser.id,
            question_id: id,
          });
        } else {
          supabase.from('bookmarks_questions')
            .delete()
            .eq('user_id', supabaseUser.id)
            .eq('question_id', id);
        }
      }
      return next;
    });
  }, [supabaseUser]);

  const toggleBookmarkPaper = useCallback(async (id: string) => {
    setBookmarkedPaperIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      if (supabaseUser) {
        if (next.includes(id)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (supabase.from('bookmarks_papers') as any).upsert({
            user_id: supabaseUser.id,
            paper_id: id,
          });
        } else {
          supabase.from('bookmarks_papers')
            .delete()
            .eq('user_id', supabaseUser.id)
            .eq('paper_id', id);
        }
      }
      return next;
    });
  }, [supabaseUser]);

  // ── Mistakes ──────────────────────────────────────────────────────────────
  const recordMistake = (question: MCQQuestion, selectedWrong: 'A' | 'B' | 'C' | 'D') => {
    setMistakes((prev) => {
      const existing = prev.find((m) => m.question.id === question.id);
      if (existing) {
        return prev.map((m) =>
          m.question.id === question.id
            ? {
                ...m,
                wrongAttemptsCount: m.wrongAttemptsCount + 1,
                lastAttemptedDate: 'Just now',
                selectedWrongOption: selectedWrong,
                isCorrected: false,
              }
            : m
        );
      }
      return [
        {
          id: `mis-${Date.now()}`,
          question,
          wrongAttemptsCount: 1,
          lastAttemptedDate: 'Just now',
          selectedWrongOption: selectedWrong,
          isCorrected: false,
        },
        ...prev,
      ];
    });
  };

  const removeMistake = (questionId: string) => {
    setMistakes((prev) => prev.filter((m) => m.question.id !== questionId));
  };

  const markMistakeCorrected = (questionId: string) => {
    setMistakes((prev) =>
      prev.map((m) => (m.question.id === questionId ? { ...m, isCorrected: true } : m))
    );
  };

  // ── Study Plan ────────────────────────────────────────────────────────────
  const addStudyPlanItem = (item: Omit<StudyPlanItem, 'id'>) => {
    const newItem: StudyPlanItem = { ...item, id: `plan-${Date.now()}` };
    setStudyPlan((prev) => [newItem, ...prev]);
  };

  const toggleStudyPlanStatus = (id: string) => {
    setStudyPlan((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextStatus = item.status === 'completed' ? 'pending' : 'completed';
        return { ...item, status: nextStatus };
      })
    );
  };

  const deleteStudyPlanItem = (id: string) => {
    setStudyPlan((prev) => prev.filter((item) => item.id !== id));
  };

  // ── Notifications ─────────────────────────────────────────────────────────
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // ── Profile Updates ───────────────────────────────────────────────────────
  const updateTargetExams = (exams: string[]) => {
    if (currentUser) setCurrentUser({ ...currentUser, targetExams: exams });
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, ...updates });

    if (supabaseUser) {
      const profileUpdate: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (updates.name !== undefined) profileUpdate.name = updates.name;
      if (updates.preferredLanguage !== undefined) profileUpdate.preferred_language = updates.preferredLanguage;
      if (updates.targetExams !== undefined) profileUpdate.target_exams = updates.targetExams;
      if (updates.themePreference !== undefined) profileUpdate.theme_preference = updates.themePreference;
      if (updates.emailNotifications !== undefined) profileUpdate.email_notifications = updates.emailNotifications;
      if (updates.dailyReminder !== undefined) profileUpdate.daily_reminder = updates.dailyReminder;
      if (updates.avatarUrl !== undefined) profileUpdate.avatar_url = updates.avatarUrl;

      // Note: Students cannot update their own role via updateProfile
      await supabase.from('profiles').update(profileUpdate).eq('id', supabaseUser.id);
    }
  };

  const isAuthenticated = !!currentUser && !!session;
  const isSuperAdmin = role === 'super_admin';
  const isAdmin = isSuperAdmin;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        supabaseUser,
        session,
        role,
        isAuthenticated,
        isAdmin,
        isSuperAdmin,
        authLoading,
        authError,
        setAuthError,
        signIn,
        register,
        loginWithGoogle,
        sendPasswordReset,
        logout,
        bookmarkedQuestionIds,
        bookmarkedPaperIds,
        toggleBookmarkQuestion,
        toggleBookmarkPaper,
        mistakes,
        recordMistake,
        removeMistake,
        markMistakeCorrected,
        studyPlan,
        addStudyPlanItem,
        toggleStudyPlanStatus,
        deleteStudyPlanItem,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        updateTargetExams,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
