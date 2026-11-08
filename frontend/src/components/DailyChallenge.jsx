import React, { useState, useEffect } from 'react';
import {
  Flame,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Play,
  Calendar,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export default function DailyChallenge({ currentUser }) {
  const [challenge, setChallenge] = useState(null);
  const [questionCount, setQuestionCount] = useState(10);
  const [alreadyParticipated, setAlreadyParticipated] = useState(false);
  const [participation, setParticipation] = useState(null);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Challenge in-progress state
  const [inProgress, setInProgress] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [submissionResult, setSubmissionResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 mins

  useEffect(() => {
    loadDailyData();
  }, [currentUser, questionCount]);

  useEffect(() => {
    let timer;
    if (inProgress && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (inProgress && timeLeft === 0) {
      handleSubmitChallenge();
    }
    return () => clearInterval(timer);
  }, [inProgress, timeLeft]);

  const loadDailyData = async () => {
    if (!currentUser?.id) return;
    try {
      setLoading(true);
      const res = await api.getDailyChallenge(currentUser.id, questionCount);
      setChallenge(res.challenge);
      setAlreadyParticipated(res.already_participated);
      setParticipation(res.participation);
      setStreak(res.streak || 0);

      const hist = await api.getDailyHistory(currentUser.id, 7);
      setHistory(hist.history || []);
    } catch (e) {
      console.error('Failed to load daily challenge:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChallenge = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setTimeLeft(questionCount * 60);
    setInProgress(true);
    setSubmissionResult(null);
  };

  const handleSelectOption = (qId, optId) => {
    setUserAnswers(prev => ({ ...prev, [qId]: optId }));
  };

  const handleSubmitChallenge = async () => {
    setInProgress(false);
    try {
      const res = await api.submitDailyChallenge({
        user_id: currentUser.id,
        date: challenge.date,
        answers: userAnswers
      });
      setSubmissionResult(res);
      setAlreadyParticipated(true);
      setParticipation(res.participation);
      setStreak(res.streak || streak + 1);
      // Reload history
      const hist = await api.getDailyHistory(currentUser.id, 7);
      setHistory(hist.history || []);
    } catch (e) {
      console.error('Failed to submit daily challenge:', e);
    }
  };

  const questions = challenge?.questions || [];
  const currentQ = questions[currentIndex];

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-red-800 via-amber-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4 fill-current text-amber-400" />
              <span>Daily Practice Streak • ദിനചര്യ പരിശീലനം</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Today's Daily PYQ Challenge
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/90 mt-1 leading-relaxed ml-text">
              ദിവസവും കുറഞ്ഞത് 10 ചോദ്യങ്ങൾ പ്രാക്ടീസ് ചെയ്ത് റാങ്ക് മേക്കിംഗ് സ്‌ട്രീക്ക് നിലനിർത്തുക.
            </p>
          </div>

          {/* Streak pill */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 px-5 py-3 rounded-2xl flex items-center space-x-3 self-start md:self-auto shrink-0">
            <Flame className="w-8 h-8 text-amber-400 fill-current animate-pulse" />
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-200 block">Current Streak</span>
              <span className="text-2xl font-black text-white">{streak} Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Challenge Workspace */}
      {!inProgress && !submissionResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Card */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Date
                </span>
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>

              {alreadyParticipated ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Challenge Completed!</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Ready to Attempt</span>
                </span>
              )}
            </div>

            {/* Questions count selector */}
            {!alreadyParticipated && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select Challenge Length:
                </span>
                <div className="flex gap-2">
                  {[10, 15, 20].map((count) => (
                    <button
                      key={count}
                      onClick={() => setQuestionCount(count)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                        questionCount === count
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {count} Questions ({count} mins)
                    </button>
                  ))}
                </div>
              </div>
            )}

            {alreadyParticipated && participation ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-100">
                  Today's Challenge Performance
                </h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900">
                    <span className="text-[10px] text-slate-400 block font-semibold">Score</span>
                    <span className="text-xl font-black text-emerald-600">{participation.score}%</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900">
                    <span className="text-[10px] text-slate-400 block font-semibold">Correct</span>
                    <span className="text-xl font-black text-emerald-600">{participation.correct_count}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900">
                    <span className="text-[10px] text-slate-400 block font-semibold">Wrong</span>
                    <span className="text-xl font-black text-red-500">{participation.incorrect_count}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {questions.length} Verified PYQs Ready
                </span>
                <button
                  onClick={handleStartChallenge}
                  className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md shadow-amber-600/20 flex items-center space-x-2 transition"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Challenge Now</span>
                </button>
              </div>
            )}
          </div>

          {/* Past 7 Days Streak Calendar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>Past 7 Days History</span>
            </h3>

            {history.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No past daily challenges completed yet. Complete today's to start your streak!
              </p>
            ) : (
              <div className="space-y-2">
                {history.map((h) => (
                  <div
                    key={h.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                        {new Date(h.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {h.correct_count} correct / {h.total_questions}
                      </span>
                    </div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {h.score}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* IN PROGRESS CHALLENGE */}
      {inProgress && currentQ && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 font-black text-sm flex items-center justify-center">
                {currentIndex + 1}
              </span>
              <span className="text-xs font-bold text-slate-500">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>

            {/* Countdown */}
            <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold ${
              timeLeft < 120 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Texts */}
          <div className="space-y-3">
            <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question_text}
            </p>
            {currentQ.question_text_malayalam && (
              <p className="text-sm font-medium text-amber-950 dark:text-amber-200 ml-text leading-relaxed bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-100 dark:border-amber-900/40">
                {currentQ.question_text_malayalam}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options?.map((opt) => {
              const isSelected = userAnswers[currentQ.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(currentQ.id, opt.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center space-x-3 ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 font-bold text-amber-950 dark:text-amber-100'
                      : 'border-slate-200 dark:border-slate-800 hover:border-amber-400'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isSelected ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {opt.id}
                  </span>
                  <span className="text-sm">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Nav controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40"
            >
              Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmitChallenge}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-600/20"
              >
                Submit Daily Challenge
              </button>
            )}
          </div>
        </div>
      )}

      {/* SUBMISSION RESULTS REVIEW */}
      {submissionResult && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Daily Challenge Complete!
            </h2>
            <p className="text-xs text-slate-500">
              Your score has been logged to your streak record.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
              <span className="text-xs text-slate-400 font-semibold block">Score</span>
              <span className="text-2xl font-black text-emerald-600">
                {submissionResult.participation?.score}%
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
              <span className="text-xs text-slate-400 font-semibold block">Streak</span>
              <span className="text-2xl font-black text-amber-500">
                {submissionResult.streak} Days 🔥
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
              <span className="text-xs text-slate-400 font-semibold block">Accuracy</span>
              <span className="text-2xl font-black text-slate-800 dark:text-white">
                {submissionResult.participation?.accuracy_pct}%
              </span>
            </div>
          </div>

          {/* Question Review Breakdown */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Question Review & Answers:
            </h3>
            {submissionResult.evaluations?.map((ev, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-xs space-y-2 ${
                  ev.status === 'CORRECT'
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                    : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>Q{idx + 1}: {ev.status === 'CORRECT' ? '✅ Correct' : '❌ Incorrect'}</span>
                  <span className="text-[11px] text-slate-500">
                    Your: {ev.chosen_option || 'None'} • Correct: Option {ev.correct_option}
                  </span>
                </div>
                <p className="font-medium text-slate-800 dark:text-slate-200">{ev.question_text}</p>
                {ev.explanation && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                    <b>Explanation:</b> {ev.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => {
                setSubmissionResult(null);
                setInProgress(false);
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold"
            >
              Done & Return to Overview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
