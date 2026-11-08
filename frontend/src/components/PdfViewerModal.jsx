import React from 'react';
import { X, Download, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';

export default function PdfViewerModal({
  isOpen,
  onClose,
  paper,
  isAnswerKey = false
}) {
  if (!isOpen || !paper) return null;

  const title = isAnswerKey
    ? `Official Final Answer Key - ${paper.paper_code}`
    : `Question Paper Booklet - ${paper.paper_code}`;

  const downloadUrl = isAnswerKey
    ? (paper.answer_key_url || `/api/papers/answer-key/${paper.id}.pdf`)
    : (paper.file_url || `/api/papers/download/${paper.id}.pdf`);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">

        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl text-white ${isAnswerKey ? 'bg-amber-600' : 'bg-emerald-600'}`}>
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-sm sm:max-w-md">
                {title}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {paper.exam_name || paper.session_name} • Year {paper.year}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Open in new tab */}
            <a
              href={downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="Open in new window"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Direct download */}
            <a
              href={downloadUrl}
              download
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
            </a>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Frame */}
        <div className="flex-1 bg-slate-200 dark:bg-slate-950 p-2 sm:p-4 overflow-hidden relative">
          <iframe
            src={`${downloadUrl}#toolbar=1&navpanes=0`}
            className="w-full h-full rounded-xl bg-white shadow-inner border-0"
            title={title}
          />
        </div>

        {/* Modal Footer Note */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Official Archive Attribution: {paper.source_url || 'Kerala Public Service Commission'}</span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">
            Hash: {paper.file_hash?.substring(0, 16)}...
          </span>
        </div>
      </div>
    </div>
  );
}
