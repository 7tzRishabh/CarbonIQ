import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { authService } from "../services/authService";
import { AuthState } from "../types";

interface AuthContextType extends AuthState {
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  ecoPoints: 0,
  signInWithGoogle: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    ecoPoints: 0,
  });

  const updateProfile = useCallback((profile: any) => {
    setState(prev => ({ 
      ...prev, 
      profile, 
      ecoPoints: profile.ecoPoints || 0 
    }));
  }, []);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const profile = await authService.syncUserProfile(currentUser);
          setState(prev => ({ ...prev, user: currentUser, profile, ecoPoints: profile.ecoPoints }));
          
          unsubscribeProfile = authService.subscribeToProfile(currentUser.uid, updateProfile);
        } catch (error) {
          console.error("Auth profile sync failed:", error);
          setState(prev => ({ ...prev, user: currentUser, loading: false }));
        }
      } else {
        setState({ user: null, profile: null, loading: false, ecoPoints: 0 });
        if (unsubscribeProfile) unsubscribeProfile();
      }
      setState(prev => ({ ...prev, loading: false }));
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, [updateProfile]);

  const signInWithGoogle = async () => {
    await authService.signInWithGoogle();
  };

  const logout = async () => {
    await authService.logout();
  };

  return (
    <AuthContext.Provider value={{ ...state, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
