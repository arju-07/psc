import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Flame,
  Target,
  Bookmark,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  Star,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';

export default function StudentDashboard({
  currentUser,
  onNavigateTab,
  onStartTest,
  onViewPaper
}) {
  const [stats, setStats] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [diagnostic, setDiagnostic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [currentUser]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const userId = currentUser?.id || 'usr-student-01';
      const [statsRes, attemptsRes, bmsRes, favsRes, diagRes] = await Promise.all([
        api.getStudentStats(userId),
        api.getStudentAttempts(userId),
        api.getBookmarks(userId),
        api.getFavorites(userId),
        api.getAIDiagnostic(userId)
      ]);
      setStats(statsRes);
      setAttempts(attemptsRes || []);
      setBookmarks(bmsRes || []);
      setFavorites(favsRes?.exams || []);
      setDiagnostic(diagRes);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Motivational Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-56 h-56 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Target: Kerala PSC Degree Level Preliminary 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            നമസ്കാരം, {currentUser?.name || 'Aspirant'}! 👋
          </h1>
          <p className="mt-2 text-emerald-100/90 text-sm sm:text-base leading-relaxed ml-text">
            "നിങ്ങളുടെ സ്വപ്ന ജോലിയിലേക്കുള്ള വഴി മുൻവർഷ ചോദ്യങ്ങളിലൂടെ" — Master historical Kerala PSC & national exam papers with authentic keys and AI performance diagnosis.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateTab('tests')}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center space-x-2 transition"
            >
              <FileText className="w-4 h-4" />
              <span>Take Real-Time Mock Test</span>
            </button>
            <button
              onClick={() => onNavigateTab('ai-analysis')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 flex items-center space-x-2 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Repeated Questions & Trends</span>
            </button>
            <button
              onClick={() => onNavigateTab('catalogue')}
              className="px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 font-semibold text-sm border border-emerald-700/50 flex items-center space-x-2 transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse 14 Exam Categories</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Study Streak
            </span>
            <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
              <Flame className="w-5 h-5 fill-current" />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats?.study_streak_days || 14} <span className="text-sm font-medium text-slate-500">Days</span>
          </p>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            Active daily practice streak
          </p>
        </div>

        {/* Tests Completed */}
        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tests Attempted
            </span>
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats?.total_tests_attempted || attempts.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Across Degree & 10th level papers
          </p>
        </div>

        {/* Accuracy */}
        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Accuracy Rate
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats?.accuracy_pct || (attempts.length ? attempts[0].accuracy_pct : 76.5)}%
          </p>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
            Top 15% state aspirant benchmark
          </p>
        </div>

        {/* Bookmarks Count */}
        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Bookmarks Saved
            </span>
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats?.bookmarks_count || bookmarks.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Questions saved for final revision
          </p>
        </div>
      </div>

      {/* Main 2-Column Split: AI Diagnostic + Saved Favourites */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* AI Performance Advice */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white text-base">
                  AI Personalized Study Insights
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time diagnosis based on historical question attempts
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('ai-analysis')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center"
            >
              <span>Full Analytics</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/40">
              <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-300 font-semibold text-xs uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4" />
                <span>Strong Areas (ഉയർന്ന പ്രകടനം)</span>
              </div>
              <ul className="mt-2.5 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {diagnostic?.strengths?.map((s, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span>{s.topic}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{s.accuracy}</span>
                  </li>
                )) || (
                  <>
                    <li className="flex justify-between"><span>Kerala Renaissance & History</span><span className="font-bold text-emerald-600">82%</span></li>
                    <li className="flex justify-between"><span>General English (Active/Passive)</span><span className="font-bold text-emerald-600">78%</span></li>
                  </>
                )}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-800/40">
              <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-300 font-semibold text-xs uppercase tracking-wide">
                <Target className="w-4 h-4" />
                <span>Priority Revision (ശ്രദ്ധിക്കേണ്ടവ)</span>
              </div>
              <ul className="mt-2.5 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {diagnostic?.weaknesses?.map((w, idx) => (
                  <li key={idx} className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span>{w.topic}</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400">{w.accuracy}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">{w.reason}</p>
                  </li>
                )) || (
                  <li className="flex justify-between"><span>Simple Arithmetic & Time/Distance</span><span className="font-bold text-rose-600">45%</span></li>
                )}
              </ul>
            </div>
          </div>

          {/* Action Recommendations */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
              <span>Recommended Next Steps:</span>
            </p>
            <div className="space-y-1">
              {(diagnostic?.ai_personalized_advice || [
                "Practice 20 questions from Simple Arithmetic (Train & Speed problems).",
                "Revise Articles 12 to 51A of Indian Constitution."
              ]).map((adv, idx) => (
                <p key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start space-x-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{adv}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Favourite Examinations */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                Favourite Exams
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('catalogue')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Add more
            </button>
          </div>

          <div className="space-y-2.5">
            {favorites.length > 0 ? (
              favorites.map((fav) => (
                <div
                  key={fav.id}
                  onClick={() => onNavigateTab('catalogue')}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 border border-slate-200 dark:border-slate-700 cursor-pointer transition flex items-center justify-between group"
                >
                  <div className="max-w-[80%]">
                    <p className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 transition">
                      {fav.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 ml-text truncate">
                      {fav.name_malayalam || fav.code}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition" />
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">
                No favourite examinations pinned yet. Click the star icon on any exam in the catalogue.
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onStartTest('paper-kpsc-degree-2023-st1')}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Quick Test: Degree Prelims 2023</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Attempts History Table */}
      <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="font-bold text-slate-900 dark:text-white text-base">
              Recent PYQ Mock Test Attempts
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('tests')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Attempt New Paper
          </button>
        </div>

        {attempts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-400 uppercase">
                  <th className="py-3 px-3">Examination & Paper</th>
                  <th className="py-3 px-3">Date Completed</th>
                  <th className="py-3 px-3">Score</th>
                  <th className="py-3 px-3">Accuracy</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {attempts.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900 dark:text-white">{att.exam_name || 'Kerala PSC'}</p>
                      <p className="text-slate-500">{att.paper_code} • {att.session_name}</p>
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {new Date(att.completed_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                        {att.score}
                      </span>
                      <span className="text-slate-400 text-[11px]"> / {att.max_score}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                        att.accuracy_pct >= 70
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}>
                        {att.accuracy_pct}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onStartTest(att.paper_id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-slate-700 dark:text-slate-200 hover:text-emerald-700 text-xs font-semibold transition"
                      >
                        Re-attempt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 space-y-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              You haven't attempted any mock tests yet.
            </p>
            <button
              onClick={() => onStartTest('paper-kpsc-degree-2023-st1')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow"
            >
              Start First Interactive PYQ Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
