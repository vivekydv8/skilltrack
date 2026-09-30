import React from 'react';
import { Download, Clock, ShieldCheck, Filter, Maximize2 } from 'lucide-react';

export interface AnimatedChartProps {
  title: string;
  subtitle?: string;
  source?: string;
  lastUpdated?: string;
  period?: string;
  children: React.ReactNode;
  filterOptions?: string[];
  selectedFilter?: string;
  onFilterChange?: (filter: string) => void;
  onExport?: () => void;
  className?: string;
  accentColor?: string;
  height?: number;
}

export const AnimatedChart: React.FC<AnimatedChartProps> = ({
  title,
  subtitle,
  source = 'Directorate of Vocational Education & Training (DVET) & MSSDS',
  lastUpdated = 'Synced today at 04:30 AM IST',
  period = 'FY 2024–25',
  children,
  filterOptions,
  selectedFilter,
  onFilterChange,
  onExport,
  className = '',
  accentColor = '#0D9488',
  height = 320,
}) => {
  return (
    <div
      className={`chart-container-premium flex flex-col justify-between ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight uppercase">
              {title}
            </h3>
            {period && (
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
                style={{
                  background: `${accentColor}15`,
                  color: accentColor,
                  borderColor: `${accentColor}40`,
                }}
              >
                {period}
              </span>
            )}
            {/* Live indicator */}
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              LIVE
            </span>
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {filterOptions && onFilterChange && (
            <div className="flex items-center gap-0.5 bg-slate-50 border border-slate-200 p-1 rounded-xl">
              <Filter className="w-3 h-3 text-slate-400 ml-1.5 mr-0.5" />
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onFilterChange(opt)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedFilter === opt
                      ? 'bg-white text-teal-700 shadow-sm border border-slate-200/60 font-bold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {onExport && (
            <button
              type="button"
              onClick={onExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-teal-400 text-slate-600 hover:text-teal-700 text-xs font-semibold transition-all shadow-sm hover:shadow-md"
            >
              <Download className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full px-4 py-4" style={{ height }}>
        {children}
      </div>

      {/* Footer */}
      <div className="px-6 pb-5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>
            Source:{' '}
            <strong className="text-slate-600 font-semibold">{source}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px]">
          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
          <span>{lastUpdated}</span>
        </div>
      </div>
    </div>
  );
};
