import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { createBooking } from '@/shared/api/bookings';
import type { CreateBookingRequest, Booking } from '@/shared/api/types';

export function useCreateBooking() {
  return useMutation<Booking, Error, CreateBookingRequest>({
    mutationFn: (data: CreateBookingRequest) => createBooking(data),
    onError: (error: Error) => {
      notifications.show({
        message: `Failed to create booking: ${error.message}`,
        color: 'red',
      });
    },
  });
}
