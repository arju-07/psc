import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';
import { ShieldAlert, ArrowLeft, LogOut, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireAdmin = false,
}) => {
  const { currentUser, role, isAuthenticated, authLoading, logout } = useAuth();
  const location = useLocation();

  // 1. Loading state — Prevents brief flash of unauthorized content
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="space-y-4 max-w-sm">
          <div className="flex justify-center">
            <Logo size="lg" to="/" />
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className="w-5 h-5 border-2 border-navy-700 dark:border-sky-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Verifying credentials & permissions...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated state — Redirect to common login page
  if (!isAuthenticated || !currentUser) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace state={{ from: location }} />;
  }

  // 3. User authenticated but no valid role assigned in database
  if (!role || (role !== 'student' && role !== 'super_admin')) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800 rounded-3xl border border-slate-700 p-8 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-950/80 text-amber-400 border border-amber-800 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">No Authorized Role Assigned</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your account ({currentUser.email}) has been authenticated via Supabase, but no authorized role was found in the database.
          </p>
          <div className="pt-2">
            <button
              onClick={() => logout()}
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out to Common Login</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Admin route access guard — strictly check if role === 'super_admin'
  if (requireAdmin || (allowedRoles && allowedRoles.includes('super_admin') && !allowedRoles.includes('student'))) {
    if (role !== 'super_admin') {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 rounded-3xl border border-slate-800 p-8 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-950/80 text-red-400 border border-red-800 mx-auto flex items-center justify-center">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">Access Denied: Super Admin Only</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Administrative operations in Kerala PYQ Hub are strictly restricted to the single designated Super Administrator.
              Your current account role is <strong className="text-amber-400 uppercase">student</strong>.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-navy-700 hover:bg-navy-800 text-white text-xs font-semibold transition-all shadow-md"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Student Dashboard</span>
              </Link>
              <button
                onClick={() => logout()}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // 5. Student route guard — if super_admin accesses /dashboard, allow or redirect
  if (allowedRoles && allowedRoles.includes('student') && !allowedRoles.includes('super_admin')) {
    if (role === 'super_admin') {
      return <Navigate to="/admin" replace />;
    }
  }

  return <>{children}</>;
};
