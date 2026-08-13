import { AppShell, Group, NavLink, Text } from '@mantine/core';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { adminNavItems } from '@/shared/ui/admin-nav';

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: false } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Text fw={700} size="lg">Booking Calendar — Admin</Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {adminNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              active={isActive}
              label={item.label}
              leftSection={<item.icon size={18} />}
              onClick={() => navigate(item.path)}
            />
          );
        })}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
