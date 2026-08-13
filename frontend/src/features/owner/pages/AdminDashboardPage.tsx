import { SimpleGrid, Card, Text, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { adminNavItems } from '@/shared/ui/admin-nav';

export function AdminDashboardPage() {
  const navigate = useNavigate();

  return (
    <div>
      <Text size="xl" fw={600} mb="md">Dashboard</Text>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
        {adminNavItems.filter((item) => item.path !== '/admin').map((section) => (
          <Card
            key={section.path}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(section.path)}
          >
            <Group mb="xs">
              <section.icon size={24} />
              <Text fw={600}>{section.label}</Text>
            </Group>
            <Text size="sm" c="dimmed">{section.description}</Text>
          </Card>
        ))}
      </SimpleGrid>
    </div>
  );
}
