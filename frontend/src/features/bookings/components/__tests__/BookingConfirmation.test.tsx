import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { ReactNode } from 'react';

import { BookingConfirmation } from '../BookingConfirmation';
import type { Booking, EventType } from '@/shared/api/types';

const mockBooking: Booking = {
  id: '1',
  slotId: 'slot-1',
  eventTypeId: 'et-1',
  guestName: 'John Doe',
  guestEmail: 'john@example.com',
  status: 'confirmed',
  createdAt: '2026-08-10T10:00:00Z',
};

const mockEventType: EventType = {
  id: 'et-1',
  name: 'Consultation',
  description: '30 min call',
  durationMinutes: 30,
};

const createWrapper = () => {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MantineProvider>
        <Notifications />
        {children}
      </MantineProvider>
    );
  };
};

describe('BookingConfirmation', () => {
  it('renders booking summary', () => {
    render(
      <BookingConfirmation
        booking={mockBooking}
        eventType={mockEventType}
        slotStartDateTime="2026-08-10T10:00:00Z"
        onBookAnother={() => {}}
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText('Booking Confirmed')).toBeInTheDocument();
    expect(screen.getByText('Consultation')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onBookAnother when button is clicked', async () => {
    const handleBookAnother = vi.fn();
    const user = userEvent.setup();

    render(
      <BookingConfirmation
        booking={mockBooking}
        eventType={mockEventType}
        slotStartDateTime="2026-08-10T10:00:00Z"
        onBookAnother={handleBookAnother}
      />,
      { wrapper: createWrapper() },
    );

    await user.click(screen.getByRole('button', { name: /book another/i }));
    expect(handleBookAnother).toHaveBeenCalled();
  });
});
