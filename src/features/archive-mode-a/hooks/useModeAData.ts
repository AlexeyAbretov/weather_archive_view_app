import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchDailyForDate } from '../../../api/archiveClient';
import type { DailyWeather } from '../../../domain/dailyWeather';
import { buildYearWindow, isFutureArchiveDate } from '../../../domain/yearWindowService';

export type YearColumnState = {
  year: number;
  status: 'idle' | 'loading' | 'loaded' | 'unavailable' | 'error';
  weather: DailyWeather | null;
};

type UseModeADataParams = {
  latitude: number;
  longitude: number;
  timezone: string;
  anchorDate: string;
};

export function useModeAData({ latitude, longitude, timezone, anchorDate }: UseModeADataParams) {
  const [columns, setColumns] = useState<YearColumnState[]>([]);
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    const slots = buildYearWindow(anchorDate, 'A');

    const initial: YearColumnState[] = slots.map((slot) => ({
      year: slot.year,
      status: slot.unavailable ? 'unavailable' : 'idle',
      weather: null,
    }));
    setColumns(initial);

    for (const slot of slots) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      if (slot.unavailable || !slot.startDate) {
        continue;
      }

      if (isFutureArchiveDate(slot.startDate)) {
        setColumns((prev) =>
          prev.map((col) =>
            col.year === slot.year ? { ...col, status: 'unavailable', weather: null } : col,
          ),
        );
        continue;
      }

      setColumns((prev) =>
        prev.map((col) => (col.year === slot.year ? { ...col, status: 'loading' } : col)),
      );

      try {
        const weather = await fetchDailyForDate(
          latitude,
          longitude,
          slot.startDate,
          timezone,
        );

        if (requestId !== requestIdRef.current) {
          return;
        }

        setColumns((prev) =>
          prev.map((col) =>
            col.year === slot.year
              ? { ...col, status: 'loaded', weather }
              : col,
          ),
        );
      } catch {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setColumns((prev) =>
          prev.map((col) =>
            col.year === slot.year ? { ...col, status: 'error', weather: null } : col,
          ),
        );
      }
    }
  }, [latitude, longitude, timezone, anchorDate]);

  useEffect(() => {
    void load();
  }, [load]);

  const loadedCount = columns.filter((col) => col.status === 'loaded' || col.status === 'unavailable').length;

  return { columns, loadedCount, totalCount: columns.length, reload: load };
}
