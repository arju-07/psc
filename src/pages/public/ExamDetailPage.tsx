import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockExams, mockPapers, mockQuestions } from '../../data/mockData';
import { PaperCard } from '../../components/cards/PaperCard';
import { PdfPreviewModal } from '../../components/paper/PdfPreviewModal';
import { InteractiveMCQPlayer } from '../../components/mcq/InteractiveMCQPlayer';
import { PYQPaper } from '../../types';
import {
  GraduationCap,
  FileText,
  BookOpenCheck,
  Calendar,
  ExternalLink,
  CheckCircle2,
  ListOrdered,
  Layers,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const ExamDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'papers' | 'practice' | 'subjects'>('overview');
  const [previewPaper, setPreviewPaper] = useState<PYQPaper | null>(null);
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  const exam = mockExams.find((e) => e.slug === slug) || mockExams[0];
  const examPapers = mockPapers.filter((p) => p.examSlug === exam.slug || p.examId === exam.id);
  const examQuestions = mockQuestions.filter((q) => q.examSlug === exam.slug);

  const handlePreview = (paper: PYQPaper, showKey = false) => {
    setPreviewPaper(paper);
    setShowAnswerKey(showKey);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link to="/exams" className="hover:text-slate-800 dark:hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> All Examinations
        </Link>
        <span>/</span>
        <span className="text-slate-700 dark:text-slate-300 font-semibold">{exam.category}</span>
        <span>/</span>
        <span className="text-navy-700 dark:text-sky-400 font-bold truncate">{exam.name}</span>
      </div>

      {/* Hero Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-navy-100 text-navy-800 dark:bg-slate-800 dark:text-sky-300">
                {exam.category}
              </span>
              {exam.isPopular && (
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Popular Recruitment
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {exam.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {exam.shortDescription}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('practice')}
              className="px-5 py-3 rounded-xl bg-navy-700 hover:bg-navy-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all"
            >
              <BookOpenCheck className="w-4 h-4" />
              <span>Practice MCQs</span>
            </button>
            <button
              onClick={() => setActiveTab('papers')}
              className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-colors"
            >
              Browse PYQs
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block">Available Papers</span>
            <strong className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
              <FileText className="w-4 h-4 text-navy-600 dark:text-sky-400" />
              {exam.paperCount} Official Papers
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block">Practice Questions</span>
            <strong className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
              <BookOpenCheck className="w-4 h-4 text-emerald-600" />
              {exam.practiceQuestionsCount.toLocaleString()}+ MCQs
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block">Subjects Covered</span>
            <strong className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
              <Layers className="w-4 h-4 text-amber-500" />
              {exam.subjects.length} Core Modules
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block">Official Authority Link</span>
            {exam.officialWebsiteUrl ? (
              <a
                href={exam.officialWebsiteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-navy-700 dark:text-sky-400 flex items-center gap-1 mt-1 hover:underline"
              >
                <span>Visit Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span className="text-xs text-slate-500 mt-1 block">Government Gazette</span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors shrink-0 ${
            activeTab === 'overview'
              ? 'border-navy-700 text-navy-800 dark:border-sky-400 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          Overview & Syllabus
        </button>
        <button
          onClick={() => setActiveTab('papers')}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors shrink-0 flex items-center gap-1.5 ${
            activeTab === 'papers'
              ? 'border-navy-700 text-navy-800 dark:border-sky-400 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          Previous Papers ({examPapers.length})
        </button>
        <button
          onClick={() => setActiveTab('practice')}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors shrink-0 flex items-center gap-1.5 ${
            activeTab === 'practice'
              ? 'border-navy-700 text-navy-800 dark:border-sky-400 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          Practice Mode ({examQuestions.length || 8})
        </button>
        <button
          onClick={() => setActiveTab('subjects')}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors shrink-0 ${
            activeTab === 'subjects'
              ? 'border-navy-700 text-navy-800 dark:border-sky-400 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          Subjects & Topics ({exam.subjects.length})
        </button>
      </div>

      {/* Tab Content 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Examination Overview
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {exam.overview}
              </p>
            </div>

            {/* Pattern & Eligibility */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-navy-700 dark:text-sky-400">
                  Eligibility Criteria
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {exam.eligibility}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Examination Pattern
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {exam.examPattern}
                </p>
              </div>
            </div>

            {/* Important Topics */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Frequently Tested High-Yield Topics
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {exam.importantTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Widget */}
          <div className="space-y-6">
            <div className="bg-navy-900 text-white rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-bold">Preparation Strategy</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Prioritize practicing previous 5-year question papers first. Over 60% of factual questions in Kerala PSC follow established syllabus patterns.
              </p>
              <button
                onClick={() => setActiveTab('practice')}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
              >
                Begin Learning Session
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Subjects in this Syllabus
              </h4>
              <div className="space-y-2">
                {exam.subjects.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-200">{sub.name}</span>
                    <span className="font-bold text-navy-700 dark:text-sky-400">{sub.totalQuestions} Qs</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: PREVIOUS PAPERS */}
      {activeTab === 'papers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Official Previous Year Question Papers ({examPapers.length || 'Archive'})
            </h3>
            <span className="text-xs text-slate-500">Official Gazetted PDF Booklets</span>
          </div>

          {examPapers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {examPapers.map((paper) => (
                <PaperCard key={paper.id} paper={paper} onPreview={handlePreview} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <FileText className="w-10 h-10 text-slate-400 mx-auto opacity-30" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Question Papers Uploaded Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Official question booklets and final answer keys for {exam.name} will appear here once verified.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: PRACTICE */}
      {activeTab === 'practice' && (
        <div className="space-y-6">
          {examQuestions.length > 0 ? (
            <InteractiveMCQPlayer
              questions={examQuestions}
              title={`${exam.name} - Topic Practice Set`}
            />
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-slate-400 mx-auto opacity-30" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Practice Question Bank Empty</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Questions extracted and verified from {exam.name} question papers will become available for interactive practice here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 4: SUBJECTS */}
      {activeTab === 'subjects' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exam.subjects.map((subject) => (
              <div
                key={subject.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {subject.name}
                  </h4>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-navy-100 text-navy-800 dark:bg-slate-800 dark:text-sky-300">
                    {subject.totalQuestions} Questions Weight
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Important Sub-topics
                  </span>
                  <div className="space-y-1.5">
                    {subject.topics.map((t) => (
                      <div
                        key={t.id}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                      >
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{t.name}</span>
                        <span className="text-slate-400">~{t.questionCount} Qs</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PDF Modal */}
      <PdfPreviewModal
        paper={previewPaper}
        isOpen={!!previewPaper}
        onClose={() => setPreviewPaper(null)}
        showAnswerKeyInitial={showAnswerKey}
      />
    </div>
  );
};
