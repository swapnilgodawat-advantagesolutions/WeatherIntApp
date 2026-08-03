import React, { useState } from 'react';
import {
  Calendar,
  CloudRain,
  SunMedium,
  Wind,
  ChevronDown,
  ChevronUp,
  Sunrise,
  Sunset,
  Droplets,
  Thermometer,
} from 'lucide-react';
import { DailyData, TemperatureUnit } from '../types';
import { getWmoCondition } from '../utils/wmoCodes';
import { formatTemp, formatWindSpeed, formatPrecipitation } from '../utils/unitConversion';

interface DailyForecastCardsProps {
  daily: DailyData;
  unit: TemperatureUnit;
}

export const DailyForecastCards: React.FC<DailyForecastCardsProps> = ({ daily, unit }) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(0); // Default expand today

  if (!daily.time || daily.time.length === 0) return null;

  // Global min and max across 7 days for relative temp bars
  const minTempAllDays = Math.min(...(daily.temperature_2m_min || [0]));
  const maxTempAllDays = Math.max(...(daily.temperature_2m_max || [30]));
  const tempSpan = Math.max(1, maxTempAllDays - minTempAllDays);

  const toggleExpand = (index: number) => {
    setExpandedDay(expandedDay === index ? null : index);
  };

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-md border border-slate-200/80 dark:border-slate-700/80 my-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-500" /> 7-Day Weather Outlook
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Daily temperature span & condition analysis
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {daily.time.map((timeStr, idx) => {
          const date = new Date(timeStr);
          const isToday = idx === 0;
          const dayName = isToday
            ? 'Today'
            : date.toLocaleDateString('en-US', { weekday: 'short' });
          const dateFormatted = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          const maxTemp = daily.temperature_2m_max[idx];
          const minTemp = daily.temperature_2m_min[idx];
          const code = daily.weather_code[idx];
          const wmo = getWmoCondition(code);
          const rainProb = daily.precipitation_probability_max?.[idx] ?? 0;
          const rainSum = daily.precipitation_sum?.[idx] ?? 0;
          const uvMax = daily.uv_index_max?.[idx] ?? 0;
          const windMax = daily.wind_speed_10m_max?.[idx] ?? 0;
          const sunrise = daily.sunrise?.[idx];
          const sunset = daily.sunset?.[idx];

          // Temperature bar calculation
          const leftPercent = Math.max(0, ((minTemp - minTempAllDays) / tempSpan) * 100);
          const barWidth = Math.max(10, ((maxTemp - minTemp) / tempSpan) * 100);

          const isExpanded = expandedDay === idx;

          return (
            <div
              key={timeStr}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isToday
                  ? 'bg-sky-50/60 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800/60 shadow-xs'
                  : 'bg-slate-50/50 dark:bg-slate-700/30 border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {/* Card Header Row */}
              <div
                onClick={() => toggleExpand(idx)}
                className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
              >
                {/* Date & Day */}
                <div className="w-24 sm:w-28 shrink-0">
                  <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {dayName}
                    {isToday && (
                      <span className="text-[10px] bg-sky-500 text-white font-bold px-1.5 py-0.5 rounded-md">
                        NOW
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {dateFormatted}
                  </div>
                </div>

                {/* Weather Condition */}
                <div className="flex items-center gap-2.5 w-32 sm:w-40 shrink-0">
                  <span className={`p-1.5 rounded-xl ${wmo.badgeBg} text-xs font-semibold`}>
                    {wmo.label}
                  </span>
                </div>

                {/* Temperature Span Bar */}
                <div className="hidden sm:flex flex-1 items-center gap-3 max-w-xs">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 w-9 text-right shrink-0">
                    {formatTemp(minTemp, unit)}
                  </span>
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full relative overflow-hidden">
                    <div
                      className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500 transition-all duration-300"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${barWidth}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white w-9 shrink-0">
                    {formatTemp(maxTemp, unit)}
                  </span>
                </div>

                {/* Rain Chance & Expand Toggle */}
                <div className="flex items-center gap-3 shrink-0">
                  {rainProb > 0 ? (
                    <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-950 px-2 py-1 rounded-lg flex items-center gap-1 border border-sky-200/50 dark:border-sky-800/50">
                      <CloudRain className="w-3.5 h-3.5" />
                      {rainProb}%
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-slate-400 px-2 py-1">0% Rain</span>
                  )}

                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Mobile Temperature Range (visible on mobile only) */}
              <div className="sm:hidden px-4 pb-2 flex items-center justify-between text-xs font-bold border-t border-slate-200/40 dark:border-slate-700/40 pt-2">
                <span className="text-slate-500">Low: {formatTemp(minTemp, unit)}</span>
                <div className="flex-1 mx-3 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full relative overflow-hidden">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500"
                    style={{ left: `${leftPercent}%`, width: `${barWidth}%` }}
                  />
                </div>
                <span className="text-slate-900 dark:text-white">High: {formatTemp(maxTemp, unit)}</span>
              </div>

              {/* Expandable Details Drawer */}
              {isExpanded && (
                <div className="p-4 bg-white/60 dark:bg-slate-800/60 border-t border-slate-200/60 dark:border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100/70 dark:bg-slate-700/40">
                    <SunMedium className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className="text-slate-400 font-medium">Max UV Index</div>
                      <div className="font-bold text-slate-900 dark:text-white">{uvMax.toFixed(1)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100/70 dark:bg-slate-700/40">
                    <Wind className="w-4 h-4 text-indigo-500" />
                    <div>
                      <div className="text-slate-400 font-medium">Max Wind Speed</div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {formatWindSpeed(windMax, unit)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100/70 dark:bg-slate-700/40">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="text-slate-400 font-medium">Precipitation Sum</div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {formatPrecipitation(rainSum, unit)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100/70 dark:bg-slate-700/40">
                    <Thermometer className="w-4 h-4 text-rose-500" />
                    <div>
                      <div className="text-slate-400 font-medium">Feels Like Range</div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {formatTemp(daily.apparent_temperature_min?.[idx], unit)} -{' '}
                        {formatTemp(daily.apparent_temperature_max?.[idx], unit)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
