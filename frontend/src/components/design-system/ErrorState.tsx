import React, { useState } from 'react';
import { AlertCircle, RefreshCw, Database, ChevronDown, ChevronUp } from 'lucide-react';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  diagnostics?: string;
  onRetry?: () => void;
  onViewDataSource?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = "We couldn't load this information right now. Please verify your connection to the Maharashtra Skilling Data Layer.",
  diagnostics = 'Endpoint latency threshold exceeded (>2500ms). Downstream source MSSDS-API returned HTTP 504 Gateway Timeout.',
  onRetry,
  onViewDataSource,
  className = '',
}) => {
  const [showDiag, setShowDiag] = useState(false);

  return (
    <div
      className={`bg-white border border-rose-200 rounded-2xl p-6 shadow-depth-card text-center flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 shadow-sm">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h4 className="text-base font-bold text-slate-900 tracking-tight">{title}</h4>
      <p className="text-xs text-slate-500 mt-1.5 max-w-sm leading-relaxed">{message}</p>

      {/* Action Buttons */}
      <div className="mt-5 flex items-center gap-2.5">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="st-btn st-btn-primary px-4 py-2 text-xs font-bold gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        )}

        {onViewDataSource && (
          <button
            type="button"
            onClick={onViewDataSource}
            className="st-btn st-btn-secondary px-4 py-2 text-xs font-semibold gap-1.5"
          >
            <Database className="w-3.5 h-3.5 text-teal-600" />
            <span>View Data Source</span>
          </button>
        )}
      </div>

      {/* Diagnostics Accordion for Administrators */}
      {diagnostics && (
        <div className="mt-4 pt-3 border-t border-slate-100 w-full text-left">
          <button
            type="button"
            onClick={() => setShowDiag(!showDiag)}
            className="w-full flex items-center justify-between text-[11px] font-bold text-slate-500 hover:text-slate-800"
          >
            <span>Technical Diagnostics</span>
            {showDiag ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDiag && (
            <pre className="mt-2 p-3 bg-slate-900 text-teal-300 rounded-xl text-[10px] font-mono overflow-x-auto whitespace-pre-wrap">
              {diagnostics}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};
