import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { ReactNode } from 'react';

import { EventTypesPage } from '../EventTypesPage';
import type { EventType } from '@/shared/api/types';

const mockEventTypes: EventType[] = [
  { id: '1', name: 'Consultation', description: '30 min call', durationMinutes: 30 },
  { id: '2', name: 'Workshop', description: '2 hour session', durationMinutes: 120 },
];

const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();

vi.mock('../../hooks/useEventTypes', () => ({
  useEventTypes: vi.fn(),
  useCreateEventType: vi.fn(),
  useUpdateEventType: vi.fn(),
  useDeleteEventType: vi.fn(),
}));

import * as hooks from '../../hooks/useEventTypes';

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
  vi.mocked(hooks.useEventTypes).mockReturnValue({
    data: mockEventTypes,
    isLoading: false,
    isError: false,
  } as any);
  vi.mocked(hooks.useCreateEventType).mockReturnValue({
    mutate: mockCreate,
    isPending: false,
    isSuccess: false,
  } as any);
  vi.mocked(hooks.useUpdateEventType).mockReturnValue({
    mutate: mockUpdate,
    isPending: false,
    isSuccess: false,
  } as any);
  vi.mocked(hooks.useDeleteEventType).mockReturnValue({
    mutate: mockDelete,
    isPending: false,
    isSuccess: false,
  } as any);
});

describe('EventTypesPage', () => {
  it('renders page title', () => {
    render(<EventTypesPage />, { wrapper: createWrapper() });
    expect(screen.getByText('Event Types')).toBeInTheDocument();
  });

  it('renders create button', () => {
    render(<EventTypesPage />, { wrapper: createWrapper() });
    expect(screen.getByRole('button', { name: /create event type/i })).toBeInTheDocument();
  });

  it('renders event types table with data', () => {
    render(<EventTypesPage />, { wrapper: createWrapper() });

    expect(screen.getByText('Consultation')).toBeInTheDocument();
    expect(screen.getByText('30 min call')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('Workshop')).toBeInTheDocument();
    expect(screen.getByText('2 hour session')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
  });

  it('shows edit and delete buttons for each row', () => {
    render(<EventTypesPage />, { wrapper: createWrapper() });

    const rows = screen.getAllByRole('row').slice(1);
    expect(rows).toHaveLength(2);

    const firstRow = rows[0];
    expect(within(firstRow).getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(within(firstRow).getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('shows empty state when no event types', () => {
    vi.mocked(hooks.useEventTypes).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as any);

    render(<EventTypesPage />, { wrapper: createWrapper() });
    expect(screen.getByText(/no event types yet/i)).toBeInTheDocument();
  });
});
