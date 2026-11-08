import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';
import { ThemeToggle } from '../common/ThemeToggle';
import {
  LayoutDashboard,
  Compass,
  FileText,
  BookOpenCheck,
  Timer,
  Flame,
  AlertOctagon,
  Bookmark,
  Sparkles,
  CalendarCheck,
  TrendingUp,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface StudentSidebarProps {
  onItemClick?: () => void;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({ onItemClick }) => {
  const { currentUser, logout, notifications, mistakes, bookmarkedQuestionIds, bookmarkedPaperIds } = useAuth();
  const navigate = useNavigate();

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const totalBookmarks = bookmarkedQuestionIds.length + bookmarkedPaperIds.length;
  const uncorrectedMistakes = mistakes.filter((m) => !m.isCorrected).length;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, exact: true },
    { label: 'Explore Exams', path: '/dashboard/exams', icon: Compass },
    { label: 'Previous Papers', path: '/dashboard/papers', icon: FileText },
    { label: 'Practice Questions', path: '/dashboard/practice', icon: BookOpenCheck, badge: 'MCQ' },
    { label: 'Mock Tests', path: '/dashboard/mock-tests', icon: Timer },
    { label: 'Daily Challenge', path: '/dashboard/daily-challenge', icon: Flame, badge: 'Streak' },
    { label: 'Mistake Notebook', path: '/dashboard/mistakes', icon: AlertOctagon, count: uncorrectedMistakes, alert: true },
    { label: 'Bookmarks', path: '/dashboard/bookmarks', icon: Bookmark, count: totalBookmarks },
    { label: 'AI Study Assistant', path: '/dashboard/ai-assistant', icon: Sparkles, badge: 'AI' },
    { label: 'Study Planner', path: '/dashboard/planner', icon: CalendarCheck },
    { label: 'My Performance', path: '/dashboard/performance', icon: TrendingUp },
    { label: 'Notifications', path: '/dashboard/notifications', icon: Bell, count: unreadNotifs },
    { label: 'My Profile', path: '/dashboard/profile', icon: User },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    if (onItemClick) onItemClick();
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <Logo size="sm" to="/dashboard" />
        <ThemeToggle />
      </div>

      {/* User Mini Card */}
      {currentUser && (
        <div className="p-3 mx-3 my-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-navy-700 text-white font-bold flex items-center justify-center text-xs shadow-sm">
            {currentUser.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {currentUser.name}
            </h4>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium capitalize block truncate">
              Student Aspirant
            </span>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={onItemClick}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-navy-700 text-white shadow-sm shadow-navy-900/10 dark:bg-navy-700'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-300' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {item.badge}
                      </span>
                    )}
                    {typeof item.count === 'number' && item.count > 0 && (
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                          item.alert
                            ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                            : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </div>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout / Footer Action */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        </button>
      </div>
    </aside>
  );
};
