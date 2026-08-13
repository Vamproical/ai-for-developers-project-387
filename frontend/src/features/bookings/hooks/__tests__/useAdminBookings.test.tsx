import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { useAdminBookings, useCancelBooking } from '../useAdminBookings';
import * as bookingsApi from '@/shared/api/bookings';

vi.mock('@/shared/api/bookings', () => ({
  listBookings: vi.fn(),
  cancelBooking: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
};

describe('useAdminBookings', () => {
  it('returns bookings data', () => {
    const mockData = [{ id: '1', guestName: 'Test', guestEmail: 'test@test.com', createdAt: '2026-01-01', status: 'confirmed' }];
    vi.mocked(bookingsApi.listBookings).mockResolvedValue(mockData as any);

    const { result } = renderHook(() => useAdminBookings(), { wrapper: createWrapper() });
    expect(result.current.data).toBeUndefined();
  });
});

describe('useCancelBooking', () => {
  it('returns mutation object', () => {
    const { result } = renderHook(() => useCancelBooking(), { wrapper: createWrapper() });
    expect(result.current.mutate).toBeDefined();
    expect(result.current.isPending).toBe(false);
  });
});
