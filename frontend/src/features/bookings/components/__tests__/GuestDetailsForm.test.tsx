import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { ReactNode } from 'react';

import { GuestDetailsForm } from '../GuestDetailsForm';

const mockCreate = vi.fn();

vi.mock('../../hooks/useCreateBooking', () => ({
  useCreateBooking: () => ({
    mutate: mockCreate,
    isPending: false,
    isSuccess: false,
    data: null,
  }),
}));

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
});

describe('GuestDetailsForm', () => {
  it('renders all form fields', () => {
    render(<GuestDetailsForm slotId="1" eventTypeId="1" onSubmit={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/comment/i)).toBeInTheDocument();
  });

  it('shows validation error when name is empty', async () => {
    const user = userEvent.setup();
    render(<GuestDetailsForm slotId="1" eventTypeId="1" onSubmit={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    await user.click(screen.getByRole('button', { name: /confirm booking/i }));
    expect(await screen.findByText('Name is required')).toBeInTheDocument();
  });

  it('shows validation error when email is invalid', async () => {
    const user = userEvent.setup();
    render(<GuestDetailsForm slotId="1" eventTypeId="1" onSubmit={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    await user.type(screen.getByLabelText(/name/i), 'John');
    await user.type(screen.getByLabelText(/email/i), 'invalid');
    await user.click(screen.getByRole('button', { name: /confirm booking/i }));

    expect(await screen.findByText('Invalid email format')).toBeInTheDocument();
  });

  it('calls onSubmit with form data when valid', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<GuestDetailsForm slotId="1" eventTypeId="1" onSubmit={handleSubmit} />, {
      wrapper: createWrapper(),
    });

    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');

    await user.click(screen.getByRole('button', { name: /confirm booking/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      slotId: '1',
      eventTypeId: '1',
      guestName: 'John Doe',
      guestEmail: 'john@example.com',
      guestPhone: '',
      comment: '',
    });
  });
});
