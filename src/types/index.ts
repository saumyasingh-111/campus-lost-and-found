export type ItemType = 'lost' | 'found';
export type ItemStatus = 'lost' | 'found' | 'reunited';
export type ItemCategory =
  | 'electronics'
  | 'id_cards'
  | 'keys'
  | 'bags'
  | 'books'
  | 'clothing'
  | 'accessories'
  | 'other';

export interface TimelineEvent {
  id: string;
  date: string; // e.g., '04 Oct' or ISO
  time?: string;
  title: string;
  location?: string;
  actor?: string;
  note?: string;
}

export interface PrivateClue {
  type: 'serial' | 'scratch' | 'sticker' | 'engraving' | 'wallpaper' | 'contents' | 'other';
  question: string;
  answer: string;
  hint?: string;
}

export interface SafeHandoff {
  code: string; // e.g. "739 214"
  pickupLocation: string; // e.g. "Dr. APJ Abdul Kalam Central Library Help Desk"
  status: 'pending' | 'ready' | 'completed';
  expiresAt?: string;
  notes?: string;
}

export interface TrustBadge {
  status: 'in_safe_custody' | 'staff_verified' | 'finder_held';
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface Item {
  id: string;
  passportId: string; // e.g. "CR-2026-01482"
  type: ItemType;
  title: string;
  description: string;
  category: ItemCategory;
  locationId: string;
  locationName: string;
  dateReported: string; // ISO string
  status: ItemStatus;
  imageUrl: string;
  tags: string[];
  reporter: {
    name: string;
    email: string;
    role: 'Student' | 'Faculty' | 'Staff' | 'Visitor';
    avatar: string;
    phone?: string;
  };
  secretVerification: {
    hintQuestion: string;
    secretAnswer: string;
  };
  privateClues?: PrivateClue;
  safeHandoff?: SafeHandoff;
  trustBadge?: TrustBadge;
  timeline?: TimelineEvent[];
  reward?: string;
  matchedItemId?: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  code: string;
  description: string;
  category: 'Academic' | 'Student Life' | 'Athletics' | 'Services' | 'Residence';
  coordinates: {
    lat: number;
    lng: number;
    x?: number; // fallback percentage
    y?: number;
  };
  safeZone: boolean;
  lostCount?: number;
  foundCount?: number;
}

export interface KarmaUser {
  id: string;
  name: string;
  avatar: string;
  role: string;
  points: number;
  itemsReturned: number;
  streakDays: number;
  badges: {
    id: string;
    name: string;
    icon: string;
    description: string;
    color?: string;
  }[];
  recentActivity: {
    id: string;
    action: string;
    itemTitle: string;
    timeAgo: string;
    pointsEarned: number;
  }[];
}

export interface AutoMatchPair {
  lostItem: Item;
  foundItem: Item;
  score: number; // 0 - 100
  reasons: string[];
  confidence: 'High' | 'Medium' | 'Low';
}

export interface ClaimSubmission {
  itemId: string;
  claimantName: string;
  claimantEmail: string;
  claimantPhone: string;
  answerHint: string;
  additionalProof: string;
}
