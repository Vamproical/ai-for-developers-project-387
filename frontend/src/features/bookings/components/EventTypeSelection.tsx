import { Card, Text, Group, Stack, Badge, EmptyState } from '@mantine/core';
import type { EventType } from '@/shared/api/types';

interface EventTypeSelectionProps {
  eventTypes: EventType[];
  onSelect: (eventType: EventType) => void;
}

export function EventTypeSelection({ eventTypes, onSelect }: EventTypeSelectionProps) {
  if (eventTypes.length === 0) {
    return (
      <EmptyState>
        <EmptyState.Title>No event types available</EmptyState.Title>
        <EmptyState.Description>
          Please try a different time slot.
        </EmptyState.Description>
      </EmptyState>
    );
  }

  return (
    <Stack gap="sm">
      <Text fw={600} size="lg">Select an event type</Text>
      {eventTypes.map((eventType) => (
        <Card
          key={eventType.id}
          shadow="sm"
          padding="md"
          radius="md"
          withBorder
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect(eventType)}
        >
          <Group justify="space-between">
            <Stack gap={2}>
              <Text fw={600}>{eventType.name}</Text>
              <Text size="sm" c="dimmed">{eventType.description}</Text>
            </Stack>
            <Badge variant="light">{eventType.durationMinutes} min</Badge>
          </Group>
        </Card>
      ))}
    </Stack>
  );
}
