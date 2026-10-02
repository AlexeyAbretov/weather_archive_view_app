import { describe, expect, it } from 'vitest';

import {
  formatPrecipitationMm,
  formatTemperature,
  formatWindDirection,
  formatWindSpeed,
} from '../formatters';

describe('formatters', () => {
  it('форматирует температуру', () => {
    expect(formatTemperature(undefined)).toBe('—');
    expect(formatTemperature(16.6)).toBe('+17°');
    expect(formatTemperature(-1.2)).toBe('-1°');
    expect(formatTemperature(0)).toBe('0°');
  });

  it('форматирует осадки', () => {
    expect(formatPrecipitationMm(undefined)).toBe('—');
    expect(formatPrecipitationMm(0)).toBe('0 мм');
    expect(formatPrecipitationMm(1.26)).toBe('1.3 мм');
  });

  it('форматирует ветер', () => {
    expect(formatWindSpeed(undefined)).toBe('—');
    expect(formatWindSpeed(16.4)).toBe('16 км/ч');
  });

  it('расшифровывает направление ветра', () => {
    expect(formatWindDirection(undefined)).toBeUndefined();
    expect(formatWindDirection(Number.NaN)).toBeUndefined();
    expect(formatWindDirection(0)).toBe('С');
    expect(formatWindDirection(45)).toBe('СВ');
    expect(formatWindDirection(90)).toBe('В');
    expect(formatWindDirection(135)).toBe('ЮВ');
    expect(formatWindDirection(180)).toBe('Ю');
    expect(formatWindDirection(225)).toBe('ЮЗ');
    expect(formatWindDirection(270)).toBe('З');
    expect(formatWindDirection(315)).toBe('СЗ');
    expect(formatWindDirection(360)).toBe('С');
    expect(formatWindDirection(22)).toBe('С');
    expect(formatWindDirection(23)).toBe('СВ');
    expect(formatWindDirection(-45)).toBe('СЗ');
  });
});
