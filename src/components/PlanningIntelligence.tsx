import React, { useState } from 'react';
import {
  Sparkles,
  Shirt,
  Activity,
  HeartPulse,
  Package,
  Umbrella,
  Sun,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Zap,
  Utensils,
  MoonStar,
  Wind,
  Droplets,
} from 'lucide-react';
import { CurrentWeather, DailyData, HourlyData, PlanningRecommendation, TemperatureUnit } from '../types';
import { generatePlanningRecommendations } from '../utils/recommendations';

interface PlanningIntelligenceProps {
  current: CurrentWeather;
  daily: DailyData;
  hourly: HourlyData;
  unit: TemperatureUnit;
}

export const PlanningIntelligence: React.FC<PlanningIntelligenceProps> = ({
  current,
  daily,
  hourly,
  unit,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const recommendations = generatePlanningRecommendations(current, daily, hourly, unit);

  const filtered =
    selectedCategory === 'all'
      ? recommendations
      : recommendations.filter((r) => r.category === selectedCategory);

  const renderIcon = (iconName: string) => {
    const props = { className: 'w-5 h-5' };
    switch (iconName) {
      case 'Shirt':
        return <Shirt {...props} className="text-indigo-500" />;
      case 'Umbrella':
        return <Umbrella {...props} className="text-sky-500" />;
      case 'Sun':
      case 'SunMedium':
        return <Sun {...props} className="text-amber-500" />;
      case 'Activity':
      case 'Zap':
        return <Zap {...props} className="text-emerald-500" />;
      case 'Utensils':
        return <Utensils {...props} className="text-amber-600" />;
      case 'MoonStar':
        return <MoonStar {...props} className="text-indigo-400" />;
      case 'Wind':
        return <Wind {...props} className="text-blue-500" />;
      case 'Droplets':
        return <Droplets {...props} className="text-cyan-500" />;
      default:
        return <Package {...props} className="text-slate-500" />;
    }
  };

  const getStatusBadge = (status: PlanningRecommendation['status']) => {
    switch (status) {
      case 'excellent':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300/60 dark:border-emerald-800/60 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ideal
          </span>
        );
      case 'good':
        return (
          <span className="px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 text-xs font-bold border border-sky-300/60 dark:border-sky-800/60 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Good
          </span>
        );
      case 'caution':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-300/60 dark:border-amber-800/60 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Caution
          </span>
        );
      case 'poor':
        return (
          <span className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 text-xs font-bold border border-rose-300/60 dark:border-rose-800/60 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Avoid
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-md border border-slate-200/80 dark:border-slate-700/80 my-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Weather Intelligence & Planning
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Smart, rule-based lifestyle, apparel, and activity advisories
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'All Insights', icon: Sparkles },
            { id: 'clothing', label: 'What to Wear', icon: Shirt },
            { id: 'gear', label: 'Gear & Packing', icon: Umbrella },
            { id: 'activity', label: 'Activities', icon: Activity },
            { id: 'health', label: 'Health', icon: HeartPulse },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border ${
                  isActive
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200/60 dark:border-slate-600/50'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((rec) => (
          <div
            key={rec.id}
            className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-700/30 border border-slate-200/80 dark:border-slate-700/60 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-xs border border-slate-200/80 dark:border-slate-700/80">
                    {renderIcon(rec.iconName)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                      {rec.title}
                    </h4>
                    {rec.metricLabel && (
                      <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold">
                        {rec.metricLabel}
                      </span>
                    )}
                  </div>
                </div>
                {getStatusBadge(rec.status)}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed mt-2">
                {rec.description}
              </p>
            </div>

            {/* Tags */}
            {rec.tags && rec.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                {rec.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
