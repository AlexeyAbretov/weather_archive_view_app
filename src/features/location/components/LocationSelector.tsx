import { AimOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Space, Typography } from 'antd';
import { useState } from 'react';
import { useAppFilters } from '../../../app/context/AppFiltersContext';
import { useCitySearch } from '../hooks/useCitySearch';
import { useGeolocation } from '../hooks/useGeolocation';

const { Text } = Typography;

export function LocationSelector() {
  const { location, setLocation } = useAppFilters();
  const [query, setQuery] = useState(location?.city ?? '');
  const { options, loading } = useCitySearch(query);
  const { loading: geoLoading, error: geoError, requestLocation } = useGeolocation();

  type LocationOption = { value: string; label: string; location: (typeof options)[number] };

  const autoCompleteOptions: LocationOption[] = options.map((item) => ({
    value: String(item.id),
    label: item.displayName,
    location: item,
  }));

  return (
    <Space direction="vertical" size="small" style={{ width: '100%' }}>
      <Space wrap>
        <AutoComplete
          style={{ minWidth: 280 }}
          value={query}
          options={autoCompleteOptions}
          onSearch={setQuery}
          onSelect={(_, option: LocationOption) => {
            const selected = option.location;
            setQuery(selected.displayName);
            setLocation({
              lat: selected.latitude,
              lon: selected.longitude,
              city: selected.displayName,
              timezone: selected.timezone,
            });
          }}
          placeholder="Поиск города"
          notFoundContent={loading ? 'Поиск…' : query.length >= 2 ? 'Ничего не найдено' : null}
        />
        <Button
          icon={<AimOutlined />}
          loading={geoLoading}
          onClick={async () => {
            try {
              const coords = await requestLocation();
              setQuery('Моё местоположение');
              setLocation({
                lat: coords.lat,
                lon: coords.lon,
                city: 'Моё местоположение',
                timezone: 'auto',
              });
            } catch {
              // ошибка уже в geoError
            }
          }}
        >
          Моё местоположение
        </Button>
      </Space>
      {geoError && <Text type="danger">{geoError}</Text>}
      {location && <Text type="secondary">Выбрано: {location.city}</Text>}
    </Space>
  );
}
