import { apiFetch, buildQueryString } from './client';
import type { Slot, SlotList, CreateSlotRequest } from './types';

interface ListSlotsParams {
  eventTypeId?: string;
  from?: string;
  to?: string;
}

export async function listSlots(params: ListSlotsParams = {}): Promise<Slot[]> {
  const qs = buildQueryString({
    eventTypeId: params.eventTypeId,
    from: params.from,
    to: params.to,
  });
  const result = await apiFetch<SlotList>(`/slots${qs}`);
  return result.items;
}

export async function createSlot(data: CreateSlotRequest): Promise<Slot> {
  return apiFetch<Slot>('/slots', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
