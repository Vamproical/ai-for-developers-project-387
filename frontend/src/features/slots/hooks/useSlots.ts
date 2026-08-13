import { useQuery } from '@tanstack/react-query';
import { listSlots } from '@/shared/api/slots';
import type { Slot } from '@/shared/api/types';

interface UseSlotsParams {
  from?: string;
  to?: string;
  eventTypeId?: string;
}

const SLOTS_QUERY_KEY = 'slots';

export function useSlots(params: UseSlotsParams = {}) {
  return useQuery<Slot[]>({
    queryKey: [SLOTS_QUERY_KEY, params],
    queryFn: () => listSlots(params),
    retry: false,
  });
}
