import { AutoComplete, Button, Space, Spin, Tag, Typography } from 'antd';
import { useMemo } from 'react';

import { EnvironmentOutlined } from '@ant-design/icons';
import type { CitySearchResult } from '@types';

import type {
  CitySelectorProps,
  CitySelectorStatus,
} from './CitySelector.types';

const { Text } = Typography;

const getNotFoundContent = (
  status: CitySelectorStatus,
  errorMessage: string | null,
): React.ReactNode => {
  if (status === 'loading') {
    return <Spin size="small" />;
  }

  if (status === 'error') {
    return errorMessage ?? 'Не удалось выполнить поиск';
  }

  if (status === 'empty') {
    return 'Города не найдены';
  }

  return null;
};

export const CitySelector = ({
  errorMessage,
  isLocating,
  location,
  onDetectLocation,
  onQueryChange,
  onSelect,
  query,
  results,
  status,
}: CitySelectorProps) => {
  const options = useMemo(
    () =>
      results.map((city: CitySearchResult) => ({
        value: city.label,
        label: city.label,
        city,
      })),
    [results],
  );

  const handleSelect = (
    _value: string,
    option: { city?: CitySearchResult },
  ) => {
    if (!option.city) {
      return;
    }

    onSelect(option.city);
  };

  return (
    <Space className="filter-controls" direction="vertical" size="middle">
      <div className="city-selector-row">
        <AutoComplete
          className="city-selector-input"
          notFoundContent={getNotFoundContent(status, errorMessage)}
          onChange={onQueryChange}
          onSelect={handleSelect}
          options={options}
          placeholder="Введите название города"
          style={{ width: '100%' }}
          value={query}
        />
        <Button
          className="city-selector-button"
          icon={<EnvironmentOutlined />}
          loading={isLocating}
          onClick={onDetectLocation}
        >
          Моё местоположение
        </Button>
      </div>
      {location ? (
        <Text>
          Выбран: <Tag color="blue">{location.name}</Tag>
          <Text type="secondary">
            ({location.lat.toFixed(4)}, {location.lon.toFixed(4)})
          </Text>
        </Text>
      ) : (
        <Text type="secondary">
          Выберите город из списка или определите местоположение.
        </Text>
      )}
    </Space>
  );
};
