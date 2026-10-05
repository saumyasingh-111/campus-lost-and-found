import React from 'react';
import { Item } from '../types';
import { ItemCard } from './ItemCard';
import { Plus } from 'lucide-react';

interface ItemGridProps {
  items: Item[];
  onClaim: (item: Item) => void;
  onSelectOnMap: (locationId: string) => void;
  onOpenReportModal: () => void;
  onOpenMatchesForItem?: (item: Item) => void;
  onViewPassport?: (item: Item) => void;
}

export const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  onClaim,
  onSelectOnMap,
  onOpenReportModal,
  onOpenMatchesForItem,
  onViewPassport,
}) => {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-800 mb-1">No items found</h3>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          No reports match your current filters. Try changing your search query or location.
        </p>
        <button
          onClick={onOpenReportModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Report an Item</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onClaim={onClaim}
          onSelectOnMap={onSelectOnMap}
          onOpenMatchesForItem={onOpenMatchesForItem}
          onViewPassport={onViewPassport}
        />
      ))}
    </div>
  );
};
