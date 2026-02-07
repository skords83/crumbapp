import React, { useState } from 'react';
import './BakersPercentage.css';

function BakersPercentage() {
  const [ingredients, setIngredients] = useState([
    { name: 'Mehl (gesamt)', weight: 1000, isFlour: true, percentage: 100 },
    { name: 'Wasser', weight: 650, isFlour: false, percentage: 65 },
    { name: 'Salz', weight: 20, isFlour: false, percentage: 2 },
    { name: 'Hefe/Sauerteig', weight: 50, isFlour: false, percentage: 5 }
  ]);
  
  const [targetFlourWeight, setTargetFlourWeight] = useState(1000);

  const calculatePercentages = () => {
    const flourWeight = ingredients.find(ing => ing.isFlour)?.weight || 1000;
    
    return ingredients.map(ing => ({
      ...ing,
      percentage: ing.isFlour ? 100 : ((ing.weight / flourWeight) * 100).toFixed(1)
    }));
  };

  const scaleRecipe = (newFlourWeight) => {
    const flourWeight = ingredients.find(ing => ing.isFlour)?.weight || 1000;
    const factor = newFlourWeight / flourWeight;
    
    setIngredients(ingredients.map(ing => ({
      ...ing,
      weight: Math.round(ing.weight * factor * 10) / 10
    })));
  };

  const addIngredient = () => {
    setIngredients([...ingredients, {
      name: 'Neue Zutat',
      weight: 0,
      isFlour: false,
      percentage: 0
    }]);
  };

  const updateIngredient = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return ingredients.reduce((sum, ing) => sum + parseFloat(ing.weight || 0), 0);
  };

  const calculatedIngredients = calculatePercentages();
  const totalWeight = calculateTotal();
  const totalPercentage = calculatedIngredients.reduce((sum, ing) => 
    sum + parseFloat(ing.percentage || 0), 0
  );

  return (
    <div className="bakers-percentage">
      <div className="calculator-header">
        <h2>🧮 Bäckerprozent-Rechner</h2>
        <p className="description">
          Berechne Bäckerprozente und skaliere Rezepte präzise
        </p>
      </div>

      <div className="calculator-content">
        <div className="ingredients-section">
          <h3>Zutaten</h3>
          
          <div className="ingredients-table">
            <div className="table-header">
              <div className="col-name">Zutat</div>
              <div className="col-weight">Gewicht (g)</div>
              <div className="col-percentage">Prozent (%)</div>
              <div className="col-flour">Mehl?</div>
              <div className="col-actions"></div>
            </div>

            {calculatedIngredients.map((ing, index) => (
              <div key={index} className="table-row">
                <div className="col-name">
                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                    placeholder="Zutat"
                  />
                </div>
                <div className="col-weight">
                  <input
                    type="number"
                    value={ing.weight}
                    onChange={(e) => updateIngredient(index, 'weight', parseFloat(e.target.value) || 0)}
                    step="0.1"
                  />
                </div>
                <div className="col-percentage">
                  <span className="percentage-display">{ing.percentage}%</span>
                </div>
                <div className="col-flour">
                  <input
                    type="checkbox"
                    checked={ing.isFlour}
                    onChange={(e) => updateIngredient(index, 'isFlour', e.target.checked)}
                  />
                </div>
                <div className="col-actions">
                  {ingredients.length > 1 && (
                    <button 
                      className="remove-btn"
                      onClick={() => removeIngredient(index)}
                      title="Zutat entfernen"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="table-footer">
              <div className="col-name"><strong>Gesamt</strong></div>
              <div className="col-weight"><strong>{totalWeight.toFixed(1)}g</strong></div>
              <div className="col-percentage"><strong>{totalPercentage.toFixed(1)}%</strong></div>
              <div className="col-flour"></div>
              <div className="col-actions"></div>
            </div>
          </div>

          <button className="add-ingredient-btn" onClick={addIngredient}>
            + Zutat hinzufügen
          </button>
        </div>

        <div className="scaling-section">
          <h3>Rezept skalieren</h3>
          <p className="scaling-hint">
            Gib die gewünschte Mehlmenge ein, um das gesamte Rezept automatisch anzupassen:
          </p>
          
          <div className="scaling-input">
            <label>Ziel-Mehlgewicht:</label>
            <div className="input-group">
              <input
                type="number"
                value={targetFlourWeight}
                onChange={(e) => setTargetFlourWeight(parseFloat(e.target.value) || 0)}
                step="50"
              />
              <span>g</span>
            </div>
            <button 
              className="scale-btn"
              onClick={() => scaleRecipe(targetFlourWeight)}
            >
              Rezept skalieren
            </button>
          </div>

          <div className="quick-scale">
            <p>Schnell-Skalierung:</p>
            <div className="quick-buttons">
              <button onClick={() => scaleRecipe(500)}>500g</button>
              <button onClick={() => scaleRecipe(750)}>750g</button>
              <button onClick={() => scaleRecipe(1000)}>1kg</button>
              <button onClick={() => scaleRecipe(1500)}>1.5kg</button>
              <button onClick={() => scaleRecipe(2000)}>2kg</button>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>ℹ️ Was sind Bäckerprozente?</h3>
          <p>
            Bäckerprozente sind ein Standardsystem in der Bäckerei, bei dem alle Zutaten 
            als Prozentsatz der <strong>Gesamtmehlmenge</strong> angegeben werden.
          </p>
          <ul>
            <li>Mehl = immer 100%</li>
            <li>Wasser = 65% bedeutet 650g Wasser auf 1000g Mehl</li>
            <li>Salz = typisch 2% (20g pro 1000g Mehl)</li>
          </ul>
          <p>
            <strong>Vorteil:</strong> Rezepte lassen sich einfach auf jede beliebige Größe skalieren!
          </p>
        </div>
      </div>
    </div>
  );
}

export default BakersPercentage;
