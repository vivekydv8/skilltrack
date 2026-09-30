import React from 'react';
import { ShieldCheck, Database, CheckCircle, Clock } from 'lucide-react';

export interface SourceBadgeProps {
  source: string;
  lastUpdated?: string;
  confidence?: 'VERIFIED' | 'HIGH' | 'MEDIUM' | 'INFERRED' | string;
  className?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({
  source,
  lastUpdated,
  confidence,
  className = '',
}) => {
  const getConfidenceStyle = (conf?: string) => {
    switch (conf?.toUpperCase()) {
      case 'VERIFIED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'HIGH':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-xs text-slate-600 ${className}`}
    >
      <Database className="w-3 h-3 text-teal-600" />
      <span className="font-medium text-slate-800">{source}</span>
      {confidence && (
        <span
          className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${getConfidenceStyle(
            confidence
          )}`}
        >
          {confidence}
        </span>
      )}
      {lastUpdated && (
        <span className="text-[10px] text-slate-400 pl-1 border-l border-slate-200 flex items-center gap-0.5">
          <Clock className="w-2.5 h-2.5" />
          {lastUpdated}
        </span>
      )}
    </div>
  );
};
