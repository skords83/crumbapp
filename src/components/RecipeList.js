import React, { useState } from 'react';
import './RecipeList.css';

function RecipeList({ recipes, onDelete, onSelect, onViewDetail, favorites, onToggleFavorite, filters, onFilterChange }) {
  const [searchQuery, setSearchQuery] = useState('');

  const formatDuration = (steps) => {
    const total = steps.reduce((sum, step) => sum + step.duration, 0);
    if (total < 60) {
      return `${total} Min`;
    }
    const hours = Math.floor(total / 60);
    const mins = total % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const canFinishToday = (recipe) => {
    const totalMinutes = recipe.steps.reduce((sum, step) => sum + step.duration, 0);
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59);
    const remainingMinutes = (endOfDay - now) / (1000 * 60);
    return totalMinutes <= remainingMinutes;
  };

  const hasNighttimeActions = (recipe) => {
    const now = new Date();
    let currentTime = new Date(now);
    for (let step of recipe.steps) {
      const stepHour = currentTime.getHours();
      if (stepHour >= 22 || stepHour < 6) {
        return true;
      }
      currentTime = new Date(currentTime.getTime() + step.duration * 60000);
    }
    return false;
  };

  const getRecipeTypeLabel = (type) => {
    switch (type) {
      case 'sourdough': return 'Sauerteig';
      case 'yeast': return 'Hefe';
      case 'mixed': return 'Gemischt';
      default: return 'Andere';
    }
  };

  // Apply filters
  let filteredRecipes = recipes.filter(recipe => {
    // Search filter
    if (searchQuery && !recipe.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Favorites filter
    if (filters.showFavoritesOnly && !favorites.includes(recipe.id)) {
      return false;
    }

    // Recipe type filter
    if (filters.recipeType !== 'all' && recipe.recipeType !== filters.recipeType) {
      return false;
    }

    // Finish today filter
    if (filters.finishToday && !canFinishToday(recipe)) {
      return false;
    }

    // Nighttime filter
    if (filters.respectNighttime && hasNighttimeActions(recipe)) {
      return false;
    }

    return true;
  });

  if (recipes.length === 0) {
    return (
      <div className="recipe-list empty">
        <div className="empty-state">
          <img src="/logo-bread.svg" alt="Noch keine Rezepte" className="empty-state-icon" style={{width: '120px', height: '120px', opacity: 0.2, color: 'var(--brown-primary)'}} />
          <h3>Noch keine Rezepte</h3>
          <p>Importiere dein erstes Brotrezept oder erstelle eins manuell.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-list">
      {/* Search Bar - Mockup Style */}
      <div className="search-section">
        <div className="search-container">
          <svg className="search-icon" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Rezepte durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>
              <svg viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filter Buttons - Mockup Style (NO ICONS!) */}
      <div className="recipe-filters">
        <button 
          className={`filter-btn ${filters.recipeType === 'all' && !filters.showFavoritesOnly ? 'active' : ''}`}
          onClick={() => onFilterChange({ ...filters, recipeType: 'all', showFavoritesOnly: false })}
        >
          Alle
        </button>
        <button 
          className={`filter-btn ${filters.recipeType === 'sourdough' ? 'active' : ''}`}
          onClick={() => onFilterChange({ ...filters, recipeType: 'sourdough', showFavoritesOnly: false })}
        >
          Sauerteig
        </button>
        <button 
          className={`filter-btn ${filters.recipeType === 'yeast' ? 'active' : ''}`}
          onClick={() => onFilterChange({ ...filters, recipeType: 'yeast', showFavoritesOnly: false })}
        >
          Hefe
        </button>
        <button 
          className={`filter-btn ${filters.recipeType === 'mixed' ? 'active' : ''}`}
          onClick={() => onFilterChange({ ...filters, recipeType: 'mixed', showFavoritesOnly: false })}
        >
          Gemischt
        </button>
        <button 
          className={`filter-btn ${filters.showFavoritesOnly ? 'active' : ''}`}
          onClick={() => onFilterChange({ ...filters, showFavoritesOnly: !filters.showFavoritesOnly })}
        >
          <svg viewBox="0 0 24 24" style={{width: '16px', height: '16px', marginRight: '0.375rem'}}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          Favoriten
        </button>
        <button 
          className={`filter-btn ${filters.finishToday ? 'active' : ''}`}
          onClick={() => onFilterChange({ ...filters, finishToday: !filters.finishToday })}
        >
          Heute fertig
        </button>
        <button 
          className={`filter-btn ${filters.respectNighttime ? 'active' : ''}`}
          onClick={() => onFilterChange({ ...filters, respectNighttime: !filters.respectNighttime })}
        >
          Nachtruhe OK
        </button>
      </div>

      {/* Section Title - AFTER filters like mockup */}
      <h2 className="section-title">Meine Rezepte</h2>

      {filteredRecipes.length === 0 ? (
        <div className="no-results">
          <p>Keine Rezepte gefunden, die den Filterkriterien entsprechen.</p>
        </div>
      ) : (
        <div className="recipe-grid">
          {filteredRecipes.map((recipe) => {
            const isFavorite = favorites.includes(recipe.id);
            
            return (
              <div key={recipe.id} className="recipe-card" onClick={() => onViewDetail(recipe)}>
                {/* Recipe Image - Fill card top completely */}
                <div className="recipe-image">
                  {recipe.image ? (
                    <img src={recipe.image} alt={recipe.name} />
                  ) : (
                    <img src="/logo-bread.svg" alt="Kein Bild" className="recipe-placeholder" />
                  )}
                  
                  {/* Type Badge - Top Left */}
                  <span className="recipe-type-badge">
                    {getRecipeTypeLabel(recipe.recipeType)}
                  </span>
                  
                  {/* Favorite Heart - Top Right */}
                  <button 
                    className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(recipe.id);
                    }}
                    title={isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>

                {/* Recipe Content */}
                <div className="recipe-content">
                  <h3 className="recipe-title">{recipe.name}</h3>
                  
                  {/* Meta Info - ONLY Time + Steps with clean icons */}
                  <div className="recipe-meta">
                    <div className="recipe-meta-item">
                      <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {formatDuration(recipe.steps)}
                    </div>
                    <div className="recipe-meta-item">
                      <svg viewBox="0 0 24 24">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                      </svg>
                      {recipe.steps.length} Schritte
                    </div>
                  </div>

                  {/* Action Buttons - Mockup Style */}
                  <div className="recipe-actions">
                    <button 
                      className="btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetail(recipe);
                      }}
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      Ansehen
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(recipe);
                      }}
                    >
                      <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      Planen
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RecipeList;
