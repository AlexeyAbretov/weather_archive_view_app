import { ModeAView as ModeAViewUi } from '@components';
import { useModeAWeather, useSelectedLocation } from '@hooks';

import type { ModeAViewProps } from './ModeAView.types';

export const ModeAView = ({ anchorDate }: ModeAViewProps) => {
  const { location } = useSelectedLocation();
  const { data, loading, error, reload } = useModeAWeather({
    lat: location?.lat ?? null,
    lon: location?.lon ?? null,
    anchorDate,
    enabled: location != null,
  });

  return (
    <ModeAViewUi
      data={data}
      error={error}
      loading={loading}
      location={location}
      onReload={reload}
    />
  );
};
