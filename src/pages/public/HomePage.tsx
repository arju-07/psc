import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockCategories, mockExams, mockPapers } from '../../data/mockData';
import { ExamCard } from '../../components/cards/ExamCard';
import { CategoryCard } from '../../components/cards/CategoryCard';
import { PaperCard } from '../../components/cards/PaperCard';
import { PdfPreviewModal } from '../../components/paper/PdfPreviewModal';
import { PYQPaper } from '../../types';
import {
  Search,
  BookOpenCheck,
  FileText,
  Timer,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Layers,
  GraduationCap,
  Award,
  Compass,
  Zap,
  HelpCircle
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [previewPaper, setPreviewPaper] = useState<PYQPaper | null>(null);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/exams?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handlePreview = (paper: PYQPaper, showKey = false) => {
    setPreviewPaper(paper);
    setShowAnswerKey(showKey);
  };

  const popularExams = mockExams.filter((e) => e.isPopular);
  const recentPapers = mockPapers.slice(0, 4);

  const features = [
    {
      icon: FileText,
      title: 'Previous Year Papers',
      description: 'Organized archive of authentic question papers categorized by year, post code, and medium of instruction.',
    },
    {
      icon: BookOpenCheck,
      title: 'Topic-wise Practice',
      description: 'Break down complex syllabi into targeted practice sets with instant evaluation and question tracking.',
    },
    {
      icon: Timer,
      title: 'Realistic Mock Tests',
      description: 'Simulated examination environments with negative marking timers, question palettes, and percentile ranks.',
    },
    {
      icon: Zap,
      title: 'Instant Explanations',
      description: 'Every answer choice explained in depth: why the correct option is right, and why the other three are wrong.',
    },
    {
      icon: BrainCircuit,
      title: 'AI Assisted Learning',
      description: 'Interactive query resolution and conceptual summaries powered by curriculum-trained study models.',
    },
    {
      icon: TrendingUp,
      title: 'Mistake Notebook & Revision',
      description: 'Automated mistake logging isolates your recurring weak zones for deliberate revision before exam day.',
    },
  ];

  const faqs = [
    {
      q: 'Is Kerala PYQ Hub really free for all aspirants?',
      a: 'Yes. In Phase 1 and initial rollout, access to the entire previous-year question paper library, topic practice, and mock examinations is completely free for all students preparing for state and national examinations.',
    },
    {
      q: 'How are the answers and explanations verified?',
      a: 'Official question papers are mapped directly to final official answer keys published by the respective examination authorities (such as Kerala PSC and SSC). Detailed pedagogical explanations and high-yield facts are systematically reviewed by subject experts.',
    },
    {
      q: 'Does Learning Mode penalize for incorrect guesses?',
      a: 'No. In Learning Mode, the objective is conceptual clarity. As soon as you select an option, the system reveals the correct answer with complete rationale without requiring a submit button. If you pick a wrong option, it automatically adds that question to your Mistake Notebook for subsequent revision.',
    },
    {
      q: 'Can I download the question papers and answer keys as PDF?',
      a: 'Yes. Each paper in our library features direct PDF previewing and offline download options for both the question booklet and the official final answer key.',
    },
    {
      q: 'Which examinations are covered on Kerala PYQ Hub?',
      a: 'We cover Kerala PSC (LDC, Degree Prelims, Secretariat Assistant, LGS, Police SI, Fireman), Teaching examinations (KTET Cat 1–4, SET), Central recruitment (SSC CGL, CHSL, MTS, GD), Banking (IBPS PO, Clerk, SBI), Railway (RRB NTPC, Group D), and other state statutory board recruitment exams.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-navy-50/50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900/40 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-100/80 dark:bg-slate-800 text-navy-800 dark:text-sky-300 text-xs font-semibold tracking-wide border border-navy-200/50 dark:border-slate-700">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Kerala State & National Exam Preparation Platform</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                Prepare Smarter.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy-700 via-navy-800 to-emerald-600 dark:from-sky-400 dark:via-sky-200 dark:to-emerald-400">
                  Achieve More.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Your complete destination for previous-year papers, practice questions and competitive examination preparation.
              </p>

              {/* Examination Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="max-w-xl mx-auto lg:mx-0 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-300 dark:border-slate-700 shadow-lg shadow-navy-950/5 flex items-center gap-2"
              >
                <div className="pl-3 text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search exam e.g. 'Kerala PSC LDC', 'Degree Prelims', 'KTET'..."
                  className="w-full text-xs sm:text-sm bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-navy-700 hover:bg-navy-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shrink-0"
                >
                  Search
                </button>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/exams"
                  className="px-6 py-3.5 rounded-xl bg-navy-700 hover:bg-navy-800 text-white text-xs sm:text-sm font-semibold shadow-md shadow-navy-700/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <span>Explore Exams</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/dashboard/practice"
                  className="px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-all"
                >
                  Start Preparing Now
                </Link>
              </div>

              {/* Quality Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Official Question Papers
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Final Gazette Answer Keys
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  100% Free Initial Access
                </span>
              </div>
            </div>

            {/* Right Educational Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative background glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-navy-500/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-60"></div>

                {/* Simulated Interactive Preview Card */}
                <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[11px] font-bold text-navy-700 dark:text-sky-400 uppercase tracking-wider">
                      Instant Answer Demo
                    </span>
                  </div>

                  {/* Sample Question Preview */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Kerala PSC LDC 2024 &bull; Constitution
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      Who is known as the "Father of the Indian Constitution"?
                    </h4>
                  </div>

                  {/* Options Showcase */}
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                      <span>A. Mahatma Gandhi</span>
                      <span className="text-[10px] text-slate-400">Father of Nation</span>
                    </div>

                    <div className="p-2.5 rounded-lg border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>B. Dr. B. R. Ambedkar</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold">
                        Correct Answer
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 bg-slate-50 dark:bg-slate-800/40">
                      C. Jawaharlal Nehru
                    </div>
                  </div>

                  {/* Visual explanation snippet */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                    <strong className="text-emerald-700 dark:text-emerald-400 block font-semibold">
                      Official Key Verification:
                    </strong>
                    <p className="line-clamp-2">
                      Dr. Ambedkar presided as Drafting Committee Chairman from 29 August 1947 to adoption on 26 November 1949.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EXAMINATION CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-navy-700 dark:text-sky-400">
            Comprehensive Coverage
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Target Your Examination Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Select your syllabus category to browse past examination papers, syllabus breakdowns, and high-yield MCQ sets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {mockCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* 3. POPULAR EXAMINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              High Applicant Volumes
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Popular Examinations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              The most frequently practiced examination modules by candidates across Kerala.
            </p>
          </div>

          <Link
            to="/exams"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-700 dark:text-sky-400 hover:underline"
          >
            <span>View All Examinations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularExams.slice(0, 6).map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section className="bg-slate-100/70 dark:bg-slate-900/40 py-16 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-700 dark:text-sky-400">
              Built for Dedicated Aspirants
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              A Complete Preparation Ecosystem
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Everything required to transition from rote learning to conceptual mastery under real test conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-navy-100 dark:bg-slate-800 text-navy-800 dark:text-sky-300 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. RECENTLY ADDED PAPERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-700 dark:text-sky-400">
              Fresh Additions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Recently Uploaded Papers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Latest question papers with verified answer keys uploaded to the digital repository.
            </p>
          </div>

          <Link
            to="/papers"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-700 dark:text-sky-400 hover:underline"
          >
            <span>Browse Full Library</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentPapers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentPapers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} onPreview={handlePreview} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <FileText className="w-12 h-12 text-slate-400 mx-auto opacity-40" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Question Paper Repository Ready</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Authentic Kerala PSC and state examination previous-year question papers will appear here as they are published with verified answer keys.
            </p>
          </div>
        )}
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Simple 3-Step Methodology
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How Kerala PYQ Hub Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            A structured workflow designed to identify knowledge gaps and enforce retention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-navy-100 dark:bg-slate-800 text-navy-800 dark:text-sky-400 font-extrabold text-lg mx-auto flex items-center justify-center">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Discover & Download Papers
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Find original previous year papers filtered by syllabus, year, and medium. Review official PDF question booklets and confirmed answers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-extrabold text-lg mx-auto flex items-center justify-center">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Practice in Learning Mode
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Solve topic-wise MCQs with immediate feedback. Understand why the right option is correct and why other distractors are wrong.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-extrabold text-lg mx-auto flex items-center justify-center">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Revise Mistakes Automatically
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every incorrect answer is logged in your Mistake Notebook. Re-attempt weak areas until you reach 100% mastery before the real test.
            </p>
          </div>
        </div>
      </section>

      {/* 7. WHY CHOOSE KERALA PYQ HUB */}
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Ethical & Trustworthy Learning
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Why Aspirants Choose Kerala PYQ Hub
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Many online preparation portals fabricate answer keys, hide official papers behind paywalls, or fail to explain option rationale. Kerala PYQ Hub is built on three core pillars:
              </p>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Gazette Verified Answer Accuracy</h4>
                    <p className="text-slate-400 mt-0.5">
                      We never invent answers. All questions are checked against official published final keys settling candidate representations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Comprehensive Option Rationale</h4>
                    <p className="text-slate-400 mt-0.5">
                      Understanding why distractors are incorrect is what creates top-rank performers. Every question includes detailed distractor analysis.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Zero Paywalls for Core Preparation</h4>
                    <p className="text-slate-400 mt-0.5">
                      Free access to official question papers and baseline revision tools for every serious student across all 14 districts.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-3xl border border-slate-700/60 p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-bold text-white">
                Ready to elevate your preparation?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Create your student profile to bookmark question papers, practice interactive modules, track your weak subjects, and join the daily streak challenge.
              </p>

              <div className="space-y-3 pt-2">
                <Link
                  to="/register"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold text-center block transition-all shadow-md"
                >
                  Create Free Student Account
                </Link>
                <Link
                  to="/login"
                  className="w-full py-3 px-4 rounded-xl border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50 text-xs font-semibold text-center block transition-colors"
                >
                  Already have an account? Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-navy-700 dark:text-sky-400">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Clear facts regarding the platform, answer verification standards, and study features.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4"
                >
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      isOpen ? 'rotate-180 text-navy-600 dark:text-sky-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        paper={previewPaper}
        isOpen={!!previewPaper}
        onClose={() => setPreviewPaper(null)}
        showAnswerKeyInitial={showAnswerKey}
      />
    </div>
  );
};
