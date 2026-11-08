import React, { useState, useEffect } from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Send,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

export default function TestRunner({
  paperId,
  currentUser,
  onExit,
  customTestData = null
}) {
  const [loading, setLoading] = useState(true);
  const [paper, setPaper] = useState(null);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [question_id]: 'A' | 'B' | 'C' | 'D' }
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [bookmarkedQs, setBookmarkedQs] = useState(new Set());
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(75 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);

  useEffect(() => {
    loadTest();
  }, [paperId]);

  // Countdown timer
  useEffect(() => {
    if (isSubmitted || timeLeftSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, timeLeftSeconds]);

  const loadTest = async () => {
    setLoading(true);
    try {
      if (customTestData) {
        // AI generated custom test
        setPaper({
          id: customTestData.test_id,
          paper_code: 'AI-CUSTOM-MOCK',
          session_name: customTestData.title,
          duration_minutes: customTestData.duration_minutes,
          is_sample: false
        });
        setExam({ name: customTestData.topic });
        setQuestions(customTestData.questions || []);
        setTimeLeftSeconds((customTestData.duration_minutes || 15) * 60);
      } else {
        const res = await api.getPaperQuestions(paperId, false);
        setPaper(res.paper);
        setExam(res.exam);
        setQuestions(res.questions || []);
        setTimeLeftSeconds((res.duration_minutes || 75) * 60);
      }
    } catch (err) {
      console.error('Failed to load test questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionId) => {
    if (isSubmitted) return;
    const currentQ = questions[currentIndex];
    setUserAnswers({
      ...userAnswers,
      [currentQ.id]: optionId
    });
  };

  const handleClearOption = () => {
    if (isSubmitted) return;
    const currentQ = questions[currentIndex];
    const updated = { ...userAnswers };
    delete updated[currentQ.id];
    setUserAnswers(updated);
  };

  const toggleMarkForReview = () => {
    const currentQ = questions[currentIndex];
    const newSet = new Set(markedForReview);
    if (newSet.has(currentQ.id)) {
      newSet.delete(currentQ.id);
    } else {
      newSet.add(currentQ.id);
    }
    setMarkedForReview(newSet);
  };

  const toggleBookmark = async () => {
    const currentQ = questions[currentIndex];
    const newSet = new Set(bookmarkedQs);
    const userId = currentUser?.id || 'usr-student-01';
    if (newSet.has(currentQ.id)) {
      newSet.delete(currentQ.id);
    } else {
      newSet.add(currentQ.id);
    }
    setBookmarkedQs(newSet);
    try {
      await api.toggleBookmark(userId, currentQ.id);
    } catch (e) {
      console.error('Bookmark toggle failed:', e);
    }
  };

  const handleAutoSubmit = () => {
    handleSubmitTest();
  };

  const handleSubmitTest = async () => {
    setConfirmSubmitOpen(false);
    const userId = currentUser?.id || 'usr-student-01';
    const totalTimeSpent = (paper?.duration_minutes || 75) * 60 - timeLeftSeconds;

    try {
      const payload = {
        user_id: userId,
        paper_id: paper?.id || paperId,
        answers: userAnswers,
        time_spent_seconds: Math.max(1, totalTimeSpent),
        test_questions: questions
      };
      const res = await api.submitAttempt(payload);
      setEvaluationResult(res);
      setIsSubmitted(true);

      // Trigger celebration confetti if score is solid!
      if (res.score >= 0.5 * res.max_score) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="text-center py-24">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
          Loading Examination Paper & Verified Answer Keys...
        </p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h3 className="mt-3 font-bold text-base text-slate-800 dark:text-white">No Verified Questions Found</h3>
        <p className="text-xs text-slate-500 mt-1">This paper has not yet completed full question OCR extraction.</p>
        <button
          onClick={onExit}
          className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
        >
          Return to Catalogue
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="space-y-4 pb-12">
      {/* Top Test Header Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onExit}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
            title="Exit Test"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded text-slate-800 dark:text-slate-200">
                {paper?.paper_code}
              </span>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                {exam?.name || paper?.session_name}
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Marking: +1.0 for Correct | -0.33 Negative Marking for Incorrect
            </p>
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center space-x-3">
          {!isSubmitted ? (
            <>
              <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-bold ${
                timeLeftSeconds < 300
                  ? 'bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 animate-pulse'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
              }`}>
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeftSeconds)}</span>
              </div>

              <button
                onClick={() => setConfirmSubmitOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Test</span>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-xl">
                Test Completed & Evaluated
              </span>
              <button
                onClick={onExit}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200"
              >
                Exit Review
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Test Layout: Split Question Area + Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left 3-cols: Question Display */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-6">

            {/* Question Header & Bookmark */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                  Q{currentIndex + 1}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Topic: {currentQ?.topic || 'General Studies'}
                </span>
                {currentQ?.difficulty && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 font-semibold">
                    {currentQ.difficulty}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleBookmark}
                  className={`p-2 rounded-xl transition ${
                    bookmarkedQs.has(currentQ?.id)
                      ? 'bg-purple-100 dark:bg-purple-950 text-purple-600'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-slate-600'
                  }`}
                  title="Bookmark question for revision"
                >
                  <Bookmark className={`w-4 h-4 ${bookmarkedQs.has(currentQ?.id) ? 'fill-current' : ''}`} />
                </button>

                {!isSubmitted && (
                  <button
                    onClick={toggleMarkForReview}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      markedForReview.has(currentQ?.id)
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {markedForReview.has(currentQ?.id) ? 'Marked for Review ★' : 'Mark for Review'}
                  </button>
                )}
              </div>
            </div>

            {/* Bilingual Question Text (English + Malayalam Unicode) */}
            <div className="space-y-3">
              {currentQ?.question_text_malayalam && (
                <p className="text-base sm:text-lg font-medium text-slate-900 dark:text-white leading-relaxed ml-text">
                  {currentQ.question_text_malayalam}
                </p>
              )}
              {currentQ?.question_text && (
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
                  {currentQ.question_text}
                </p>
              )}
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ?.options?.map((opt) => {
                const isSelected = userAnswers[currentQ.id] === opt.id;
                const isEvaluationCorrect = isSubmitted && currentQ.correct_option === opt.id;
                const isEvaluationWrongSelected = isSubmitted && isSelected && currentQ.correct_option !== opt.id;

                let optionStyles = 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50';
                if (isSelected && !isSubmitted) {
                  optionStyles = 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20';
                } else if (isEvaluationCorrect) {
                  optionStyles = 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-100 font-semibold ring-2 ring-emerald-500/30';
                } else if (isEvaluationWrongSelected) {
                  optionStyles = 'border-red-500 bg-red-100 dark:bg-red-950/70 text-red-900 dark:text-red-100 font-semibold ring-2 ring-red-500/30';
                }

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-4 rounded-xl border text-sm flex items-center justify-between cursor-pointer transition ${optionStyles}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}>
                        {opt.id}
                      </span>
                      <span className="font-medium ml-text">{opt.text}</span>
                    </div>

                    {isSubmitted && (
                      <div>
                        {isEvaluationCorrect && (
                          <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-4 h-4 mr-1" /> Correct Answer
                          </span>
                        )}
                        {isEvaluationWrongSelected && (
                          <span className="inline-flex items-center text-xs font-bold text-red-600 dark:text-red-400">
                            <XCircle className="w-4 h-4 mr-1" /> Your Choice (-0.33)
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Answer & Explanation Drawer (Visible after submission) */}
            {isSubmitted && (currentQ?.explanation || currentQ?.explanation_malayalam) && (
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center space-x-1.5 text-emerald-800 dark:text-emerald-200 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Verified Explanation (ഔദ്യോഗിക വിശദീകരണം)</span>
                </div>
                {currentQ.explanation_malayalam && (
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed ml-text">
                    {currentQ.explanation_malayalam}
                  </p>
                )}
                {currentQ.explanation && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    {currentQ.explanation}
                  </p>
                )}
              </div>
            )}

            {/* Bottom Question Controls */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-4">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold disabled:opacity-40 flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {!isSubmitted && (
                <button
                  onClick={handleClearOption}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear Selection
                </button>
              )}

              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                disabled={currentIndex === questions.length - 1}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold disabled:opacity-40 flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 1-col: Question Palette & Score Summary */}
        <div className="space-y-4">
          {/* Post-submission Evaluation Card */}
          {isSubmitted && evaluationResult && (
            <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-5 rounded-2xl shadow-lg space-y-3">
              <div className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-amber-300" />
                <h3 className="font-extrabold text-base">Test Result</h3>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black">{evaluationResult.score}</span>
                <span className="text-emerald-200 text-sm">/ {evaluationResult.max_score} Marks</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-white/20">
                <div className="bg-white/10 p-2 rounded-lg">
                  <p className="text-emerald-200 text-[10px]">Correct</p>
                  <p className="font-bold text-sm">{evaluationResult.correct_count}</p>
                </div>
                <div className="bg-white/10 p-2 rounded-lg">
                  <p className="text-rose-200 text-[10px]">Wrong</p>
                  <p className="font-bold text-sm">{evaluationResult.incorrect_count}</p>
                </div>
                <div className="bg-white/10 p-2 rounded-lg">
                  <p className="text-amber-200 text-[10px]">Accuracy</p>
                  <p className="font-bold text-sm">{evaluationResult.accuracy_pct}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Question Navigator Palette */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <h4 className="font-bold text-xs text-slate-800 dark:text-white uppercase tracking-wider">
                Question Palette
              </h4>
              <span className="text-xs font-semibold text-emerald-600">
                {answeredCount}/{questions.length} Answered
              </span>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Answered</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span>Review</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
                <span>Not Answered</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-500" />
                <span>Bookmarked</span>
              </div>
            </div>

            {/* Matrix of numbers */}
            <div className="grid grid-cols-5 gap-2 pt-2">
              {questions.map((q, idx) => {
                const isCurrent = currentIndex === idx;
                const isAnswered = !!userAnswers[q.id];
                const isMarked = markedForReview.has(q.id);

                let btnStyles = 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700';
                if (isAnswered) {
                  btnStyles = 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-sm';
                } else if (isMarked) {
                  btnStyles = 'bg-amber-400 text-slate-900 font-bold border-amber-400';
                }

                if (isCurrent) {
                  btnStyles += ' ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-800';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-xl text-xs font-semibold transition border flex items-center justify-center ${btnStyles}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {confirmSubmitOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Ready to submit your test?
            </h3>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <p>• Total Questions: <span className="font-bold">{questions.length}</span></p>
              <p>• Answered: <span className="font-bold text-emerald-600">{answeredCount}</span></p>
              <p>• Unanswered: <span className="font-bold text-rose-500">{questions.length - answeredCount}</span></p>
              <p>• Marked for Review: <span className="font-bold text-amber-500">{markedForReview.size}</span></p>
            </div>
            <p className="text-[11px] text-slate-400">
              Once submitted, your responses will be automatically evaluated against the official answer key with negative marking rules applied.
            </p>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setConfirmSubmitOpen(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Continue Test
              </button>
              <button
                onClick={handleSubmitTest}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
