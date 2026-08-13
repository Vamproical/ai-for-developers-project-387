import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { ReactNode } from 'react';

import { BookingStepper } from '../BookingStepper';
import type { Slot, EventType, Booking } from '@/shared/api/types';

const mockSlot: Slot = {
  id: 'slot-1',
  eventTypeId: 'et-1',
  startDateTime: '2026-08-10T10:00:00Z',
  endDateTime: '2026-08-10T10:30:00Z',
  status: 'available',
};

const mockEventTypes: EventType[] = [
  { id: 'et-1', name: 'Consultation', description: '30 min call', durationMinutes: 30 },
];

const mockBooking: Booking = {
  id: '1',
  slotId: 'slot-1',
  eventTypeId: 'et-1',
  guestName: 'John Doe',
  guestEmail: 'john@example.com',
  status: 'confirmed',
  createdAt: '2026-08-10T10:00:00Z',
};

vi.mock('../../hooks/useCreateBooking', () => ({
  useCreateBooking: vi.fn(),
}));

import * as hooks from '../../hooks/useCreateBooking';

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
  vi.mocked(hooks.useCreateBooking).mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
    isSuccess: false,
    data: null,
  } as any);
});

describe('BookingStepper', () => {
  it('shows step 1 (event type selection) when slot is selected', () => {
    render(
      <BookingStepper
        selectedSlot={mockSlot}
        eventTypes={mockEventTypes}
        onReset={() => {}}
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText('Select an event type')).toBeInTheDocument();
  });

  it('shows step 2 (guest details) when event type is selected', async () => {
    const user = userEvent.setup();

    render(
      <BookingStepper
        selectedSlot={mockSlot}
        eventTypes={mockEventTypes}
        onReset={() => {}}
      />,
      { wrapper: createWrapper() },
    );

    await user.click(screen.getByText('Consultation'));
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it('shows step 3 (confirmation) after booking is created', async () => {
    const user = userEvent.setup();

    vi.mocked(hooks.useCreateBooking).mockReturnValue({
      mutate: vi.fn((_, { onSuccess }) => {
        onSuccess(mockBooking);
      }),
      isPending: false,
      isSuccess: true,
      data: mockBooking,
    } as any);

    render(
      <BookingStepper
        selectedSlot={mockSlot}
        eventTypes={mockEventTypes}
        onReset={() => {}}
      />,
      { wrapper: createWrapper() },
    );

    await user.click(screen.getByText('Consultation'));
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.click(screen.getByRole('button', { name: /confirm booking/i }));

    expect(screen.getByText('Booking Confirmed')).toBeInTheDocument();
  });

  it('calls onReset when "Book Another" is clicked', async () => {
    const handleReset = vi.fn();
    const user = userEvent.setup();

    vi.mocked(hooks.useCreateBooking).mockReturnValue({
      mutate: vi.fn((_, { onSuccess }) => {
        onSuccess(mockBooking);
      }),
      isPending: false,
      isSuccess: true,
      data: mockBooking,
    } as any);

    render(
      <BookingStepper
        selectedSlot={mockSlot}
        eventTypes={mockEventTypes}
        onReset={handleReset}
      />,
      { wrapper: createWrapper() },
    );

    await user.click(screen.getByText('Consultation'));
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.click(screen.getByRole('button', { name: /confirm booking/i }));

    await user.click(screen.getByRole('button', { name: /book another/i }));
    expect(handleReset).toHaveBeenCalled();
  });
});
