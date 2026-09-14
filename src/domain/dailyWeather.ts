export type DailyWeather = {
  date: string;
  temperatureMin: number | null;
  temperatureMax: number | null;
  precipitationSum: number | null;
  rainSum: number | null;
  snowfallSum: number | null;
  weatherCode: number | null;
  windSpeedMax: number | null;
  windDirection: number | null;
};
