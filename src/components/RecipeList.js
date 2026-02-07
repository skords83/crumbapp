import React from 'react';
import './RecipeList.css';
import RecipeFilter from './RecipeFilter';

function RecipeList({ recipes, onDelete, onSelect, onViewDetail, favorites, onToggleFavorite, filters, onFilterChange }) {
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
    // Check if recipe would require actions between 22:00 and 6:00
    const now = new Date();
    const totalMinutes = recipe.steps.reduce((sum, step) => sum + step.duration, 0);
    
    // Simulate scheduling from now
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

  const getRecipeTypeBadge = (type) => {
    switch (type) {
      case 'sourdough': return { icon: '🥖', label: 'Sauerteig' };
      case 'yeast': return { icon: '🍞', label: 'Hefe' };
      case 'mixed': return { icon: '🥐', label: 'Gemischt' };
      default: return { icon: '🍞', label: 'Andere' };
    }
  };

  // Apply filters
  const filteredRecipes = recipes.filter(recipe => {
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
          <img src="/logo-bread.png" alt="Noch keine Rezepte" className="empty-state-icon" style={{width: '120px', height: '120px', opacity: 0.3}} />
          <h3>Noch keine Rezepte</h3>
          <p>Importiere dein erstes Brotrezept oder erstelle eins manuell.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-list">
      <h2>Meine Rezepte</h2>
      
      <RecipeFilter filters={filters} onFilterChange={onFilterChange} />

      {filteredRecipes.length === 0 ? (
        <div className="no-results">
          <p>Keine Rezepte gefunden, die den Filterkriterien entsprechen.</p>
        </div>
      ) : (
        <div className="recipes-grid">
          {filteredRecipes.map((recipe) => {
            const isFavorite = favorites.includes(recipe.id);
            const badge = getRecipeTypeBadge(recipe.recipeType);
            
            return (
              <div key={recipe.id} className="recipe-card">
                {recipe.image && (
                  <div className="recipe-card-image" onClick={() => onViewDetail(recipe)}>
                    <img src={recipe.image} alt={recipe.name} />
                    <div className="image-overlay">
                      <span>Details ansehen</span>
                    </div>
                  </div>
                )}
                
                <div className="recipe-header">
                  <h3 onClick={() => onViewDetail(recipe)} style={{ cursor: 'pointer' }}>
                    {recipe.name}
                  </h3>
                  <div className="recipe-actions">
                    <button 
                      className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(recipe.id);
                      }}
                      title={isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                    >
                      {isFavorite ? '★' : '☆'}
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`"${recipe.name}" wirklich löschen?`)) {
                          onDelete(recipe.id);
                        }
                      }}
                      title="Rezept löschen"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {recipe.source && (
                  <div className="recipe-source">
                    📎 {recipe.source}
                  </div>
                )}

                <div className="recipe-stats">
                  <div className="stat">
                    <span className="stat-icon">⏱️</span>
                    <span>{formatDuration(recipe.steps)}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-icon">📝</span>
                    <span>{recipe.steps.length} Schritte</span>
                  </div>
                  {recipe.recipeType && (
                    <div className="stat">
                      <span className="stat-icon">{badge.icon}</span>
                      <span>{badge.label}</span>
                    </div>
                  )}
                </div>

                <div className="recipe-badges">
                  {canFinishToday(recipe) && (
                    <span className="badge badge-today">⏰ Heute schaffbar</span>
                  )}
                  {!hasNighttimeActions(recipe) && (
                    <span className="badge badge-nightfree">🌙 Nachtruhe OK</span>
                  )}
                </div>

                <div className="recipe-steps-preview">
                  {recipe.steps.slice(0, 3).map((step, index) => (
                    <div key={index} className="step-preview">
                      {index + 1}. {step.name}
                    </div>
                  ))}
                  {recipe.steps.length > 3 && (
                    <div className="more-steps">
                      +{recipe.steps.length - 3} weitere
                    </div>
                  )}
                </div>

                <button 
                  className="start-planning-btn"
                  onClick={() => onSelect(recipe)}
                >
                  Backzeit planen
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RecipeList;
