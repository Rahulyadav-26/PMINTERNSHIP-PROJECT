import { Internship, Preferences, Recommendation, RecommendationExplanation } from '@/types/student';
import { normalizeSkillsList } from '@/lib/skillsMap';

function jaccard(a: Set<string>, b: Set<string>): number {
  const inter = new Set([...a].filter(x => b.has(x))).size;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : inter / union;
}

export interface MatchConfig {
  weights: { req: number; pref: number; loc: number; sector: number; modality: number };
  requireAllRequiredSkills?: boolean; // gate out internships missing any required skills
  deadlineFilter?: boolean;           // filter out past-deadline internships
  capacityFilter?: boolean;           // filter out internships with no capacity
  preferencePenaltyWeight?: number;   // penalty factor for preference mismatches (0..1)
  boostEmbedding?: boolean;           // future use
  embeddingBoostWeight?: number;      // future use
}

export const DEFAULT_MATCH_CONFIG: MatchConfig = {
  weights: { req: 0.45, pref: 0.2, loc: 0.15, sector: 0.1, modality: 0.1 },
  requireAllRequiredSkills: false,
  deadlineFilter: true,
  capacityFilter: true,
  preferencePenaltyWeight: 0.15,
  boostEmbedding: false,
  embeddingBoostWeight: 0.05,
};

export function scoreInternship(
  candidateSkills: string[],
  prefs: Preferences,
  internship: Internship,
  config: MatchConfig = DEFAULT_MATCH_CONFIG
): Recommendation {
  // Normalize skills for softer matching
  const skillsNorm = new Set(normalizeSkillsList(candidateSkills));
  const reqNorm = new Set(normalizeSkillsList(internship.requiredSkills || []));
  const prefNorm = new Set(normalizeSkillsList(internship.preferredSkills || []));

  const reqOverlap = new Set([...skillsNorm].filter(s => reqNorm.has(s))).size;
  const reqCoverage = reqNorm.size === 0 ? 1 : reqOverlap / reqNorm.size; // 0..1

  const prefOverlap = new Set([...skillsNorm].filter(s => prefNorm.has(s))).size;
  const prefCoverage = prefNorm.size === 0 ? 0 : prefOverlap / prefNorm.size; // 0..1

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

  // Weighted score with optional mismatch penalties
  const w = config.weights;
  let raw = w.req * reqCoverage + w.pref * prefCoverage + w.loc * locMatch + w.sector * sectorMatch + w.modality * modalityMatch;

  // Penalty for strong preference mismatch
  const penaltyFactor = Math.max(0, Math.min(1, config.preferencePenaltyWeight ?? 0));
  if (prefs.locations.length > 0 && locMatch === 0) raw -= penaltyFactor * w.loc;
  if (prefs.modality !== 'any' && modalityMatch === 0) raw -= penaltyFactor * w.modality;

  // Clamp 0..1
  raw = Math.max(0, Math.min(1, raw));

  const explanations: RecommendationExplanation[] = [];
  if (reqOverlap > 0) explanations.push({ reason: `Required skills match: ${reqOverlap}/${reqNorm.size}`, weight: Number((w.req * reqCoverage).toFixed(3)), kind: 'skill' });
  if (prefOverlap > 0) explanations.push({ reason: `Preferred skills match: ${prefOverlap}/${prefNorm.size}`, weight: Number((w.pref * prefCoverage).toFixed(3)), kind: 'skill' });
  explanations.push({ reason: `Location ${locMatch ? 'matches' : 'does not match'} preferences`, weight: Number((w.loc * locMatch).toFixed(3)), kind: 'location' });
  explanations.push({ reason: `Sector ${sectorMatch ? 'matches' : 'does not match'} preferences`, weight: Number((w.sector * sectorMatch).toFixed(3)), kind: 'sector' });
  explanations.push({ reason: `Modality ${modalityMatch ? 'aligns' : 'does not align'} with preference`, weight: Number((w.modality * modalityMatch).toFixed(3)), kind: 'modality' });

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

export function rankInternships(candidateSkills: string[], prefs: Preferences, internships: Internship[], topN = 10, filters?: MatchFilters, config: MatchConfig = DEFAULT_MATCH_CONFIG): Recommendation[] {
  let pool = internships;
  const now = Date.now();

  // Built-in filters (deadline, capacity)
  if (config.deadlineFilter || config.capacityFilter) {
    pool = pool.filter(i => {
      if (config.capacityFilter && typeof i.capacity === 'number' && i.capacity <= 0) return false;
      if (config.deadlineFilter && i.applicationDeadline) {
        const dl = new Date(i.applicationDeadline).getTime();
        if (!isNaN(dl) && dl < now) return false;
      }
      return true;
    });
  }

  // User filters
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

  // Required skill gating (optional)
  if (config.requireAllRequiredSkills) {
    const cand = new Set(normalizeSkillsList(candidateSkills));
    pool = pool.filter(i => {
      const req = new Set(normalizeSkillsList(i.requiredSkills || []));
      for (const r of req) { if (!cand.has(r)) return false; }
      return true;
    });
  }

  return pool
    .map(int => scoreInternship(candidateSkills, prefs, int, config))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}
