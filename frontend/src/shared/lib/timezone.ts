import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function toLocalTime(utcDateTime: string): dayjs.Dayjs {
  return dayjs.utc(utcDateTime).local();
}

export function toOwnerTime(utcDateTime: string, ownerTimezone: string): dayjs.Dayjs {
  return dayjs.utc(utcDateTime).tz(ownerTimezone);
}

export function formatTime(date: dayjs.Dayjs, format = 'HH:mm'): string {
  return date.format(format);
}

export function formatDate(date: dayjs.Dayjs, format = 'DD MMM YYYY'): string {
  return date.format(format);
}

export function formatDateTime(
  date: dayjs.Dayjs,
  format = 'DD MMM YYYY, HH:mm',
): string {
  return date.format(format);
}

export function getBrowserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function toUTC(date: dayjs.Dayjs): string {
  return date.utc().format();
}

export function createTimeRange(
  start: string,
  end: string,
  slotDurationMinutes: number,
  timezone: string,
): string[] {
  const times: string[] = [];
  let current = dayjs.tz(start, timezone);
  const endTime = dayjs.tz(end, timezone);

  while (current.isBefore(endTime)) {
    times.push(current.format('HH:mm'));
    current = current.add(slotDurationMinutes, 'minute');
  }

  return times;
}
