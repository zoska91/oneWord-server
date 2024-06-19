import { describe, it, expect, vi } from 'vitest';
import { isTheSameDates } from '../../../utils/words';

describe('isTheSameDates Function Tests', () => {
  const today = new Date();

  it('should return true if the wordDate is today', () => {
    vi.setSystemTime(today);

    const result = isTheSameDates(today);
    expect(result).toBe(true);
  });

  it('should return false if the wordDate is not today', () => {
    const notToday = new Date(today);
    notToday.setDate(today.getDate() - 1);
    vi.setSystemTime(today);

    const result = isTheSameDates(notToday);
    expect(result).toBe(false);
  });

  it('should handle the case where wordDate is in the past but same day and month (different year)', () => {
    const pastDate = new Date(today);
    pastDate.setFullYear(today.getFullYear() - 1);
    vi.setSystemTime(today);

    const result = isTheSameDates(pastDate);
    expect(result).toBe(false);
  });

  it('should handle the case where wordDate is in the future but same day and month (different year)', () => {
    const futureDate = new Date(today);
    futureDate.setFullYear(today.getFullYear() + 1);
    vi.setSystemTime(today);

    const result = isTheSameDates(futureDate);
    expect(result).toBe(false);
  });

  it('should handle the edge case of different time but same day', () => {
    const sameDayDifferentTime = new Date(today);
    sameDayDifferentTime.setHours(today.getHours() - 5);
    vi.setSystemTime(today);

    const result = isTheSameDates(sameDayDifferentTime);
    expect(result).toBe(true);
  });
});
