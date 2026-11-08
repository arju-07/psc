import React, { useState } from 'react';
import { mockCategories } from '../../data/mockData';
import { ExamCategory } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Layers, Plus, Edit2, Trash2, CheckCircle2, Archive, Search } from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<ExamCategory[]>(mockCategories);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExamCategory | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [notification, setNotification] = useState('');

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: ExamCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category deleted successfully.');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? { ...c, name, description } : c))
      );
      showToast('Category updated successfully.');
    } else {
      const newCat: ExamCategory = {
        id: `cat-${Date.now()}`,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        iconName: 'GraduationCap',
        description,
        examCount: 0,
      };
      setCategories((prev) => [newCat, ...prev]);
      showToast('New category added to catalogue.');
    }
    setModalOpen(false);
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
            Hierarchy Management
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            Examination Categories ({categories.length})
          </h1>
          <p className="text-xs text-slate-400">
            Define high-level syllabus streams such as Kerala PSC, Teaching, Police, Banking, and SSC.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Search */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                <th className="py-3 px-4 font-semibold">Category Name</th>
                <th className="py-3 px-4 font-semibold">Slug</th>
                <th className="py-3 px-4 font-semibold">Description</th>
                <th className="py-3 px-4 font-semibold">Linked Exams</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>{cat.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{cat.slug}</td>
                  <td className="py-3.5 px-4 text-slate-300 max-w-sm truncate">{cat.description}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-bold text-[11px]">
                      {cat.examCount} Exams
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                        title="Delete Category"
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

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Edit Examination Category' : 'Create New Category'}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Category Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Technical & Engineering Recruitment"
              className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of examinations under this stream..."
              className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:ring-2 focus:ring-amber-500 resize-none"
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
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
