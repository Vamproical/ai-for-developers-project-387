import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiFetch, ApiRequestError, BASE_URL } from '../client';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
  vi.clearAllMocks();
});

describe('apiFetch', () => {
  it('returns JSON data on successful response', async () => {
    const mockData = { items: [{ id: '1', name: 'Test' }] };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockData),
    }));

    const result = await apiFetch('/event-types');
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/event-types`,
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });

  it('returns undefined on 204 response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
    }));

    const result = await apiFetch('/event-types/1');
    expect(result).toBeUndefined();
  });

  it('throws ApiRequestError on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: () => Promise.resolve({ code: 404, message: 'Not found' }),
    }));

    await expect(apiFetch('/event-types/999')).rejects.toThrow(ApiRequestError);
    await expect(apiFetch('/event-types/999')).rejects.toMatchObject({
      status: 404,
    });
  });

  it('sends POST body correctly', async () => {
    const mockData = { id: '1', name: 'New Type', description: 'Test', durationMinutes: 30 };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockData),
    }));

    await apiFetch('/event-types', {
      method: 'POST',
      body: JSON.stringify({ name: 'New Type', description: 'Test', durationMinutes: 30 }),
    });

    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/event-types`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'New Type', description: 'Test', durationMinutes: 30 }),
      }),
    );
  });
});
