import React, { useState, useEffect } from 'react';
import {
  FileSearch,
  Filter,
  Calendar,
  Layers,
  History,
  TrendingUp,
  AlertCircle,
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export default function QuestionAnalysis({ categories }) {
  const [repeatedQuestions, setRepeatedQuestions] = useState([]);
  const [topicFrequency, setTopicFrequency] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedExam, setSelectedExam] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [activeSubTab, setActiveSubTab] = useState('repeated'); // 'repeated' | 'frequency'

  useEffect(() => {
    loadMetadata();
    loadAnalysisData();
  }, [selectedExam, selectedSubject, selectedYear]);

  const loadMetadata = async () => {
    try {
      const [subs, exList] = await Promise.all([
        api.getSubjects(),
        api.getExams()
      ]);
      setSubjects(subs || []);
      setExams(exList || []);
    } catch (e) {
      console.error('Failed to load metadata for analysis:', e);
    }
  };

  const loadAnalysisData = async () => {
    try {
      setLoading(true);
      const examParam = selectedExam !== 'all' ? selectedExam : null;
      const subjParam = selectedSubject !== 'all' ? selectedSubject : null;

      const [repRes, freqRes] = await Promise.all([
        api.getHistoricalRepeated({ exam_id: examParam, subject_id: subjParam }),
        api.getHistoricalTopicFrequency({ exam_id: examParam, subject_id: subjParam })
      ]);

      setRepeatedQuestions(repRes.data || []);
      setTopicFrequency(freqRes.data || []);
    } catch (e) {
      console.error('Failed to load historical analysis:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-2 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
            <History className="w-4 h-4" />
            <span>Historical Examination Data • മുൻവർഷ ചോദ്യ വിശകലനം</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Previous Exam Question Analysis
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-2 leading-relaxed ml-text">
            കേരള പി.എസ്.സി പരീക്ഷകളിൽ ആവർത്തിച്ചു വന്ന ചോദ്യങ്ങളും പതിവായി ചോദിക്കുന്ന വിഷയങ്ങളും ചരിത്രപരമായ കണക്കുകളുടെ അടിസ്ഥാനത്തിൽ വിശകലനം ചെയ്യുക.
          </p>

          <div className="mt-4 p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-300" />
            <span>
              <b>Note:</b> Displays verified historical statistics only. No fabricated or unsupported future predictions.
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        {/* Sub Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab('repeated')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeSubTab === 'repeated'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Repeated Questions ({repeatedQuestions.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('frequency')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeSubTab === 'frequency'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Topic-Wise Frequency ({topicFrequency.length})</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="all">All Examinations</option>
            {exams.map(e => (
              <option key={e.id} value={e.id}>{e.name?.split('(')[0]}</option>
            ))}
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="all">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* CONTENT: REPEATED QUESTIONS */}
      {activeSubTab === 'repeated' && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20 text-slate-400">Loading historical repeated questions...</div>
          ) : repeatedQuestions.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
              <FileSearch className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="font-bold text-base text-slate-800 dark:text-white">
                No Repeated Questions Matching Current Filter
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Try selecting "All Examinations" or "All Subjects" to see the full historical cross-examination repeats.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {repeatedQuestions.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-blue-500 transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-black flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900">
                        Appeared {item.repeat_count || item.times_appeared || 2} Times in Past Papers
                      </span>
                    </div>

                    {item.years_appeared && (
                      <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Years: <b>{item.years_appeared.join(', ')}</b></span>
                      </div>
                    )}
                  </div>

                  <p className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                    {item.question_text || item.text}
                  </p>
                  {item.question_text_malayalam && (
                    <p className="text-sm font-medium text-blue-950 dark:text-blue-200 ml-text leading-relaxed bg-blue-50/50 dark:bg-blue-950/20 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900/40">
                      {item.question_text_malayalam}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                    {item.topic && (
                      <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 font-semibold">
                        Topic: {item.topic}
                      </span>
                    )}
                    {item.exam_names && (
                      <span className="text-slate-500">
                        Exams: {item.exam_names.join(' • ')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CONTENT: TOPIC-WISE FREQUENCY */}
      {activeSubTab === 'frequency' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Historical Topic Frequency Heatmap
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Relative frequency of topics based strictly on officially published past question papers.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-400">Loading topic frequency statistics...</div>
          ) : topicFrequency.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No frequency data found for this selection.</p>
          ) : (
            <div className="space-y-4 pt-2">
              {topicFrequency.map((top, idx) => {
                const count = top.question_count || top.frequency || 1;
                const maxCount = Math.max(...topicFrequency.map(t => t.question_count || t.frequency || 1));
                const pct = Math.round((count / Math.max(1, maxCount)) * 100);

                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[11px] font-bold text-slate-500">
                          {idx + 1}
                        </span>
                        <span className="text-slate-800 dark:text-slate-200">{top.topic || top.name}</span>
                        {top.topic_malayalam && (
                          <span className="text-slate-400 ml-text font-normal">({top.topic_malayalam})</span>
                        )}
                      </div>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {count} Questions Recorded
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.max(6, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
