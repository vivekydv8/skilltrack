import React, { useState, useEffect } from 'react';
import { Trophy, Award, TrendingUp, Users, ShieldCheck, ArrowUpDown, Download, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '../api/client';
import { ProviderLeaderboardItem } from '../types';

export const ProviderLeaderboard: React.FC<{ onSelectProvider?: (providerId: string) => void }> = ({ onSelectProvider }) => {
  const [leaderboard, setLeaderboard] = useState<ProviderLeaderboardItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        setIsLoading(true);
        const data = await fetchApi<ProviderLeaderboardItem[]>('/api/analytics/leaderboard');
        setLeaderboard(data);
      } catch (err) {
        console.error('Failed to load leaderboard', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadLeaderboard();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 rounded">
              Accountability Framework
            </span>
            <span className="text-xs text-slate-400">• Institutional Quality Audit</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            Training Provider Accountability Leaderboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranking skilling institutions on true longitudinal impact: placement conversion, 6-month wage growth, median retention & follow-up compliance
          </p>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="p-4 bg-gov-50 border border-gov-200 rounded-lg text-xs text-gov-950 flex items-start gap-3">
        <Trophy className="w-5 h-5 text-gov-700 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-gov-900">How the Composite Quality Score (CQS) is calculated:</p>
          <p className="text-gov-800 text-[11px] mt-0.5">
            40% Verified Placement Rate + 30% 6-Month Job Retention + 20% Follow-Up Compliance (Accountability) + 10% Wage Growth %.
            Providers failing the 65% benchmark trigger automated performance review notices under MSSDS norms.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 text-center w-12">Rank</th>
                <th className="py-3 px-4">Provider & District</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4 text-center">Enrolled</th>
                <th className="py-3 px-4 text-right">Placement %</th>
                <th className="py-3 px-4 text-right">Avg Start Wage</th>
                <th className="py-3 px-4 text-right">6m Wage Growth</th>
                <th className="py-3 px-4 text-right">Retention Rate</th>
                <th className="py-3 px-4 text-right">Follow-Up Compliance</th>
                <th className="py-3 px-4 text-right">Composite Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {leaderboard.map((p, idx) => {
                const isTop = idx === 0;
                return (
                  <tr key={p.provider_id} className={`hover:bg-slate-50 transition ${isTop ? 'bg-amber-50/40' : ''}`}>
                    <td className="py-3.5 px-4 text-center font-black text-slate-500">
                      {isTop ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-slate-900 font-bold text-xs shadow-xs">
                          1
                        </span>
                      ) : (
                        `#${idx + 1}`
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{p.provider_name}</p>
                      <p className="text-[11px] text-slate-500">{p.district} District</p>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-gov-100 text-gov-800 border border-gov-200">
                        {p.grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold">{p.total_candidates}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-700">
                      {p.placement_rate_pct}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium">
                      ₹{p.avg_starting_wage.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-gov-700">
                      +{p.wage_growth_pct}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium">
                      {p.retention_rate_pct}%
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {p.followup_compliance_pct}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-sm font-black text-gov-900">
                        {p.composite_score}
                      </span>
                      <span className="text-[10px] text-slate-400 block">/ 100</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
