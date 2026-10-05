import React from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { CAMPUS_LOCATIONS } from '../data/campusLocations';

interface SearchAndFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: 'all' | 'lost' | 'found' | 'reunited';
  setStatusFilter: (status: 'all' | 'lost' | 'found' | 'reunited') => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  onClearFilters: () => void;
  totalFilteredCount: number;
}

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'id_cards', label: 'IDs & Cards' },
  { id: 'keys', label: 'Keys' },
  { id: 'bags', label: 'Bags' },
  { id: 'books', label: 'Books' },
  { id: 'accessories', label: 'Accessories' },
];

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  onClearFilters,
  totalFilteredCount,
}) => {
  const isFiltered =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    selectedCategory !== 'all' ||
    selectedLocation !== 'all';

  return (
    <div className="space-y-3 mb-6">
      {/* Top Search Bar & Location Selector */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Location Dropdown */}
        <div className="relative sm:w-64">
          <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            aria-label="Filter by Campus Location"
            className="w-full pl-8 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-medium appearance-none focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-xs"
          >
            <option value="all">All Locations</option>
            {CAMPUS_LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.code} — {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Second Row: Status Filter Tabs & Category Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
        {/* Status Filter: All | Lost | Found | Reunited */}
        <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('lost')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              statusFilter === 'lost'
                ? 'bg-white text-amber-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lost
          </button>
          <button
            onClick={() => setStatusFilter('found')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              statusFilter === 'found'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Found
          </button>
          <button
            onClick={() => setStatusFilter('reunited')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              statusFilter === 'reunited'
                ? 'bg-white text-blue-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reunited
          </button>
        </div>

        {/* Categories: Electronics | IDs & Cards | Keys | Bags | Books | Accessories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Info / Reset Info */}
      {isFiltered && (
        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
          <span>
            Showing <strong>{totalFilteredCount}</strong> matching items
          </span>
          <button
            onClick={onClearFilters}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
};
