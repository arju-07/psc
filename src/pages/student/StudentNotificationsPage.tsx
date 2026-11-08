import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NotificationItem } from '../../types';
import {
  Bell,
  CheckCircle2,
  FileText,
  Timer,
  Flame,
  AlertCircle,
  ExternalLink,
  CheckCheck,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentNotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAuth();
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = notifications.filter((n) => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !n.read;
    return n.type === filterType;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'paper':
        return <FileText className="w-4 h-4 text-navy-600 dark:text-sky-400" />;
      case 'mock':
        return <Timer className="w-4 h-4 text-amber-500" />;
      case 'challenge':
        return <Flame className="w-4 h-4 text-emerald-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-100 dark:bg-slate-800 text-navy-800 dark:text-sky-300 text-xs font-semibold">
            <Bell className="w-3.5 h-3.5" />
            <span>Updates & Exam Notifications</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Notifications Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time notifications regarding newly published papers, verified answer keys, and daily challenges.
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors shrink-0"
        >
          <CheckCheck className="w-4 h-4 text-emerald-600" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['all', 'unread', 'paper', 'mock', 'challenge', 'announcement'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-xl font-semibold capitalize shrink-0 transition-colors ${
              filterType === type
                ? 'bg-navy-700 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => markNotificationRead(item.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer ${
                item.read
                  ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 opacity-80'
                  : 'bg-emerald-50/30 dark:bg-slate-800/80 border-emerald-300 dark:border-slate-700 shadow-sm'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                {getIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 shrink-0">{item.date}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.message}
                </p>

                {item.link && (
                  <div className="pt-2">
                    <Link
                      to={item.link}
                      className="inline-flex items-center gap-1 text-xs font-bold text-navy-700 dark:text-sky-400 hover:underline"
                    >
                      <span>View details</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>

              {!item.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
              )}
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            No notifications found in this category.
          </div>
        )}
      </div>
    </div>
  );
};
