import React, { useState } from 'react';
import { mockExams } from '../../data/mockData';
import { ProcessingDashboardStats } from '../../components/admin/ProcessingDashboardStats';
import {
  Users,
  GraduationCap,
  FileText,
  Database,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  DownloadCloud,
  Layers,
  ShieldCheck,
  Activity,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminOverviewPage: React.FC = () => {
  const stats = {
    totalStudents: 1,
    totalExams: mockExams.length,
    totalPapers: 0,
    totalQuestions: 0,
    pendingContentApprovals: 0,
  };
  const [pendingItems] = useState<any[]>([]);
  const [crawlerJobs] = useState<any[]>([]);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
            Executive Summary
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Operations & Content Dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Real-time status of repository documents, student registrations, and pending editorial reviews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/pipeline"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>PDF Pipeline</span>
          </Link>
          <Link
            to="/admin/papers"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
          >
            + Upload New Paper
          </Link>
          <Link
            to="/admin/questions"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors hidden sm:inline-block"
          >
            Question Bank
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Registered Students</span>
            <div className="p-2 rounded-xl bg-blue-950/60 text-blue-400 border border-blue-800/40">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {stats.totalStudents}
          </div>
          <span className="text-[11px] text-slate-400">
            Authenticated via Supabase
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Catalogued Exams</span>
            <div className="p-2 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/40">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {stats.totalExams}
          </div>
          <span className="text-[11px] text-slate-400">
            Kerala PSC & State Exams
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Indexed Papers</span>
            <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {stats.totalPapers}
          </div>
          <span className="text-[11px] text-slate-400">
            Repository ready for uploads
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Question Bank</span>
            <div className="p-2 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/40">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {stats.totalQuestions}
          </div>
          <span className="text-[11px] text-slate-400">
            Verified MCQ bank
          </span>
        </div>
      </div>

      {/* Automated PDF Ingestion Pipeline KPI Row */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Automatic PDF Ingestion & OCR Pipeline Status
            </h2>
          </div>
          <Link
            to="/admin/pipeline"
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>Open Pipeline Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <ProcessingDashboardStats />
      </div>

      {/* Actionable Review Queue & Platform Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Pending Content Approvals */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Pending Editorial Approvals ({stats.pendingContentApprovals})
              </h3>
              <p className="text-xs text-slate-400">
                Newly crawled papers and AI explanation drafts requiring human verification.
              </p>
            </div>
            <Link
              to="/admin/ai-content"
              className="text-xs font-bold text-amber-400 hover:underline"
            >
              Review All &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {pendingItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-800/40 rounded-xl border border-slate-800 space-y-1">
                <Clock className="w-6 h-6 text-slate-500 mx-auto opacity-40" />
                <p className="font-semibold text-slate-300">No pending editorial reviews</p>
                <p className="text-[11px] text-slate-500">
                  Uploaded PDF papers and generated explanations awaiting review will appear here.
                </p>
              </div>
            ) : (
              pendingItems.map((item, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">{item.title}</span>
                    <span className="text-slate-400">{item.type} &bull; Status: {item.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/40">
                      {item.priority}
                    </span>
                    <Link
                      to="/admin/ai-content"
                      className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                    >
                      Inspect
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Automated Paper Collector Crawler Health */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DownloadCloud className="w-4 h-4 text-emerald-400" />
              Public Source Crawlers
            </h3>
            <Link
              to="/admin/collection"
              className="text-xs font-semibold text-slate-400 hover:text-white"
            >
              Manage &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {crawlerJobs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-800/40 rounded-xl border border-slate-800 space-y-1">
                <DownloadCloud className="w-6 h-6 text-slate-500 mx-auto opacity-40" />
                <p className="font-semibold text-slate-300">No crawlers active</p>
                <p className="text-[11px] text-slate-500">Configure crawler sources in Paper Collection.</p>
              </div>
            ) : (
              crawlerJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate max-w-[180px]">
                      {job.sourceName}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Paper Uploads Table Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-400" />
            Recently Indexed Question Papers
          </h3>
          <Link to="/admin/papers" className="text-xs font-bold text-amber-400 hover:underline">
            View All Papers →
          </Link>
        </div>
        <div className="flex flex-col items-center gap-3 py-10 text-slate-500">
          <FileText className="w-10 h-10 opacity-25" />
          <p className="text-sm font-medium">No question papers uploaded yet.</p>
          <p className="text-xs">Go to the Papers section to start uploading PYQ documents.</p>
          <Link
            to="/admin/papers"
            className="mt-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <ArrowRight className="w-3.5 h-3.5" /> Go to Papers
          </Link>
        </div>
      </div>
    </div>
  );
};
