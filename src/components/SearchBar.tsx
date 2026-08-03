import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, AlertCircle, Building2 } from 'lucide-react';
import { GeoLocationItem } from '../types';
import { searchCities, reverseGeocode } from '../services/weatherApi';

interface SearchBarProps {
  onSelectCity: (city: GeoLocationItem) => void;
  isLoadingWeather?: boolean;
}

const POPULAR_CITIES: GeoLocationItem[] = [
  { id: 1, name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'United Kingdom', admin1: 'England' },
  { id: 2, name: 'New York', latitude: 40.7128, longitude: -74.006, country: 'United States', admin1: 'New York' },
  { id: 3, name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'Japan', admin1: 'Tokyo' },
  { id: 4, name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'France', admin1: 'Île-de-France' },
  { id: 5, name: 'Sydney', latitude: -33.8688, longitude: 151.2093, country: 'Australia', admin1: 'New South Wales' },
  { id: 6, name: 'Dubai', latitude: 25.2048, longitude: 55.2708, country: 'United Arab Emirates', admin1: 'Dubai' },
];

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectCity, isLoadingWeather = false }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocationItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search logic
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      setSearchError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const items = await searchCities(query);
        setResults(items);
        setIsOpen(true);
        if (items.length === 0) {
          setSearchError(`No cities found matching "${query}". Try checking the spelling.`);
        }
      } catch (err: any) {
        setSearchError(err.message || 'Error searching city.');
        setResults([]);
        setIsOpen(true);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: GeoLocationItem) => {
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);
    setSearchError(null);
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setSearchError('Geolocation is not supported by your browser.');
      return;
    }

    setIsGeolocating(true);
    setSearchError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const loc = await reverseGeocode(latitude, longitude);
          onSelectCity({
            id: Date.now(),
            name: loc.name || 'Current Location',
            latitude,
            longitude,
            country: loc.country || '',
            admin1: loc.admin1 || '',
          });
          setQuery('');
        } catch (e) {
          onSelectCity({
            id: Date.now(),
            name: 'Current Location',
            latitude,
            longitude,
          });
        } finally {
          setIsGeolocating(false);
        }
      },
      (error) => {
        setIsGeolocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setSearchError('Location permission denied. Please search for a city manually.');
        } else {
          setSearchError('Unable to detect current location. Please search manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-4 px-2 sm:px-0" ref={containerRef}>
      <div className="relative">
        {/* Main Search Input Box */}
        <div className="relative flex items-center bg-white dark:bg-slate-800/90 rounded-2xl shadow-lg border border-slate-200/90 dark:border-slate-700/80 transition-all focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500">
          <div className="pl-4 text-slate-400">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0 || searchError) setIsOpen(true);
            }}
            placeholder="Search city (e.g. San Francisco, Tokyo, Berlin)..."
            className="w-full py-3.5 px-3 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-sm sm:text-base font-medium"
          />

          {/* Right Action Icons */}
          <div className="flex items-center pr-2 gap-1">
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setIsOpen(false);
                }}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Geolocation Button */}
            <button
              onClick={handleGeolocation}
              disabled={isGeolocating || isLoadingWeather}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/80 text-sky-700 dark:text-sky-300 text-xs font-semibold transition-colors disabled:opacity-50 border border-sky-200/60 dark:border-sky-800/50"
              title="Detect current location"
            >
              {isGeolocating ? (
                <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
              ) : (
                <MapPin className="w-4 h-4 text-sky-500" />
              )}
              <span className="hidden sm:inline">Near Me</span>
            </button>
          </div>
        </div>

        {/* Search Results Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
            {isSearching && (
              <div className="p-4 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
                Searching cities...
              </div>
            )}

            {!isSearching && searchError && (
              <div className="p-4 text-center text-sm text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {searchError}
              </div>
            )}

            {!isSearching &&
              results.map((city) => {
                const locationDetails = [city.admin1, city.country].filter(Boolean).join(', ');
                return (
                  <button
                    key={`${city.id}-${city.latitude}-${city.longitude}`}
                    onClick={() => handleSelect(city)}
                    className="w-full text-left px-4 py-3 hover:bg-sky-50 dark:hover:bg-slate-700/60 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400">
                          {city.name}
                        </div>
                        {locationDetails && (
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {locationDetails}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-xs text-slate-400 font-mono">
                      {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                    </div>
                  </button>
                );
              })}
          </div>
        )}
      </div>

      {/* Popular Quick-Select Chips */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-400 font-medium shrink-0">Popular:</span>
        {POPULAR_CITIES.map((city) => (
          <button
            key={city.id}
            onClick={() => handleSelect(city)}
            className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-slate-600 dark:text-slate-300 hover:text-sky-700 dark:hover:text-sky-300 font-medium transition-colors border border-slate-200/60 dark:border-slate-700/60 shrink-0"
          >
            {city.name}
          </button>
        ))}
      </div>
    </div>
  );
};
