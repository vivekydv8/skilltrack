import React from 'react';

export interface SkeletonLoaderProps {
  type?: 'card' | 'table' | 'metric' | 'chart' | 'profile';
  count?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'card',
  count = 1,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, idx) => {
        if (type === 'metric') {
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-depth-card space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="w-8 h-8 rounded-xl skeleton-shimmer" />
                <div className="w-16 h-4 rounded-full skeleton-shimmer" />
              </div>
              <div className="w-24 h-8 rounded-lg skeleton-shimmer" />
              <div className="w-36 h-3 rounded skeleton-shimmer" />
              <div className="pt-3 border-t border-slate-100 flex justify-between">
                <div className="w-16 h-3 rounded skeleton-shimmer" />
                <div className="w-20 h-3 rounded skeleton-shimmer" />
              </div>
            </div>
          );
        }

        if (type === 'table') {
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-depth-card space-y-3"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="w-32 h-6 rounded-lg skeleton-shimmer" />
                <div className="w-48 h-8 rounded-xl skeleton-shimmer" />
              </div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((row) => (
                  <div key={row} className="h-10 rounded-lg skeleton-shimmer w-full" />
                ))}
              </div>
            </div>
          );
        }

        if (type === 'chart') {
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-depth-card space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="w-40 h-5 rounded-lg skeleton-shimmer" />
                  <div className="w-24 h-3 rounded skeleton-shimmer" />
                </div>
                <div className="w-28 h-8 rounded-xl skeleton-shimmer" />
              </div>
              <div className="h-64 rounded-xl skeleton-shimmer w-full" />
              <div className="flex justify-between pt-2">
                <div className="w-32 h-3 rounded skeleton-shimmer" />
                <div className="w-20 h-3 rounded skeleton-shimmer" />
              </div>
            </div>
          );
        }

        return (
          <div
            key={idx}
            className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-depth-card space-y-3"
          >
            <div className="w-1/3 h-5 rounded-lg skeleton-shimmer" />
            <div className="w-full h-3 rounded skeleton-shimmer" />
            <div className="w-5/6 h-3 rounded skeleton-shimmer" />
            <div className="w-1/2 h-8 rounded-xl skeleton-shimmer mt-4" />
          </div>
        );
      })}
    </div>
  );
};
