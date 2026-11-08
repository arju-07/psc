import React, { useState } from 'react';
import { PYQPaper } from '../../types';
import { Modal } from '../../components/common/Modal';
import { KeyRound, Plus, Edit2, CheckCircle2, ShieldCheck, Search, FileText, Check } from 'lucide-react';

export const AdminAnswerKeysPage: React.FC = () => {
  const [papers, setPapers] = useState<PYQPaper[]>([]);
  const [search, setSearch] = useState('');
  const [manualEntryModalOpen, setManualEntryModalOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<PYQPaper | null>(null);
  const [toast, setToast] = useState('');

  // Sample manual answer entry grid 1-20
  const [manualAnswers, setManualAnswers] = useState<Record<number, string>>({
    1: 'B', 2: 'B', 3: 'C', 4: 'B', 5: 'D', 6: 'B', 7: 'A', 8: 'B', 9: 'C', 10: 'A',
    11: 'D', 12: 'B', 13: 'A', 14: 'C', 15: 'B', 16: 'D', 17: 'A', 18: 'C', 19: 'B', 20: 'D'
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleOpenManualEntry = (paper: PYQPaper) => {
    setSelectedPaper(paper);
    setManualEntryModalOpen(true);
  };

  const handleSaveManualAnswers = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPaper) {
      setPapers((prev) =>
        prev.map((p) => (p.id === selectedPaper.id ? { ...p, hasOfficialAnswerKey: true } : p))
      );
      showToast(`Final gazette answer key mapped for ${selectedPaper.paperCode}`);
    }
    setManualEntryModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
            Gazette Verification
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            Answer Key Management
          </h1>
          <p className="text-xs text-slate-400">
            Publish official final answer keys, enter manual keys, and resolve representations.
          </p>
        </div>
      </div>

      {toast && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Answer Key Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                <th className="py-3 px-4 font-semibold">Paper Code</th>
                <th className="py-3 px-4 font-semibold">Associated Examination</th>
                <th className="py-3 px-4 font-semibold">Year</th>
                <th className="py-3 px-4 font-semibold">Answer Key Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {papers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-500">
                      <KeyRound className="w-10 h-10 opacity-30" />
                      <p className="text-sm font-medium">No papers available yet.</p>
                      <p className="text-xs">Upload question papers first to link answer keys.</p>
                    </div>
                  </td>
                </tr>
              )}
              {papers.map((paper) => (
                <tr key={paper.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                    {paper.paperCode}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-white">{paper.examName}</td>
                  <td className="py-3.5 px-4 text-slate-400">{paper.year}</td>
                  <td className="py-3.5 px-4">
                    {paper.hasOfficialAnswerKey ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                        <Check className="w-3 h-3" /> Gazette Final Key
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/40">
                        Pending Key Link
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenManualEntry(paper)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                    >
                      {paper.hasOfficialAnswerKey ? 'Edit Key' : 'Enter Official Key'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Key Entry Modal */}
      {selectedPaper && (
        <Modal
          isOpen={manualEntryModalOpen}
          onClose={() => setManualEntryModalOpen(false)}
          title={`Gazette Answer Key Entry: ${selectedPaper.paperCode}`}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveManualAnswers} className="space-y-4 text-xs">
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-slate-300 space-y-1">
              <span className="font-bold text-white block">{selectedPaper.examName} ({selectedPaper.year})</span>
              <p className="text-[11px] text-slate-400">
                Enter the confirmed official single-letter answers (A, B, C, D) corresponding to each question number.
              </p>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-60 overflow-y-auto p-1">
              {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                <div key={num} className="p-2 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between">
                  <span className="font-bold text-slate-400 text-xs">Q{num}</span>
                  <select
                    value={manualAnswers[num] || 'A'}
                    onChange={(e) =>
                      setManualAnswers({ ...manualAnswers, [num]: e.target.value })
                    }
                    className="bg-slate-900 border border-slate-700 text-amber-400 font-bold rounded p-1 text-xs outline-none"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setManualEntryModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                Save & Link Answer Key
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
