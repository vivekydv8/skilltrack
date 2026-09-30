import React from 'react';

export interface SkillTrackCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  elevation?: 'flat' | 'default' | 'elevated' | 'floating';
  accent?: 'none' | 'teal' | 'green' | 'amber' | 'coral' | 'indigo';
  onClick?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const SkillTrackCard: React.FC<SkillTrackCardProps> = ({
  children,
  className = '',
  interactive = false,
  elevation = 'default',
  accent = 'none',
  onClick,
  header,
  footer,
}) => {
  const elevationClasses = {
    flat: 'border border-slate-200 bg-white',
    default: 'st-card',
    elevated: 'st-panel-elevated',
    floating: 'bg-white rounded-2xl border border-slate-200 shadow-depth-floating',
  }[elevation];

  const accentClasses = {
    none: '',
    teal: 'border-t-4 border-t-teal-600',
    green: 'border-t-4 border-t-emerald-600',
    amber: 'border-t-4 border-t-amber-500',
    coral: 'border-t-4 border-t-rose-500',
    indigo: 'border-t-4 border-t-indigo-600',
  }[accent];

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden transition-all duration-200 ${elevationClasses} ${accentClasses} ${
        interactive ? 'st-card-interactive' : ''
      } ${className}`}
    >
      {header && <div className="px-5 py-4 border-b border-slate-100">{header}</div>}
      <div className="p-5">{children}</div>
      {footer && <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 text-xs text-slate-500">{footer}</div>}
    </div>
  );
};
