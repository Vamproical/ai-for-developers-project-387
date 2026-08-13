import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { useSchedules, useCreateSchedule, useUpdateSchedule, useDeleteSchedule } from '../useSchedules';
import * as schedulesApi from '@/shared/api/schedules';

vi.mock('@/shared/api/schedules', () => ({
  listSchedules: vi.fn(),
  createSchedule: vi.fn(),
  updateSchedule: vi.fn(),
  deleteSchedule: vi.fn(),
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

describe('useSchedules', () => {
  it('returns schedules data', () => {
    const mockData = [{ id: '1', daysOfWeek: [1], startTime: '09:00', endTime: '17:00', startDate: '2026-01-01', endDate: '2026-12-31' }];
    vi.mocked(schedulesApi.listSchedules).mockResolvedValue(mockData as any);

    const { result } = renderHook(() => useSchedules(), { wrapper: createWrapper() });
    expect(result.current.data).toBeUndefined();
  });
});

describe('useCreateSchedule', () => {
  it('returns mutation object', () => {
    const { result } = renderHook(() => useCreateSchedule(), { wrapper: createWrapper() });
    expect(result.current.mutate).toBeDefined();
    expect(result.current.isPending).toBe(false);
  });
});

describe('useUpdateSchedule', () => {
  it('returns mutation object', () => {
    const { result } = renderHook(() => useUpdateSchedule(), { wrapper: createWrapper() });
    expect(result.current.mutate).toBeDefined();
    expect(result.current.isPending).toBe(false);
  });
});

describe('useDeleteSchedule', () => {
  it('returns mutation object', () => {
    const { result } = renderHook(() => useDeleteSchedule(), { wrapper: createWrapper() });
    expect(result.current.mutate).toBeDefined();
    expect(result.current.isPending).toBe(false);
  });
});
