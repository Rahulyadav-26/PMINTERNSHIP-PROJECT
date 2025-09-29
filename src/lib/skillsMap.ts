// Canonical mapping for skill normalization and simple alias matching.
// Keep this small and safe for the prototype; expand as needed.
export const SKILL_ALIASES: Record<string, string[]> = {
  "javascript": ["js", "java script", "ecmascript"],
  "typescript": ["ts"],
  "react": ["react.js", "reactjs", "react js"],
  "node.js": ["node", "nodejs", "node js"],
  "html": ["html5"],
  "css": ["css3"],
  "tailwind css": ["tailwind", "tailwindcss"],
  "python": ["py"],
  "pandas": ["pd"],
  "numpy": ["np"],
  "machine learning": ["ml"],
  "nlp": ["natural language processing"],
  "sql": ["postgresql", "mysql", "mssql", "sqlite"],
  "docker": ["containerization"],
  "aws": ["amazon web services"],
};

// Normalize a single token to canonical form using alias map
export function normalizeSkillToken(token: string): string {
  const t = token.trim().toLowerCase();
  // direct canonical
  if (SKILL_ALIASES[t]) return t;
  // alias match
  for (const [canon, aliases] of Object.entries(SKILL_ALIASES)) {
    if (canon === t) return canon;
    if (aliases.some(a => a === t)) return canon;
  }
  return t; // return as-is if not found
}

// Normalize a set/list of skills (strings with optional punctuation/spacing)
export function normalizeSkillsList(list: string[]): string[] {
  // Strip punctuation minimally, collapse whitespace
  const cleaned = list
    .map(s => s.replace(/[._]/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  const mapped = cleaned.map(normalizeSkillToken);
  return Array.from(new Set(mapped));
}
