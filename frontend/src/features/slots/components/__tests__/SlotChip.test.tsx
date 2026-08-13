import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { ReactNode } from 'react';

import { SlotChip } from '../SlotChip';

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

describe('SlotChip', () => {
  it('renders time label', () => {
    render(<SlotChip slotId="slot-1" time="10:00" selected={false} onSelect={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', async () => {
    const handleSelect = vi.fn();
    const user = userEvent.setup();

    render(<SlotChip slotId="slot-1" time="10:00" selected={false} onSelect={handleSelect} />, {
      wrapper: createWrapper(),
    });

    await user.click(screen.getByText('10:00'));
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });

  it('applies selected styling when selected', () => {
    render(<SlotChip slotId="slot-1" time="10:00" selected onSelect={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    const chip = screen.getByText('10:00').closest('button');
    expect(chip).toHaveAttribute('data-selected');
  });
});
