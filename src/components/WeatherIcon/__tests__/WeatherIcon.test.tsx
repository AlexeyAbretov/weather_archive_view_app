import { describe, expect, it } from 'vitest';

import type { WeatherDayRecord } from '@domain';

import { noDataDay, weatherDay } from '../../../../test/fixtures';
import { renderWithLocale } from '../../../../test/render';
import { WeatherIcon } from '../WeatherIcon';

const picture = (container: HTMLElement) => {
  const svg = container.querySelector('svg');

  if (!svg) {
    throw new Error('картинка не найдена');
  }

  return svg;
};

const renderIcon = (overrides: Partial<WeatherDayRecord> = {}) => {
  return renderWithLocale(<WeatherIcon record={weatherDay(overrides)} />);
};

const titleOf = (container: HTMLElement): string | null => {
  return container.querySelector('[title]')?.getAttribute('title') ?? null;
};

describe('WeatherIcon', () => {
  it('рисует небо без осадков и подпись облачности', () => {
    const { container, rerender } = renderIcon({
      cloudCover: 10,
      iconKey: 'clear',
      precipitationMm: 0,
      precipitationType: 'none',
      weatherCode: 0,
    });

    expect(picture(container).dataset.sky).toBe('clear');
    expect(picture(container).dataset.precipitation).toBe('none');
    expect(picture(container).dataset.intensity).toBeUndefined();
    expect(titleOf(container)).toBe('Ясно, без осадков');
    expect(container).toMatchSnapshot();

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: 40,
          precipitationMm: 0,
          precipitationType: 'none',
          weatherCode: 2,
        })}
      />,
    );
    expect(picture(container).dataset.sky).toBe('partly');

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: 90,
          precipitationMm: 0,
          precipitationType: 'none',
          weatherCode: 3,
        })}
      />,
    );
    expect(picture(container).dataset.sky).toBe('overcast');

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: undefined,
          iconKey: 'fog',
          precipitationMm: 0,
          precipitationType: 'none',
          weatherCode: 45,
        })}
      />,
    );
    expect(picture(container).dataset.sky).toBe('fog');

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: undefined,
          iconKey: 'clear',
          precipitationMm: 0,
          precipitationType: 'none',
          weatherCode: 0,
        })}
      />,
    );
    expect(picture(container).dataset.sky).toBe('clear');

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: undefined,
          iconKey: 'mainly-clear',
          precipitationMm: 0,
          precipitationType: 'none',
          weatherCode: 1,
        })}
      />,
    );
    expect(picture(container).dataset.sky).toBe('mainly');

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: undefined,
          iconKey: 'partly-cloudy',
          precipitationMm: 0,
          precipitationType: 'none',
          weatherCode: 2,
        })}
      />,
    );
    expect(picture(container).dataset.sky).toBe('partly');

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: undefined,
          iconKey: 'overcast',
          precipitationMm: 0,
          precipitationType: 'none',
          weatherCode: 3,
        })}
      />,
    );
    expect(picture(container).dataset.sky).toBe('overcast');

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: undefined,
          iconKey: undefined,
          precipitationMm: undefined,
          precipitationType: undefined,
          weatherCode: undefined,
        })}
      />,
    );
    expect(picture(container).dataset.sky).toBe('unknown');

    rerender(<WeatherIcon record={noDataDay('feb29')} />);
    expect(container.querySelector('svg')).toBeNull();

    rerender(<WeatherIcon record={noDataDay(undefined)} />);
    expect(container.querySelector('svg')).toBeNull();
  });

  it('меняет картинку по типу и интенсивности осадков', () => {
    const { container, rerender } = renderIcon({
      cloudCover: 80,
      precipitationMm: 0.4,
      precipitationType: 'rain',
      weatherCode: 61,
    });

    const lightRain = picture(container).innerHTML;

    expect(picture(container).dataset.precipitation).toBe('rain');
    expect(picture(container).dataset.intensity).toBe('light');

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: 80,
          precipitationMm: 3,
          precipitationType: 'rain',
          weatherCode: 63,
        })}
      />,
    );
    expect(picture(container).dataset.intensity).toBe('moderate');
    expect(picture(container).innerHTML).not.toBe(lightRain);

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: 80,
          precipitationMm: 12,
          precipitationType: 'rain',
          weatherCode: 65,
        })}
      />,
    );
    const heavyRain = picture(container).innerHTML;

    expect(picture(container).dataset.intensity).toBe('heavy');
    expect(heavyRain).not.toBe(lightRain);

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: 80,
          precipitationMm: 0.2,
          precipitationType: 'rain',
          weatherCode: 65,
        })}
      />,
    );
    expect(picture(container).dataset.intensity).toBe('heavy');

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: 80,
          precipitationMm: 20,
          precipitationType: 'rain',
          weatherCode: 61,
        })}
      />,
    );
    expect(picture(container).dataset.intensity).toBe('heavy');

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: 80,
          iconKey: 'snow',
          precipitationMm: 2,
          precipitationType: 'snow',
          weatherCode: 73,
        })}
      />,
    );
    expect(picture(container).dataset.precipitation).toBe('snow');
    expect(picture(container).innerHTML).not.toBe(heavyRain);

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: 80,
          iconKey: 'drizzle',
          precipitationMm: 0.2,
          precipitationType: 'rain',
          weatherCode: 51,
        })}
      />,
    );
    const lightDrizzle = picture(container).innerHTML;

    expect(picture(container).dataset.precipitation).toBe('drizzle');
    expect(picture(container).dataset.intensity).toBe('light');

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: 72,
          iconKey: 'drizzle',
          precipitationMm: 12.9,
          precipitationType: 'rain',
          weatherCode: 51,
        })}
      />,
    );
    expect(picture(container).dataset.precipitation).toBe('rain');
    expect(picture(container).dataset.intensity).toBe('heavy');
    expect(titleOf(container)).toBe('Пасмурно, сильный дождь');

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: 80,
          iconKey: 'drizzle',
          precipitationMm: 2,
          precipitationType: 'rain',
          weatherCode: 53,
        })}
      />,
    );
    expect(picture(container).dataset.intensity).toBe('moderate');
    expect(picture(container).innerHTML).not.toBe(lightDrizzle);

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: 80,
          iconKey: 'drizzle',
          precipitationMm: 0.2,
          precipitationType: 'rain',
          weatherCode: 55,
        })}
      />,
    );
    expect(picture(container).dataset.precipitation).toBe('drizzle');
    expect(picture(container).dataset.intensity).toBe('heavy');

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: 80,
          iconKey: 'freezing-drizzle',
          precipitationMm: 0,
          precipitationType: 'drizzle',
          weatherCode: 3,
        })}
      />,
    );
    expect(picture(container).dataset.precipitation).toBe('freezing_rain');

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: 80,
          iconKey: 'freezing-rain',
          precipitationMm: 0,
          precipitationType: 'rain',
          weatherCode: 3,
        })}
      />,
    );
    expect(picture(container).dataset.precipitation).toBe('freezing_rain');

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: 80,
          iconKey: undefined,
          precipitationMm: 0,
          precipitationType: 'rain',
          weatherCode: 66,
        })}
      />,
    );
    expect(picture(container).dataset.precipitation).toBe('freezing_rain');
    expect(picture(container).dataset.intensity).toBe('light');

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: 80,
          iconKey: 'thunderstorm',
          precipitationMm: 0,
          precipitationType: 'rain',
          weatherCode: 95,
        })}
      />,
    );
    expect(picture(container).dataset.precipitation).toBe('thunderstorm');
    expect(picture(container).dataset.intensity).toBe('moderate');

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: 80,
          iconKey: 'thunderstorm-hail',
          precipitationMm: 0,
          precipitationType: 'rain',
          weatherCode: 99,
        })}
      />,
    );
    expect(picture(container).dataset.precipitation).toBe('hail');
    expect(picture(container).dataset.intensity).toBe('heavy');

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: 40,
          precipitationMm: 0.2,
          precipitationType: 'mixed',
          weatherCode: 61,
        })}
      />,
    );
    expect(picture(container).dataset.precipitation).toBe('mixed');
    expect(picture(container).dataset.intensity).toBe('light');

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: 40,
          precipitationMm: 1.5,
          precipitationType: 'mixed',
          weatherCode: 61,
        })}
      />,
    );
    const mixed = picture(container).innerHTML;

    expect(picture(container).dataset.precipitation).toBe('mixed');
    expect(picture(container).dataset.intensity).toBe('moderate');
    expect(picture(container).dataset.sky).toBe('partly');

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: 40,
          precipitationMm: 12,
          precipitationType: 'mixed',
          weatherCode: 61,
        })}
      />,
    );
    expect(picture(container).dataset.intensity).toBe('heavy');
    expect(picture(container).innerHTML).not.toBe(mixed);

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: 80,
          iconKey: undefined,
          precipitationMm: 4,
          precipitationType: undefined,
          weatherCode: undefined,
        })}
      />,
    );
    expect(picture(container).dataset.precipitation).toBe('none');

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: 80,
          iconKey: 'rain',
          precipitationMm: undefined,
          precipitationType: 'rain',
          weatherCode: undefined,
        })}
      />,
    );
    expect(picture(container).dataset.precipitation).toBe('rain');
    expect(picture(container).dataset.intensity).toBe('light');

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: 80,
          iconKey: 'rain',
          precipitationMm: 4,
          precipitationType: 'rain',
          weatherCode: 0,
        })}
      />,
    );
    expect(picture(container).dataset.intensity).toBe('moderate');

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: 80,
          iconKey: 'freezing-rain',
          precipitationMm: 0,
          precipitationType: 'rain',
          weatherCode: undefined,
        })}
      />,
    );
    expect(picture(container).dataset.precipitation).toBe('freezing_rain');

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: 80,
          iconKey: undefined,
          precipitationMm: 2,
          precipitationType: undefined,
          weatherCode: 73,
        })}
      />,
    );
    expect(picture(container).dataset.precipitation).toBe('snow');
  });

  it('различает преимущественно ясно и переменную облачность', () => {
    const { container, rerender } = renderIcon({
      cloudCover: 31,
      iconKey: 'mainly-clear',
      precipitationMm: 0.3,
      precipitationType: 'rain',
      weatherCode: 1,
    });

    expect(picture(container).dataset.sky).toBe('mainly');
    expect(titleOf(container)).toBe('Преимущественно ясно, слабый дождь');

    rerender(
      <WeatherIcon
        record={weatherDay({
          cloudCover: 46,
          iconKey: 'partly-cloudy',
          precipitationMm: 0.8,
          precipitationType: 'rain',
          weatherCode: 2,
        })}
      />,
    );
    expect(picture(container).dataset.sky).toBe('partly');
    expect(titleOf(container)).toBe('Переменная облачность, слабый дождь');
  });
});
