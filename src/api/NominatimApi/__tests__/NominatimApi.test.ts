import { beforeEach, describe, expect, it, vi } from 'vitest';

import { reverseGeocode } from '../NominatimApi';

const jsonResponse = (body: unknown, ok = true, status = 200) => {
  return {
    ok,
    status,
    json: async () => body,
  };
};

describe('reverseGeocode', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('берёт название из адреса по приоритету', async () => {
    const signal = new AbortController().signal;

    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ address: { city: 'Москва', town: 'Химки' } }) as Response,
    );

    await expect(reverseGeocode(55, 37, signal)).resolves.toEqual([
      'Москва',
      'Химки',
    ]);

    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ address: { town: 'Химки' } }) as Response,
    );
    await expect(reverseGeocode(1, 2)).resolves.toEqual(['Химки']);

    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ address: { village: 'Село' } }) as Response,
    );
    await expect(reverseGeocode(1, 2)).resolves.toEqual(['Село']);

    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ address: { municipality: 'Округ' } }) as Response,
    );
    await expect(reverseGeocode(1, 2)).resolves.toEqual(['Округ']);

    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        address: {
          hamlet: 'Толстяково',
          county: 'городской округ Солнечногорск',
        },
      }) as Response,
    );
    await expect(reverseGeocode(1, 2)).resolves.toEqual([
      'Толстяково',
      'Солнечногорск',
    ]);

    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ address: {} }) as Response,
    );
    await expect(reverseGeocode(1, 2)).resolves.toEqual([]);

    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({}) as Response);
    await expect(reverseGeocode(1, 2)).resolves.toEqual([]);

    expect(String(vi.mocked(fetch).mock.calls[0]?.[0])).toContain('zoom=14');
    expect(vi.mocked(fetch).mock.calls[0]?.[1]).toMatchObject({
      signal,
    });
  });

  it('бросает ошибку HTTP', async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse({}, false, 429) as Response,
    );

    await expect(reverseGeocode(1, 2)).rejects.toThrow('HTTP 429');
  });
});
