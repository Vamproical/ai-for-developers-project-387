import { Container, Group, Text, Anchor } from '@mantine/core';
import { Outlet, Link as RouterLink } from 'react-router-dom';

export function GuestLayout() {
  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Text fw={700} size="xl">Booking Calendar</Text>
        <Anchor component={RouterLink} to="/admin" size="sm">
          Admin
        </Anchor>
      </Group>
      <Outlet />
    </Container>
  );
}
