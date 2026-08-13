import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { ReactNode } from 'react';

import { SettingsPage } from '../SettingsPage';
import { useOwnerStore } from '@/shared/stores/owner';

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

beforeEach(() => {
  useOwnerStore.setState({
    settings: { name: '', timezone: 'UTC' },
  });
});

describe('SettingsPage', () => {
  it('renders page title', () => {
    render(<SettingsPage />, { wrapper: createWrapper() });
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders the settings form', () => {
    render(<SettingsPage />, { wrapper: createWrapper() });
    expect(screen.getByLabelText('Display name')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Timezone' })).toBeInTheDocument();
  });
});
