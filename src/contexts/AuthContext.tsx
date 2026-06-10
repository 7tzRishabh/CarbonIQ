import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  ecoPoints: number;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
  ecoPoints: 0,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [ecoPoints, setEcoPoints] = useState(0);

  useEffect(() => {
    let unsubscribeDoc: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // sync user in firestore
        const userRef = doc(db, "users", currentUser.uid);
        const snapshot = await getDoc(userRef);
        if (!snapshot.exists()) {
          const newDoc: any = {
            uid: currentUser.uid,
            email: currentUser.email || "",
            carbonScore: 0,
            ecoPoints: 0,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          if (currentUser.displayName) newDoc.displayName = currentUser.displayName;
          if (currentUser.photoURL) newDoc.photoURL = currentUser.photoURL;

          await setDoc(userRef, newDoc);
        }
        
        unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
           if (docSnap.exists()) {
              setEcoPoints(docSnap.data().ecoPoints || 0);
           }
        });
      } else {
        setEcoPoints(0);
        if (unsubscribeDoc) unsubscribeDoc();
      }
      setLoading(false);
    });
    return () => {
        unsubscribeAuth();
        if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout, ecoPoints }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
