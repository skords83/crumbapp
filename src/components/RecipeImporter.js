import React, { useState } from 'react';
import './RecipeImporter.css';

function RecipeImporter({ onRecipeImported }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [manualMode, setManualMode] = useState(false);
  const [manualRecipe, setManualRecipe] = useState({
    name: '',
    source: '',
    image: '',
    recipeType: 'sourdough', // 'sourdough', 'yeast', 'mixed'
    ingredients: [
      { name: '', amount: '', unit: '', temperature: '', notes: '' }
    ],
    steps: [{ name: '', duration: 0, instructions: '', type: 'prep' }]
  });

  const parseRecipeFromUrl = async (recipeUrl) => {
    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL || '/api';
      const response = await fetch(`${apiUrl}/parse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: recipeUrl })
      });

      if (!response.ok) {
        throw new Error('Fehler beim Parsen des Rezepts');
      }

      const recipe = await response.json();
      onRecipeImported(recipe);
    } catch (err) {
      console.error('Parse error:', err);
      setError('Fehler beim Importieren. Bitte URL prüfen oder manuell eingeben. Tipp: Stelle sicher, dass der Backend-Server läuft (Port 3001).');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      parseRecipeFromUrl(url);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualRecipe.name && manualRecipe.steps.length > 0) {
      onRecipeImported(manualRecipe);
    }
  };

  const addStep = () => {
    setManualRecipe({
      ...manualRecipe,
      steps: [...manualRecipe.steps, { name: '', duration: 0, instructions: '', type: 'prep' }]
    });
  };

  const addIngredient = () => {
    setManualRecipe({
      ...manualRecipe,
      ingredients: [...manualRecipe.ingredients, { name: '', amount: '', unit: '', temperature: '', notes: '' }]
    });
  };

  const updateIngredient = (index, field, value) => {
    const newIngredients = [...manualRecipe.ingredients];
    newIngredients[index][field] = value;
    setManualRecipe({ ...manualRecipe, ingredients: newIngredients });
  };

  const removeIngredient = (index) => {
    setManualRecipe({
      ...manualRecipe,
      ingredients: manualRecipe.ingredients.filter((_, i) => i !== index)
    });
  };

  const updateStep = (index, field, value) => {
    const newSteps = [...manualRecipe.steps];
    newSteps[index][field] = value;
    setManualRecipe({ ...manualRecipe, steps: newSteps });
  };

  const removeStep = (index) => {
    setManualRecipe({
      ...manualRecipe,
      steps: manualRecipe.steps.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="recipe-importer">
      <div className="mode-toggle">
        <button 
          className={!manualMode ? 'active' : ''}
          onClick={() => setManualMode(false)}
        >
          Von URL importieren
        </button>
        <button 
          className={manualMode ? 'active' : ''}
          onClick={() => setManualMode(true)}
        >
          Manuell erstellen
        </button>
      </div>

      {!manualMode ? (
        <div className="url-import">
          <h2>Rezept von Webseite importieren</h2>
          <p className="hint">Funktioniert mit: Plötzblog, Homebaking.at, Ketex, u.v.m.</p>
          
          <form onSubmit={handleUrlSubmit}>
            <input
              type="url"
              placeholder="https://www.ploetzblog.de/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !url.trim()}>
              {loading ? 'Importiere...' : 'Importieren'}
            </button>
          </form>

          {error && <div className="error">{error}</div>}

          <div className="demo-links">
            <p>Zum Testen:</p>
            <button onClick={() => setUrl('https://www.ploetzblog.de/example')}>
              Demo-URL laden
            </button>
          </div>
        </div>
      ) : (
        <div className="manual-input">
          <h2>Rezept manuell erstellen</h2>
          
          <form onSubmit={handleManualSubmit}>
            <div className="form-group">
              <label>Rezeptname</label>
              <input
                type="text"
                placeholder="z.B. Roggenmischbrot"
                value={manualRecipe.name}
                onChange={(e) => setManualRecipe({ ...manualRecipe, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Quelle (optional)</label>
              <input
                type="text"
                placeholder="z.B. Omas Rezeptbuch"
                value={manualRecipe.source}
                onChange={(e) => setManualRecipe({ ...manualRecipe, source: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Bild-URL (optional)</label>
              <input
                type="url"
                placeholder="https://example.com/brot.jpg"
                value={manualRecipe.image}
                onChange={(e) => setManualRecipe({ ...manualRecipe, image: e.target.value })}
              />
              {manualRecipe.image && (
                <div className="image-preview">
                  <img src={manualRecipe.image} alt="Vorschau" onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Rezepttyp</label>
              <select
                value={manualRecipe.recipeType}
                onChange={(e) => setManualRecipe({ ...manualRecipe, recipeType: e.target.value })}
              >
                <option value="sourdough">Sauerteig</option>
                <option value="yeast">Hefe</option>
                <option value="mixed">Sauerteig + Hefe</option>
                <option value="other">Andere</option>
              </select>
            </div>

            <div className="ingredients-section-form">
              <h3>Zutaten</h3>
              
              {manualRecipe.ingredients.map((ingredient, index) => (
                <div key={index} className="ingredient-input">
                  <div className="ingredient-header">
                    <span>Zutat {index + 1}</span>
                    {manualRecipe.ingredients.length > 1 && (
                      <button type="button" onClick={() => removeIngredient(index)}>✕</button>
                    )}
                  </div>

                  <div className="ingredient-row">
                    <input
                      type="text"
                      placeholder="Name (z.B. Weizenmehl Type 550)"
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="ingredient-row-double">
                    <div>
                      <input
                        type="text"
                        placeholder="Menge (z.B. 500)"
                        value={ingredient.amount}
                        onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <select
                        value={ingredient.unit}
                        onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                      >
                        <option value="">Einheit wählen</option>
                        <option value="g">g (Gramm)</option>
                        <option value="kg">kg (Kilogramm)</option>
                        <option value="ml">ml (Milliliter)</option>
                        <option value="l">l (Liter)</option>
                        <option value="EL">EL (Esslöffel)</option>
                        <option value="TL">TL (Teelöffel)</option>
                        <option value="Prise">Prise</option>
                        <option value="Stk">Stk (Stück)</option>
                      </select>
                    </div>
                  </div>

                  <div className="ingredient-row-double">
                    <div>
                      <input
                        type="text"
                        placeholder="Temperatur (z.B. 20°C)"
                        value={ingredient.temperature}
                        onChange={(e) => updateIngredient(index, 'temperature', e.target.value)}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Hinweise (z.B. lauwarm)"
                        value={ingredient.notes}
                        onChange={(e) => updateIngredient(index, 'notes', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" onClick={addIngredient} className="add-ingredient">
                + Zutat hinzufügen
              </button>
            </div>

            <div className="steps-section">
              <h3>Schritte</h3>
              
              {manualRecipe.steps.map((step, index) => (
                <div key={index} className="step-input">
                  <div className="step-header">
                    <span>Schritt {index + 1}</span>
                    {manualRecipe.steps.length > 1 && (
                      <button type="button" onClick={() => removeStep(index)}>✕</button>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Name (z.B. Sauerteig ansetzen)"
                    value={step.name}
                    onChange={(e) => updateStep(index, 'name', e.target.value)}
                    required
                  />

                  <div className="duration-type-row">
                    <div>
                      <label>Dauer (Minuten)</label>
                      <input
                        type="number"
                        placeholder="z.B. 720"
                        value={step.duration}
                        onChange={(e) => updateStep(index, 'duration', parseInt(e.target.value) || 0)}
                        required
                      />
                    </div>

                    <div>
                      <label>Typ</label>
                      <select
                        value={step.type}
                        onChange={(e) => updateStep(index, 'type', e.target.value)}
                      >
                        <option value="prep">Vorbereitung</option>
                        <option value="fermentation">Gare/Fermentation</option>
                        <option value="baking">Backen</option>
                        <option value="cooling">Abkühlen</option>
                      </select>
                    </div>
                  </div>

                  <textarea
                    placeholder="Anleitung..."
                    value={step.instructions}
                    onChange={(e) => updateStep(index, 'instructions', e.target.value)}
                    rows="3"
                  />
                </div>
              ))}

              <button type="button" onClick={addStep} className="add-step">
                + Schritt hinzufügen
              </button>
            </div>

            <button type="submit" className="submit-recipe">
              Rezept speichern
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default RecipeImporter;
