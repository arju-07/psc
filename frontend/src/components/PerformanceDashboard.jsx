import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Flame,
  Calendar,
  Layers,
  ChevronRight,
  BookOpen,
  Target
} from 'lucide-react';
import { api } from '../services/api';

export default function PerformanceDashboard({ currentUser, onNavigateTab }) {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.id) {
      loadPerformance();
    }
  }, [currentUser]);

  const loadPerformance = async () => {
    try {
      setLoading(true);
      const data = await api.getStudentPerformance(currentUser.id);
      setPerformance(data || {});
    } catch (e) {
      console.error('Failed to load performance:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading student analytics...</div>;
  }

  const {
    total_tests = 0,
    total_questions_attempted = 0,
    total_correct = 0,
    overall_accuracy_pct = 0,
    subject_performance = [],
    topic_performance = [],
    weak_subjects = [],
    strong_subjects = [],
    mock_test_history = [],
    daily_streak = 0,
    daily_challenges_completed = 0
  } = performance || {};

  const totalIncorrect = total_questions_attempted - total_correct;

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>Comprehensive Analytics • പഠന പുരോഗതി</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Student Performance Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 ml-text">
              {currentUser?.name} – നിങ്ങളുടെ കൃത്യതയും ബലഹീനമായ വിഷയങ്ങളും കണ്ടെത്തുക.
            </p>
          </div>

          {/* Daily Streak Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center space-x-4 self-start md:self-auto shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Flame className="w-7 h-7 fill-current" />
            </div>
            <div>
              <span className="text-[11px] text-emerald-200 block font-semibold uppercase tracking-wider">
                Study Streak
              </span>
              <span className="text-2xl font-black text-white">
                {daily_streak} <span className="text-xs font-normal text-emerald-200">Days</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Questions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Questions Attempted
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {total_questions_attempted}
            </span>
            <span className="text-xs text-slate-500 font-medium">in {total_tests} tests</span>
          </div>
        </div>

        {/* Overall Accuracy */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Overall Accuracy
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {overall_accuracy_pct}%
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {overall_accuracy_pct >= 70 ? 'High' : overall_accuracy_pct >= 50 ? 'Moderate' : 'Needs Work'}
            </span>
          </div>
        </div>

        {/* Correct Answers */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Correct Answers
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-emerald-600">
              {total_correct}
            </span>
            <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-0.5 inline" /> Correct
            </span>
          </div>
        </div>

        {/* Incorrect / Negative impact */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Incorrect Answers
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-red-500">
              {totalIncorrect}
            </span>
            <span className="text-xs text-red-500 font-medium flex items-center">
              <XCircle className="w-3.5 h-3.5 mr-0.5 inline" /> Negative hits
            </span>
          </div>
        </div>
      </div>

      {/* Accuracy Visual Breakdown & Weak Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Accuracy Progress Circle (Pure SVG) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">
            Accuracy Metric Ring
          </h3>

          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background Ring */}
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Progress Ring */}
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-emerald-500 transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * (overall_accuracy_pct || 0)) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {overall_accuracy_pct}%
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Accuracy
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold">Correct Hits</span>
              <span className="text-sm font-bold text-emerald-600">{total_correct}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Wrong Hits</span>
              <span className="text-sm font-bold text-red-500">{totalIncorrect}</span>
            </div>
          </div>
        </div>

        {/* Weak Areas Alert Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">
              Focus Areas • കൂടുതൽ ശ്രദ്ധിക്കേണ്ട വിഷയങ്ങൾ
            </h3>
          </div>

          {weak_subjects.length === 0 ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200">
              <p className="font-bold">Great job! No weak subject areas detected.</p>
              <p className="mt-0.5">Maintain consistent daily practice across all subjects.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                The following subjects show lower than 50% accuracy. Prioritize practicing their PYQs:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {weak_subjects.map((ws) => (
                  <div
                    key={ws.subject_id}
                    className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-red-950 dark:text-red-200">{ws.name}</h4>
                      <p className="text-[11px] text-red-700 dark:text-red-400 font-semibold mt-0.5">
                        {ws.accuracy_pct}% Accuracy ({ws.correct}/{ws.attempted} correct)
                      </p>
                    </div>
                    <button
                      onClick={() => onNavigateTab && onNavigateTab('practice')}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold shrink-0 transition"
                    >
                      Practise Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strong Subjects Banner */}
          {strong_subjects.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Strong Foundation Areas (70%+ Accuracy)
              </span>
              <div className="flex flex-wrap gap-2">
                {strong_subjects.map((ss) => (
                  <span
                    key={ss.subject_id}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{ss.name} ({ss.accuracy_pct}%)</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subject-Wise Accuracy Bar Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          Subject-Wise Accuracy Breakdown • വിഷയ തിരിച്ചുള്ള വിശകലനം
        </h3>

        {subject_performance.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No subject-wise attempt data recorded yet. Attempt topic-wise questions or mock tests.
          </p>
        ) : (
          <div className="space-y-4 pt-2">
            {subject_performance.map((sp) => (
              <div key={sp.subject_id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{sp.name}</span>
                  <div className="space-x-2">
                    <span className="text-slate-400">({sp.correct}/{sp.attempted} Qs)</span>
                    <span className={`font-bold ${
                      sp.accuracy_pct >= 70 ? 'text-emerald-600' : sp.accuracy_pct >= 50 ? 'text-amber-500' : 'text-red-500'
                    }`}>
                      {sp.accuracy_pct}%
                    </span>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      sp.accuracy_pct >= 70
                        ? 'bg-emerald-500'
                        : sp.accuracy_pct >= 50
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.max(4, sp.accuracy_pct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Topic-Wise Breakdown Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          Topic-Wise Detailed Mastery • ഉപവിഷയ വിശകലനം
        </h3>

        {topic_performance.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No topic practice data yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3 rounded-l-xl">Topic</th>
                  <th className="p-3">Attempted</th>
                  <th className="p-3">Correct</th>
                  <th className="p-3">Accuracy</th>
                  <th className="p-3 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {topic_performance.map((tp) => (
                  <tr key={tp.topic_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                      {tp.name}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{tp.attempted}</td>
                    <td className="p-3 text-emerald-600 font-semibold">{tp.correct}</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                      {tp.accuracy_pct}%
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tp.status === 'strong'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                          : tp.status === 'average'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200'
                      }`}>
                        {tp.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
