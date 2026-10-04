import React, { useState, useEffect, useMemo } from 'react';
import { Item, AutoMatchPair } from './types';
import { loadStoredItems, saveStoredItems } from './utils/storage';
import { computeAutoMatches } from './utils/matchingEngine';
import { INITIAL_ITEMS } from './data/initialItems';
import { Header } from './components/Header';
import { AnalyticsCards } from './components/AnalyticsCards';
import { SearchAndFilters } from './components/SearchAndFilters';
import { ItemGrid } from './components/ItemGrid';
import { PostItemModal } from './components/PostItemModal';
import { SmartMatchDrawer } from './components/SmartMatchDrawer';
import { ClaimModal } from './components/ClaimModal';
import { CampusMap } from './components/CampusMap';
import { LeaderboardView } from './components/LeaderboardView';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Sparkles, Compass, Trophy } from 'lucide-react';

export function App() {
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

  // Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
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
  const handleCreateItem = (newItemData: Omit<Item, 'id' | 'status' | 'dateReported'>) => {
    const newItem: Item = {
      ...newItemData,
      id: `item-${Date.now()}`,
      status: newItemData.type === 'lost' ? 'lost' : 'found',
      dateReported: new Date().toISOString(),
    };

    setItems((prev) => [newItem, ...prev]);

    addToast(
      'success',
      'Item Report Published',
      `"${newItem.title}" has been registered in the campus network. Auto-matching active!`
    );
  };

  // Handle Claim Success
  const handleSuccessClaim = (itemId: string, claimantInfo: { name: string; email: string }) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              status: 'reunited',
            }
          : i
      )
    );

    addToast(
      'success',
      'Item Reunited & Verified! 🎉',
      `Ownership confirmed for ${claimantInfo.name}. Contact information decrypted.`
    );
  };

  // Reset sample dataset
  const handleResetData = () => {
    if (window.confirm('Reset lost and found database to original campus demonstration data?')) {
      setItems(INITIAL_ITEMS);
      addToast('info', 'Database Reset', 'Sample campus items and status restored.');
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        matchesCount={matches.length}
        totalItemsCount={items.length}
        onResetData={handleResetData}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: BROWSE FEED */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            {/* Step 1 Analytics Cards */}
            <AnalyticsCards
              items={items}
              matches={matches}
              onViewMatches={() => {
                setSelectedLostItemForMatch(null);
                setIsSmartMatchOpen(true);
              }}
              onFilterStatus={(status) => setStatusFilter(status)}
            />

            {/* Step 2 Search & Multi-Filters */}
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

            {/* Step 1 & 2 Main Grid Display */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-extrabold text-slate-900">Campus Activity Feed</h2>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full">
                    {filteredItems.length} items
                  </span>
                </div>

                {matches.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedLostItemForMatch(null);
                      setIsSmartMatchOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>View {matches.length} Auto-Matches</span>
                  </button>
                )}
              </div>

              <ItemGrid
                items={filteredItems}
                onClaim={(item) => setClaimingItem(item)}
                onSelectOnMap={handleSelectOnMap}
                onOpenReportModal={() => setIsReportModalOpen(true)}
                onOpenMatchesForItem={handleOpenMatchesForItem}
              />
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE CAMPUS MAP */}
        {activeTab === 'map' && (
          <CampusMap
            items={items}
            selectedLocationId={mapSelectedLocationId}
            onSelectLocation={(locId) => setMapSelectedLocationId(locId)}
            onClaimItem={(item) => setClaimingItem(item)}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        )}

        {/* TAB 3: SMART AUTO-MATCHES VIEW */}
        {activeTab === 'matches' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Automated Cross-Match Portal</h2>
                  <p className="text-xs text-slate-500">
                    Comparing reported lost items against custody catalog using fuzzy similarity and proximity
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500 text-white shadow-xs">
                {matches.length} Candidates Available
              </span>
            </div>

            {/* Smart Matches embedded list */}
            <div className="bg-slate-100/60 p-6 rounded-3xl border border-slate-200/80">
              <button
                onClick={() => {
                  setSelectedLostItemForMatch(null);
                  setIsSmartMatchOpen(true);
                }}
                className="w-full py-4 text-center rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Open Full Auto-Match Comparison Drawer</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: GOOD SAMARITAN KARMA LEADERBOARD */}
        {activeTab === 'leaderboard' && <LeaderboardView />}
      </main>

      {/* Floating Smart Match Drawer (accessible from everywhere) */}
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

      {/* Post Item Modal (Step 2) */}
      <PostItemModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleCreateItem}
      />

      {/* Security Claim Modal (Step 3) */}
      <ClaimModal
        isOpen={!!claimingItem}
        onClose={() => setClaimingItem(null)}
        item={claimingItem}
        onSuccessClaim={handleSuccessClaim}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
