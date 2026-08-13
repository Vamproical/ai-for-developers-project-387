import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

import { createSchedule } from './api-seed';

dayjs.extend(utc);

export const WEEKDAYS = [1, 2, 3, 4, 5];

export function weekRange(): { startDate: string; endDate: string } {
  const weekStart = dayjs.utc().startOf('day').add(11, 'hour');
  const weekEnd = weekStart.add(6, 'day');
  return {
    startDate: weekStart.toISOString(),
    endDate: weekEnd.toISOString(),
  };
}

export async function createWeeklySchedule(): Promise<{ startDate: string; endDate: string }> {
  const { startDate, endDate } = weekRange();
  const schedule = await createSchedule({
    daysOfWeek: WEEKDAYS,
    startTime: '09:00',
    endTime: '17:00',
    startDate,
    endDate,
    slotDurationMinutes: 30,
  });
  return { startDate: schedule.startDate, endDate: schedule.endDate };
}
