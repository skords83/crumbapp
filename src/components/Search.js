import React, { useState, useEffect } from 'react';
import './Search.css';

function Search({ recipes, onSelectRecipe, favorites }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    filterAndSearch();
  }, [searchTerm, activeFilter, recipes]);

  const filterAndSearch = () => {
    let filtered = [...recipes];

    // Apply type filter
    if (activeFilter === 'sourdough') {
      filtered = filtered.filter(r => r.type === 'sourdough');
    } else if (activeFilter === 'yeast') {
      filtered = filtered.filter(r => r.type === 'yeast');
    } else if (activeFilter === 'mixed') {
      filtered = filtered.filter(r => r.type === 'mixed');
    } else if (activeFilter === 'favorites') {
      filtered = filtered.filter(r => favorites.includes(r.id));
    }

    // Apply search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(recipe => {
        // Search in name
        if (recipe.name.toLowerCase().includes(term)) return true;

        // Search in ingredients
        if (recipe.ingredients && recipe.ingredients.some(ing => 
          ing.name.toLowerCase().includes(term)
        )) return true;

        // Search in steps
        if (recipe.steps && recipe.steps.some(step => 
          step.name.toLowerCase().includes(term) ||
          (step.instructions && step.instructions.toLowerCase().includes(term))
        )) return true;

        // Search in source
        if (recipe.source && recipe.source.toLowerCase().includes(term)) return true;

        return false;
      });
    }

    setSearchResults(filtered);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setActiveFilter('all');
  };

  const getTotalTime = (recipe) => {
    if (!recipe.steps || recipe.steps.length === 0) return '?';
    const total = recipe.steps.reduce((sum, step) => sum + (step.duration || 0), 0);
    if (total >= 60) {
      const hours = Math.floor(total / 60);
      return `${hours}h`;
    }
    return `${total}min`;
  };

  return (
    <div className="search-container">
      {/* Search Bar */}
      <div className="search-section">
        <div className="search-bar">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Rezepte durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            Alle
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'sourdough' ? 'active' : ''}`}
            onClick={() => setActiveFilter('sourdough')}
          >
            Sauerteig
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'yeast' ? 'active' : ''}`}
            onClick={() => setActiveFilter('yeast')}
          >
            Hefe
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'mixed' ? 'active' : ''}`}
            onClick={() => setActiveFilter('mixed')}
          >
            Gemischt
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveFilter('favorites')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            Favoriten
          </button>
        </div>
      </div>

      {/* Results Info */}
      <div className="results-info">
        <span>{searchResults.length} {searchResults.length === 1 ? 'Rezept' : 'Rezepte'} gefunden</span>
        {(searchTerm || activeFilter !== 'all') && (
          <button className="clear-filters" onClick={clearSearch}>
            Filter zurücksetzen
          </button>
        )}
      </div>

      {/* Results Grid */}
      {searchResults.length > 0 ? (
        <div className="search-results-grid">
          {searchResults.map(recipe => (
            <div 
              key={recipe.id}
              className="search-result-card"
              onClick={() => onSelectRecipe(recipe)}
            >
              <div className="result-image">
                {recipe.image ? (
                  <img src={recipe.image} alt={recipe.name} />
                ) : (
                  <div className="result-placeholder">🍞</div>
                )}
                <span className="result-type-badge">
                  {recipe.type === 'sourdough' ? 'Sauerteig' : 
                   recipe.type === 'yeast' ? 'Hefe' : 'Gemischt'}
                </span>
                {favorites.includes(recipe.id) && (
                  <div className="result-favorite">
                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="result-content">
                <h3 className="result-title">{recipe.name}</h3>
                <div className="result-meta">
                  <span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {getTotalTime(recipe)}
                  </span>
                  <span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                    {recipe.steps ? recipe.steps.length : 0} Schritte
                  </span>
                </div>
                {searchTerm && (
                  <div className="match-highlight">
                    {recipe.ingredients && recipe.ingredients.some(ing => 
                      ing.name.toLowerCase().includes(searchTerm.toLowerCase())
                    ) && (
                      <span className="match-badge">Zutat gefunden</span>
                    )}
                    {recipe.steps && recipe.steps.some(step => 
                      step.name.toLowerCase().includes(searchTerm.toLowerCase())
                    ) && (
                      <span className="match-badge">In Schritten</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-search">
          <div className="empty-icon">🔍</div>
          <h3>Keine Rezepte gefunden</h3>
          <p>
            {searchTerm 
              ? `Keine Ergebnisse für "${searchTerm}"`
              : 'Keine Rezepte in dieser Kategorie'}
          </p>
          {(searchTerm || activeFilter !== 'all') && (
            <button className="btn-primary" onClick={clearSearch}>
              Suche zurücksetzen
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
