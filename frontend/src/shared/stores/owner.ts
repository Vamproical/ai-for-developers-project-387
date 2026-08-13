import { create } from 'zustand';
import { getBrowserTimezone } from '@/shared/lib/timezone';

interface OwnerSettings {
  name: string;
  timezone: string;
}

interface OwnerStore {
  settings: OwnerSettings;
  setName: (name: string) => void;
  setTimezone: (timezone: string) => void;
}

export const useOwnerStore = create<OwnerStore>((set) => ({
  settings: {
    name: '',
    timezone: getBrowserTimezone(),
  },
  setName: (name: string) =>
    set((state) => ({
      settings: { ...state.settings, name },
    })),
  setTimezone: (timezone: string) =>
    set((state) => ({
      settings: { ...state.settings, timezone },
    })),
}));
