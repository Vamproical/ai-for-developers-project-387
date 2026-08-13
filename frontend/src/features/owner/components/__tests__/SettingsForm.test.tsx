import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { ReactNode } from 'react';

import { SettingsForm } from '../SettingsForm';
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

describe('SettingsForm', () => {
  it('renders display name input', () => {
    render(<SettingsForm />, { wrapper: createWrapper() });
    expect(screen.getByLabelText('Display name')).toBeInTheDocument();
  });

  it('renders timezone select', () => {
    render(<SettingsForm />, { wrapper: createWrapper() });
    expect(screen.getByRole('combobox', { name: 'Timezone' })).toBeInTheDocument();
  });

  it('shows save button', () => {
    render(<SettingsForm />, { wrapper: createWrapper() });
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('save button is disabled when form is not dirty', () => {
    render(<SettingsForm />, { wrapper: createWrapper() });
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('enables save button when form is dirty', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />, { wrapper: createWrapper() });

    const nameInput = screen.getByLabelText('Display name');
    await user.clear(nameInput);
    await user.type(nameInput, 'Test Owner');

    expect(screen.getByRole('button', { name: 'Save' })).not.toBeDisabled();
  });

  it('persists settings on submit', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />, { wrapper: createWrapper() });

    const nameInput = screen.getByLabelText('Display name');
    await user.clear(nameInput);
    await user.type(nameInput, 'Test Owner');

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    const state = useOwnerStore.getState();
    expect(state.settings.name).toBe('Test Owner');
  });
});
