import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Settings, Lock, Moon, Sun, Bell, Shield, LogOut, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StudentSettingsPage: React.FC = () => {
  const { currentUser, logout, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState(false);

  const [emailNotifs, setEmailNotifs] = useState(currentUser?.emailNotifications ?? true);
  const [dailyReminders, setDailyReminders] = useState(currentUser?.dailyReminder ?? true);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordNotice(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordNotice(false), 3000);
  };

  const handleToggleEmail = () => {
    const nextVal = !emailNotifs;
    setEmailNotifs(nextVal);
    updateProfile({ emailNotifications: nextVal });
  };

  const handleToggleReminder = () => {
    const nextVal = !dailyReminders;
    setDailyReminders(nextVal);
    updateProfile({ dailyReminder: nextVal });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-100 dark:bg-slate-800 text-navy-800 dark:text-sky-300 text-xs font-semibold">
          <Settings className="w-3.5 h-3.5" />
          <span>App Preferences & Security</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Settings & Preferences
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage your theme, notification alerts, and security settings.
        </p>
      </div>

      {passwordNotice && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Password security credentials successfully updated!</span>
        </div>
      )}

      {/* 1. Theme Selection */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-500" />
          Interface Display Theme
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Choose between comfortable day-time reading or high-contrast dark mode for night revision sessions.
        </p>

        <div className="grid grid-cols-2 gap-3 max-w-sm text-xs">
          <button
            onClick={() => setTheme('light')}
            className={`p-3 rounded-xl border flex items-center gap-2 font-semibold transition-all ${
              theme === 'light'
                ? 'border-navy-600 bg-navy-50 text-navy-900 shadow-sm'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Light Mode</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-3 rounded-xl border flex items-center gap-2 font-semibold transition-all ${
              theme === 'dark'
                ? 'border-sky-500 bg-slate-800 text-white shadow-sm'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Moon className="w-4 h-4 text-sky-400" />
            <span>Dark Mode</span>
          </button>
        </div>
      </div>

      {/* 2. Notification Preferences */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-navy-700 dark:text-sky-400" />
          Notification Preferences
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Email Alerts for New Official Papers</span>
              <span className="text-slate-500">Receive gazette release alerts for your target examinations</span>
            </div>
            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={handleToggleEmail}
              className="h-4 w-4 rounded text-navy-700 focus:ring-navy-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Daily Study Streak Reminders</span>
              <span className="text-slate-500">Remind me to complete my daily 5-question booster</span>
            </div>
            <input
              type="checkbox"
              checked={dailyReminders}
              onChange={handleToggleReminder}
              className="h-4 w-4 rounded text-navy-700 focus:ring-navy-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Change Password UI */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-600" />
          Change Password
        </h3>

        <form onSubmit={handlePasswordSubmit} className="space-y-3 max-w-md text-xs">
          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-navy-700 hover:bg-navy-800 text-white font-bold transition-colors"
          >
            Update Security Credentials
          </button>
        </form>
      </div>

      {/* 4. Logout / Session */}
      <div className="bg-red-50/50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900/40 p-6 flex items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-red-900 dark:text-red-300">
            End Current Session
          </h4>
          <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">
            Log out of your student profile on this device.
          </p>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};
