import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle2, XCircle, Edit3, ShieldAlert, Check, X, AlertTriangle, ArrowRight, Zap } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

interface AIExplanationItem {
  id: string;
  questionText: string;
  exam: string;
  generatedReason: string;
  identifiedDiscrepancy?: string;
  status: 'Pending Review' | 'Approved' | 'Rejected';
  confidenceScore: number;
}

export const AdminAIContentPage: React.FC = () => {
  const [items, setItems] = useState<AIExplanationItem[]>([]);

  const [toast, setToast] = useState('');
  const [editingItem, setEditingItem] = useState<AIExplanationItem | null>(null);
  const [editedReason, setEditedReason] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleApprove = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Approved' } : item))
    );
    showToast('Explanation approved and tagged as Faculty Verified!');
  };

  const handleReject = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Rejected' } : item))
    );
    showToast('AI draft rejected and queued for human re-curation.');
  };

  const handleOpenEdit = (item: AIExplanationItem) => {
    setEditingItem(item);
    setEditedReason(item.generatedReason);
  };

  const handleSaveCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === editingItem.id
          ? { ...item, generatedReason: editedReason, status: 'Approved' }
          : item
      )
    );
    showToast('Correction applied and explanation approved.');
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
            Human-in-the-Loop Quality Assurance
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            AI Explanations Verification Queue
          </h1>
          <p className="text-xs text-slate-400">
            Verify and approve pedagogical rationale drafted by AI models before surfacing them to students.
          </p>
        </div>

        <Link
          to="/admin/pipeline"
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all shrink-0"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Automatic Pipeline Desk</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Strict Policy Banner */}
      <div className="p-3.5 bg-amber-950/40 border border-amber-800/80 rounded-2xl text-xs text-amber-200 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-amber-300 font-bold mb-0.5">
            Institutional Verification Rule:
          </strong>
          <span>
            Unverified AI explanations are held in quarantine until human editorial approval. Official gazette keys are maintained with strict distinct badges to prevent student confusion.
          </span>
        </div>
      </div>

      {toast && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Review Cards */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
            <Sparkles className="w-12 h-12 text-slate-500 mx-auto opacity-40" />
            <h4 className="text-sm font-bold text-white">No AI Explanations Awaiting Review</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              When question papers are processed through the PDF pipeline, AI-generated pedagogical rationales will appear here for editorial inspection and faculty approval.
            </p>
          </div>
        ) : (
          items.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-amber-400">
                  {item.exam}
                </span>
                <span className="text-xs text-slate-400">AI Confidence: {item.confidenceScore}%</span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  item.status === 'Approved'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : item.status === 'Rejected'
                    ? 'bg-red-950 text-red-300 border border-red-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}
              >
                {item.status}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-white">
              {item.questionText}
            </h3>

            <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70 space-y-1 text-xs">
              <span className="font-bold text-amber-400 block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Proposed AI Explanation Rationale:
              </span>
              <p className="text-slate-200 leading-relaxed font-normal">
                {item.generatedReason}
              </p>
            </div>

            {/* Verification Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(item)}
                className="px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit & Correct</span>
              </button>
              <button
                onClick={() => handleReject(item.id)}
                className="px-3 py-1.5 rounded-xl bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 text-xs font-bold flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reject Draft</span>
              </button>
              <button
                onClick={() => handleApprove(item.id)}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve for Live Users</span>
              </button>
            </div>
          </div>
        ))
      )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <Modal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          title="Review and Correct Explanation Rationale"
          maxWidth="lg"
        >
          <form onSubmit={handleSaveCorrection} className="space-y-4 text-xs">
            <h4 className="font-bold text-white text-sm">
              {editingItem.questionText}
            </h4>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Verified Faculty Rationale & Source Notes
              </label>
              <textarea
                rows={4}
                value={editedReason}
                onChange={(e) => setEditedReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                Apply Correction & Approve
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
