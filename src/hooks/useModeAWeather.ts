import type { Dayjs } from 'dayjs';
import { useCallback, useEffect, useState } from 'react';

import type { YearWeatherRow } from '../domain/weather/weatherDayRecord.ts';
import { fetchModeA } from '../services/weather/archiveWeatherService.ts';

export type UseModeAWeatherParams = {
  lat: number | null;
  lon: number | null;
  anchorDate: Dayjs | null;
  enabled?: boolean;
};

export type UseModeAWeatherResult = {
  data: YearWeatherRow[];
  loading: boolean;
  error: Error | null;
  reload: () => void;
};

export const useModeAWeather = ({
  lat,
  lon,
  anchorDate,
  enabled = true,
}: UseModeAWeatherParams): UseModeAWeatherResult => {
  const [data, setData] = useState<YearWeatherRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => {
    setReloadToken((value) => value + 1);
  }, []);

  useEffect(() => {
    if (!enabled || lat == null || lon == null || anchorDate == null) {
      setData([]);
      setLoading(false);
      setError(null);

      return;
    }

    let cancelled = false;

    const load = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const rows = await fetchModeA({
          lat: lat!,
          lon: lon!,
          anchorDate: anchorDate!,
        });

        if (!cancelled) {
          setData(rows);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError
              : new Error('Не удалось загрузить архив погоды'),
          );
          setData([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [anchorDate, enabled, lat, lon, reloadToken]);

  return { data, loading, error, reload };
};
