export type TemperatureUnit = 'C' | 'F';

export interface GeoLocationItem {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
  population?: number;
}

export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
}

export interface HourlyData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  dew_point_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weather_code: number[];
  pressure_msl: number[];
  cloud_cover: number[];
  visibility: number[];
  wind_speed_10m: number[];
  uv_index: number[];
}

export interface DailyData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
  rain_sum: number[];
  showers_sum: number[];
  snowfall_sum: number[];
  precipitation_hours: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
}

export interface WeatherApiResponse {
  latitude: number;
  longitude: number;
  elevation: number;
  timezone: string;
  timezone_abbreviation: string;
  current: CurrentWeather;
  hourly: HourlyData;
  daily: DailyData;
}

export interface SavedCity {
  id: string;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  country_code?: string;
}

export type RecommendationCategory = 'activity' | 'clothing' | 'health' | 'gear';
export type RecommendationStatus = 'excellent' | 'good' | 'caution' | 'poor';

export interface PlanningRecommendation {
  id: string;
  category: RecommendationCategory;
  title: string;
  description: string;
  status: RecommendationStatus;
  iconName: string;
  metricLabel?: string;
  tags?: string[];
}
