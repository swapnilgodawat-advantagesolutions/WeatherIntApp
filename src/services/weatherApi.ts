import { GeoLocationItem, WeatherApiResponse } from '../types';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchCities(query: string): Promise<GeoLocationItem[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const url = `${GEOCODING_API_URL}?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding server responded with status: ${response.status}`);
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching cities:', error);
    throw new Error('Unable to connect to location search service. Please check your internet connection.');
  }
}

export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherApiResponse> {
  const currentParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'rain',
    'showers',
    'snowfall',
    'weather_code',
    'cloud_cover',
    'pressure_msl',
    'surface_pressure',
    'wind_speed_10m',
    'wind_direction_10m',
    'wind_gusts_10m',
  ].join(',');

  const hourlyParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'dew_point_2m',
    'apparent_temperature',
    'precipitation_probability',
    'precipitation',
    'weather_code',
    'pressure_msl',
    'cloud_cover',
    'visibility',
    'wind_speed_10m',
    'uv_index',
  ].join(',');

  const dailyParams = [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'apparent_temperature_max',
    'apparent_temperature_min',
    'sunrise',
    'sunset',
    'uv_index_max',
    'precipitation_sum',
    'rain_sum',
    'showers_sum',
    'snowfall_sum',
    'precipitation_hours',
    'precipitation_probability_max',
    'wind_speed_10m_max',
    'wind_gusts_10m_max',
  ].join(',');

  const url = `${FORECAST_API_URL}?latitude=${lat}&longitude=${lon}&current=${currentParams}&hourly=${hourlyParams}&daily=${dailyParams}&timezone=auto`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather service responded with status: ${response.status}`);
    }
    const data: WeatherApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to retrieve forecast data. Please try selecting another location or retry.');
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<Partial<GeoLocationItem>> {
  // Simple reverse geocode using Open-Meteo or fallback coordinates display
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'WeatherIntelligenceApp/1.0',
      },
    });
    if (response.ok) {
      const data = await response.json();
      const name = data.address?.city || data.address?.town || data.address?.village || data.address?.suburb || 'Current Location';
      const country = data.address?.country || '';
      const admin1 = data.address?.state || '';
      return {
        name,
        country,
        admin1,
        latitude: lat,
        longitude: lon,
      };
    }
  } catch (err) {
    console.warn('Reverse geocoding failed, falling back to coordinates:', err);
  }

  return {
    name: `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
    latitude: lat,
    longitude: lon,
  };
}
