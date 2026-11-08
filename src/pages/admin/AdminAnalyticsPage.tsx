import React from 'react';
import { BarChart3, TrendingUp, Users, GraduationCap, Award, CheckCircle2, ArrowUpRight } from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
          Platform Intelligence
        </span>
        <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
          Platform Reports & Usage Analytics
        </h1>
        <p className="text-xs text-slate-400">
          Insights on examination engagement, student accuracy benchmarks, and item bank growth.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 block">Total Attempted MCQs</span>
          <div className="text-2xl font-black text-white mt-1">0</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Fresh platform launch</span>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 block">Avg Platform Accuracy</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">0%</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">State competitive baseline</span>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 block">Completed Mock Tests</span>
          <div className="text-2xl font-black text-amber-400 mt-1">0</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Across test templates</span>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 block">Total Downloaded PDFs</span>
          <div className="text-2xl font-black text-sky-400 mt-1">0</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Zero bandwidth throttling</span>
        </div>
      </div>

      {/* Fresh Analytics Empty State Info */}
      <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
        <BarChart3 className="w-12 h-12 text-slate-500 mx-auto opacity-40" />
        <h3 className="text-base font-bold text-white">Analytics Engine Ready</h3>
        <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
          Comprehensive ranking reports, student mistake clustering, and examination engagement benchmarks will automatically accumulate here as students solve practice questions and take mock exams.
        </p>
      </div>
    </div>
  );
};
