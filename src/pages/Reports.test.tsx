import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Reports from './Reports';
import { useReports } from '../hooks/useReports';

vi.mock('../hooks/useReports', () => ({
  useReports: vi.fn(),
}));

describe('Reports Page', () => {
  const mockExportToCSV = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useReports as any).mockReturnValue({
      loading: false,
      logs: [
        { id: '1', carbonEmittedKg: 10.25, date: Date.now(), category: 'transportation', value: 20, notes: 'test notes' }
      ],
      exportToCSV: mockExportToCSV
    });
  });

  it('renders correctly and displays summary statistics', () => {
    render(<Reports />);
    
    expect(screen.getByText(/Total Logs Recorded/i)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10.3')).toBeInTheDocument(); // totalEmissions.toFixed(1)
  });

  it('renders log history table', () => {
    render(<Reports />);
    
    expect(screen.getByText('transportation')).toBeInTheDocument();
    expect(screen.getByText('test notes')).toBeInTheDocument();
    expect(screen.getByText('10.25 kg')).toBeInTheDocument();
  });

  it('handles CSV download button click', () => {
    render(<Reports />);
    const exportBtn = screen.getByText('Export Data (CSV)');
    fireEvent.click(exportBtn);
    expect(mockExportToCSV).toHaveBeenCalled();
  });

  it('renders empty state when no logs', () => {
    (useReports as any).mockReturnValue({
      loading: false,
      logs: [],
      exportToCSV: mockExportToCSV
    });
    render(<Reports />);
    
    expect(screen.getByText(/No logs available yet/i)).toBeInTheDocument();
    const exportBtn = screen.getByText('Export Data (CSV)');
    expect(exportBtn).toBeDisabled();
  });
});
