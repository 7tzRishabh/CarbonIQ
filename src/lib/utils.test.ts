import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('merges tailwind classes correctly', () => {
    expect(cn('p-4', 'bg-red-500')).toBe('p-4 bg-red-500');
    expect(cn('p-4', {'bg-red-500': true, 'bg-blue-500': false})).toBe('p-4 bg-red-500');
    expect(cn('px-2 py-1', 'p-4')).toBe('p-4'); // tailwind-merge in action
  });
});
