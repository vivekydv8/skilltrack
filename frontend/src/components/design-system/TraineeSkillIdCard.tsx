import React, { useState } from 'react';
import {
  ShieldCheck,
  QrCode,
  Share2,
  Lock,
  Eye,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { toast } from '../Toast';

export interface TraineeSkillIdCardProps {
  skillId?: string;
  traineeName?: string;
  roleTitle?: string;
  isVerified?: boolean;
  onViewDetails?: () => void;
  onManagePrivacy?: () => void;
  className?: string;
}

export const TraineeSkillIdCard: React.FC<TraineeSkillIdCardProps> = ({
  skillId = 'ST-MH-7X42K9',
  traineeName = 'Rahul Kumar',
  roleTitle = 'Certified EV Diagnostics Specialist',
  isVerified = true,
  onViewDetails,
  onManagePrivacy,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(skillId);
    setCopied(true);
    toast.success('Skill ID Copied', `${skillId} copied to clipboard.`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `SkillTrackAI Skill Passport - ${traineeName}`,
          text: `Verified Skill Passport for ${traineeName} (${skillId}) on SkillTrackAI Maharashtra`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      handleCopyId();
    }
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white p-6 shadow-depth-elevated border border-slate-700/80 ${className}`}
    >
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Official Government of Maharashtra Watermark */}
      <div className="relative flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-teal-400 flex items-center gap-1.5">
              <span>Government of Maharashtra</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              <span>Skill Passport</span>
            </div>
            <h3 className="text-lg font-extrabold text-white tracking-tight mt-0.5">
              {traineeName}
            </h3>
            <p className="text-xs text-slate-300 font-medium">{roleTitle}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex flex-col items-end">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              isVerified
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isVerified ? 'Profile Verified' : 'Partially Verified'}</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">DPDP Act 2023 Consented</span>
        </div>
      </div>

      {/* Middle Bar: Skill ID with Copy Button */}
      <div className="relative bg-slate-950/60 rounded-xl p-3.5 border border-slate-700/60 flex items-center justify-between gap-3 mb-5">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
            Digital Skill Identifier
          </span>
          <span className="text-base font-mono font-bold text-teal-300 tracking-wider">
            {skillId}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyId}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-600/60 transition-all active:scale-95"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy ID'}</span>
        </button>
      </div>

      {/* Bottom Actions Row */}
      <div className="relative pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {onViewDetails && (
            <button
              type="button"
              onClick={onViewDetails}
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-teal-400" />
              <span>View Credential</span>
            </button>
          )}

          {onManagePrivacy && (
            <button
              type="button"
              onClick={onManagePrivacy}
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors ml-3"
            >
              <Lock className="w-3.5 h-3.5 text-teal-400" />
              <span>Privacy Controls</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium shadow-sm transition-all active:scale-95"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Passport</span>
        </button>
      </div>
    </div>
  );
};
