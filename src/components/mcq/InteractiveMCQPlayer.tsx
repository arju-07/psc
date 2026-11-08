import React, { useState, useEffect } from 'react';
import { MCQQuestion } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ReportQuestionModal } from './ReportQuestionModal';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bookmark,
  Flag,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Info,
  Clock,
  RotateCcw,
  Award,
  Check,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

interface InteractiveMCQPlayerProps {
  questions: MCQQuestion[];
  mode?: 'learning' | 'exam';
  title?: string;
  onFinishExam?: (score: {
    correct: number;
    incorrect: number;
    unattempted: number;
    score: number;
  }) => void;
}

export const InteractiveMCQPlayer: React.FC<InteractiveMCQPlayerProps> = ({
  questions,
  mode: initialMode = 'learning',
  title = 'Interactive Practice Session',
  onFinishExam,
}) => {
  const [mode, setMode] = useState<'learning' | 'exam'>(initialMode);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Selected answers record: { [questionIndex]: 'A' | 'B' | 'C' | 'D' }
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  
  // Exam mode marked for review
  const [markedForReview, setMarkedForReview] = useState<number[]>([]);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(questions.length * 60); // 1 min per question
  const [showLanguageMalayalam, setShowLanguageMalayalam] = useState(true);
  const [reportingQuestion, setReportingQuestion] = useState<MCQQuestion | null>(null);

  const { bookmarkedQuestionIds, toggleBookmarkQuestion, recordMistake } = useAuth();

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
        <BookOpen className="w-12 h-12 text-slate-400 mx-auto opacity-30" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">No Questions in Session</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Questions will appear here once verified from official question booklets.
        </p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isBookmarked = currentQ ? bookmarkedQuestionIds.includes(currentQ.id) : false;
  const currentSelection = selectedAnswers[currentIndex];
  const hasAnsweredCurrent = currentSelection !== undefined;

  // Timer for exam mode
  useEffect(() => {
    if (mode === 'exam' && !isExamSubmitted && timerSeconds > 0) {
      const interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleExamSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mode, isExamSubmitted, timerSeconds]);

  const handleSelectOption = (optionId: 'A' | 'B' | 'C' | 'D') => {
    if (mode === 'learning') {
      if (hasAnsweredCurrent) return; // Prevent changing after revealing in learning mode
      setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optionId }));

      // If answered incorrectly, automatically record in mistake notebook
      if (optionId !== currentQ.correctAnswer) {
        recordMistake(currentQ, optionId);
      }
    } else {
      // Exam mode: allow changing selection anytime before submission
      if (isExamSubmitted) return;
      setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optionId }));
    }
  };

  const handleExamSubmit = () => {
    setIsExamSubmitted(true);
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    questions.forEach((q, idx) => {
      const ans = selectedAnswers[idx];
      if (!ans) {
        unattempted++;
      } else if (ans === q.correctAnswer) {
        correct++;
      } else {
        incorrect++;
        recordMistake(q, ans);
      }
    });

    const netScore = Math.max(0, Number((correct - incorrect * 0.33).toFixed(2)));

    if (onFinishExam) {
      onFinishExam({ correct, incorrect, unattempted, score: netScore });
    }
  };

  const toggleReviewMark = (idx: number) => {
    setMarkedForReview((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetPractice = () => {
    setSelectedAnswers({});
    setMarkedForReview([]);
    setIsExamSubmitted(false);
    setCurrentIndex(0);
    setTimerSeconds(questions.length * 60);
  };

  if (!currentQ) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        No questions available for this module.
      </div>
    );
  }

  // Calculate stats for current session
  const totalAttempted = Object.keys(selectedAnswers).length;
  let correctSoFar = 0;
  Object.entries(selectedAnswers).forEach(([idxStr, ans]) => {
    const idx = parseInt(idxStr, 10);
    if (questions[idx] && questions[idx].correctAnswer === ans) {
      correctSoFar++;
    }
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
      {/* Top Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-900/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-navy-100 text-navy-800 dark:bg-navy-950 dark:text-sky-300">
              {currentQ.examName}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {currentQ.subject} &bull; {currentQ.topic}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            {title}
          </h2>
        </div>

        {/* Mode Selector & Controls */}
        <div className="flex items-center gap-2">
          {/* Learning / Exam Mode Switcher */}
          <div className="inline-flex rounded-lg p-0.5 bg-slate-200 dark:bg-slate-800 text-xs font-semibold">
            <button
              onClick={() => {
                setMode('learning');
                setIsExamSubmitted(false);
              }}
              className={`px-3 py-1 rounded-md transition-all ${
                mode === 'learning'
                  ? 'bg-white dark:bg-slate-700 text-navy-800 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Learning Mode
            </button>
            <button
              onClick={() => {
                setMode('exam');
                resetPractice();
              }}
              className={`px-3 py-1 rounded-md transition-all ${
                mode === 'exam'
                  ? 'bg-white dark:bg-slate-700 text-navy-800 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Exam Mode
            </button>
          </div>

          {/* Exam Timer */}
          {mode === 'exam' && !isExamSubmitted && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-mono font-bold">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{formatTimer(timerSeconds)}</span>
            </div>
          )}

          {/* Malayalam toggle */}
          {currentQ.questionMalayalam && (
            <button
              onClick={() => setShowLanguageMalayalam(!showLanguageMalayalam)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                showLanguageMalayalam
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                  : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
              title="Toggle Malayalam Translation"
            >
              മലയാളം {showLanguageMalayalam ? 'ON' : 'OFF'}
            </button>
          )}

          {/* Reset Button */}
          <button
            onClick={resetPractice}
            title="Reset this test"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress & Palette Bar */}
      <div className="px-5 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Question <span className="text-navy-700 dark:text-sky-400 font-bold">{currentIndex + 1}</span> of {questions.length}
          </span>
          <div className="w-24 sm:w-36 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
          {mode === 'learning' && totalAttempted > 0 && (
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">
              Accuracy: <strong className="text-emerald-600">{Math.round((correctSoFar / totalAttempted) * 100)}%</strong> ({correctSoFar}/{totalAttempted})
            </span>
          )}
        </div>

        {/* Question Pill Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
          {questions.map((q, idx) => {
            const isAns = selectedAnswers[idx] !== undefined;
            const isCurr = idx === currentIndex;
            const isRev = markedForReview.includes(idx);
            let pillClass = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';

            if (mode === 'learning') {
              if (isAns) {
                const isCorr = selectedAnswers[idx] === q.correctAnswer;
                pillClass = isCorr
                  ? 'bg-emerald-600 text-white'
                  : 'bg-red-500 text-white';
              }
            } else {
              // Exam mode
              if (isExamSubmitted) {
                if (!isAns) pillClass = 'bg-slate-300 dark:bg-slate-700 text-slate-600';
                else if (selectedAnswers[idx] === q.correctAnswer) pillClass = 'bg-emerald-600 text-white';
                else pillClass = 'bg-red-500 text-white';
              } else {
                if (isRev) pillClass = 'bg-amber-500 text-white ring-2 ring-amber-300';
                else if (isAns) pillClass = 'bg-navy-700 text-white';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-6 h-6 rounded text-[11px] font-semibold transition-all shrink-0 flex items-center justify-center ${pillClass} ${
                  isCurr ? 'ring-2 ring-navy-500 dark:ring-sky-400 scale-110 font-bold' : ''
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Body */}
      <div className="p-5 sm:p-7 flex-1 space-y-6">
        {/* Question Text & Meta */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed">
              <span className="text-navy-700 dark:text-sky-400 font-bold mr-2">Q{currentIndex + 1}.</span>
              {currentQ.questionText}
            </h3>

            {/* Bookmark & Report buttons */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => toggleBookmarkQuestion(currentQ.id)}
                className={`p-2 rounded-lg border transition-colors ${
                  isBookmarked
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
                title="Bookmark this Question"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
              </button>
              <button
                onClick={() => setReportingQuestion(currentQ)}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors"
                title="Report Discrepancy"
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Optional Malayalam Translation Text */}
          {showLanguageMalayalam && currentQ.questionMalayalam && (
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border-l-4 border-navy-500 dark:border-sky-400">
              {currentQ.questionMalayalam}
            </p>
          )}

          {/* Difficulty and Source paper tag */}
          <div className="flex items-center gap-2 pt-1 text-xs">
            <span
              className={`px-2 py-0.5 rounded capitalize font-medium ${
                currentQ.difficulty === 'easy'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : currentQ.difficulty === 'medium'
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
              }`}
            >
              {currentQ.difficulty} Difficulty
            </span>
            {currentQ.sourcePaperName && (
              <span className="text-slate-500 dark:text-slate-400">
                Source: <strong>{currentQ.sourcePaperName}</strong>
              </span>
            )}
            {currentQ.isVerifiedOfficialKey && (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <Check className="w-3 h-3" /> Official Key
              </span>
            )}
          </div>
        </div>

        {/* Options Grid */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((option) => {
            const isSelected = currentSelection === option.id;
            const isCorrect = option.id === currentQ.correctAnswer;
            const revealState = mode === 'learning' ? hasAnsweredCurrent : isExamSubmitted;

            let optionStyle = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';
            let badgeStyle = 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
            let indicatorIcon = null;

            if (revealState) {
              if (isCorrect) {
                // Correct answer is always green
                optionStyle = 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30';
                badgeStyle = 'bg-emerald-600 text-white';
                indicatorIcon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
              } else if (isSelected && !isCorrect) {
                // Incorrectly selected option is red
                optionStyle = 'border-red-500 bg-red-50/80 dark:bg-red-950/40 text-red-900 dark:text-red-200 ring-2 ring-red-500/30';
                badgeStyle = 'bg-red-600 text-white';
                indicatorIcon = <XCircle className="w-5 h-5 text-red-600 shrink-0" />;
              } else {
                optionStyle = 'border-slate-200 dark:border-slate-800 opacity-60 text-slate-500';
              }
            } else if (isSelected) {
              // Unrevealed state (Exam mode selected)
              optionStyle = 'border-navy-600 dark:border-sky-500 bg-navy-50/70 dark:bg-navy-950/50 text-navy-900 dark:text-sky-200 ring-2 ring-navy-500/20';
              badgeStyle = 'bg-navy-700 dark:bg-sky-500 text-white';
            }

            return (
              <button
                key={option.id}
                type="button"
                disabled={revealState && mode === 'learning'}
                onClick={() => handleSelectOption(option.id)}
                className={`w-full p-4 rounded-xl border text-left flex items-start justify-between gap-3 transition-all duration-150 ${optionStyle} ${
                  revealState ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${badgeStyle}`}
                  >
                    {option.id}
                  </span>
                  <span className="text-sm font-medium pt-0.5">{option.text}</span>
                </div>
                {indicatorIcon}
              </button>
            );
          })}
        </div>

        {/* Learning Mode Instant Evaluation Prompt if not answered */}
        {mode === 'learning' && !hasAnsweredCurrent && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Select any option above to immediately reveal the official answer, comprehensive rationale and additional high-yield facts.</span>
          </div>
        )}

        {/* Detailed Explanation Panel (Learning mode revealed OR Exam submitted) */}
        {((mode === 'learning' && hasAnsweredCurrent) || (mode === 'exam' && isExamSubmitted)) && (
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-gradient-to-b from-emerald-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900/90 p-5 sm:p-6 space-y-4 animate-fadeIn shadow-sm">
            {/* Header / Result banner */}
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-emerald-100 dark:border-emerald-900/40 gap-2">
              <div className="flex items-center gap-2">
                {currentSelection === currentQ.correctAnswer ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Correct Answer!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                    <XCircle className="w-4 h-4 text-red-600" /> Incorrect Choice (Added to Mistake Notebook)
                  </span>
                )}

                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Correct Option: <strong className="text-emerald-700 dark:text-emerald-400">Option ({currentQ.correctAnswer}) - {currentQ.options.find(o => o.id === currentQ.correctAnswer)?.text}</strong>
                </span>
              </div>

              {/* Attribution / AI label check */}
              <div className="flex items-center gap-2 text-[11px]">
                {currentQ.explanation.isAIGenerated && !currentQ.explanation.isReviewed ? (
                  <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Generated (Pending Review)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-medium flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> Faculty & Gazette Verified
                  </span>
                )}
              </div>
            </div>

            {/* 1. Core Explanation */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-navy-600 dark:text-sky-400" />
                Why Option {currentQ.correctAnswer} is Correct
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                {currentQ.explanation.correctReason}
              </p>
            </div>

            {/* 2. Why Other Options Are Incorrect */}
            {currentQ.explanation.incorrectReason && (
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Analysis of Other Options:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(currentQ.explanation.incorrectReason).map(([optKey, reason]) => (
                    <div
                      key={optKey}
                      className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-snug"
                    >
                      <strong className="text-red-700 dark:text-red-400 mr-1.5">Option ({optKey}):</strong>
                      {reason}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Important Facts */}
            {currentQ.explanation.facts && currentQ.explanation.facts.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  High-Yield Facts for Revision:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                  {currentQ.explanation.facts.map((fact, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 4. Related Topic & Reference Source */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
              <div>
                Related Topic: <strong className="text-slate-800 dark:text-slate-200">{currentQ.explanation.relatedTopic}</strong>
              </div>
              {currentQ.explanation.source && (
                <div>
                  Ref: <span className="italic text-slate-600 dark:text-slate-300">{currentQ.explanation.source}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Exam Mode Result Summary Card after Submission */}
        {mode === 'exam' && isExamSubmitted && (
          <div className="p-5 rounded-xl bg-navy-50 dark:bg-navy-950/60 border border-navy-200 dark:border-navy-800 text-center space-y-3">
            <h4 className="text-base font-bold text-navy-900 dark:text-white">
              Mock Test Result Summary
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs max-w-lg mx-auto">
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border">
                <span className="block text-slate-500">Correct (+1)</span>
                <strong className="text-lg text-emerald-600">{correctSoFar}</strong>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border">
                <span className="block text-slate-500">Wrong (-0.33)</span>
                <strong className="text-lg text-red-600">{totalAttempted - correctSoFar}</strong>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border">
                <span className="block text-slate-500">Unanswered</span>
                <strong className="text-lg text-slate-600 dark:text-slate-300">{questions.length - totalAttempted}</strong>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border">
                <span className="block text-slate-500">Net Score</span>
                <strong className="text-lg text-navy-700 dark:text-sky-400">
                  {Math.max(0, Number((correctSoFar - (totalAttempted - correctSoFar) * 0.33).toFixed(2)))}
                </strong>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Scroll through question numbers above to view detailed explanations for each response.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Action / Navigation Bar */}
      <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <div className="flex items-center gap-2">
          {mode === 'exam' && !isExamSubmitted && (
            <>
              <button
                onClick={() => toggleReviewMark(currentIndex)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                  markedForReview.includes(currentIndex)
                    ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200'
                    : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {markedForReview.includes(currentIndex) ? 'Unmark Review' : 'Mark for Review'}
              </button>

              <button
                onClick={handleExamSubmit}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Submit Exam
              </button>
            </>
          )}

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              className="px-5 py-2 rounded-lg bg-navy-700 hover:bg-navy-800 dark:bg-navy-600 dark:hover:bg-navy-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              Next Question <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            mode === 'learning' && (
              <button
                onClick={resetPractice}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                Practice Again <RotateCcw className="w-4 h-4" />
              </button>
            )
          )}
        </div>
      </div>

      {/* Report Modal */}
      <ReportQuestionModal
        question={reportingQuestion}
        isOpen={!!reportingQuestion}
        onClose={() => setReportingQuestion(null)}
      />
    </div>
  );
};
