import React, { useState } from 'react';
import { Settings, Shield, Server, Database, HardDrive, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistrations, setAllowRegistrations] = useState(true);
  const [autoApproveOfficialKeys, setAutoApproveOfficialKeys] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleBackup = () => {
    showToast('Simulated complete database backup snapshot generated (84.2 MB).');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
          Infrastructure Configuration
        </span>
        <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
          System Administration Settings
        </h1>
        <p className="text-xs text-slate-400">
          Global platform toggles, crawler rate limits, database snapshots, and audit trail monitors.
        </p>
      </div>

      {toast && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Global Flags */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-amber-400" />
          Operational Controls
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div>
              <span className="font-bold text-white block">Platform Maintenance Mode</span>
              <span className="text-slate-400">Temporarily freeze student logins for database index upgrades</span>
            </div>
            <button
              onClick={() => {
                const next = !maintenanceMode;
                setMaintenanceMode(next);
                showToast(`Maintenance mode ${next ? 'activated' : 'deactivated'}.`);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                maintenanceMode
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {maintenanceMode ? 'Active (Locked)' : 'Off (Normal)'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div>
              <span className="font-bold text-white block">Public Student Registrations</span>
              <span className="text-slate-400">Permit new candidate account sign-ups</span>
            </div>
            <button
              onClick={() => {
                const next = !allowRegistrations;
                setAllowRegistrations(next);
                showToast(`Student registration ${next ? 'enabled' : 'restricted'}.`);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                allowRegistrations
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {allowRegistrations ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div>
              <span className="font-bold text-white block">Auto-publish Gazette Answer Keys</span>
              <span className="text-slate-400">Skip secondary moderator review for verified gazette documents</span>
            </div>
            <button
              onClick={() => {
                const next = !autoApproveOfficialKeys;
                setAutoApproveOfficialKeys(next);
                showToast(`Auto-approval ${next ? 'enabled' : 'disabled'}.`);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                autoApproveOfficialKeys
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {autoApproveOfficialKeys ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>

      {/* Storage & Database Backup */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          Repository Storage & Snapshots
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-800/60 rounded-xl">
            <span className="text-slate-400 block text-[11px]">Storage Allocated</span>
            <strong className="text-lg text-white">4.8 GB</strong>
            <span className="text-slate-500 block text-[10px]">PDF question booklet archive</span>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl">
            <span className="text-slate-400 block text-[11px]">Total Item Records</span>
            <strong className="text-lg text-amber-400">9,850 MCQs</strong>
            <span className="text-slate-500 block text-[10px]">Indexed with rationale</span>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl">
            <span className="text-slate-400 block text-[11px]">Last Backup Point</span>
            <strong className="text-lg text-emerald-400">06 Nov 2026</strong>
            <span className="text-slate-500 block text-[10px]">Encrypted off-site copy</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleBackup}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 transition-colors border border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Create Immediate Database Snapshot</span>
          </button>
        </div>
      </div>
    </div>
  );
};
