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
import type { EventType } from '@/shared/api/types';
import { useEventTypes, useDeleteEventType } from '../hooks/useEventTypes';
import { EventTypeForm } from '../components/EventTypeForm';

export function EventTypesPage() {
  const { data: eventTypes, isLoading } = useEventTypes();
  const deleteMutation = useDeleteEventType();
  const [formOpen, setFormOpen] = useState(false);
  const [editingEventType, setEditingEventType] = useState<EventType | undefined>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingEventType(undefined);
    setFormOpen(true);
  };

  const handleEdit = (eventType: EventType) => {
    setEditingEventType(eventType);
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
    setEditingEventType(undefined);
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={600}>Event Types</Text>
        <Button leftSection={<IconPlus size={16} />} onClick={handleCreate}>
          Create Event Type
        </Button>
      </Group>

      {eventTypes && eventTypes.length > 0 ? (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Duration (min)</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {eventTypes.map((eventType) => (
              <Table.Tr key={eventType.id}>
                <Table.Td>{eventType.name}</Table.Td>
                <Table.Td>{eventType.description}</Table.Td>
                <Table.Td>
                  <Badge variant="light">{eventType.durationMinutes}</Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={() => handleEdit(eventType)}
                      aria-label="Edit"
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => handleDeleteClick(eventType.id)}
                      aria-label="Delete"
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <EmptyState>
          <EmptyState.Title>No event types yet</EmptyState.Title>
          <EmptyState.Description>
            Create your first event type to get started.
          </EmptyState.Description>
        </EmptyState>
      )}

      <Modal
        opened={formOpen}
        onClose={handleCloseForm}
        title={editingEventType ? 'Edit Event Type' : 'Create Event Type'}
      >
        <EventTypeForm
          mode={editingEventType ? 'edit' : 'create'}
          eventType={editingEventType}
          onClose={handleCloseForm}
        />
      </Modal>

      <Modal
        opened={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete event type"
      >
        <Text size="sm" mb="md">Are you sure you want to delete this event type?</Text>
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
