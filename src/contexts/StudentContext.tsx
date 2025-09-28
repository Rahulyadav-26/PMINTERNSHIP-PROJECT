import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { Application, ApplicationStatus, Consent, Internship, Offer, Preferences, Recommendation, StudentProfile, StudentState } from '@/types/student';
import { SAMPLE_INTERNSHIPS } from '@/lib/sampleData';
import { rankInternships } from '@/lib/matching';
import { SKILLS } from '@/lib/skills';
import { useAuth } from './AuthContext';

interface StudentContextType extends StudentState {
  setProfile: (updates: Partial<StudentProfile>) => void;
  setPreferences: (updates: Partial<Preferences>) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  setSkills: (skills: string[]) => void;
  setConsent: (updates: Partial<Consent>) => void;
  uploadResume: (file: File) => Promise<void>;
  extractSkillsFromText: (text: string) => string[];
  getRecommendations: (topN?: number) => Recommendation[];
  applyToInternship: (internship: Internship) => void;
  withdrawApplication: (applicationId: string) => void;
  simulateOffer: (applicationId: string) => void;
  acceptOffer: (applicationId: string) => void;
  declineOffer: (applicationId: string) => void;
}

const defaultPrefs: Preferences = {
  locations: [],
  sectors: [],
  modality: 'any',
  minStipend: 0,
};

const defaultConsent: Consent = {
  shareSensitive: false,
  rural: false,
  category: null,
  disability: false,
};

const StudentContext = createContext<StudentContextType | undefined>(undefined);

type Action =
  | { type: 'INIT'; payload: StudentState }
  | { type: 'SET_PROFILE'; payload: Partial<StudentProfile> }
  | { type: 'SET_PREFS'; payload: Partial<Preferences> }
  | { type: 'SET_CONSENT'; payload: Partial<Consent> }
  | { type: 'SET_SKILLS'; payload: string[] }
  | { type: 'ADD_SKILL'; payload: string }
  | { type: 'REMOVE_SKILL'; payload: string }
  | { type: 'ADD_APP'; payload: Application }
  | { type: 'UPDATE_APP'; payload: Application }
  | { type: 'SET_OFFERS'; payload: Offer[] };

function now() { return new Date().toISOString(); }

function reducer(state: StudentState, action: Action): StudentState {
  switch (action.type) {
    case 'INIT':
      return action.payload;
    case 'SET_PROFILE':
      return {
        ...state,
        profile: state.profile ? { ...state.profile, ...action.payload, updatedAt: now() } : null,
      };
    case 'SET_PREFS':
      return { ...state, preferences: { ...state.preferences, ...action.payload } };
    case 'SET_CONSENT':
      return { ...state, consent: { ...state.consent, ...action.payload, agreedAt: now() } };
    case 'SET_SKILLS':
      return state.profile ? { ...state, profile: { ...state.profile, skills: action.payload, updatedAt: now() } } : state;
    case 'ADD_SKILL': {
      if (!state.profile) return state;
      const set = new Set(state.profile.skills);
      set.add(action.payload);
      return { ...state, profile: { ...state.profile, skills: Array.from(set), updatedAt: now() } };
    }
    case 'REMOVE_SKILL': {
      if (!state.profile) return state;
      const next = state.profile.skills.filter(s => s.toLowerCase() !== action.payload.toLowerCase());
      return { ...state, profile: { ...state.profile, skills: next, updatedAt: now() } };
    }
    case 'ADD_APP':
      return { ...state, applications: [action.payload, ...state.applications] };
    case 'UPDATE_APP':
      return { ...state, applications: state.applications.map(a => a.id === action.payload.id ? action.payload : a) };
    case 'SET_OFFERS':
      return { ...state, offers: action.payload };
    default:
      return state;
  }
}

