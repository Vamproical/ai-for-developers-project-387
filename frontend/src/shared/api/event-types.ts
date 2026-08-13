import { apiFetch } from './client';
import type {
  EventType,
  EventTypeList,
  CreateEventTypeRequest,
  UpdateEventTypeRequest,
} from './types';

export async function listEventTypes(): Promise<EventType[]> {
  const result = await apiFetch<EventTypeList>('/event-types');
  return result.items;
}

export async function getEventType(id: string): Promise<EventType> {
  return apiFetch<EventType>(`/event-types/${id}`);
}

export async function createEventType(
  data: CreateEventTypeRequest,
): Promise<EventType> {
  return apiFetch<EventType>('/admin/event-types', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateEventType(
  id: string,
  data: UpdateEventTypeRequest,
): Promise<EventType> {
  return apiFetch<EventType>(`/admin/event-types/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteEventType(id: string): Promise<void> {
  return apiFetch<void>(`/admin/event-types/${id}`, { method: 'DELETE' });
}
