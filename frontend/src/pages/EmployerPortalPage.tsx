import React, { useState, useEffect } from 'react';
import {
  Building2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  HelpCircle,
  FileCheck,
  ShieldCheck,
  Building,
  RefreshCw,
  Search
} from 'lucide-react';
import { fetchApi } from '../api/client';
import { ConfidenceBadge } from '../components/ConfidenceBadge';
import { useAuth } from '../context/AuthContext';

interface PendingValidationItem {
  placement_id: string;
  trainee_id: string;
  trainee_name: string;
  trainee_code: string;
  course_name: string;
  employer_id: string;
  employer_name: string;
  reported_job_role: string;
  reported_wage: number;
  placement_date: string;
  reporting_source: string;
  confidence_score: number;
  verification_status: string;
  offer_letter_uploaded: boolean;
  payslip_uploaded: boolean;
  validation_action: string;
  confirmed_wage?: number;
  confirmed_role?: string;
  dispute_reason?: string;
  has_mismatch: boolean;
  mismatch_details?: string;
}

interface MismatchItem {
  validation_id: string;
  placement_id: string;
  trainee_name: string;
  trainee_code: string;
  employer_name: string;
  reported_wage: number;
  confirmed_wage: number;
  action: string;
  mismatch_details: string;
  action_by: string;
  timestamp: string;
}

