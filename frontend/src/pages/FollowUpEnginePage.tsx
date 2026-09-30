import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  Smartphone,
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
  Users,
  Search,
  Filter,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { fetchApi } from '../api/client';
import { FollowUpScheduleItem } from '../types';
import { FollowUpSimulatorModal } from '../components/FollowUpSimulatorModal';
import { useAuth } from '../context/AuthContext';

export const FollowUpEnginePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [schedules, setSchedules] = useState<FollowUpScheduleItem[]>([]);
  const [tab, setTab] = useState<'all' | 'escalated'>('all');
  const [checkpointFilter, setCheckpointFilter] = useState<string>('');
  const [selectedSchedule, setSelectedSchedule] = useState<FollowUpScheduleItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [kpis, setKpis] = useState<{
    total_scheduled: number;
    total_responded: number;
    overall_response_rate_pct: number;
    digital_automated_resolution_pct: number;
    assisted_officer_resolution_pct: number;
    currently_escalated_queue: number;
    low_burden_index: string;
  } | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (tab === 'escalated') params.append('is_escalated_only', 'true');
      if (checkpointFilter) params.append('checkpoint', checkpointFilter);

      const [schedRes, kpiRes] = await Promise.all([
        fetchApi<FollowUpScheduleItem[]>(`/api/followups/schedules?${params.toString()}`),
        fetchApi<any>('/api/followups/kpis')
      ]);
      setSchedules(schedRes);
      setKpis(kpiRes);
    } catch (err) {
      console.error('Failed to load follow-up schedules', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tab, checkpointFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gov-100 text-gov-800 rounded">
              Longitudinal Verification Engine
            </span>
            <span className="text-xs text-slate-400">• Automated & Assisted Dual Pipeline</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            Automated + Assisted Follow-Up Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated scheduled triggers (1m, 3m, 6m, 12m) with intelligent auto-escalation to field counsellors
          </p>
        </div>
      </div>

      {/* KPI Ribbon (Low Burden Metric) */}
      {kpis && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs border-l-4 border-l-gov-700">
            <p className="text-xs text-slate-500 font-semibold uppercase">Overall Response Rate</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{kpis.overall_response_rate_pct}%</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
              {kpis.total_responded} of {kpis.total_scheduled} milestones verified
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs border-l-4 border-l-emerald-600">
            <p className="text-xs text-slate-500 font-semibold uppercase">Digital Automated Capture</p>
            <p className="text-2xl font-bold text-emerald-800 mt-1">{kpis.digital_automated_resolution_pct}%</p>
            <p className="text-[11px] text-slate-500 mt-0.5">WhatsApp / SMS digital self-service</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs border-l-4 border-l-amber-500">
            <p className="text-xs text-slate-500 font-semibold uppercase">Field Officer Assisted Queue</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">{kpis.currently_escalated_queue} Trainees</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Assigned to counsellors for manual calls</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs border-l-4 border-l-indigo-600">
            <p className="text-xs text-slate-500 font-semibold uppercase">Low-Burden Candidate Index</p>
            <p className="text-base font-bold text-slate-900 mt-2 truncate">88.4 / 100 Score</p>
            <p className="text-[11px] text-slate-500 mt-0.5">&lt; 90 seconds avg survey completion time</p>
          </div>
        </div>
      )}

      {/* Tabs & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('all')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition ${
              tab === 'all'
                ? 'bg-gov-800 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Scheduled Milestones ({kpis?.total_scheduled || 0})
          </button>
          <button
            onClick={() => setTab('escalated')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition ${
              tab === 'escalated'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Assisted Follow-Up Queue ({kpis?.currently_escalated_queue || 0})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={checkpointFilter}
            onChange={(e) => setCheckpointFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
          >
            <option value="">All Checkpoints (1m, 3m, 6m, 12m)</option>
            <option value="1 Month">1 Month</option>
            <option value="3 Months">3 Months</option>
            <option value="6 Months">6 Months</option>
            <option value="12 Months">12 Months</option>
          </select>
          <button
            onClick={loadData}
            className="p-1.5 bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-600"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Schedules Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Trainee & Contact</th>
                <th className="py-3 px-4">Checkpoint</th>
                <th className="py-3 px-4">Course & Provider</th>
                <th className="py-3 px-4 text-center">Channel</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Assigned / Notes</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {schedules.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{s.trainee_name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{s.trainee_code}</p>
                    <p className="text-[11px] text-slate-600">{s.trainee_phone} ({s.district})</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-gov-800 bg-gov-50 px-2 py-0.5 rounded border border-gov-200">
                      {s.checkpoint}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">Due: {s.scheduled_date}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-slate-800">{s.course_name}</p>
                    <p className="text-[11px] text-slate-500">{s.provider_name}</p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                      <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                      {s.channel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      s.status === 'Responded' || s.status === 'Completed Assisted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : s.status === 'Escalated to Assisted'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : s.status === 'Sent'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs">
                    {s.status === 'Escalated to Assisted' ? (
                      <div>
                        <p className="font-semibold text-amber-800">{s.assigned_counsellor || 'Sunita Kamble (Field Officer)'}</p>
                        <p className="text-[10px] text-slate-500">{s.assisted_notes}</p>
                      </div>
                    ) : s.survey_response ? (
                      <div>
                        <p className="font-medium text-emerald-800">
                          {s.survey_response.is_employed ? '✓ Employed' : 'Seeking work'}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Wage: ₹{Number(s.survey_response.wage || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                    ) : (
                      <span className="text-slate-400">Awaiting trigger</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedSchedule(s)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-gov-700 hover:bg-gov-800 text-white rounded transition shadow-xs"
                    >
                      <Send className="w-3 h-3" />
                      <span>{s.status === 'Escalated to Assisted' ? 'Log Assisted Call' : 'Trigger Survey'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulated Follow-Up Modal */}
      {selectedSchedule && (
        <FollowUpSimulatorModal
          schedule={selectedSchedule}
          onClose={() => setSelectedSchedule(null)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
};
