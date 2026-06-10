import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import { onAuthStateChanged } from 'firebase/auth';
import { onSnapshot, getDoc } from 'firebase/firestore';

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  onSnapshot: vi.fn(),
}));

vi.mock('../lib/firebase', () => ({
  auth: {},
  db: {},
}));

const TestComponent = () => {
  const { user, loading, ecoPoints } = useAuth();
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <div data-testid="user">{user ? user.uid : 'no user'}</div>
      <div data-testid="points">{ecoPoints}</div>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getDoc as any).mockResolvedValue({ exists: () => true, data: () => ({}) });
  });

  it('provides user data when authenticated', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    (onAuthStateChanged as any).mockImplementation((auth, callback) => {
      callback(mockUser);
      return () => {};
    });
    
    // Mock snapshot for points
    (onSnapshot as any).mockImplementation((ref, callback) => {
      callback({ exists: () => true, data: () => ({ ecoPoints: 42 }) });
      return () => {};
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('user').textContent).toBe('123');
      expect(getByTestId('points').textContent).toBe('42');
    });
  });

  it('provides null user when not authenticated', async () => {
    (onAuthStateChanged as any).mockImplementation((auth, callback) => {
      callback(null);
      return () => {};
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('user').textContent).toBe('no user');
      expect(getByTestId('points').textContent).toBe('0');
    });
  });
});
