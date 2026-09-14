import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchDailyRange } from '../../api/archiveClient';
import type { DailyWeather } from '../../domain/dailyWeather';
import { buildYearWindow, getDatesForYearWindow, isFutureArchiveDate } from '../../domain/yearWindowService';
import type { YearWeatherCacheEntry } from './types';

type UseArchiveModeBDataParams = {
  latitude: number;
  longitude: number;
  timezone: string;
  anchorDate: string;
};

function makeCacheKey(lat: number, lon: number, anchorDate: string, year: number): string {
  return `${lat},${lon},${anchorDate},${year}`;
}

export function useArchiveModeBData({
  latitude,
  longitude,
  timezone,
  anchorDate,
}: UseArchiveModeBDataParams) {
  const [cache, setCache] = useState<Map<string, YearWeatherCacheEntry>>(new Map());
  const cacheRef = useRef(cache);
  cacheRef.current = cache;

  const years = buildYearWindow(anchorDate, 'B').map((slot) => ({
    year: slot.year,
    unavailable: slot.unavailable,
    startDate: slot.startDate,
    endDate: slot.endDate,
  }));

  useEffect(() => {
    setCache(new Map());
  }, [latitude, longitude, anchorDate]);

  const loadYear = useCallback(
    async (year: number, prefetchNeighbors = true) => {
      const slots = buildYearWindow(anchorDate, 'B');
      const slot = slots.find((item) => item.year === year);
      if (!slot || slot.unavailable || !slot.startDate || !slot.endDate) {
        return;
      }

      const key = makeCacheKey(latitude, longitude, anchorDate, year);
      const existing = cacheRef.current.get(key);
      if (existing?.status === 'loading' || existing?.status === 'success') {
        return;
      }

      setCache((prev) => {
        const next = new Map(prev);
        next.set(key, { status: 'loading', days: new Map() });
        return next;
      });

      try {
        const dailyList = await fetchDailyRange(
          latitude,
          longitude,
          slot.startDate,
          slot.endDate,
          timezone,
        );

        const daysMap = new Map<string, DailyWeather | null>();
        const dateSlots = getDatesForYearWindow(anchorDate, year);

        for (const { date } of dateSlots) {
          if (!date) {
            continue;
          }
          if (isFutureArchiveDate(date)) {
            daysMap.set(date, null);
            continue;
          }
          const found = dailyList.find((item) => item.date === date) ?? null;
          daysMap.set(date, found);
        }

        setCache((prev) => {
          const next = new Map(prev);
          next.set(key, { status: 'success', days: daysMap });
          return next;
        });
      } catch {
        setCache((prev) => {
          const next = new Map(prev);
          next.set(key, {
            status: 'error',
            days: new Map(),
            error: 'Не удалось загрузить данные',
          });
          return next;
        });
      }

      if (prefetchNeighbors) {
        void loadYear(year - 1, false);
        void loadYear(year + 1, false);
      }
    },
    [latitude, longitude, timezone, anchorDate],
  );

  const getEntry = useCallback(
    (year: number): YearWeatherCacheEntry | undefined => {
      const key = makeCacheKey(latitude, longitude, anchorDate, year);
      return cache.get(key);
    },
    [cache, latitude, longitude, anchorDate],
  );

  const getWeatherForDay = useCallback(
    (year: number, date: string | null): DailyWeather | null | undefined => {
      if (!date) {
        return null;
      }
      const entry = getEntry(year);
      if (!entry) {
        return undefined;
      }
      if (entry.status !== 'success') {
        return undefined;
      }
      return entry.days.get(date) ?? null;
    },
    [getEntry],
  );

  return { years, loadYear, getEntry, getWeatherForDay };
}
