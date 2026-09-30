import React from 'react';
import { CheckCircle2, Sparkles, Award } from 'lucide-react';

export interface SkillChipProps {
  name: string;
  category?: 'Technical' | 'Domain' | 'Tools' | 'Soft Skills' | string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | string;
  score?: number; // 0 to 100
  isCertified?: boolean;
  isInferred?: boolean;
  onClick?: () => void;
  className?: string;
}

export const SkillChip: React.FC<SkillChipProps> = ({
  name,
  category,
  level,
  score,
  isCertified,
  isInferred,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-medium ${
        isCertified
          ? 'bg-teal-50/80 border-teal-200 text-teal-900 shadow-sm'
          : isInferred
          ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900'
          : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
      } ${onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-depth-sm' : ''} ${className}`}
    >
      {isCertified && (
        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
      )}
      {isInferred && !isCertified && (
        <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
      )}

      <span>{name}</span>

      {category && (
        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-normal">
          {category}
        </span>
      )}

      {score !== undefined && (
        <div className="flex items-center gap-1.5 pl-1 border-l border-slate-200">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                score >= 80 ? 'bg-teal-600' : score >= 60 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
            />
          </div>
          <span className="text-[10px] font-bold tabular-nums text-slate-600">{score}%</span>
        </div>
      )}

      {level && score === undefined && (
        <span className="text-[10px] text-slate-500 font-semibold">{level}</span>
      )}
    </div>
  );
};
