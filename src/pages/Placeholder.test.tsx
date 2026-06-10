import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Placeholder from './Placeholder';

describe('Placeholder Component', () => {
  it('renders the title correctly', () => {
    render(<Placeholder title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders the under construction message', () => {
    render(<Placeholder title="Settings" />);
    expect(screen.getByText(/under construction/i)).toBeInTheDocument();
  });
});
