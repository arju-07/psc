import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Star,
  GraduationCap,
  Calendar,
  Clock,
  Layers,
  Key,
  X
} from 'lucide-react';
import { api } from '../services/api';

export default function ExamCatalogue({
  categories,
  currentUser,
  searchQuery,
  setSearchQuery,
  onStartTest,
  onOpenPdf,
  onOpenAnswerKey
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [papers, setPapers] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPapers();
  }, [selectedCategory, selectedLanguage, selectedYear, searchQuery]);

  useEffect(() => {
    if (currentUser?.id) {
      loadFavorites();
    }
  }, [currentUser]);

  const loadPapers = async () => {
    setLoading(true);
    try {
      const params = {
        verified_only: false // allow viewing all approved + benchmark papers
      };
      if (selectedCategory !== 'ALL') params.category_id = selectedCategory;
      if (selectedLanguage !== 'ALL') params.language = selectedLanguage;
      if (selectedYear !== 'ALL') params.year = selectedYear;
      if (searchQuery) params.search = searchQuery;

      const res = await api.getPapers(params);
      setPapers(res || []);
    } catch (err) {
      console.error('Failed to load papers:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const res = await api.getFavorites(currentUser.id);
      setFavorites(res.favorite_ids || []);
    } catch (err) {
      console.error('Failed to load favorites:', err);
    }
  };

  const toggleFavorite = async (examId) => {
    try {
      const res = await api.toggleFavorite(currentUser?.id || 'usr-student-01', examId);
      setFavorites(res.favorites || []);
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Previous Year Question Paper Catalogue
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 ml-text">
            കേരള പി.എസ്.സി, കെ.എ.എസ്, പോലീസ്, നീറ്റ്, ബാങ്ക്, എസ്.എസ്.സി പരീക്ഷകളുടെ മുൻവർഷ ചോദ്യക്കടലാസുകൾ
          </p>
        </div>

        {/* Results counter badge */}
        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 self-start md:self-auto">
          <span>{papers.length} Papers Available</span>
        </div>
      </div>

      {/* 14 Categories Horizontal Filter Scroll */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Browse by Examination Category ({categories.length} Categories)
        </p>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
              selectedCategory === 'ALL'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span>{cat.name}</span>
                {cat.paper_count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}>
                    {cat.paper_count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Bar: Search, Language, Year */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by exam name, paper code (e.g. 042/2023), year..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Language Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-medium">Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Languages</option>
            <option value="Malayalam">Malayalam Only (മലയാളം)</option>
            <option value="English">English Only</option>
          </select>
        </div>

        {/* Year Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-medium">Year:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Years</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </select>
        </div>
      </div>

      {/* Question Papers Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Loading authentic question papers...</p>
        </div>
      ) : papers.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="mt-4 font-bold text-slate-800 dark:text-white text-base">No Question Papers Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, selecting "All Categories", or removing language filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSelectedLanguage('ALL');
              setSelectedYear('ALL');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {papers.map((paper) => {
            const isFav = favorites.includes(paper.exam_id);
            return (
              <div
                key={paper.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Paper Code & Favorite Pin */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                        {paper.paper_code}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
                        {paper.year}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleFavorite(paper.exam_id)}
                      className={`p-1.5 rounded-lg transition ${
                        isFav ? 'text-amber-500 hover:text-amber-600' : 'text-slate-300 dark:text-slate-600 hover:text-slate-500'
                      }`}
                      title={isFav ? "Saved in favourites" : "Pin to favourites"}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber-500' : ''}`} />
                    </button>
                  </div>

                  {/* Title & Session */}
                  <h3 className="mt-3 font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                    {paper.exam_name || 'Kerala Competitive Examination'}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {paper.session_name}
                  </p>

                  {/* Badges: Language, Questions, Duration */}
                  <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 flex items-center">
                      🌐 {paper.language}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-slate-400" />
                      {paper.duration_minutes}m
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300">
                      {paper.total_questions} Questions
                    </span>
                  </div>

                  {/* Transparency Notice & Verification Status */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    {paper.is_verified ? (
                      <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Verified Official Paper
                      </span>
                    ) : paper.is_sample ? (
                      <span className="inline-flex items-center text-amber-600 dark:text-amber-400 font-semibold text-[11px]" title={paper.curation_note}>
                        <AlertCircle className="w-3.5 h-3.5 mr-1" />
                        Sample Benchmark Set
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-purple-600 dark:text-purple-400 font-semibold text-[11px]">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        Review Pending
                      </span>
                    )}

                    <span className="text-[10px] text-slate-400">
                      {paper.file_size_bytes ? `${Math.round(paper.file_size_bytes / 1024)} KB` : 'PDF'}
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-2 gap-2">
                  {/* View Paper Button */}
                  <button
                    onClick={() => onOpenPdf(paper)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs flex items-center justify-center space-x-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>View PDF</span>
                  </button>

                  {/* Answer Key Button */}
                  <button
                    onClick={() => onOpenAnswerKey(paper)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs flex items-center justify-center space-x-1.5 transition"
                  >
                    <Key className="w-3.5 h-3.5 text-amber-500" />
                    <span>Answer Key</span>
                  </button>

                  {/* Interactive Test Mode Button */}
                  <button
                    onClick={() => onStartTest(paper.id)}
                    disabled={!paper.has_interactive_test}
                    className={`col-span-2 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
                      paper.has_interactive_test
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>{paper.has_interactive_test ? 'Attempt Interactive Test' : 'Test Extraction in Progress'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
