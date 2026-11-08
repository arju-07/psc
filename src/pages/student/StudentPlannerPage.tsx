import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockExams } from '../../data/mockData';
import { StudyPlanItem } from '../../types';
import {
  CalendarCheck,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Clock,
  Target,
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const StudentPlannerPage: React.FC = () => {
  const { studyPlan, addStudyPlanItem, toggleStudyPlanStatus, deleteStudyPlanItem } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const [examSlug, setExamSlug] = useState('kerala-psc-ldc');
  const [subject, setSubject] = useState('Indian Polity & Constitution');
  const [topic, setTopic] = useState('');
  const [targetDate, setTargetDate] = useState('2026-11-10');
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('high');

  const completedCount = studyPlan.filter((p) => p.status === 'completed').length;
  const progressPct = studyPlan.length > 0 ? Math.round((completedCount / studyPlan.length) * 100) : 0;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const matchedExam = mockExams.find((e) => e.slug === examSlug);
    addStudyPlanItem({
      examSlug,
      examName: matchedExam ? matchedExam.name : 'Kerala PSC Exam',
      subject,
      topic,
      targetDate,
      estimatedMinutes,
      status: 'pending',
      priority,
    });

    setTopic('');
    setIsAdding(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-100 dark:bg-slate-800 text-navy-800 dark:text-sky-300 text-xs font-semibold">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Target Execution & Tracking</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Study Planner & Target Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Organize daily syllabus milestones, set revision schedules, and track completed topics systematically.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2.5 rounded-xl bg-navy-700 hover:bg-navy-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Study Goal</span>
        </button>
      </div>

      {/* Progress Metric Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            Syllabus Target Completion Rate
          </span>
          <span className="font-extrabold text-navy-700 dark:text-sky-400">
            {completedCount} of {studyPlan.length} Targets Completed ({progressPct}%)
          </span>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Add New Goal Form */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-navy-500/40 p-5 space-y-4 shadow-md animate-fadeIn"
        >
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Schedule New Study Target
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Target Examination</label>
              <select
                value={examSlug}
                onChange={(e) => setExamSlug(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                {mockExams.map((e) => (
                  <option key={e.id} value={e.slug}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                placeholder="e.g. Kerala History, Science, English"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-500 font-semibold mb-1">Topic / Milestone Description</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                placeholder="e.g. Fundamental Rights deep dive (Art 12 - 35) + 50 MCQs"
                required
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Target Completion Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-slate-500 font-semibold mb-1">Duration (Mins)</label>
                <input
                  type="number"
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(parseInt(e.target.value, 10))}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  min="15"
                  step="15"
                />
              </div>

              <div className="flex-1">
                <label className="block text-slate-500 font-semibold mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-navy-700 hover:bg-navy-800 text-white text-xs font-bold"
            >
              Save Target
            </button>
          </div>
        </form>
      )}

      {/* Target Items List */}
      <div className="space-y-3">
        {studyPlan.length === 0 && (
          <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <CalendarCheck className="w-10 h-10 text-slate-400 mx-auto opacity-40" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Your study planner is empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add your target syllabus milestones, revision dates, and question targets above to stay on track.
            </p>
          </div>
        )}
        {studyPlan.map((item) => {
          const isDone = item.status === 'completed';
          return (
            <div
              key={item.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl border p-4 sm:p-5 flex items-start justify-between gap-4 transition-all ${
                isDone
                  ? 'border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/20 opacity-70'
                  : 'border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <button
                  onClick={() => toggleStudyPlanStatus(item.id)}
                  className="mt-1 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-navy-100 text-navy-800 dark:bg-slate-800 dark:text-sky-300">
                      {item.examName}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{item.subject}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                        item.priority === 'high'
                          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>

                  <h4
                    className={`text-sm font-semibold text-slate-900 dark:text-white ${
                      isDone ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {item.topic}
                  </h4>

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Due: {item.targetDate}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {item.estimatedMinutes} mins
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteStudyPlanItem(item.id)}
                className="text-slate-400 hover:text-red-500 p-1 shrink-0"
                title="Delete Goal"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
