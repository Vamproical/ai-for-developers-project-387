import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { ReactNode } from 'react';

import { EventTypeSelection } from '../EventTypeSelection';
import type { EventType } from '@/shared/api/types';

const mockEventTypes: EventType[] = [
  { id: '1', name: 'Consultation', description: '30 min call', durationMinutes: 30 },
  { id: '2', name: 'Workshop', description: '2 hour session', durationMinutes: 120 },
];

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

describe('EventTypeSelection', () => {
  it('renders event types list', () => {
    render(<EventTypeSelection eventTypes={mockEventTypes} onSelect={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('Consultation')).toBeInTheDocument();
    expect(screen.getByText('Workshop')).toBeInTheDocument();
  });

  it('calls onSelect when an event type is clicked', async () => {
    const handleSelect = vi.fn();
    const user = userEvent.setup();

    render(<EventTypeSelection eventTypes={mockEventTypes} onSelect={handleSelect} />, {
      wrapper: createWrapper(),
    });

    await user.click(screen.getByText('Consultation'));
    expect(handleSelect).toHaveBeenCalledWith(mockEventTypes[0]);
  });

  it('shows empty state when no event types', () => {
    render(<EventTypeSelection eventTypes={[]} onSelect={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText(/no event types available/i)).toBeInTheDocument();
  });
});
