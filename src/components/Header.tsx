import React from 'react';
import { Compass, Sparkles, Trophy, PlusCircle, ShieldCheck, RefreshCw, LayoutGrid } from 'lucide-react';

interface HeaderProps {
  activeTab: 'feed' | 'map' | 'matches' | 'leaderboard';
  setActiveTab: (tab: 'feed' | 'map' | 'matches' | 'leaderboard') => void;
  onOpenReportModal: () => void;
  matchesCount: number;
  totalItemsCount: number;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenReportModal,
  matchesCount,
  totalItemsCount,
  onResetData,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & University Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-orange-100 ring-2 ring-orange-50">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                  Campus<span className="text-indigo-600">Reunite</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Proctor Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                Indian University Lost &amp; Found Portal • Students &amp; Faculty Network
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'feed'
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs ring-1 ring-indigo-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Feed</span>
              <span className="ml-1 text-xs px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                {totalItemsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'map'
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs ring-1 ring-indigo-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Campus Map</span>
            </button>

            <button
              onClick={() => setActiveTab('matches')}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'matches'
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs ring-1 ring-indigo-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Smart Matches</span>
              {matchesCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs font-bold rounded-full bg-amber-500 text-white animate-pulse">
                  {matchesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs ring-1 ring-indigo-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span>Karma</span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={onResetData}
              title="Reset Sample Data"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-200 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Item</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
