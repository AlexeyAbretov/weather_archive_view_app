import { message } from 'antd';
import { useCallback, useState } from 'react';

import { reverseGeocode, searchCities } from '@api';
import type { CitySearchResult, SelectedLocation } from '@types';

const GEOLOCATION_TIMEOUT_MS = 10_000;
const EARTH_RADIUS_KM = 6371;
const MAX_CITY_DISTANCE_KM = 100;
const CITY_NOT_FOUND_MESSAGE =
  'Не удалось найти ближайший город. Выберите город через поиск.';

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

const toRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

const distanceKm = (
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number,
): number => {
  const latDelta = toRadians(toLat - fromLat);
  const lonDelta = toRadians(toLon - fromLon);
  const fromLatRad = toRadians(fromLat);
  const toLatRad = toRadians(toLat);
  const haversine =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(fromLatRad) * Math.cos(toLatRad) * Math.sin(lonDelta / 2) ** 2;

  return EARTH_RADIUS_KM * 2 * Math.asin(Math.min(1, Math.sqrt(haversine)));
};

const pickNearestCity = (
  cities: CitySearchResult[],
  lat: number,
  lon: number,
): CitySearchResult | null => {
  let nearest: CitySearchResult | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const city of cities) {
    const distance = distanceKm(lat, lon, city.lat, city.lon);

    if (distance < nearestDistance) {
      nearest = city;
      nearestDistance = distance;
    }
  }

  if (!nearest || nearestDistance > MAX_CITY_DISTANCE_KM) {
    return null;
  }

  return nearest;
};

const findNearestCity = async (
  lat: number,
  lon: number,
): Promise<SelectedLocation | null> => {
  let placeNames: string[];

  try {
    placeNames = await reverseGeocode(lat, lon);
  } catch {
    return null;
  }

  if (placeNames.length === 0) {
    return null;
  }

  for (const placeName of placeNames) {
    try {
      const cities = await searchCities(placeName);
      const nearest = pickNearestCity(cities, lat, lon);

      if (nearest) {
        return nearest;
      }
    } catch {
      return null;
    }
  }

  return null;
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
        const nearest = await findNearestCity(position.lat, position.lon);

        if (!nearest) {
          message.info(CITY_NOT_FOUND_MESSAGE);

          return null;
        }

        return nearest;
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
