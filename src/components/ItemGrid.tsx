import React from 'react';
import { Item } from '../types';
import { ItemCard } from './ItemCard';
import { PlusCircle, SearchX } from 'lucide-react';

interface ItemGridProps {
  items: Item[];
  onClaim: (item: Item) => void;
  onSelectOnMap: (locationId: string) => void;
  onOpenReportModal: () => void;
  onOpenMatchesForItem?: (item: Item) => void;
}

export const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  onClaim,
  onSelectOnMap,
  onOpenReportModal,
  onOpenMatchesForItem,
}) => {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">No matching items found</h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          We couldn't find any lost or found items matching your current filters. Try changing your search query or location.
        </p>
        <button
          onClick={onOpenReportModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report a Lost or Found Item</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onClaim={onClaim}
          onSelectOnMap={onSelectOnMap}
          onOpenMatchesForItem={onOpenMatchesForItem}
        />
      ))}
    </div>
  );
};
