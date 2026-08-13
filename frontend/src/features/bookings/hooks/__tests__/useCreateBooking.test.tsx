import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import * as api from '@/shared/api/bookings';
import { useCreateBooking } from '../useCreateBooking';

vi.mock('@/shared/api/bookings');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useCreateBooking', () => {
  it('creates a booking successfully', async () => {
    const createdBooking = {
      id: '1',
      slotId: 'slot-1',
      eventTypeId: 'et-1',
      guestName: 'John Doe',
      guestEmail: 'john@example.com',
      status: 'confirmed' as const,
      createdAt: '2026-08-10T10:00:00Z',
    };
    vi.mocked(api.createBooking).mockResolvedValue(createdBooking);

    const { result } = renderHook(() => useCreateBooking(), { wrapper: createWrapper() });

    result.current.mutate({
      slotId: 'slot-1',
      eventTypeId: 'et-1',
      guestName: 'John Doe',
      guestEmail: 'john@example.com',
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(api.createBooking).toHaveBeenCalledWith({
      slotId: 'slot-1',
      eventTypeId: 'et-1',
      guestName: 'John Doe',
      guestEmail: 'john@example.com',
    });
    expect(result.current.data).toEqual(createdBooking);
  });

  it('handles booking creation error', async () => {
    vi.mocked(api.createBooking).mockRejectedValue(new Error('Slot already booked'));

    const { result } = renderHook(() => useCreateBooking(), { wrapper: createWrapper() });

    result.current.mutate({
      slotId: 'slot-1',
      eventTypeId: 'et-1',
      guestName: 'John Doe',
      guestEmail: 'john@example.com',
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
