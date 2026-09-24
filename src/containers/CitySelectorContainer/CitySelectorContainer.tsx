import { CitySelector } from '@components';
import { useCitySearch, useGeolocation, useSelectedLocation } from '@hooks';
import type { CitySearchResult } from '@types';

export const CitySelectorContainer = () => {
  const { location, setLocation, clearLocation } = useSelectedLocation();
  const { query, setQuery, results, status, errorMessage } = useCitySearch(
    location?.label ?? '',
  );
  const { isLocating, detectLocation } = useGeolocation();

  const handleSelect = (city: CitySearchResult) => {
    setLocation({
      name: city.name,
      label: city.label,
      lat: city.lat,
      lon: city.lon,
    });
    setQuery(city.label);
  };

  const handleClear = () => {
    clearLocation();
    setQuery('');
  };

  const handleDetectLocation = async (): Promise<void> => {
    const detected = await detectLocation();

    if (!detected) {
      return;
    }

    setLocation(detected);
    setQuery(detected.label);
  };

  return (
    <CitySelector
      errorMessage={errorMessage}
      isLocating={isLocating}
      location={location}
      onClear={handleClear}
      onDetectLocation={() => {
        void handleDetectLocation();
      }}
      onQueryChange={setQuery}
      onSelect={handleSelect}
      query={query}
      results={results}
      status={status}
    />
  );
};
