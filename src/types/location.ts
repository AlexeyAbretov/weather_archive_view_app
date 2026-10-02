export type SelectedLocation = {
  name: string;
  label: string;
  lat: number;
  lon: number;
};

export type CitySearchResult = SelectedLocation & {
  label: string;
};
