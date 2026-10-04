import React from 'react';
import { Search, X, MapPin, SlidersHorizontal } from 'lucide-react';
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
  { id: 'all', label: 'All Categories' },
  { id: 'electronics', label: '📱 Electronics' },
  { id: 'id_cards', label: '🪪 IDs & Cards' },
  { id: 'keys', label: '🔑 Keys & Fobs' },
  { id: 'bags', label: '🎒 Bags & Backpacks' },
  { id: 'books', label: '📚 Books & Stationery' },
  { id: 'accessories', label: '🧣 Accessories' },
  { id: 'clothing', label: '👕 Apparel' },
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
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs mb-6 space-y-4">
      {/* Top Row: Search Input & Location Dropdown */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by keywords (e.g. 'boAt Airdopes', 'Casio fx-991EX', 'Milton', 'Activa Keys', 'Institute ID')..."
            className="w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Location Dropdown */}
        <div className="relative md:w-72">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            aria-label="Filter by Campus Location"
            className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium appearance-none focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer"
          >
            <option value="all">📍 All Campus Locations</option>
            {CAMPUS_LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.code} — {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Second Row: Status Filter Tabs and Category Chips */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-1 border-t border-slate-100">
        {/* Status Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setStatusFilter('lost')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              statusFilter === 'lost'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-700 hover:bg-amber-100/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-200"></span>
            Lost
          </button>
          <button
            onClick={() => setStatusFilter('found')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              statusFilter === 'found'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:bg-emerald-100/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-200"></span>
            Found
          </button>
          <button
            onClick={() => setStatusFilter('reunited')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              statusFilter === 'reunited'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-blue-700 hover:bg-blue-100/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-200"></span>
            Reunited
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Info / Reset Bar */}
      {isFiltered && (
        <div className="flex items-center justify-between pt-2 text-xs text-slate-500 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              Showing <strong className="text-slate-800 font-semibold">{totalFilteredCount}</strong> matching items
            </span>
          </div>
          <button
            onClick={onClearFilters}
            className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