function loadState(userId: string): StudentState | null {
  try {
    const raw = localStorage.getItem(`studentState:${userId}`);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveState(userId: string, state: StudentState) {
  try { localStorage.setItem(`studentState:${userId}`, JSON.stringify(state)); } catch {}
}

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, {
    profile: null,
    preferences: defaultPrefs,
    consent: defaultConsent,
    applications: [],
    offers: [],
  });

  useEffect(() => {
    if (!user) return;
    const existing = loadState(user.id);
    if (existing) {
      dispatch({ type: 'INIT', payload: existing });
    } else {
      const profile: StudentProfile = {
        id: `sp-${user.id}`,
        userId: user.id,
        name: user.name || 'Student',
        email: user.email,
        skills: [],
        createdAt: now(),
        updatedAt: now(),
      };
      dispatch({ type: 'INIT', payload: { profile, preferences: defaultPrefs, consent: defaultConsent, applications: [], offers: [] } });
    }
  }, [user?.id]);

  useEffect(() => {
    if (user && state.profile) {
      saveState(user.id, state);
    }
  }, [state, user?.id]);

  const value: StudentContextType = useMemo(() => ({
    ...state,
    setProfile: (updates) => dispatch({ type: 'SET_PROFILE', payload: updates }),
    setPreferences: (updates) => dispatch({ type: 'SET_PREFS', payload: updates }),
    addSkill: (skill) => dispatch({ type: 'ADD_SKILL', payload: skill }),
    removeSkill: (skill) => dispatch({ type: 'REMOVE_SKILL', payload: skill }),
    setSkills: (skills) => dispatch({ type: 'SET_SKILLS', payload: skills }),
    setConsent: (updates) => dispatch({ type: 'SET_CONSENT', payload: updates }),
    uploadResume: async (file: File) => {
      if (!state.profile) return;
      const url = URL.createObjectURL(file);
      dispatch({ type: 'SET_PROFILE', payload: { resumeUrl: url, resumeName: file.name } });
    },
    extractSkillsFromText: (text: string) => {
      const lower = text.toLowerCase();
      const found = SKILLS.filter(s => lower.includes(s.toLowerCase()));
      return Array.from(new Set(found));
    },
    getRecommendations: (topN = 10) => {
      const skills = state.profile?.skills || [];
      return rankInternships(skills, state.preferences, SAMPLE_INTERNSHIPS, topN);
    },
    applyToInternship: (internship: Internship) => {
      if (!state.profile) return;
      // prevent duplicate application
      const existing = state.applications.find(a => a.internshipId === internship.id);
      if (existing) return;
      const app: Application = {
        id: `app-${Date.now()}`,
        candidateId: state.profile.userId,
        internshipId: internship.id,
        status: 'applied',
        timeline: [{ status: 'applied', at: now() }],
        createdAt: now(),
        updatedAt: now(),
      };
      dispatch({ type: 'ADD_APP', payload: app });
    },
    withdrawApplication: (applicationId: string) => {
      const app = state.applications.find(a => a.id === applicationId);
      if (!app) return;
      const updated: Application = {
        ...app,
        status: 'withdrawn',
        timeline: [...app.timeline, { status: 'withdrawn', at: now() }],
        updatedAt: now(),
      };
      dispatch({ type: 'UPDATE_APP', payload: updated });
    },
    simulateOffer: (applicationId: string) => {
      const app = state.applications.find(a => a.id === applicationId);
      if (!app) return;
      const updated: Application = {
        ...app,
        status: 'offer',
        timeline: [...app.timeline, { status: 'offer', at: now() }],
        updatedAt: now(),
      };
      dispatch({ type: 'UPDATE_APP', payload: updated });
      const offer: Offer = {
        id: `offer-${Date.now()}`,
        applicationId: app.id,
        candidateId: app.candidateId,
        internshipId: app.internshipId,
        status: 'offered',
        offeredAt: now(),
      };
      const nextOffers = [offer, ...state.offers];
      dispatch({ type: 'SET_OFFERS', payload: nextOffers });
    },
    acceptOffer: (applicationId: string) => {
      // prevent double-acceptance
      const anyAccepted = state.offers.some(o => o.status === 'accepted');
      if (anyAccepted) return;
      const app = state.applications.find(a => a.id === applicationId);
      if (!app) return;
      const updatedApp: Application = {
        ...app,
        status: 'accepted',
        timeline: [...app.timeline, { status: 'accepted', at: now() }],
        updatedAt: now(),
      };
      dispatch({ type: 'UPDATE_APP', payload: updatedApp });
      const offers = state.offers.map(o => o.applicationId === applicationId ? { ...o, status: 'accepted', respondedAt: now() } : o);
      dispatch({ type: 'SET_OFFERS', payload: offers });
    },
    declineOffer: (applicationId: string) => {
      const app = state.applications.find(a => a.id === applicationId);
      if (!app) return;
      const updatedApp: Application = {
        ...app,
        status: 'declined',
        timeline: [...app.timeline, { status: 'declined', at: now() }],
        updatedAt: now(),
      };
      dispatch({ type: 'UPDATE_APP', payload: updatedApp });
      const offers = state.offers.map(o => o.applicationId === applicationId ? { ...o, status: 'declined', respondedAt: now() } : o);
      dispatch({ type: 'SET_OFFERS', payload: offers });
    },
  }), [state, user?.id]);

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
};

export function useStudent() {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error('useStudent must be used within StudentProvider');
  return ctx;
}