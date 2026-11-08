import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockExams } from '../../data/mockData';
import { PYQPaper, VerificationStatus } from '../../types';
import { Modal } from '../../components/common/Modal';
import { PdfPreviewModal } from '../../components/paper/PdfPreviewModal';
import { ResumableUploader } from '../../components/admin/ResumableUploader';
import {
  FileText,
  Upload,
  Plus,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Edit2,
  Search,
  Filter,
  Layers,
  Archive,
  Zap,
  ArrowRight,
  HardDrive
} from 'lucide-react';

export const AdminPapersPage: React.FC = () => {
  const [papers, setPapers] = useState<PYQPaper[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewPaper, setPreviewPaper] = useState<PYQPaper | null>(null);
  const [toast, setToast] = useState('');

  const filtered = papers.filter((p) => {
    if (statusFilter !== 'all' && p.verificationStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.examName.toLowerCase().includes(q) || p.paperCode.toLowerCase().includes(q);
    }
    return true;
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleTogglePublish = (id: string) => {
    setPapers((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.published;
          showToast(`Paper ${p.paperCode} ${next ? 'published' : 'unpublished'}.`);
          return { ...p, published: next };
        }
        return p;
      })
    );
  };

  const handleChangeStatus = (id: string, newStatus: VerificationStatus) => {
    setPapers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, verificationStatus: newStatus } : p))
    );
    showToast(`Verification status changed to ${newStatus}.`);
  };

  const handleDelete = (id: string) => {
    setPapers((prev) => prev.filter((p) => p.id !== id));
    showToast('Paper archived / removed.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
            Document Repository
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            Previous Year Papers ({papers.length})
          </h1>
          <p className="text-xs text-slate-400">
            Index official question paper PDFs of any size with chunked resumable transfers and gazette keys.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/admin/pipeline"
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>11-Step Pipeline Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-md transition-all shrink-0"
          >
            <Upload className="w-4 h-4" />
            <span>Upload PDFs (Unlimited Size)</span>
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by exam or paper code..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-slate-400 font-semibold shrink-0">Verification:</span>
          {['all', 'verified', 'pending', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl font-semibold capitalize shrink-0 transition-colors ${
                statusFilter === status
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Papers Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                <th className="py-3 px-4 font-semibold">Exam Title</th>
                <th className="py-3 px-4 font-semibold">Code & Year</th>
                <th className="py-3 px-4 font-semibold">Language</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Visibility</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-500">
                      <FileText className="w-10 h-10 opacity-30" />
                      <p className="text-sm font-medium">No question papers uploaded yet.</p>
                      <p className="text-xs">Use the Upload button above to add PYQ papers.</p>
                    </div>
                  </td>
                </tr>
              )}
              {filtered.map((paper) => (
                <tr key={paper.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">{paper.examName}</span>
                    <span className="text-[11px] text-slate-400">{paper.subject}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-slate-200 block">{paper.paperCode}</span>
                    <span className="text-[11px] text-slate-400">{paper.year} &bull; {paper.fileSize}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{paper.language}</td>
                  <td className="py-3.5 px-4">
                    <select
                      value={paper.verificationStatus}
                      onChange={(e) => handleChangeStatus(paper.id, e.target.value as any)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-md border outline-none ${
                        paper.verificationStatus === 'verified'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : paper.verificationStatus === 'rejected'
                          ? 'bg-red-950 text-red-300 border-red-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}
                    >
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleTogglePublish(paper.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        paper.published
                          ? 'bg-slate-800 text-emerald-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {paper.published ? 'Live' : 'Hidden'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewPaper(paper)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Preview PDF"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(paper.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800"
                        title="Archive / Remove"
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

      {/* Unlimited Resumable Upload Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Previous Year Question Papers (Unlimited Size)"
        maxWidth="2xl"
      >
        <div className="space-y-4">
          <ResumableUploader
            onUploadStarted={() => {
              showToast('Upload batch queued! Document is streaming into the background pipeline.');
              setUploadModalOpen(false);
            }}
          />
        </div>
      </Modal>

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        paper={previewPaper}
        isOpen={!!previewPaper}
        onClose={() => setPreviewPaper(null)}
      />
    </div>
  );
};
