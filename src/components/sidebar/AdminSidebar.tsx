import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';
import { ThemeToggle } from '../common/ThemeToggle';
import {
  LayoutDashboard,
  Layers,
  GraduationCap,
  ListTree,
  FileText,
  KeyRound,
  Database,
  Timer,
  Sparkles,
  DownloadCloud,
  Users,
  BarChart3,
  BellRing,
  ShieldAlert,
  Settings,
  LogOut,
  ExternalLink,
  Zap
} from 'lucide-react';

interface AdminSidebarProps {
  onItemClick?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onItemClick }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const adminNavItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'PDF Pipeline', path: '/admin/pipeline', icon: Zap, badge: 'Fast OCR' },
    { label: 'Exam Categories', path: '/admin/categories', icon: Layers },
    { label: 'Examinations', path: '/admin/exams', icon: GraduationCap },
    { label: 'Subjects & Topics', path: '/admin/subjects', icon: ListTree },
    { label: 'Previous Year Papers', path: '/admin/papers', icon: FileText },
    { label: 'Answer Keys', path: '/admin/answer-keys', icon: KeyRound },
    { label: 'Question Bank', path: '/admin/questions', icon: Database, badge: '9.8k' },
    { label: 'Mock Tests', path: '/admin/mock-tests', icon: Timer },
    { label: 'AI Explanations', path: '/admin/ai-content', icon: Sparkles, badge: 'Review' },
    { label: 'Paper Collection', path: '/admin/collection', icon: DownloadCloud },
    { label: 'Student Management', path: '/admin/users', icon: Users },
    { label: 'Reports & Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Notifications Hub', path: '/admin/notifications', icon: BellRing },
    { label: 'Roles & Permissions', path: '/admin/roles', icon: ShieldAlert },
    { label: 'Admin Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    if (onItemClick) onItemClick();
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col h-full select-none">
      {/* Brand & Admin Badge */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo size="sm" to="/admin" />
        </div>
        <ThemeToggle className="text-slate-400 hover:text-white hover:bg-slate-800" />
      </div>

      {/* Admin Identity Card */}
      <div className="p-3 mx-3 my-2 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-extrabold flex items-center justify-center text-xs">
          AD
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-bold text-white truncate">
              {currentUser?.name || 'Administrator'}
            </h4>
          </div>
          <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block">
            {currentUser?.role || 'Super Admin'}
          </span>
        </div>
      </div>

      {/* Admin Nav Items */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={onItemClick}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        isActive
                          ? 'bg-slate-950 text-amber-400'
                          : 'bg-slate-800 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Controls */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <NavLink
          to="/"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>View Public Website</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Admin Session</span>
        </button>
      </div>
    </aside>
  );
};
