import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Calculator from './Calculator';
import { useCalculator } from '../hooks/useCalculator';
import { Car, Zap, Utensils } from "lucide-react";

vi.mock('../hooks/useCalculator', () => ({
  useCalculator: vi.fn(),
}));

describe('Calculator Page', () => {
  const mockUpdateValue = vi.fn();
  const mockUpdateNotes = vi.fn();
  const mockSelectCategory = vi.fn();
  const mockHandleSubmit = vi.fn();

  const baseMock = {
    formData: { category: 'transportation', value: '', notes: '' },
    loading: false,
    success: false,
    selectedCategory: { id: "transportation", name: "Transport", icon: Car, unit: "km driven", multiplier: 0.192 },
    categories: [
      { id: "transportation", name: "Transport", icon: Car, unit: "km driven", multiplier: 0.192 },
      { id: "electricity", name: "Electricity", icon: Zap, unit: "kWh", multiplier: 0.85 },
      { id: "food", name: "Food", icon: Utensils, unit: "kg of meat", multiplier: 15.0 },
    ],
    handleSubmit: mockHandleSubmit,
    selectCategory: mockSelectCategory,
    updateValue: mockUpdateValue,
    updateNotes: mockUpdateNotes
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useCalculator as any).mockReturnValue(baseMock);
  });

  it('renders correctly', () => {
    render(<Calculator />);
    expect(screen.getByText('Carbon Calculator')).toBeInTheDocument();
    expect(screen.getByText('Transport')).toBeInTheDocument();
  });

  it('calls updateValue on input change', () => {
    render(<Calculator />);
    const amountInput = screen.getByPlaceholderText('e.g. 15.5');
    fireEvent.change(amountInput, { target: { value: '25' } });
    expect(mockUpdateValue).toHaveBeenCalledWith('25');
  });

  it('submits correctly', async () => {
    render(<Calculator />);
    const form = screen.getByLabelText('calculator-form');
    fireEvent.submit(form);
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('shows success message when success is true', () => {
    (useCalculator as any).mockReturnValue({
      ...baseMock,
      success: true
    });
    render(<Calculator />);
    expect(screen.getByText(/logged successfully/i)).toBeInTheDocument();
  });
});
