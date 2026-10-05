import React from 'react';
import { Item, AutoMatchPair } from '../types';

interface AnalyticsCardsProps {
  items: Item[];
  matches: AutoMatchPair[];
  onViewMatches: () => void;
  onFilterStatus: (status: 'lost' | 'found' | 'reunited' | 'all') => void;
}

export const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({
  items,
  matches,
  onViewMatches,
  onFilterStatus,
}) => {
  const lostCount = items.filter((i) => i.status === 'lost').length;
  const foundCount = items.filter((i) => i.status === 'found').length;
  const reunitedCount = items.filter((i) => i.status === 'reunited').length;
  const matchCount = matches.length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {/* 5 Lost */}
      <button
        onClick={() => onFilterStatus('lost')}
        className="bg-white p-3.5 rounded-lg border border-slate-200 text-left hover:border-slate-300 transition-colors shadow-xs group"
      >
        <div className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-amber-700 transition-colors">
          {lostCount}
        </div>
        <div className="text-xs text-slate-500 font-medium mt-0.5">Lost</div>
      </button>

      {/* 4 Found */}
      <button
        onClick={() => onFilterStatus('found')}
        className="bg-white p-3.5 rounded-lg border border-slate-200 text-left hover:border-slate-300 transition-colors shadow-xs group"
      >
        <div className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
          {foundCount}
        </div>
        <div className="text-xs text-slate-500 font-medium mt-0.5">Found</div>
      </button>

      {/* 1 Reunited */}
      <button
        onClick={() => onFilterStatus('reunited')}
        className="bg-white p-3.5 rounded-lg border border-slate-200 text-left hover:border-slate-300 transition-colors shadow-xs group"
      >
        <div className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
          {reunitedCount}
        </div>
        <div className="text-xs text-slate-500 font-medium mt-0.5">Reunited</div>
      </button>

      {/* 4 Potential Matches */}
      <button
        onClick={onViewMatches}
        className="bg-white p-3.5 rounded-lg border border-slate-200 text-left hover:border-slate-300 transition-colors shadow-xs group"
      >
        <div className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-700 transition-colors">
          {matchCount}
        </div>
        <div className="text-xs text-slate-500 font-medium mt-0.5">Potential Matches</div>
      </button>
    </div>
  );
};
