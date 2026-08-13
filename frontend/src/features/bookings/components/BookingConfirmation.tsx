import { Card, Text, Stack, Group, Badge, Button } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import { toLocalTime, formatDateTime } from '@/shared/lib/timezone';
import type { Booking, EventType } from '@/shared/api/types';

interface BookingConfirmationProps {
  booking: Booking;
  eventType: EventType;
  slotStartDateTime: string;
  onBookAnother: () => void;
}

export function BookingConfirmation({
  booking,
  eventType,
  slotStartDateTime,
  onBookAnother,
}: BookingConfirmationProps) {
  const localDateTime = toLocalTime(slotStartDateTime);

  return (
    <Stack align="center" gap="xl">
      <Group gap="xs" c="green">
        <IconCircleCheck size={32} />
        <Text size="xl" fw={700}>Booking Confirmed</Text>
      </Group>

      <Card shadow="sm" padding="lg" radius="md" withBorder w="100%">
        <Stack gap="md">
          <Group justify="space-between">
            <Text fw={600}>Event Type</Text>
            <Badge variant="light">{eventType.name}</Badge>
          </Group>

          <Group justify="space-between">
            <Text fw={600}>Date & Time</Text>
            <Text>{formatDateTime(localDateTime)}</Text>
          </Group>

          <Group justify="space-between">
            <Text fw={600}>Duration</Text>
            <Text>{eventType.durationMinutes} minutes</Text>
          </Group>

          <Group justify="space-between">
            <Text fw={600}>Name</Text>
            <Text>{booking.guestName}</Text>
          </Group>

          <Group justify="space-between">
            <Text fw={600}>Email</Text>
            <Text>{booking.guestEmail}</Text>
          </Group>
        </Stack>
      </Card>

      <Button onClick={onBookAnother}>Book Another</Button>
    </Stack>
  );
}
