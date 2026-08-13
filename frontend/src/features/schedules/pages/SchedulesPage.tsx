import { useState } from 'react';
import {
  Text,
  Button,
  Table,
  Group,
  ActionIcon,
  Modal,
  EmptyState,
  Badge,
} from '@mantine/core';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import type { Schedule } from '@/shared/api/types';
import { DayOfWeek } from '@/shared/api/types';
import { useSchedules, useDeleteSchedule } from '../hooks/useSchedules';
import { ScheduleForm } from '../components/ScheduleForm';
import { useOwnerStore } from '@/shared/stores/owner';
import { toOwnerTime, formatDate } from '@/shared/lib/timezone';

const DAY_LABELS: Record<number, string> = {
  [DayOfWeek.Monday]: 'Mon',
  [DayOfWeek.Tuesday]: 'Tue',
  [DayOfWeek.Wednesday]: 'Wed',
  [DayOfWeek.Thursday]: 'Thu',
  [DayOfWeek.Friday]: 'Fri',
  [DayOfWeek.Saturday]: 'Sat',
  [DayOfWeek.Sunday]: 'Sun',
};

function formatDaysOfWeek(days: number[]): string {
  return days.map((d) => DAY_LABELS[d] ?? d).join(', ');
}

export function SchedulesPage() {
  const { settings } = useOwnerStore();
  const { data: schedules, isLoading } = useSchedules();
  const deleteMutation = useDeleteSchedule();
  const [formOpen, setFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | undefined>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingSchedule(undefined);
    setFormOpen(true);
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId);
    }
    setDeleteConfirmOpen(false);
    setDeletingId(null);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingSchedule(undefined);
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={600}>Schedules</Text>
        <Button leftSection={<IconPlus size={16} />} onClick={handleCreate}>
          Create Schedule
        </Button>
      </Group>

      {schedules && schedules.length > 0 ? (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Days</Table.Th>
              <Table.Th>Time</Table.Th>
              <Table.Th>Date range</Table.Th>
              <Table.Th>Slot duration</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {schedules.map((schedule) => {
              const startOwnerTime = toOwnerTime(schedule.startDate, settings.timezone);
              const endOwnerTime = toOwnerTime(schedule.endDate, settings.timezone);

              return (
                <Table.Tr key={schedule.id}>
                  <Table.Td>{formatDaysOfWeek(schedule.daysOfWeek)}</Table.Td>
                  <Table.Td>
                    <Badge variant="light">{schedule.startTime} – {schedule.endTime}</Badge>
                  </Table.Td>
                  <Table.Td>
                    {formatDate(startOwnerTime)} – {formatDate(endOwnerTime)}
                  </Table.Td>
                  <Table.Td>
                    {schedule.slotDurationMinutes ? (
                      <Badge variant="light">{schedule.slotDurationMinutes} min</Badge>
                    ) : (
                      '—'
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleEdit(schedule)}
                        aria-label="Edit"
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDeleteClick(schedule.id)}
                        aria-label="Delete"
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      ) : (
        <EmptyState>
          <EmptyState.Title>No schedules yet</EmptyState.Title>
          <EmptyState.Description>
            Create your first schedule to define your availability.
          </EmptyState.Description>
        </EmptyState>
      )}

      <Modal
        opened={formOpen}
        onClose={handleCloseForm}
        title={editingSchedule ? 'Edit Schedule' : 'Create Schedule'}
        size="lg"
      >
        <ScheduleForm
          mode={editingSchedule ? 'edit' : 'create'}
          schedule={editingSchedule}
          onClose={handleCloseForm}
        />
      </Modal>

      <Modal
        opened={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete schedule"
      >
        <Text size="sm" mb="md">Are you sure you want to delete this schedule?</Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setDeleteConfirmOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Group>
      </Modal>
    </div>
  );
}
