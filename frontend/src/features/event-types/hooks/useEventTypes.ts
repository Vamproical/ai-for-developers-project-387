import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import {
  listEventTypes,
  createEventType,
  updateEventType,
  deleteEventType,
} from '@/shared/api/event-types';
import type { CreateEventTypeRequest, UpdateEventTypeRequest } from '@/shared/api/types';

const EVENT_TYPES_QUERY_KEY = ['eventTypes'];

export function useEventTypes() {
  return useQuery({
    queryKey: EVENT_TYPES_QUERY_KEY,
    queryFn: listEventTypes,
  });
}

export function useCreateEventType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventTypeRequest) => createEventType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENT_TYPES_QUERY_KEY });
      notifications.show({ message: 'Event type created', color: 'green' });
    },
    onError: (error: Error) => {
      notifications.show({ message: `Failed to create: ${error.message}`, color: 'red' });
    },
  });
}

export function useUpdateEventType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventTypeRequest }) =>
      updateEventType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENT_TYPES_QUERY_KEY });
      notifications.show({ message: 'Event type updated', color: 'green' });
    },
    onError: (error: Error) => {
      notifications.show({ message: `Failed to update: ${error.message}`, color: 'red' });
    },
  });
}

export function useDeleteEventType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEventType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENT_TYPES_QUERY_KEY });
      notifications.show({ message: 'Event type deleted', color: 'green' });
    },
    onError: (error: Error) => {
      notifications.show({ message: `Failed to delete: ${error.message}`, color: 'red' });
    },
  });
}
