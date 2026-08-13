import { describe, it, expect } from 'vitest';
import { toLocalTime, toOwnerTime, formatTime, formatDate, formatDateTime, getBrowserTimezone, toUTC } from '../timezone';
import dayjs from 'dayjs';

describe('timezone utilities', () => {
  const utcDate = '2024-06-15T14:30:00Z';

  describe('toLocalTime', () => {
    it('converts UTC string to local dayjs object', () => {
      const result = toLocalTime(utcDate);
      expect(dayjs.isDayjs(result)).toBe(true);
      expect(result.utc().format()).toBe(dayjs.utc(utcDate).format());
    });
  });

  describe('toOwnerTime', () => {
    it('converts UTC string to specified timezone', () => {
      const result = toOwnerTime(utcDate, 'America/New_York');
      expect(dayjs.isDayjs(result)).toBe(true);
    });
  });

  describe('formatTime', () => {
    it('formats time with default format', () => {
      const date = dayjs.utc(utcDate);
      expect(formatTime(date)).toBe('14:30');
    });

    it('formats time with custom format', () => {
      const date = dayjs.utc(utcDate);
      expect(formatTime(date, 'h:mm A')).toBe('2:30 PM');
    });
  });

  describe('formatDate', () => {
    it('formats date with default format', () => {
      const date = dayjs.utc(utcDate);
      expect(formatDate(date)).toBe('15 Jun 2024');
    });
  });

  describe('formatDateTime', () => {
    it('formats date and time with default format', () => {
      const date = dayjs.utc(utcDate);
      expect(formatDateTime(date)).toBe('15 Jun 2024, 14:30');
    });
  });

  describe('getBrowserTimezone', () => {
    it('returns a non-empty string', () => {
      const tz = getBrowserTimezone();
      expect(tz).toBeTruthy();
      expect(typeof tz).toBe('string');
    });
  });

  describe('toUTC', () => {
    it('converts dayjs to UTC string', () => {
      const date = dayjs('2024-06-15T14:30:00');
      const result = toUTC(date);
      expect(result).toContain('T');
    });
  });
});
