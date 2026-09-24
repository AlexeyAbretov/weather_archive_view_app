import { ModeBView as ModeBViewUi } from '@components';
import { useModeBLazyWeather, useSelectedLocation } from '@hooks';

import type { ModeBViewProps } from './ModeBView.types';

export const ModeBView = ({ anchorDate }: ModeBViewProps) => {
  const { location } = useSelectedLocation();
  const {
    years,
    windowsByYear,
    loadingYears,
    errorYears,
    expandedYears,
    setExpandedYears,
    loadYear,
    reloadYear,
    isYearExpandable,
  } = useModeBLazyWeather({
    lat: location?.lat ?? null,
    lon: location?.lon ?? null,
    anchorDate,
    enabled: location != null,
  });

  return (
    <ModeBViewUi
      errorYears={errorYears}
      expandedYears={expandedYears}
      isYearExpandable={isYearExpandable}
      loadingYears={loadingYears}
      location={location}
      onExpandYear={loadYear}
      onExpandedYearsChange={setExpandedYears}
      onRetryYear={reloadYear}
      windowsByYear={windowsByYear}
      years={years}
    />
  );
};
