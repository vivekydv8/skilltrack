import React from 'react';
import { Activity, Clock } from 'lucide-react';

export interface DataFreshnessBadgeProps {
  lastSync?: string;
  isLive?: boolean;
  statusText?: string;
  className?: string;
}

export const DataFreshnessBadge: React.FC<DataFreshnessBadgeProps> = ({
  lastSync = '2 mins ago',
  isLive = true,
  statusText = 'Data systems connected',
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 text-white border border-slate-700/60 shadow-sm text-xs ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {isLive && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isLive ? 'bg-emerald-400' : 'bg-slate-400'
          }`}
        ></span>
      </span>

      <span className="font-medium text-slate-200">{statusText}</span>

      {lastSync && (
        <span className="text-slate-400 border-l border-slate-700 pl-2 text-[11px] flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          {lastSync}
        </span>
      )}
    </div>
  );
};
