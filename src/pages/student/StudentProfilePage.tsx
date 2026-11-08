import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockExams } from '../../data/mockData';
import { User, Mail, Globe, Target, Award, CheckCircle2, ShieldCheck, Save } from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { currentUser, updateProfile, updateTargetExams } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [preferredLanguage, setPreferredLanguage] = useState<'English' | 'Malayalam' | 'Both'>(
    currentUser?.preferredLanguage || 'Both'
  );
  const [selectedExams, setSelectedExams] = useState<string[]>(
    currentUser?.targetExams || []
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleExam = (slug: string) => {
    setSelectedExams((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      preferredLanguage,
    });
    updateTargetExams(selectedExams);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-100 dark:bg-slate-800 text-navy-800 dark:text-sky-300 text-xs font-semibold">
          <User className="w-3.5 h-3.5" />
          <span>Aspirant Account Identity</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Student Profile & Target Exams
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Customize your targeted examination goals and study language preferences.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile changes and target examinations successfully updated!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-navy-700 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
              {name.charAt(0) || 'A'}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {name || 'Student Aspirant'}
              </h3>
              <span className="text-xs text-slate-400 block">
                Member since {currentUser?.joinedDate || '2024'} &bull; Verified Learner
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-navy-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-navy-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                Primary Question Medium
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-navy-500 font-medium"
              >
                <option value="Both">Bilingual (English + Malayalam)</option>
                <option value="Malayalam">Malayalam Only</option>
                <option value="English">English Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Target Examination Selection */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
          <div className="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-navy-700 dark:text-sky-400" />
              Your Target Examinations
            </h3>
            <p className="text-xs text-slate-400">
              Select examinations you are preparing for. We prioritize these question sets in your daily challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {mockExams.map((exam) => {
              const isSelected = selectedExams.includes(exam.slug);
              return (
                <div
                  key={exam.id}
                  onClick={() => toggleExam(exam.slug)}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-navy-600 bg-navy-50/70 dark:bg-slate-800 dark:border-sky-500'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {exam.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {exam.category} &bull; {exam.paperCount} Papers
                    </span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? 'bg-navy-700 border-navy-700 text-white'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-navy-700 hover:bg-navy-800 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
