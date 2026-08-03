import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Thermometer, CloudRain, Wind, SunMedium, Droplet } from 'lucide-react';
import { HourlyData, TemperatureUnit } from '../types';
import { celsiusToFahrenheit, formatTemp, formatWindSpeed } from '../utils/unitConversion';
import { getWmoCondition } from '../utils/wmoCodes';

interface HourlyForecastChartProps {
  hourly: HourlyData;
  unit: TemperatureUnit;
}

type MetricType = 'temp' | 'pop' | 'precip' | 'wind' | 'uv';

export const HourlyForecastChart: React.FC<HourlyForecastChartProps> = ({ hourly, unit }) => {
  const [activeMetric, setActiveMetric] = useState<MetricType>('temp');

  // Format first 24 hours of data
  const chartData = (hourly.time || []).slice(0, 24).map((timeStr, idx) => {
    const timeObj = new Date(timeStr);
    const hourFormatted = timeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const tempC = hourly.temperature_2m?.[idx] ?? 0;
    const tempVal = unit === 'F' ? celsiusToFahrenheit(tempC) : Math.round(tempC);

    const windKmh = hourly.wind_speed_10m?.[idx] ?? 0;
    const windVal = unit === 'F' ? Math.round(windKmh * 0.621371) : Math.round(windKmh);

    const precipProb = hourly.precipitation_probability?.[idx] ?? 0;
    const precipAmount = hourly.precipitation?.[idx] ?? 0;
    const uv = hourly.uv_index?.[idx] ?? 0;
    const code = hourly.weather_code?.[idx] ?? 0;

    return {
      hourFormatted,
      timeIso: timeStr,
      temp: tempVal,
      tempC,
      precipProb,
      precipAmount,
      wind: windVal,
      windKmh,
      uv,
      code,
    };
  });

  const getMetricConfig = () => {
    switch (activeMetric) {
      case 'temp':
        return {
          key: 'temp',
          label: `Temperature (°${unit})`,
          unitLabel: `°${unit}`,
          strokeColor: '#f59e0b',
          fillGradient: 'url(#tempGradient)',
        };
      case 'pop':
        return {
          key: 'precipProb',
          label: 'Rain Probability (%)',
          unitLabel: '%',
          strokeColor: '#3b82f6',
          fillGradient: 'url(#precipGradient)',
        };
      case 'precip':
        return {
          key: 'precipAmount',
          label: `Precipitation (${unit === 'F' ? 'in' : 'mm'})`,
          unitLabel: unit === 'F' ? 'in' : 'mm',
          strokeColor: '#06b6d4',
          fillGradient: 'url(#precipAmountGradient)',
        };
      case 'wind':
        return {
          key: `Wind Speed (${unit === 'F' ? 'mph' : 'km/h'})`,
          label: `Wind Speed (${unit === 'F' ? 'mph' : 'km/h'})`,
          unitLabel: unit === 'F' ? 'mph' : 'km/h',
          strokeColor: '#6366f1',
          fillGradient: 'url(#windGradient)',
        };
      case 'uv':
        return {
          key: 'uv',
          label: 'UV Index',
          unitLabel: '',
          strokeColor: '#e11d48',
          fillGradient: 'url(#uvGradient)',
        };
    }
  };

  const config = getMetricConfig();

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const wmo = getWmoCondition(data.code);
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-700/80 backdrop-blur-md">
          <p className="font-bold text-sky-300">{data.hourFormatted}</p>
          <p className="text-slate-300 font-medium my-1">{wmo.label}</p>
          <div className="space-y-0.5 font-semibold text-white">
            <p>Temp: {formatTemp(data.tempC, unit)}</p>
            <p>Rain Chance: {data.precipProb}%</p>
            <p>Wind: {formatWindSpeed(data.windKmh, unit)}</p>
            <p>UV Index: {data.uv}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-md border border-slate-200/80 dark:border-slate-700/80 my-6">
      {/* Header & Metric Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            24-Hour Forecast Timeline
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hourly weather trend breakdown
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-2xl overflow-x-auto no-scrollbar border border-slate-200/80 dark:border-slate-600/50">
          <button
            onClick={() => setActiveMetric('temp')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeMetric === 'temp'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" /> Temp
          </button>
          <button
            onClick={() => setActiveMetric('pop')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeMetric === 'pop'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" /> Rain %
          </button>
          <button
            onClick={() => setActiveMetric('wind')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeMetric === 'wind'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5" /> Wind
          </button>
          <button
            onClick={() => setActiveMetric('uv')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeMetric === 'uv'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <SunMedium className="w-3.5 h-3.5" /> UV
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="precipGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="precipAmountGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="uvGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e11d48" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#e11d48" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b820" />
            <XAxis
              dataKey="hourFormatted"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={
                activeMetric === 'temp'
                  ? 'temp'
                  : activeMetric === 'pop'
                  ? 'precipProb'
                  : activeMetric === 'precip'
                  ? 'precipAmount'
                  : activeMetric === 'wind'
                  ? 'wind'
                  : 'uv'
              }
              stroke={config.strokeColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={config.fillGradient}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Scrollable Hourly Pill Cards */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
          {chartData.map((item, idx) => {
            const wmo = getWmoCondition(item.code);
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/60 dark:border-slate-700/60 min-w-[80px] shrink-0 text-center hover:bg-sky-50 dark:hover:bg-slate-700/80 transition-colors"
              >
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {item.hourFormatted}
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 my-1.5">
                  {wmo.label.length > 12 ? `${wmo.label.slice(0, 10)}..` : wmo.label}
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {formatTemp(item.tempC, unit)}
                </span>
                {item.precipProb > 0 && (
                  <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 flex items-center gap-0.5 mt-1">
                    <Droplet className="w-2.5 h-2.5" />
                    {item.precipProb}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
