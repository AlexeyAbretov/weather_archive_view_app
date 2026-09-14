import { AutoComplete, Button, Space, Spin, Tag, Typography } from 'antd';
import { useMemo } from 'react';

import { EnvironmentOutlined } from '@ant-design/icons';

import { useSelectedLocation } from './LocationProvider.tsx';
import type { CitySearchResult } from './types.ts';
import { useCitySearch } from './useCitySearch.ts';
import { useGeolocation } from './useGeolocation.ts';

const { Text } = Typography;

function getNotFoundContent(
  status: ReturnType<typeof useCitySearch>['status'],
  errorMessage: string | null,
): React.ReactNode {
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
}

export function CitySelector() {
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

  function handleSelect(_value: string, option: { city?: CitySearchResult }) {
    if (!option.city) {
      return;
    }

    setLocation({
      name: option.city.name,
      lat: option.city.lat,
      lon: option.city.lon,
    });
    setQuery(option.city.label);
  }

  async function handleDetectLocation(): Promise<void> {
    const detected = await detectLocation();

    if (!detected) {
      return;
    }

    setLocation(detected);
    setQuery(detected.name);
  }

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Space wrap>
        <AutoComplete
          value={query}
          options={options}
          style={{ minWidth: 320 }}
          placeholder="Введите название города"
          notFoundContent={getNotFoundContent(status, errorMessage)}
          onChange={setQuery}
          onSelect={handleSelect}
        />
        <Button
          icon={<EnvironmentOutlined />}
          loading={isLocating}
          onClick={() => {
            void handleDetectLocation();
          }}
        >
          Моё местоположение
        </Button>
      </Space>
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
}
