import React from 'react';
import './RecipeFilter.css';

function RecipeFilter({ filters, onFilterChange }) {
  return (
    <div className="recipe-filter">
      <div className="filter-section">
        <button
          className={`filter-chip ${filters.showFavoritesOnly ? 'active' : ''}`}
          onClick={() => onFilterChange('showFavoritesOnly', !filters.showFavoritesOnly)}
        >
          ★ Nur Favoriten
        </button>
      </div>

      <div className="filter-section">
        <label className="filter-label">Rezepttyp</label>
        <div className="filter-chips">
          <button
            className={`filter-chip ${filters.recipeType === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('recipeType', 'all')}
          >
            Alle
          </button>
          <button
            className={`filter-chip ${filters.recipeType === 'sourdough' ? 'active' : ''}`}
            onClick={() => onFilterChange('recipeType', 'sourdough')}
          >
            🥖 Sauerteig
          </button>
          <button
            className={`filter-chip ${filters.recipeType === 'yeast' ? 'active' : ''}`}
            onClick={() => onFilterChange('recipeType', 'yeast')}
          >
            🍞 Hefe
          </button>
          <button
            className={`filter-chip ${filters.recipeType === 'mixed' ? 'active' : ''}`}
            onClick={() => onFilterChange('recipeType', 'mixed')}
          >
            🥐 Gemischt
          </button>
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">Zeitfenster</label>
        <div className="filter-chips">
          <button
            className={`filter-chip ${filters.finishToday ? 'active' : ''}`}
            onClick={() => onFilterChange('finishToday', !filters.finishToday)}
          >
            ⏰ Heute fertig
          </button>
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">Nachtruhe (22-6 Uhr)</label>
        <div className="filter-chips">
          <button
            className={`filter-chip ${filters.respectNighttime ? 'active' : ''}`}
            onClick={() => onFilterChange('respectNighttime', !filters.respectNighttime)}
          >
            🌙 Keine Aktionen nachts
          </button>
        </div>
      </div>

      {(filters.showFavoritesOnly || filters.recipeType !== 'all' || filters.finishToday || filters.respectNighttime) && (
        <button className="clear-filters" onClick={() => onFilterChange('reset')}>
          Filter zurücksetzen
        </button>
      )}
    </div>
  );
}

export default RecipeFilter;
