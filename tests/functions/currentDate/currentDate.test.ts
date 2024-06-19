import { describe, it, expect, vi } from 'vitest';
import { currentDate } from '../../../utils/currentDate';

describe('currentDate Function Tests', () => {
  const realDate = Date;

  it('should return the correct current date and time', () => {
    const mockDate = new Date(2024, 5, 19, 14, 30); // 19th June 2024, 14:30
    vi.setSystemTime(mockDate);

    const result = currentDate();
    expect(result).toBe('Wednesday, 06/19/2024 14:30');
  });

  it('should correctly format single-digit month and day', () => {
    const mockDate = new Date(2024, 0, 5, 9, 5); // 5th January 2024, 09:05
    vi.setSystemTime(mockDate);

    const result = currentDate();
    expect(result).toBe('Friday, 01/05/2024 09:05');
  });

  it('should correctly handle midnight time', () => {
    const mockDate = new Date(2024, 11, 25, 0, 0); // 25th December 2024, 00:00
    vi.setSystemTime(mockDate);

    const result = currentDate();
    expect(result).toBe('Wednesday, 12/25/2024 00:00');
  });

  it('should correctly handle noon time', () => {
    const mockDate = new Date(2024, 6, 4, 12, 0); // 4th July 2024, 12:00
    vi.setSystemTime(mockDate);

    const result = currentDate();
    expect(result).toBe('Thursday, 07/04/2024 12:00');
  });

  it('should correctly format different weekdays', () => {
    const mockDates = [
      new Date(2024, 5, 16), // Sunday, 16th June 2024
      new Date(2024, 5, 17), // Monday, 17th June 2024
      new Date(2024, 5, 18), // Tuesday, 18th June 2024
      new Date(2024, 5, 19), // Wednesday, 19th June 2024
      new Date(2024, 5, 20), // Thursday, 20th June 2024
      new Date(2024, 5, 21), // Friday, 21st June 2024
      new Date(2024, 5, 22), // Saturday, 22nd June 2024
    ];

    const expectedResults = [
      'Sunday, 06/16/2024 00:00',
      'Monday, 06/17/2024 00:00',
      'Tuesday, 06/18/2024 00:00',
      'Wednesday, 06/19/2024 00:00',
      'Thursday, 06/20/2024 00:00',
      'Friday, 06/21/2024 00:00',
      'Saturday, 06/22/2024 00:00',
    ];

    mockDates.forEach((mockDate, index) => {
      vi.setSystemTime(mockDate);
      const result = currentDate();
      expect(result).toBe(expectedResults[index]);
    });
  });
});
