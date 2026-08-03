import React from 'react';
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudFog,
  Snowflake,
  Wind,
  Bookmark,
  BookmarkCheck,
  ArrowUp,
  ArrowDown,
  MapPin,
  Clock,
} from 'lucide-react';
import { CurrentWeather, DailyData, GeoLocationItem, TemperatureUnit } from '../types';
import { getWmoCondition } from '../utils/wmoCodes';
import { formatTemp } from '../utils/unitConversion';

interface CurrentWeatherCardProps {
  city: GeoLocationItem;
  current: CurrentWeather;
  daily: DailyData;
  unit: TemperatureUnit;
  isSaved: boolean;
  onToggleSave: () => void;
  timezone?: string;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  city,
  current,
  daily,
  unit,
  isSaved,
  onToggleSave,
}) => {
  const isDay = Boolean(current.is_day);
  const wmo = getWmoCondition(current.weather_code, isDay);

  const todayMax = daily.temperature_2m_max?.[0] ?? current.temperature_2m;
  const todayMin = daily.temperature_2m_min?.[0] ?? current.temperature_2m;

  // Render correct Lucide Icon dynamically
  const renderWeatherIcon = (iconName: string) => {
    const props = { className: 'w-16 h-16 sm:w-20 sm:h-20 text-white drop-shadow-md' };
    switch (iconName) {
      case 'Sun':
        return <Sun {...props} className={`${props.className} text-amber-300 animate-spin-slow`} />;
      case 'Moon':
        return <Moon {...props} className={`${props.className} text-indigo-200`} />;
      case 'CloudSun':
        return <CloudSun {...props} className={`${props.className} text-amber-200`} />;
      case 'CloudMoon':
        return <CloudMoon {...props} className={`${props.className} text-indigo-200`} />;
      case 'CloudRain':
        return <CloudRain {...props} className={`${props.className} text-blue-200`} />;
      case 'CloudDrizzle':
        return <CloudDrizzle {...props} className={`${props.className} text-cyan-200`} />;
      case 'CloudLightning':
        return <CloudLightning {...props} className={`${props.className} text-purple-200`} />;
      case 'CloudFog':
        return <CloudFog {...props} className={`${props.className} text-teal-200`} />;
      case 'Snowflake':
        return <Snowflake {...props} className={`${props.className} text-sky-100`} />;
      default:
        return <Cloud {...props} className={`${props.className} text-slate-200`} />;
    }
  };

  const locationSubtitle = [city.admin1, city.country].filter(Boolean).join(', ');

  // Local date formatting
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="w-full rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-slate-900 via-sky-900 to-indigo-950 text-white p-6 sm:p-8 relative border border-white/10">
      {/* Decorative Weather Background Glows */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Side: Location info & Main Temp */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sky-200 text-sm font-medium">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{locationSubtitle || 'Selected City'}</span>
            </div>

            {/* Bookmark Toggle */}
            <button
              onClick={onToggleSave}
              className={`p-2.5 rounded-2xl backdrop-blur-md transition-all flex items-center gap-2 text-xs font-semibold ${
                isSaved
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
              title={isSaved ? 'Remove from saved cities' : 'Save city'}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Save City</span>
                </>
              )}
            </button>
          </div>

          <div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-sm">
              {city.name}
            </h2>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-sky-300" />
                {formattedDate}, {formattedTime}
              </span>
            </div>
          </div>

          {/* Large Temperature Display */}
          <div className="flex items-baseline gap-4 pt-2">
            <span className="text-6xl sm:text-7xl font-extrabold tracking-tighter">
              {formatTemp(current.temperature_2m, unit)}
            </span>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-sky-200">
                Feels like {formatTemp(current.apparent_temperature, unit)}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-0.5 text-emerald-300">
                  <ArrowUp className="w-3.5 h-3.5" /> High {formatTemp(todayMax, unit)}
                </span>
                <span className="flex items-center gap-0.5 text-sky-300">
                  <ArrowDown className="w-3.5 h-3.5" /> Low {formatTemp(todayMin, unit)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Condition Badge & Icon */}
        <div className="flex flex-col items-start md:items-end justify-center gap-3 bg-white/10 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-4">
            {renderWeatherIcon(wmo.iconName)}
            <div className="text-left md:text-right">
              <div className="text-xl sm:text-2xl font-bold">{wmo.label}</div>
              <p className="text-xs text-sky-200 mt-0.5">
                {isDay ? 'Daytime Conditions' : 'Nighttime Conditions'}
              </p>
            </div>
          </div>

          {/* Stats Bar Pill */}
          <div className="w-full flex items-center justify-between md:justify-end gap-4 text-xs font-medium text-slate-200 border-t border-white/10 pt-3 mt-1">
            <div className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-sky-300" />
              <span>{Math.round(current.wind_speed_10m)} km/h Wind</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-indigo-300" />
              <span>{current.cloud_cover}% Cloud Cover</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
