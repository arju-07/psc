import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  RotateCcw,
  BookOpen,
  Target,
  BarChart3,
  Layers,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  HelpCircle,
  Calendar,
  Lightbulb,
  Cpu
} from 'lucide-react';
import { api } from '../services/api';

export default function AIAnalysisView({
  currentUser,
  onLaunchCustomTest,
  categories
}) {
  const [activeSubTab, setActiveSubTab] = useState('repeated'); // 'repeated' | 'frequency' | 'generator' | 'diagnostic'
  const [repeatedClusters, setRepeatedClusters] = useState([]);
  const [topicTrends, setTopicTrends] = useState(null);
  const [diagnostic, setDiagnostic] = useState(null);
  const [loading, setLoading] = useState(true);

  // Practice test generator state
  const [generatorTopic, setGeneratorTopic] = useState('All');
  const [generatorDifficulty, setGeneratorDifficulty] = useState('All');
  const [generatorCount, setGeneratorCount] = useState(10);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadAIInsights();
  }, []);

  const loadAIInsights = async () => {
    setLoading(true);
    try {
      const [repeatsRes, trendsRes, diagRes] = await Promise.all([
        api.getAIRepeatedQuestions(),
        api.getAITopicFrequency(),
        api.getAIDiagnostic(currentUser?.id || 'usr-student-01')
      ]);
      setRepeatedClusters(repeatsRes || []);
      setTopicTrends(trendsRes);
      setDiagnostic(diagRes);
    } catch (err) {
      console.error('Failed to load AI insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAndStart = async () => {
    setGenerating(true);
    try {
      const test = await api.generateAIPracticeTest({
        topic: generatorTopic,
        difficulty: generatorDifficulty,
        count: generatorCount
      });
      if (onLaunchCustomTest) {
        onLaunchCustomTest(test);
      }
    } catch (err) {
      console.error('Test generation failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5 text-amber-300" />
            <span>Gemini AI Engine & Historical Syllabus Analytics</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            AI Exam Intelligence & Question Forensics
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 leading-relaxed ml-text">
            മുൻവർഷ പരീക്ഷകളിൽ ആവർത്തിച്ചു വന്ന ചോദ്യങ്ങൾ, സിലബസ് വെയ്റ്റേജ് വിശകലനം, എ.ഐ പ്രവചന മാതൃകകൾ.
          </p>
        </div>

        {/* Clear Disclaimer Badge */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[11px] max-w-xs shrink-0">
          <p className="font-bold flex items-center mb-0.5">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-400" />
            Statutory Transparency
          </p>
          Historical statistics reflect verified papers. Future predictions are algorithmic trends, not guaranteed test content.
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex items-center space-x-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'repeated', label: 'Recurring Questions (ആവർത്തന ചോദ്യങ്ങൾ)', icon: RotateCcw },
          { id: 'frequency', label: 'Topic Frequency & Predictive Heatmap', icon: BarChart3 },
          { id: 'generator', label: 'AI Custom Mock Test Generator', icon: Target },
          { id: 'diagnostic', label: 'Personalized Diagnostic Advice', icon: Lightbulb }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: REPEATED QUESTIONS */}
      {activeSubTab === 'repeated' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Identified High-Frequency Concept Clusters
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Concepts repeated across Degree Level, Secretariat Assistant, and Police SI past papers.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {repeatedClusters.length} High-Yield Concepts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {repeatedClusters.map((cluster, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 uppercase">
                      {cluster.category}
                    </span>
                    <h3 className="mt-1.5 font-bold text-sm text-slate-900 dark:text-white">
                      {cluster.concept_name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-xl">
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Repeated {cluster.frequency_count}x
                    </span>
                  </div>
                </div>

                {/* Years appeared */}
                <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Years Appeared:</span>
                  <div className="flex flex-wrap gap-1">
                    {cluster.years_appeared.map((yr, yIdx) => (
                      <span key={yIdx} className="font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.2 rounded text-[11px]">
                        {yr}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sample Question Representation */}
                {cluster.representative_question && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200 ml-text">
                      {cluster.representative_question.question_text_malayalam || cluster.representative_question.question_text}
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                      ✓ Correct Key: ({cluster.representative_question.correct_option})
                    </p>
                  </div>
                )}

                <p className="text-[11px] text-slate-500 italic">
                  💡 {cluster.key_takeaway}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TOPIC FREQUENCY & TRENDS */}
      {activeSubTab === 'frequency' && (
        <div className="space-y-6">
          {/* Dual Column: Factual Historical vs AI Predictive */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Column A: Verified Historical Statistics */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Verified Historical Topic Weightage (2020-2024)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Factual question distribution across verified Kerala competitive archives
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {topicTrends?.historical_statistics?.map((stat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-800 dark:text-slate-200">{stat.topic}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {stat.percentage_weightage}% ({stat.verified_question_count} Qs)
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, stat.percentage_weightage * 3)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column B: AI Predictive Forecast (Clearly marked!) */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-purple-200 dark:border-purple-900/60 shadow-sm space-y-4 relative">
              <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center">
                    <span>AI Predicted Syllabus Trends (2026 Models)</span>
                    <span className="ml-2 text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded font-bold">
                      Forecast
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Algorithmic estimates derived from pattern frequency models
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {topicTrends?.ai_predictions?.map((pred, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-800/30 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-white">{pred.topic}</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        {pred.predicted_weightage_range}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      High probability subtopics: {pred.high_probability_subtopics.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legal / Transparency Disclaimer Box */}
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-bold text-slate-800 dark:text-slate-200">Disclaimer: </span>
            {topicTrends?.disclaimer}
          </div>
        </div>
      )}

      {/* TAB 3: AI PRACTICE TEST GENERATOR */}
      {activeSubTab === 'generator' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <span>Generate Custom AI Practice Test</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Assemble a tailored test from verified authentic past questions based on your specific study goals.
            </p>
          </div>

          <div className="space-y-4">
            {/* Topic Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Select Syllabus Subject
              </label>
              <select
                value={generatorTopic}
                onChange={(e) => setGeneratorTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Subjects (Comprehensive Mock)</option>
                <option value="Kerala Renaissance & History">Kerala Renaissance & History (കേരള നവോത്ഥാനം)</option>
                <option value="Indian Constitution & Polity">Indian Constitution & Polity (ഭരണഘടന)</option>
                <option value="Simple Arithmetic & Mental Ability">Simple Arithmetic & Mental Ability (ഗണിതം)</option>
                <option value="General Science & Technology">General Science & Technology (പൊതു ശാസ്ത്രം)</option>
                <option value="Kerala Geography & Environment">Kerala Geography & Environment (ഭൂമിശാസ്ത്രം)</option>
                <option value="Malayalam Grammar & Vocabulary">Malayalam Grammar & Vocabulary (മലയാളം)</option>
                <option value="General English">General English</option>
              </select>
            </div>

            {/* Difficulty Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Difficulty Level
              </label>
              <select
                value={generatorDifficulty}
                onChange={(e) => setGeneratorDifficulty(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">Balanced (Standard Kerala PSC Mix)</option>
                <option value="Easy">Foundation / Easy (LDC Level)</option>
                <option value="Medium">Intermediate / Medium (Degree Level)</option>
                <option value="Hard">Advanced / Hard (KAS Officer Level)</option>
              </select>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Number of Questions
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[5, 10, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGeneratorCount(num)}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      generatorCount === num
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {num} Questions ({num}m)
                  </button>
                ))}
              </div>
            </div>

            {/* Launch Button */}
            <div className="pt-4">
              <button
                onClick={handleGenerateAndStart}
                disabled={generating}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-2 transition disabled:opacity-50"
              >
                {generating ? (
                  <span>Curating Verified Questions...</span>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4" />
                    <span>Launch AI Practice Test Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PERSONALIZED DIAGNOSTIC */}
      {activeSubTab === 'diagnostic' && (
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span>Candidate Diagnostic Profile & Personalized Study Plan</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              AI analysis of student accuracy trends, speed, and question elimination patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                <span>Verified Subject Strengths</span>
              </p>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {diagnostic?.strengths?.map((s, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{s.topic}</span>
                    <span className="font-bold text-emerald-600">{s.accuracy}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
              <p className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1.5" />
                <span>Identified Improvement Opportunities</span>
              </p>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {diagnostic?.weaknesses?.map((w, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{w.topic}</span>
                    <span className="font-bold text-rose-600">{w.accuracy}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <p className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              Strategic Recommendations for Upcoming Examinations
            </p>
            <div className="space-y-1.5">
              {diagnostic?.ai_personalized_advice?.map((adv, idx) => (
                <p key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{adv}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
