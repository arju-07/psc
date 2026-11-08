import React, { useState, useEffect } from 'react';
import {
  Clock,
  Award,
  AlertCircle,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Calendar,
  Filter,
  BarChart3,
  ChevronRight,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { api } from '../services/api';

export default function MockTestCenter({ currentUser, onStartTest, categories }) {
  const [mockTests, setMockTests] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('all');
  const [loading, setLoading] = useState(true);
  const [mockHistory, setMockHistory] = useState([]);

  useEffect(() => {
    loadMockTests();
    loadHistory();
  }, [currentUser]);

  const loadMockTests = async () => {
    try {
      setLoading(true);
      const data = await api.getMockTests();
      setMockTests(data || []);
    } catch (e) {
      console.error('Failed to load mock tests:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    if (!currentUser?.id) return;
    try {
      const attempts = await api.getStudentAttempts(currentUser.id);
      const mocksOnly = (attempts || []).filter(a => a.paper_id?.startsWith('mock-'));
      setMockHistory(mocksOnly);
    } catch (e) {
      console.error('Failed to load mock history:', e);
    }
  };

  const filteredTests = selectedExamId === 'all'
    ? mockTests
    : mockTests.filter(m => m.exam_id === selectedExamId);

  const examsList = Array.from(new Set(mockTests.map(m => JSON.stringify({ id: m.exam_id, name: m.exam_name }))))
    .map(s => JSON.parse(s));

  return (
    <div className="space-y-6 pb-16">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-4 h-4" />
            <span>Official Exam Simulation • മാതൃകാ പരീക്ഷകൾ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Kerala Competitive Mock Examinations
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 leading-relaxed ml-text">
            യഥാർത്ഥ പരീക്ഷാ രീതിയിൽ നെഗറ്റീവ് മാർക്കിംഗും ടൈമറും ഉള്ള സമഗ്ര മോക്ക് ടെസ്റ്റുകൾ.
            നിങ്ങളുടെ തയ്യാറെടുപ്പുകൾ വിലയിരുത്തുക.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-semibold">
            <div className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl">
              <Clock className="w-4 h-4 text-emerald-300" />
              <span>Real-Time Countdown</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl">
              <ShieldAlert className="w-4 h-4 text-amber-300" />
              <span>1/3 Negative Marking</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl">
              <TrendingUp className="w-4 h-4 text-teal-300" />
              <span>Automated Score Evaluation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Filter by Examination:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedExamId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedExamId === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Exams ({mockTests.length})
          </button>
          {examsList.map((exam) => (
            <button
              key={exam.id}
              onClick={() => setSelectedExamId(exam.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedExamId === exam.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {exam.name?.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Mock Tests Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {test.exam_name}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  test.difficulty === 'Hard'
                    ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                    : test.difficulty === 'Easy'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {test.difficulty || 'Standard'} Pattern
                </span>
              </div>

              <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                {test.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 ml-text font-medium mt-1">
                {test.name_malayalam}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                {test.description}
              </p>

              {/* Spec Pills */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold block">Duration</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {test.duration_minutes} Mins
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold block">Questions</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {test.total_questions} Questions
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold block">Negative Marking</span>
                  <span className="text-xs font-bold text-red-600 dark:text-red-400">
                    -{test.negative_marking} / wrong
                  </span>
                </div>
              </div>

              {/* Syllabus Tags */}
              {test.subjects && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {test.subjects.slice(0, 4).map((s, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-medium">
                      {s}
                    </span>
                  ))}
                  {test.subjects.length > 4 && (
                    <span className="text-[10px] text-slate-400 font-medium self-center">
                      +{test.subjects.length - 4} more
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                {test.available_questions} Questions Available
              </span>
              <button
                onClick={() => onStartTest(test.id)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Mock Test</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mock Test Attempt History */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Your Mock Examination History • കഴിഞ്ഞ പരീക്ഷാ ഫലങ്ങൾ
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {mockHistory.length} Attempts Recorded
          </span>
        </div>

        {mockHistory.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <Clock className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-semibold">You have not taken any mock tests yet.</p>
            <p className="text-[11px] mt-0.5">Start your first timed test above to track accuracy and rankings.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3 rounded-l-xl">Examination</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Accuracy</th>
                  <th className="p-3">Breakdown</th>
                  <th className="p-3 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {mockHistory.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                      {h.mock_test_name || h.paper_code || 'Kerala PSC Mock'}
                    </td>
                    <td className="p-3 text-slate-500">
                      {new Date(h.completed_at).toLocaleDateString('en-GB')}
                    </td>
                    <td className="p-3 font-extrabold text-emerald-600 dark:text-emerald-400">
                      {h.score} / {h.max_score}
                    </td>
                    <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">
                      {h.accuracy_pct}%
                    </td>
                    <td className="p-3">
                      <span className="text-emerald-600 font-semibold">{h.correct_count}C</span> •{' '}
                      <span className="text-red-500 font-semibold">{h.incorrect_count}W</span> •{' '}
                      <span className="text-slate-400 font-semibold">{h.unattempted_count}U</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        (h.accuracy_pct || 0) >= 60
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                      }`}>
                        {(h.accuracy_pct || 0) >= 60 ? 'Passed' : 'Needs Practice'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
