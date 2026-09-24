import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchForecast, ForecastApiError } from '../ForecastApi';

const jsonResponse = (body: unknown, ok = true, status = 200) => {
  return {
    ok,
    status,
    json: async () => body,
  };
};

describe('fetchForecast', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('запрашивает прогноз и возвращает ответ', async () => {
    const payload = { daily: { time: ['2026-09-24'] } };
    const signal = new AbortController().signal;

    vi.mocked(fetch).mockResolvedValue(jsonResponse(payload) as Response);

    await expect(
      fetchForecast({
        lat: 55.75,
        lon: 37.62,
        startDate: '2026-09-24',
        endDate: '2026-09-24',
        signal,
      }),
    ).resolves.toEqual(payload);

    const url = String(vi.mocked(fetch).mock.calls[0]?.[0]);

    expect(url).toContain('https://api.open-meteo.com/v1/forecast');
    expect(url).toContain('latitude=55.75');
    expect(url).toContain('start_date=2026-09-24');
    expect(url).toContain('end_date=2026-09-24');
    expect(vi.mocked(fetch).mock.calls[0]?.[1]).toEqual({ signal });
  });

  it('бросает ошибку HTTP с причиной и без неё', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ reason: 'нет данных' }, false, 400) as Response,
    );

    await expect(fetchForecast(request())).rejects.toMatchObject({
      name: 'ForecastApiError',
      status: 400,
      reason: 'нет данных',
    });

    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ error: true }, false, 500) as Response,
    );

    await expect(fetchForecast(request())).rejects.toMatchObject({
      status: 500,
      reason: undefined,
    });
  });

  it('бросает ошибку тела ответа', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ error: true, reason: 'лимит' }) as Response,
    );

    await expect(fetchForecast(request())).rejects.toMatchObject({
      message: 'лимит',
      reason: 'лимит',
    });

    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ error: true }) as Response,
    );

    await expect(fetchForecast(request())).rejects.toMatchObject({
      message: 'Open-Meteo Forecast API вернул ошибку',
    });
  });

  it('сохраняет поля ошибки', () => {
    const error = new ForecastApiError('сбой', 404, 'missing');

    expect(error).toBeInstanceOf(Error);
    expect(error.status).toBe(404);
    expect(error.reason).toBe('missing');
  });
});

const request = () => {
  return {
    lat: 1,
    lon: 2,
    startDate: '2026-09-24',
    endDate: '2026-09-25',
  };
};
