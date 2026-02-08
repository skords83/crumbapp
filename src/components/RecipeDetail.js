import React from 'react';
import './RecipeDetail.css';

function RecipeDetail({ recipe, onBack, onStartBaking, onEdit, onToggleFavorite, isFavorite, onDelete }) {
  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} Min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const totalDuration = recipe.steps.reduce((sum, step) => sum + step.duration, 0);

  const getStepIcon = (type) => {
    switch (type) {
      case 'fermentation':
        return (
          <svg viewBox="0 0 24 24" className="step-icon">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        );
      case 'baking':
        return (
          <svg viewBox="0 0 24 24" className="step-icon">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        );
      case 'cooling':
        return (
          <svg viewBox="0 0 24 24" className="step-icon">
            <path d="M12 2v20M17 7l-5 5-5-5M17 17l-5-5-5 5"/>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" className="step-icon">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6"/>
          </svg>
        );
    }
  };

  const getRecipeTypeLabel = (type) => {
    switch (type) {
      case 'sourdough': return 'Sauerteig';
      case 'yeast': return 'Hefe';
      case 'mixed': return 'Sauerteig + Hefe';
      default: return 'Andere';
    }
  };

  return (
    <div className="recipe-detail">
      <div className="detail-header">
        <button className="back-button" onClick={onBack}>
          <svg viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Zurück
        </button>
        <div className="header-actions">
          <button className="icon-btn" onClick={onEdit} title="Rezept bearbeiten">
            <svg viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button 
            className={`icon-btn favorite-button ${isFavorite ? 'active' : ''}`}
            onClick={() => onToggleFavorite(recipe.id)}
            title={isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
          >
            <svg viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <button 
            className="icon-btn delete-button"
            onClick={() => {
              if (window.confirm(`Möchten Sie "${recipe.name}" wirklich dauerhaft löschen? Diese Aktion kann nicht rückgängig gemacht werden.`)) {
                onDelete(recipe.id);
                onBack();
              }
            }}
            title="Rezept löschen"
          >
            <svg viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          </button>
        </div>
      </div>

      {recipe.image && (
        <div className="recipe-image">
          <img src={recipe.image} alt={recipe.name} />
        </div>
      )}

      <div className="recipe-info">
        <h1>{recipe.name}</h1>
        
        {recipe.source && (
          <div className="recipe-source">
            <svg viewBox="0 0 24 24" className="source-icon">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            <a href={recipe.source} target="_blank" rel="noopener noreferrer">{new URL(recipe.source).hostname}</a>
          </div>
        )}

        <div className="recipe-meta">
          <div className="meta-item">
            <svg viewBox="0 0 24 24" className="meta-icon">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <div>
              <div className="meta-label">Gesamtdauer</div>
              <div className="meta-value">{formatDuration(totalDuration)}</div>
            </div>
          </div>
          
          <div className="meta-item">
            <svg viewBox="0 0 24 24" className="meta-icon">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <div>
              <div className="meta-label">Schritte</div>
              <div className="meta-value">{recipe.steps.length}</div>
            </div>
          </div>
          
          {recipe.recipeType && (
            <div className="meta-item">
              <svg viewBox="0 0 24 24" className="meta-icon">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <div>
                <div className="meta-label">Typ</div>
                <div className="meta-value">{getRecipeTypeLabel(recipe.recipeType)}</div>
              </div>
            </div>
          )}
        </div>

        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className="recipe-ingredients">
            <h2>
              <svg viewBox="0 0 24 24" className="section-icon">
                <path d="M3 2h18v20H3z"/>
                <path d="M7 7h10M7 12h10M7 17h10"/>
              </svg>
              Zutaten
            </h2>
            <div className="ingredients-list">
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="ingredient-item">
                  <span className="ingredient-amount">
                    {ingredient.amount} {ingredient.unit}
                  </span>
                  <span className="ingredient-name">{ingredient.name}</span>
                  {ingredient.temperature ? (
                    <span className="ingredient-temp">
                      <svg viewBox="0 0 24 24" className="inline-icon">
                        <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z"/>
                      </svg>
                      {ingredient.temperature}
                    </span>
                  ) : (
                    <span className="ingredient-placeholder"></span>
                  )}
                  {ingredient.notes ? (
                    <span className="ingredient-notes">
                      <svg viewBox="0 0 24 24" className="inline-icon">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4M12 8h.01"/>
                      </svg>
                      {ingredient.notes}
                    </span>
                  ) : (
                    <span className="ingredient-placeholder"></span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="recipe-steps">
          <h2>
            <svg viewBox="0 0 24 24" className="section-icon">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            Schritte
          </h2>
          {recipe.steps.map((step, index) => (
            <div key={index} className={`step-detail ${step.type}`}>
              <div className="step-number">{index + 1}</div>
              <div className="step-content">
                <div className="step-header-detail">
                  <h3>
                    {getStepIcon(step.type)}
                    {step.name}
                  </h3>
                  <span className="step-duration">
                    <svg viewBox="0 0 24 24" className="duration-icon">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {formatDuration(step.duration)}
                  </span>
                </div>
                <p className="step-instructions">{step.instructions}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="detail-actions">
          <button className="btn btn-primary" onClick={onStartBaking}>
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            Backzeit planen
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
