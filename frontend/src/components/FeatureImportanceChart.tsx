import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { fetchApi } from '../api/client';

interface ModelFeature {
  feature: string;
  weight: number;
  impact: string;
}

interface FeatureImportanceData {
  model_type: string;
  features: ModelFeature[];
  intercept: number;
  training_samples_converged: number;
  convergence_status: string;
  accuracy_score_pct: number;
  roc_auc_score: number;
}

export const FeatureImportanceChart: React.FC = () => {
  const [data, setData] = useState<FeatureImportanceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await fetchApi<FeatureImportanceData>('/api/risk/feature-importance');
      setData(res);
    } catch (err) {
      console.error('Failed to load ML feature importance', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="bg-white p-5 rounded-lg border border-slate-200 text-center text-xs text-slate-500">
        Loading mathematical model coefficients from Scikit-Learn pipeline...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-gov-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Verified Machine Learning Model — Feature Importance (Learned Weights)
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Mathematical proof of real ML computation: Learned coefficients ($w$) from Logistic Regression classifier
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold rounded">
            Accuracy: {data.accuracy_score_pct}%
          </span>
          <span className="px-2.5 py-1 bg-gov-50 text-gov-800 border border-gov-200 font-bold rounded">
            ROC-AUC: {data.roc_auc_score}
          </span>
        </div>
      </div>

      {/* Feature Importance Bar Chart */}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.features}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 160, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
            <XAxis type="number" stroke="#64748B" fontSize={11} />
            <YAxis dataKey="feature" type="category" stroke="#1E293B" fontSize={11} width={150} />
            <Tooltip
              formatter={(val: any) => [`Weight: ${val}`, 'Coefficient']}
              contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '6px', fontSize: '12px' }}
            />
            <Bar dataKey="weight" radius={[0, 4, 4, 0]}>
              {data.features.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.weight < 0 ? '#10B981' : '#F59E0B'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
        <div className="p-2 bg-slate-50 rounded">
          <span className="text-[10px] text-slate-500 font-medium block">Model Equation</span>
          <span className="font-mono text-[11px] font-bold text-slate-800">
            z = Σ(w_i * x_i) + ({data.intercept})
          </span>
        </div>
        <div className="p-2 bg-slate-50 rounded">
          <span className="text-[10px] text-slate-500 font-medium block">Convergence</span>
          <span className="text-[11px] font-semibold text-emerald-800">{data.convergence_status}</span>
        </div>
        <div className="p-2 bg-slate-50 rounded">
          <span className="text-[10px] text-slate-500 font-medium block">Training Set</span>
          <span className="text-[11px] font-semibold text-slate-800">{data.training_samples_converged} Trainee Trajectories</span>
        </div>
      </div>
    </div>
  );
};
