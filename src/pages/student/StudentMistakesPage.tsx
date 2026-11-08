import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MCQQuestion, MistakeNotebookItem } from '../../types';
import {
  AlertOctagon,
  CheckCircle2,
  RotateCcw,
  Trash2,
  Sparkles,
  Info,
  Check,
  XCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

export const StudentMistakesPage: React.FC = () => {
  const { mistakes, removeMistake, markMistakeCorrected } = useAuth();
  const [activeMistakeReattempt, setActiveMistakeReattempt] = useState<string | null>(null);
  const [selectedReattemptOption, setSelectedReattemptOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);

  const uncorrectedMistakes = mistakes.filter((m) => !m.isCorrected);
  const correctedMistakes = mistakes.filter((m) => m.isCorrected);

  const handleReattempt = (item: MistakeNotebookItem, optionId: 'A' | 'B' | 'C' | 'D') => {
    setSelectedReattemptOption(optionId);
    if (optionId === item.question.correctAnswer) {
      setTimeout(() => {
        markMistakeCorrected(item.question.id);
        setActiveMistakeReattempt(null);
        setSelectedReattemptOption(null);
      }, 1500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 text-xs font-semibold">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Targeted Weak Area Eradication</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Mistake Notebook
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Whenever you answer an MCQ incorrectly during practice, it is automatically logged here so you can convert mistakes into guaranteed marks.
          </p>
        </div>

        {/* Counter Card */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
          <div className="text-center px-2">
            <div className="text-lg font-black text-red-600">{uncorrectedMistakes.length}</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">To Revise</div>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />
          <div className="text-center px-2">
            <div className="text-lg font-black text-emerald-600">{correctedMistakes.length}</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Mastered</div>
          </div>
        </div>
      </div>

      {/* Uncorrected Mistakes List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-red-600" />
          Unresolved Mistakes ({uncorrectedMistakes.length})
        </h2>

        {uncorrectedMistakes.length > 0 ? (
          uncorrectedMistakes.map((item) => {
            const isReattempting = activeMistakeReattempt === item.id;
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-red-200 dark:border-red-900/50 p-6 shadow-sm space-y-4"
              >
                {/* Meta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-navy-100 text-navy-800 dark:bg-slate-800 dark:text-sky-300">
                      {item.question.examName}
                    </span>
                    <span className="text-xs text-slate-400">
                      {item.question.subject}
                    </span>
                    <span className="text-xs text-red-600 font-semibold">
                      Failed {item.wrongAttemptsCount} {item.wrongAttemptsCount > 1 ? 'times' : 'time'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => markMistakeCorrected(item.question.id)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                      title="Mark as understood"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Mastered</span>
                    </button>
                    <button
                      onClick={() => removeMistake(item.question.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete from notebook"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question */}
                <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                  {item.question.questionText}
                </h3>

                {/* You selected banner */}
                <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 text-xs text-red-900 dark:text-red-200 flex items-center justify-between">
                  <span>
                    Previously selected incorrect choice: <strong className="font-bold">Option {item.selectedWrongOption}</strong>
                  </span>
                  <span className="text-[11px] text-slate-400">Last attempted: {item.lastAttemptedDate}</span>
                </div>

                {/* Interactive Reattempt or Explanation */}
                {isReattempting ? (
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-bold text-navy-700 dark:text-sky-400 uppercase tracking-wider block">
                      Choose the correct option now:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.question.options.map((opt) => {
                        const isChosen = selectedReattemptOption === opt.id;
                        const isRight = opt.id === item.question.correctAnswer;
                        let btnStyle = 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800';
                        if (isChosen) {
                          btnStyle = isRight
                            ? 'bg-emerald-500 text-white border-emerald-600'
                            : 'bg-red-500 text-white border-red-600';
                        }
                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleReattempt(item, opt.id)}
                            className={`p-3 rounded-xl border text-xs text-left font-medium flex items-center justify-between transition-colors ${btnStyle}`}
                          >
                            <span>
                              <strong>{opt.id}.</strong> {opt.text}
                            </span>
                            {isChosen && isRight && <CheckCircle2 className="w-4 h-4" />}
                            {isChosen && !isRight && <XCircle className="w-4 h-4" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-emerald-700 dark:text-emerald-400 font-bold">
                        Correct Answer: Option ({item.question.correctAnswer}) - {item.question.options.find(o => o.id === item.question.correctAnswer)?.text}
                      </strong>
                      <button
                        onClick={() => setActiveMistakeReattempt(item.id)}
                        className="px-3 py-1 rounded-lg bg-navy-700 hover:bg-navy-800 text-white font-semibold flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reattempt Question</span>
                      </button>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.question.explanation.correctReason}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-10 text-center space-y-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Zero pending mistakes!
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Any incorrect choices you make in practice mode will automatically appear here for rapid revision.
            </p>
          </div>
        )}
      </div>

      {/* Corrected / Mastered Items Section */}
      {correctedMistakes.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Mastered Mistakes ({correctedMistakes.length})
          </h2>

          <div className="space-y-2">
            {correctedMistakes.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">
                    {item.question.questionText}
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                    Mastered &bull; Correct Answer: Option {item.question.correctAnswer}
                  </span>
                </div>
                <button
                  onClick={() => removeMistake(item.question.id)}
                  className="text-slate-400 hover:text-red-500 p-1"
                  title="Remove from history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
