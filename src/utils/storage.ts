import { Item } from '../types';
import { INITIAL_ITEMS } from '../data/initialItems';

const STORAGE_KEY = 'campus_reunite_items_v3';

export function loadStoredItems(): Item[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ITEMS));
      return INITIAL_ITEMS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure any legacy parsed items have passportId
      return parsed.map((item: any, idx: number) => ({
        ...item,
        passportId: item.passportId || `CR-2026-${String(idx + 1400).padStart(5, '0')}`,
        timeline: item.timeline || [
          {
            id: `t-migrated-${idx}`,
            date: '04 Oct',
            time: '12:00',
            title: `Item registered as ${item.status}`,
            location: item.locationName,
          },
        ],
      }));
    }
    return INITIAL_ITEMS;
  } catch (e) {
    console.error('Failed to parse stored items, returning initial items', e);
    return INITIAL_ITEMS;
  }
}

export function saveStoredItems(items: Item[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save items to localStorage', e);
  }
}
