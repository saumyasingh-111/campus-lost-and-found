import { Item, AutoMatchPair } from '../types';

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'in', 'on', 'at', 'with', 'and', 'or', 'for', 'of',
  'has', 'have', 'had', 'near', 'from', 'to', 'by', 'is', 'it', 'this',
  'that', 'these', 'those', 'left', 'lost', 'found', 'misplaced', 'under',
  'over', 'beside', 'next', 'some', 'any', 'my', 'your', 'our', 'all'
]);

function extractKeywords(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2 && !STOP_WORDS.has(word))
  );
}

function calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersectionCount = 0;
  for (const item of setA) {
    if (setB.has(item)) {
      intersectionCount++;
    }
  }
  const unionCount = new Set([...setA, ...setB]).size;
  return unionCount === 0 ? 0 : intersectionCount / unionCount;
}

export function computeAutoMatches(items: Item[]): AutoMatchPair[] {
  const lostItems = items.filter((i) => i.status === 'lost');
  const foundItems = items.filter((i) => i.status === 'found');
  const pairs: AutoMatchPair[] = [];

  for (const lost of lostItems) {
    for (const found of foundItems) {
      let score = 0;
      const reasons: string[] = [];

      // 1. Category Matching (Weight: 30 pts)
      if (lost.category === found.category) {
        score += 30;
        reasons.push(`Matching category: ${lost.category.replace('_', ' ').toUpperCase()}`);
      }

      // 2. Keyword & Token Matching (Weight: up to 35 pts)
      const lostTokens = extractKeywords(`${lost.title} ${lost.tags.join(' ')} ${lost.description}`);
      const foundTokens = extractKeywords(`${found.title} ${found.tags.join(' ')} ${found.description}`);
      
      const sharedWords: string[] = [];
      for (const token of lostTokens) {
        if (foundTokens.has(token)) {
          sharedWords.push(token);
        }
      }

      if (sharedWords.length > 0) {
        const jaccard = calculateJaccardSimilarity(lostTokens, foundTokens);
        const textScore = Math.min(35, Math.round(jaccard * 50 + sharedWords.length * 6));
        score += textScore;
        reasons.push(`Shared keywords: ${sharedWords.slice(0, 4).join(', ')}`);
      }

      // 3. Location Proximity (Weight: up to 25 pts)
      if (lost.locationId === found.locationId) {
        score += 25;
        reasons.push(`Same campus zone: ${lost.locationName}`);
      } else {
        // Partial proximity heuristic if both are library / central
        const lName = lost.locationName.toLowerCase();
        const fName = found.locationName.toLowerCase();
        if ((lName.includes('library') && fName.includes('library')) ||
            (lName.includes('union') && fName.includes('union'))) {
          score += 15;
          reasons.push(`Adjacent campus sector match`);
        }
      }

      // 4. Temporal Proximity (Weight: up to 10 pts)
      const timeDiffMs = Math.abs(
        new Date(lost.dateReported).getTime() - new Date(found.dateReported).getTime()
      );
      const hoursDiff = timeDiffMs / (1000 * 60 * 60);
      if (hoursDiff <= 12) {
        score += 10;
        reasons.push(`Reported within ${Math.round(hoursDiff)} hours of each other`);
      } else if (hoursDiff <= 48) {
        score += 6;
        reasons.push(`Reported within 2 days of each other`);
      }

      // Cap at 99% unless verified
      score = Math.min(score, 98);

      if (score >= 40) {
        let confidence: 'High' | 'Medium' | 'Low' = 'Low';
        if (score >= 70) confidence = 'High';
        else if (score >= 50) confidence = 'Medium';

        pairs.push({
          lostItem: lost,
          foundItem: found,
          score,
          reasons,
          confidence,
        });
      }
    }
  }

  // Sort by highest score first
  return pairs.sort((a, b) => b.score - a.score);
}
