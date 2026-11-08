import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { ShieldCheck, Heart, ExternalLink, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <Logo size="md" to="/" />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm mt-2">
              Kerala PYQ Hub is a specialized digital learning platform dedicated to providing organized previous-year question papers, verified answers, and instant rationale for Kerala state and national competitive examinations.
            </p>
            <div className="pt-2 flex items-center gap-2 text-slate-500 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Independent preparation platform. Not affiliated with government examination boards.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide">Examinations</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/exams/kerala-psc-ldc" className="hover:text-white transition-colors">Kerala PSC LDC</Link>
              </li>
              <li>
                <Link to="/exams/kerala-psc-degree-prelims" className="hover:text-white transition-colors">Degree Level Prelims</Link>
              </li>
              <li>
                <Link to="/exams/kerala-police-si" className="hover:text-white transition-colors">Kerala Police SI</Link>
              </li>
              <li>
                <Link to="/exams/ktet-category-1-4" className="hover:text-white transition-colors">KTET Category 1-4</Link>
              </li>
              <li>
                <Link to="/exams/ssc-cgl" className="hover:text-white transition-colors">SSC CGL & CHSL</Link>
              </li>
              <li>
                <Link to="/exams" className="text-emerald-400 hover:text-emerald-300 font-medium">All 10 Categories &rarr;</Link>
              </li>
            </ul>
          </div>

          {/* Study Resources */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/papers" className="hover:text-white transition-colors">Previous Year Paper Archive</Link>
              </li>
              <li>
                <Link to="/dashboard/practice" className="hover:text-white transition-colors">Topic-wise MCQ Practice</Link>
              </li>
              <li>
                <Link to="/dashboard/mock-tests" className="hover:text-white transition-colors">Timed Mock Tests</Link>
              </li>
              <li>
                <Link to="/dashboard/daily-challenge" className="hover:text-white transition-colors">Daily Question Booster</Link>
              </li>
              <li>
                <Link to="/dashboard/mistakes" className="hover:text-white transition-colors">Mistake Notebook</Link>
              </li>
            </ul>
          </div>

          {/* Platform & Governance */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide">Portal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About the Project</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Account Login</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">Create Student Account</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Kerala PYQ Hub &bull; One Platform. Every Exam. Smarter Preparation.
          </div>
          <div className="flex items-center gap-4">
            <span>Free and open educational technology project</span>
            <span>&bull;</span>
            <Link to="/about" className="hover:text-slate-400">Disclaimer & Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
