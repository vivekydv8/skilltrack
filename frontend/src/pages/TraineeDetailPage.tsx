import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  TrendingUp,
  Clock,
  PlusCircle,
  FileCheck,
  UserX,
  AlertTriangle,
  History,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { fetchApi } from '../api/client';
import { TraineeDetail } from '../types';
import { useAuth } from '../context/AuthContext';
import { ConfidenceBadge } from '../components/ConfidenceBadge';
import { RiskBadge } from '../components/RiskBadge';

interface TraineeDetailPageProps {
  traineeId: string;
  onBack: () => void;
  onTriggerFollowUp?: (trainee: TraineeDetail) => void;
}

export const TraineeDetailPage: React.FC<TraineeDetailPageProps> = ({
  traineeId,
  onBack,
  onTriggerFollowUp
}) => {
  const { currentUser } = useAuth();
  const [trainee, setTrainee] = useState<TraineeDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // New Alternate Contact Form state
  const [showAddContact, setShowAddContact] = useState<boolean>(false);
  const [contactType, setContactType] = useState<string>('phone');
  const [contactValue, setContactValue] = useState<string>('');
  const [contactSource, setContactSource] = useState<string>('Candidate Self-Update');

  // Opt-out modal state
  const [showOptOut, setShowOptOut] = useState<boolean>(false);
  const [optOutReason, setOptOutReason] = useState<string>('');
  const [requestDelete, setRequestDelete] = useState<boolean>(false);

  const uName = currentUser?.name || 'Administrator';
  const uRole = currentUser?.role || 'govt_admin';

  const loadDetail = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.append('role', uRole);
      params.append('user_name', uName);
      params.append('purpose', 'Inspecting Longitudinal Career Timeline & Consent Records');
      const data = await fetchApi<TraineeDetail>(`/api/trainees/${traineeId}?${params.toString()}`);
      setTrainee(data);
    } catch (err) {
      console.error('Failed to load trainee details', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [traineeId, currentUser?.role]);

  const handleAddContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactValue) return;
    try {
      await fetchApi(`/api/trainees/${traineeId}/contacts?user_name=${encodeURIComponent(uName)}&user_role=${uRole}`, {
        method: 'POST',
        body: JSON.stringify({
          contact_type: contactType,
          contact_value: contactValue,
          source: contactSource
        })
      });
      alert('Alternate contact linked under persistent Trainee ID!');
      setContactValue('');
      setShowAddContact(false);
      loadDetail();
    } catch (err) {
      alert(`Error saving contact: ${err}`);
    }
  };

  const handleOptOutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi(`/api/privacy/opt-out/${traineeId}?user_name=${encodeURIComponent(uName)}&user_role=${uRole}`, {
        method: 'POST',
        body: JSON.stringify({
          opt_out_reason: optOutReason || 'Candidate revoked tracking consent under DPDP Act',
          request_data_deletion: requestDelete
        })
      });
      alert('Consent opt-out processed. Longitudinal tracking suspended.');
      setShowOptOut(false);
      loadDetail();
    } catch (err) {
      alert(`Error processing opt-out: ${err}`);
    }
  };

  if (isLoading || !trainee) {
    return (
      <div className="p-12 text-center text-slate-500">
        <div className="animate-spin w-8 h-8 border-4 border-gov-700 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-xs font-semibold">Loading persistent longitudinal trainee profile & consent history...</p>
      </div>
    );
  }

  // Calculate wage growth if multiple milestones exist
  const wages = trainee.timeline_logs.map(tl => tl.monthly_wage).filter(w => w > 0);
  const startWage = wages.length > 0 ? wages[0] : 0;
  const currentWage = wages.length > 0 ? wages[wages.length - 1] : 0;
  const wageGrowthPct = startWage > 0 ? Math.round(((currentWage - startWage) / startWage) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded shadow-xs transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Registry</span>
        </button>

        <div className="flex items-center gap-2">
          {trainee.consent && !trainee.consent.opted_out && (
            <button
              onClick={() => setShowOptOut(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition"
            >
              <UserX className="w-3.5 h-3.5" />
              <span>Consent Opt-Out / DPDP Request</span>
            </button>
          )}

          {onTriggerFollowUp && (
            <button
              onClick={() => onTriggerFollowUp(trainee)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gov-700 hover:bg-gov-800 rounded transition shadow-xs"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Simulate Scheduled Follow-Up Trigger</span>
            </button>
          )}
        </div>
      </div>

      {/* Trainee Master Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{trainee.full_name}</h1>
              <span className="font-mono text-xs font-bold text-gov-800 bg-gov-50 px-2 py-0.5 rounded border border-gov-200">
                {trainee.trainee_code}
              </span>
              <RiskBadge level={trainee.risk_level} score={trainee.risk_score} />
            </div>
            <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
              <span>{trainee.gender}, {trainee.age} Years</span>
              <span>• Category: <strong>{trainee.category}</strong></span>
              <span>• District: <strong>{trainee.district}</strong></span>
              <span>• Education: <strong>{trainee.education_level}</strong></span>
            </p>
          </div>

          {/* Persistent ID Badge */}
          <div className="p-3 bg-gov-50 border border-gov-200 rounded-lg text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gov-800">
              Persistent Trainee UUID
            </span>
            <p className="font-mono text-xs font-bold text-gov-950 mt-0.5">{trainee.id}</p>
            <p className="text-[10px] text-gov-700 mt-0.5">
              Survives SIM/phone changes via alternate contact history
            </p>
          </div>
        </div>

        {/* Course & Training Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded">
            <span className="text-[11px] text-slate-500 block font-medium">Enrolled Course</span>
            <span className="text-xs font-bold text-slate-900">{trainee.course?.course_name}</span>
            <span className="text-[10px] text-slate-400 block">{trainee.course?.sector}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded">
            <span className="text-[11px] text-slate-500 block font-medium">Accredited Provider</span>
            <span className="text-xs font-bold text-slate-900">{trainee.provider?.name}</span>
            <span className="text-[10px] text-slate-400 block">Grade {trainee.provider?.grade}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded">
            <span className="text-[11px] text-slate-500 block font-medium">Attendance & Score</span>
            <span className={`text-xs font-bold ${trainee.attendance_percentage < 75 ? 'text-rose-600' : 'text-slate-900'}`}>
              {trainee.attendance_percentage}% Attendance
            </span>
            <span className="text-[10px] text-slate-400 block">Assessment: {trainee.assessment_score}/100</span>
          </div>
          <div className="bg-slate-50 p-3 rounded">
            <span className="text-[11px] text-slate-500 block font-medium">Longitudinal Wage Growth</span>
            <span className="text-xs font-bold text-emerald-700">
              {wageGrowthPct > 0 ? `+${wageGrowthPct}% Growth` : 'Baseline Wage Established'}
            </span>
            <span className="text-[10px] text-slate-500 block">
              ₹{startWage.toLocaleString('en-IN')} → ₹{currentWage.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: 1. Explicit Consent & 2. Alternate Contact History */}
        <div className="space-y-6">
          {/* 1. Explicit Consent Record Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gov-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Explicit Digital Consent Record
                </h3>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                trainee.consent?.opted_out
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                {trainee.consent?.opted_out ? 'Opted Out' : 'Active Consent'}
              </span>
            </div>

            {trainee.consent ? (
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] font-mono leading-relaxed">
                  "{trainee.consent.purpose_of_use_text}"
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Consent Version</span>
                  <span className="font-semibold text-slate-800">{trainee.consent.consent_version}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Captured Timestamp</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(trainee.consent.consent_timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Source IP & Verification</span>
                  <span className="font-semibold text-slate-800">{trainee.consent.ip_address} (Digital OTP)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">EPFO & Placement Tracking</span>
                  <span className="font-semibold text-emerald-700">
                    {trainee.consent.allow_placement_tracking ? 'Authorized' : 'Restricted'}
                  </span>
                </div>

                {trainee.consent.opted_out && (
                  <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded text-[11px] text-rose-800">
                    <p className="font-bold">Opt-Out Reason:</p>
                    <p>{trainee.consent.opt_out_reason}</p>
                    <p className="mt-1 text-[10px]">Deletion Status: <strong>{trainee.consent.deletion_status}</strong></p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No consent record logged.</p>
            )}
          </div>

          {/* 2. Alternate Contact History (Persistent UUID Proof) */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-gov-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Alternate Contact History
                </h3>
              </div>
              <button
                onClick={() => setShowAddContact(!showAddContact)}
                className="text-[11px] font-semibold text-gov-800 hover:text-gov-900 flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Contact</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Survives mobile/address changes by storing historical contact logs under persistent Trainee UUID.
            </p>

            {/* Add Contact Inline Form */}
            {showAddContact && (
              <form onSubmit={handleAddContactSubmit} className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Contact Type</label>
                  <select
                    value={contactType}
                    onChange={(e) => setContactType(e.target.value)}
                    className="w-full text-xs px-2 py-1 border border-slate-300 rounded"
                  >
                    <option value="alternate_phone">Alternate Phone</option>
                    <option value="guardian_phone">Guardian / Family Phone</option>
                    <option value="whatsapp">WhatsApp Direct</option>
                    <option value="address">Workplace / Relocation Address</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Value / Number</label>
                  <input
                    type="text"
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    placeholder="+91 98... or Chakan MIDC"
                    className="w-full text-xs px-2 py-1 border border-slate-300 rounded"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddContact(false)}
                    className="text-xs px-2.5 py-1 text-slate-500 hover:bg-slate-200 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-xs px-3 py-1 bg-gov-700 text-white font-bold rounded"
                  >
                    Save Contact
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {trainee.alternate_contacts.map((ac) => (
                <div key={ac.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800 capitalize">
                      {ac.contact_type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">{ac.source}</span>
                  </div>
                  <p className="font-mono text-slate-900 font-medium mt-0.5">{ac.contact_value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (2 spans): THE APPEND-ONLY LONGITUDINAL TIMELINE */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Append-Only Employment Timeline (Longitudinal Log)
                </h3>
                <p className="text-xs text-slate-500">
                  Immutable chronological milestones across 1m, 3m, 6m, 12m follow-up checkpoints
                </p>
              </div>
              <span className="text-[11px] font-semibold text-gov-800 bg-gov-100 px-2 py-0.5 rounded border border-gov-200">
                Key Data Structure
              </span>
            </div>

            {/* Timeline Stepper */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {trainee.timeline_logs.map((tl, idx) => (
                <div key={tl.id} className="relative">
                  {/* Dot */}
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-gov-700 border-2 border-white shadow-xs"></div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-gov-300 transition">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[11px] font-bold bg-gov-800 text-white rounded">
                          {tl.checkpoint} Milestone
                        </span>
                        <span className="text-xs text-slate-500 font-medium">Logged: {tl.log_date}</span>
                      </div>
                      <ConfidenceBadge score={tl.verification_confidence} />
                    </div>

                    <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Status & Employer</span>
                        <span className="font-bold text-slate-900">
                          {tl.status} {tl.employer_name ? `• ${tl.employer_name}` : ''}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Monthly Take-Home</span>
                        <span className="font-bold text-emerald-800 text-sm">
                          ₹{tl.monthly_wage.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Curriculum Relevance</span>
                        <span className="font-semibold text-slate-800">
                          {'★'.repeat(tl.job_relevance_score || 4)}{'☆'.repeat(5 - (tl.job_relevance_score || 4))} ({tl.job_relevance_score}/5)
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
                      <span>Verified by: <strong>{tl.verified_by}</strong> ({tl.source})</span>
                      <span>Same Employer Retention: {tl.is_same_employer_as_last ? '✓ Retained' : 'Switched/Turnover'}</span>
                    </div>

                    {tl.notes && (
                      <p className="mt-1.5 text-[11px] text-slate-600 bg-white p-1.5 rounded border border-slate-200">
                        {tl.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ML In-Training Risk Assessment Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  In-Training ML Risk Analysis & Interventions
                </h3>
              </div>
              <RiskBadge level={trainee.risk_level} score={trainee.risk_score} />
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-bold text-slate-600 uppercase mb-1">Key Contributing Drivers:</p>
                <ul className="space-y-1">
                  {trainee.risk_factors.map((factor, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Opt-Out Modal */}
      {showOptOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Revoke Longitudinal Consent (DPDP Act)</h3>
            <p className="text-xs text-slate-500">
              The candidate has the legal right to stop post-training follow-up surveys or request data deletion.
            </p>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Reason for Opting Out</label>
              <textarea
                value={optOutReason}
                onChange={(e) => setOptOutReason(e.target.value)}
                placeholder="Candidate secured independent livelihood or relocated..."
                className="w-full text-xs p-2 border border-slate-300 rounded"
                rows={3}
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={requestDelete}
                onChange={(e) => setRequestDelete(e.target.checked)}
              />
              <span>Request permanent PII anonymization / deletion</span>
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowOptOut(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleOptOutSubmit}
                className="px-4 py-1.5 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded"
              >
                Confirm Opt-Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
