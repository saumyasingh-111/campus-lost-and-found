import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, ShieldCheck, MapPin, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { AutoMatchPair, Item } from '../types';
import { formatRelativeTime } from '../utils/formatters';

interface SmartMatchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  matches: AutoMatchPair[];
  onInitiateClaim: (foundItem: Item, lostItem?: Item) => void;
  selectedLostItem?: Item | null;
}

export const SmartMatchDrawer: React.FC<SmartMatchDrawerProps> = ({
  isOpen,
  onClose,
  matches,
  onInitiateClaim,
  selectedLostItem,
}) => {
  const [filterConfidence, setFilterConfidence] = useState<'all' | 'High' | 'Medium'>('all');

  if (!isOpen) return null;

  // Filter matches if specifically opened for an item
  const relevantMatches = matches.filter((pair) => {
    if (selectedLostItem && pair.lostItem.id !== selectedLostItem.id) {
      return false;
    }
    if (filterConfidence !== 'all' && pair.confidence !== filterConfidence) {
      return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-slate-50 w-full max-w-4xl h-full shadow-2xl flex flex-col overflow-hidden border-l border-slate-200">
        {/* Drawer Header */}
        <div className="bg-white px-6 py-5 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Smart Auto-Match Engine</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {relevantMatches.length} Matches Found
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Fuzzy keyword overlap, category parity, and campus location proximity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white/80 backdrop-blur-md px-6 py-3 border-b border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Filter Confidence:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setFilterConfidence('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  filterConfidence === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Scores
              </button>
              <button
                onClick={() => setFilterConfidence('High')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  filterConfidence === 'High'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                High Confidence (70%+)
              </button>
              <button
                onClick={() => setFilterConfidence('Medium')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  filterConfidence === 'Medium'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                Medium Confidence
              </button>
            </div>
          </div>

          {selectedLostItem && (
            <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md">
              Filtered for: {selectedLostItem.title}
            </span>
          )}
        </div>

        {/* Matches List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {relevantMatches.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto my-12">
              <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base">No Potential Matches</h3>
              <p className="text-xs text-slate-500 mt-1">
                Our algorithm continuously checks new lost and found reports. When matching keywords and buildings overlap, they will appear here.
              </p>
            </div>
          ) : (
            relevantMatches.map((pair, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden"
              >
                {/* Match Score Banner */}
                <div className="px-5 py-3 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                      Cross-Match Candidate #{idx + 1}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                        pair.score >= 70
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-amber-500 text-white shadow-xs'
                      }`}
                    >
                      {pair.score}% Match Confidence
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-indigo-200">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Algorithm Score</span>
                  </div>
                </div>

                {/* Match Comparison Grid */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                  {/* Left Column: Lost Item */}
                  <div className="md:col-span-5 p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/70">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded-md">
                        Reported Lost
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(pair.lostItem.dateReported)}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <img
                        src={pair.lostItem.imageUrl}
                        alt={pair.lostItem.title}
                        className="w-16 h-16 rounded-lg object-cover shrink-0 ring-1 ring-amber-200"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {pair.lostItem.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                          {pair.lostItem.description}
                        </p>
                        <p className="text-[11px] text-indigo-700 font-medium flex items-center gap-1 mt-1 truncate">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {pair.lostItem.locationName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Arrow & Shared Factors */}
                  <div className="md:col-span-1 flex flex-col items-center justify-center py-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Right Column: Found Item */}
                  <div className="md:col-span-5 p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/70">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded-md">
                        Reported Found
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(pair.foundItem.dateReported)}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <img
                        src={pair.foundItem.imageUrl}
                        alt={pair.foundItem.title}
                        className="w-16 h-16 rounded-lg object-cover shrink-0 ring-1 ring-emerald-200"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {pair.foundItem.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                          {pair.foundItem.description}
                        </p>
                        <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-1 truncate">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {pair.foundItem.locationName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match Analysis & Action Bar */}
                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-xs font-semibold text-slate-600 mr-1">Match Factors:</span>
                    {pair.reasons.map((reason, rIdx) => (
                      <span
                        key={rIdx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white text-slate-700 border border-slate-200"
                      >
                        ✓ {reason}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      onInitiateClaim(pair.foundItem, pair.lostItem);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-xs shrink-0"
                  >
                    <span>Verify & Claim Match</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
