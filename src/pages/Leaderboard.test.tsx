import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Leaderboard from './Leaderboard';
import { useAuth } from '../contexts/AuthContext';
import { useLeaderboard } from '../hooks/useLeaderboard';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../hooks/useLeaderboard', () => ({
  useLeaderboard: vi.fn(),
}));

describe('Leaderboard Page', () => {
  beforeEach(() => {
    (useAuth as any).mockReturnValue({
      user: { uid: 'my-uid' },
    });
    vi.clearAllMocks();
  });

  it('renders leaders correctly', async () => {
    (useLeaderboard as any).mockReturnValue({
      loading: false,
      leaders: [
        { uid: '1', displayName: 'Leader One', ecoPoints: 500, createdAt: Date.now() },
        { uid: 'my-uid', displayName: 'Me', ecoPoints: 300, createdAt: Date.now() },
      ]
    });

    render(<Leaderboard />);
    
    expect(screen.getByText('Leader One')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Me')).toBeInTheDocument();
    expect(screen.getByText('You')).toBeInTheDocument(); // Tag for current user
  });

  it('renders empty message when no leaders', async () => {
    (useLeaderboard as any).mockReturnValue({
      loading: false,
      leaders: []
    });
    render(<Leaderboard />);
    
    expect(screen.getByText(/No leaders found yet/i)).toBeInTheDocument();
  });
});
