import React, { useState, useEffect, useMemo } from 'react';
import { Item } from './types';
import { loadStoredItems, saveStoredItems } from './utils/storage';
import { computeAutoMatches } from './utils/matchingEngine';
import { INITIAL_ITEMS } from './data/initialItems';
import { LandingPage } from './components/LandingPage';
import { Header } from './components/Header';
import { AnalyticsCards } from './components/AnalyticsCards';
import { SearchAndFilters } from './components/SearchAndFilters';
import { ItemGrid } from './components/ItemGrid';
import { PostItemModal } from './components/PostItemModal';
import { SmartMatchDrawer } from './components/SmartMatchDrawer';
import { ClaimModal } from './components/ClaimModal';
import { ItemPassportModal } from './components/ItemPassportModal';
import { CampusMap } from './components/CampusMap';
import { LeaderboardView } from './components/LeaderboardView';
import { ToastContainer, ToastMessage } from './components/Toast';

export function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [items, setItems] = useState<Item[]>(() => loadStoredItems());
  const [activeTab, setActiveTab] = useState<'feed' | 'map' | 'matches' | 'leaderboard'>('feed');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'lost' | 'found' | 'reunited'>('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [mapSelectedLocationId, setMapSelectedLocationId] = useState<string | null>(null);

  // Modals & Drawer State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSmartMatchOpen, setIsSmartMatchOpen] = useState(false);
  const [selectedLostItemForMatch, setSelectedLostItemForMatch] = useState<Item | null>(null);
  const [claimingItem, setClaimingItem] = useState<Item | null>(null);
  const [viewingPassportItem, setViewingPassportItem] = useState<Item | null>(null);

  // Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync items to localStorage
  useEffect(() => {
    saveStoredItems(items);
  }, [items]);

  // Compute Auto Matches
  const matches = useMemo(() => computeAutoMatches(items), [items]);

  // Filter items for Feed
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.locationName.toLowerCase().includes(q) ||
          item.passportId.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // 2. Status
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }

      // 3. Category
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // 4. Location
      if (selectedLocation !== 'all' && item.locationId !== selectedLocation) {
        return false;
      }

      return true;
    });
  }, [items, searchQuery, statusFilter, selectedCategory, selectedLocation]);

  // Handle New Item Submission
  const handleCreateItem = (
    newItemData: Omit<Item, 'id' | 'status' | 'dateReported' | 'passportId'>
  ) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const passportId = `CR-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newItem: Item = {
      ...newItemData,
      id: `item-${Date.now()}`,
      passportId,
      status: newItemData.type === 'lost' ? 'lost' : 'found',
      dateReported: now.toISOString(),
      timeline: [
        {
          id: `t-${Date.now()}-1`,
          date: dateStr,
          time: timeStr,
          title: `Item registered as ${newItemData.type.toUpperCase()}`,
          location: newItemData.locationName,
          actor: newItemData.reporter.name,
        },
        {
          id: `t-${Date.now()}-2`,
          date: dateStr,
          time: timeStr,
          title: `Item Passport ${passportId} generated`,
          location: 'Campus Registry',
        },
      ],
    };

    setItems((prev) => [newItem, ...prev]);

    addToast(
      'success',
      'Report Registered',
      `"${newItem.title}" (${newItem.passportId}) is now listed in the campus registry.`
    );
  };

  // Handle Claim Success & Safe Handoff
  const handleSuccessClaim = (
    itemId: string,
    claimantInfo: { name: string; email: string },
    handoffCode?: string,
    handoffLocation?: string
  ) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== itemId) return i;

        const updatedTimeline = [
          ...(i.timeline || []),
          {
            id: `t-claim-${Date.now()}`,
            date: dateStr,
            time: timeStr,
            title: 'Ownership verified & Safe Handoff generated',
            location: handoffLocation || 'Dr. APJ Abdul Kalam Central Library Help Desk',
            actor: claimantInfo.name,
            note: `One-time code: ${handoffCode || '739 214'}`,
          },
        ];

        return {
          ...i,
          status: 'reunited',
          safeHandoff: {
            code: handoffCode || '739 214',
            pickupLocation: handoffLocation || 'Dr. APJ Abdul Kalam Central Library Help Desk',
            status: 'ready',
          },
          timeline: updatedTimeline,
        };
      })
    );

    addToast(
      'success',
      'Ownership Verified',
      `One-time handoff code generated for ${claimantInfo.name}. Contact details remain private.`
    );
  };

  // Update Item Status (Staff / Admin Action)
  const handleUpdateItemStatus = (
    itemId: string,
    newStatus: Item['status'],
    trustStatus?: 'in_safe_custody' | 'staff_verified',
    note?: string
  ) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== itemId) return i;

        const updatedTimeline = [
          ...(i.timeline || []),
          {
            id: `t-admin-${Date.now()}`,
            date: dateStr,
            time: timeStr,
            title: trustStatus ? `Marked as ${trustStatus.replace('_', ' ')}` : `Status updated to ${newStatus}`,
            actor: 'Campus Staff / Proctor',
            note,
          },
        ];

        return {
          ...i,
          status: newStatus,
          trustBadge: trustStatus
            ? {
                status: trustStatus,
                verifiedBy: 'Proctor Desk',
                verifiedAt: dateStr,
              }
            : i.trustBadge,
          timeline: updatedTimeline,
        };
      })
    );

    addToast('info', 'Status Updated', note || `Item record updated by campus staff.`);
  };

  // Reset sample dataset
  const handleResetData = () => {
    if (window.confirm('Reset database to default campus lost and found records?')) {
      setItems(INITIAL_ITEMS);
      addToast('info', 'Database Reset', 'Sample university records restored.');
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSelectedCategory('all');
    setSelectedLocation('all');
  };

  const handleSelectOnMap = (locationId: string) => {
    setMapSelectedLocationId(locationId);
    setActiveTab('map');
  };

  const handleOpenMatchesForItem = (item: Item) => {
    setSelectedLostItemForMatch(item);
    setIsSmartMatchOpen(true);
  };

  // IF USER IS ON SHORT MODERN LANDING PAGE
  if (viewMode === 'landing') {
    return (
      <LandingPage
        onExploreCampus={() => {
          setViewMode('app');
          setActiveTab('feed');
        }}
        onReportItem={() => {
          setViewMode('app');
          setIsReportModalOpen(true);
        }}
      />
    );
  }

  // MAIN CAMPUS REUNITE APPLICATION
  return (
    <div className="min-h-screen bg-[#F7F8FA] text-slate-900 flex flex-col font-sans">
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        matchesCount={matches.length}
        totalItemsCount={items.length}
        onResetData={handleResetData}
        onReturnToLanding={() => setViewMode('landing')}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: FEED */}
        {activeTab === 'feed' && (
          <div className="space-y-4">
            {/* Step 1 Compact Stats */}
            <AnalyticsCards
              items={items}
              matches={matches}
              onViewMatches={() => {
                setSelectedLostItemForMatch(null);
                setIsSmartMatchOpen(true);
              }}
              onFilterStatus={(status) => setStatusFilter(status)}
            />

            {/* Step 2 Search & Filters */}
            <SearchAndFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              onClearFilters={handleClearFilters}
              totalFilteredCount={filteredItems.length}
            />

            {/* Main Item Feed Grid */}
            <div>
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-semibold text-slate-700">
                  Campus Items ({filteredItems.length})
                </span>
                {matches.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedLostItemForMatch(null);
                      setIsSmartMatchOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    View {matches.length} potential matches →
                  </button>
                )}
              </div>

              <ItemGrid
                items={filteredItems}
                onClaim={(item) => setClaimingItem(item)}
                onSelectOnMap={handleSelectOnMap}
                onOpenReportModal={() => setIsReportModalOpen(true)}
                onOpenMatchesForItem={handleOpenMatchesForItem}
                onViewPassport={(item) => setViewingPassportItem(item)}
              />
            </div>
          </div>
        )}

        {/* TAB 2: REAL INTERACTIVE CAMPUS MAP */}
        {activeTab === 'map' && (
          <CampusMap
            items={items}
            selectedLocationId={mapSelectedLocationId}
            onSelectLocation={(locId) => setMapSelectedLocationId(locId)}
            onClaimItem={(item) => setClaimingItem(item)}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onViewItemPassport={(item) => setViewingPassportItem(item)}
          />
        )}

        {/* TAB 3: SMART MATCHES VIEW */}
        {activeTab === 'matches' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Potential Matches</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Matches are ranked using item details, location and report timing.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200">
                {matches.length} Candidates
              </span>
            </div>

            <button
              onClick={() => {
                setSelectedLostItemForMatch(null);
                setIsSmartMatchOpen(true);
              }}
              className="w-full py-3 text-center rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs shadow-xs transition-colors"
            >
              Open Full Match Review Drawer ({matches.length})
            </button>
          </div>
        )}

        {/* TAB 4: CAMPUS KARMA */}
        {activeTab === 'leaderboard' && <LeaderboardView />}
      </main>

      {/* Smart Match Review Drawer */}
      <SmartMatchDrawer
        isOpen={isSmartMatchOpen || activeTab === 'matches'}
        onClose={() => {
          setIsSmartMatchOpen(false);
          if (activeTab === 'matches') setActiveTab('feed');
        }}
        matches={matches}
        onInitiateClaim={(foundItem) => {
          setIsSmartMatchOpen(false);
          if (activeTab === 'matches') setActiveTab('feed');
          setClaimingItem(foundItem);
        }}
        selectedLostItem={selectedLostItemForMatch}
      />

      {/* Report Item Modal */}
      <PostItemModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleCreateItem}
      />

      {/* Ownership Verification & Safe Handoff Modal */}
      <ClaimModal
        isOpen={!!claimingItem}
        onClose={() => setClaimingItem(null)}
        item={claimingItem}
        onSuccessClaim={handleSuccessClaim}
      />

      {/* Item Passport & Lifecycle Modal */}
      <ItemPassportModal
        isOpen={!!viewingPassportItem}
        onClose={() => setViewingPassportItem(null)}
        item={viewingPassportItem}
        onClaim={(item) => {
          setViewingPassportItem(null);
          setClaimingItem(item);
        }}
        onSelectOnMap={(locId) => {
          setViewingPassportItem(null);
          handleSelectOnMap(locId);
        }}
        onUpdateStatus={handleUpdateItemStatus}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
