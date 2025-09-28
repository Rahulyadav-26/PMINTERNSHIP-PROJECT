import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { Application, ApplicationFormData, ApplicationStatus, Consent, Internship, Offer, Preferences, Recommendation, StudentProfile, StudentState } from '@/types/student';
import { SAMPLE_INTERNSHIPS } from '@/lib/sampleData';
import { rankInternships } from '@/lib/matching';
import { SKILLS } from '@/lib/skills';
import { useAuth } from './AuthContext';
import { formatRemaining, notify, timeRemaining } from '@/lib/utils';

interface StudentContextType extends StudentState {
  setProfile: (updates: Partial<StudentProfile>) => void;
  setPreferences: (updates: Partial<Preferences>) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  setSkills: (skills: string[]) => void;
  addCertification: (cert: string) => void;
  removeCertification: (cert: string) => void;
  setConsent: (updates: Partial<Consent>) => void;
  uploadResume: (file: File) => Promise<void>;
  extractSkillsFromText: (text: string) => string[];
  getRecommendations: (topN?: number, filters?: any) => Recommendation[];
  applyToInternship: (internship: Internship, formData?: ApplicationFormData) => void;
  applyBulk: (internshipIds: string[], formData?: ApplicationFormData) => void;
  withdrawApplication: (applicationId: string) => void;
  simulateOffer: (applicationId: string) => void;
  acceptOffer: (applicationId: string) => void;
  declineOffer: (applicationId: string) => void;
  toggleSave: (internshipId: string) => void;
  isSaved: (internshipId: string) => boolean;
  submitFeedback: (applicationId: string, internshipId: string, rating: number, comment?: string) => void;
  updateApplicationStatus: (applicationId: string, status: ApplicationStatus) => void;
  saveDraft: (internshipId: string, form: ApplicationFormData) => void;
  loadDraft: (internshipId: string) => ApplicationFormData | null;
  deleteDraft: (internshipId: string) => void;
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
  | { type: 'SET_OFFERS'; payload: Offer[] }
  | { type: 'TOGGLE_SAVE'; payload: string }
  | { type: 'ADD_FEEDBACK'; payload: { id: string; applicationId: string; internshipId: string; rating: number; comment?: string; createdAt: string } }
  | { type: 'SET_DRAFTS'; payload: NonNullable<StudentState['drafts']> };

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
    case 'TOGGLE_SAVE': {
      const set = new Set(state.savedInternshipIds);
      if (set.has(action.payload)) set.delete(action.payload); else set.add(action.payload);
      return { ...state, savedInternshipIds: Array.from(set) };
    }
    case 'ADD_FEEDBACK':
      return { ...state, feedbacks: [action.payload, ...state.feedbacks] };
    case 'SET_DRAFTS':
      return { ...state, drafts: action.payload };
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

function scheduleDeadlineToasts(student: StudentState) {
  // Notify for drafts or saved internships approaching deadlines within 48h and 4h
  const targets = new Set<string>();
  (student.savedInternshipIds || []).forEach(id => targets.add(id));
  (student.drafts || []).forEach(d => targets.add(d.internshipId));
  student.applications.filter(a => a.status === 'applied').forEach(a => targets.add(a.internshipId));

  const byId = Object.fromEntries(SAMPLE_INTERNSHIPS.map(i => [i.id, i]));

  targets.forEach(id => {
    const intn = byId[id];
    if (!intn?.applicationDeadline) return;
    const d = new Date(intn.applicationDeadline).getTime();
    const now = Date.now();
    const in48h = d - 48 * 3600 * 1000;
    const in4h = d - 4 * 3600 * 1000;

    if (in48h > now) setTimeout(() => notify('Deadline in 48 hours', `${intn.title}: ${formatRemaining(intn.applicationDeadline)} left`), in48h - now);
    if (in4h > now) setTimeout(() => notify('Deadline in 4 hours', `${intn.title}: ${formatRemaining(intn.applicationDeadline)} left`), in4h - now);
  });
}

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, {
    profile: null,
    preferences: defaultPrefs,
    consent: defaultConsent,
    applications: [],
    offers: [],
    savedInternshipIds: [],
    feedbacks: [],
    drafts: [],
  });

  useEffect(() => {
    if (!user) return;
    const existing = loadState(user.id);
    if (existing) {
      // Hydrate missing fields for backward compatibility
      const hydrated: StudentState = {
        profile: existing.profile ?? null,
        preferences: existing.preferences ?? defaultPrefs,
        consent: existing.consent ?? defaultConsent,
        applications: existing.applications ?? [],
        offers: existing.offers ?? [],
        savedInternshipIds: existing.savedInternshipIds ?? [],
        feedbacks: existing.feedbacks ?? [],
        drafts: existing.drafts ?? [],
      };
      dispatch({ type: 'INIT', payload: hydrated });
      scheduleDeadlineToasts(hydrated);
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
      const initial: StudentState = { profile, preferences: defaultPrefs, consent: defaultConsent, applications: [], offers: [], savedInternshipIds: [], feedbacks: [], drafts: [] };
      dispatch({ type: 'INIT', payload: initial });
      scheduleDeadlineToasts(initial);
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
    addCertification: (cert) => {
      if (!state.profile) return;
      const list = Array.from(new Set([...(state.profile.certifications || []), cert]));
      dispatch({ type: 'SET_PROFILE', payload: { certifications: list } });
    },
    removeCertification: (cert) => {
      if (!state.profile) return;
      const list = (state.profile.certifications || []).filter(c => c !== cert);
      dispatch({ type: 'SET_PROFILE', payload: { certifications: list } });
    },
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
    getRecommendations: (topN = 10, filters?: any) => {
      const skills = state.profile?.skills || [];
      return rankInternships(skills, state.preferences, SAMPLE_INTERNSHIPS, topN, filters);
    },
    applyToInternship: (internship: Internship, formData?: ApplicationFormData) => {
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
        formData,
        createdAt: now(),
        updatedAt: now(),
      };
      dispatch({ type: 'ADD_APP', payload: app });
      notify('Application submitted', `${internship.title} • ${internship.organization}`);
      // remove draft if exists
      const drafts = state.drafts || [];
      const nextDrafts = drafts.filter(d => d.internshipId !== internship.id);
      if (drafts.length !== nextDrafts.length) dispatch({ type: 'SET_DRAFTS', payload: nextDrafts });
    },
    applyBulk: (internshipIds: string[], formData?: ApplicationFormData) => {
      if (!state.profile) return;
      const byId = Object.fromEntries(SAMPLE_INTERNSHIPS.map(i => [i.id, i]));
      internshipIds.forEach(id => {
        const intn = byId[id];
        if (!intn) return;
        const exists = state.applications.some(a => a.internshipId === id);
        if (exists) return;
        const app: Application = {
          id: `app-${Date.now()}-${id}`,
          candidateId: state.profile!.userId,
          internshipId: id,
          status: 'applied',
          timeline: [{ status: 'applied', at: now() }],
          formData,
          createdAt: now(),
          updatedAt: now(),
        };
        dispatch({ type: 'ADD_APP', payload: app });
      });
      notify('Bulk application submitted', `${internshipIds.length} opportunities applied`);
      const drafts = state.drafts || [];
      const nextDrafts = drafts.filter(d => !internshipIds.includes(d.internshipId));
      if (drafts.length !== nextDrafts.length) dispatch({ type: 'SET_DRAFTS', payload: nextDrafts });
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
      const intn = SAMPLE_INTERNSHIPS.find(i => i.id === app.internshipId);
      notify('Application withdrawn', intn ? `${intn.title}` : undefined);
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
      const intn = SAMPLE_INTERNSHIPS.find(i => i.id === app.internshipId);
      notify('Offer received', intn ? `${intn.title}` : undefined);
    },
    toggleSave: (internshipId: string) => dispatch({ type: 'TOGGLE_SAVE', payload: internshipId }),
    isSaved: (internshipId: string) => state.savedInternshipIds.includes(internshipId),
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
      const intn = SAMPLE_INTERNSHIPS.find(i => i.id === app.internshipId);
      notify('Offer accepted', intn ? `${intn.title}` : undefined);
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
      const intn = SAMPLE_INTERNSHIPS.find(i => i.id === app.internshipId);
      notify('Offer declined', intn ? `${intn.title}` : undefined);
    },
    submitFeedback: (applicationId, internshipId, rating, comment) => {
      const entry = { id: `fb-${Date.now()}`, applicationId, internshipId, rating, comment, createdAt: now() };
      dispatch({ type: 'ADD_FEEDBACK', payload: entry });
    },
    updateApplicationStatus: (applicationId, status) => {
      const app = state.applications.find(a => a.id === applicationId);
      if (!app) return;
      const updated: Application = { ...app, status, timeline: [...app.timeline, { status, at: now() }], updatedAt: now() };
      dispatch({ type: 'UPDATE_APP', payload: updated });
      const intn = SAMPLE_INTERNSHIPS.find(i => i.id === app.internshipId);
      notify(`Status updated: ${status}`, intn ? `${intn.title}` : undefined);
    },
    saveDraft: (internshipId, form) => {
      if (!state.profile) return;
      const drafts = state.drafts || [];
      const idx = drafts.findIndex(d => d.internshipId === internshipId);
      const draft = { id: `draft-${Date.now()}`, candidateId: state.profile.userId, internshipId, form, lastSavedAt: now() };
      const next = idx >= 0 ? drafts.map((d, i) => (i === idx ? { ...draft, id: drafts[i].id } : d)) : [draft, ...drafts];
      dispatch({ type: 'SET_DRAFTS', payload: next });
    },
    loadDraft: (internshipId) => {
      const d = (state.drafts || []).find(x => x.internshipId === internshipId);
      return d ? d.form : null;
    },
    deleteDraft: (internshipId) => {
      const next = (state.drafts || []).filter(d => d.internshipId !== internshipId);
      dispatch({ type: 'SET_DRAFTS', payload: next });
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