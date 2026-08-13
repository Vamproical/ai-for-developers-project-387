import { Text } from '@mantine/core';
import { SettingsForm } from '../components/SettingsForm';

export function SettingsPage() {
  return (
    <div>
      <Text size="xl" fw={600} mb="md">Settings</Text>
      <SettingsForm />
    </div>
  );
}
