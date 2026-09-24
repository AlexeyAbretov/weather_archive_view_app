import type { CitySearchResult, SelectedLocation } from '@types';

export type CitySelectorStatus = 'idle' | 'loading' | 'empty' | 'error';

export type CitySelectorProps = {
  errorMessage: string | null;
  isLocating: boolean;
  location: SelectedLocation | null;
  onDetectLocation: () => void;
  onQueryChange: (query: string) => void;
  onSelect: (city: CitySearchResult) => void;
  query: string;
  results: CitySearchResult[];
  status: CitySelectorStatus;
};
