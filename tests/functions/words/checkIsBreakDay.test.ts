import { describe, it, expect, vi } from 'vitest';
import { checkIsBreakDay } from '../../../utils/words';

describe('checkIsBreakDay Function Tests', () => {
  const today = new Date().getDay();
  it('should return true if today is the break day', () => {
    const result = checkIsBreakDay(today);
    expect(result).toBe(true);
  });

  it('should return false if today is not the break day', () => {
    const notToday = (today + 1) % 7;
    const result = checkIsBreakDay(notToday);
    expect(result).toBe(false);
  });

  it('should handle the case where breakDay is 0 (Sunday) and today is Sunday', () => {
    const sunday = 0;
    const mockDate = new Date();
    mockDate.setDate(mockDate.getDate() - mockDate.getDay());
    vi.setSystemTime(mockDate);

    const result = checkIsBreakDay(sunday);
    expect(result).toBe(true);
  });

  it('should handle the case where breakDay is 6 (Saturday) and today is Saturday', () => {
    const saturday = 6;
    const mockDate = new Date();
    mockDate.setDate(mockDate.getDate() + (6 - mockDate.getDay()));
    vi.setSystemTime(mockDate);

    const result = checkIsBreakDay(saturday);
    expect(result).toBe(true);
  });

  it('should handle the case where breakDay is out of the valid range', () => {
    const invalidDay = 7;
    const result = checkIsBreakDay(invalidDay);
    expect(result).toBe(false);
  });

  it('should handle the case where breakDay is a negative number', () => {
    const invalidDay = -1;
    const result = checkIsBreakDay(invalidDay);
    expect(result).toBe(false);
  });
});
