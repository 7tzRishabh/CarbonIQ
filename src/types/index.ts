import { User as FirebaseUser } from "firebase/auth";
import { LucideIcon } from "lucide-react";

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  carbonScore: number;
  ecoPoints: number;
  monthlyGoal?: number;
  createdAt: number;
  updatedAt: number;
}

export interface CarbonInsight {
  id: string;
  type: 'tip' | 'warning' | 'achievement';
  text: string;
  action?: string;
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
  icon: LucideIcon;
  unit: string;
  multiplier: number;
  target: number;
  color: string;
}

export interface CoachResponse {
  text: string;
  error?: string;
}

export interface Challenge {
  title: string;
  points: number;
  progress: number;
  total: number;
  label: string;
}

export interface CategoryBarProps {
  icon: LucideIcon;
  color: string;
  name: string;
  value: number;
  target: number;
}
