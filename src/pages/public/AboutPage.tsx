import React from 'react';
import { ShieldCheck, BookOpenCheck, Target, Heart, CheckCircle2, Award, Users, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Page Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-100 dark:bg-slate-800 text-navy-800 dark:text-sky-300 text-xs font-semibold">
          <BookOpenCheck className="w-4 h-4 text-emerald-500" />
          <span>Independent Educational Technology Initiative</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About Kerala PYQ Hub
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          One Platform. Every Exam. Smarter Preparation.
        </p>
      </div>

      {/* Vision & Core Mission */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Our Vision
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Kerala PYQ Hub was founded to address a critical challenge faced by hundreds of thousands of aspirants preparing for Kerala Public Service Commission (KPSC) and national competitive tests: fragmented past question papers, unverified unofficial answer keys, and answer explanations that lack conceptual rigor.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            We provide a centralized, free digital sanctuary where every student can study previous years’ questions with verified official answers, in-depth rationale explaining both why the right option is correct and why other distractors are wrong, and targeted analytics that turn weak areas into strengths.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Verified Accuracy</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every question is strictly mapped to final published gazette answer keys after committee reviews.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-navy-100 dark:bg-slate-800 text-navy-800 dark:text-sky-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Conceptual Learning</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Instant explanations reveal the complete historical, scientific, or mathematical context behind answers.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Free for Everyone</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Initial Phase 1 is built as a public service resource accessible to all aspirants regardless of financial background.
            </p>
          </div>
        </div>
      </div>

      {/* Non-Governmental Disclaimer Box */}
      <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800 p-6 space-y-2 text-xs text-amber-900 dark:text-amber-200">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-800 dark:text-amber-300">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Official Disclaimer Regarding Government Affiliation</span>
        </div>
        <p className="leading-relaxed">
          Kerala PYQ Hub is an independent edtech learning platform and is <strong>not affiliated with, associated with, authorized by, endorsed by, or in any way officially connected with</strong> the Kerala Public Service Commission (KPSC), the Staff Selection Commission (SSC), the Railway Recruitment Board (RRB), the Institute of Banking Personnel Selection (IBPS), Pareeksha Bhavan Kerala, or any state or central government department.
        </p>
        <p className="leading-relaxed">
          Official recruitment notices, official gazettes, and final answer key releases should always be cross-referenced on the official portals: 
          <a href="https://keralapsc.gov.in" target="_blank" rel="noreferrer" className="underline ml-1 font-semibold text-amber-950 dark:text-white">keralapsc.gov.in</a>.
        </p>
      </div>

      {/* CTA Box */}
      <div className="text-center space-y-4 pt-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Start your structured preparation today
        </h3>
        <div className="flex justify-center gap-3">
          <Link
            to="/exams"
            className="px-6 py-3 rounded-xl bg-navy-700 hover:bg-navy-800 text-white text-xs font-bold transition-all shadow-md"
          >
            Explore Examinations
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
};
