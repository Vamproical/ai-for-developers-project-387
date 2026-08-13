import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { ReactNode } from 'react';

import { EventTypeForm } from '../EventTypeForm';
import type { EventType } from '@/shared/api/types';

const mockCreate = vi.fn();
const mockUpdate = vi.fn();

vi.mock('../../hooks/useEventTypes', () => ({
  useCreateEventType: () => ({ mutate: mockCreate, isPending: false, isSuccess: false }),
  useUpdateEventType: () => ({ mutate: mockUpdate, isPending: false, isSuccess: false }),
  useEventTypes: () => ({ data: [], isLoading: false, isError: false }),
  useDeleteEventType: () => ({ mutate: vi.fn(), isPending: false, isSuccess: false }),
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

describe('EventTypeForm', () => {
  it('renders empty form in create mode', () => {
    render(<EventTypeForm mode="create" onClose={vi.fn()} />, { wrapper: createWrapper() });

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/duration/i)).toBeInTheDocument();
  });

  it('renders pre-filled form in edit mode', () => {
    const eventType: EventType = {
      id: '1',
      name: 'Consultation',
      description: '30 min call',
      durationMinutes: 30,
    };

    render(<EventTypeForm mode="edit" eventType={eventType} onClose={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByLabelText(/name/i)).toHaveValue('Consultation');
    expect(screen.getByLabelText(/description/i)).toHaveValue('30 min call');
    expect(screen.getByLabelText(/duration/i)).toHaveValue('30');
  });

  it('shows validation error when name is empty', async () => {
    const user = userEvent.setup();
    render(<EventTypeForm mode="create" onClose={vi.fn()} />, { wrapper: createWrapper() });

    const submitButton = screen.getByRole('button', { name: /create/i });
    await user.click(submitButton);

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('calls onCreate with form data when valid', async () => {
    const user = userEvent.setup();
    render(<EventTypeForm mode="create" onClose={vi.fn()} />, { wrapper: createWrapper() });

    await user.type(screen.getByLabelText(/name/i), 'Workshop');
    await user.type(screen.getByLabelText(/description/i), '2 hour session');
    await user.type(screen.getByLabelText(/duration/i), '120');

    const submitButton = screen.getByRole('button', { name: /create/i });
    await user.click(submitButton);

    expect(mockCreate).toHaveBeenCalledWith(
      {
        name: 'Workshop',
        description: '2 hour session',
        durationMinutes: 120,
      },
      { onSuccess: expect.any(Function) },
    );
  });

  it('calls onUpdate with id and data when editing', async () => {
    const user = userEvent.setup();
    const eventType: EventType = {
      id: '1',
      name: 'Old Name',
      description: 'Old desc',
      durationMinutes: 30,
    };

    render(<EventTypeForm mode="edit" eventType={eventType} onClose={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    await user.clear(screen.getByLabelText(/name/i));
    await user.type(screen.getByLabelText(/name/i), 'New Name');

    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);

    expect(mockUpdate).toHaveBeenCalledWith(
      {
        id: '1',
        data: { name: 'New Name', description: 'Old desc', durationMinutes: 30 },
      },
      { onSuccess: expect.any(Function) },
    );
  });
});
