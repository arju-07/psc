import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockQuestions, mockPapers } from '../../data/mockData';
import { PaperCard } from '../../components/cards/PaperCard';
import { PdfPreviewModal } from '../../components/paper/PdfPreviewModal';
import { PYQPaper, MCQQuestion } from '../../types';
import { Bookmark, FileText, BookOpenCheck, Trash2, Eye, Search, Layers, CheckCircle2 } from 'lucide-react';

export const StudentBookmarksPage: React.FC = () => {
  const { bookmarkedQuestionIds, bookmarkedPaperIds, toggleBookmarkQuestion, toggleBookmarkPaper } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'questions' | 'papers'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [previewPaper, setPreviewPaper] = useState<PYQPaper | null>(null);

  const savedQuestions = mockQuestions.filter((q) => bookmarkedQuestionIds.includes(q.id));
  const savedPapers = mockPapers.filter((p) => bookmarkedPaperIds.includes(p.id));

  const filteredQuestions = savedQuestions.filter((q) => {
    if (!searchFilter.trim()) return true;
    const term = searchFilter.toLowerCase();
    return q.questionText.toLowerCase().includes(term) || q.subject.toLowerCase().includes(term);
  });

  const filteredPapers = savedPapers.filter((p) => {
    if (!searchFilter.trim()) return true;
    const term = searchFilter.toLowerCase();
    return p.examName.toLowerCase().includes(term) || p.paperCode.toLowerCase().includes(term);
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-100 dark:bg-slate-800 text-navy-800 dark:text-sky-300 text-xs font-semibold">
          <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Personal Study Library</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Saved Questions & Papers
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Revisit questions and authentic papers you have bookmarked for rapid final-week revision.
        </p>
      </div>

      {/* Tabs and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'all'
                ? 'bg-navy-700 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Saved ({savedQuestions.length + savedPapers.length})
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'questions'
                ? 'bg-navy-700 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpenCheck className="w-3.5 h-3.5" />
            Questions ({savedQuestions.length})
          </button>
          <button
            onClick={() => setActiveTab('papers')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'papers'
                ? 'bg-navy-700 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Papers ({savedPapers.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter saved items..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
          />
        </div>
      </div>

      {/* Bookmarked Questions */}
      {(activeTab === 'all' || activeTab === 'questions') && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpenCheck className="w-4 h-4 text-emerald-600" />
            Bookmarked Questions ({filteredQuestions.length})
          </h3>

          {filteredQuestions.length > 0 ? (
            <div className="space-y-3">
              {filteredQuestions.map((q) => (
                <div
                  key={q.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-navy-700 dark:text-sky-400 uppercase tracking-wider">
                      {q.examName} &bull; {q.subject}
                    </span>
                    <button
                      onClick={() => toggleBookmarkQuestion(q.id)}
                      className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {q.questionText}
                  </h4>

                  <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-900 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                    <span className="font-bold block">
                      Correct: Option ({q.correctAnswer}) - {q.options.find(o => o.id === q.correctAnswer)?.text}
                    </span>
                    <p className="line-clamp-2 text-slate-600 dark:text-slate-300">
                      {q.explanation.correctReason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              No bookmarked questions found. Click the bookmark icon on any MCQ to save it here!
            </div>
          )}
        </div>
      )}

      {/* Bookmarked Papers */}
      {(activeTab === 'all' || activeTab === 'papers') && (
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-navy-600 dark:text-sky-400" />
            Bookmarked Question Papers ({filteredPapers.length})
          </h3>

          {filteredPapers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPapers.map((paper) => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  onPreview={(p) => setPreviewPaper(p)}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              No bookmarked question papers yet.
            </div>
          )}
        </div>
      )}

      {/* PDF Modal */}
      <PdfPreviewModal
        paper={previewPaper}
        isOpen={!!previewPaper}
        onClose={() => setPreviewPaper(null)}
      />
    </div>
  );
};
