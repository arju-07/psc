import React from 'react';
import { BookOpenCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  to?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = false,
  to = '/',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const titleSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl font-bold tracking-tight',
    lg: 'text-2xl font-extrabold tracking-tight',
  };

  const content = (
    <div className="flex items-center gap-2.5 group cursor-pointer select-none">
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-navy-800 to-navy-900 text-white shadow-md shadow-navy-900/10 dark:from-navy-700 dark:to-navy-900 border border-navy-700/50 ${iconSizes[size]} transition-transform duration-200 group-hover:scale-105`}>
        <BookOpenCheck className="w-5 h-5 text-emerald-400" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className={`${titleSizes[size]} text-slate-900 dark:text-white font-sans`}>
            Kerala <span className="text-navy-700 dark:text-sky-400 font-extrabold">PYQ</span> Hub
          </span>
          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
            PRO
          </span>
        </div>
        {showTagline && (
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-tight">
            One Platform. Every Exam. Smarter Preparation.
          </span>
        )}
      </div>
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
};
