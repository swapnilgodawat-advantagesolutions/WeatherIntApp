import { TemperatureUnit } from '../types';

export function celsiusToFahrenheit(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

export function formatTemp(celsius: number | null | undefined, unit: TemperatureUnit): string {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return '--';
  if (unit === 'F') {
    return `${celsiusToFahrenheit(celsius)}°`;
  }
  return `${Math.round(celsius)}°`;
}

export function formatWindSpeed(kmh: number, unit: TemperatureUnit): string {
  if (isNaN(kmh)) return '--';
  if (unit === 'F') {
    const mph = Math.round(kmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function formatPrecipitation(mm: number, unit: TemperatureUnit): string {
  if (isNaN(mm)) return '0';
  if (unit === 'F') {
    const inches = (mm * 0.0393701).toFixed(2);
    return `${inches} in`;
  }
  return `${mm.toFixed(1)} mm`;
}

export function formatVisibility(meters: number, unit: TemperatureUnit): string {
  if (isNaN(meters)) return '--';
  const km = meters / 1000;
  if (unit === 'F') {
    const miles = (km * 0.621371).toFixed(1);
    return `${miles} mi`;
  }
  return `${km.toFixed(1)} km`;
}

export function getWindDirectionText(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index] || 'N';
}

export function getUvCategory(uvIndex: number): { label: string; colorClass: string; bgClass: string } {
  if (uvIndex <= 2) {
    return { label: 'Low', colorClass: 'text-emerald-500', bgClass: 'bg-emerald-500' };
  }
  if (uvIndex <= 5) {
    return { label: 'Moderate', colorClass: 'text-amber-500', bgClass: 'bg-amber-500' };
  }
  if (uvIndex <= 7) {
    return { label: 'High', colorClass: 'text-orange-500', bgClass: 'bg-orange-500' };
  }
  if (uvIndex <= 10) {
    return { label: 'Very High', colorClass: 'text-rose-500', bgClass: 'bg-rose-500' };
  }
  return { label: 'Extreme', colorClass: 'text-purple-600', bgClass: 'bg-purple-600' };
}
