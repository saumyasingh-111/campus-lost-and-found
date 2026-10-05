import React from 'react';
import { Plus, RotateCcw, Home } from 'lucide-react';

interface HeaderProps {
  activeTab: 'feed' | 'map' | 'matches' | 'leaderboard';
  setActiveTab: (tab: 'feed' | 'map' | 'matches' | 'leaderboard') => void;
  onOpenReportModal: () => void;
  matchesCount: number;
  totalItemsCount: number;
  onResetData: () => void;
  onReturnToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenReportModal,
  matchesCount,
  onResetData,
  onReturnToLanding,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo & University Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={onReturnToLanding}
              title="Return to Landing Page"
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-7 h-7 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-xs">
                CR
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-slate-900 block leading-tight group-hover:text-indigo-600 transition-colors">
                  Campus Reunite
                </span>
                <span className="text-[11px] text-slate-400 block leading-tight">
                  Lost &amp; Found for your campus
                </span>
              </div>
            </button>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'feed'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Feed
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'map'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Campus Map
            </button>

            <button
              onClick={() => setActiveTab('matches')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'matches'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Smart Matches</span>
              {matchesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  {matchesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'leaderboard'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Karma
            </button>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2">
            {onReturnToLanding && (
              <button
                onClick={onReturnToLanding}
                title="Overview / Landing Page"
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors hidden sm:block"
              >
                <Home className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onResetData}
              title="Reset Sample Data"
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report Item</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
