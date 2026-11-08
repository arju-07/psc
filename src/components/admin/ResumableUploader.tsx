import React, { useState, useRef } from 'react';
import { usePipeline } from '../../context/PipelineContext';
import { mockExams } from '../../data/mockData';
import {
  Upload,
  FileText,
  Pause,
  Play,
  RotateCcw,
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  HardDrive,
  Info,
  ShieldCheck,
  Plus,
  Trash2,
  WifiOff
} from 'lucide-react';

interface QueuedFileConfig {
  id: string;
  file: File | { name: string; size: number };
  examSlug: string;
  examName: string;
  year: number;
  paperCode: string;
  language: 'Malayalam' | 'English' | 'Bilingual';
  hasOfficialAnswerKey: boolean;
  answerKeyFile?: File | null;
  isScanned: boolean;
  isDuplicateWarning?: boolean;
}

export const ResumableUploader: React.FC<{
  onUploadStarted?: () => void;
  className?: string;
}> = ({ onUploadStarted, className = '' }) => {
  const { addDocumentsToQueue, checkIsDuplicate } = usePipeline();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [queuedFiles, setQueuedFiles] = useState<QueuedFileConfig[]>([]);
  const [duplicateAlert, setDuplicateAlert] = useState<string | null>(null);

  // Default values for batch assignment
  const [selectedExamSlug, setSelectedExamSlug] = useState('kerala-psc-ldc');
  const [year, setYear] = useState(2024);
  const [language, setLanguage] = useState<'Malayalam' | 'English' | 'Bilingual'>('Malayalam');

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const matchedExam = mockExams.find((e) => e.slug === selectedExamSlug) || mockExams[0];

    const newItems: QueuedFileConfig[] = Array.from(files).map((f, idx) => {
      const isDup = checkIsDuplicate(f.name);
      if (isDup) {
        setDuplicateAlert(`Warning: Document "${f.name}" matches an existing record. Duplicate checking will isolate questions during processing.`);
      }
      return {
        id: `queue-${Date.now()}-${idx}`,
        file: f,
        examSlug: matchedExam.slug,
        examName: matchedExam.name,
        year,
        paperCode: `0${Math.floor(Math.random() * 80 + 10)}/2024-M`,
        language,
        hasOfficialAnswerKey: true,
        isScanned: f.name.toLowerCase().includes('scan') || f.size > 50 * 1024 * 1024,
        isDuplicateWarning: isDup,
      };
    });

    setQueuedFiles((prev) => [...prev, ...newItems]);
  };

  const handleRemoveFromQueue = (id: string) => {
    setQueuedFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const handleStartUploadQueue = () => {
    if (queuedFiles.length === 0) return;

    addDocumentsToQueue({
      files: queuedFiles.map((item) => ({
        name: item.file.name,
        sizeBytes: item.file.size,
        sizeDisplay: formatFileSize(item.file.size),
        examSlug: item.examSlug,
        examName: item.examName,
        year: item.year,
        paperCode: item.paperCode,
        language: item.language,
        hasOfficialAnswerKey: item.hasOfficialAnswerKey,
        isScanned: item.isScanned,
      })),
    });

    setQueuedFiles([]);
    setDuplicateAlert(null);
    if (onUploadStarted) onUploadStarted();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Architecture Notice (No arbitrary size limit + Chunking Readiness) */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
          <HardDrive className="w-4 h-4 text-amber-400" />
          <span>Unlimited PDF Ingestion Engine &bull; Resumable Chunk Architecture</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Fixed PDF size barriers (such as 10 MB or 50 MB) have been removed. The frontend is engineered with <strong>10 MB chunked multipart & resumable streams</strong>. Large compendiums, scanned 100+ page archives, and multi-file batches upload smoothly with network-interruption fault tolerance.
        </p>
        <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-400 border-t border-slate-800">
          <Info className="w-3.5 h-3.5 text-sky-400" />
          <span>
            <em>Frontend Demonstration:</em> Multi-chunk state, pause/resume, and batch progress are simulated on the client side ready for Phase 2 TUS/S3 bucket bindings.
          </span>
        </div>
      </div>

      {duplicateAlert && (
        <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-300 text-xs flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{duplicateAlert}</span>
          </div>
          <button
            onClick={() => setDuplicateAlert(null)}
            className="text-amber-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="p-8 border-2 border-dashed border-slate-700 hover:border-amber-500/80 rounded-3xl text-center space-y-3 bg-slate-900/60 hover:bg-slate-900 transition-all cursor-pointer group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          multiple
          className="hidden"
          onChange={(e) => handleFilesSelected(e.target.files)}
        />
        <div className="w-14 h-14 rounded-2xl bg-slate-800 text-amber-400 border border-slate-700 mx-auto flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner">
          <Upload className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white">
            Drag & Drop PDF Question Papers or Scanned Booklets
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Upload single or bulk PDF files of any size (e.g. 50 MB, 150 MB, 500 MB+). All documents are prepared for resumable chunk streaming.
          </p>
        </div>
      </div>

      {/* Queued Documents Configuration Table (If any) */}
      {queuedFiles.length > 0 && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-sm animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                Upload Queue ({queuedFiles.length} {queuedFiles.length === 1 ? 'file' : 'files'})
              </h4>
              <span className="text-xs text-slate-400">
                Configure examination tagging before initiating chunked upload.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQueuedFiles([])}
                className="px-3 py-1.5 rounded-xl border border-slate-700 text-slate-400 hover:text-red-400 text-xs font-semibold"
              >
                Clear Queue
              </button>
              <button
                onClick={handleStartUploadQueue}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Start Resumable Upload Batch</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {queuedFiles.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white truncate max-w-sm block">
                      {item.file.name}
                    </span>
                    <span className="px-2 py-0.2 rounded bg-slate-800 text-amber-400 font-bold text-[10px]">
                      {formatFileSize(item.file.size)}
                    </span>
                    {item.isScanned && (
                      <span className="px-2 py-0.2 rounded bg-purple-950 text-purple-300 text-[10px] font-bold">
                        Scanned (OCR Target)
                      </span>
                    )}
                    {item.isDuplicateWarning && (
                      <span className="px-2 py-0.2 rounded bg-amber-950 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Duplicate Name
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400 text-[11px] block">
                    Target: {item.examName} &bull; Code: {item.paperCode} &bull; Language: {item.language}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleRemoveFromQueue(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                    title="Remove from queue"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
