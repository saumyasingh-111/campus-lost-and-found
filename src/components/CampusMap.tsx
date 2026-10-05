import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { ShieldCheck, RotateCcw, Building2, X, PlusCircle } from 'lucide-react';
import { CAMPUS_LOCATIONS, CAMPUS_CENTER } from '../data/campusLocations';
import { Item } from '../types';
import { ItemCard } from './ItemCard';

interface CampusMapProps {
  items: Item[];
  selectedLocationId: string | null;
  onSelectLocation: (locId: string | null) => void;
  onClaimItem: (item: Item) => void;
  onOpenReportModal: () => void;
  onViewItemPassport?: (item: Item) => void;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  items,
  selectedLocationId,
  onSelectLocation,
  onClaimItem,
  onOpenReportModal,
  onViewItemPassport,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [filterMode, setFilterMode] = useState<'all' | 'lost' | 'found' | 'reunited'>('all');

  // Compute location stats
  const locationStats = useMemo(() => {
    return CAMPUS_LOCATIONS.map((loc) => {
      const locItems = items.filter((i) => i.locationId === loc.id);
      const lostCount = locItems.filter((i) => i.status === 'lost').length;
      const foundCount = locItems.filter((i) => i.status === 'found').length;
      const reunitedCount = locItems.filter((i) => i.status === 'reunited').length;
      return {
        ...loc,
        items: locItems,
        lostCount,
        foundCount,
        reunitedCount,
        totalCount: locItems.length,
      };
    });
  }, [items]);

  const activeLocation = locationStats.find((l) => l.id === selectedLocationId) || null;

  const activeLocationItems = activeLocation
    ? activeLocation.items.filter((item) => {
        if (filterMode === 'lost') return item.status === 'lost';
        if (filterMode === 'found') return item.status === 'found';
        if (filterMode === 'reunited') return item.status === 'reunited';
        return true;
      })
    : [];

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    const map = L.map(mapContainerRef.current, {
      center: [CAMPUS_CENTER.lat, CAMPUS_CENTER.lng],
      zoom: CAMPUS_CENTER.zoom,
      zoomControl: false,
      attributionControl: true,
    });

    // Light OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Marker Layer Group
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  // Update Markers when items, filterMode, or selectedLocationId changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    locationStats.forEach((loc) => {
      // Check if location should be displayed according to filterMode
      if (filterMode === 'lost' && loc.lostCount === 0) return;
      if (filterMode === 'found' && loc.foundCount === 0) return;
      if (filterMode === 'reunited' && loc.reunitedCount === 0) return;

      const isSelected = selectedLocationId === loc.id;

      // Label for clean Apple/Google Maps style marker: "📍 Library — 2 items"
      let countLabel = '';
      if (filterMode === 'lost') {
        countLabel = `${loc.lostCount} lost`;
      } else if (filterMode === 'found') {
        countLabel = `${loc.foundCount} found`;
      } else if (filterMode === 'reunited') {
        countLabel = `${loc.reunitedCount} reunited`;
      } else {
        countLabel = loc.totalCount === 1 ? '1 item' : `${loc.totalCount} items`;
      }

