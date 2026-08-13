import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { listBookings, cancelBooking } from '@/shared/api/bookings';
import type { BookingStatus } from '@/shared/api/types';

interface ListBookingsParams {
  eventTypeId?: string;
  status?: BookingStatus;
  from?: string;
  to?: string;
}

const ADMIN_BOOKINGS_QUERY_KEY = ['adminBookings'];

export function useAdminBookings(params: ListBookingsParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_BOOKINGS_QUERY_KEY, params],
    queryFn: () => listBookings(params),
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BOOKINGS_QUERY_KEY });
      notifications.show({ message: 'Booking cancelled', color: 'green' });
    },
    onError: (error: Error) => {
      notifications.show({ message: `Failed to cancel: ${error.message}`, color: 'red' });
    },
  });
}
