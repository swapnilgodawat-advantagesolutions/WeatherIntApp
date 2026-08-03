import React from 'react';
import { Bookmark, MapPin, Trash2, X, Building2 } from 'lucide-react';
import { SavedCity } from '../types';

interface FavoriteCitiesProps {
  isOpen: boolean;
  onClose: () => void;
  savedCities: SavedCity[];
  onSelectCity: (city: SavedCity) => void;
  onRemoveCity: (id: string) => void;
}

export const FavoriteCities: React.FC<FavoriteCitiesProps> = ({
  isOpen,
  onClose,
  savedCities,
  onSelectCity,
  onRemoveCity,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Bookmark className="w-5 h-5 fill-amber-500/20" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Saved Locations
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {savedCities.length} {savedCities.length === 1 ? 'city' : 'cities'} bookmarked
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Saved List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedCities.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                No Saved Cities Yet
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Click the "Save City" button on any location card to quickly access its forecast here anytime.
              </p>
            </div>
          ) : (
            savedCities.map((city) => (
              <div
                key={city.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 group hover:border-sky-500/50 transition-all"
              >
                <div
                  onClick={() => {
                    onSelectCity(city);
                    onClose();
                  }}
                  className="flex-1 cursor-pointer flex items-center gap-3"
                >
                  <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400">
                      {city.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {[city.admin1, city.country].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveCity(city.id);
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Remove saved city"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center text-xs text-slate-400">
          Saved locations are stored locally in your browser session.
        </div>
      </div>
    </div>
  );
};
