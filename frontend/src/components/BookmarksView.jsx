import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Filter,
  Play,
  Trash2,
  HelpCircle,
  CheckCircle2,
  Award,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';

export default function BookmarksView({ currentUser, onStartCustomPractice }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [revealedAnswers, setRevealedAnswers] = useState({});

  useEffect(() => {
    loadBookmarks();
    loadSubjects();
  }, [currentUser]);

  const loadBookmarks = async () => {
    if (!currentUser?.id) return;
    try {
      setLoading(true);
      const data = await api.getBookmarks(currentUser.id);
      setBookmarks(data || []);
    } catch (e) {
      console.error('Failed to load bookmarks:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async () => {
    try {
      const data = await api.getSubjects();
      setSubjects(data || []);
    } catch (e) {
      console.error('Failed to load subjects:', e);
    }
  };

  const handleRemoveBookmark = async (questionId) => {
    try {
      await api.toggleBookmark(currentUser.id, questionId);
      setBookmarks(prev => prev.filter(b => b.question_id !== questionId));
    } catch (e) {
      console.error('Failed to remove bookmark:', e);
    }
  };

  const toggleAnswerReveal = (questionId) => {
    setRevealedAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const filteredBookmarks = selectedSubject === 'all'
    ? bookmarks
    : bookmarks.filter(b => b.question?.subject_id === selectedSubject);

  const handlePracticeAllBookmarks = () => {
    const validQuestions = filteredBookmarks.map(b => b.question).filter(Boolean);
    if (validQuestions.length === 0) return;
    const customTest = {
      test_id: `custom-bm-${Date.now()}`,
      title: 'Practice Bookmarked Questions',
      title_malayalam: 'ബുക്ക്‌മാർക്ക് ചെയ്ത ചോദ്യങ്ങളുടെ പരിശീലനം',
      questions: validQuestions,
      duration_minutes: Math.max(10, Math.round(validQuestions.length * 1.2)),
      negative_marking: 0.33,
      marks_per_question: 1.0
    };
    onStartCustomPractice(customTest);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Bookmark className="w-4 h-4 fill-current" />
              <span>Saved Questions Bank • ബുക്ക്‌മാർക്ക് ചെയ്തവ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Your Bookmarked Questions ({bookmarks.length})
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/90 mt-1 leading-relaxed ml-text">
              കഠിനമായതോ വീണ്ടും പഠിക്കാൻ സൂക്ഷിച്ചതോ ആയ ചോദ്യങ്ങൾ ഇവിടെ ക്രമീകരിച്ചിരിക്കുന്നു.
            </p>
          </div>

          {filteredBookmarks.length > 0 && (
            <button
              onClick={handlePracticeAllBookmarks}
              className="px-5 py-2.5 bg-white text-amber-900 hover:bg-amber-50 rounded-2xl text-xs font-extrabold shadow-md flex items-center space-x-2 transition self-start md:self-auto shrink-0"
            >
              <Play className="w-4 h-4 fill-current text-amber-700" />
              <span>Practise Filtered ({filteredBookmarks.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter by Subject */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Filter by Subject:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedSubject === 'all'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Subjects ({bookmarks.length})
          </button>
          {subjects.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSubject(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedSubject === s.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading saved bookmarks...</div>
      ) : filteredBookmarks.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="font-bold text-base text-slate-800 dark:text-white">
            No Bookmarked Questions Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You can bookmark tricky questions while taking Mock Tests or doing Topic Practice using the bookmark icon.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookmarks.map((bm, idx) => {
            const q = bm.question;
            if (!q) return null;
            const isRevealed = revealedAnswers[q.id];

            return (
              <div
                key={bm.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-amber-400 transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-xs font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400">
                        Saved on {new Date(bm.created_at).toLocaleDateString('en-GB')}
                      </span>
                      <div className="flex items-center space-x-2 mt-0.5">
                        {q.topic && (
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-semibold text-slate-700 dark:text-slate-300">
                            {q.topic}
                          </span>
                        )}
                        {q.year && (
                          <span className="text-[10px] bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded font-semibold text-amber-700 dark:text-amber-300">
                            PYQ {q.year}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveBookmark(q.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition"
                    title="Remove from Bookmarks"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Texts */}
                <div className="space-y-2">
                  <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
                    {q.question_text}
                  </p>
                  {q.question_text_malayalam && (
                    <p className="text-xs sm:text-sm font-medium text-amber-950 dark:text-amber-200 ml-text leading-relaxed bg-amber-50/50 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-100 dark:border-amber-900/40">
                      {q.question_text_malayalam}
                    </p>
                  )}
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options?.map((opt) => {
                    const isCorrect = opt.id === q.correct_option;
                    return (
                      <div
                        key={opt.id}
                        className={`p-2.5 rounded-xl border flex items-center space-x-2.5 ${
                          isRevealed && isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 font-bold text-emerald-900 dark:text-emerald-100'
                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] ${
                          isRevealed && isCorrect
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700'
                        }`}>
                          {opt.id}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Answer Toggle */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => toggleAnswerReveal(q.id)}
                    className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline self-start"
                  >
                    {isRevealed ? 'Hide Answer & Explanation' : 'Show Answer & Verified Explanation'}
                  </button>
                  {isRevealed && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Correct Answer: Option {q.correct_option}
                    </span>
                  )}
                </div>

                {/* Explanation */}
                {isRevealed && (
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2 animate-in fade-in">
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      Verified Explanation:
                    </p>
                    <p className="text-slate-700 dark:text-slate-300">{q.explanation}</p>
                    {q.explanation_malayalam && (
                      <p className="text-emerald-900 dark:text-emerald-200 ml-text text-[11px] pt-1">
                        {q.explanation_malayalam}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
