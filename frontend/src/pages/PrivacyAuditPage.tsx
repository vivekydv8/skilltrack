import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  UserX,
  Server,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Terminal
} from 'lucide-react';
import { fetchApi } from '../api/client';
import { AuditLogItem } from '../types';
import { useAuth } from '../context/AuthContext';

export const PrivacyAuditPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [stubs, setStubs] = useState<any[]>([]);
  const [tab, setTab] = useState<'audit' | 'consent_policy' | 'stubs'>('audit');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [logs, stubsRes] = await Promise.all([
        fetchApi<AuditLogItem[]>('/api/privacy/audit-logs?limit=50'),
        fetchApi<any>('/api/integrations/stubs-overview')
      ]);
      setAuditLogs(logs);
      setStubs(stubsRes.integrations || []);
    } catch (err) {
      console.error('Failed to load privacy & audit data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gov-100 text-gov-800 rounded">
              DPDP Act 2023 Compliance & Security
            </span>
            <span className="text-xs text-slate-400">• Immutable Accountability Log</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            Privacy Governance, Consent & System Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-based access control, cryptographic verification, auditable PII access logging, and external government API stubs
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setTab('audit')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded transition ${
            tab === 'audit'
              ? 'bg-gov-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Permanent Audit Logs ({auditLogs.length})
        </button>
        <button
          onClick={() => setTab('consent_policy')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded transition ${
            tab === 'consent_policy'
              ? 'bg-gov-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          DPDP Consent Policy & Rights
        </button>
        <button
          onClick={() => setTab('stubs')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded transition ${
            tab === 'stubs'
              ? 'bg-gov-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Government Gateway Interoperability (EPFO, SMS, DigiLocker)
        </button>
      </div>

      {/* Tab 1: Live Audit Log Table */}
      {tab === 'audit' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Auditable Event Ledger (Who Accessed What & Why)
              </h2>
              <p className="text-[11px] text-slate-500">
                Permanently logged in the database to prevent unauthorized PII browsing or data leakage
              </p>
            </div>
            <button
              onClick={loadData}
              className="p-1.5 bg-white border border-slate-300 rounded hover:bg-slate-100 text-slate-600"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Timestamp & IP</th>
                  <th className="py-3 px-4">User & Role</th>
                  <th className="py-3 px-4 text-center">Action Code</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Declared Administrative Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-sans text-slate-500">
                      <span className="block font-medium text-slate-800">
                        {log.timestamp ? new Date(log.timestamp).toLocaleTimeString('en-IN') : 'N/A'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {log.timestamp ? new Date(log.timestamp).toLocaleDateString('en-IN') : ''} • {log.ip_address}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <p className="font-bold text-slate-900">{log.user_name}</p>
                      <span className="text-[10px] uppercase font-bold text-gov-800 bg-gov-50 px-1 rounded">
                        {log.user_role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-200 text-slate-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span>{log.resource_type}</span>
                      {log.resource_id && (
                        <span className="block text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
                          {log.resource_id}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-800">
                      {log.purpose_declared}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: DPDP Consent Policy */}
      {tab === 'consent_policy' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 space-y-5 max-w-4xl">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Digital Personal Data Protection (DPDP) Act 2023 Implementation
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Governing principles for longitudinal skilling outcomes tracking in Maharashtra
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <h4 className="font-bold text-gov-900 mb-1">1. Purpose Limitation & Transparency</h4>
              <p className="text-slate-600 leading-relaxed">
                Candidate personal data is exclusively collected for measuring employability outcomes, detecting skill curriculum gaps, and offering post-training career support. No commercial resale or third-party advertising usage is permitted.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <h4 className="font-bold text-gov-900 mb-1">2. Role-Based Visibility & Masking</h4>
              <p className="text-slate-600 leading-relaxed">
                Policy analysts and researchers view aggregated and anonymized datasets by default. Names, phones, and emails are masked. Unmasked PII is restricted to verified Field Officers and requires an auditable purpose declaration.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <h4 className="font-bold text-gov-900 mb-1">3. Right to Opt-Out & Erasure</h4>
              <p className="text-slate-600 leading-relaxed">
                Trainees maintain sovereign control over their records and can toggle opt-out at any time from their profile, terminating automated SMS/WhatsApp triggers and initiating data anonymization workflows.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <h4 className="font-bold text-gov-900 mb-1">4. Persistent Identifiers vs PII</h4>
              <p className="text-slate-600 leading-relaxed">
                Trainees are indexed via persistent UUIDs (`MH-TRN-...`). Contact updates (phone number, relocated workplace) are appended to contact history without altering identity or breaking historical longitudinal cohorts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Government Integration Stubs */}
      {tab === 'stubs' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              External Government Architecture & Gateway Interfaces
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              How SkillTrackAI securely interconnects with national databases, EPFO, DLT SMS gateways, UIDAI CIDR, and DigiLocker
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stubs.map((s, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{s.system}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gov-100 text-gov-800">
                    {s.mode}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{s.purpose}</p>
                <div className="p-2 bg-slate-900 text-emerald-400 font-mono text-[10px] rounded overflow-x-auto">
                  Endpoint: {s.target_endpoint}
                </div>
                <p className="text-[10px] text-slate-400">Trigger Frequency: {s.frequency}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
