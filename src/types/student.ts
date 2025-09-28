// Domain types for Student/Applicant features

export type Role = 'student' | 'admin' | 'ministry';

export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  university?: string;
  course?: string;
  year?: string; // e.g., '1st Year', '2nd Year', etc.
  gpa?: number; // 0-10 or 0-4 scale depending on UI
  graduationYear?: number;
  enrollmentId?: string;
  skills: string[];
  resumeUrl?: string; // object URL or remote URL
  resumeName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Preferences {
  locations: string[];
  sectors: string[];
  modality: 'remote' | 'onsite' | 'hybrid' | 'any';
  availabilityStart?: string; // ISO date
  availabilityEnd?: string;   // ISO date
  minStipend?: number;
}

export type SocialCategory = 'SC' | 'ST' | 'OBC' | 'General' | 'EWS' | null;

export interface Consent {
  shareSensitive: boolean; // overall consent toggle
  rural: boolean;          // from rural/aspirational district
  category: SocialCategory;
  disability: boolean;
  agreedAt?: string;       // ISO datetime when consent captured
}

export interface Internship {
  id: string;
  title: string;
  organization: string;
  sector: string;
  locations: string[];
  modality: 'remote' | 'onsite' | 'hybrid';
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  capacity: number;
  stipendMin?: number;
  stipendMax?: number;
}

export type ApplicationStatus =
  | 'applied'
  | 'withdrawn'
  | 'shortlisted'
  | 'interview'
  | 'offer'
  | 'accepted'
  | 'declined'
  | 'rejected';

export interface StatusEntry {
  status: ApplicationStatus;
  at: string; // ISO datetime
}

export interface Application {
  id: string;
  candidateId: string;
  internshipId: string;
  status: ApplicationStatus;
  timeline: StatusEntry[];
  createdAt: string;
  updatedAt: string;
}

export type OfferStatus = 'offered' | 'accepted' | 'declined' | 'expired';

export interface Offer {
  id: string;
  applicationId: string;
  candidateId: string;
  internshipId: string;
  status: OfferStatus;
  offeredAt: string;
  respondedAt?: string;
}

export interface RecommendationExplanation {
  reason: string;      // human-readable
  weight?: number;     // optional numeric contribution
}

export interface Recommendation {
  internship: Internship;
  score: number; // 0..1
  explanations: RecommendationExplanation[];
}

export interface StudentState {
  profile: StudentProfile | null;
  preferences: Preferences;
  consent: Consent;
  applications: Application[];
  offers: Offer[];
}