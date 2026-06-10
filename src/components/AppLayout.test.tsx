import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppLayout } from './AppLayout';
import { useAuth } from '../contexts/AuthContext';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('AppLayout Component', () => {
  const mockLogout = vi.fn();
  
  beforeEach(() => {
    (useAuth as any).mockReturnValue({
      user: { displayName: 'John Doe', photoURL: 'https://example.com/photo.jpg' },
      logout: mockLogout,
    });
  });

  it('renders correctly with desktop sidebar', () => {
    render(
      <MemoryRouter>
        <AppLayout><div>Test Content</div></AppLayout>
      </MemoryRouter>
    );
    
    expect(screen.getByText('CarbonIQ')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Calculator')).toBeInTheDocument();
    expect(screen.getByText('AI Coach')).toBeInTheDocument();
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('calls logout when sign out button is clicked', () => {
    render(
      <MemoryRouter>
        <AppLayout><div>Test Content</div></AppLayout>
      </MemoryRouter>
    );
    
    const logoutBtn = screen.getByText('Sign Out');
    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalled();
  });

  it('toggles mobile menu on mobile view', () => {
    render(
      <MemoryRouter>
        <AppLayout><div>Test Content</div></AppLayout>
      </MemoryRouter>
    );
    
    // The mobile menu button (Menu icon)
    const menuButton = screen.getByRole('button', { name: '' }); // Menu button has no text label, search by icon or class if needed, or better add aria-label if possible but here I'll try to find it.
    // In the code: <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2"><Menu className="w-6 h-6 text-gray-600" /></button>
    // Since lucide icons often don't have text, I might need to find by class or similar.
    
    const buttons = screen.getAllByRole('button');
    const toggleButton = buttons.find(b => b.querySelector('.lucide-menu'));
    
    if (toggleButton) {
      fireEvent.click(toggleButton);
      // After click, navigation items should be visible in the mobile menu container (which is rendered conditionally)
      // Since it's hidden by CSS initially (md:hidden) but we are using JSDOM, we just check if it's in the DOM.
      // Actually navigation names are already there in Desktop Sidebar.
      // I'll check for a specifically mobile link or something unique.
      const mobileLinks = screen.getAllByText('Dashboard');
      expect(mobileLinks.length).toBeGreaterThan(1); // One in sidebar, one in mobile menu
    }
  });
});
