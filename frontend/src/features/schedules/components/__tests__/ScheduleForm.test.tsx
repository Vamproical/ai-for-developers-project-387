import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { ReactNode } from 'react';

import { ScheduleForm } from '../ScheduleForm';
import { DayOfWeek } from '@/shared/api/types';

const mockCreate = vi.fn();
const mockUpdate = vi.fn();

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
});

describe('ScheduleForm', () => {
  it('renders all form fields', () => {
    render(<ScheduleForm mode="create" onClose={vi.fn()} />, { wrapper: createWrapper() });
    expect(screen.getByLabelText('Start time')).toBeInTheDocument();
    expect(screen.getByLabelText('End time')).toBeInTheDocument();
    expect(screen.getByLabelText('Start date')).toBeInTheDocument();
    expect(screen.getByLabelText('End date')).toBeInTheDocument();
  });

  it('renders day of week checkboxes', () => {
    render(<ScheduleForm mode="create" onClose={vi.fn()} />, { wrapper: createWrapper() });
    expect(screen.getByLabelText('Monday')).toBeInTheDocument();
    expect(screen.getByLabelText('Friday')).toBeInTheDocument();
  });

  it('shows create button in create mode', () => {
    render(<ScheduleForm mode="create" onClose={vi.fn()} />, { wrapper: createWrapper() });
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  it('shows save button in edit mode', () => {
    const schedule = {
      id: '1',
      daysOfWeek: [DayOfWeek.Monday],
      startTime: '09:00',
      endTime: '17:00',
      startDate: '2026-09-01T00:00:00Z',
      endDate: '2026-12-31T00:00:00Z',
    };
    render(<ScheduleForm mode="edit" schedule={schedule as any} onClose={vi.fn()} />, { wrapper: createWrapper() });
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('submits create form', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ScheduleForm mode="create" onClose={onClose} />, { wrapper: createWrapper() });

    await user.click(screen.getByLabelText('Monday'));
    await user.type(screen.getByLabelText('Start time'), '09:00');
    await user.type(screen.getByLabelText('End time'), '17:00');
    await user.type(screen.getByLabelText('Start date'), '2026-09-01');
    await user.type(screen.getByLabelText('End date'), '2026-12-31');

    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate.mock.calls[0][0].daysOfWeek).toContain(DayOfWeek.Monday);
  });
});
