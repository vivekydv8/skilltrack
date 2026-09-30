import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle, Info, Sparkles } from 'lucide-react';

export type StatusVariant =
  | 'success'
  | 'verified'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'ai';

export interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
  pulse = false,
  className = '',
}) => {
  const styles = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    verified: 'bg-teal-50 text-teal-800 border-teal-200/80',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/80',
    danger: 'bg-rose-50 text-rose-800 border-rose-200/80',
    info: 'bg-sky-50 text-sky-800 border-sky-200/80',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    ai: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
  }[variant];

  const icons = {
    success: CheckCircle2,
    verified: CheckCircle2,
    warning: AlertTriangle,
    danger: XCircle,
    info: Info,
    neutral: Clock,
    ai: Sparkles,
  }[variant];

  const Icon = icons;

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${styles} ${sizeClasses} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      )}
      {!pulse && <Icon className="w-3.5 h-3.5" />}
      <span>{label}</span>
    </span>
  );
};
