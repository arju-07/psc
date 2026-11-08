import React from 'react';
import { Link } from 'react-router-dom';
import { ExamCategory } from '../../types';
import {
  GraduationCap,
  Shield,
  BookOpen,
  Compass,
  Landmark,
  Award,
  TrainTrack,
  Building2,
  Flag,
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';

interface CategoryCardProps {
  category: ExamCategory;
  isSelected?: boolean;
  onClick?: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  Shield,
  BookOpen,
  Compass,
  Landmark,
  Award,
  TrainTrack,
  Building2,
  Flag,
  FileSpreadsheet,
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected = false,
  onClick,
}) => {
  const IconComponent = iconMap[category.iconName] || GraduationCap;

  const content = (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between h-full cursor-pointer ${
        isSelected
          ? 'border-navy-600 bg-navy-50/70 dark:bg-slate-800 dark:border-sky-500 shadow-sm'
          : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-navy-300 dark:hover:border-slate-700 hover:shadow-md'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-navy-100 dark:bg-slate-800 text-navy-800 dark:text-sky-300 flex items-center justify-center">
            <IconComponent className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            {category.examCount} Exams
          </span>
        </div>

        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          {category.name}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
          {category.description}
        </p>
      </div>

      <div className="mt-4 pt-2 flex items-center justify-between text-xs font-semibold text-navy-700 dark:text-sky-400">
        <span>Browse Papers & MCQs</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </div>
  );

  return onClick ? content : <Link to={`/exams?category=${category.slug}`}>{content}</Link>;
};
