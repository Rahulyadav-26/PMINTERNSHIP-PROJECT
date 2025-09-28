// Domain types for Student/Applicant features

export type Role = 'student' | 'admin' | 'ministry';

export type Gender = 'male' | 'female' | 'nonbinary' | 'prefer_not_to_say';

export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  age?: number;
  gender?: Gender;
  category?: SocialCategory; // SC/ST/OBC/General/EWS
  university?: string;
  course?: string;
  stream?: string;
  year?: string; // e.g., '1st Year', '2nd Year', etc.
  gpa?: number; // 0-10 or 0-4 scale depending on UI
  graduationYear?: number;
  enrollmentId?: string;
  certifications?: string[];
  skills: string[]; // hard + soft combined
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
  homeState?: string;
  city?: string;
  ruralUrban?: 'rural' | 'urban' | 'unspecified';
  willingToRelocate?: boolean;
  minDurationWeeks?: number;
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
  durationWeeks?: number;
  applicationDeadline?: string; // ISO date string for application cutoff
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

export interface ApplicationFormData {
  coverLetter: string;
  preferredStart?: string; // ISO date
}

export interface Application {
  id: string;
  candidateId: string;
  internshipId: string;
  status: ApplicationStatus;
  timeline: StatusEntry[];
  formData?: ApplicationFormData;
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

export interface FeedbackEntry {
  id: string;
  applicationId: string;
  internshipId: string;
  rating: number; // 1..5
  comment?: string;
  createdAt: string;
}

export interface DraftApplication {
  id: string; // draft-<timestamp>
  candidateId: string;
  internshipId: string;
  form: ApplicationFormData;
  lastSavedAt: string; // ISO datetime
}

export interface StudentState {
  profile: StudentProfile | null;
  preferences: Preferences;
  consent: Consent;
  applications: Application[];
  offers: Offer[];
  savedInternshipIds: string[];
  feedbacks: FeedbackEntry[];
  drafts?: DraftApplication[];
}
