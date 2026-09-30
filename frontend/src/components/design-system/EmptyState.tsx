import React from 'react';
import { Compass, ArrowRight, Sparkles, FolderOpen } from 'lucide-react';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No verified employment records found',
  description = 'Your employment journey has not been updated yet. Log verified placement outcomes to establish longitudinal integrity.',
  actionLabel = 'Update Employment Record',
  onAction,
  icon: Icon = Compass,
  className = '',
}) => {
  return (
    <div
      className={`bg-white border border-slate-200/90 rounded-2xl p-8 shadow-depth-card text-center flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}
    >
      {/* Perspective / Minimal Journey Illustration */}
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-3xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shadow-depth-sm">
          <Icon className="w-8 h-8" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 text-teal-300 flex items-center justify-center text-xs shadow">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      <h4 className="text-base font-bold text-slate-900 tracking-tight">{title}</h4>
      <p className="text-xs text-slate-500 mt-1.5 max-w-sm leading-relaxed">{description}</p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 st-btn st-btn-primary px-4 py-2 text-xs font-bold gap-1.5"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
