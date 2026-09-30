import React from 'react';
import {
  Sparkles,
  Eye,
  FileCheck2,
  AlertTriangle,
  Layers,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export interface InsightCardProps {
  title?: string;
  observed: string;
  evidence: string | string[];
  skillGap?: string;
  contributingFactors?: string[];
  suggestedAction: {
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
  };
  confidenceScore?: number;
  lastUpdated?: string;
  className?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  title = 'WHY IS THIS HAPPENING?',
  observed,
  evidence,
  skillGap,
  contributingFactors,
  suggestedAction,
  confidenceScore = 94,
  lastUpdated = 'Live Analysis',
  className = '',
}) => {
  const evidenceList = Array.isArray(evidence) ? evidence : [evidence];

  return (
    <div
      className={`bg-white border border-slate-200/90 rounded-2xl p-5 shadow-depth-card relative overflow-hidden ${className}`}
    >
      {/* Top Banner with AI Indicator & Confidence */}
      <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600">
            <Sparkles className="w-4 h-4 animate-pulse-slow" />
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-wider text-slate-800 uppercase">
              {title}
            </h4>
            <span className="text-[11px] text-slate-400">AI Analysis</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-700 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>{confidenceScore}% confidence</span>
        </div>
      </div>

      {/* Elegant Vertical Intelligence Timeline */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-teal-500 before:via-slate-200 before:to-emerald-500">
        {/* 1. Observed Signal */}
        <div className="relative group">
          <div className="absolute -left-6 top-0.5 w-3 h-3 rounded-full bg-teal-600 ring-4 ring-teal-100 transition-transform group-hover:scale-125" />
          <div className="text-[11px] font-bold text-teal-800 uppercase tracking-wide flex items-center gap-1.5">
            <Eye className="w-3 h-3 text-teal-600" />
            Key Finding
          </div>
          <p className="text-sm font-semibold text-slate-900 mt-0.5 leading-snug">
            {observed}
          </p>
        </div>

        {/* 2. Evidence */}
        <div className="relative group">
          <div className="absolute -left-6 top-0.5 w-3 h-3 rounded-full bg-slate-400 ring-4 ring-slate-100 transition-transform group-hover:scale-125" />
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
            <FileCheck2 className="w-3 h-3 text-slate-500" />
            Supporting Data
          </div>
          <div className="mt-1 space-y-1">
            {evidenceList.map((item, idx) => (
              <p key={idx} className="text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-lg p-2 leading-relaxed">
                {item}
              </p>
            ))}
          </div>
        </div>

        {/* 3. Skill Gap Data (if provided) */}
        {skillGap && (
          <div className="relative group">
            <div className="absolute -left-6 top-0.5 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-100 transition-transform group-hover:scale-125" />
            <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              Identified Skill Gap
            </div>
            <p className="text-xs font-medium text-amber-900 bg-amber-50/70 border border-amber-200/80 rounded-lg p-2 mt-1 leading-snug">
              {skillGap}
            </p>
          </div>
        )}

        {/* 4. Contributing Factors (if provided) */}
        {contributingFactors && contributingFactors.length > 0 && (
          <div className="relative group">
            <div className="absolute -left-6 top-0.5 w-3 h-3 rounded-full bg-slate-400 ring-4 ring-slate-100" />
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-slate-500" />
              Contributing Factors
            </div>
            <ul className="mt-1 space-y-1 text-xs text-slate-600 list-disc list-inside">
              {contributingFactors.map((factor, idx) => (
                <li key={idx} className="leading-relaxed">{factor}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 5. Suggested Action */}
        <div className="relative group">
          <div className="absolute -left-6 top-0.5 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-100 transition-transform group-hover:scale-125" />
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Suggested Policy / Action
          </div>
          <div className="mt-1.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
            <div className="text-xs font-bold text-emerald-950">
              {suggestedAction.title}
            </div>
            {suggestedAction.description && (
              <p className="text-xs text-emerald-800/90 mt-1 leading-relaxed">
                {suggestedAction.description}
              </p>
            )}
            {suggestedAction.actionLabel && (
              <button
                type="button"
                onClick={suggestedAction.onAction}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 px-3 py-1.5 rounded-lg shadow-sm transition-all active:scale-95"
              >
                <span>{suggestedAction.actionLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer Timestamp */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {lastUpdated}
        </span>
        <span className="text-slate-400">Causal Impact Inferred</span>
      </div>
    </div>
  );
};
