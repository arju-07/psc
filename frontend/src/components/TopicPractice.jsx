import React, { useState, useEffect } from 'react';
import {
  Layers,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bookmark,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  BookOpen,
  Filter,
  Check,
  Award
} from 'lucide-react';
import { api } from '../services/api';

export default function TopicPractice({ currentUser, onBookmarkToggle }) {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Practice state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: 'A' }
  const [showExplanation, setShowExplanation] = useState({}); // { [qId]: boolean }
  const [aiExplanations, setAiExplanations] = useState({}); // { [qId]: explanationData }
  const [loadingAi, setLoadingAi] = useState({});
  const [languageMode, setLanguageMode] = useState('bilingual'); // 'bilingual', 'malayalam', 'english'
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  useEffect(() => {
    loadSubjects();
    loadUserBookmarks();
  }, [currentUser]);

  const loadSubjects = async () => {
    try {
      const data = await api.getSubjects();
      setSubjects(data || []);
    } catch (e) {
      console.error('Failed to load subjects:', e);
    }
  };

  const loadUserBookmarks = async () => {
    if (!currentUser?.id) return;
    try {
      const bms = await api.getBookmarks(currentUser.id);
      setBookmarkedIds(new Set((bms || []).map(b => b.question_id)));
    } catch (e) {
      console.error('Failed to load bookmarks:', e);
    }
  };

  const handleSelectSubject = async (subject) => {
    setSelectedSubject(subject);
    setSelectedTopic(null);
    setQuestions([]);
    try {
      const res = await api.getTopics(subject.id);
      setTopics(res || []);
    } catch (e) {
      console.error('Failed to load topics:', e);
    }
  };

  const handleSelectTopic = async (topic) => {
    setSelectedTopic(topic);
    setLoading(true);
    setCurrentIndex(0);
    setUserAnswers({});
    setShowExplanation({});
    try {
      const res = await api.getTopicQuestions(topic.id, 1, 50);
      setQuestions(res.questions || []);
    } catch (e) {
      console.error('Failed to load questions:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, optionId) => {
    if (userAnswers[questionId]) return; // Answer locked once submitted
    setUserAnswers(prev => ({ ...prev, [questionId]: optionId }));
    setShowExplanation(prev => ({ ...prev, [questionId]: true }));
  };

  const handleToggleBookmark = async (questionId) => {
    try {
      const res = await api.toggleBookmark(currentUser.id, questionId);
      setBookmarkedIds(prev => {
        const next = new Set(prev);
        if (res.bookmarked) next.add(questionId);
        else next.delete(questionId);
        return next;
      });
      if (onBookmarkToggle) onBookmarkToggle();
    } catch (e) {
      console.error('Bookmark toggle failed:', e);
    }
  };

  const handleFetchAiExplanation = async (questionId) => {
    if (aiExplanations[questionId] || loadingAi[questionId]) return;
    setLoadingAi(prev => ({ ...prev, [questionId]: true }));
    try {
      const exp = await api.getAIQuestionExplanation(questionId, 'both');
      setAiExplanations(prev => ({ ...prev, [questionId]: exp }));
    } catch (e) {
      console.error('AI explanation failed:', e);
    } finally {
      setLoadingAi(prev => ({ ...prev, [questionId]: false }));
    }
  };

  const currentQ = questions[currentIndex];
  const attemptedCount = Object.keys(userAnswers).length;
  const correctCount = Object.entries(userAnswers).filter(([qId, ans]) => {
    const q = questions.find(item => item.id === qId);
    return q && q.correct_option === ans;
  }).length;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>Topic-Wise Mastery • സിലബസ് അധിഷ്ഠിത പരിശീലനം</span>
            </div>
            <h1 className="text-2xl font-black">
              {selectedTopic ? selectedTopic.name : selectedSubject ? selectedSubject.name : 'Choose a Subject & Topic'}
            </h1>
            <p className="text-xs text-emerald-100/90 mt-1 ml-text">
              {selectedTopic
                ? selectedTopic.name_malayalam
                : 'വിഷയങ്ങളും ഉപവിഷയങ്ങളും തിരഞ്ഞെടുത്ത് മുൻവർഷ ചോദ്യങ്ങൾ പ്രാക്ടീസ് ചെയ്യുക'}
            </p>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/10 self-start md:self-auto">
            {['bilingual', 'malayalam', 'english'].map((mode) => (
              <button
                key={mode}
                onClick={() => setLanguageMode(mode)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition ${
                  languageMode === mode
                    ? 'bg-emerald-500 text-white shadow'
                    : 'text-emerald-100 hover:text-white'
                }`}
              >
                {mode === 'bilingual' ? 'മലയാളം + EN' : mode === 'malayalam' ? 'മലയാളം' : 'English'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      {(selectedSubject || selectedTopic) && (
        <div className="flex items-center space-x-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <button
            onClick={() => { setSelectedSubject(null); setSelectedTopic(null); setQuestions([]); }}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center space-x-1"
          >
            <span>All Subjects</span>
          </button>
          {selectedSubject && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <button
                onClick={() => { setSelectedTopic(null); setQuestions([]); }}
                className="hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                {selectedSubject.name}
              </button>
            </>
          )}
          {selectedTopic && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{selectedTopic.name}</span>
            </>
          )}
        </div>
      )}

      {/* VIEW 1: SUBJECT SELECTION */}
      {!selectedSubject && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.map((subj) => (
            <div
              key={subj.id}
              onClick={() => handleSelectSubject(subj)}
              className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                  {subj.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 ml-text mt-0.5 font-medium">
                  {subj.name_malayalam}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                  {subj.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-4 mt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  {subj.topic_count || 0} Topics
                </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {subj.question_count || 0} Verified PYQs
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: TOPIC SELECTION */}
      {selectedSubject && !selectedTopic && (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedSubject(null)}
            className="flex items-center space-x-1 text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-600 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Subjects</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((top) => (
              <div
                key={top.id}
                onClick={() => handleSelectTopic(top)}
                className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 p-5 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200">
                      Topic #{top.order || 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {top.question_count || 0} Questions
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    {top.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 ml-text mt-0.5">
                    {top.name_malayalam}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                    {top.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Start Practice</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: INTERACTIVE PRACTICE SESSION */}
      {selectedTopic && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            <button
              onClick={() => { setSelectedTopic(null); setQuestions([]); }}
              className="flex items-center space-x-1 text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-600 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Change Topic</span>
            </button>

            {/* Score Pill */}
            <div className="flex items-center space-x-4 text-xs font-semibold">
              <span className="text-slate-500 dark:text-slate-400">
                Attempted: <b className="text-slate-800 dark:text-white">{attemptedCount} / {questions.length}</b>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Correct: <b>{correctCount}</b></span>
              </span>
              <span className="text-red-500 flex items-center space-x-1">
                <XCircle className="w-3.5 h-3.5" />
                <span>Wrong: <b>{attemptedCount - correctCount}</b></span>
              </span>
            </div>

            {/* Question Quick Palette */}
            <div className="flex items-center space-x-1 overflow-x-auto max-w-xs py-1">
              {questions.map((q, idx) => {
                const ans = userAnswers[q.id];
                const isCorrect = ans && ans === q.correct_option;
                const isWrong = ans && ans !== q.correct_option;
                const isCurrent = idx === currentIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-7 h-7 text-xs font-bold rounded-lg shrink-0 transition ${
                      isCurrent
                        ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900'
                        : ''
                    } ${
                      isCorrect
                        ? 'bg-emerald-500 text-white'
                        : isWrong
                        ? 'bg-red-500 text-white'
                        : ans
                        ? 'bg-slate-400 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin text-emerald-500 mr-2" />
              <span>Loading verified PYQ questions...</span>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
              <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">No questions mapped to this topic yet</h3>
              <p className="text-xs text-slate-500 mt-1">Check back soon or explore other topics.</p>
            </div>
          ) : currentQ ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-black text-sm flex items-center justify-center">
                    {currentIndex + 1}
                  </span>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Question {currentIndex + 1} of {questions.length}
                    </span>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {currentQ.difficulty || 'Medium'}
                      </span>
                      {currentQ.year && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          PYQ {currentQ.year}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bookmark Toggle */}
                <button
                  onClick={() => handleToggleBookmark(currentQ.id)}
                  className={`p-2 rounded-xl transition ${
                    bookmarkedIds.has(currentQ.id)
                      ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/70 dark:text-amber-300'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title={bookmarkedIds.has(currentQ.id) ? 'Remove Bookmark' : 'Bookmark Question'}
                >
                  <Bookmark className={`w-5 h-5 ${bookmarkedIds.has(currentQ.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Question Text */}
              <div className="space-y-3">
                {(languageMode === 'bilingual' || languageMode === 'english') && currentQ.question_text && (
                  <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed">
                    {currentQ.question_text}
                  </p>
                )}
                {(languageMode === 'bilingual' || languageMode === 'malayalam') && currentQ.question_text_malayalam && (
                  <p className="text-sm sm:text-base font-medium text-emerald-900 dark:text-emerald-200 ml-text leading-relaxed bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                    {currentQ.question_text_malayalam}
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options?.map((opt) => {
                  const isChosen = userAnswers[currentQ.id] === opt.id;
                  const isSubmitted = !!userAnswers[currentQ.id];
                  const isCorrect = opt.id === currentQ.correct_option;

                  let optClass = 'border-slate-200 dark:border-slate-800 hover:border-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/50';
                  if (isSubmitted) {
                    if (isCorrect) {
                      optClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-100 font-semibold';
                    } else if (isChosen && !isCorrect) {
                      optClass = 'border-red-500 bg-red-50 dark:bg-red-950/50 text-red-950 dark:text-red-100 font-semibold';
                    } else {
                      optClass = 'border-slate-200 dark:border-slate-800 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(currentQ.id, opt.id)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between gap-3 ${optClass}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSubmitted && isCorrect
                            ? 'bg-emerald-600 text-white'
                            : isSubmitted && isChosen && !isCorrect
                            ? 'bg-red-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {opt.id}
                        </span>
                        <span className="text-sm sm:text-base">{opt.text}</span>
                      </div>

                      {isSubmitted && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isSubmitted && isChosen && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Verified Explanation Section */}
              {userAnswers[currentQ.id] && (
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Award className="w-5 h-5 text-emerald-600" />
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          Verified Explanation • ഔദ്യോഗിക വിവരണം
                        </h4>
                      </div>
                      <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded font-bold">
                        Correct: Option {currentQ.correct_option}
                      </span>
                    </div>

                    {currentQ.explanation && (
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {currentQ.explanation}
                      </p>
                    )}
                    {currentQ.explanation_malayalam && (
                      <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 ml-text leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        {currentQ.explanation_malayalam}
                      </p>
                    )}
                  </div>

                  {/* AI Explanation Deep Dive Button */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 p-5 rounded-2xl border border-purple-200 dark:border-purple-800/50 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-1.5 text-purple-700 dark:text-purple-300 font-bold text-xs">
                          <Sparkles className="w-4 h-4" />
                          <span>AI Tutor Deep-Dive & Option Breakdown</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Get beginner explanations for why each option is right or wrong.
                        </p>
                      </div>

                      {!aiExplanations[currentQ.id] && (
                        <button
                          onClick={() => handleFetchAiExplanation(currentQ.id)}
                          disabled={loadingAi[currentQ.id]}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shrink-0"
                        >
                          {loadingAi[currentQ.id] ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Generating Breakdown...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Analyze with AI</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* AI Explanation Content */}
                    {aiExplanations[currentQ.id] && (
                      <div className="space-y-3 pt-3 border-t border-purple-200 dark:border-purple-800/50 text-xs">
                        {/* Mandatory Disclaimer */}
                        <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 p-2.5 rounded-xl text-[11px] font-medium leading-relaxed">
                          {aiExplanations[currentQ.id].disclaimer}
                        </div>

                        {/* Breakdown per option */}
                        <div className="space-y-2 mt-2">
                          <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                            Detailed Option-by-Option Breakdown:
                          </p>
                          {aiExplanations[currentQ.id].options_breakdown?.map((b) => (
                            <div
                              key={b.option}
                              className={`p-2.5 rounded-xl border text-xs ${
                                b.is_correct
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                              }`}
                            >
                              <div className="flex items-center space-x-1.5 font-bold mb-1">
                                <span className={`w-5 h-5 rounded flex items-center justify-center text-[11px] ${
                                  b.is_correct ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                }`}>
                                  {b.option}
                                </span>
                                <span className={b.is_correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400'}>
                                  {b.is_correct ? 'Correct Answer' : 'Incorrect Option'}
                                </span>
                              </div>
                              <p className="text-slate-700 dark:text-slate-300">{b.reason_en}</p>
                              {b.reason_ml && (
                                <p className="text-emerald-900 dark:text-emerald-300 ml-text mt-1 text-[11px]">
                                  {b.reason_ml}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Quick Memory Tip */}
                        {(aiExplanations[currentQ.id].quick_memory_tip_ml || aiExplanations[currentQ.id].quick_memory_tip_en) && (
                          <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 p-3 rounded-xl">
                            <span className="font-bold text-indigo-700 dark:text-indigo-300 text-[11px] uppercase tracking-wider block mb-1">
                              💡 Quick Memory Tip for Aspirants
                            </span>
                            <p className="text-slate-700 dark:text-slate-300 text-xs">
                              {aiExplanations[currentQ.id].quick_memory_tip_en}
                            </p>
                            {aiExplanations[currentQ.id].quick_memory_tip_ml && (
                              <p className="text-indigo-900 dark:text-indigo-200 ml-text text-[11px] mt-1">
                                {aiExplanations[currentQ.id].quick_memory_tip_ml}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bottom Navigation between questions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition"
                >
                  Previous
                </button>

                <span className="text-xs text-slate-500 font-medium">
                  {currentIndex + 1} / {questions.length}
                </span>

                <button
                  onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  disabled={currentIndex === questions.length - 1}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 transition"
                >
                  Next Question
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
