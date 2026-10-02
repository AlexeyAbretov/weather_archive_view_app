import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  clearSelectedLocation,
  readSelectedLocation,
  saveSelectedLocation,
  SELECTED_LOCATION_STORAGE_KEY,
} from '../LocationProvider.utils';

const moscow = {
  name: 'Москва',
  label: 'Москва, Москва, Россия',
  lat: 55.75,
  lon: 37.62,
};

describe('selectedLocationStorage', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('читает сохранённый город и очищает его', () => {
    expect(readSelectedLocation()).toBeNull();

    saveSelectedLocation({
      ...moscow,
      name: '  Москва  ',
      label: '  Москва, Москва, Россия  ',
    });

    expect(readSelectedLocation()).toEqual(moscow);
    expect(localStorage.getItem(SELECTED_LOCATION_STORAGE_KEY)).toContain(
      'Москва, Москва, Россия',
    );

    clearSelectedLocation();

    expect(readSelectedLocation()).toBeNull();
  });

  it('игнорирует повреждённую запись', () => {
    const invalidValues = [
      'не json',
      'null',
      '[]',
      JSON.stringify({ name: ' ', lat: 1, lon: 2 }),
      JSON.stringify({ name: 'Москва', lat: '1', lon: 2 }),
      JSON.stringify({ name: 'Москва', lat: 1, lon: null }),
      JSON.stringify({ lat: 0, lon: 0 }),
    ];

    invalidValues.forEach((value) => {
      localStorage.setItem(SELECTED_LOCATION_STORAGE_KEY, value);

      expect(readSelectedLocation()).toBeNull();
    });

    localStorage.setItem(
      SELECTED_LOCATION_STORAGE_KEY,
      JSON.stringify({ name: 'Москва', lat: 1, lon: 2 }),
    );

    expect(readSelectedLocation()).toEqual({
      name: 'Москва',
      label: 'Москва',
      lat: 1,
      lon: 2,
    });

    saveSelectedLocation({
      name: 'Нулевой меридиан',
      label: ' ',
      lat: 0,
      lon: 0,
    });

    expect(readSelectedLocation()).toEqual({
      name: 'Нулевой меридиан',
      label: 'Нулевой меридиан',
      lat: 0,
      lon: 0,
    });
  });

  it('не падает, если хранилище недоступно', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied');
    });

    expect(readSelectedLocation()).toBeNull();

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });

    expect(() => {
      saveSelectedLocation(moscow);
    }).not.toThrow();

    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('denied');
    });

    expect(() => {
      clearSelectedLocation();
    }).not.toThrow();
  });
});
