import { useCallback, useState } from 'react';

type GeolocationState = {
  loading: boolean;
  error: string | null;
};

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({ loading: false, error: null });

  const requestLocation = useCallback((): Promise<{ lat: number; lon: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const message = 'Геолокация недоступна в этом браузере';
        setState({ loading: false, error: message });
        reject(new Error(message));
        return;
      }

      setState({ loading: true, error: null });

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState({ loading: false, error: null });
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        () => {
          const message = 'Разрешите доступ к местоположению или выберите город вручную';
          setState({ loading: false, error: message });
          reject(new Error(message));
        },
        { enableHighAccuracy: false, timeout: 10_000 },
      );
    });
  }, []);

  return { ...state, requestLocation };
}
