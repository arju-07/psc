import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  Award,
  BarChart3,
  Sparkles,
  AlertOctagon,
  Calendar,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentPerformancePage: React.FC = () => {
  const { currentUser } = useAuth();

  const metrics = {
    totalAttempted: 0,
    correct: 0,
    incorrect: 0,
    accuracy: 0,
    avgTimePerQuestionSec: 0,
    studyHoursThisMonth: 0,
  };

  const subjectBreakdown: Array<{ subject: string; attempted: number; correct: number; accuracy: number; status: 'strong' | 'needs_work' }> = [];

  const weeklyActivity = [
    { day: 'Mon', questions: 0, accuracy: 0 },
    { day: 'Tue', questions: 0, accuracy: 0 },
    { day: 'Wed', questions: 0, accuracy: 0 },
    { day: 'Thu', questions: 0, accuracy: 0 },
    { day: 'Fri', questions: 0, accuracy: 0 },
    { day: 'Sat', questions: 0, accuracy: 0 },
    { day: 'Sun', questions: 0, accuracy: 0 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-100 dark:bg-slate-800 text-navy-800 dark:text-sky-300 text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Objective Performance Diagnostics</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Performance Analytics
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Data-driven metrics covering your question accuracy, time management speed, and weak subject clusters for {currentUser?.name || 'your profile'}.
        </p>
      </div>

      {/* Overall Scorecard Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 block">Overall Accuracy</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {metrics.accuracy}%
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">State benchmark: 65%</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 block">Questions Solved</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {metrics.totalAttempted}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            0 Correct &bull; 0 Wrong
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 block">Avg Response Speed</span>
          <div className="text-2xl font-black text-navy-700 dark:text-sky-400 mt-1">
            {metrics.avgTimePerQuestionSec > 0 ? `${metrics.avgTimePerQuestionSec}s` : '--'}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Target: &lt; 45s per Q</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 block">Study Time Logged</span>
          <div className="text-2xl font-black text-amber-500 mt-1">
            {metrics.studyHoursThisMonth}h
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">This calendar month</span>
        </div>
      </div>

      {/* Empty State Banner for Fresh Account */}
      {metrics.totalAttempted === 0 && (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-navy-50 dark:bg-slate-800 text-navy-700 dark:text-sky-400 mx-auto flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Performance Data Recorded Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            As you solve practice questions, take daily challenges, and attempt mock tests, your diagnostic analytics, accuracy curves, and weak topic clusters will populate automatically.
          </p>
          <div className="pt-2">
            <Link
              to="/dashboard/practice"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-navy-700 hover:bg-navy-800 text-white text-xs font-bold transition-all shadow-md"
            >
              <BookOpen className="w-4 h-4" />
              <span>Start Practice Questions</span>
            </Link>
          </div>
        </div>
      )}

      {/* Weekly Activity Progress Bar Chart (Only when data exists) */}
      {metrics.totalAttempted > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-navy-600 dark:text-sky-400" />
              Weekly Solved Volume & Accuracy Trend
            </h3>
            <span className="text-xs text-slate-400">Past 7 Days</span>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end pt-6 h-48">
            {weeklyActivity.map((day) => {
              const heightPct = Math.round((day.questions / 35) * 100);
              return (
                <div key={day.day} className="flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {day.questions} Qs
                  </span>
                  <div
                    className="w-full max-w-[40px] bg-gradient-to-t from-navy-800 to-navy-600 dark:from-sky-600 dark:to-sky-400 rounded-t-xl transition-all duration-300 hover:brightness-110 relative group"
                    style={{ height: `${heightPct}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-950 text-white rounded text-[10px] whitespace-nowrap pointer-events-none z-10">
                      Accuracy: {day.accuracy}%
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{day.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subject Wise Performance Breakdown (Only when data exists) */}
      {subjectBreakdown.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-600" />
            Subject-wise Performance & Weak Area Isolation
          </h3>

          <div className="space-y-4">
            {subjectBreakdown.map((item) => (
              <div key={item.subject} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {item.subject}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">
                      {item.correct}/{item.attempted} Correct
                    </span>
                    <span
                      className={`font-black px-2 py-0.5 rounded ${
                        item.accuracy >= 80
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      }`}
                    >
                      {item.accuracy}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.accuracy >= 80 ? 'bg-emerald-500' : 'bg-red-500'}`}
                    style={{ width: `${item.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
