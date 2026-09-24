import { ModeAView } from '@components';
import { useModeAWeather, useSelectedLocation } from '@hooks';

import type { ModeAViewContainerProps } from './ModeAViewContainer.types';

export const ModeAViewContainer = ({ anchorDate }: ModeAViewContainerProps) => {
  const { location } = useSelectedLocation();
  const { data, loading, error, reload } = useModeAWeather({
    lat: location?.lat ?? null,
    lon: location?.lon ?? null,
    anchorDate,
    enabled: location != null,
  });

  return (
    <ModeAView
      data={data}
      error={error}
      loading={loading}
      location={location}
      onReload={reload}
    />
  );
};
