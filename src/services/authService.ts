import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  User as FirebaseUser
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot 
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { UserProfile } from "../types";

class AuthService {
  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  async logout() {
    return signOut(auth);
  }

  async syncUserProfile(user: FirebaseUser): Promise<UserProfile> {
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || undefined,
        photoURL: user.photoURL || undefined,
        carbonScore: 0,
        ecoPoints: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    }

    return snapshot.data() as UserProfile;
  }

  subscribeToProfile(uid: string, callback: (profile: UserProfile) => void) {
    return onSnapshot(doc(db, "users", uid), (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as UserProfile);
      }
    });
  }
}

export const authService = new AuthService();
