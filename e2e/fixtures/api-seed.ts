const API_BASE_URL = process.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export interface ApiSeedBooking {
  id: string;
  slotId: string;
  eventTypeId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  comment?: string;
  createdAt: string;
  status: string;
}

export interface ApiSeedEventType {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
}

export interface ApiSeedSchedule {
  id: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  slotDurationMinutes?: number;
}

export interface ApiSeedSlot {
  id: string;
  eventTypeId: string;
  startDateTime: string;
  endDateTime: string;
  status: string;
}

export interface ApiSeedCreateBookingInput {
  slotId: string;
  eventTypeId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  comment?: string;
}

interface ApiResponse<T> {
  status: number;
  statusText: string;
  ok: boolean;
  body: T | undefined;
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  let body: T | undefined;
  try {
    body = await response.json();
  } catch {
    body = undefined;
  }

  return { status: response.status, statusText: response.statusText, ok: response.ok, body };
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { status, statusText, ok, body } = await apiFetch<T>(path, options);

  if (!ok) {
    const errorText = body !== undefined ? JSON.stringify(body) : '';
    throw new Error(
      `API request failed: ${status} ${statusText} ${path} — ${errorText}`,
    );
  }

  if (status === 204) {
    return undefined as T;
  }

  return body as T;
}

export async function listBookings(): Promise<ApiSeedBooking[]> {
  const result = await apiRequest<{ items: ApiSeedBooking[] }>('/admin/bookings');
  return result.items;
}

export async function createEventType(
  name: string,
  description: string,
  durationMinutes: number,
): Promise<ApiSeedEventType> {
  return apiRequest<ApiSeedEventType>('/admin/event-types', {
    method: 'POST',
    body: JSON.stringify({ name, description, durationMinutes }),
  });
}

export async function createSchedule(data: {
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  slotDurationMinutes?: number;
}): Promise<ApiSeedSchedule> {
  return apiRequest<ApiSeedSchedule>('/admin/schedules', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function listSlots(params: { eventTypeId?: string } = {}): Promise<ApiSeedSlot[]> {
  const query = params.eventTypeId ? `?eventTypeId=${encodeURIComponent(params.eventTypeId)}` : '';
  const result = await apiRequest<{ items: ApiSeedSlot[] }>(`/slots${query}`);
  return result.items;
}

export async function createBooking(data: ApiSeedCreateBookingInput): Promise<ApiSeedBooking> {
  return apiRequest<ApiSeedBooking>('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface ApiErrorResult {
  status: number;
  message?: string;
}

async function apiRequestExpectingError(
  path: string,
  options: RequestInit,
): Promise<ApiErrorResult> {
  const { status, body } = await apiFetch<{ message?: string }>(path, options);
  return { status, message: body?.message };
}

export async function cancelBookingRaw(id: string): Promise<ApiErrorResult> {
  return apiRequestExpectingError(`/admin/bookings/${id}/cancel`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'cancelled' }),
  });
}

export async function createBookingRaw(data: ApiSeedCreateBookingInput): Promise<ApiErrorResult> {
  return apiRequestExpectingError('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function cleanupDb(): Promise<void> {
  await apiRequest('/e2e/cleanup', { method: 'POST' });
}
