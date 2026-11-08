import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { MCQQuestion } from '../../types';
import { Flag, Send, CheckCircle2 } from 'lucide-react';

interface ReportQuestionModalProps {
  question: MCQQuestion | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportQuestionModal: React.FC<ReportQuestionModalProps> = ({
  question,
  isOpen,
  onClose,
}) => {
  const [reportReason, setReportReason] = useState('incorrect_answer');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!question) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setComments('');
      onClose();
    }, 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Question Issue" maxWidth="md">
      {submitted ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Thank you for your report
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
            Our content review team checks all reported discrepancies against official gazette answer keys within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
            Reporting: <span className="font-semibold text-slate-800 dark:text-slate-200">{question.examName} • Q#{question.id}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Issue Type
            </label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 focus:ring-2 focus:ring-navy-500 outline-none"
            >
              <option value="incorrect_answer">Official answer key mismatch / incorrect marked option</option>
              <option value="typo">Typo / Translation error in English or Malayalam</option>
              <option value="explanation">Explanation contains incorrect facts or missing context</option>
              <option value="outdated">Question syllabus is outdated or cancelled by PSC</option>
              <option value="other">Other issue</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Additional Details & References (Optional)
            </label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Provide textbook citation, gazette reference or explanation..."
              className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 focus:ring-2 focus:ring-navy-500 outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              Submit Report
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
