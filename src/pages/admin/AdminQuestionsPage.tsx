import React, { useState } from 'react';
import { mockExams } from '../../data/mockData';
import { MCQQuestion, QuestionOption } from '../../types';
import { Modal } from '../../components/common/Modal';
import {
  Database,
  Plus,
  Upload,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  FileSpreadsheet,
  Check,
  Eye,
  Sparkles
} from 'lucide-react';

export const AdminQuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [search, setSearch] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState<MCQQuestion | null>(null);
  const [toast, setToast] = useState('');

  // Form states
  const [questionText, setQuestionText] = useState('');
  const [questionMalayalam, setQuestionMalayalam] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>('B');
  const [correctReason, setCorrectReason] = useState('');
  const [relatedTopic, setRelatedTopic] = useState('');
  const [sourcePaper, setSourcePaper] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [examName, setExamName] = useState('Kerala PSC LDC');
  const [subject, setSubject] = useState('Indian Polity & Constitution');

  const filtered = questions.filter((q) =>
    q.questionText.toLowerCase().includes(search.toLowerCase()) ||
    q.subject.toLowerCase().includes(search.toLowerCase()) ||
    q.examName.toLowerCase().includes(search.toLowerCase())
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    const newQ: MCQQuestion = {
      id: `q-${Date.now()}`,
      examSlug: 'kerala-psc-ldc',
      examName,
      subject,
      topic: relatedTopic || 'General Revision',
      difficulty,
      questionText,
      questionMalayalam,
      options: [
        { id: 'A', text: optA || 'Option A text' },
        { id: 'B', text: optB || 'Option B text' },
        { id: 'C', text: optC || 'Option C text' },
        { id: 'D', text: optD || 'Option D text' },
      ],
      correctAnswer,
      explanation: {
        correctReason: correctReason || 'Verified via official examination key.',
        facts: ['High-yield question recorded into core question bank.'],
        relatedTopic: relatedTopic || 'General Studies',
        source: sourcePaper || 'Official PSC Notification',
        isReviewed: true,
      },
      verificationStatus: 'verified',
      isVerifiedOfficialKey: true,
      sourcePaperName: sourcePaper || 'PSC Gazette 2024',
    };

    setQuestions((prev) => [newQ, ...prev]);
    showToast('New MCQ added to the institutional question bank!');
    setCreateModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    showToast('Question removed from repository.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
            Institutional Item Bank
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            Question Bank Management ({questions.length})
          </h1>
          <p className="text-xs text-slate-400">
            Curate MCQs with comprehensive distractor rationale, gazette citations, and Malayalam translations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setImportModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Bulk CSV / Excel Import</span>
          </button>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-md transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Question</span>
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Search Toolbar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions by text, subject or exam..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                <th className="py-3 px-4 font-semibold">Question Text</th>
                <th className="py-3 px-4 font-semibold">Exam & Subject</th>
                <th className="py-3 px-4 font-semibold">Correct Option</th>
                <th className="py-3 px-4 font-semibold">Difficulty</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-500">
                      <Database className="w-10 h-10 opacity-30" />
                      <p className="text-sm font-medium">No questions in the bank yet.</p>
                      <p className="text-xs">Use the "Add Question" button above or verify questions from PDF uploads.</p>
                    </div>
                  </td>
                </tr>
              )}
              {filtered.map((q) => (
                <tr key={q.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 max-w-md">
                    <span className="font-semibold text-white line-clamp-1 block">
                      {q.questionText}
                    </span>
                    {q.questionMalayalam && (
                      <span className="text-[11px] text-slate-400 truncate block">
                        {q.questionMalayalam}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-200 block font-medium">{q.examName}</span>
                    <span className="text-[11px] text-slate-400">{q.subject}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="w-6 h-6 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold flex items-center justify-center">
                      {q.correctAnswer}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 capitalize text-slate-300">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        q.difficulty === 'easy'
                          ? 'bg-emerald-950 text-emerald-300'
                          : q.difficulty === 'medium'
                          ? 'bg-amber-950 text-amber-300'
                          : 'bg-red-950 text-red-300'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Verified
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewQuestion(q)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="View Full Item"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Question Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Add Question with Detailed Explanations"
        maxWidth="xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Question Text (English)</label>
            <textarea
              rows={2}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="e.g. Which Constitutional Amendment lowered the voting age from 21 to 18 years?"
              className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Malayalam Translation (Optional)</label>
            <input
              type="text"
              value={questionMalayalam}
              onChange={(e) => setQuestionMalayalam(e.target.value)}
              placeholder="വോട്ടവകാശ പ്രായം 21-ൽ നിന്ന് 18 ആക്കി കുറച്ച ഭരണഘടനാ ഭേദഗതി ഏത്?"
              className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Option A</label>
              <input
                type="text"
                value={optA}
                onChange={(e) => setOptA(e.target.value)}
                placeholder="Option A text"
                className="w-full p-2 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Option B</label>
              <input
                type="text"
                value={optB}
                onChange={(e) => setOptB(e.target.value)}
                placeholder="Option B text"
                className="w-full p-2 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Option C</label>
              <input
                type="text"
                value={optC}
                onChange={(e) => setOptC(e.target.value)}
                placeholder="Option C text"
                className="w-full p-2 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Option D</label>
              <input
                type="text"
                value={optD}
                onChange={(e) => setOptD(e.target.value)}
                placeholder="Option D text"
                className="w-full p-2 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Correct Answer</label>
              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value as any)}
                className="w-full p-2 rounded-xl border border-slate-700 bg-slate-800 text-white font-bold outline-none"
              >
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full p-2 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Exam</label>
              <input
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Detailed Explanation & Distractor Analysis</label>
            <textarea
              rows={3}
              value={correctReason}
              onChange={(e) => setCorrectReason(e.target.value)}
              placeholder="Explain why the correct answer is right and why other alternatives are distractors..."
              className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
            >
              Add Question
            </button>
          </div>
        </form>
      </Modal>

      {/* Bulk CSV Import Modal */}
      <Modal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="Bulk Import Questions (CSV / Excel)"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-6 border-2 border-dashed border-slate-700 rounded-2xl text-center space-y-2 bg-slate-800/40">
            <FileSpreadsheet className="w-8 h-8 text-emerald-400 mx-auto" />
            <span className="font-semibold text-white block">
              Drag & Drop your questions .csv or .xlsx template
            </span>
            <p className="text-[11px] text-slate-400">
              Columns: question_text, opt_a, opt_b, opt_c, opt_d, answer, explanation, subject, topic
            </p>
          </div>

          <button
            onClick={() => {
              showToast('Simulated 50 questions imported from Kerala_PSC_Questions_Batch1.csv');
              setImportModalOpen(false);
            }}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
          >
            Simulate Bulk Import (50 Questions)
          </button>
        </div>
      </Modal>

      {/* Question Inspect Modal */}
      {previewQuestion && (
        <Modal
          isOpen={!!previewQuestion}
          onClose={() => setPreviewQuestion(null)}
          title={`Question Inspector: #${previewQuestion.id}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                {previewQuestion.examName} &bull; {previewQuestion.subject}
              </span>
              <h4 className="text-sm font-bold text-white">
                {previewQuestion.questionText}
              </h4>
              {previewQuestion.questionMalayalam && (
                <p className="text-slate-400 font-medium">{previewQuestion.questionMalayalam}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {previewQuestion.options.map((opt) => (
                <div
                  key={opt.id}
                  className={`p-2.5 rounded-xl border ${
                    opt.id === previewQuestion.correctAnswer
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold'
                      : 'border-slate-700 bg-slate-800 text-slate-300'
                  }`}
                >
                  Option {opt.id}: {opt.text}
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 space-y-1">
              <strong className="text-amber-400 block">Explanation:</strong>
              <p className="text-slate-300 leading-relaxed">
                {previewQuestion.explanation.correctReason}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