      const iconHtml = `
        <div class="campus-marker-pin ${isSelected ? 'active' : ''}">
          <span style="font-size: 12px; line-height: 1;">📍</span>
          <span>${loc.code}</span>
          ${
            loc.totalCount > 0
              ? `<span class="${
                  loc.foundCount > 0 ? 'marker-badge-found' : 'marker-badge-lost'
                }">${countLabel}</span>`
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-div-icon',
        html: iconHtml,
        iconSize: [110, 28],
        iconAnchor: [55, 14],
        popupAnchor: [0, -16],
      });

      const marker = L.marker([loc.coordinates.lat, loc.coordinates.lng], {
        icon: customIcon,
      });

      // Clean Light Popup
      const popupHtml = document.createElement('div');
      popupHtml.className = 'p-3 space-y-2';
      popupHtml.innerHTML = `
        <div style="padding: 2px 0;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <h4 style="font-size: 13px; font-weight: 700; color: #0f172a; margin: 0;">${loc.name}</h4>
          </div>
          <p style="font-size: 11px; color: #64748b; margin: 4px 0 8px 0; line-height: 1.3;">
            ${loc.description}
          </p>
          <div style="display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 600; color: #334155; padding-bottom: 6px; border-bottom: 1px solid #f1f5f9;">
            <span>${loc.totalCount} reported item${loc.totalCount !== 1 ? 's' : ''}</span>
            <span>•</span>
            <span style="color: #b45309;">${loc.lostCount} Lost</span>
            <span>•</span>
            <span style="color: #047857;">${loc.foundCount} Found</span>
          </div>
        </div>
      `;

      const viewItemsBtn = document.createElement('button');
      viewItemsBtn.innerText = `View items (${loc.totalCount})`;
      viewItemsBtn.style.cssText =
        'width: 100%; padding: 6px 10px; background-color: #4338ca; color: #ffffff; border: none; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; transition: background 0.15s;';
      viewItemsBtn.onmouseover = () => {
        viewItemsBtn.style.backgroundColor = '#3730a3';
      };
      viewItemsBtn.onmouseout = () => {
        viewItemsBtn.style.backgroundColor = '#4338ca';
      };
      viewItemsBtn.onclick = () => {
        onSelectLocation(loc.id);
        map.closePopup();
      };
      popupHtml.appendChild(viewItemsBtn);

      marker.bindPopup(popupHtml, {
        maxWidth: 240,
        className: 'clean-campus-popup',
      });

      marker.on('click', () => {
        onSelectLocation(loc.id);
      });

      markersGroup.addLayer(marker);
    });
  }, [items, filterMode, selectedLocationId, onSelectLocation, locationStats]);

  // Pan to selected location if set
  useEffect(() => {
    if (!selectedLocationId || !mapInstanceRef.current) return;
    const targetLoc = CAMPUS_LOCATIONS.find((l) => l.id === selectedLocationId);
    if (targetLoc) {
      mapInstanceRef.current.flyTo(
        [targetLoc.coordinates.lat, targetLoc.coordinates.lng],
        17,
        { duration: 0.8 }
      );
    }
  }, [selectedLocationId]);

  // Recenter map
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [CAMPUS_CENTER.lat, CAMPUS_CENTER.lng],
        CAMPUS_CENTER.zoom,
        { duration: 0.8 }
      );
    }
    onSelectLocation(null);
  };

  // Jump to building from dropdown
  const handleBuildingSelect = (locId: string) => {
    if (!locId) {
      onSelectLocation(null);
      return;
    }
    onSelectLocation(locId);
  };

  return (
    <div className="space-y-4">
      {/* Real Campus Map Header / Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left: Building Search & Jump */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedLocationId || ''}
              onChange={(e) => handleBuildingSelect(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="">Jump to Campus Building...</option>
              {CAMPUS_LOCATIONS.map((loc) => {
                const count = items.filter((i) => i.locationId === loc.id).length;
                return (
                  <option key={loc.id} value={loc.id}>
                    {loc.code} — {loc.name} ({count} items)
                  </option>
                );
              })}
            </select>
          </div>
          {selectedLocationId && (
            <button
              onClick={() => onSelectLocation(null)}
              title="Clear selection"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right: Map Filter & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                filterMode === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterMode('lost')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                filterMode === 'lost'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lost
            </button>
            <button
              onClick={() => setFilterMode('found')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                filterMode === 'found'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Found
            </button>
            <button
              onClick={() => setFilterMode('reunited')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                filterMode === 'reunited'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reunited
            </button>
          </div>

          {/* Recenter Button */}
          <button
            onClick={handleRecenter}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Recenter</span>
          </button>

          {/* Report Button */}
          <button
            onClick={onOpenReportModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Item</span>
          </button>
        </div>
      </div>

      {/* Real Interactive Map Canvas */}
      <div className="relative rounded-xl border border-slate-200 overflow-hidden shadow-xs bg-slate-100">
        {/* Real Leaflet Map Container */}
        <div
          ref={mapContainerRef}
          className="w-full h-[480px] sm:h-[540px] z-10"
        />

        {/* Floating Quick Legend */}
        <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-xs px-3 py-2 rounded-lg border border-slate-200 text-[11px] text-slate-600 flex items-center gap-3 shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Lost Item</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Found Item</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-indigo-600" />
            <span>Monitored Safe Desk</span>
          </div>
        </div>
      </div>

      {/* Selected Location Details Card & Filtered Items */}
      {activeLocation && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
                  {activeLocation.code}
                </span>
                <h3 className="text-base font-bold text-slate-900">{activeLocation.name}</h3>
                {activeLocation.safeZone && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" />
                    Safe Exchange Zone
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">{activeLocation.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-600">
                <strong>{activeLocation.totalCount}</strong> items ({activeLocation.lostCount} lost, {activeLocation.foundCount} found)
              </span>
              <button
                onClick={() => onSelectLocation(null)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Close location view
              </button>
            </div>
          </div>

          {/* Items in this location */}
          {activeLocationItems.length === 0 ? (
            <div className="py-6 text-center text-slate-400 text-xs">
              No {filterMode !== 'all' ? filterMode : ''} items currently reported at this location.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              {activeLocationItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClaim={onClaimItem}
                  onSelectOnMap={() => {}}
                  onViewPassport={onViewItemPassport}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
