import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  ShieldAlert,
  UserCheck,
  CheckCircle,
  Phone,
  Building,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { fetchApi } from '../api/client';
import { TraineeListItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { RiskBadge } from '../components/RiskBadge';

interface TraineesPageProps {
  onSelectTrainee: (traineeId: string) => void;
  onNavigateToOnboard: () => void;
}

export const TraineesPage: React.FC<TraineesPageProps> = ({
  onSelectTrainee,
  onNavigateToOnboard
}) => {
  const { currentUser } = useAuth();
  const [trainees, setTrainees] = useState<TraineeListItem[]>([]);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<string>('');
  const [districtFilter, setDistrictFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadTrainees = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      const uRole = currentUser?.role || 'govt_admin';
      const uName = currentUser?.name || 'Administrator';
      params.append('role', uRole);
      params.append('user_name', uName);
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (riskFilter) params.append('risk_level', riskFilter);
      if (districtFilter) params.append('district', districtFilter);

      const data = await fetchApi<TraineeListItem[]>(`/api/trainees?${params.toString()}`);
      setTrainees(data);
    } catch (err) {
      console.error('Failed to load trainees', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrainees();
  }, [currentUser?.role, statusFilter, riskFilter, districtFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadTrainees();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gov-100 text-gov-800 rounded">
              Cohort Registry
            </span>
            <span className="text-xs text-slate-400">• Persistent Trainee ID (UUID)</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            Trainee Longitudinal Registry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Survives contact updates via alternate contact history. Fully auditable under DPDP Act 2023.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser?.role === 'analyst' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 rounded">
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
              <span>Analyst Mode: PII Masked</span>
            </span>
          )}
          <button
            onClick={onNavigateToOnboard}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gov-700 hover:bg-gov-800 rounded transition shadow-xs"
          >
            <span>+ Enroll Trainee & Capture Consent</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by candidate name, code (MH-TRN-...), district..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-gov-600 outline-hidden"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-gov-600 outline-hidden"
          >
            <option value="">All Employment Statuses</option>
            <option value="Placed">Placed (Wage)</option>
            <option value="Self-Employed">Self-Employed</option>
            <option value="Apprenticeship">Apprenticeship</option>
            <option value="Unemployed">Seeking Work / Unemployed</option>
            <option value="In Training">In Training</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-gov-600 outline-hidden"
          >
            <option value="">All Risk Levels</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
          </select>

          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-gov-600 outline-hidden"
          >
            <option value="">All Districts</option>
            <option value="Pune">Pune</option>
            <option value="Nagpur">Nagpur</option>
            <option value="Nashik">Nashik</option>
            <option value="Mumbai Suburban">Mumbai Suburban</option>
            <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
            <option value="Amravati">Amravati</option>
            <option value="Solapur">Solapur</option>
          </select>

          <button
            type="submit"
            className="px-4 py-1.5 text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 rounded transition"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Trainees List Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>Found <strong>{trainees.length}</strong> matching candidates</span>
          <span className="text-[11px] text-slate-400">Click candidate to open longitudinal profile & audit trail</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Trainee Code & Name</th>
                <th className="py-3 px-4">Contact & Location</th>
                <th className="py-3 px-4">Course & Sector</th>
                <th className="py-3 px-4 text-center">Attendance / Score</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">ML Risk Rating</th>
                <th className="py-3 px-4 text-center">Consent</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {trainees.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => onSelectTrainee(t.id)}
                  className="hover:bg-slate-50 transition cursor-pointer"
                >
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{t.full_name}</p>
                    <span className="font-mono text-[10px] text-gov-800 bg-gov-50 px-1.5 py-0.5 rounded border border-gov-200">
                      {t.trainee_code}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-slate-800 font-medium">{t.primary_phone}</p>
                    <p className="text-[11px] text-slate-500">{t.district} • {t.gender}, {t.age}y ({t.category})</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-800">{t.course_name}</p>
                    <p className="text-[11px] text-slate-500">{t.provider_name}</p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-semibold ${t.attendance_percentage < 75 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {t.attendance_percentage}% att
                    </span>
                    <span className="text-slate-400 block text-[11px]">Score: {t.assessment_score}/100</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                      t.current_status === 'Placed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : t.current_status === 'Self-Employed'
                        ? 'bg-blue-100 text-blue-800'
                        : t.current_status === 'Apprenticeship'
                        ? 'bg-purple-100 text-purple-800'
                        : t.current_status === 'Unemployed'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t.current_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <RiskBadge level={t.risk_level} score={t.risk_score} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.consent_status === 'Consented'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {t.consent_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onSelectTrainee(t.id)}
                      className="p-1.5 hover:bg-gov-100 rounded text-gov-800 transition"
                      title="Inspect Longitudinal Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
