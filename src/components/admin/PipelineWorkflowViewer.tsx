import React from 'react';
import { ProcessingDocument, PipelineStepState } from '../../types';
import { usePipeline } from '../../context/PipelineContext';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  RotateCcw,
  Pause,
  X,
  FileText,
  Layers,
  Sparkles,
  Bot,
  KeyRound,
  ShieldCheck,
  Check,
  ArrowRight,
  WifiOff
} from 'lucide-react';

interface PipelineWorkflowViewerProps {
  document: ProcessingDocument;
  onViewQuestions?: (docId: string) => void;
}

export const PipelineWorkflowViewer: React.FC<PipelineWorkflowViewerProps> = ({
  document: doc,
  onViewQuestions,
}) => {
  const { pauseUpload, resumeUpload, retryProcessing, simulateNetworkFailure, deleteDocument } = usePipeline();

  const isUploading = doc.status === 'uploading';
  const isProcessing = doc.status === 'processing';
  const isFailed = doc.status === 'failed';
  const isPaused = doc.status === 'paused';
  const isCompleted = doc.status === 'completed';

  const formatFileSize = (bytes: number) => {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Top Document Header & Live Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-white text-sm sm:text-base truncate block max-w-lg">
              {doc.fileName}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-amber-400">
              {doc.fileSizeDisplay}
            </span>
            {doc.isScanned ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800/40">
                Scanned (OCR)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-800/40">
                Selectable Digital PDF
              </span>
            )}
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                isCompleted
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : isFailed
                  ? 'bg-red-950 text-red-300 border border-red-800'
                  : isPaused
                  ? 'bg-slate-800 text-slate-300'
                  : 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
              }`}
            >
              {doc.status}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Target: <strong className="text-slate-300">{doc.examName}</strong></span>
            <span>&bull;</span>
            <span>Paper Code: <strong className="text-slate-300">{doc.paperCode}</strong></span>
            <span>&bull;</span>
            <span>Language: {doc.language}</span>
            <span>&bull;</span>
            <span className="font-mono text-[11px]">Hash: {doc.checksumHash.slice(0, 14)}...</span>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {isUploading && (
            <>
              <button
                onClick={() => pauseUpload(doc.id)}
                className="px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                title="Pause chunked upload"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </button>
              <button
                onClick={() => simulateNetworkFailure(doc.id)}
                className="px-2.5 py-1.5 rounded-xl border border-red-900/60 bg-red-950/40 hover:bg-red-950 text-red-300 text-xs font-semibold flex items-center gap-1"
                title="Simulate network break to test fault tolerance"
              >
                <WifiOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Simulate Disconnect</span>
              </button>
            </>
          )}

          {isPaused && (
            <button
              onClick={() => resumeUpload(doc.id)}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Resume Chunk</span>
            </button>
          )}

          {isFailed && (
            <button
              onClick={() => retryProcessing(doc.id)}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Recovery</span>
            </button>
          )}

          {onViewQuestions && (doc.totalExtractedCount > 0 || isCompleted) && (
            <button
              onClick={() => onViewQuestions(doc.id)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Review Extracted ({doc.pendingCount} Pending)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Upload Progress & Speed Metric (During Uploading) */}
      {(isUploading || isPaused) && (
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Resumable Chunked Upload: {doc.progressPercentage}%
            </span>
            <div className="flex items-center gap-3 text-slate-400">
              <span>{formatFileSize(doc.uploadedBytes)} of {doc.fileSizeDisplay}</span>
              {doc.uploadSpeedMBps > 0 && <span>&bull; {doc.uploadSpeedMBps} MB/s</span>}
              {doc.remainingSeconds > 0 && <span>&bull; ~{doc.remainingSeconds}s remaining</span>}
              <span>&bull; Chunk {doc.chunkInfo.uploadedChunks}/{doc.chunkInfo.totalChunks} (10 MB/chunk)</span>
            </div>
          </div>

          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isPaused ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${doc.progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Failure Error Alert Box (If Failed) */}
      {isFailed && doc.errorLog && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-red-300">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>Batch Execution Halted: {doc.errorLog}</span>
            </div>
            <button
              onClick={() => retryProcessing(doc.id)}
              className="px-3 py-1 bg-red-800 hover:bg-red-700 text-white rounded-lg font-bold text-xs"
            >
              Resume from Last Valid Batch
            </button>
          </div>
          <p className="text-[11px] text-red-300/80">
            Resumable tokens are active. The entire file does not need to be re-uploaded.
          </p>
        </div>
      )}

      {/* Large File Page-Batch Progress Indicator */}
      <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>
            Document Page Batches: <strong className="text-white">Batch {doc.batchInfo.currentBatch} of {doc.batchInfo.totalBatches}</strong>
            {' '}(Pages {doc.batchInfo.startPage}–{doc.batchInfo.endPage} of {doc.batchInfo.totalPages} total pages)
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 text-[11px]">
          <span>Extracted: <strong className="text-white">{doc.totalExtractedCount} Questions</strong></span>
          <span>Approved: <strong className="text-emerald-400">{doc.approvedCount}</strong></span>
          <span>Pending: <strong className="text-amber-400">{doc.pendingCount}</strong></span>
        </div>
      </div>

      {/* The 4-Step Automatic Pipeline Visual Stepper */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Fast 4-Step Ingestion Pipeline</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
          {doc.stepsState.map((step) => {
            const isCurr = step.stepNumber === doc.currentStep && isProcessing;
            const isDone = step.status === 'completed';
            const isSkipped = step.status === 'skipped';
            const isErr = step.status === 'failed';

            let cardStyle = 'border-slate-800 bg-slate-800/30 text-slate-400';
            let badgeStyle = 'bg-slate-800 text-slate-400';

            if (isDone) {
              cardStyle = 'border-emerald-900/60 bg-emerald-950/20 text-slate-200';
              badgeStyle = 'bg-emerald-950 text-emerald-400 border border-emerald-800/50';
            } else if (isCurr) {
              cardStyle = 'border-amber-500/80 bg-amber-950/30 text-white shadow-md ring-1 ring-amber-500/30';
              badgeStyle = 'bg-amber-500 text-slate-950 font-bold';
            } else if (isErr) {
              cardStyle = 'border-red-800 bg-red-950/40 text-red-200';
              badgeStyle = 'bg-red-950 text-red-300 border border-red-800';
            } else if (isSkipped) {
              cardStyle = 'border-slate-800/50 bg-slate-900/40 text-slate-500 opacity-60';
              badgeStyle = 'bg-slate-800 text-slate-500';
            }

            return (
              <div
                key={step.stepNumber}
                className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${cardStyle}`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${badgeStyle}`}>
                    Step {step.stepNumber}
                  </span>
                  {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {isCurr && <Clock className="w-4 h-4 text-amber-400 animate-spin shrink-0" />}
                  {isErr && <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />}
                  {isSkipped && <span className="text-[10px] text-slate-500">Skipped</span>}
                </div>

                <div className="font-bold text-white text-xs leading-snug">
                  {step.stepName}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                  {step.description}
                </p>

                {step.detailMessage && (
                  <div className="text-[10px] font-medium pt-1 text-amber-300/90 border-t border-slate-700/50 line-clamp-1">
                    {step.detailMessage}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
