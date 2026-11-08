import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { PYQPaper } from '../../types';
import { Download, FileText, CheckCircle2, AlertCircle, Printer, ZoomIn, ZoomOut, Share2, Bookmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface PdfPreviewModalProps {
  paper: PYQPaper | null;
  isOpen: boolean;
  onClose: () => void;
  showAnswerKeyInitial?: boolean;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  paper,
  isOpen,
  onClose,
  showAnswerKeyInitial = false,
}) => {
  const [activeTab, setActiveTab] = useState<'paper' | 'answerKey'>(
    showAnswerKeyInitial ? 'answerKey' : 'paper'
  );
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const { bookmarkedPaperIds, toggleBookmarkPaper } = useAuth();

  if (!paper) return null;

  const isBookmarked = bookmarkedPaperIds.includes(paper.id);

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 4000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      <div className="flex flex-col gap-4">
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-navy-100 dark:bg-navy-900/60 text-navy-800 dark:text-sky-300">
                {paper.category}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Code: <strong className="text-slate-800 dark:text-slate-200">{paper.paperCode}</strong>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Year: {paper.year}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {paper.examName}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBookmarkPaper(paper.id)}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isBookmarked
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-700 dark:text-amber-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Bookmark'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-2 rounded-lg bg-navy-700 hover:bg-navy-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF ({paper.fileSize})</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Simulated download initiated! File <strong>{paper.paperCode}.pdf</strong> ({paper.fileSize}) prepared for offline practice.</span>
            </div>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">Frontend Demo</span>
          </div>
        )}

        {/* View Mode Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('paper')}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'paper'
                  ? 'border-navy-600 text-navy-700 dark:text-sky-400 dark:border-sky-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              Question Paper Preview
            </button>
            <button
              onClick={() => setActiveTab('answerKey')}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'answerKey'
                  ? 'border-navy-600 text-navy-700 dark:text-sky-400 dark:border-sky-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Official Final Answer Key
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-slate-400 text-xs">
            <button title="Zoom in" className="p-1 hover:text-slate-600 dark:hover:text-slate-200">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button title="Zoom out" className="p-1 hover:text-slate-600 dark:hover:text-slate-200">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2">100%</span>
          </div>
        </div>

        {/* Paper Document Preview Simulation Container */}
        <div className="bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 min-h-[460px] max-h-[520px] overflow-y-auto">
          {activeTab === 'paper' ? (
            <div className="bg-white dark:bg-slate-900 shadow-md rounded-lg p-6 sm:p-8 max-w-2xl mx-auto border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-serif leading-relaxed">
              {/* Document Header */}
              <div className="text-center pb-6 border-b-2 border-slate-900 dark:border-slate-300 mb-6">
                <p className="text-xs uppercase font-sans tracking-widest text-slate-500 dark:text-slate-400">
                  Government of Kerala / Examination Authority
                </p>
                <h1 className="text-lg sm:text-xl font-bold uppercase tracking-tight mt-1">
                  {paper.examName}
                </h1>
                <div className="flex flex-wrap justify-between items-center text-xs font-sans mt-3 text-slate-600 dark:text-slate-400">
                  <span>Question Code: <strong>{paper.paperCode}</strong></span>
                  <span>Maximum Marks: <strong>{paper.totalMarks}</strong></span>
                  <span>Duration: <strong>{paper.durationMinutes} Minutes</strong></span>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-xs font-sans bg-slate-50 dark:bg-slate-800/60 p-3 rounded-md mb-6 border border-slate-200 dark:border-slate-700">
                <strong className="block mb-1 text-slate-900 dark:text-white">INSTRUCTIONS TO CANDIDATES:</strong>
                <ol className="list-decimal list-inside space-y-0.5 text-slate-600 dark:text-slate-300">
                  <li>Check whether the Question Paper Booklet contains 100 questions.</li>
                  <li>Each question has four alternative options (A, B, C, D). Darken only one circle in the OMR sheet.</li>
                  <li>Each correct answer carries 1 mark. For each wrong answer, 1/3 mark will be deducted.</li>
                </ol>
              </div>

              {/* Sample Rendered Questions inside PDF preview */}
              <div className="space-y-6 text-sm">
                <div className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
                  <div className="font-semibold text-slate-900 dark:text-white mb-2">
                    1. Who is known as the "Father of the Indian Constitution"?
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                      (ഇന്ത്യൻ ഭരണഘടനയുടെ ശിൽപി / പിതാവ് എന്നറിയപ്പെടുന്നത് ആര്?)
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                    <span>(A) Mahatma Gandhi</span>
                    <span>(B) Dr. B. R. Ambedkar</span>
                    <span>(C) Jawaharlal Nehru</span>
                    <span>(D) Sardar Vallabhbhai Patel</span>
                  </div>
                </div>

                <div className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
                  <div className="font-semibold text-slate-900 dark:text-white mb-2">
                    2. Which social reformer founded the "Sadhu Jana Paripalana Sangham" (SJPS) in 1907?
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                      (1907-ൽ സാധുജന പരിപാലന സംഘം സ്ഥാപിച്ച സാമൂഹിക പരിഷ്കർത്താവ് ആര്?)
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                    <span>(A) Sree Narayana Guru</span>
                    <span>(B) Ayyankali</span>
                    <span>(C) Chattampi Swamikal</span>
                    <span>(D) Vakkom Moulavi</span>
                  </div>
                </div>

                <div className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
                  <div className="font-semibold text-slate-900 dark:text-white mb-2">
                    3. Deficiency of Vitamin C leads to which of the following diseases?
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                      (ജീവകം സി-യുടെ കുറവ് മൂലം ഉണ്ടാകുന്ന രോഗമേത്?)
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                    <span>(A) Rickets</span>
                    <span>(B) Beri-beri</span>
                    <span>(C) Scurvy</span>
                    <span>(D) Night Blindness</span>
                  </div>
                </div>

                <div className="text-center text-xs text-slate-400 font-sans italic py-4">
                  [... Continued for 100 questions in full downloadable PDF ...]
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 shadow-md rounded-lg p-6 sm:p-8 max-w-2xl mx-auto border border-slate-200 dark:border-slate-800">
              <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Official Final Answer Key Published
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                  Paper Code: {paper.paperCode}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Verified with State Examination Authority Gazette
                </p>
              </div>

              {/* Answer Key Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {[
                  { q: 1, a: 'B' }, { q: 2, a: 'B' }, { q: 3, a: 'C' }, { q: 4, a: 'B' },
                  { q: 5, a: 'D' }, { q: 6, a: 'B' }, { q: 7, a: 'A' }, { q: 8, a: 'B' },
                  { q: 9, a: 'C' }, { q: 10, a: 'A' }, { q: 11, a: 'D' }, { q: 12, a: 'B' },
                  { q: 13, a: 'A' }, { q: 14, a: 'C' }, { q: 15, a: 'B' }, { q: 16, a: 'D' },
                ].map((item) => (
                  <div
                    key={item.q}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
                  >
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Q {item.q}</span>
                    <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-bold flex items-center justify-center">
                      {item.a}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Official final key reflects all settled representations and expert committee evaluations. No questions were deleted in this paper code.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Language: <strong className="text-slate-700 dark:text-slate-300">{paper.language}</strong> | Status: <span className="text-emerald-600 dark:text-emerald-400 font-medium">Verified Paper</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Close Preview
          </button>
        </div>
      </div>
    </Modal>
  );
};
