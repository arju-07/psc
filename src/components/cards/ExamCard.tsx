import React from 'react';
import { Link } from 'react-router-dom';
import { Exam } from '../../types';
import { FileText, BookOpenCheck, ArrowRight, Star, Sparkles } from 'lucide-react';

interface ExamCardProps {
  exam: Exam;
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam }) => {
  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-navy-400 dark:hover:border-sky-500/50 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Category & Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-navy-50 text-navy-800 dark:bg-slate-800 dark:text-sky-300">
            {exam.category}
          </span>
          <div className="flex items-center gap-1.5">
            {exam.isPopular && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Popular
              </span>
            )}
            {exam.isRecentlyAdded && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                New
              </span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-navy-700 dark:group-hover:text-sky-400 transition-colors">
          {exam.name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {exam.shortDescription}
        </p>

        {/* Statistics Pills */}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-navy-600 dark:text-sky-400" />
            <span><strong>{exam.paperCount}</strong> Papers</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">&bull;</span>
          <div className="flex items-center gap-1.5">
            <BookOpenCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span><strong>{exam.practiceQuestionsCount.toLocaleString()}</strong> MCQs</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-5 pt-3">
        <Link
          to={`/exams/${exam.slug}`}
          className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:bg-navy-700 group-hover:text-white dark:group-hover:bg-sky-600 transition-all shadow-none group-hover:shadow-sm"
        >
          <span>View Examination Details</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};
