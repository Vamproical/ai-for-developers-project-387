import { apiFetch } from './client';
import type {
  Schedule,
  ScheduleList,
  CreateScheduleRequest,
} from './types';

export async function listSchedules(): Promise<Schedule[]> {
  const result = await apiFetch<ScheduleList>('/admin/schedules');
  return result.items;
}

export async function createSchedule(
  data: CreateScheduleRequest,
): Promise<Schedule> {
  return apiFetch<Schedule>('/admin/schedules', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSchedule(
  id: string,
  data: Partial<CreateScheduleRequest>,
): Promise<Schedule> {
  return apiFetch<Schedule>(`/admin/schedules/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteSchedule(id: string): Promise<void> {
  await apiFetch<void>(`/admin/schedules/${id}`, {
    method: 'DELETE',
  });
}
