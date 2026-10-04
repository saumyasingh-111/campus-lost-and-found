import React from 'react';
import { Search, PackageCheck, Sparkles, HeartHandshake, TrendingUp } from 'lucide-react';
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
  const total = items.length || 1;
  const reunionRate = Math.round((reunitedCount / total) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Lost Card */}
      <div
        onClick={() => onFilterStatus('lost')}
        className="group cursor-pointer bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Items Reported Lost</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900">{lostCount}</span>
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Awaiting Match
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Search className="w-6 h-6" />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
          Click to filter lost items in grid
        </p>
      </div>

      {/* Total Found Card */}
      <div
        onClick={() => onFilterStatus('found')}
        className="group cursor-pointer bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Items Recovered / Found</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900">{foundCount}</span>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                In Safe Custody
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <PackageCheck className="w-6 h-6" />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          Ready for secure ownership verification
        </p>
      </div>

      {/* Reunited Rate Card */}
      <div
        onClick={() => onFilterStatus('reunited')}
        className="group cursor-pointer bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Reunited Success Rate</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900">{reunionRate}%</span>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {reunitedCount} Reunited
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <HeartHandshake className="w-6 h-6" />
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, Math.max(10, reunionRate))}%` }}
          />
        </div>
      </div>

      {/* Smart Matches Ready Card */}
      <div
        onClick={onViewMatches}
        className="group cursor-pointer bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-5 rounded-2xl border border-indigo-700 text-white shadow-md hover:shadow-lg hover:border-indigo-400 transition-all"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wider text-indigo-200 uppercase">Smart AI Matches</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-white">{matches.length}</span>
              <span className="text-xs font-semibold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                High Confidence
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
        </div>
        <p className="text-xs text-indigo-200 mt-3 flex items-center gap-1 font-medium">
          Fuzzy keywords + proximity match active →
        </p>
      </div>
    </div>
  );
};
