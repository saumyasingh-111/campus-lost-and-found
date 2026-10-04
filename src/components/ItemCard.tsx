import React, { useState } from 'react';
import { Item } from '../types';
import { formatRelativeTime, getCategoryBadge } from '../utils/formatters';
import { MapPin, Clock, ShieldCheck, Sparkles, KeyRound, Award, CheckCircle2 } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  onClaim: (item: Item) => void;
  onSelectOnMap: (locationId: string) => void;
  onOpenMatchesForItem?: (item: Item) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onClaim,
  onSelectOnMap,
  onOpenMatchesForItem,
}) => {
  const [imageError, setImageError] = useState(false);
  const categoryInfo = getCategoryBadge(item.category);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Card Header Media */}
        <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
          {!imageError ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
              <Sparkles className="w-8 h-8 mb-1" />
              <span className="text-xs font-medium">Campus Asset Image</span>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            {item.status === 'lost' && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm ring-2 ring-white/50">
                <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5 animate-pulse"></span>
                LOST
              </span>
            )}
            {item.status === 'found' && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-sm ring-2 ring-white/50">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                FOUND
              </span>
            )}
            {item.status === 'reunited' && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm ring-2 ring-white/50">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                REUNITED
              </span>
            )}
          </div>

          {/* Category Chip */}
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold backdrop-blur-md bg-white/90 shadow-xs border ${categoryInfo.color}`}>
              {categoryInfo.label}
            </span>
          </div>

          {/* Optional Reward Badge */}
          {item.reward && (
            <div className="absolute bottom-3 left-3">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-amber-400 text-amber-950 shadow-xs">
                <Award className="w-3 h-3 mr-1" />
                Reward: {item.reward}
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5">
          {/* Title & Description */}
          <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {item.title}
          </h3>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Location & Time Metas */}
          <div className="mt-3 space-y-1.5 text-xs text-slate-500">
            <button
              onClick={() => onSelectOnMap(item.locationId)}
              className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-medium transition-colors text-left"
              title="Click to view building on campus map"
            >
              <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="truncate underline decoration-dotted">{item.locationName}</span>
            </button>

            <div className="flex items-center gap-1.5 text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Reported {formatRelativeTime(item.dateReported)}</span>
            </div>
          </div>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {item.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Verification Hint Alert */}
          <div className="mt-3 p-2 rounded-lg bg-indigo-50/60 border border-indigo-100/80 flex items-start gap-2">
            <KeyRound className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-indigo-900">
              <strong className="font-semibold">Security Check: </strong>
              {item.secretVerification.hintQuestion}
            </p>
          </div>
        </div>
      </div>

      {/* Card Footer: Reporter Info & Action Button */}
      <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 mt-2">
        <div className="flex items-center justify-between pt-3">
          {/* Reporter avatar */}
          <div className="flex items-center gap-2">
            <img
              src={item.reporter.avatar}
              alt={item.reporter.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
            />
            <div className="text-[11px] leading-tight">
              <p className="font-semibold text-slate-800">{item.reporter.name}</p>
              <p className="text-slate-400">{item.reporter.role}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            {item.status === 'found' ? (
              <button
                onClick={() => onClaim(item)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-95 transition-all flex items-center gap-1"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Claim Item</span>
              </button>
            ) : item.status === 'lost' ? (
              <button
                onClick={() => (onOpenMatchesForItem ? onOpenMatchesForItem(item) : onClaim(item))}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 active:scale-95 transition-all flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Matches</span>
              </button>
            ) : (
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                Reunited ✓
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
