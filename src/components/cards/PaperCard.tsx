import React from 'react';
import { PYQPaper } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Bookmark,
  KeyRound,
  Calendar,
  Layers,
  Globe
} from 'lucide-react';

interface PaperCardProps {
  paper: PYQPaper;
  onPreview: (paper: PYQPaper, showKey?: boolean) => void;
}

export const PaperCard: React.FC<PaperCardProps> = ({ paper, onPreview }) => {
  const { bookmarkedPaperIds, toggleBookmarkPaper } = useAuth();
  const isBookmarked = bookmarkedPaperIds.includes(paper.id);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:border-navy-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
      <div>
        {/* Top badges & bookmark */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-navy-100 text-navy-800 dark:bg-slate-800 dark:text-sky-300">
              {paper.year}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Code: {paper.paperCode}
            </span>
            {paper.verificationStatus === 'verified' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400">
                <Clock className="w-3 h-3" /> Under Review
              </span>
            )}
          </div>

          <button
            onClick={() => toggleBookmarkPaper(paper.id)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isBookmarked
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-600'
                : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            title="Bookmark Paper"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>
        </div>

        {/* Paper Title */}
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1">
          {paper.examName}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
          {paper.subject}
        </p>

        {/* Attributes Meta */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{paper.language}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{paper.category}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{paper.durationMinutes} Mins &bull; {paper.totalMarks} M</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{paper.fileSize}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => onPreview(paper, false)}
          className="flex-1 py-2 px-3 rounded-xl bg-navy-50 hover:bg-navy-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-navy-800 dark:text-sky-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview PDF</span>
        </button>

        {paper.hasOfficialAnswerKey && (
          <button
            onClick={() => onPreview(paper, true)}
            className="py-2 px-3 rounded-xl border border-emerald-300 dark:border-emerald-800/70 bg-emerald-50/70 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            title="View Final Verified Answer Key"
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Answer Key</span>
          </button>
        )}

        <button
          onClick={() => onPreview(paper, false)}
          className="p-2 rounded-xl bg-navy-700 hover:bg-navy-800 text-white transition-colors"
          title="Download Document"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
