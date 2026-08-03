import React, { useState, useEffect, useCallback } from 'react';
import {
  CloudSun,
  Loader2,
  AlertCircle,
  RefreshCw,
  Search,
  Sparkles,
} from 'lucide-react';
import { GeoLocationItem, WeatherApiResponse, TemperatureUnit, SavedCity } from './types';
import { fetchWeatherData } from './services/weatherApi';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { WeatherStatsGrid } from './components/WeatherStatsGrid';
import { HourlyForecastChart } from './components/HourlyForecastChart';
import { DailyForecastCards } from './components/DailyForecastCards';
import { PlanningIntelligence } from './components/PlanningIntelligence';
import { FavoriteCities } from './components/FavoriteCities';

const DEFAULT_CITY: GeoLocationItem = {
  id: 1,
  name: 'London',
  latitude: 51.5074,
  longitude: -0.1278,
  country: 'United Kingdom',
  admin1: 'England',
};

const SAVED_CITIES_STORAGE_KEY = 'atmosphere_saved_cities';
const UNIT_STORAGE_KEY = 'atmosphere_unit_pref';

export default function App() {
  const [currentCity, setCurrentCity] = useState<GeoLocationItem>(() => {
    try {
      const saved = localStorage.getItem('atmosphere_last_city');
      return saved ? JSON.parse(saved) : DEFAULT_CITY;
    } catch {
      return DEFAULT_CITY;
    }
  });

  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    try {
      const savedUnit = localStorage.getItem(UNIT_STORAGE_KEY);
      return (savedUnit as TemperatureUnit) || 'C';
    } catch {
      return 'C';
    }
  });

  const [savedCities, setSavedCities] = useState<SavedCity[]>(() => {
    try {
      const saved = localStorage.getItem(SAVED_CITIES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);

  // Save state helpers
  useEffect(() => {
    try {
      localStorage.setItem('atmosphere_last_city', JSON.stringify(currentCity));
    } catch (e) {
      console.warn('Failed to persist last city:', e);
    }
  }, [currentCity]);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_CITIES_STORAGE_KEY, JSON.stringify(savedCities));
    } catch (e) {
      console.warn('Failed to persist saved cities:', e);
    }
  }, [savedCities]);

  useEffect(() => {
    try {
      localStorage.setItem(UNIT_STORAGE_KEY, unit);
    } catch (e) {
      console.warn('Failed to persist unit preference:', e);
    }
  }, [unit]);

  // Main fetch function
  const loadWeatherData = useCallback(async (city: GeoLocationItem) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(city.latitude, city.longitude);
      setWeatherData(data);
    } catch (err: any) {
      console.error('Weather load error:', err);
      setError(
        err.message ||
          `Unable to retrieve weather data for ${city.name}. Please check your connection and try again.`
      );
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeatherData(currentCity);
  }, [currentCity, loadWeatherData]);

  const handleSelectCity = (city: GeoLocationItem) => {
    setCurrentCity(city);
  };

  const handleToggleUnit = () => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  const isCurrentSaved = savedCities.some(
    (sc) =>
      sc.name.toLowerCase() === currentCity.name.toLowerCase() ||
      (Math.abs(sc.latitude - currentCity.latitude) < 0.01 &&
        Math.abs(sc.longitude - currentCity.longitude) < 0.01)
  );

  const handleToggleSaveCity = () => {
    if (isCurrentSaved) {
      setSavedCities((prev) =>
        prev.filter(
          (sc) =>
            sc.name.toLowerCase() !== currentCity.name.toLowerCase() &&
            Math.abs(sc.latitude - currentCity.latitude) >= 0.01
        )
      );
    } else {
      const newSaved: SavedCity = {
        id: `${currentCity.id || Date.now()}-${currentCity.latitude}`,
        name: currentCity.name,
        country: currentCity.country,
        admin1: currentCity.admin1,
        latitude: currentCity.latitude,
        longitude: currentCity.longitude,
      };
      setSavedCities((prev) => [newSaved, ...prev]);
    }
  };

  const handleRemoveSavedCity = (id: string) => {
    setSavedCities((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-sky-500 selection:text-white pb-12 transition-colors">
      {/* Navbar */}
      <Navbar
        unit={unit}
        onToggleUnit={handleToggleUnit}
        savedCount={savedCities.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onRefresh={() => loadWeatherData(currentCity)}
        isRefreshing={isLoading}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* City Search Bar */}
        <SearchBar onSelectCity={handleSelectCity} isLoadingWeather={isLoading} />

        {/* Loading Indicator State */}
        {isLoading && !weatherData && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center text-sky-500 animate-bounce">
              <CloudSun className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
                Fetching Live Weather for {currentCity.name}...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Connecting to Open-Meteo global meteorological service
              </p>
            </div>
          </div>
        )}

        {/* Error Handling View */}
        {error && !isLoading && (
          <div className="my-8 p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-amber-900 dark:text-amber-200">
                Weather Request Error
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 font-medium leading-relaxed">
                {error}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => loadWeatherData(currentCity)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
              <button
                onClick={() => handleSelectCity(DEFAULT_CITY)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700"
              >
                Reset to London
              </button>
            </div>
          </div>
        )}

        {/* Weather Dashboard View */}
        {weatherData && (
          <div className="space-y-6 transition-all duration-300">
            {/* Primary Current Weather Display */}
            <CurrentWeatherCard
              city={currentCity}
              current={weatherData.current}
              daily={weatherData.daily}
              unit={unit}
              isSaved={isCurrentSaved}
              onToggleSave={handleToggleSaveCity}
              timezone={weatherData.timezone}
            />

            {/* Current Weather Statistics Grid */}
            <WeatherStatsGrid
              current={weatherData.current}
              daily={weatherData.daily}
              hourly={weatherData.hourly}
              unit={unit}
            />

            {/* Smart Planning Intelligence & Recommendations */}
            <PlanningIntelligence
              current={weatherData.current}
              daily={weatherData.daily}
              hourly={weatherData.hourly}
              unit={unit}
            />

            {/* 24-Hour Timeline & Recharts Interactive Visualizer */}
            <HourlyForecastChart hourly={weatherData.hourly} unit={unit} />

            {/* 7-Day Forecast Cards */}
            <DailyForecastCards daily={weatherData.daily} unit={unit} />
          </div>
        )}
      </main>

      {/* Favorites Sidebar Drawer */}
      <FavoriteCities
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        savedCities={savedCities}
        onSelectCity={(city) => {
          handleSelectCity({
            id: Number(city.id) || Date.now(),
            name: city.name,
            latitude: city.latitude,
            longitude: city.longitude,
            country: city.country,
            admin1: city.admin1,
          });
        }}
        onRemoveCity={handleRemoveSavedCity}
      />
    </div>
  );
}
