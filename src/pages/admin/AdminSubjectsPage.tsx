import React, { useState } from 'react';
import { mockExams } from '../../data/mockData';
import { ExamSubject, SubjectTopic } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ListTree, Plus, Edit2, Trash2, CheckCircle2, Search, BookOpen, Layers } from 'lucide-react';

export const AdminSubjectsPage: React.FC = () => {
  const [selectedExamSlug, setSelectedExamSlug] = useState('kerala-psc-ldc');
  const [modalOpen, setModalOpen] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [topicName, setTopicName] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [toast, setToast] = useState('');

  const currentExam = mockExams.find((e) => e.slug === selectedExamSlug) || mockExams[0];
  const [subjects, setSubjects] = useState<ExamSubject[]>(currentExam.subjects);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim() || !subjectName) return;

    setSubjects((prev) =>
      prev.map((s) => {
        if (s.name === subjectName) {
          return {
            ...s,
            topics: [
              ...s.topics,
              {
                id: `top-${Date.now()}`,
                name: topicName,
                questionCount,
              },
            ],
          };
        }
        return s;
      })
    );

    showToast(`Topic "${topicName}" added under ${subjectName}.`);
    setTopicName('');
    setModalOpen(false);
  };

  const handleDeleteTopic = (subjectId: string, topicId: string) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id === subjectId) {
          return {
            ...s,
            topics: s.topics.filter((t) => t.id !== topicId),
          };
        }
        return s;
      })
    );
    showToast('Topic deleted from syllabus.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
            Syllabus Architecture
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            Subjects & Topic Weightage
          </h1>
          <p className="text-xs text-slate-400">
            Map granular topics, mark weights, and question distributions per examination syllabus.
          </p>
        </div>

        <button
          onClick={() => {
            setSubjectName(subjects[0]?.name || '');
            setModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Topic</span>
        </button>
      </div>

      {toast && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Exam Selector */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-400">Select Examination:</span>
          <select
            value={selectedExamSlug}
            onChange={(e) => {
              setSelectedExamSlug(e.target.value);
              const found = mockExams.find((x) => x.slug === e.target.value);
              if (found) setSubjects(found.subjects);
            }}
            className="p-2 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none font-medium"
          >
            {mockExams.map((e) => (
              <option key={e.id} value={e.slug}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-amber-400 font-semibold">
          {subjects.length} Core Modules
        </span>
      </div>

      {/* Subjects & Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((sub) => (
          <div
            key={sub.id}
            className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  {sub.name}
                </h3>
                <span className="text-[11px] text-slate-400">{sub.topics.length} Configured Topics</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 text-xs font-bold">
                {sub.totalQuestions} Marks Weight
              </span>
            </div>

            <div className="space-y-2">
              {sub.topics.map((top) => (
                <div
                  key={top.id}
                  className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <span className="text-slate-200 font-medium">{top.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400">~{top.questionCount} Qs</span>
                    <button
                      onClick={() => handleDeleteTopic(sub.id, top.id)}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Topic Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Topic to Syllabus"
        maxWidth="md"
      >
        <form onSubmit={handleAddTopic} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Target Subject Module</label>
            <select
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none font-medium"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Topic Title</label>
            <input
              type="text"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder="e.g. Fundamental Duties (Article 51A) and Swaran Singh Committee"
              className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Estimated Questions Weight</label>
            <input
              type="number"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
              min="1"
              max="100"
              className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
            >
              Add Topic
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
