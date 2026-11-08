import React, { useState, useMemo } from 'react';
import { mockPapers, mockExams } from '../../data/mockData';
import { PaperCard } from '../../components/cards/PaperCard';
import { PdfPreviewModal } from '../../components/paper/PdfPreviewModal';
import { PYQPaper } from '../../types';
import {
  Search,
  Filter,
  FileText,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Globe,
  Layers,
  Download
} from 'lucide-react';

export const PaperLibraryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewPaper, setPreviewPaper] = useState<PYQPaper | null>(null);
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  const filteredPapers = useMemo(() => {
    return mockPapers.filter((paper) => {
      if (selectedYear !== 'all' && paper.year.toString() !== selectedYear) return false;
      if (selectedLanguage !== 'all' && paper.language !== selectedLanguage) return false;
      if (selectedCategory !== 'all' && paper.category !== selectedCategory) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesExam = paper.examName.toLowerCase().includes(q);
        const matchesCode = paper.paperCode.toLowerCase().includes(q);
        const matchesSub = paper.subject.toLowerCase().includes(q);
        return matchesExam || matchesCode || matchesSub;
      }
      return true;
    });
  }, [searchQuery, selectedYear, selectedLanguage, selectedCategory]);

  const handlePreview = (paper: PYQPaper, showKey = false) => {
    setPreviewPaper(paper);
    setShowAnswerKey(showKey);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedYear('all');
    setSelectedLanguage('all');
    setSelectedCategory('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-100 dark:bg-slate-800 text-navy-800 dark:text-sky-300 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5" />
          <span>Authentic Document Repository</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Previous-Year Paper Library
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Search and download original question papers and official final answer keys verified against the State Examination Authority bulletins.
        </p>
      </div>

      {/* Filter and Search Console */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        {/* Main Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by exam name (e.g., LDC, Degree Prelims), paper code (e.g., 042/2024-M) or subject..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-navy-500"
          />
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1 text-xs">
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
              Examination Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-navy-500 font-medium"
            >
              <option value="all">All Years (2022 - 2024)</option>
              <option value="2024">2024 (Latest)</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
              Medium / Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-navy-500 font-medium"
            >
              <option value="all">All Languages</option>
              <option value="Malayalam">Malayalam</option>
              <option value="English">English</option>
              <option value="Bilingual">Bilingual</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-navy-500 font-medium"
            >
              <option value="all">All Categories</option>
              <option value="Kerala PSC">Kerala PSC</option>
              <option value="Police & Uniformed Services">Police & Uniformed</option>
              <option value="Teaching Examinations">Teaching (KTET)</option>
              <option value="SSC">SSC</option>
              <option value="Banking">Banking</option>
              <option value="Railway (RRB)">Railway (RRB)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          Showing <strong>{filteredPapers.length}</strong> official question papers
        </span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>All papers indexed with verified answer keys</span>
        </div>
      </div>

      {/* Grid of Papers */}
      {filteredPapers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} onPreview={handlePreview} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No papers matched your filters
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your filters or search for another examination title or paper code.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-navy-700 text-white"
          >
            Clear All Filters
          </button>
        </div>
      )}

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
