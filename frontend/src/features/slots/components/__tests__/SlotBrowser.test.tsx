import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { ReactNode } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

import { SlotBrowser } from '../SlotBrowser';
import type { Slot } from '@/shared/api/types';

vi.mock('../../hooks/useSlots', () => ({
  useSlots: vi.fn(),
}));

import * as hooks from '../../hooks/useSlots';

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

function getMockSlotsForWeek(weekStart: dayjs.Dayjs): Slot[] {
  return [
    { id: '1', eventTypeId: '1', startDateTime: weekStart.hour(10).minute(0).second(0).utc().format(), endDateTime: weekStart.hour(10).minute(30).second(0).utc().format(), status: 'available' },
    { id: '2', eventTypeId: '1', startDateTime: weekStart.hour(11).minute(0).second(0).utc().format(), endDateTime: weekStart.hour(11).minute(30).second(0).utc().format(), status: 'booked' },
    { id: '3', eventTypeId: '1', startDateTime: weekStart.add(1, 'day').hour(9).minute(0).second(0).utc().format(), endDateTime: weekStart.add(1, 'day').hour(9).minute(30).second(0).utc().format(), status: 'available' },
  ];
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('SlotBrowser', () => {
  it('renders navigation controls', () => {
    vi.mocked(hooks.useSlots).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as any);

    render(<SlotBrowser onSlotSelect={vi.fn()} />, { wrapper: createWrapper() });

    expect(screen.getByLabelText('Previous week')).toBeInTheDocument();
    expect(screen.getByLabelText('Next week')).toBeInTheDocument();
  });

  it('shows loading spinner', () => {
    vi.mocked(hooks.useSlots).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as any);

    render(<SlotBrowser onSlotSelect={vi.fn()} />, { wrapper: createWrapper() });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows available slots for the current week', () => {
    const weekStart = dayjs().startOf('week').add(1, 'day').hour(0).minute(0).second(0);
    const mockSlots = getMockSlotsForWeek(weekStart);

    vi.mocked(hooks.useSlots).mockReturnValue({
      data: mockSlots,
      isLoading: false,
      isError: false,
    } as any);

    render(<SlotBrowser onSlotSelect={vi.fn()} />, { wrapper: createWrapper() });

    expect(screen.getByText('10:00')).toBeInTheDocument();
    expect(screen.getByText('09:00')).toBeInTheDocument();
  });

  it('does not show booked slots', () => {
    const weekStart = dayjs().startOf('week').add(1, 'day').hour(0).minute(0).second(0);
    const mockSlots = getMockSlotsForWeek(weekStart);

    vi.mocked(hooks.useSlots).mockReturnValue({
      data: mockSlots,
      isLoading: false,
      isError: false,
    } as any);

    render(<SlotBrowser onSlotSelect={vi.fn()} />, { wrapper: createWrapper() });

    const allButtons = screen.getAllByRole('button');
    const chipTexts = allButtons.map((btn) => btn.textContent);
    expect(chipTexts).not.toContain('11:00');
  });

  it('shows empty state when no available slots', () => {
    vi.mocked(hooks.useSlots).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as any);

    render(<SlotBrowser onSlotSelect={vi.fn()} />, { wrapper: createWrapper() });
    expect(screen.getByText('No available slots')).toBeInTheDocument();
  });

  it('calls onSlotSelect when a slot chip is clicked', async () => {
    const handleSelect = vi.fn();
    const user = userEvent.setup();

    const weekStart = dayjs().startOf('week').add(1, 'day').hour(0).minute(0).second(0);
    const mockSlots = getMockSlotsForWeek(weekStart);

    vi.mocked(hooks.useSlots).mockReturnValue({
      data: mockSlots,
      isLoading: false,
      isError: false,
    } as any);

    render(<SlotBrowser onSlotSelect={handleSelect} />, { wrapper: createWrapper() });

    await user.click(screen.getByText('10:00'));
    expect(handleSelect).toHaveBeenCalledWith(mockSlots[0]);
  });

  it('highlights selected slot', async () => {
    const user = userEvent.setup();

    const weekStart = dayjs().startOf('week').add(1, 'day').hour(0).minute(0).second(0);
    const mockSlots = getMockSlotsForWeek(weekStart);

    vi.mocked(hooks.useSlots).mockReturnValue({
      data: mockSlots,
      isLoading: false,
      isError: false,
    } as any);

    render(<SlotBrowser onSlotSelect={vi.fn()} />, { wrapper: createWrapper() });

    const chip = screen.getByText('10:00');
    expect(chip.closest('button')).not.toHaveAttribute('data-selected');

    await user.click(chip);
    expect(chip.closest('button')).toHaveAttribute('data-selected');
  });
});
