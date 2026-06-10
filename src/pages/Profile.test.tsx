import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Profile from './Profile';
import { useAuth } from '../contexts/AuthContext';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Profile Page', () => {
  beforeEach(() => {
    (useAuth as any).mockReturnValue({
      user: {
        displayName: 'John Doe',
        email: 'john@example.com',
        photoURL: 'https://example.com/photo.jpg',
        metadata: { creationTime: '2023-01-01T12:00:00Z' }
      },
      ecoPoints: 350,
    });
  });

  it('renders user information correctly', () => {
    render(<Profile />);
    
    // There might be multiple occurrences (display name in main section and account info)
    expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument();
    expect(screen.getAllByText('john@example.com')[0]).toBeInTheDocument();
    expect(screen.getByText('350 Eco Points')).toBeInTheDocument();
  });

  it('renders profile image if available', () => {
    render(<Profile />);
    const img = screen.getByAltText('Profile');
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('renders placeholder icon if no photoURL', () => {
    (useAuth as any).mockReturnValue({
      user: {
        displayName: 'John Doe',
        email: 'john@example.com',
        photoURL: null,
        metadata: { creationTime: '2023-01-01T12:00:00Z' }
      },
      ecoPoints: 350,
    });

    render(<Profile />);
    const icon = document.querySelector('.lucide-user');
    expect(icon).toBeInTheDocument();
  });
});
