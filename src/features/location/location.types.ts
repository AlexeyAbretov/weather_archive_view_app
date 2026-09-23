export type SelectedLocation = {
  name: string;
  lat: number;
  lon: number;
};

export type CitySearchResult = SelectedLocation & {
  label: string;
};
