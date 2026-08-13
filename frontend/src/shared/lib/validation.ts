import { z } from 'zod';

export const bookingFormSchema = z.object({
  slotId: z.string().min(1, 'Slot is required'),
  eventTypeId: z.string().min(1, 'Event type is required'),
  guestName: z.string().min(1, 'Name is required'),
  guestEmail: z.string().email('Invalid email format'),
  guestPhone: z.string().optional(),
  comment: z.string().optional(),
});

export const eventTypeFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  durationMinutes: z.coerce.number().int().positive('Duration must be a positive integer'),
});

export const scheduleFormSchema = z.object({
  daysOfWeek: z.array(z.number()).min(1, 'At least one day must be selected'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  slotDurationMinutes: z.coerce.number().int().positive().optional(),
}).refine((data) => {
  if (data.startTime && data.endTime && data.startTime >= data.endTime) {
    return false;
  }
  return true;
}, { message: 'Start time must be before end time', path: ['startTime'] }).refine((data) => {
  if (data.startDate && data.endDate && data.startDate >= data.endDate) {
    return false;
  }
  return true;
}, { message: 'Start date must be before end date', path: ['startDate'] });

export const settingsFormSchema = z.object({
  name: z.string().min(1, 'Display name is required'),
  timezone: z.string().min(1, 'Timezone is required'),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
export type EventTypeFormValues = z.infer<typeof eventTypeFormSchema>;
export type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;
export type SettingsFormValues = z.infer<typeof settingsFormSchema>;
