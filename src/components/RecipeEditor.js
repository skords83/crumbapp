import React, { useState } from 'react';
import './RecipeEditor.css';

function RecipeEditor({ recipe, onSave, onCancel }) {
  const [editedRecipe, setEditedRecipe] = useState({
    ...recipe,
    ingredients: recipe.ingredients || [],
    steps: recipe.steps || []
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editedRecipe);
    } finally {
      setIsSaving(false);
    }
  };

  const addIngredient = () => {
    setEditedRecipe({
      ...editedRecipe,
      ingredients: [...editedRecipe.ingredients, { name: '', amount: '', unit: '', temperature: '', notes: '' }]
    });
  };

  const updateIngredient = (index, field, value) => {
    const newIngredients = [...editedRecipe.ingredients];
    newIngredients[index][field] = value;
    setEditedRecipe({ ...editedRecipe, ingredients: newIngredients });
  };

  const removeIngredient = (index) => {
    setEditedRecipe({
      ...editedRecipe,
      ingredients: editedRecipe.ingredients.filter((_, i) => i !== index)
    });
  };

  const addStep = () => {
    setEditedRecipe({
      ...editedRecipe,
      steps: [...editedRecipe.steps, { name: '', duration: 0, instructions: '', type: 'prep' }]
    });
  };

  const updateStep = (index, field, value) => {
    const newSteps = [...editedRecipe.steps];
    newSteps[index][field] = value;
    setEditedRecipe({ ...editedRecipe, steps: newSteps });
  };

  const removeStep = (index) => {
    setEditedRecipe({
      ...editedRecipe,
      steps: editedRecipe.steps.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="recipe-editor">
      <div className="editor-header">
        <h2>Rezept bearbeiten</h2>
        <div className="editor-actions">
          <button className="cancel-btn" onClick={onCancel}>Abbrechen</button>
          <button className="save-btn" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Speichert...' : 'Speichern'}
          </button>
        </div>
      </div>

      <div className="editor-content">
        {/* Basic Info */}
        <div className="editor-section">
          <h3>Grundinformationen</h3>
          
          <div className="form-group">
            <label>Rezeptname *</label>
            <input
              type="text"
              value={editedRecipe.name}
              onChange={(e) => setEditedRecipe({ ...editedRecipe, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Quelle</label>
            <input
              type="text"
              value={editedRecipe.source || ''}
              onChange={(e) => setEditedRecipe({ ...editedRecipe, source: e.target.value })}
              placeholder="z.B. Omas Rezeptbuch"
            />
          </div>

          <div className="form-group">
            <label>Bild-URL</label>
            <input
              type="url"
              value={editedRecipe.image || ''}
              onChange={(e) => setEditedRecipe({ ...editedRecipe, image: e.target.value })}
              placeholder="https://..."
            />
            {editedRecipe.image && (
              <div className="image-preview">
                <img src={editedRecipe.image} alt="Vorschau" onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Rezepttyp</label>
            <select
              value={editedRecipe.recipeType}
              onChange={(e) => setEditedRecipe({ ...editedRecipe, recipeType: e.target.value })}
            >
              <option value="sourdough">Sauerteig</option>
              <option value="yeast">Hefe</option>
              <option value="mixed">Sauerteig + Hefe</option>
              <option value="other">Andere</option>
            </select>
          </div>
        </div>

        {/* Ingredients */}
        <div className="editor-section">
          <h3>Zutaten</h3>
          
          {editedRecipe.ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-edit">
              <div className="ingredient-header">
                <span>Zutat {index + 1}</span>
                {editedRecipe.ingredients.length > 1 && (
                  <button type="button" onClick={() => removeIngredient(index)}>✕</button>
                )}
              </div>

              <input
                type="text"
                placeholder="Name"
                value={ingredient.name}
                onChange={(e) => updateIngredient(index, 'name', e.target.value)}
              />

              <div className="ingredient-row">
                <input
                  type="text"
                  placeholder="Menge"
                  value={ingredient.amount}
                  onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                />
                <select
                  value={ingredient.unit}
                  onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                >
                  <option value="">Einheit</option>
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="l">l</option>
                  <option value="EL">EL</option>
                  <option value="TL">TL</option>
                  <option value="Prise">Prise</option>
                  <option value="Stk">Stk</option>
                </select>
              </div>

              <div className="ingredient-row">
                <input
                  type="text"
                  placeholder="Temperatur"
                  value={ingredient.temperature}
                  onChange={(e) => updateIngredient(index, 'temperature', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Hinweise"
                  value={ingredient.notes}
                  onChange={(e) => updateIngredient(index, 'notes', e.target.value)}
                />
              </div>
            </div>
          ))}

          <button className="add-btn" onClick={addIngredient}>+ Zutat hinzufügen</button>
        </div>

        {/* Steps */}
        <div className="editor-section">
          <h3>Schritte</h3>
          
          {editedRecipe.steps.map((step, index) => (
            <div key={index} className="step-edit">
              <div className="step-header">
                <span>Schritt {index + 1}</span>
                {editedRecipe.steps.length > 1 && (
                  <button type="button" onClick={() => removeStep(index)}>✕</button>
                )}
              </div>

              <input
                type="text"
                placeholder="Name"
                value={step.name}
                onChange={(e) => updateStep(index, 'name', e.target.value)}
              />

              <div className="step-row">
                <input
                  type="number"
                  placeholder="Dauer (Min)"
                  value={step.duration}
                  onChange={(e) => updateStep(index, 'duration', parseInt(e.target.value) || 0)}
                />
                <select
                  value={step.type}
                  onChange={(e) => updateStep(index, 'type', e.target.value)}
                >
                  <option value="prep">Vorbereitung</option>
                  <option value="fermentation">Gare</option>
                  <option value="baking">Backen</option>
                  <option value="cooling">Abkühlen</option>
                </select>
              </div>

              <textarea
                placeholder="Anleitung..."
                value={step.instructions}
                onChange={(e) => updateStep(index, 'instructions', e.target.value)}
                rows="3"
              />
            </div>
          ))}

          <button className="add-btn" onClick={addStep}>+ Schritt hinzufügen</button>
        </div>
      </div>

      <div className="editor-footer">
        <button className="cancel-btn" onClick={onCancel}>Abbrechen</button>
        <button className="save-btn" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Speichert...' : 'Speichern'}
        </button>
      </div>
    </div>
  );
}

export default RecipeEditor;
