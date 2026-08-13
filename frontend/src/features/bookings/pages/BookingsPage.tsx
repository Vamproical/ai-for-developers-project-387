import { useState } from 'react';
import {
  Text,
  Table,
  Group,
  ActionIcon,
  Badge,
  Select,
  Button,
  Modal,
  EmptyState,
  Stack,
} from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useAdminBookings, useCancelBooking } from '../hooks/useAdminBookings';
import { useEventTypes } from '@/features/event-types/hooks/useEventTypes';
import { useOwnerStore } from '@/shared/stores/owner';
import { toOwnerTime, formatDateTime } from '@/shared/lib/timezone';
import type { BookingStatus } from '@/shared/api/types';

export function BookingsPage() {
  const { settings } = useOwnerStore();
  const { data: eventTypes } = useEventTypes();
  const [eventTypeId, setEventTypeId] = useState<string | undefined>();
  const [status, setStatus] = useState<BookingStatus | undefined>();
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const cancelMutation = useCancelBooking();
  const { data: bookings, isLoading } = useAdminBookings({
    eventTypeId,
    status,
  });

  const handleCancelClick = (id: string) => {
    setCancellingId(id);
    setCancelConfirmOpen(true);
  };

  const handleCancelConfirm = () => {
    if (cancellingId) {
      cancelMutation.mutate(cancellingId);
    }
    setCancelConfirmOpen(false);
    setCancellingId(null);
  };

  const eventTypeMap = new Map(eventTypes?.map((et) => [et.id, et.name]));

  const statusColor: Record<string, string> = {
    confirmed: 'green',
    cancelled: 'red',
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <div>
      <Text size="xl" fw={600} mb="md">Bookings</Text>

      <Stack mb="md">
        <Group>
          <Select
            label="Event type"
            placeholder="All"
            clearable
            value={eventTypeId ?? null}
            onChange={(v) => setEventTypeId(v ?? undefined)}
            data={eventTypes?.map((et) => ({ value: et.id, label: et.name })) ?? []}
            style={{ flex: 1 }}
          />
          <Select
            label="Status"
            placeholder="All"
            clearable
            value={status ?? null}
            onChange={(v) => setStatus(v as BookingStatus | undefined)}
            data={[
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
            style={{ flex: 1 }}
          />
        </Group>
      </Stack>

      {bookings && bookings.length > 0 ? (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Guest</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Event type</Table.Th>
              <Table.Th>Date/time</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {bookings.map((booking) => {
              const ownerTime = toOwnerTime(booking.createdAt, settings.timezone);
              const isCancelled = booking.status === 'cancelled';

              return (
                <Table.Tr key={booking.id}>
                  <Table.Td>{booking.guestName}</Table.Td>
                  <Table.Td>{booking.guestEmail}</Table.Td>
                  <Table.Td>{eventTypeMap.get(booking.eventTypeId) ?? booking.eventTypeId}</Table.Td>
                  <Table.Td>{formatDateTime(ownerTime)}</Table.Td>
                  <Table.Td>
                    <Badge color={statusColor[booking.status]} variant="light">
                      {booking.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      disabled={isCancelled}
                      onClick={() => handleCancelClick(booking.id)}
                      aria-label="Cancel"
                    >
                      <IconX size={16} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      ) : (
        <EmptyState>
          <EmptyState.Title>No bookings found</EmptyState.Title>
          <EmptyState.Description>
            {eventTypeId || status
              ? 'No bookings match the selected filters.'
              : 'There are no bookings yet.'}
          </EmptyState.Description>
        </EmptyState>
      )}

      <Modal
        opened={cancelConfirmOpen}
        onClose={() => setCancelConfirmOpen(false)}
        title="Cancel booking"
      >
        <Text size="sm" mb="md">Are you sure you want to cancel this booking?</Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setCancelConfirmOpen(false)}>
            No
          </Button>
          <Button color="red" onClick={handleCancelConfirm}>
            Yes, cancel
          </Button>
        </Group>
      </Modal>
    </div>
  );
}
