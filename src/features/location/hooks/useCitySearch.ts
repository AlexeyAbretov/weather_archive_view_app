import { useEffect, useRef, useState } from 'react';
import { searchLocations } from '../../../api/geocodingClient';
import type { Location } from '../../../domain/location';

export function useCitySearch(query: string) {
  const [options, setOptions] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setOptions([]);
      return;
    }

    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      try {
        const results = await searchLocations(trimmed);
        if (!controller.signal.aborted) {
          setOptions(results);
        }
      } catch {
        if (!controller.signal.aborted) {
          setOptions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [query]);

  return { options, loading };
}
