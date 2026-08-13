import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { ReactNode } from 'react';

import { SchedulesPage } from '../SchedulesPage';
import type { Schedule } from '@/shared/api/types';
import { DayOfWeek } from '@/shared/api/types';

const mockSchedules: Schedule[] = [
  {
    id: '1',
    daysOfWeek: [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday],
    startTime: '09:00',
    endTime: '17:00',
    startDate: '2026-09-01T00:00:00Z',
    endDate: '2026-12-31T00:00:00Z',
    slotDurationMinutes: 30,
  },
];

const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();

vi.mock('../../hooks/useSchedules', () => ({
  useSchedules: vi.fn(),
  useCreateSchedule: vi.fn(),
  useUpdateSchedule: vi.fn(),
  useDeleteSchedule: vi.fn(),
}));

import * as hooks from '../../hooks/useSchedules';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <Notifications />
          {children}
        </MantineProvider>
      </QueryClientProvider>
    );
  };
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(hooks.useSchedules).mockReturnValue({
    data: mockSchedules,
    isLoading: false,
    isError: false,
  } as any);
  vi.mocked(hooks.useCreateSchedule).mockReturnValue({
    mutate: mockCreate,
    isPending: false,
    isSuccess: false,
  } as any);
  vi.mocked(hooks.useUpdateSchedule).mockReturnValue({
    mutate: mockUpdate,
    isPending: false,
    isSuccess: false,
  } as any);
  vi.mocked(hooks.useDeleteSchedule).mockReturnValue({
    mutate: mockDelete,
    isPending: false,
    isSuccess: false,
  } as any);
});

describe('SchedulesPage', () => {
  it('renders page title', () => {
    render(<SchedulesPage />, { wrapper: createWrapper() });
    expect(screen.getByText('Schedules')).toBeInTheDocument();
  });

  it('renders create button', () => {
    render(<SchedulesPage />, { wrapper: createWrapper() });
    expect(screen.getByRole('button', { name: /create schedule/i })).toBeInTheDocument();
  });

  it('renders schedules table with data', () => {
    render(<SchedulesPage />, { wrapper: createWrapper() });

    expect(screen.getByText('Mon, Wed, Fri')).toBeInTheDocument();
    expect(screen.getByText('09:00 – 17:00')).toBeInTheDocument();
    expect(screen.getByText('30 min')).toBeInTheDocument();
  });

  it('shows edit and delete buttons for each row', () => {
    render(<SchedulesPage />, { wrapper: createWrapper() });

    const rows = screen.getAllByRole('row').slice(1);
    expect(rows).toHaveLength(1);

    const firstRow = rows[0];
    expect(within(firstRow).getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(within(firstRow).getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('shows empty state when no schedules', () => {
    vi.mocked(hooks.useSchedules).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as any);

    render(<SchedulesPage />, { wrapper: createWrapper() });
    expect(screen.getByText(/no schedules yet/i)).toBeInTheDocument();
  });
});
