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
import { POINTS_PER_LOG } from "../constants";

class CarbonService {
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

    return { id: logRef.id, ...logData };
  }

  async getUserLogs(userId: string) {
    const q = query(
      collection(db, "logs"),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CarbonLog));
  }

  async getLeaderboard(limitCount = 10) {
    const q = query(
      collection(db, "users"),
      orderBy("ecoPoints", "desc"),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as UserProfile);
  }
}

export const carbonService = new CarbonService();
