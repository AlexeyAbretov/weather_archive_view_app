import { useEffect, useRef, useState } from 'react';

import { isSearchQueryValid, searchCities } from '@api';
import type { CitySearchResult } from '@types';

const DEBOUNCE_MS = 350;

export type CitySearchStatus = 'idle' | 'loading' | 'empty' | 'error';

type UseCitySearchResult = {
  query: string;
  setQuery: (query: string) => void;
  results: CitySearchResult[];
  status: CitySearchStatus;
  errorMessage: string | null;
};

export const useCitySearch = (initialQuery = ''): UseCitySearchResult => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [status, setStatus] = useState<CitySearchStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const restoredQueryRef = useRef(initialQuery);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (query === restoredQueryRef.current && trimmedQuery.length > 0) {
      return;
    }

    if (!isSearchQueryValid(trimmedQuery)) {
      abortControllerRef.current?.abort();
      setResults([]);
      setStatus('idle');
      setErrorMessage(null);

      return;
    }

    const timeoutId = window.setTimeout(() => {
      abortControllerRef.current?.abort();

      const controller = new AbortController();

      abortControllerRef.current = controller;

      setStatus('loading');
      setErrorMessage(null);

      searchCities(trimmedQuery, controller.signal)
        .then((cities) => {
          if (controller.signal.aborted) {
            return;
          }

          setResults(cities);
          setStatus(cities.length === 0 ? 'empty' : 'idle');
        })
        .catch((error: unknown) => {
          if (controller.signal.aborted) {
            return;
          }

          setResults([]);
          setStatus('error');
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Не удалось выполнить поиск городов',
          );
        });
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
      abortControllerRef.current?.abort();
    };
  }, [query]);

  return {
    query,
    setQuery,
    results,
    status,
    errorMessage,
  };
};
