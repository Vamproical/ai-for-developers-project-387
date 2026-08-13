import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import {
  listSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '@/shared/api/schedules';
import type { CreateScheduleRequest } from '@/shared/api/types';

const SCHEDULES_QUERY_KEY = ['schedules'];

export function useSchedules() {
  return useQuery({
    queryKey: SCHEDULES_QUERY_KEY,
    queryFn: listSchedules,
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateScheduleRequest) => createSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULES_QUERY_KEY });
      notifications.show({ message: 'Schedule created', color: 'green' });
    },
    onError: (error: Error) => {
      notifications.show({ message: `Failed to create: ${error.message}`, color: 'red' });
    },
  });
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateScheduleRequest> }) =>
      updateSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULES_QUERY_KEY });
      notifications.show({ message: 'Schedule updated', color: 'green' });
    },
    onError: (error: Error) => {
      notifications.show({ message: `Failed to update: ${error.message}`, color: 'red' });
    },
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULES_QUERY_KEY });
      notifications.show({ message: 'Schedule deleted', color: 'green' });
    },
    onError: (error: Error) => {
      notifications.show({ message: `Failed to delete: ${error.message}`, color: 'red' });
    },
  });
}
