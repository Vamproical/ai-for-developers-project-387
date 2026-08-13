import { apiFetch, buildQueryString } from './client';
import type {
  Booking,
  BookingList,
  CreateBookingRequest,
  UpdateBookingStatusRequest,
  BookingStatus,
} from './types';

interface ListBookingsParams {
  eventTypeId?: string;
  status?: BookingStatus;
  from?: string;
  to?: string;
}

export async function listBookings(
  params: ListBookingsParams = {},
): Promise<Booking[]> {
  const qs = buildQueryString({
    eventTypeId: params.eventTypeId,
    status: params.status,
    from: params.from,
    to: params.to,
  });
  const result = await apiFetch<BookingList>(`/admin/bookings${qs}`);
  return result.items;
}

export async function createBooking(
  data: CreateBookingRequest,
): Promise<Booking> {
  return apiFetch<Booking>('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateBookingStatus(
  id: string,
  data: UpdateBookingStatusRequest,
): Promise<Booking> {
  return apiFetch<Booking>(`/admin/bookings/${id}/cancel`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function cancelBooking(id: string): Promise<Booking> {
  return updateBookingStatus(id, { status: 'cancelled' });
}
