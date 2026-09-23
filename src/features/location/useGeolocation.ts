import { message } from 'antd';
import { useCallback, useState } from 'react';

import type { SelectedLocation } from './location.types';
import { reverseGeocode } from './nominatimApi';

const GEOLOCATION_TIMEOUT_MS = 10_000;

type GeolocationPosition = {
  lat: number;
  lon: number;
};

const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation недоступен в этом браузере'));

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: false,
        timeout: GEOLOCATION_TIMEOUT_MS,
        maximumAge: 60_000,
      },
    );
  });
};

const formatCoordinatesFallback = (lat: number, lon: number): string => {
  return `Моё местоположение (${lat.toFixed(2)}, ${lon.toFixed(2)})`;
};

type UseGeolocationResult = {
  isLocating: boolean;
  detectLocation: () => Promise<SelectedLocation | null>;
};

export const useGeolocation = (): UseGeolocationResult => {
  const [isLocating, setIsLocating] = useState(false);

  const detectLocation =
    useCallback(async (): Promise<SelectedLocation | null> => {
      setIsLocating(true);

      try {
        const position = await getCurrentPosition();
        let name: string;

        try {
          const cityName = await reverseGeocode(position.lat, position.lon);

          name =
            cityName ?? formatCoordinatesFallback(position.lat, position.lon);
        } catch {
          name = formatCoordinatesFallback(position.lat, position.lon);
        }

        return {
          name,
          lat: position.lat,
          lon: position.lon,
        };
      } catch (error) {
        const isDenied =
          error instanceof GeolocationPositionError &&
          error.code === error.PERMISSION_DENIED;

        if (isDenied) {
          message.info(
            'Доступ к геолокации запрещён. Выберите город через поиск.',
          );
        } else {
          message.info(
            'Не удалось определить местоположение. Выберите город через поиск.',
          );
        }

        return null;
      } finally {
        setIsLocating(false);
      }
    }, []);

  return {
    isLocating,
    detectLocation,
  };
};
