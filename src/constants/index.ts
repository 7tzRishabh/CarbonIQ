import { Car, Zap, Utensils, Droplets } from "lucide-react";
import { CarbonCategory } from "../types";

export const APP_NAME = "CarbonIQ";

export const CARBON_CATEGORIES: CarbonCategory[] = [
  { 
    id: "transportation", 
    name: "Transport", 
    icon: Car, 
    unit: "km driven", 
    multiplier: 0.192,
    target: 50,
    color: "bg-blue-500"
  },
  { 
    id: "electricity", 
    name: "Energy", 
    icon: Zap, 
    unit: "kWh", 
    multiplier: 0.85,
    target: 60,
    color: "bg-yellow-500"
  },
  { 
    id: "food", 
    name: "Food", 
    icon: Utensils, 
    unit: "kg of meat", 
    multiplier: 15.0,
    target: 40,
    color: "bg-orange-500"
  },
  {
    id: "other",
    name: "Other",
    icon: Droplets,
    unit: "unit",
    multiplier: 1.0,
    target: 20,
    color: "bg-cyan-500"
  }
];

export const POINTS_PER_LOG = 10;

export const CACHE_KEYS = {
  LOGS: 'logs_',
  LEADERBOARD: 'leaderboard_',
} as const;

export const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const DASHBOARD_STATS = {
  TREND_DAYS: 7,
  INSIGHT_DAYS: 30,
} as const;
