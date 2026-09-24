import { useCallback, useEffect, useState } from 'react';

import type { YearWeatherWindow } from '@domain';
import { fetchModeB } from '@services';
import type { AnchorDate } from '@types';

export type UseModeBWeatherParams = {
  lat: number | null;
  lon: number | null;
  anchorDate: AnchorDate | null;
  enabled?: boolean;
};

export type UseModeBWeatherResult = {
  data: YearWeatherWindow[];
  loading: boolean;
  error: Error | null;
  reload: () => void;
};

export const useModeBWeather = ({
  lat,
  lon,
  anchorDate,
  enabled = true,
}: UseModeBWeatherParams): UseModeBWeatherResult => {
  const [data, setData] = useState<YearWeatherWindow[]>([]);
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
        const windows = await fetchModeB({
          lat: lat!,
          lon: lon!,
          anchorDate: anchorDate!,
        });

        if (!cancelled) {
          setData(windows);
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
