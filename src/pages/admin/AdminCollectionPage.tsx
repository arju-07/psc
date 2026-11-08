import React, { useState } from 'react';
import { PaperCollectionJob } from '../../types';
import { Modal } from '../../components/common/Modal';
import {
  DownloadCloud,
  Plus,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Layers,
  Search
} from 'lucide-react';

export const AdminCollectionPage: React.FC = () => {
  const [jobs, setJobs] = useState<PaperCollectionJob[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceName.trim() || !sourceUrl.trim()) return;

    const newJob: PaperCollectionJob = {
      id: `job-${Date.now()}`,
      sourceName,
      sourceUrl,
      status: 'Pending Review',
      discoveredCount: 0,
      approvedCount: 0,
      lastRunDate: 'Just now',
    };

    setJobs((prev) => [newJob, ...prev]);
    showToast(`Source crawler "${sourceName}" queued for automated ingestion.`);
    setModalOpen(false);
    setSourceName('');
    setSourceUrl('');
  };

  const handleTriggerRun = (id: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: 'Running' } : j))
    );
    showToast('Collection job launched in background.');
    setTimeout(() => {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === id
            ? { ...j, status: 'Completed', discoveredCount: j.discoveredCount + 4 }
            : j
        )
      );
      showToast('Crawler finished: 4 new PDF booklets discovered.');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
            Automated Ingestion Pipelines
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            Public Paper Collection & Scraping Monitor
          </h1>
          <p className="text-xs text-slate-400">
            Monitor automated discovery crawlers across official government gazette bulletin boards.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Approved Public Source</span>
        </button>
      </div>

      {toast && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Grid of Crawlers */}
      {jobs.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
          <DownloadCloud className="w-12 h-12 text-slate-500 mx-auto opacity-40" />
          <h4 className="text-sm font-bold text-white">No Public Source Crawlers Configured</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Configure official government gazette and public PSC repository sources using the "Add Crawler Source" button above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    job.status === 'Completed'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : job.status === 'Running'
                      ? 'bg-sky-950 text-sky-300 border border-sky-800 animate-pulse'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {job.status}
                </span>
                <span className="text-xs text-slate-400 font-mono">Last Run: {job.lastRunDate}</span>
              </div>

              <h3 className="text-base font-bold text-white">
                {job.sourceName}
              </h3>
              <a
                href={job.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-amber-400 hover:underline flex items-center gap-1"
              >
                <span className="truncate">{job.sourceUrl}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs text-slate-300">
                <div className="p-3 bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400 block text-[11px]">Discovered Papers</span>
                  <strong className="text-base text-white">{job.discoveredCount}</strong>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400 block text-[11px]">Approved & Published</span>
                  <strong className="text-base text-emerald-400">{job.approvedCount}</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
              <button
                onClick={() => handleTriggerRun(job.id)}
                disabled={job.status === 'Running'}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Run Ingestion Now</span>
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
        title="Add Approved Public Question Paper Source"
        maxWidth="md"
      >
        <form onSubmit={handleAddSource} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Source Name</label>
            <input
              type="text"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              placeholder="e.g. Kerala Pareeksha Bhavan SET Portal"
              className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Target Crawl Endpoint URL</label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://lbscentre.kerala.gov.in/set"
              className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <p className="text-[11px] text-slate-400">
            Crawlers respect robots.txt and only index publicly downloadable past question papers.
          </p>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
            >
              Add Pipeline
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
