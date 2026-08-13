import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import * as api from '@/shared/api/event-types';
import { useEventTypes, useCreateEventType, useUpdateEventType, useDeleteEventType } from '../useEventTypes';

vi.mock('@/shared/api/event-types');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
};

const mockEventTypes = [
  { id: '1', name: 'Consultation', description: '30 min call', durationMinutes: 30 },
  { id: '2', name: 'Workshop', description: '2 hour session', durationMinutes: 120 },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useEventTypes', () => {
  it('fetches event types', async () => {
    vi.mocked(api.listEventTypes).mockResolvedValue(mockEventTypes);

    const { result } = renderHook(() => useEventTypes(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.data).toEqual(mockEventTypes);
    });
  });

  it('handles fetch error', async () => {
    vi.mocked(api.listEventTypes).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useEventTypes(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe('useCreateEventType', () => {
  it('creates an event type and invalidates query', async () => {
    const newEventType = { id: '3', name: 'Interview', description: 'Technical interview', durationMinutes: 60 };
    vi.mocked(api.createEventType).mockResolvedValue(newEventType);

    const { result } = renderHook(() => useCreateEventType(), { wrapper: createWrapper() });

    result.current.mutate({ name: 'Interview', description: 'Technical interview', durationMinutes: 60 });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(api.createEventType).toHaveBeenCalledWith({
      name: 'Interview',
      description: 'Technical interview',
      durationMinutes: 60,
    });
  });
});

describe('useUpdateEventType', () => {
  it('updates an event type and invalidates query', async () => {
    const updated = { id: '1', name: 'Updated', description: 'Updated desc', durationMinutes: 45 };
    vi.mocked(api.updateEventType).mockResolvedValue(updated);

    const { result } = renderHook(() => useUpdateEventType(), { wrapper: createWrapper() });

    result.current.mutate({ id: '1', data: { name: 'Updated', description: 'Updated desc', durationMinutes: 45 } });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(api.updateEventType).toHaveBeenCalledWith('1', {
      name: 'Updated',
      description: 'Updated desc',
      durationMinutes: 45,
    });
  });
});

describe('useDeleteEventType', () => {
  it('deletes an event type and invalidates query', async () => {
    vi.mocked(api.deleteEventType).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteEventType(), { wrapper: createWrapper() });

    result.current.mutate('1');

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(api.deleteEventType).toHaveBeenCalledWith('1');
  });
});
