import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from './Dashboard';
import { useAuth } from '../contexts/AuthContext';
import { useDashboard } from '../hooks/useDashboard';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../hooks/useDashboard', () => ({
  useDashboard: vi.fn(),
}));

// Mock Recharts to avoid issues with ResponsiveContainer in jsdom
vi.mock('recharts', async () => {
  const OriginalModule = await vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => (
      <div style={{ width: 800, height: 400 }}>{children}</div>
    ),
  };
});

describe('Dashboard Page', () => {
  beforeEach(() => {
    (useAuth as any).mockReturnValue({
      user: { displayName: 'Jane Doe', uid: '456' },
      ecoPoints: 150,
    });
    
    (useDashboard as any).mockReturnValue({
      totalEmissions: '15.0',
      categoryImpact: { transportation: 10, electricity: 5, food: 0, other: 0 },
      graphData: [
        { name: 'Mon', emissions: 0 },
        { name: 'Tue', emissions: 0 },
        { name: 'Wed', emissions: 0 },
        { name: 'Thu', emissions: 0 },
        { name: 'Fri', emissions: 0 },
        { name: 'Sat', emissions: 0 },
        { name: 'Sun', emissions: 15 },
      ],
      loading: false,
      logs: []
    });
  });

  it('renders welcome message with user name', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Welcome back, Jane!/i)).toBeInTheDocument();
    expect(screen.getByText(/150/)).toBeInTheDocument();
  });

  it('displays total emissions correctly', () => {
    render(<Dashboard />);
    expect(screen.getByText('15.0')).toBeInTheDocument();
    expect(screen.getByText('kg CO₂e')).toBeInTheDocument();
  });

  it('renders category breakdown', () => {
    render(<Dashboard />);
    expect(screen.getByText('Transport')).toBeInTheDocument();
    expect(screen.getByText('Energy')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
  });
});
