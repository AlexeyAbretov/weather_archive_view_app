import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  buildYearRange,
  resolveTargetDate,
  type YearWeatherWindow,
} from '@domain';
import { fetchModeBYear } from '@services';
import type { AnchorDate } from '@types';
import { readExpandedYears, saveExpandedYears } from '@utils';

export type UseModeBLazyWeatherParams = {
  lat: number | null;
  lon: number | null;
  anchorDate: AnchorDate | null;
  enabled?: boolean;
};

const normalizeExpandedYears = (
  anchorDate: AnchorDate | null,
  years: number[],
): number[] => {
  if (anchorDate == null) {
    return [];
  }

  const allowed = new Set(buildYearRange(anchorDate));
  const seen = new Set<number>();

  return years.filter((year) => {
    if (
      !allowed.has(year) ||
      seen.has(year) ||
      resolveTargetDate(anchorDate, year) == null
    ) {
      return false;
    }

    seen.add(year);

    return true;
  });
};

const toWeatherContextKey = (
  lat: number | null,
  lon: number | null,
  anchorDate: AnchorDate | null,
  enabled: boolean,
): string => {
  if (lat == null || lon == null || anchorDate == null) {
    return '';
  }

  const dateKey = `${anchorDate.year}|${anchorDate.month}|${anchorDate.day}`;

  return `${lat}|${lon}|${dateKey}|${enabled ? '1' : '0'}`;
};

export type UseModeBLazyWeatherResult = {
  years: number[];
  windowsByYear: ReadonlyMap<number, YearWeatherWindow>;
  loadingYears: ReadonlySet<number>;
  errorYears: ReadonlyMap<number, Error>;
  expandedYears: number[];
  setExpandedYears: (years: number[]) => void;
  loadYear: (year: number) => void;
  reloadYear: (year: number) => void;
  isYearExpandable: (year: number) => boolean;
};

export const useModeBLazyWeather = ({
  lat,
  lon,
  anchorDate,
  enabled = true,
}: UseModeBLazyWeatherParams): UseModeBLazyWeatherResult => {
  const [windowsByYear, setWindowsByYear] = useState<
    Map<number, YearWeatherWindow>
  >(new Map());
  const [loadingYears, setLoadingYears] = useState<Set<number>>(new Set());
  const [errorYears, setErrorYears] = useState<Map<number, Error>>(new Map());
  const [expandedYears, setExpandedYearsState] = useState<number[]>(() =>
    normalizeExpandedYears(anchorDate, readExpandedYears(lat, lon, anchorDate)),
  );

  const windowsByYearRef = useRef(windowsByYear);
  const loadingYearsRef = useRef(loadingYears);
  const contextKeyRef = useRef<string | null>(null);

  windowsByYearRef.current = windowsByYear;
  loadingYearsRef.current = loadingYears;

  const years = useMemo(
    () => (anchorDate != null ? buildYearRange(anchorDate) : []),
    [anchorDate],
  );

  const isYearExpandable = useCallback(
    (year: number) => {
      if (!enabled || anchorDate == null) {
        return false;
      }

      return resolveTargetDate(anchorDate, year) != null;
    },
    [anchorDate, enabled],
  );

  const fetchYear = useCallback(
    (year: number, force = false) => {
      if (
        !enabled ||
        lat == null ||
        lon == null ||
        anchorDate == null ||
        !isYearExpandable(year)
      ) {
        return;
      }

      if (
        !force &&
        (windowsByYearRef.current.has(year) ||
          loadingYearsRef.current.has(year))
      ) {
        return;
      }

      setLoadingYears((previous) => new Set(previous).add(year));
      setErrorYears((previous) => {
        const next = new Map(previous);

        next.delete(year);

        return next;
      });

      void fetchModeBYear({ lat, lon, anchorDate }, year)
        .then((window) => {
          setWindowsByYear((previous) => new Map(previous).set(year, window));
        })
        .catch((loadError) => {
          setErrorYears((previous) =>
            new Map(previous).set(
              year,
              loadError instanceof Error
                ? loadError
                : new Error('Не удалось загрузить данные года'),
            ),
          );
        })
        .finally(() => {
          setLoadingYears((previous) => {
            const next = new Set(previous);

            next.delete(year);

            return next;
          });
        });
    },
    [anchorDate, enabled, isYearExpandable, lat, lon],
  );

  const loadYear = useCallback(
    (year: number) => {
      fetchYear(year, false);
    },
    [fetchYear],
  );

  const reloadYear = useCallback(
    (year: number) => {
      setWindowsByYear((previous) => {
        const next = new Map(previous);

        next.delete(year);

        return next;
      });
      windowsByYearRef.current.delete(year);
      fetchYear(year, true);
    },
    [fetchYear],
  );

  const setExpandedYears = useCallback(
    (years: number[]) => {
      const nextYears = normalizeExpandedYears(anchorDate, years);

      saveExpandedYears(lat, lon, anchorDate, nextYears);
      setExpandedYearsState(nextYears);
    },
    [anchorDate, lat, lon],
  );

  useEffect(() => {
    const nextKey = toWeatherContextKey(lat, lon, anchorDate, enabled);
    const previousKey = contextKeyRef.current;

    contextKeyRef.current = nextKey;

    const nextYears = normalizeExpandedYears(
      anchorDate,
      readExpandedYears(lat, lon, anchorDate),
    );

    if (previousKey != null && previousKey !== nextKey) {
      setWindowsByYear(new Map());
      setLoadingYears(new Set());
      setErrorYears(new Map());
      windowsByYearRef.current = new Map();
      loadingYearsRef.current = new Set();
      setExpandedYearsState(nextYears);
    }

    if (previousKey == null || previousKey !== nextKey) {
      nextYears.forEach((year) => {
        loadYear(year);
      });
    }
  }, [anchorDate, enabled, lat, lon, loadYear]);

  return {
    years,
    windowsByYear,
    loadingYears,
    errorYears,
    expandedYears,
    setExpandedYears,
    loadYear,
    reloadYear,
    isYearExpandable,
  };
};
