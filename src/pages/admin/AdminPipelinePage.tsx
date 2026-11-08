import React, { useState } from 'react';
import { usePipeline } from '../../context/PipelineContext';
import { ProcessingDashboardStats } from '../../components/admin/ProcessingDashboardStats';
import { ResumableUploader } from '../../components/admin/ResumableUploader';
import { PipelineWorkflowViewer } from '../../components/admin/PipelineWorkflowViewer';
import { ExtractedQuestionItem } from '../../types';
import { Modal } from '../../components/common/Modal';
import {
  Sparkles,
  Layers,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bot,
  KeyRound,
  ShieldCheck,
  Filter,
  Search,
  Check,
  X,
  Edit2,
  AlertTriangle,
  Upload,
  ArrowRight
} from 'lucide-react';

export const AdminPipelinePage: React.FC = () => {
  const {
    documents,
    extractedQueue,
    approveQuestion,
    rejectQuestion,
    approveAllDocumentQuestions,
  } = usePipeline();

  const [activeTab, setActiveTab] = useState<'pipeline' | 'uploader' | 'verification'>('pipeline');
  const [selectedDocFilter, setSelectedDocFilter] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<'all' | 'official_key' | 'ai_suggested'>('all');
  const [editingQuestion, setEditingQuestion] = useState<ExtractedQuestionItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApprove = (id: string) => {
    approveQuestion(id);
    showToast('Question approved and published to live student question bank!');
  };

  const handleReject = (id: string) => {
    rejectQuestion(id);
    showToast('Question rejected and discarded from release queue.');
  };

  const filteredExtracted = extractedQueue.filter((q) => {
    if (selectedDocFilter !== 'all' && q.documentId !== selectedDocFilter) return false;
    if (filterSource !== 'all' && q.answerSource !== filterSource) return false;
    return true;
  });

  const pendingVerificationCount = extractedQueue.filter(
    (q) => q.verificationStatus === 'pending_verification'
  ).length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
            Automated Ingestion & OCR Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Automatic PDF Processing Pipeline
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            11-Step automated pipeline for large PDF compendiums, OCR for scanned booklets, official key correlation, and human-in-the-loop question verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('uploader')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-md transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Large PDFs</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 4. PROCESSING DASHBOARD STATS (7 KPI METRICS) */}
      <ProcessingDashboardStats />

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-1 text-xs">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all ${
            activeTab === 'pipeline'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          Active Pipelines ({documents.length})
        </button>
        <button
          onClick={() => setActiveTab('uploader')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'uploader'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Resumable Uploader (No Size Cap)</span>
        </button>
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'verification'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verification Desk ({pendingVerificationCount} Awaiting Review)</span>
        </button>
      </div>

      {/* Tab 1: Active Pipelines Stream */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Background Batch Processors & 11-Step Workflows</span>
            </h3>
            <span className="text-xs text-slate-400">
              State is persisted in background &bull; Safe to navigate away
            </span>
          </div>

          <div className="space-y-6">
            {documents.length === 0 ? (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                  <Layers className="w-6 h-6 text-amber-400" />
                </div>
                <h4 className="text-sm font-bold text-white">No PDF Pipelines Active</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  All dummy processing documents have been removed. Upload authentic Kerala PSC or national examination PDFs in the Resumable Uploader tab to trigger the 11-step pipeline.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('uploader')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Go to Resumable Uploader</span>
                  </button>
                </div>
              </div>
            ) : (
              documents.map((doc) => (
                <PipelineWorkflowViewer
                  key={doc.id}
                  document={doc}
                  onViewQuestions={() => {
                    setSelectedDocFilter(doc.id);
                    setActiveTab('verification');
                  }}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Resumable Uploader */}
      {activeTab === 'uploader' && (
        <ResumableUploader
          onUploadStarted={() => {
            showToast('Chunked upload batch launched. Switched to live pipeline view.');
            setActiveTab('pipeline');
          }}
        />
      )}

      {/* Tab 3: Admin Verification & Approval Queue (Steps 10 & 11) */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          {/* Header & Filter Controls */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400 font-semibold">Filter by Source:</span>
              <button
                onClick={() => setFilterSource('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold ${
                  filterSource === 'all' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                All Sources
              </button>
              <button
                onClick={() => setFilterSource('official_key')}
                className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 ${
                  filterSource === 'official_key' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                <KeyRound className="w-3 h-3" />
                <span>Official Key Matched</span>
              </button>
              <button
                onClick={() => setFilterSource('ai_suggested')}
                className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 ${
                  filterSource === 'ai_suggested' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                <Bot className="w-3 h-3" />
                <span>AI Suggested (Requires Review)</span>
              </button>
            </div>

            {selectedDocFilter !== 'all' && (
              <button
                onClick={() => setSelectedDocFilter('all')}
                className="text-amber-400 hover:underline font-semibold"
              >
                Clear Document Filter ({selectedDocFilter})
              </button>
            )}
          </div>

          {/* Strict Notice: Never automatically publish unverified AI answers */}
          <div className="p-3.5 bg-amber-950/40 border border-amber-800/80 rounded-2xl text-xs text-amber-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-300 font-bold mb-0.5">
                Strict Educational Quality Standard (Step 11 Guard):
              </strong>
              <span>
                Questions with AI-suggested answers are clearly labelled and will <strong>never</strong> be published automatically to the student question bank. Only questions with explicitly verified official answer keys or manual admin sign-off will transition to the live student database.
              </span>
            </div>
          </div>

          {/* Extracted Questions List */}
          <div className="space-y-4">
            {filteredExtracted.length === 0 ? (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="text-sm font-bold text-white">Verification Queue Clean</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  There are no questions awaiting verification. Questions extracted by the PDF pipeline will appear here for administrator review before publishing.
                </p>
              </div>
            ) : (
              filteredExtracted.map((q) => {
              const isApproved = q.verificationStatus === 'approved_published';
              const isRejected = q.verificationStatus === 'rejected';
              const isPending = q.verificationStatus === 'pending_verification';

              return (
                <div
                  key={q.id}
                  className={`bg-slate-900 rounded-2xl border p-5 sm:p-6 space-y-4 shadow-sm transition-all ${
                    isApproved
                      ? 'border-emerald-800/60 bg-emerald-950/10'
                      : isRejected
                      ? 'border-red-800/60 bg-red-950/10 opacity-70'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-amber-400">
                        Q#{q.questionNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                        {q.examName} &bull; {q.subject}
                      </span>
                      {q.answerSource === 'official_key' ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold flex items-center gap-1">
                          <KeyRound className="w-3 h-3 text-emerald-400" />
                          <span>Official Key Matched</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold flex items-center gap-1">
                          <Bot className="w-3 h-3 text-purple-400" />
                          <span>AI Suggested (Review Required)</span>
                        </span>
                      )}
                      {q.isDuplicate && (
                        <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-red-400" />
                          <span>Duplicate Flagged</span>
                        </span>
                      )}
                    </div>

                    <div>
                      {isApproved && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800">
                          Approved & Published to Live Bank
                        </span>
                      )}
                      {isPending && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[10px] font-bold border border-amber-800">
                          Awaiting Admin Sign-off
                        </span>
                      )}
                      {isRejected && (
                        <span className="px-2.5 py-0.5 rounded-full bg-red-950 text-red-300 text-[10px] font-bold border border-red-800">
                          Rejected / Discarded
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Stem */}
                  <div className="space-y-1">
                    <h4 className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                      {q.questionText}
                    </h4>
                    {q.questionMalayalam && (
                      <p className="text-xs text-slate-400 font-medium">
                        {q.questionMalayalam}
                      </p>
                    )}
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt) => {
                      const isCorrect = opt.id === q.correctAnswer;
                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-xl border flex items-center justify-between ${
                            isCorrect
                              ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-bold ring-1 ring-emerald-500/30'
                              : 'border-slate-800 bg-slate-800/40 text-slate-300'
                          }`}
                        >
                          <span>
                            <strong className="mr-2 text-amber-400">{opt.id}.</strong> {opt.text}
                          </span>
                          {isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Rationale & Source Details */}
                  <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1 text-xs">
                    <strong className="text-amber-400 block font-bold">
                      Extracted Pedagogical Explanation:
                    </strong>
                    <p className="text-slate-300 leading-relaxed font-normal">
                      {q.explanationText}
                    </p>
                    {q.flaggedError && (
                      <div className="pt-1 text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{q.flaggedError}</span>
                      </div>
                    )}
                  </div>

                  {/* Step 11 Action Bar */}
                  {isPending && (
                    <div className="pt-2 flex flex-wrap items-center justify-end gap-2 text-xs">
                      <button
                        onClick={() => handleReject(q.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject Item</span>
                      </button>
                      <button
                        onClick={() => handleApprove(q.id)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve & Publish to Student Bank</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
          </div>
        </div>
      )}
    </div>
  );
};
