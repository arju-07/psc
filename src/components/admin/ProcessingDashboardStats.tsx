import React from 'react';
import { usePipeline } from '../../context/PipelineContext';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Database,
  ArrowUpRight,
  ShieldCheck,
  Layers,
  Sparkles
} from 'lucide-react';

export const ProcessingDashboardStats: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { metrics } = usePipeline();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 7 Required Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
        {/* 1. Total uploaded documents */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold">Total Uploaded</span>
            <FileText className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-white">{metrics.totalUploadedDocuments}</div>
            <span className="text-[10px] text-slate-500">PDF Documents</span>
          </div>
        </div>

        {/* 2. Documents currently processing */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold">Processing</span>
            <Clock className="w-4 h-4 text-amber-400 animate-spin" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-amber-400">{metrics.documentsProcessing}</div>
            <span className="text-[10px] text-amber-500/80 font-medium">In Background</span>
          </div>
        </div>

        {/* 3. Completed documents */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-emerald-400">{metrics.completedDocuments}</div>
            <span className="text-[10px] text-slate-500">Processed</span>
          </div>
        </div>

        {/* 4. Failed documents */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold">Failed</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-red-400">{metrics.failedDocuments}</div>
            <span className="text-[10px] text-red-400/80 font-medium">Retry Ready</span>
          </div>
        </div>

        {/* 5. Total extracted questions */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold">Total Extracted</span>
            <Database className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-white">{metrics.totalExtractedQuestions}</div>
            <span className="text-[10px] text-purple-400/80 font-medium">From OCR / PDF</span>
          </div>
        </div>

        {/* 6. Questions awaiting verification */}
        <div className="p-4 bg-slate-900 border border-amber-500/40 bg-amber-950/20 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-300">
            <span className="font-bold">Awaiting Review</span>
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-amber-300">{metrics.questionsAwaitingVerification}</div>
            <span className="text-[10px] text-amber-400 font-semibold">Verification Desk</span>
          </div>
        </div>

        {/* 7. Approved and published questions */}
        <div className="p-4 bg-slate-900 border border-emerald-500/40 bg-emerald-950/20 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-300">
            <span className="font-bold">Published</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-emerald-300">{metrics.approvedPublishedQuestions}</div>
            <span className="text-[10px] text-emerald-400 font-semibold">Live in Student App</span>
          </div>
        </div>
      </div>
    </div>
  );
};
