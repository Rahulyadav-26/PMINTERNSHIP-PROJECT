export type UserRole = 'student' | 'admin' | 'ministry';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface Student extends User {
  role: 'student';
  enrollmentId: string;
  university: string;
  course: string;
  year: number;
  skills: string[];
  resume?: string;
  profileStrength: number;
  preferences: InternshipPreferences;
  allocation?: AllocationResult;
}

export interface InternshipPreferences {
  domains: string[];
  locations: string[];
  duration: number;
}

export interface AllocationResult {
  internshipId: string;
  companyName: string;
  domain: string;
  location: string;
  matchScore: number;
  reasonExplanation: string;
  allocatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}