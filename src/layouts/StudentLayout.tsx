import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StudentSidebar } from '../components/sidebar/StudentSidebar';
import { Menu, X, Bell, Flame, Search } from 'lucide-react';

export const StudentLayout: React.FC = () => {
  const { currentUser, notifications } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0">
          <StudentSidebar />
        </div>

        {/* Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative z-10 w-64 bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col">
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <StudentSidebar onItemClick={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar for Student Area */}
          <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                aria-label="Open sidebar menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs w-64">
                <Search className="w-3.5 h-3.5" />
                <span>Quick search questions & exams...</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Daily Streak Indicator */}
              <Link
                to="/dashboard/daily-challenge"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs font-bold"
                title="Your Active Study Streak"
              >
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
                <span>7 Day Streak</span>
              </Link>

              {/* Notifications Link */}
              <Link
                to="/dashboard/notifications"
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                )}
              </Link>

              {/* Profile Link */}
              {currentUser && (
                <Link
                  to="/dashboard/profile"
                  className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800"
                >
                  <div className="w-8 h-8 rounded-full bg-navy-700 text-white font-bold flex items-center justify-center text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden md:block text-left">
                    <span className="block text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">{currentUser.role} Account</span>
                  </div>
                </Link>
              )}
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;
