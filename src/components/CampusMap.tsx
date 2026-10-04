import React, { useState } from 'react';
import { MapPin, ShieldCheck, Compass, Filter, ChevronRight, Sparkles, Building, Layers } from 'lucide-react';
import { CAMPUS_LOCATIONS } from '../data/campusLocations';
import { Item, CampusLocation } from '../types';
import { ItemCard } from './ItemCard';

interface CampusMapProps {
  items: Item[];
  selectedLocationId: string | null;
  onSelectLocation: (locId: string | null) => void;
  onClaimItem: (item: Item) => void;
  onOpenReportModal: () => void;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  items,
  selectedLocationId,
  onSelectLocation,
  onClaimItem,
  onOpenReportModal,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'lost' | 'found'>('all');
  const [hoveredLocation, setHoveredLocation] = useState<CampusLocation | null>(null);

  // Group items by location
  const locationStats = CAMPUS_LOCATIONS.map((loc) => {
    const locItems = items.filter((i) => i.locationId === loc.id);
    const lostCount = locItems.filter((i) => i.status === 'lost').length;
    const foundCount = locItems.filter((i) => i.status === 'found').length;
    const total = locItems.length;

    return {
      ...loc,
      items: locItems,
      lostCount,
      foundCount,
      totalCount: total,
    };
  });

  const activeLocation = locationStats.find((l) => l.id === selectedLocationId) || null;

  // Filter items in active location
  const activeLocationItems = activeLocation
    ? activeLocation.items.filter((item) => {
        if (filterMode === 'lost') return item.status === 'lost';
        if (filterMode === 'found') return item.status === 'found';
        return true;
      })
    : [];

