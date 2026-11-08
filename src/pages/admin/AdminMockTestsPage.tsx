import React, { useState } from 'react';
import { mockExams } from '../../data/mockData';
import { MockTest } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Timer, Plus, Edit2, Trash2, CheckCircle2, Clock, Award, ShieldAlert } from 'lucide-react';

export const AdminMockTestsPage: React.FC = () => {
  const [tests, setTests] = useState<MockTest[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [examName, setExamName] = useState('Kerala PSC LDC');
  const [durationMinutes, setDurationMinutes] = useState(75);
  const [totalMarks, setTotalMarks] = useState(100);
  const [totalQuestions, setTotalQuestions] = useState(100);
  const [negativeMarking, setNegativeMarking] = useState(0.33);
  const [passMarks, setPassMarks] = useState(50);
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTest: MockTest = {
      id: `mock-${Date.now()}`,
      title,
      examSlug: 'kerala-psc-ldc',
      examName,
      category: 'Kerala PSC',
      durationMinutes,
      totalMarks,
      totalQuestions,
      negativeMarking,
      passMarks,
      difficulty,
      status: 'available',
      questions: [],
      instructions: ['Read instructions carefully.', 'Negative marking applies.'],
    };

    setTests((prev) => [newTest, ...prev]);
    showToast(`Mock test "${title}" configured and published.`);
    setModalOpen(false);
    setTitle('');
  };

  const handleDelete = (id: string) => {
    setTests((prev) => prev.filter((t) => t.id !== id));
    showToast('Mock test removed.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
            Simulation Controller
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            Mock Test System Management ({tests.length})
          </h1>
          <p className="text-xs text-slate-400">
            Design timed model examinations, configure negative marking penalties, and publish statewide tests.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Mock Test</span>
        </button>
      </div>

      {toast && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Grid of Tests */}
      {tests.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
          <Timer className="w-12 h-12 text-slate-500 mx-auto opacity-40" />
          <h4 className="text-sm font-bold text-white">No Mock Tests Configured</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Create timed mock examinations with negative marking parameters using the "+ Create Mock Test" button above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-amber-400">
                    {test.category}
                  </span>
                  <span className="text-emerald-400 text-[10px] font-bold">
                    {test.status === 'available' ? 'Live' : 'Scheduled'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">
                  {test.title}
                </h3>
                <p className="text-xs text-slate-400">
                  Target: {test.examName}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> {test.durationMinutes} mins
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-slate-500" /> {test.totalMarks} Marks
                  </span>
                  <span>{test.totalQuestions} Questions</span>
                  <span className="text-red-400">-{test.negativeMarking} Penalty</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Pass: {test.passMarks} Marks</span>
                <button
                  onClick={() => handleDelete(test.id)}
                  className="text-slate-500 hover:text-red-400 p-1"
                  title="Delete Test"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Mock Examination"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Test Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Kerala PSC LDC Statewide Grand Mock 02"
              className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Examination</label>
              <select
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none"
              >
                {mockExams.map((e) => (
                  <option key={e.id} value={e.name}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Duration (Minutes)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
                className="w-full p-2 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Total Marks</label>
              <input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(parseInt(e.target.value, 10))}
                className="w-full p-2 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Negative Mark</label>
              <input
                type="number"
                step="0.01"
                value={negativeMarking}
                onChange={(e) => setNegativeMarking(parseFloat(e.target.value))}
                className="w-full p-2 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Pass Marks</label>
              <input
                type="number"
                value={passMarks}
                onChange={(e) => setPassMarks(parseInt(e.target.value, 10))}
                className="w-full p-2 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none"
              />
            </div>
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
              Publish Mock Test
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
