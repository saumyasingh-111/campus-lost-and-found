export interface Item {
  id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  category: 'electronics' | 'id_cards' | 'keys' | 'bags' | 'books' | 'clothing' | 'accessories' | 'other';
  locationId: string;
  locationName: string;
  dateReported: string; // ISO string
  status: 'lost' | 'found' | 'reunited';
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
    secretAnswer: string; // Used for claim verification
  };
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
    x: number; // percentage on SVG grid (0 - 100)
    y: number; // percentage on SVG grid (0 - 100)
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
    color: string;
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
