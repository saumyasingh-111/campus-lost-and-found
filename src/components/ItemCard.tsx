import React, { useState } from 'react';
import { Item } from '../types';
import { formatRelativeTime } from '../utils/formatters';
import { MapPin, Clock, ShieldCheck } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  onClaim: (item: Item) => void;
  onSelectOnMap: (locationId: string) => void;
  onOpenMatchesForItem?: (item: Item) => void;
  onViewPassport?: (item: Item) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onClaim,
  onSelectOnMap,
  onOpenMatchesForItem,
  onViewPassport,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent modal opening when clicking action buttons directly
    if ((e.target as HTMLElement).closest('button')) return;
    if (onViewPassport) {
      onViewPassport(item);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all overflow-hidden flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Image Container */}
        <div className="relative h-44 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
          {!imageError ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 text-xs">
              <span>Photo unavailable</span>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-2.5 left-2.5">
            {item.status === 'lost' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-xs">
                LOST
              </span>
            )}
            {item.status === 'found' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
                FOUND
              </span>
            )}
            {item.status === 'reunited' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 shadow-xs">
                REUNITED
              </span>
            )}
          </div>

          {/* Passport ID & Staff Trust Tag */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
            {item.trustBadge?.status === 'in_safe_custody' && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50/95 text-emerald-800 border border-emerald-200 shadow-xs">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Custody
              </span>
            )}
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-600 bg-white/95 border border-slate-200 shadow-xs">
              {item.passportId}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-2">
          {/* Title */}
          <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {item.title}
          </h3>

          {/* Location */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectOnMap(item.locationId);
            }}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 transition-colors text-left truncate w-full"
            title="Locate building on campus map"
          >
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{item.locationName}</span>
          </button>

          {/* Reported Time */}
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Clock className="w-3 h-3 shrink-0" />
            <span>Reported {formatRelativeTime(item.dateReported)}</span>
          </div>

          {/* Short Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
            {item.description}
          </p>

          {/* Reward (if available) */}
          {item.reward && (
            <div className="text-xs font-semibold text-amber-800 pt-0.5">
              Reward: {item.reward}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Passport Link & Action Button */}
      <div className="p-4 pt-0 mt-2">
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onViewPassport) onViewPassport(item);
            }}
            className="text-[11px] text-slate-500 hover:text-indigo-600 font-medium"
          >
            View Passport →
          </button>

          <div className="flex items-center gap-1.5">
            {item.status === 'found' ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClaim(item);
                }}
                className="px-2.5 py-1 text-xs font-semibold rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
              >
                Claim Item
              </button>
            ) : item.status === 'lost' ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenMatchesForItem) {
                    onOpenMatchesForItem(item);
                  } else {
                    onClaim(item);
                  }
                }}
                className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
              >
                Matches
              </button>
            ) : (
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Reunited ✓
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
