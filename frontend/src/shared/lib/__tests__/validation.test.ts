import { describe, it, expect } from 'vitest';
import { bookingFormSchema, eventTypeFormSchema, scheduleFormSchema } from '../validation';

describe('validation schemas', () => {
  describe('bookingFormSchema', () => {
    it('validates correct booking data', () => {
      const result = bookingFormSchema.safeParse({
        slotId: 'slot-1',
        eventTypeId: 'et-1',
        guestName: 'John Doe',
        guestEmail: 'john@example.com',
        guestPhone: '+1234567890',
        comment: 'Test comment',
      });
      expect(result.success).toBe(true);
    });

    it('rejects missing slotId', () => {
      const result = bookingFormSchema.safeParse({
        slotId: '',
        eventTypeId: 'et-1',
        guestName: 'John Doe',
        guestEmail: 'john@example.com',
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing eventTypeId', () => {
      const result = bookingFormSchema.safeParse({
        slotId: 'slot-1',
        eventTypeId: '',
        guestName: 'John Doe',
        guestEmail: 'john@example.com',
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty name', () => {
      const result = bookingFormSchema.safeParse({
        slotId: 'slot-1',
        eventTypeId: 'et-1',
        guestName: '',
        guestEmail: 'john@example.com',
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid email', () => {
      const result = bookingFormSchema.safeParse({
        slotId: 'slot-1',
        eventTypeId: 'et-1',
        guestName: 'John Doe',
        guestEmail: 'not-an-email',
      });
      expect(result.success).toBe(false);
    });

    it('allows optional fields', () => {
      const result = bookingFormSchema.safeParse({
        slotId: 'slot-1',
        eventTypeId: 'et-1',
        guestName: 'John Doe',
        guestEmail: 'john@example.com',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('eventTypeFormSchema', () => {
    it('validates correct event type data', () => {
      const result = eventTypeFormSchema.safeParse({
        name: 'Meeting',
        description: 'A test meeting',
        durationMinutes: 30,
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty name', () => {
      const result = eventTypeFormSchema.safeParse({
        name: '',
        description: 'Test',
        durationMinutes: 30,
      });
      expect(result.success).toBe(false);
    });

    it('rejects non-positive duration', () => {
      const result = eventTypeFormSchema.safeParse({
        name: 'Meeting',
        description: 'Test',
        durationMinutes: -5,
      });
      expect(result.success).toBe(false);
    });

    it('coerces string number to integer', () => {
      const result = eventTypeFormSchema.safeParse({
        name: 'Meeting',
        description: 'Test',
        durationMinutes: '30',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('scheduleFormSchema', () => {
    it('validates correct schedule data', () => {
      const result = scheduleFormSchema.safeParse({
        daysOfWeek: [1, 2, 3],
        startTime: '09:00',
        endTime: '17:00',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        slotDurationMinutes: 30,
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty daysOfWeek', () => {
      const result = scheduleFormSchema.safeParse({
        daysOfWeek: [],
        startTime: '09:00',
        endTime: '17:00',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      });
      expect(result.success).toBe(false);
    });

    it('rejects when startTime >= endTime', () => {
      const result = scheduleFormSchema.safeParse({
        daysOfWeek: [1],
        startTime: '17:00',
        endTime: '09:00',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      });
      expect(result.success).toBe(false);
    });

    it('rejects when startDate >= endDate', () => {
      const result = scheduleFormSchema.safeParse({
        daysOfWeek: [1],
        startTime: '09:00',
        endTime: '17:00',
        startDate: '2024-12-31',
        endDate: '2024-01-01',
      });
      expect(result.success).toBe(false);
    });
  });
});
