import type { Meta, StoryObj } from '@storybook/react-vite';

import type { WeatherDayRecord } from '@domain';

import { WeatherIcon } from '../WeatherIcon';

const base: WeatherDayRecord = {
  date: '2020-09-15',
  year: 2020,
  hasData: true,
  weatherCode: 0,
  cloudCover: 12,
  precipitationMm: 0,
  precipitationType: 'none',
};

const meta = {
  title: 'Components/WeatherIcon',
  component: WeatherIcon,
  args: {
    record: { ...base, iconKey: 'clear' },
  },
} satisfies Meta<typeof WeatherIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Clear: Story = {};

export const PartlyCloudy: Story = {
  args: {
    record: {
      ...base,
      cloudCover: 45,
      iconKey: 'partly-cloudy',
      weatherCode: 2,
    },
  },
};

export const Overcast: Story = {
  args: {
    record: {
      ...base,
      cloudCover: 92,
      iconKey: 'overcast',
      weatherCode: 3,
    },
  },
};

export const LightRain: Story = {
  args: {
    record: {
      ...base,
      cloudCover: 80,
      iconKey: 'rain',
      precipitationMm: 0.4,
      precipitationType: 'rain',
      weatherCode: 61,
    },
  },
};

export const HeavyRain: Story = {
  args: {
    record: {
      ...base,
      cloudCover: 96,
      iconKey: 'rain',
      precipitationMm: 16,
      precipitationType: 'rain',
      weatherCode: 65,
    },
  },
};

export const Drizzle: Story = {
  args: {
    record: {
      ...base,
      cloudCover: 88,
      iconKey: 'drizzle',
      precipitationMm: 0.3,
      precipitationType: 'drizzle',
      weatherCode: 51,
    },
  },
};

export const FreezingRain: Story = {
  args: {
    record: {
      ...base,
      cloudCover: 90,
      iconKey: 'freezing-rain',
      precipitationMm: 2,
      precipitationType: 'freezing_rain',
      weatherCode: 66,
    },
  },
};

export const Snow: Story = {
  args: {
    record: {
      ...base,
      cloudCover: 85,
      iconKey: 'snow',
      precipitationMm: 3,
      precipitationType: 'snow',
      weatherCode: 73,
    },
  },
};

export const Mixed: Story = {
  args: {
    record: {
      ...base,
      cloudCover: 70,
      iconKey: 'rain',
      precipitationMm: 4,
      precipitationType: 'mixed',
      weatherCode: 61,
    },
  },
};

export const Storm: Story = {
  args: {
    record: {
      ...base,
      cloudCover: 98,
      iconKey: 'thunderstorm',
      precipitationMm: 8,
      precipitationType: 'thunderstorm',
      weatherCode: 95,
    },
  },
};

export const Hail: Story = {
  args: {
    record: {
      ...base,
      cloudCover: 95,
      iconKey: 'thunderstorm-hail',
      precipitationMm: 12,
      precipitationType: 'hail',
      weatherCode: 99,
    },
  },
};

export const Fog: Story = {
  args: {
    record: {
      ...base,
      cloudCover: 100,
      iconKey: 'fog',
      weatherCode: 45,
    },
  },
};

export const Unknown: Story = {
  args: {
    record: {
      ...base,
      cloudCover: undefined,
      iconKey: 'unknown',
      weatherCode: undefined,
    },
  },
};

export const NoData: Story = {
  args: {
    record: {
      date: '2020-09-15',
      year: 2020,
      hasData: false,
      noDataReason: 'feb29',
    },
  },
};
