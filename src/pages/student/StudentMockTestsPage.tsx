import React, { useState } from 'react';
import { MockTest } from '../../types';
import { InteractiveMCQPlayer } from '../../components/mcq/InteractiveMCQPlayer';
import { Modal } from '../../components/common/Modal';
import {
  Timer,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  ArrowRight,
  ShieldAlert,
  Play,
  RotateCcw,
  Layers,
  Calendar
} from 'lucide-react';

export const StudentMockTestsPage: React.FC = () => {
  const [tests, setTests] = useState<MockTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<MockTest | null>(null);
  const [isTestActive, setIsTestActive] = useState(false);
  const [instructionsModalOpen, setInstructionsModalOpen] = useState(false);
  const [testResult, setTestResult] = useState<{
    correct: number;
    incorrect: number;
    unattempted: number;
    score: number;
  } | null>(null);

  const handleStartClick = (test: MockTest) => {
    setSelectedTest(test);
    setInstructionsModalOpen(true);
  };

  const handleBeginLiveExam = () => {
    setInstructionsModalOpen(false);
    setIsTestActive(true);
    setTestResult(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-100 dark:bg-slate-800 text-navy-800 dark:text-sky-300 text-xs font-semibold">
          <Timer className="w-3.5 h-3.5" />
          <span>Real Examination Simulation Engine</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Full-Length Mock Examinations
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Simulate official OMR/CBT exam patterns with negative marking timers and complete post-test analysis.
        </p>
      </div>

      {isTestActive && selectedTest ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsTestActive(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              &larr; Exit Mock Test Mode
            </button>
            <span className="text-xs font-bold text-navy-700 dark:text-sky-400">
              Live Mock Test: {selectedTest.title}
            </span>
          </div>

          <InteractiveMCQPlayer
            questions={selectedTest.questions}
            mode="exam"
            title={selectedTest.title}
            onFinishExam={(result) => setTestResult(result)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tests.length === 0 && (
            <div className="md:col-span-2 p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Timer className="w-12 h-12 text-amber-500 mx-auto opacity-40" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No Mock Examinations Available Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Full-length mock tests mapped to official Kerala PSC syllabus will appear here once published by administrators.
              </p>
            </div>
          )}
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-navy-100 text-navy-800 dark:bg-slate-800 dark:text-sky-300">
                    {test.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      test.status === 'available'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {test.status === 'available' ? 'Open for Practice' : 'Upcoming Live Test'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {test.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Examination: <strong className="text-slate-700 dark:text-slate-300">{test.examName}</strong>
                </p>

                {/* Test Metrics */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-navy-600 dark:text-sky-400" />
                    <span>Duration: <strong>{test.durationMinutes} Mins</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Total: <strong>{test.totalMarks} Marks</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>Questions: <strong>{test.totalQuestions} MCQs</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Negative: <strong>-{test.negativeMarking}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800">
                {test.status === 'available' ? (
                  <button
                    onClick={() => handleStartClick(test)}
                    className="w-full py-2.5 px-4 rounded-xl bg-navy-700 hover:bg-navy-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start Mock Examination</span>
                  </button>
                ) : (
                  <div className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-semibold text-center flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Scheduled for 15 Nov 2026, 10:00 AM</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instructions Modal */}
      {selectedTest && (
        <Modal
          isOpen={instructionsModalOpen}
          onClose={() => setInstructionsModalOpen(false)}
          title={`Mock Exam Instructions: ${selectedTest.title}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/50 rounded-xl border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200">
              <strong className="block mb-0.5">Please read before launching:</strong>
              Once you start, the countdown timer will begin immediately. Answers will remain concealed until you finalize and submit the examination booklet.
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Exam Parameters
              </h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Total Questions: <strong>{selectedTest.totalQuestions}</strong></li>
                <li>Time Limit: <strong>{selectedTest.durationMinutes} Minutes</strong></li>
                <li>Marking Scheme: <strong>+1.00 for correct, -{selectedTest.negativeMarking} for wrong</strong></li>
                <li>Unattempted questions receive 0 marks.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Candidate Rules
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {selectedTest.instructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setInstructionsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleBeginLiveExam}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Begin Test Now</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
