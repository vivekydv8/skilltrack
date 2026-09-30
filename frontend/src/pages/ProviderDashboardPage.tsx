import React, { useState, useEffect } from 'react';
import {
  School,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  UserCheck,
  Edit3,
  Save,
  X,
  Search,
  RefreshCw
} from 'lucide-react';
import { fetchApi } from '../api/client';
import { TraineeListItem } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { useAuth } from '../context/AuthContext';

export const ProviderDashboardPage: React.FC<{ onSelectTrainee: (id: string) => void }> = ({ onSelectTrainee }) => {
  const { currentUser } = useAuth();
  const [trainees, setTrainees] = useState<TraineeListItem[]>([]);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Quick edit modal state
  const [editingTrainee, setEditingTrainee] = useState<TraineeListItem | null>(null);
  const [editAttendance, setEditAttendance] = useState<number>(85);
  const [editScore, setEditScore] = useState<number>(75);
  const [editCertStatus, setEditCertStatus] = useState<string>('Certified');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      const uName = currentUser?.name || 'Training Head';
      params.append('role', 'provider');
      params.append('user_name', uName);
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);

      const data = await fetchApi<TraineeListItem[]>(`/api/trainees?${params.toString()}`);
      setTrainees(data);
    } catch (err) {
      console.error('Failed to load provider batch trainees', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleEditClick = (t: TraineeListItem) => {
    setEditingTrainee(t);
    setEditAttendance(t.attendance_percentage);
    setEditScore(t.assessment_score);
    setEditCertStatus(t.certification_status);
  };

  const handleSavePerformance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrainee) return;

    try {
      setIsSaving(true);
      const uName = currentUser?.name || 'Training Head';
      const res = await fetchApi<any>(
        `/api/trainees/${editingTrainee.id}/performance?attendance_percentage=${editAttendance}&assessment_score=${editScore}&certification_status=${encodeURIComponent(editCertStatus)}&user_name=${encodeURIComponent(uName)}&user_role=provider`,
        { method: 'PATCH' }
      );

      alert(`Performance metrics saved to DB! New ML Risk Score: ${Math.round(res.new_risk_score * 100)}% (${res.new_risk_level})`);
      setEditingTrainee(null);
      loadData();
    } catch (err) {
      alert(`Save error: ${err}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gov-100 text-gov-800 rounded">
              Training Center Operations
            </span>
            <span className="text-xs text-slate-400">• Institutional Management</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            Training Provider Batch Operations & Evaluation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log biometric attendance %, update mock assessment scores, and mark batch certification status (writes directly to PostgreSQL/SQLite)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Batch</span>
          </button>
        </div>
      </div>

      {/* Trainees Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-800">
              Enrolled Batch Trainees ({trainees.length})
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-2.5 py-1 border border-slate-300 rounded bg-white"
            >
              <option value="">All Statuses</option>
              <option value="In Training">In Training</option>
              <option value="Certified">Certified</option>
              <option value="Placed">Placed</option>
              <option value="Dropped Out">Dropped Out</option>
            </select>
          </div>
          <p className="text-[11px] text-slate-400">
            Click 'Edit Performance' to update records in the database
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Trainee Code & Name</th>
                <th className="py-3 px-4">Course & Batch</th>
                <th className="py-3 px-4 text-center">Attendance %</th>
                <th className="py-3 px-4 text-center">Assessment Score</th>
                <th className="py-3 px-4 text-center">Certification Status</th>
                <th className="py-3 px-4 text-center">ML Risk Rating</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {trainees.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{t.full_name}</p>
                    <p className="font-mono text-[10px] text-gov-800">{t.trainee_code}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-slate-800">{t.course_name}</p>
                    <p className="text-[11px] text-slate-500">{t.district} Center</p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-bold ${t.attendance_percentage < 75 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {t.attendance_percentage}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-bold ${t.assessment_score < 60 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {t.assessment_score} / 100
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      t.certification_status === 'Certified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : t.certification_status === 'Dropped Out'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t.certification_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <RiskBadge level={t.risk_level} score={t.risk_score} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditClick(t)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-gov-50 text-gov-800 hover:bg-gov-100 border border-gov-300 rounded transition"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Score</span>
                      </button>
                      <button
                        onClick={() => onSelectTrainee(t.id)}
                        className="text-slate-500 hover:text-slate-800 p-1"
                        title="View Full Profile"
                      >
                        →
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Performance Modal */}
      {editingTrainee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Update Candidate Performance: {editingTrainee.full_name}
                </h3>
                <p className="text-[11px] text-slate-500">{editingTrainee.trainee_code}</p>
              </div>
              <button onClick={() => setEditingTrainee(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePerformance} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Attendance Percentage (%)
                </label>
                <input
                  type="number"
                  min="30"
                  max="100"
                  step="0.5"
                  value={editAttendance}
                  onChange={(e) => setEditAttendance(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-semibold text-slate-800"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">Threshold: 75% mandatory for scheme stipend</p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Mock Assessment Score (out of 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editScore}
                  onChange={(e) => setEditScore(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Certification / Enrollment Status
                </label>
                <select
                  value={editCertStatus}
                  onChange={(e) => setEditCertStatus(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-semibold text-slate-800"
                >
                  <option value="In Training">In Training</option>
                  <option value="Certified">Certified</option>
                  <option value="Completed Not Certified">Completed Not Certified</option>
                  <option value="Dropped Out">Dropped Out</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingTrainee(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-gov-700 hover:bg-gov-800 rounded transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Writing to DB...' : 'Save & Recalculate Risk'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
