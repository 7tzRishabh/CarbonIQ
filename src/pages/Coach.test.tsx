import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Coach from './Coach';
import { useAuth } from '../contexts/AuthContext';
import { useCoach } from '../hooks/useCoach';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../hooks/useCoach', () => ({
  useCoach: vi.fn(),
}));

describe('Coach Page', () => {
  const mockAskCoach = vi.fn();
  const mockSetPrompt = vi.fn();

  const baseMock = {
    prompt: '',
    setPrompt: mockSetPrompt,
    response: null,
    loading: false,
    askCoach: mockAskCoach
  };

  beforeEach(() => {
    (useAuth as any).mockReturnValue({
      user: { uid: '123' },
      ecoPoints: 100,
    });
    vi.clearAllMocks();
    (useCoach as any).mockReturnValue(baseMock);
  });

  it('renders initial state correctly', () => {
    render(<Coach />);
    expect(screen.getByText(/How can I help you be greener today?/i)).toBeInTheDocument();
  });

  it('handles input and submission', () => {
    render(<Coach />);
    const input = screen.getByPlaceholderText(/Ask me anything about sustainability/i);
    fireEvent.change(input, { target: { value: 'How to reduce footprint?' } });
    expect(mockSetPrompt).toHaveBeenCalledWith('How to reduce footprint?');
    
    const form = screen.getByLabelText('coach-form');
    fireEvent.submit(form);
    expect(mockAskCoach).toHaveBeenCalled();
  });

  it('displays loading state', () => {
    (useCoach as any).mockReturnValue({
      ...baseMock,
      loading: true
    });
    render(<Coach />);
    expect(screen.getByText(/Analyzing sustainability patterns/i)).toBeInTheDocument();
  });

  it('displays response correctly', () => {
    (useCoach as any).mockReturnValue({
      ...baseMock,
      response: 'Here is some advice.'
    });
    render(<Coach />);
    expect(screen.getByText('Here is some advice.')).toBeInTheDocument();
  });
});