  return (
    <div className="space-y-6">
      {/* Map Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Interactive Campus Map Grid</h2>
            <p className="text-xs text-slate-500">
              Click pins or buildings to inspect local item drop-offs and reported losses
            </p>
          </div>
        </div>

        {/* Filter by pin type */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 hidden md:inline">Display:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterMode === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Pins
            </button>
            <button
              onClick={() => setFilterMode('lost')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filterMode === 'lost'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-700 hover:bg-amber-100/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-200"></span>
              Lost
            </button>
            <button
              onClick={() => setFilterMode('found')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filterMode === 'found'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 hover:bg-emerald-100/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-200"></span>
              Found
            </button>
          </div>
          {selectedLocationId && (
            <button
              onClick={() => onSelectLocation(null)}
              className="text-xs text-indigo-600 font-semibold px-2.5 py-1.5 hover:bg-indigo-50 rounded-lg"
            >
              Show Entire Campus
            </button>
          )}
        </div>
      </div>

      {/* SVG Map Canvas Container */}
      <div className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-800">
        {/* Map Legend Floating Tag */}
        <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs text-slate-300 flex items-center gap-4 shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Lost Item</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Found Item</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Safe Exchange Zone</span>
          </div>
        </div>

        {/* Hover / Quick Detail Tag */}
        {hoveredLocation && (
          <div className="absolute bottom-4 left-4 z-20 bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-indigo-500 text-white shadow-2xl max-w-sm pointer-events-none transition-all">
            <p className="font-bold text-sm text-indigo-300">{hoveredLocation.name} ({hoveredLocation.code})</p>
            <p className="text-xs text-slate-300 mt-0.5">{hoveredLocation.description}</p>
            <div className="flex items-center gap-3 mt-2 text-xs font-semibold">
              <span className="text-amber-400">Lost: {hoveredLocation.lostCount || 0}</span>
              <span className="text-emerald-400">Found: {hoveredLocation.foundCount || 0}</span>
              {hoveredLocation.safeZone && (
                <span className="text-blue-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Safe Zone
                </span>
              )}
            </div>
          </div>
        )}

        {/* The Campus Vector Map (SVG) */}
        <div className="relative w-full aspect-16/10 min-h-[460px] overflow-hidden select-none">
          <svg
            viewBox="0 0 1000 650"
            className="w-full h-full object-cover"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="campusGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
              </radialGradient>
              <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" opacity="0.3" />
              </pattern>
            </defs>

            {/* Background & Grid */}
            <rect width="1000" height="650" fill="#090d16" />
            <rect width="1000" height="650" fill="url(#gridPattern)" />
            <rect width="1000" height="650" fill="url(#campusGlow)" />

            {/* Campus Boundary Lines & Roads */}
            <path
              d="M 50 120 Q 300 80 500 120 T 950 140"
              stroke="#1e293b"
              strokeWidth="28"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 120 50 Q 150 350 250 580"
              stroke="#1e293b"
              strokeWidth="24"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 500 120 L 500 600"
              stroke="#1e293b"
              strokeWidth="24"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 250 350 L 880 380"
              stroke="#1e293b"
              strokeWidth="20"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 850 100 L 780 600"
              stroke="#1e293b"
              strokeWidth="22"
              fill="none"
              strokeLinecap="round"
            />

            {/* Central Quad Lawn Lawn / Greenery */}
            <ellipse cx="480" cy="420" rx="140" ry="90" fill="#064e3b" opacity="0.25" />
            <circle cx="480" cy="420" r="70" fill="#065f46" opacity="0.3" />
            <circle cx="480" cy="420" r="16" fill="#0284c7" opacity="0.6" /> {/* Fountain */}

            {/* Athletic Complex Field */}
            <rect x="120" y="160" width="160" height="100" rx="12" fill="#047857" opacity="0.2" stroke="#059669" strokeWidth="1" strokeDasharray="4 4" />

            {/* Stylized Building Footprints */}
            {locationStats.map((loc) => {
              const svgX = (loc.coordinates.x / 100) * 1000;
              const svgY = (loc.coordinates.y / 100) * 650;
              const isSelected = selectedLocationId === loc.id;

              return (
                <g
                  key={loc.id}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={() => onSelectLocation(loc.id)}
                  onMouseEnter={() => setHoveredLocation(loc)}
                  onMouseLeave={() => setHoveredLocation(null)}
                >
                  {/* Building Block */}
                  <rect
                    x={svgX - 44}
                    y={svgY - 32}
                    width="88"
                    height="64"
                    rx="10"
                    fill={isSelected ? '#312e81' : '#1e293b'}
                    stroke={isSelected ? '#818cf8' : '#334155'}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                    className="hover:stroke-indigo-400 transition-colors"
                  />
                  {/* Architectural accents */}
                  <rect
                    x={svgX - 36}
                    y={svgY - 24}
                    width="72"
                    height="48"
                    rx="6"
                    fill={isSelected ? '#3730a3' : '#0f172a'}
                    opacity="0.8"
                  />
                  {/* Building Code Label inside */}
                  <text
                    x={svgX}
                    y={svgY + 4}
                    textAnchor="middle"
                    fill={isSelected ? '#e0e7ff' : '#94a3b8'}
                    fontSize="13"
                    fontWeight="bold"
                    letterSpacing="0.05em"
                  >
                    {loc.code}
                  </text>
                  <text
                    x={svgX}
                    y={svgY + 18}
                    textAnchor="middle"
                    fill={isSelected ? '#c7d2fe' : '#64748b'}
                    fontSize="9"
                    fontWeight="500"
                  >
                    {loc.items.length} items
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Dynamic Interactive HTML Pins Layer on top of SVG */}
          {locationStats.map((loc) => {
            const hasLost = loc.lostCount > 0;
            const hasFound = loc.foundCount > 0;
            const isSelected = selectedLocationId === loc.id;

            // Check if matches filterMode
            if (filterMode === 'lost' && !hasLost) return null;
            if (filterMode === 'found' && !hasFound) return null;

            return (
              <div
                key={loc.id}
                style={{
                  left: `${loc.coordinates.x}%`,
                  top: `${loc.coordinates.y}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer pointer-events-auto"
                onClick={() => onSelectLocation(loc.id)}
                onMouseEnter={() => setHoveredLocation(loc)}
                onMouseLeave={() => setHoveredLocation(null)}
              >
                <div className="relative group">
                  {/* Pulsing halo if items present */}
                  {loc.totalCount > 0 && (
                    <span
                      className={`absolute -inset-2 rounded-full opacity-75 animate-ping ${
                        hasFound ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    ></span>
                  )}

                  {/* Main Pin Element */}
                  <div
                    className={`relative flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold shadow-lg ring-2 transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white ring-white scale-110'
                        : hasFound && hasLost
                        ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white ring-slate-900'
                        : hasFound
                        ? 'bg-emerald-600 text-white ring-slate-900'
                        : hasLost
                        ? 'bg-amber-500 text-white ring-slate-900'
                        : 'bg-slate-800 text-slate-300 ring-slate-700'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{loc.code}</span>
                    {loc.totalCount > 0 && (
                      <span className="ml-0.5 px-1 py-0.2 rounded-full bg-black/30 text-[10px]">
                        {loc.totalCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Location Details & Item List */}
      {activeLocation && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {activeLocation.code}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">{activeLocation.name}</h3>
                {activeLocation.safeZone && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Designated Safe Zone
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">{activeLocation.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-400 uppercase">Building Total</p>
                <p className="text-lg font-bold text-slate-900">
                  {activeLocation.totalCount} items
                  <span className="text-xs font-medium text-slate-500 ml-1.5">
                    ({activeLocation.lostCount} lost, {activeLocation.foundCount} found)
                  </span>
                </p>
              </div>
              <button
                onClick={onOpenReportModal}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-xs"
              >
                + Report Item Here
              </button>
            </div>
          </div>

          {/* Items in this location */}
          {activeLocationItems.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No {filterMode !== 'all' ? filterMode : ''} items currently reported at this location.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {activeLocationItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClaim={onClaimItem}
                  onSelectOnMap={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
