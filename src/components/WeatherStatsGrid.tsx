import React from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  SunMedium,
  Gauge,
  Eye,
  CloudRain,
  Sunrise,
  Sunset,
  Navigation,
} from 'lucide-react';
import { CurrentWeather, DailyData, HourlyData, TemperatureUnit } from '../types';
import {
  formatTemp,
  formatWindSpeed,
  formatPrecipitation,
  formatVisibility,
  getWindDirectionText,
  getUvCategory,
} from '../utils/unitConversion';

interface WeatherStatsGridProps {
  current: CurrentWeather;
  daily: DailyData;
  hourly: HourlyData;
  unit: TemperatureUnit;
}

export const WeatherStatsGrid: React.FC<WeatherStatsGridProps> = ({
  current,
  daily,
  hourly,
  unit,
}) => {
  const dewPoint = hourly.dew_point_2m?.[0] ?? current.temperature_2m - (100 - current.relative_humidity_2m) / 5;
  const todayUv = daily.uv_index_max?.[0] ?? 0;
  const uvCategory = getUvCategory(todayUv);
  const precipProb = daily.precipitation_probability_max?.[0] ?? 0;
  const precipSum = daily.precipitation_sum?.[0] ?? current.precipitation;
  const visibility = hourly.visibility?.[0] ?? 10000;

  // Sunrise/Sunset formatting
  const sunriseRaw = daily.sunrise?.[0];
  const sunsetRaw = daily.sunset?.[0];

  const formatTimeOnly = (isoString?: string) => {
    if (!isoString) return '--:--';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '--:--';
    }
  };

  const sunriseFormatted = formatTimeOnly(sunriseRaw);
  const sunsetFormatted = formatTimeOnly(sunsetRaw);

  // Daylight progress percentage
  const getDaylightProgress = () => {
    if (!sunriseRaw || !sunsetRaw) return 50;
    const now = new Date().getTime();
    const rise = new Date(sunriseRaw).getTime();
    const set = new Date(sunsetRaw).getTime();

    if (now < rise) return 0;
    if (now > set) return 100;
    return Math.round(((now - rise) / (set - rise)) * 100);
  };

  const daylightProgress = getDaylightProgress();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
      {/* 1. RealFeel & Dew Point */}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
          <span className="flex items-center gap-1.5">
            <Thermometer className="w-4 h-4 text-rose-500" /> Feels Like
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400">Thermal</span>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {formatTemp(current.apparent_temperature, unit)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Dew Point: {formatTemp(dewPoint, unit)}
          </p>
        </div>
      </div>

      {/* 2. Humidity */}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
          <span className="flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-sky-500" /> Humidity
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400">Moisture</span>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {current.relative_humidity_2m}%
          </div>
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, current.relative_humidity_2m))}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Wind & Gusts */}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
          <span className="flex items-center gap-1.5">
            <Wind className="w-4 h-4 text-blue-500" /> Wind Speed
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Navigation
              className="w-3 h-3 text-blue-500 transition-transform"
              style={{ transform: `rotate(${current.wind_direction_10m}deg)` }}
            />
            {getWindDirectionText(current.wind_direction_10m)}
          </span>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {formatWindSpeed(current.wind_speed_10m, unit)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Gusts: {formatWindSpeed(current.wind_gusts_10m, unit)}
          </p>
        </div>
      </div>

      {/* 4. UV Index */}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
          <span className="flex items-center gap-1.5">
            <SunMedium className="w-4 h-4 text-amber-500" /> Max UV Index
          </span>
          <span className={`text-[10px] uppercase font-bold ${uvCategory.colorClass}`}>
            {uvCategory.label}
          </span>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-slate-900 dark:text-white flex items-baseline gap-2">
            {todayUv.toFixed(1)}
            <span className="text-xs font-semibold text-slate-400">/ 12</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full ${uvCategory.bgClass} rounded-full transition-all duration-500`}
              style={{ width: `${Math.min(100, (todayUv / 12) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 5. Atmospheric Pressure */}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
          <span className="flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-purple-500" /> Air Pressure
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400">MSL</span>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {Math.round(current.pressure_msl)} <span className="text-xs font-semibold text-slate-400">hPa</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Surface: {Math.round(current.surface_pressure)} hPa
          </p>
        </div>
      </div>

      {/* 6. Visibility */}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-emerald-500" /> Visibility
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400">Clarity</span>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {formatVisibility(visibility, unit)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {visibility >= 10000 ? 'Clear distance view' : 'Reduced sight'}
          </p>
        </div>
      </div>

      {/* 7. Precipitation */}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
          <span className="flex items-center gap-1.5">
            <CloudRain className="w-4 h-4 text-blue-500" /> Rain Chance
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400">Today</span>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {precipProb}%
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Total Volume: {formatPrecipitation(precipSum, unit)}
          </p>
        </div>
      </div>

      {/* 8. Sunrise & Sunset Arc */}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between col-span-2 md:col-span-1">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
          <span className="flex items-center gap-1.5">
            <Sunrise className="w-4 h-4 text-amber-500" /> Sun Schedule
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400">Daylight</span>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
            <span className="flex items-center gap-1"><Sunrise className="w-3.5 h-3.5 text-amber-500" /> {sunriseFormatted}</span>
            <span className="flex items-center gap-1"><Sunset className="w-3.5 h-3.5 text-indigo-400" /> {sunsetFormatted}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-sky-400 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${daylightProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
