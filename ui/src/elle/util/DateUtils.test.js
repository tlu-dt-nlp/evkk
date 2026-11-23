import { describe, expect, it } from 'vitest';
import { formatDate, formatOptionalDate, fromDateTimeLocalInputValue, toDateTimeLocalInputValue } from './DateUtils';

describe('formatOptionalDate', () => {
  it('formats a date like formatDate', () => {
    const date = '2026-06-01T12:00:00Z';
    expect(formatOptionalDate(date)).toBe(formatDate(date));
  });

  it('returns the fallback for an empty value', () => {
    expect(formatOptionalDate(null)).toBe('–');
    expect(formatOptionalDate(undefined, 'never')).toBe('never');
  });
});

describe('datetime-local input values', () => {
  it('convert to the input format and back without changing the time', () => {
    const iso = '2026-06-01T09:30:00.000Z';
    const inputValue = toDateTimeLocalInputValue(iso);
    expect(inputValue).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    expect(fromDateTimeLocalInputValue(inputValue)).toBe(iso);
  });

  it('treat empty values as no date', () => {
    expect(toDateTimeLocalInputValue(null)).toBe('');
    expect(fromDateTimeLocalInputValue('')).toBeNull();
  });
});
