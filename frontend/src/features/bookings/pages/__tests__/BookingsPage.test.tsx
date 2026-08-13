import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { ReactNode } from 'react';

import { BookingsPage } from '../BookingsPage';
import type { Booking } from '@/shared/api/types';
import { useOwnerStore } from '@/shared/stores/owner';

const mockBookings: Booking[] = [
  {
    id: '1',
    slotId: 's1',
    eventTypeId: 'et1',
    guestName: 'John Doe',
    guestEmail: 'john@example.com',
    createdAt: '2026-09-01T10:00:00Z',
    status: 'confirmed',
  },
];

const mockEventTypes = [
  { id: 'et1', name: 'Consultation', description: '30 min call', durationMinutes: 30 },
];

const mockCancel = vi.fn();

vi.mock('../../hooks/useAdminBookings', () => ({
  useAdminBookings: vi.fn(),
  useCancelBooking: vi.fn(),
}));

vi.mock('@/features/event-types/hooks/useEventTypes', () => ({
  useEventTypes: vi.fn(),
}));

import * as bookingHooks from '../../hooks/useAdminBookings';
import * as eventTypeHooks from '@/features/event-types/hooks/useEventTypes';

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
  useOwnerStore.setState({
    settings: { name: '', timezone: 'UTC' },
  });
  vi.mocked(bookingHooks.useAdminBookings).mockReturnValue({
    data: mockBookings,
    isLoading: false,
    isError: false,
  } as any);
  vi.mocked(bookingHooks.useCancelBooking).mockReturnValue({
    mutate: mockCancel,
    isPending: false,
    isSuccess: false,
  } as any);
  vi.mocked(eventTypeHooks.useEventTypes).mockReturnValue({
    data: mockEventTypes,
    isLoading: false,
    isError: false,
  } as any);
});

describe('BookingsPage', () => {
  it('renders page title', () => {
    render(<BookingsPage />, { wrapper: createWrapper() });
    expect(screen.getByText('Bookings')).toBeInTheDocument();
  });

  it('renders filter selects', () => {
    render(<BookingsPage />, { wrapper: createWrapper() });
    expect(screen.getByRole('combobox', { name: 'Event type' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Status' })).toBeInTheDocument();
  });

  it('renders bookings table with data', () => {
    render(<BookingsPage />, { wrapper: createWrapper() });
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getAllByText('Consultation').length).toBeGreaterThan(0);
    expect(screen.getByText('confirmed')).toBeInTheDocument();
  });

  it('shows cancel button for confirmed bookings', () => {
    render(<BookingsPage />, { wrapper: createWrapper() });
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('shows empty state when no bookings', () => {
    vi.mocked(bookingHooks.useAdminBookings).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as any);

    render(<BookingsPage />, { wrapper: createWrapper() });
    expect(screen.getByText(/no bookings found/i)).toBeInTheDocument();
  });

  it('cancels booking on confirm', async () => {
    const user = userEvent.setup({ delay: null });
    render(<BookingsPage />, { wrapper: createWrapper() });

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(screen.getByText('Cancel booking')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Yes, cancel' }));

    expect(mockCancel).toHaveBeenCalledWith('1');
  });
});
