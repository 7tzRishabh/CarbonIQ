import { User as FirebaseUser } from "firebase/auth";

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  carbonScore: number;
  ecoPoints: number;
  createdAt: number;
  updatedAt: number;
}

export interface AuthState {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  ecoPoints: number;
}

export interface CarbonLog {
  id: string;
  userId: string;
  category: string;
  value: number;
  carbonEmittedKg: number;
  date: number;
  notes?: string;
}

export interface CarbonCategory {
  id: string;
  name: string;
  icon: any;
  unit: string;
  multiplier: number;
  target: number;
  color: string;
}

export interface CoachResponse {
  text: string;
  error?: string;
}
