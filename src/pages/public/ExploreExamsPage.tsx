import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockCategories, mockExams } from '../../data/mockData';
import { ExamCard } from '../../components/cards/ExamCard';
import { Search, Filter, Sparkles, Layers, SlidersHorizontal, Check } from 'lucide-react';

export const ExploreExamsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [filterType, setFilterType] = useState<'all' | 'popular' | 'recent'>('all');

  const filteredExams = useMemo(() => {
    return mockExams.filter((exam) => {
      // Category filter
      if (selectedCategory !== 'all' && exam.categorySlug !== selectedCategory) {
        return false;
      }
      // Quick filter
      if (filterType === 'popular' && !exam.isPopular) return false;
      if (filterType === 'recent' && !exam.isRecentlyAdded) return false;

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = exam.name.toLowerCase().includes(query);
        const matchesDesc = exam.shortDescription.toLowerCase().includes(query);
        const matchesCategory = exam.category.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesCategory;
      }
      return true;
    });
  }, [selectedCategory, filterType, searchQuery]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-100 dark:bg-slate-800 text-navy-800 dark:text-sky-300 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>Complete Examination Directory</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Explore Examinations
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Browse Kerala PSC, Police, Teaching, National and Railway examinations. Select any examination to access its dedicated repository of previous year papers, topic weights and practice questions.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search examinations by keyword..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                filterType === 'all'
                  ? 'bg-navy-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              All Examinations ({mockExams.length})
            </button>
            <button
              onClick={() => setFilterType('popular')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                filterType === 'popular'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Popular Exams
            </button>
            <button
              onClick={() => setFilterType('recent')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                filterType === 'recent'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Recently Added
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800 pb-1">
          <span className="text-xs text-slate-400 font-semibold mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors ${
              selectedCategory === 'all'
                ? 'bg-navy-700 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Categories
          </button>
          {mockCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-navy-700 text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          Showing <strong>{filteredExams.length}</strong> examinations matching criteria
        </span>
        {(selectedCategory !== 'all' || searchQuery || filterType !== 'all') && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setFilterType('all');
            }}
            className="text-navy-700 dark:text-sky-400 font-semibold hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Exams Grid */}
      {filteredExams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Layers className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No examinations found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or resetting your selected category filter.
          </p>
        </div>
      )}
    </div>
  );
};
