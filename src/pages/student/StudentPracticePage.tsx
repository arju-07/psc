import React, { useState, useMemo } from 'react';
import { mockQuestions, mockExams } from '../../data/mockData';
import { InteractiveMCQPlayer } from '../../components/mcq/InteractiveMCQPlayer';
import { BookOpenCheck, Filter, Sparkles, Layers, SlidersHorizontal } from 'lucide-react';

export const StudentPracticePage: React.FC = () => {
  const [selectedExamSlug, setSelectedExamSlug] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredQuestions = useMemo(() => {
    return mockQuestions.filter((q) => {
      if (selectedExamSlug !== 'all' && q.examSlug !== selectedExamSlug) return false;
      if (selectedSubject !== 'all' && q.subject !== selectedSubject) return false;
      if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
      return true;
    });
  }, [selectedExamSlug, selectedSubject, selectedDifficulty]);

  const uniqueSubjects = Array.from(new Set(mockQuestions.map((q) => q.subject)));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-100 dark:bg-slate-800 text-navy-800 dark:text-sky-300 text-xs font-semibold">
            <BookOpenCheck className="w-3.5 h-3.5" />
            <span>Instant Evaluation Practice Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Topic-wise Question Practice
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select an answer to immediately reveal official validation, distractor breakdown, and high-yield facts.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Examination:</span>
            <select
              value={selectedExamSlug}
              onChange={(e) => setSelectedExamSlug(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none font-medium"
            >
              <option value="all">All Examinations</option>
              {mockExams.map((e) => (
                <option key={e.id} value={e.slug}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none font-medium"
            >
              <option value="all">All Subjects</option>
              {uniqueSubjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none font-medium"
            >
              <option value="all">Any Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <span className="text-slate-400 font-medium">
          {filteredQuestions.length} Questions Available
        </span>
      </div>

      {/* Interactive MCQ Component */}
      {filteredQuestions.length > 0 ? (
        <InteractiveMCQPlayer
          questions={filteredQuestions}
          title="Interactive MCQ Practice"
          mode="learning"
        />
      ) : (
        <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <BookOpenCheck className="w-12 h-12 text-slate-400 mx-auto opacity-30" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Questions in Question Bank Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Questions verified and published from previous-year question papers will appear here for topic-wise practice.
          </p>
        </div>
      )}
    </div>
  );
};
