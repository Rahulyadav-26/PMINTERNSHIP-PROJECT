import { Internship, Preferences, Recommendation, RecommendationExplanation } from '@/types/student';

function jaccard(a: Set<string>, b: Set<string>): number {
  const inter = new Set([...a].filter(x => b.has(x))).size;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : inter / union;
}

export function scoreInternship(
  candidateSkills: string[],
  prefs: Preferences,
  internship: Internship
): Recommendation {
  const skillsLower = new Set(candidateSkills.map(s => s.toLowerCase()));
  const reqLower = new Set(internship.requiredSkills.map(s => s.toLowerCase()));
  const prefLower = new Set(internship.preferredSkills.map(s => s.toLowerCase()));

  const reqOverlap = new Set([...skillsLower].filter(s => reqLower.has(s))).size;
  const reqCoverage = reqLower.size === 0 ? 1 : reqOverlap / reqLower.size; // 0..1

  const prefOverlap = new Set([...skillsLower].filter(s => prefLower.has(s))).size;
  const prefCoverage = prefLower.size === 0 ? 0 : prefOverlap / prefLower.size; // 0..1

  const locMatch = prefs.locations.length === 0
    ? 0.5
    : internship.locations.some(loc => prefs.locations.includes(loc)) ? 1 : 0;

  const sectorMatch = prefs.sectors.length === 0
    ? 0.5
    : (prefs.sectors.includes(internship.sector) ? 1 : 0);

  const modalityMatch = prefs.modality === 'any'
    ? 0.5
    : (prefs.modality === internship.modality || (prefs.modality === 'remote' && internship.modality === 'hybrid') || (prefs.modality === 'onsite' && internship.modality === 'hybrid'))
      ? 1 : 0;

  // Weighted score
  const w = { req: 0.45, pref: 0.2, loc: 0.15, sector: 0.1, modality: 0.1 };
  const raw = w.req * reqCoverage + w.pref * prefCoverage + w.loc * locMatch + w.sector * sectorMatch + w.modality * modalityMatch;

  const explanations: RecommendationExplanation[] = [];
  if (reqOverlap > 0) explanations.push({ reason: `Required skills match: ${reqOverlap}/${reqLower.size}` , weight: w.req * reqCoverage });
  if (prefOverlap > 0) explanations.push({ reason: `Preferred skills match: ${prefOverlap}/${prefLower.size}`, weight: w.pref * prefCoverage });
  explanations.push({ reason: `Location ${locMatch ? 'matches' : 'does not match'} preferences`, weight: w.loc * locMatch });
  explanations.push({ reason: `Sector ${sectorMatch ? 'matches' : 'does not match'} preferences`, weight: w.sector * sectorMatch });
  explanations.push({ reason: `Modality ${modalityMatch ? 'aligns' : 'does not align'} with preference`, weight: w.modality * modalityMatch });

  return {
    internship,
    score: Number(raw.toFixed(3)),
    explanations: explanations.sort((a,b) => (b.weight || 0) - (a.weight || 0)).slice(0,3),
  };
}

export interface MatchFilters {
  location?: string;
  sector?: string;
  modality?: 'remote' | 'onsite' | 'hybrid' | 'any';
  minStipend?: number;
  minDurationWeeks?: number;
}

export function rankInternships(candidateSkills: string[], prefs: Preferences, internships: Internship[], topN = 10, filters?: MatchFilters): Recommendation[] {
  let pool = internships;
  if (filters) {
    pool = pool.filter(i => {
      if (filters.location && !i.locations.includes(filters.location)) return false;
      if (filters.sector && i.sector !== filters.sector) return false;
      if (filters.modality && filters.modality !== 'any' && i.modality !== filters.modality) return false;
      if (typeof filters.minStipend === 'number' && typeof i.stipendMin === 'number' && i.stipendMin < filters.minStipend) return false;
      if (typeof filters.minDurationWeeks === 'number' && typeof i.durationWeeks === 'number' && i.durationWeeks < filters.minDurationWeeks) return false;
      return true;
    });
  }
  return pool
    .map(int => scoreInternship(candidateSkills, prefs, int))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}
