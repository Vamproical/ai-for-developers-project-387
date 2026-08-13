import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import * as api from '@/shared/api/slots';
import { useSlots } from '../useSlots';

vi.mock('@/shared/api/slots');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
};

const mockSlots = [
  { id: '1', eventTypeId: '1', startDateTime: '2026-08-10T10:00:00Z', endDateTime: '2026-08-10T10:30:00Z', status: 'available' as const },
  { id: '2', eventTypeId: '1', startDateTime: '2026-08-10T11:00:00Z', endDateTime: '2026-08-10T11:30:00Z', status: 'booked' as const },
  { id: '3', eventTypeId: '1', startDateTime: '2026-08-11T09:00:00Z', endDateTime: '2026-08-11T09:30:00Z', status: 'available' as const },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useSlots', () => {
  it('fetches slots with date range', async () => {
    vi.mocked(api.listSlots).mockResolvedValue(mockSlots);

    const { result } = renderHook(
      () => useSlots({ from: '2026-08-10', to: '2026-08-16' }),
      { wrapper: createWrapper() },
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.data).toEqual(mockSlots);
    });

    expect(api.listSlots).toHaveBeenCalledWith({
      from: '2026-08-10',
      to: '2026-08-16',
    });
  });

  it('handles fetch error', async () => {
    vi.mocked(api.listSlots).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(
      () => useSlots({ from: '2026-08-10', to: '2026-08-16' }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it('returns empty array when no slots', async () => {
    vi.mocked(api.listSlots).mockResolvedValue([]);

    const { result } = renderHook(
      () => useSlots({ from: '2026-08-10', to: '2026-08-16' }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual([]);
    });
  });
});
