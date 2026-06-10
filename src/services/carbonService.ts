import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  increment, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { CarbonLog, UserProfile } from "../types";
import { POINTS_PER_LOG, CACHE_KEYS, CACHE_TTL } from "../constants";

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();

class CarbonService {
  private getCache<T>(key: string): T | null {
    const item = cache.get(key);
    if (item && Date.now() - item.timestamp < CACHE_TTL) {
      return item.data as T;
    }
    
    // Fallback to LocalStorage for persistence across reloads
    const persisted = localStorage.getItem(key);
    if (persisted) {
      const { data, timestamp } = JSON.parse(persisted);
      if (Date.now() - timestamp < CACHE_TTL * 2) { // Allow longer TTL for storage
        cache.set(key, { data, timestamp });
        return data as T;
      }
    }
    return null;
  }

  private setCache(key: string, data: any) {
    const cacheItem = { data, timestamp: Date.now() };
    cache.set(key, cacheItem);
    try {
      localStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (e) {
      console.warn("Storage cache failed", e);
    }
  }

  private invalidateCache(prefix: string) {
    const keys = Array.from(cache.keys());
    keys.filter(k => k.startsWith(prefix)).forEach(k => {
      cache.delete(k);
      localStorage.removeItem(k);
    });
  }

  async logActivity(userId: string, data: Omit<CarbonLog, 'id' | 'userId' | 'date'>) {
    const logData = {
      ...data,
      userId,
      date: Date.now(),
    };

    const logRef = await addDoc(collection(db, "logs"), logData);
    
    await updateDoc(doc(db, "users", userId), {
      carbonScore: increment(data.carbonEmittedKg),
      ecoPoints: increment(POINTS_PER_LOG),
      updatedAt: Date.now()
    });

    this.invalidateCache(CACHE_KEYS.LOGS + userId);
    this.invalidateCache(CACHE_KEYS.LEADERBOARD);
    
    return { id: logRef.id, ...logData };
  }

  async getUserLogs(userId: string, daysLimit?: number) {
    const cacheKey = CACHE_KEYS.LOGS + userId + "_" + (daysLimit || 'all');
    const cached = this.getCache<CarbonLog[]>(cacheKey);
    if (cached) return cached;

    let q = query(
      collection(db, "logs"),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );

    if (daysLimit) {
      const cutoff = Date.now() - (daysLimit * 24 * 60 * 60 * 1000);
      q = query(q, where("date", ">=", cutoff));
    }

    const snapshot = await getDocs(q);
    const result = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CarbonLog));
    this.setCache(cacheKey, result);
    return result;
  }

  async getLeaderboard(limitCount = 10) {
    const cacheKey = CACHE_KEYS.LEADERBOARD + limitCount;
    const cached = this.getCache<UserProfile[]>(cacheKey);
    if (cached) return cached;

    const q = query(
      collection(db, "users"),
      orderBy("ecoPoints", "desc"),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    const result = snapshot.docs.map(doc => doc.data() as UserProfile);
    this.setCache(cacheKey, result);
    return result;
  }
}

export const carbonService = new CarbonService();
