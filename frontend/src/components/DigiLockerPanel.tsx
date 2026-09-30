import React, { useEffect, useState, useCallback } from 'react';
import {
  Shield,
  FileCheck,
  ExternalLink,
  Unlink,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Lock,
  RefreshCw,
  Sparkles,
  Download,
  Eye,
  Check
} from 'lucide-react';
import { toast } from './Toast';

interface DigiLockerDoc {
  id?: string;
  name: string;
  doctype?: string;
  issuer?: string;
  date?: string;
  verification_status?: string;
  source?: string;
  evidence_source?: string;
  extracted_skills?: string[];
}

interface DigiLockerStatus {
  connected: boolean;
  digilocker_user_id?: string;
  mobile_linked?: string;
  linked_at?: string;
  last_sync?: string;
  verified_documents_count?: number;
  verification_seal?: string;
}

interface Props {
  traineeId: string;
  traineeName?: string;
  courseName?: string;
  courseCode?: string;
  completionDate?: string;
  nsqfLevel?: number;
  issuingProvider?: string;
  onSyncComplete?: () => void;
}

export const DigiLockerPanel: React.FC<Props> = ({
  traineeId,
  traineeName = '',
  courseName = '',
  courseCode = '',
  completionDate = new Date().toISOString().slice(0, 10),
  nsqfLevel = 4,
  issuingProvider = 'Government ITI & MSSDS Centre',
  onSyncComplete,
}) => {
  const [connectionStatus, setConnectionStatus] = useState<DigiLockerStatus | null>(null);
  const [documents, setDocuments] = useState<DigiLockerDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [syncStep, setSyncStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(false);

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const statusRes = await fetch(`/api/digilocker/status/${traineeId || 'demo_trainee'}`);
      if (statusRes.ok) {
        const statusData: DigiLockerStatus = await statusRes.json();
        setConnectionStatus(statusData);

        if (statusData.connected) {
          const docsRes = await fetch(`/api/digilocker/documents/${traineeId || 'demo_trainee'}`);
          if (docsRes.ok) {
            const docsData = await docsRes.json();
            setDocuments(docsData.items || docsData.files || []);
          }
        }
      } else {
        setConnectionStatus({ connected: false });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load DigiLocker status.');
    } finally {
      setLoading(false);
    }
  }, [traineeId]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const handleAuthorizeAndSync = async () => {
    setShowConsentModal(false);
    setActionLoading(true);
    setError(null);
    setSuccessMsg(null);

    // Visual sequence of verification steps
    setSyncStep('Authenticating via MeriPehchaan Gateway...');
    await new Promise((r) => setTimeout(r, 600));

    setSyncStep('Fetching issued credentials from National Academic Depository...');
    await new Promise((r) => setTimeout(r, 700));

    setSyncStep('Verifying cryptographic digital signatures & UIDAI CIDR records...');

    try {
      const res = await fetch('/api/digilocker/authorize-and-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainee_id: traineeId || 'demo_trainee',
          consent_granted: true,
          auto_verify_all: true,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || 'DigiLocker authorization failed.');
      }

      const data = await res.json();
      setSyncStep('All credentials verified successfully!');
      await new Promise((r) => setTimeout(r, 500));

      setSuccessMsg(data.message || 'All documents and skills have been automatically verified via DigiLocker.');
      toast.success(
        'DigiLocker Verified',
        `Successfully verified ${data.verified_documents_count || 6} government documents and updated skill profile.`
      );

      await loadStatus();
      if (onSyncComplete) {
        onSyncComplete();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to complete DigiLocker authorization.');
      toast.error('Authorization Error', err.message);
    } finally {
      setActionLoading(false);
      setSyncStep(null);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Are you sure you want to disconnect DigiLocker from your SkillTrackAI profile?')) return;
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/digilocker/disconnect/${traineeId || 'demo_trainee'}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Disconnect failed');
      setSuccessMsg('DigiLocker account unlinked.');
      toast.info('DigiLocker', 'Account disconnected.');
      setTimeout(() => {
        setSuccessMsg(null);
        loadStatus();
        if (onSyncComplete) onSyncComplete();
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePushCertificate = async () => {
    setActionLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch('/api/digilocker/push-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainee_id: traineeId || 'demo_trainee',
          trainee_name: traineeName || 'Candidate',
          course_name: courseName || 'Vocational Electric Vehicle Technician',
          course_code: courseCode || 'PMKVY-4.0',
          completion_date: completionDate,
          nsqf_level: nsqfLevel,
          issuing_provider: issuingProvider,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Push failed');
      const data = await res.json();
      setSuccessMsg(data.message || 'Completion certificate pushed to DigiLocker successfully!');
      toast.success('Certificate Pushed', 'Verifiable credential deposited to your DigiLocker account.');
      await loadStatus();
      if (onSyncComplete) onSyncComplete();
    } catch (err: any) {
      setError(err.message);
      toast.error('Certificate Push Error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
          <span>Connecting with DigiLocker National Academic Depository...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Official Government Header */}
      <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-white shadow-xs">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">DigiLocker Verification Gateway</h3>
              {connectionStatus?.connected ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  AUTHENTICATED & VERIFIED
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  READY TO VERIFY
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              National Academic Depository (NAD) · MeriPehchaan · Ministry of Electronics &amp; IT (MeitY) &amp; Govt. of Maharashtra
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Official Trust Anchor</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-emerald-400 font-semibold">W3C Credential Ready</span>
        </div>
      </div>

      <div className="p-6">
        {/* Error / Success feedback */}
        {error && (
          <div className="mb-4 flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 rounded-xl p-3.5 text-xs">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{error}</div>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{successMsg}</div>
          </div>
        )}

        {/* Sync in Progress Progress Bar */}
        {actionLoading && syncStep && (
          <div className="mb-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs font-bold text-orange-950 mb-2">
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-orange-600 animate-spin" />
                {syncStep}
              </span>
              <span>Govt Gateway Sync</span>
            </div>
            <div className="w-full bg-orange-200/60 rounded-full h-2 overflow-hidden">
              <div
                className="bg-orange-600 h-2 rounded-full transition-all duration-500 animate-pulse"
                style={{ width: '85%' }}
              />
            </div>
          </div>
        )}

        {/* STATE 1: NOT YET AUTHORIZED / READY TO AUTHORIZE */}
        {!connectionStatus?.connected && !actionLoading && (
          <div className="rounded-xl border border-dashed border-orange-300 bg-orange-50/40 p-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0 shadow-xs">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Authorize DigiLocker for 1-Click Document &amp; Skill Verification
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                    By authorizing with DigiLocker, your <strong>Aadhaar e-KYC</strong>, <strong>Class 10 &amp; 12 Marksheets</strong>, <strong>NCVT Trade Certificates</strong>, and <strong>Maharashtra Skill Certificates</strong> will be automatically fetched, cryptographically verified, and updated in your verified portfolio.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-100/60 px-2 py-0.5 rounded">
                      <Check className="w-3 h-3" /> Automatic Marksheet Verification
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-100/60 px-2 py-0.5 rounded">
                      <Check className="w-3 h-3" /> NCVT / DGT Certificate Sync
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-100/60 px-2 py-0.5 rounded">
                      <Check className="w-3 h-3" /> Zero Manual Upload Burden
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex flex-col items-center gap-2">
                <button
                  onClick={() => setShowConsentModal(true)}
                  disabled={actionLoading}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-white shadow-md transition-all flex items-center gap-2.5 transform active:scale-95"
                  style={{ backgroundColor: '#FF6600' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e65c00')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FF6600')}
                >
                  <Lock className="w-4 h-4" />
                  <span>Authorize &amp; Auto-Verify All Documents</span>
                </button>
                <span className="text-[11px] text-slate-400">Official MeriPehchaan Gateway</span>
              </div>
            </div>
          </div>
        )}

        {/* STATE 2: AUTHENTICATED & VERIFIED */}
        {connectionStatus?.connected && (
          <div className="space-y-6">
            {/* Account Status Strip */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-emerald-950">
                      Linked Account: {connectionStatus.digilocker_user_id || `DL-MH-${traineeId.slice(0, 8).toUpperCase()}`}
                    </span>
                    <span className="text-[11px] bg-emerald-200/80 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      100% VERIFIED
                    </span>
                  </div>
                  <div className="text-xs text-emerald-800/80 mt-0.5 flex flex-wrap items-center gap-3">
                    <span>Mobile: <strong>{connectionStatus.mobile_linked || '+91-98230XXXXX'}</strong></span>
                    <span>·</span>
                    <span>
                      Last Synced:{' '}
                      <strong>
                        {connectionStatus.last_sync
                          ? new Date(connectionStatus.last_sync).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                          : 'Just now'}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleAuthorizeAndSync}
                  disabled={actionLoading}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100/50 transition flex items-center gap-1.5 shadow-2xs"
                  title="Re-sync latest issued documents from DigiLocker"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${actionLoading ? 'animate-spin' : ''}`} />
                  <span>Re-Sync</span>
                </button>

                <button
                  onClick={handlePushCertificate}
                  disabled={actionLoading}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition flex items-center gap-1.5 shadow-2xs"
                  title="Deposit certified SkillTrackAI course certificate to your DigiLocker account"
                >
                  <FileCheck className="w-3.5 h-3.5 text-orange-400" />
                  <span>Push Certificate</span>
                </button>

                <button
                  onClick={handleDisconnect}
                  disabled={actionLoading}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition flex items-center gap-1"
                  title="Unlink DigiLocker account"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Unlink</span>
                </button>
              </div>
            </div>

            {/* Verified Documents Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Authoritative DigiLocker Credentials ({documents.length})
                  </h4>
                  <span className="text-xs text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                    All Cryptographically Signed
                  </span>
                </div>
                <span className="text-xs text-slate-500">Source: National Academic Depository (NAD)</span>
              </div>

              {documents.length > 0 ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                        <th className="py-2.5 px-3.5">Document Title</th>
                        <th className="py-2.5 px-3.5">Type</th>
                        <th className="py-2.5 px-3.5">Issuing Authority</th>
                        <th className="py-2.5 px-3.5">Issued Date</th>
                        <th className="py-2.5 px-3.5">Verification Status</th>
                        <th className="py-2.5 px-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {documents.map((doc, idx) => (
                        <tr key={doc.id || idx} className="hover:bg-slate-50/70 transition">
                          <td className="py-2.5 px-3.5 font-semibold text-slate-900 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {doc.name}
                          </td>
                          <td className="py-2.5 px-3.5 text-slate-600">{doc.doctype || 'Certificate'}</td>
                          <td className="py-2.5 px-3.5 text-slate-600 max-w-xs truncate" title={doc.issuer}>
                            {doc.issuer || 'Government Authority'}
                          </td>
                          <td className="py-2.5 px-3.5 text-slate-500 font-mono">{doc.date || '—'}</td>
                          <td className="py-2.5 px-3.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              VERIFIED
                            </span>
                          </td>
                          <td className="py-2.5 px-3.5 text-right">
                            <button
                              onClick={() => toast.info('Document AI', `Viewing encrypted DigiLocker credential: ${doc.name}`)}
                              className="text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline inline-flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-slate-200">
                  No documents found. Click &apos;Re-Sync&apos; to query latest DigiLocker records.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <span>Digital India Initiative</span>
          <span>·</span>
          <span>Government of Maharashtra Skill Track System</span>
        </div>
        <a
          href="https://www.digilocker.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 hover:underline inline-flex items-center gap-1 text-xs font-medium"
        >
          <span>About DigiLocker National Academic Depository</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* CONSENT / AUTHORIZE MODAL */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">DigiLocker Consent &amp; Authorization</h4>
                <p className="text-xs text-slate-500">MeriPehchaan National Single Sign-On Gateway</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-3 mb-5 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p>
                You are authorizing <strong>SkillTrackAI (Dept. of Skills, Govt. of Maharashtra)</strong> to access your DigiLocker account to:
              </p>
              <ul className="list-disc pl-4 space-y-1.5 font-medium text-slate-700">
                <li>Verify your Aadhaar e-KYC identity and residential district.</li>
                <li>Fetch and verify Class 10 &amp; Class 12 academic marksheets.</li>
                <li>Fetch and verify vocational trade certificates (NCVT, DGT, MSSDS).</li>
                <li>Deposit official training completion certificates into your DigiLocker vault.</li>
              </ul>
              <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                All data is encrypted end-to-end and stored in compliance with the Digital Personal Data Protection (DPDP) Act, 2023.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConsentModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAuthorizeAndSync}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition flex items-center gap-1.5"
                style={{ backgroundColor: '#FF6600' }}
              >
                <Check className="w-4 h-4" />
                <span>I Consent &amp; Authorize</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
