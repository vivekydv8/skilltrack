import React from 'react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export interface DataSourceCardProps {
  id: string;
  name: string;
  category: 'Government Source' | 'SkillTrackAI Data Layer' | 'Analytics Engine' | 'Government Intelligence';
  status: 'Operational' | 'Degraded' | 'Syncing' | 'Scheduled' | string;
  lastSync: string;
  recordCount: number | string;
  healthPercent: number; // 0 to 100
  latencyMs?: number;
  errorStatus?: string | null;
  onManualSync?: () => void;
  className?: string;
}

export const DataSourceCard: React.FC<DataSourceCardProps> = ({
  name,
  category,
  status,
  lastSync,
  recordCount,
  healthPercent,
  latencyMs = 45,
  errorStatus = null,
  onManualSync,
  className = '',
}) => {
  const isHealthy = healthPercent >= 90;

  return (
    <div
      className={`bg-white border rounded-2xl p-5 shadow-depth-card transition-all duration-200 hover:shadow-depth-hover ${
        isHealthy ? 'border-slate-200' : 'border-amber-300'
      } ${className}`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-teal-700 shadow-sm shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              {category}
            </span>
            <h4 className="text-sm font-bold text-slate-900 tracking-tight mt-1">
              {name}
            </h4>
          </div>
        </div>

        {/* Status Pill */}
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
            status === 'Operational'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : status === 'Syncing'
              ? 'bg-teal-50 text-teal-800 border border-teal-200 animate-pulse'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}
        >
          {status === 'Operational' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          )}
          <span>{status}</span>
        </span>
      </div>

      {/* Metrics Row: Records, Health, Latency */}
      <div className="grid grid-cols-3 gap-2 my-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
        <div>
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Records</span>
          <span className="text-sm font-extrabold text-slate-900 tabular-nums">{recordCount}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Health</span>
          <span className="text-sm font-extrabold text-emerald-700 tabular-nums">{healthPercent}%</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Latency</span>
          <span className="text-sm font-extrabold text-slate-700 tabular-nums">{latencyMs}ms</span>
        </div>
      </div>

      {/* Error state if any */}
      {errorStatus && (
        <div className="mb-3 p-2 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span className="line-clamp-1">{errorStatus}</span>
        </div>
      )}

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1 text-[11px] text-slate-400">
          <Clock className="w-3 h-3 text-slate-400" />
          Last Sync: {lastSync}
        </span>

        {onManualSync && (
          <button
            type="button"
            onClick={onManualSync}
            className="inline-flex items-center gap-1 font-semibold text-teal-700 hover:text-teal-800 hover:underline"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Sync Node</span>
          </button>
        )}
      </div>
    </div>
  );
};
