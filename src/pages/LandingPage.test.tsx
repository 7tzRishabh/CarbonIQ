import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LandingPage from './LandingPage';
import { useAuth } from '../contexts/AuthContext';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('LandingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when not authenticated', () => {
    (useAuth as any).mockReturnValue({ user: null });
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.getByText(/Understand and reduce your/i)).toBeInTheDocument();
  });

  it('renders "Go to Dashboard" when authenticated', () => {
    (useAuth as any).mockReturnValue({ user: { uid: '123' } });
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    
    const dashboardBtn = screen.getByText('Go to Dashboard');
    expect(dashboardBtn).toBeInTheDocument();
    fireEvent.click(dashboardBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/app/dashboard');
  });

  it('shows core features', () => {
    (useAuth as any).mockReturnValue({ user: null });
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Real-time Tracking')).toBeInTheDocument();
    expect(screen.getByText('AI-Powered Insights')).toBeInTheDocument();
    expect(screen.getByText('Global Impact')).toBeInTheDocument();
  });
});
