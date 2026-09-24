import { beforeEach, describe, expect, it, vi } from 'vitest';

import { isSearchQueryValid, searchCities } from '../GeocodingApi';

const jsonResponse = (body: unknown, ok = true, status = 200) => {
  return {
    ok,
    status,
    json: async () => body,
  };
};

describe('searchCities', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('отклоняет короткий запрос', async () => {
    expect(isSearchQueryValid(' a ')).toBe(false);

    await expect(searchCities(' a ')).resolves.toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('ищет города, кэширует и собирает подпись', async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse({
        results: [
          {
            id: 1,
            name: 'Москва',
            latitude: 55.75,
            longitude: 37.62,
            admin1: 'Москва',
            country: 'Россия',
          },
          {
            id: 2,
            name: 'Тула',
            latitude: 54.2,
            longitude: 37.6,
            admin1: 'Тульская область',
          },
          {
            id: 3,
            name: 'Село',
            latitude: 50,
            longitude: 40,
          },
        ],
      }) as Response,
    );

    const signal = new AbortController().signal;
    const first = await searchCities('  Москва ', signal);
    const cached = await searchCities('москва');

    expect(first[0]).toEqual({
      name: 'Москва',
      lat: 55.75,
      lon: 37.62,
      label: 'Москва, Москва, Россия',
    });
    expect(first[1]?.label).toBe('Тула, Тульская область');
    expect(first[2]?.label).toBe('Село');
    expect(cached).toBe(first);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(vi.mocked(fetch).mock.calls[0]?.[1]).toMatchObject({ signal });
  });

  it('бросает ошибку HTTP и ошибку API', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({}, false, 503) as Response,
    );

    await expect(searchCities('Омск')).rejects.toThrow('HTTP 503');

    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ error: true, reason: 'лимит' }) as Response,
    );

    await expect(searchCities('Томск')).rejects.toThrow('лимит');

    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ error: true }) as Response,
    );

    await expect(searchCities('Псков')).rejects.toThrow(
      'Geocoding API вернул ошибку',
    );
  });

  it('возвращает пустой список без results и обрезает кэш', async () => {
    vi.mocked(fetch).mockImplementation(async (input) => {
      const name = new URL(String(input)).searchParams.get('name');

      return jsonResponse({
        results: name === 'пусто' ? undefined : [],
      }) as Response;
    });

    await expect(searchCities('пусто')).resolves.toEqual([]);

    for (let index = 0; index < 21; index += 1) {
      await searchCities(`город${index}`);
    }

    await expect(searchCities('город0')).resolves.toEqual([]);
    expect(fetch).toHaveBeenCalled();
  });
});
