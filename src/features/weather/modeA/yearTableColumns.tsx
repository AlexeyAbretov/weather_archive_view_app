import type { ColumnsType } from 'antd/es/table';

import {
  PrecipitationCell,
  TemperatureCell,
  WeatherIcon,
  WindCell,
} from '@components';
import type { YearWeatherRow } from '@domain';

export const buildYearTableColumns = (): ColumnsType<YearWeatherRow> => {
  return [
    {
      title: 'Год',
      dataIndex: 'year',
      key: 'year',
      width: 80,
      align: 'center',
      fixed: 'left',
    },
    {
      title: 't° мин / макс',
      key: 'temperature',
      width: 120,
      align: 'center',
      render: (_value, row) => <TemperatureCell record={row.day} />,
    },
    {
      title: 'Осадки',
      key: 'precipitation',
      width: 140,
      align: 'center',
      render: (_value, row) => <PrecipitationCell record={row.day} />,
    },
    {
      title: 'Ветер',
      key: 'wind',
      width: 110,
      align: 'center',
      render: (_value, row) => <WindCell record={row.day} />,
    },
    {
      title: 'Облачность',
      key: 'weather',
      width: 100,
      align: 'center',
      render: (_value, row) => <WeatherIcon record={row.day} />,
    },
  ];
};
