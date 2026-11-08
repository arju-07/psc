import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockExams } from '../../data/mockData';
import { PaperCard } from '../../components/cards/PaperCard';
import { PdfPreviewModal } from '../../components/paper/PdfPreviewModal';
import { PYQPaper } from '../../types';
import {
  Flame,
  BookOpenCheck,
  FileText,
  Timer,
  AlertOctagon,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Target,
  Award,
  Calendar,
  Layers
} from 'lucide-react';

export const StudentDashboardPage: React.FC = () => {
  const { currentUser, mistakes, bookmarkedQuestionIds, bookmarkedPaperIds } = useAuth();
  const [previewPaper, setPreviewPaper] = useState<PYQPaper | null>(null);

  const targetExams = mockExams.filter((e) =>
    currentUser?.targetExams.includes(e.slug)
  );
  const activeExams = targetExams;

  const uncorrectedMistakes = mistakes.filter((m) => !m.isCorrected);

  return (
    <div className="space-y-8">
      {/* 1. Welcome Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-navy-800 via-navy-900 to-slate-900 rounded-3xl text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-700/80 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Target: Kerala State Civil & Government Services</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Welcome to Kerala PYQ Hub. Begin your exam preparation with authentic previous-year question papers, verified answer keys, and topic-wise practice.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/dashboard/daily-challenge"
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/20 transition-all hover:scale-105"
            >
              <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>Solve Daily Challenge</span>
            </Link>
            <Link
              to="/dashboard/practice"
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              Quick Practice
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Quick Access KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/dashboard/daily-challenge"
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Daily Streak</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            0 Days
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            Start today's session
          </span>
        </Link>

        <Link
          to="/dashboard/performance"
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">MCQ Accuracy</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            0%
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            0 attempted
          </span>
        </Link>

        <Link
          to="/dashboard/mistakes"
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-red-400 transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Mistake Notebook</span>
            <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {uncorrectedMistakes.length} Questions
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            {uncorrectedMistakes.length > 0 ? 'Requires revision' : 'Zero mistakes logged'}
          </span>
        </Link>

        <Link
          to="/dashboard/bookmarks"
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-navy-400 transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Saved Items</span>
            <div className="p-2 rounded-xl bg-navy-50 dark:bg-slate-800 text-navy-700 dark:text-sky-400">
              <BookOpenCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {bookmarkedQuestionIds.length + bookmarkedPaperIds.length}
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            {bookmarkedPaperIds.length} papers &bull; {bookmarkedQuestionIds.length} MCQs
          </span>
        </Link>
      </div>

      {/* 3. Target Examinations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-navy-700 dark:text-sky-400" />
              Your Selected Target Examinations
            </h2>
            <p className="text-xs text-slate-500">
              Prioritizing study syllabus and question sets for your registered goals.
            </p>
          </div>
          <Link
            to="/dashboard/profile"
            className="text-xs font-semibold text-navy-700 dark:text-sky-400 hover:underline"
          >
            Manage Targets &rarr;
          </Link>
        </div>

        {activeExams.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8 text-center space-y-3">
            <Target className="w-8 h-8 text-navy-700 dark:text-sky-400 mx-auto opacity-40" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Target Examinations Selected</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Choose Kerala PSC LDC, Degree Prelims, Police SI, or other examinations to tailor your daily study feed.
            </p>
            <Link
              to="/dashboard/profile"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-700 hover:bg-navy-800 text-white text-xs font-bold transition-colors"
            >
              <span>Choose Target Exams</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-navy-100 text-navy-800 dark:bg-slate-800 dark:text-sky-300">
                      {exam.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      {exam.paperCount} Available Papers
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {exam.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {exam.shortDescription}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <Link
                    to={`/exams/${exam.slug}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition-colors"
                  >
                    View Syllabus & Papers
                  </Link>
                  <Link
                    to="/dashboard/practice"
                    className="px-3.5 py-2 rounded-xl bg-navy-700 hover:bg-navy-800 text-white text-xs font-bold transition-colors"
                  >
                    Practice Questions
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Continue Learning & Practice Highlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Interactive Practice Shortcut */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <BookOpenCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Topic-wise Practice
                </h3>
                <span className="text-[11px] text-slate-400">
                  Adaptive learning with instant answers
                </span>
              </div>
            </div>

            <Link
              to="/dashboard/practice"
              className="text-xs font-bold text-navy-700 dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>Full Practice Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-center space-y-2">
            <BookOpenCheck className="w-8 h-8 text-emerald-500 mx-auto opacity-50" />
            <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
              Start Your Practice Session
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Master Indian Polity, Kerala Renaissance, Arithmetic, and Science with comprehensive option rationale.
            </p>
            <div className="pt-2">
              <Link
                to="/dashboard/practice"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-block transition-colors"
              >
                Launch Practice Mode
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Upcoming Mock Tests */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-amber-500" />
              Upcoming Mock Tests
            </h3>
            <Link
              to="/dashboard/mock-tests"
              className="text-xs font-semibold text-navy-700 dark:text-sky-400 hover:underline"
            >
              All Tests &rarr;
            </Link>
          </div>

          <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
            <Timer className="w-6 h-6 text-amber-500 mx-auto opacity-40" />
            <p className="font-semibold text-slate-300">No scheduled mock tests</p>
            <p className="text-[11px]">Simulated mock examinations will be announced here.</p>
          </div>
        </div>
      </div>

      {/* 5. Saved Papers Quick Shelf */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-navy-700 dark:text-sky-400" />
              Recent Question Papers
            </h2>
            <p className="text-xs text-slate-500">
              Explore freshly published gazette question papers and verified keys.
            </p>
          </div>
          <Link
            to="/dashboard/papers"
            className="text-xs font-semibold text-navy-700 dark:text-sky-400 hover:underline"
          >
            Open Full Library &rarr;
          </Link>
        </div>

        <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <FileText className="w-8 h-8 text-slate-400 mx-auto opacity-30" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">No question papers published yet</p>
          <p className="text-[11px]">Official previous-year question papers will appear here once verified by administrators.</p>
        </div>
      </div>

      {/* PDF Modal */}
      <PdfPreviewModal
        paper={previewPaper}
        isOpen={!!previewPaper}
        onClose={() => setPreviewPaper(null)}
      />
    </div>
  );
};
