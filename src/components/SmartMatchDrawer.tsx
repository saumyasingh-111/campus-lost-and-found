import React, { useState } from 'react';
import { X, ArrowRight, MapPin, Clock, ChevronRight } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="bg-[#F7F8FA] w-full max-w-3xl h-full shadow-2xl flex flex-col overflow-hidden border-l border-slate-200">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Potential Matches</h2>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {relevantMatches.length} candidates
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Matches are ranked using item details, location and report timing.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white px-6 py-2.5 border-b border-slate-200 flex items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Confidence:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setFilterConfidence('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  filterConfidence === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterConfidence('High')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  filterConfidence === 'High'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                High (70%+)
              </button>
              <button
                onClick={() => setFilterConfidence('Medium')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  filterConfidence === 'Medium'
                    ? 'bg-amber-700 text-white'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                Medium
              </button>
            </div>
          </div>

          {selectedLostItem && (
            <span className="text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              Filtered for: {selectedLostItem.title}
            </span>
          )}
        </div>

        {/* Match Candidates List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {relevantMatches.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center max-w-sm mx-auto my-12">
              <h3 className="font-semibold text-slate-800 text-sm">No Potential Matches</h3>
              <p className="text-xs text-slate-500 mt-1">
                When new lost and found reports share keywords and campus buildings, they will appear here.
              </p>
            </div>
          ) : (
            relevantMatches.map((pair, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"
              >
                {/* Score Header */}
                <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between text-xs bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 font-semibold">
                      Candidate #{idx + 1}
                    </span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded ${
                        pair.score >= 70
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {pair.score}% match
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {pair.confidence} confidence
                  </span>
                </div>

                {/* Comparison Grid */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
                  {/* Lost Item */}
                  <div className="md:col-span-5 p-3 rounded-lg border border-slate-200 bg-white">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        LOST
                      </span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(pair.lostItem.dateReported)}
                      </span>
                    </div>

                    <div className="flex gap-2.5">
                      <img
                        src={pair.lostItem.imageUrl}
                        alt={pair.lostItem.title}
                        className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0 text-xs">
                        <h4 className="font-semibold text-slate-900 truncate">
                          {pair.lostItem.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                          {pair.lostItem.description}
                        </p>
                        <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-1 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          {pair.lostItem.locationName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Middle Arrow */}
                  <div className="md:col-span-1 flex items-center justify-center text-slate-400 py-1">
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  {/* Found Item */}
                  <div className="md:col-span-5 p-3 rounded-lg border border-slate-200 bg-white">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        FOUND
                      </span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(pair.foundItem.dateReported)}
                      </span>
                    </div>

                    <div className="flex gap-2.5">
                      <img
                        src={pair.foundItem.imageUrl}
                        alt={pair.foundItem.title}
                        className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0 text-xs">
                        <h4 className="font-semibold text-slate-900 truncate">
                          {pair.foundItem.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                          {pair.foundItem.description}
                        </p>
                        <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-1 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          {pair.foundItem.locationName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match Factors & Action Footer */}
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[11px] font-semibold text-slate-500 mr-1">Match factors:</span>
                    {pair.reasons.map((reason, rIdx) => (
                      <span
                        key={rIdx}
                        className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[11px]"
                      >
                        ✓ {reason}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      onInitiateClaim(pair.foundItem, pair.lostItem);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs shrink-0"
                  >
                    <span>Review Match</span>
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
