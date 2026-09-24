import { AutoComplete, Button, Space, Spin, Tag, Typography } from 'antd';
import { useMemo } from 'react';

import { EnvironmentOutlined } from '@ant-design/icons';
import { useCitySearch, useGeolocation, useSelectedLocation } from '@hooks';
import type { CitySearchResult } from '@types';

const { Text } = Typography;

const getNotFoundContent = (
  status: ReturnType<typeof useCitySearch>['status'],
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

export const CitySelector = () => {
  const { location, setLocation } = useSelectedLocation();
  const { query, setQuery, results, status, errorMessage } = useCitySearch();
  const { isLocating, detectLocation } = useGeolocation();

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

    setLocation({
      name: option.city.name,
      lat: option.city.lat,
      lon: option.city.lon,
    });
    setQuery(option.city.label);
  };

  const handleDetectLocation = async (): Promise<void> => {
    const detected = await detectLocation();

    if (!detected) {
      return;
    }

    setLocation(detected);
    setQuery(detected.name);
  };

  return (
    <Space className="filter-controls" direction="vertical" size="middle">
      <div className="city-selector-row">
        <AutoComplete
          className="city-selector-input"
          value={query}
          options={options}
          style={{ width: '100%' }}
          placeholder="Введите название города"
          notFoundContent={getNotFoundContent(status, errorMessage)}
          onChange={setQuery}
          onSelect={handleSelect}
        />
        <Button
          className="city-selector-button"
          icon={<EnvironmentOutlined />}
          loading={isLocating}
          onClick={() => {
            void handleDetectLocation();
          }}
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