export const EmployerPortalPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [validations, setValidations] = useState<PendingValidationItem[]>([]);
  const [mismatches, setMismatches] = useState<MismatchItem[]>([]);
  const [tab, setTab] = useState<'pending' | 'mismatches'>('pending');
  const [selectedPlacement, setSelectedPlacement] = useState<PendingValidationItem | null>(null);

  // Modal form states
  const [actionType, setActionType] = useState<'Confirmed' | 'Disputed' | 'Not Aware'>('Confirmed');
  const [confirmedWage, setConfirmedWage] = useState<number>(0);
  const [confirmedRole, setConfirmedRole] = useState<string>('');
  const [disputeReason, setDisputeReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [valRes, misRes] = await Promise.all([
        fetchApi<PendingValidationItem[]>('/api/employer/pending-validations'),
        fetchApi<MismatchItem[]>('/api/employer/mismatches'),
      ]);
      setValidations(valRes);
      setMismatches(misRes);
    } catch (err) {
      console.error('Failed to load employer validations', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openValidationModal = (p: PendingValidationItem, defaultAction: 'Confirmed' | 'Disputed' | 'Not Aware') => {
    setSelectedPlacement(p);
    setActionType(defaultAction);
    setConfirmedWage(p.reported_wage);
    setConfirmedRole(p.reported_job_role);
    setDisputeReason('');
  };

  const handleValidationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlacement) return;

    try {
      setIsSubmitting(true);
      const uName = currentUser?.name || 'HR Partner';
      const uRole = currentUser?.role || 'employer';
      await fetchApi(
        `/api/employer/validate/${selectedPlacement.placement_id}?user_name=${encodeURIComponent(uName)}&user_role=${uRole}`,
        {
          method: 'POST',
          body: JSON.stringify({
            action: actionType,
            confirmed_wage: Number(confirmedWage),
            confirmed_role: confirmedRole,
            dispute_reason: disputeReason || undefined,
            action_by_user: uName
          })
        }
      );
      alert(`Validation action "${actionType}" submitted. Confidence score updated.`);
      setSelectedPlacement(null);
      loadData();
    } catch (err) {
      alert(`Validation error: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gov-100 text-gov-800 rounded">
              Employer Verification Layer
            </span>
            <span className="text-xs text-slate-400">• Multi-Tiered Confidence Scoring</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            Industry & Employer Validation Portal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Confirm, dispute, or reconcile placement records submitted by providers and candidates to ensure 100% verified ground truth
          </p>
        </div>
      </div>

      {/* Confidence Score Hierarchy Explainer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-lg border border-slate-200 text-xs">
        <div className="p-3 bg-slate-50 rounded border border-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Tier 1: Self-Reported</p>
          <p className="text-sm font-bold text-amber-700 mt-0.5">25% Confidence</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Unverified trainee survey submission</p>
        </div>
        <div className="p-3 bg-slate-50 rounded border border-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Tier 2: Provider-Reported</p>
          <p className="text-sm font-bold text-sky-700 mt-0.5">50% Confidence</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Center placement cell declaration</p>
        </div>
        <div className="p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-[10px] font-bold text-blue-800 uppercase">Tier 3: Employer-Confirmed</p>
          <p className="text-sm font-bold text-blue-900 mt-0.5">85% Confidence</p>
          <p className="text-[10px] text-blue-700 mt-0.5">HR validated via SkillTrackAI Portal</p>
        </div>
        <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
          <p className="text-[10px] font-bold text-emerald-800 uppercase">Tier 4: Document-Verified</p>
          <p className="text-sm font-bold text-emerald-900 mt-0.5">100% Confidence</p>
          <p className="text-[10px] text-emerald-700 mt-0.5">Payslip / EPFO contribution matched</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setTab('pending')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded transition ${
            tab === 'pending'
              ? 'bg-gov-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Placement Records ({validations.length})
        </button>
        <button
          onClick={() => setTab('mismatches')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded flex items-center gap-1.5 transition ${
            tab === 'mismatches'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Flagged Data Mismatches ({mismatches.length})</span>
        </button>
      </div>

      {/* Main List */}
      {tab === 'pending' ? (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Trainee Code & Name</th>
                  <th className="py-3 px-4">Employer & Course</th>
                  <th className="py-3 px-4 text-right">Reported Wage</th>
                  <th className="py-3 px-4 text-center">Confidence Score</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Validation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {validations.map((p) => (
                  <tr key={p.placement_id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{p.trainee_name}</p>
                      <p className="font-mono text-[10px] text-gov-800">{p.trainee_code}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900">{p.employer_name}</p>
                      <p className="text-[11px] text-slate-500">{p.reported_job_role}</p>
                      <p className="text-[10px] text-slate-400">{p.course_name}</p>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      ₹{p.reported_wage.toLocaleString('en-IN')}
                      {p.has_mismatch && (
                        <span className="block text-[10px] text-rose-600 font-medium">⚠️ Mismatch</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <ConfidenceBadge score={p.confidence_score} status={p.verification_status} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        p.validation_action === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.validation_action === 'Disputed'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.validation_action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openValidationModal(p, 'Confirmed')}
                          className="px-2.5 py-1 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded transition"
                          title="Confirm Placement Record"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => openValidationModal(p, 'Disputed')}
                          className="px-2 py-1 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded transition"
                          title="Dispute Record / Report Discrepancy"
                        >
                          Dispute
                        </button>
                        <button
                          onClick={() => openValidationModal(p, 'Not Aware')}
                          className="px-2 py-1 text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded transition"
                          title="Candidate Not in Company Records"
                        >
                          Not Aware
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Mismatches Queue */
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-rose-50 border-b border-rose-200 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900">
                Flagged Discrepancies Requiring Manual Administrative Review
              </h3>
              <p className="text-[11px] text-rose-700 mt-0.5">
                Automatically flagged when employer confirmed wage differs from candidate-reported CTC by &gt; ₹500
              </p>
            </div>
            <span className="px-2 py-0.5 bg-rose-200 text-rose-900 font-bold text-xs rounded">
              {mismatches.length} Mismatches
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {mismatches.map((m) => (
              <div key={m.validation_id} className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{m.trainee_name}</span>
                    <span className="font-mono text-xs text-slate-500">({m.trainee_code})</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                      {m.action}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1">
                    Employer: <strong>{m.employer_name}</strong>
                  </p>
                  <p className="text-xs text-rose-800 font-medium mt-0.5">
                    {m.mismatch_details}
                  </p>
                </div>
                <div className="text-right text-xs">
                  <p className="text-slate-500">Reported: <strong>₹{m.reported_wage?.toLocaleString('en-IN')}</strong></p>
                  <p className="text-emerald-700">Confirmed: <strong>₹{m.confirmed_wage?.toLocaleString('en-IN')}</strong></p>
                  <p className="text-[10px] text-slate-400 mt-1">Audited by: {m.action_by}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Validation Action Modal */}
      {selectedPlacement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Employer Validation: {selectedPlacement.trainee_name}
            </h3>
            <p className="text-xs text-slate-500">
              Company: <strong>{selectedPlacement.employer_name}</strong>
            </p>

            <form onSubmit={handleValidationSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Validation Action</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Confirmed', 'Disputed', 'Not Aware'] as const).map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setActionType(a)}
                      className={`py-1.5 text-xs font-bold rounded border ${
                        actionType === a ? 'bg-gov-700 text-white border-gov-800' : 'bg-slate-50 text-slate-700'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {actionType === 'Confirmed' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Confirmed Monthly Base Wage (₹)
                    </label>
                    <input
                      type="number"
                      value={confirmedWage}
                      onChange={(e) => setConfirmedWage(Number(e.target.value))}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Reported by candidate: ₹{selectedPlacement.reported_wage.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Confirmed Job Designation
                    </label>
                    <input
                      type="text"
                      value={confirmedRole}
                      onChange={(e) => setConfirmedRole(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </>
              )}

              {(actionType === 'Disputed' || actionType === 'Not Aware') && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Dispute Reason / Clarification
                  </label>
                  <textarea
                    required
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    placeholder="Candidate did not complete probation / Wage reported includes overtime..."
                    className="w-full text-xs p-2 border border-slate-300 rounded"
                    rows={3}
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedPlacement(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-gov-700 hover:bg-gov-800 rounded"
                >
                  {isSubmitting ? 'Saving...' : 'Submit Validation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
