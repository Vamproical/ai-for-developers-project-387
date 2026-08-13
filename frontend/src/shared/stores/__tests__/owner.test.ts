import { describe, it, expect, beforeEach } from 'vitest';
import { useOwnerStore } from '../owner';

describe('owner store', () => {
  beforeEach(() => {
    useOwnerStore.setState({
      settings: { name: '', timezone: 'UTC' },
    });
  });

  it('has default settings', () => {
    const state = useOwnerStore.getState();
    expect(state.settings).toBeDefined();
    expect(state.settings.name).toBe('');
    expect(state.settings.timezone).toBe('UTC');
  });

  it('updates name', () => {
    useOwnerStore.getState().setName('Test Owner');
    expect(useOwnerStore.getState().settings.name).toBe('Test Owner');
  });

  it('updates timezone', () => {
    useOwnerStore.getState().setTimezone('America/New_York');
    expect(useOwnerStore.getState().settings.timezone).toBe('America/New_York');
  });
});
