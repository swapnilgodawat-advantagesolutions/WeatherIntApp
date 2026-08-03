import React from 'react';
import { CloudSun, Bookmark, Compass, RefreshCw } from 'lucide-react';
import { TemperatureUnit } from '../types';

interface NavbarProps {
  unit: TemperatureUnit;
  onToggleUnit: () => void;
  savedCount: number;
  onOpenFavorites: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  unit,
  onToggleUnit,
  savedCount,
  onOpenFavorites,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/70 dark:bg-slate-900/75 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <CloudSun className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Atmosphere
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                AI Intelligence
              </span>
            </h1>
            <p className="text-xs text-slate-5-00 dark:text-slate-400 font-medium hidden sm:block">
              Real-time Weather & Smart Life Planning
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors disabled:opacity-50"
            title="Refresh weather data"
            aria-label="Refresh weather data"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-sky-500' : ''}`} />
          </button>

          {/* Unit Switcher */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={unit === 'F' ? onToggleUnit : undefined}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                unit === 'C'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              °C
            </button>
            <button
              onClick={unit === 'C' ? onToggleUnit : undefined}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                unit === 'F'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              °F
            </button>
          </div>

          {/* Favorites Button */}
          <button
            onClick={onOpenFavorites}
            className="relative px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-200 dark:border-slate-700/60"
          >
            <Bookmark className="w-4 h-4 text-sky-500 fill-sky-500/20" />
            <span className="hidden md:inline">Saved Cities</span>
            {savedCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
