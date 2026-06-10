import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from './LoginPage';
import { useAuth } from '../contexts/AuthContext';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('LoginPage', () => {
  const mockSignIn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login button when unauthenticated', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      loading: false,
      signInWithGoogle: mockSignIn,
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Sign in to CarbonIQ/i)).toBeInTheDocument();
    const btn = screen.getByLabelText('Sign in with Google');
    fireEvent.click(btn);
    expect(mockSignIn).toHaveBeenCalled();
  });

  it('redirects to dashboard if already authenticated', () => {
    (useAuth as any).mockReturnValue({
      user: { uid: '123' },
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/app/dashboard" element={<div>Dashboard Content</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
  });

  it('renders nothing while loading', () => {
    (useAuth as any).mockReturnValue({
      loading: true,
    });

    const { container } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });
});
