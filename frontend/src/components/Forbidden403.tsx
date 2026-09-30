import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';

interface Forbidden403Props {
  requiredRoleName: string;
}

export const Forbidden403: React.FC<Forbidden403Props> = ({ requiredRoleName }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const getAuthorizedDashboard = () => {
    if (!currentUser) return '/';
    if (currentUser.role === 'govt_admin' || currentUser.role === 'analyst') return '/government/dashboard';
    if (currentUser.role === 'training_provider' || currentUser.role === 'provider') return '/training/dashboard';
    if (currentUser.role === 'employer') return '/employer/dashboard';
    if (currentUser.role === 'trainee') return '/trainee/dashboard';
    return '/';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-red-200 rounded-xl shadow-lg p-6 sm:p-8 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <span className="inline-block px-2.5 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded uppercase tracking-wider mb-2 border border-red-100">
          HTTP 403 Forbidden
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Unauthorized Access</h1>
        <p className="text-sm text-slate-600 mb-4">
          This portal is strictly restricted to authorized <span className="font-semibold text-slate-800">{requiredRoleName}</span> users.
        </p>
        {currentUser && (
          <div className="bg-slate-100 rounded-lg p-3 text-left text-xs text-slate-700 mb-6 space-y-1">
            <div><span className="font-medium">Active Account:</span> {currentUser.name}</div>
            <div><span className="font-medium">Current Role:</span> <span className="capitalize">{currentUser.role.replace('_', ' ')}</span></div>
            <div><span className="font-medium">Organization:</span> {currentUser.organization || 'N/A'}</div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate(getAuthorizedDashboard())}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            My Dashboard
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};
