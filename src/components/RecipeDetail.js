import React from 'react';
import './RecipeDetail.css';

function RecipeDetail({ recipe, onBack, onStartBaking, onEdit, onToggleFavorite, isFavorite }) {
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
      case 'fermentation': return '🫧';
      case 'baking': return '🔥';
      case 'cooling': return '❄️';
      default: return '👨‍🍳';
    }
  };

  const getRecipeTypeLabel = (type) => {
    switch (type) {
      case 'sourdough': return '🥖 Sauerteig';
      case 'yeast': return '🍞 Hefe';
      case 'mixed': return '🥐 Sauerteig + Hefe';
      default: return '🍞 Andere';
    }
  };

  return (
    <div className="recipe-detail">
      <div className="detail-header">
        <button className="back-button" onClick={onBack}>
          ← Zurück
        </button>
        <div className="header-actions">
          <button className="edit-button" onClick={onEdit} title="Rezept bearbeiten">
            ✏️ Bearbeiten
          </button>
          <button 
            className={`favorite-button ${isFavorite ? 'active' : ''}`}
            onClick={() => onToggleFavorite(recipe.id)}
            title={isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
          >
            {isFavorite ? '★' : '☆'}
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
            📎 Quelle: {recipe.source}
          </div>
        )}

        <div className="recipe-meta">
          <div className="meta-item">
            <span className="meta-icon">⏱️</span>
            <div>
              <div className="meta-label">Gesamtdauer</div>
              <div className="meta-value">{formatDuration(totalDuration)}</div>
            </div>
          </div>
          
          <div className="meta-item">
            <span className="meta-icon">📝</span>
            <div>
              <div className="meta-label">Schritte</div>
              <div className="meta-value">{recipe.steps.length}</div>
            </div>
          </div>
          
          {recipe.recipeType && (
            <div className="meta-item">
              <span className="meta-icon">{getRecipeTypeLabel(recipe.recipeType).split(' ')[0]}</span>
              <div>
                <div className="meta-label">Typ</div>
                <div className="meta-value">{getRecipeTypeLabel(recipe.recipeType).split(' ').slice(1).join(' ')}</div>
              </div>
            </div>
          )}
        </div>

        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className="recipe-ingredients">
            <h2>Zutaten</h2>
            <div className="ingredients-list">
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="ingredient-item">
                  <div className="ingredient-main">
                    <span className="ingredient-name">{ingredient.name}</span>
                    <span className="ingredient-amount">
                      {ingredient.amount} {ingredient.unit}
                    </span>
                  </div>
                  {(ingredient.temperature || ingredient.notes) && (
                    <div className="ingredient-meta">
                      {ingredient.temperature && (
                        <span className="ingredient-temp">🌡️ {ingredient.temperature}</span>
                      )}
                      {ingredient.notes && (
                        <span className="ingredient-notes">💡 {ingredient.notes}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="recipe-steps">
          <h2>Schritte</h2>
          {recipe.steps.map((step, index) => (
            <div key={index} className={`step-detail ${step.type}`}>
              <div className="step-number">{index + 1}</div>
              <div className="step-content">
                <div className="step-header-detail">
                  <h3>
                    {getStepIcon(step.type)} {step.name}
                  </h3>
                  <span className="step-duration">{formatDuration(step.duration)}</span>
                </div>
                <p className="step-instructions">{step.instructions}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="detail-actions">
          <button className="start-baking-button" onClick={onStartBaking}>
            Backzeit planen
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
