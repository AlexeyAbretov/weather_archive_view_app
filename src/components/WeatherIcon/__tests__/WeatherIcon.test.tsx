import { describe, expect, it } from 'vitest';

import { noDataDay, weatherDay } from '../../../../test/fixtures';
import { renderWithLocale } from '../../../../test/render';
import { WeatherIcon } from '../WeatherIcon';

const iconKeys = [
  'clear',
  'mainly-clear',
  'rain',
  'rain-showers',
  'freezing-rain',
  'drizzle',
  'freezing-drizzle',
  'snow',
  'snow-showers',
  'thunderstorm',
  'thunderstorm-hail',
  'fog',
  'overcast',
  'partly-cloudy',
  'unknown',
];

describe('WeatherIcon', () => {
  it('рисует значки и облачность', () => {
    const { container, rerender } = renderWithLocale(
      <WeatherIcon record={weatherDay({ iconKey: 'clear' })} />,
    );

    expect(container).toMatchSnapshot();

    iconKeys.forEach((iconKey) => {
      rerender(
        <WeatherIcon
          record={weatherDay({
            iconKey,
            cloudCover: iconKey === 'unknown' ? undefined : 10,
          })}
        />,
      );
    });

    rerender(
      <WeatherIcon
        record={weatherDay({ iconKey: undefined, cloudCover: undefined })}
      />,
    );
    rerender(<WeatherIcon record={noDataDay('feb29')} />);
    rerender(<WeatherIcon record={noDataDay(undefined)} />);
  });
});
