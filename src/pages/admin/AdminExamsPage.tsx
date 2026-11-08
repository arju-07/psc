import React, { useState } from 'react';
import { mockExams, mockCategories } from '../../data/mockData';
import { Exam } from '../../types';
import { Modal } from '../../components/common/Modal';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Archive,
  Search,
  ExternalLink,
  Eye,
  Check,
  X
} from 'lucide-react';

export const AdminExamsPage: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Kerala PSC');
  const [shortDescription, setShortDescription] = useState('');
  const [officialUrl, setOfficialUrl] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [examPattern, setExamPattern] = useState('');

  const filtered = exams.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleOpenAdd = () => {
    setEditingExam(null);
    setName('');
    setCategory('Kerala PSC');
    setShortDescription('');
    setOfficialUrl('https://keralapsc.gov.in');
    setEligibility('Graduation in any discipline');
    setExamPattern('100 Marks, 75 Minutes');
    setModalOpen(true);
  };

  const handleOpenEdit = (exam: Exam) => {
    setEditingExam(exam);
    setName(exam.name);
    setCategory(exam.category);
    setShortDescription(exam.shortDescription);
    setOfficialUrl(exam.officialWebsiteUrl || '');
    setEligibility(exam.eligibility);
    setExamPattern(exam.examPattern);
    setModalOpen(true);
  };

  const togglePublish = (id: string) => {
    setExams((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const next = !e.published;
          showToast(`Exam status toggled to ${next ? 'Published' : 'Draft / Unpublished'}.`);
          return { ...e, published: next };
        }
        return e;
      })
    );
  };

  const handleDelete = (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
    showToast('Examination deleted.');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingExam) {
      setExams((prev) =>
        prev.map((item) =>
          item.id === editingExam.id
            ? {
                ...item,
                name,
                category,
                shortDescription,
                officialWebsiteUrl: officialUrl,
                eligibility,
                examPattern,
              }
            : item
        )
      );
      showToast('Examination details updated.');
    } else {
      const newExam: Exam = {
        id: `exam-${Date.now()}`,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        category,
        categorySlug: category.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        shortDescription,
        paperCount: 0,
        practiceQuestionsCount: 0,
        isPopular: false,
        overview: shortDescription,
        eligibility,
        examPattern,
        officialWebsiteUrl: officialUrl,
        subjects: [],
        importantTopics: [],
        published: true,
      };
      setExams((prev) => [newExam, ...prev]);
      showToast('New examination catalogue entry created.');
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
            Catalogue Management
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            Examinations Registry ({exams.length})
          </h1>
          <p className="text-xs text-slate-400">
            Publish, edit syllabus patterns, add official links, and configure target exams.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Examination</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
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
            placeholder="Search examinations by title or category..."
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
                <th className="py-3 px-4 font-semibold">Exam Title</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Papers</th>
                <th className="py-3 px-4 font-semibold">MCQs</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">{item.name}</span>
                    <span className="text-[11px] text-slate-400 truncate max-w-xs block">
                      {item.shortDescription}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[11px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-semibold">{item.paperCount}</td>
                  <td className="py-3.5 px-4 text-slate-300 font-semibold">
                    {item.practiceQuestionsCount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => togglePublish(item.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                        item.published
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.published ? 'Published' : 'Draft / Hidden'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Edit Exam"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800"
                        title="Delete Exam"
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

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingExam ? 'Edit Examination' : 'Add Examination to Catalogue'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Examination Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kerala PSC Company Board Assistant"
              className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Category Stream</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none font-medium"
              >
                {mockCategories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Official Website Link</label>
              <input
                type="text"
                value={officialUrl}
                onChange={(e) => setOfficialUrl(e.target.value)}
                placeholder="https://keralapsc.gov.in"
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Short Description</label>
            <textarea
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Highlight post designation, vacancies, or cadre level..."
              className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Eligibility Criteria</label>
              <input
                type="text"
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                placeholder="e.g. Pass in SSLC / Graduation"
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Exam Pattern & Marks</label>
              <input
                type="text"
                value={examPattern}
                onChange={(e) => setExamPattern(e.target.value)}
                placeholder="e.g. 100 Qs, 75 mins, -0.33 marking"
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none"
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
              {editingExam ? 'Save Changes' : 'Create Examination'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
