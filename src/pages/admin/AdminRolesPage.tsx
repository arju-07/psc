import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, AlertTriangle, KeyRound, Database, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminRolesPage: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
          System Access Control & Security
        </span>
        <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
          Single Administrator Architecture
        </h1>
        <p className="text-xs text-slate-400">
          Kerala PYQ Hub enforces a single-admin security policy. Exactly one Super Admin account exists in the system.
        </p>
      </div>

      {/* Active Super Admin Status Card */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Authorized Super Administrator</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                  Active Single Admin
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Authenticated Email: <strong className="text-slate-200">{currentUser?.email || 'Single Super Admin'}</strong>
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 sm:text-right">
            <span className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Database Role</span>
            <span className="font-mono text-amber-400 font-bold">public.user_roles.role = 'super_admin'</span>
          </div>
        </div>

        {/* Security Rules Enforced */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Database className="w-4 h-4" />
              <span>Database Level Constraint</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Enforced by PostgreSQL unique partial index <code className="text-slate-300">single_super_admin_unique_idx</code>. Any attempt to create a second admin is rejected by the database engine.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <UserCheck className="w-4 h-4" />
              <span>Public Registration Policy</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              All public sign-ups are automatically and irrevocably assigned the <code className="text-slate-300">student</code> role by database trigger. No public admin creation is permitted.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
              <Lock className="w-4 h-4" />
              <span>Row-Level Security (RLS)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Students cannot read, elevate, or modify roles in <code className="text-slate-300">user_roles</code>. Only this single authenticated Super Admin has full write access.
            </p>
          </div>
        </div>
      </div>

      {/* Super Admin Privileges Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-amber-400" />
          <span>Super Admin Capabilities</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            'Manage All Examination Catalogues',
            'Full 11-Step PDF Pipeline Access',
            'Final Question Approval & Publishing',
            'Publish Official Gazette Answer Keys',
            'Create & Configure Mock Tests',
            'AI Question Analysis & Explanation Generation',
            'Inspect Candidate Error Reports',
            'Live Kerala PSC Scraping & Collection',
            'Platform Analytics & System Health Audits'
          ].map((perm, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-center gap-2 text-xs text-slate-300"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{perm}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminRolesPage;
