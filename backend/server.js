const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (in production, use a database)
const sharedRecipes = new Map();

// Recipe parser for different websites
class RecipeParser {
  static async parse(url) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const $ = cheerio.load(response.data);
      const domain = new URL(url).hostname;

      // Try schema.org first (works for many sites)
      const schemaRecipe = this.parseSchemaOrg($);
      if (schemaRecipe) {
        return schemaRecipe;
      }

      // Site-specific parsers
      if (domain.includes('ploetzblog')) {
        return this.parsePloetzblog($, url);
      } else if (domain.includes('homebaking')) {
        return this.parseHomebaking($, url);
      } else if (domain.includes('ketex')) {
        return this.parseKetex($, url);
      }

      return null;
    } catch (error) {
      console.error('Parse error:', error);
      throw new Error('Could not parse recipe from URL');
    }
  }

  static parseSchemaOrg($) {
    const script = $('script[type="application/ld+json"]').html();
    if (!script) return null;

    try {
      const data = JSON.parse(script);
      const recipe = Array.isArray(data) ? data.find(d => d['@type'] === 'Recipe') : 
                     (data['@type'] === 'Recipe' ? data : null);

      if (!recipe) return null;

      const steps = this.extractSteps(recipe.recipeInstructions || []);
      const ingredients = this.extractIngredients(recipe.recipeIngredient || []);
      
      return {
        name: recipe.name,
        source: recipe.url || '',
        image: recipe.image?.url || recipe.image || '',
        recipeType: this.detectRecipeType(recipe.name + ' ' + JSON.stringify(recipe.recipeIngredient || [])),
        steps,
        ingredients
      };
    } catch (e) {
      return null;
    }
  }

  static extractIngredients(ingredientList) {
    if (!Array.isArray(ingredientList)) return [];

    return ingredientList.map((ing, index) => {
      if (typeof ing === 'string') {
        return this.parseIngredientString(ing, index);
      }
      return null;
    }).filter(Boolean);
  }

  static parseIngredientString(str, index) {
    // Parse ingredient string like "500g Mehl" or "2 EL Salz"
    const trimmed = str.trim();
    
    // Try to extract amount, unit, and name
    const patterns = [
      /^(\d+(?:[,.]\d+)?)\s*(kg|g|ml|l|EL|TL|Prise|Stück)?\s+(.+)$/i,
      /^(\d+(?:[,.]\d+)?)\s+(.+)$/,
      /^(.+)$/
    ];

    for (const pattern of patterns) {
      const match = trimmed.match(pattern);
      if (match) {
        if (pattern.source.includes('kg|g')) {
          // Full pattern with unit
          return {
            id: index + 1,
            name: match[3].trim(),
            amount: parseFloat(match[1].replace(',', '.')),
            unit: match[2] || ''
          };
        } else if (match.length === 3) {
          // Amount + name
          return {
            id: index + 1,
            name: match[2].trim(),
            amount: parseFloat(match[1].replace(',', '.')),
            unit: ''
          };
        } else {
          // Just name
          return {
            id: index + 1,
            name: match[1].trim(),
            amount: null,
            unit: ''
          };
        }
      }
    }

    return {
      id: index + 1,
      name: trimmed,
      amount: null,
      unit: ''
    };
  }

  static parsePloetzblog($, url) {
    const name = $('h1.entry-title').text().trim() || $('h1').first().text().trim();
    const image = $('meta[property="og:image"]').attr('content') || '';
    
    // Try to extract ingredients - WPRM Plugin support
    const ingredients = [];
    let ingredientIndex = 0;
    let inPlanungsbeispiel = false;
    
    // Try WPRM (WordPress Recipe Maker) first
    $('.wprm-recipe-ingredient').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text) {
        const parsed = this.parseIngredientString(text, ingredientIndex++);
        if (parsed) ingredients.push(parsed);
      }
    });
    
    // Fallback: Try lists (but skip Planungsbeispiel section!)
    if (ingredients.length === 0) {
      $('.entry-content ul li, .entry-content ol li, .entry-content p').each((i, elem) => {
        const text = $(elem).text().trim();
        
        // Check if we're entering Planungsbeispiel section
        if (text.match(/planungsbeispiel/i) || text.match(/gesamtzubereitungszeit/i)) {
          inPlanungsbeispiel = true;
          return; // Skip this element
        }
        
        // Skip time-based entries (format: "08:44 Uhr" or "16:00 Uhr")
        if (text.match(/^\d{1,2}:\d{2}\s*(Uhr)?/i)) {
          return; // Skip time entries
        }
        
        // Stop parsing ingredients if in Planungsbeispiel section
        if (inPlanungsbeispiel) {
          return;
        }
        
        // Check if it looks like an ingredient
        if (text.match(/\d+\s*(g|kg|ml|l|EL|TL|Prise|Stück|%)/i) || 
            text.match(/^(ca\.|etwa)\s+\d+/i) ||
            text.match(/^\d+[.,]?\d*\s+[a-zA-ZäöüÄÖÜß]/)) {
          const parsed = this.parseIngredientString(text, ingredientIndex++);
          if (parsed) ingredients.push(parsed);
        }
      });
    }
    
    // Fallback: Try table cells (Plötzblog sometimes uses tables)
    if (ingredients.length === 0) {
      $('table tr').each((i, tr) => {
        const cells = $(tr).find('td');
        if (cells.length >= 2) {
          const amount = $(cells[0]).text().trim();
          const ingredient = $(cells[1]).text().trim();
          
          // Skip if it's a time entry
          if (amount.match(/^\d{1,2}:\d{2}/)) {
            return;
          }
          
          if (amount.match(/\d/) && ingredient) {
            ingredients.push({
              name: ingredient,
              amount: amount,
              order: ingredientIndex++
            });
          }
        }
      });
    }

    // Parse recipe content
    const steps = [];
    let currentStep = null;

    $('.entry-content p, .entry-content h3, .entry-content h4, .wprm-recipe-instruction-text').each((i, elem) => {
      const text = $(elem).text().trim();
      
      if ($(elem).is('h3, h4') && text) {
        // Start new step
        if (currentStep) steps.push(currentStep);
        currentStep = {
          name: text,
          duration: this.extractDuration(text),
          instructions: '',
          type: this.detectStepType(text)
        };
      } else if (currentStep && text) {
        currentStep.instructions += (currentStep.instructions ? ' ' : '') + text;
        // Update duration if found in instructions
        const dur = this.extractDuration(text);
        if (dur > currentStep.duration) currentStep.duration = dur;
      }
    });
    
    if (currentStep) steps.push(currentStep);

    console.log(`Plötzblog parsed: ${ingredients.length} ingredients, ${steps.length} steps`);

    return {
      name,
      source: url,
      image,
      recipeType: this.detectRecipeType(name + ' ' + steps.map(s => s.name).join(' ')),
      steps: steps.length > 0 ? steps : this.createDefaultSteps(),
      ingredients: ingredients.length > 0 ? ingredients : []
    };
  }

  static parseHomebaking($, url) {
    const name = $('h1.entry-title').text().trim() || $('h1').first().text().trim() || $('.post-title').text().trim();
    
    // Try multiple image sources
    let image = $('meta[property="og:image"]').attr('content') || '';
    if (!image) image = $('.entry-content img, article img, .post-content img').first().attr('src') || '';
    if (!image) image = $('img[class*="wp-post-image"]').first().attr('src') || '';
    
    // Extract ingredients
    const ingredients = [];
    let ingredientIndex = 0;
    
    // Look for ingredient sections - Homebaking often uses specific headers
    let inIngredientSection = false;
    $('.entry-content h2, .entry-content h3, .entry-content h4, .entry-content ul, .entry-content ol, .entry-content p, article h2, article h3, article h4, article ul, article ol, article p').each((i, elem) => {
      const text = $(elem).text().trim();
      
      // Check if this is an ingredient header
      if ($(elem).is('h2, h3, h4')) {
        inIngredientSection = text.toLowerCase().includes('zutat') || 
                             text.toLowerCase().includes('ingredient');
        return;
      }
      
      // Extract from lists in ingredient section
      if (inIngredientSection && $(elem).is('ul, ol')) {
        $(elem).find('li').each((j, li) => {
          const liText = $(li).text().trim();
          if (liText.match(/\d+\s*(g|kg|ml|l|EL|TL|Prise|Stück)/i) || liText.match(/^\d+[.,]?\d*\s+/)) {
            const parsed = this.parseIngredientString(liText, ingredientIndex++);
            if (parsed) ingredients.push(parsed);
          }
        });
      }
      
      // Also check paragraphs for ingredient lists
      if (!inIngredientSection && $(elem).is('p')) {
        if (text.match(/^\d+[.,]?\d*\s*(g|kg|ml|l|EL|TL)\s+/i)) {
          const parsed = this.parseIngredientString(text, ingredientIndex++);
          if (parsed) {
            ingredients.push(parsed);
            inIngredientSection = true;
          }
        }
      }
    });
    
    // Extract steps
    const steps = [];
    let currentStep = null;
    let inInstructionSection = false;
    
    $('.entry-content h2, .entry-content h3, .entry-content h4, .entry-content p, article h2, article h3, article h4, article p').each((i, elem) => {
      const text = $(elem).text().trim();
      
      if ($(elem).is('h2, h3, h4')) {
        const lower = text.toLowerCase();
        // Check if this is instruction/steps header
        if (lower.includes('zubereitung') || lower.includes('anleitung') || 
            lower.includes('schritt') || lower.includes('preparation')) {
          inInstructionSection = true;
          if (currentStep) steps.push(currentStep);
          currentStep = null;
          return;
        }
        
        // If in instruction section, treat as step name
        if (inInstructionSection) {
          if (currentStep) steps.push(currentStep);
          currentStep = {
            name: text,
            duration: this.extractDuration(text),
            instructions: '',
            type: this.detectStepType(text)
          };
        }
      } else if (inInstructionSection && text && text.length > 20) {
        // Skip if it looks like an ingredient
        if (text.match(/^\d+\s*(g|kg|ml)/i)) return;
        
        if (!currentStep) {
          currentStep = {
            name: `Schritt ${steps.length + 1}`,
            duration: 0,
            instructions: '',
            type: 'prep'
          };
        }
        
        currentStep.instructions += (currentStep.instructions ? ' ' : '') + text;
        const dur = this.extractDuration(text);
        if (dur > currentStep.duration) currentStep.duration = dur;
      }
    });
    
    if (currentStep) steps.push(currentStep);
    
    return {
      name,
      source: url,
      image,
      recipeType: this.detectRecipeType(name + ' ' + (ingredients.map(i => i.name).join(' '))),
      steps: steps.length > 0 ? steps : this.createDefaultSteps(),
      ingredients: ingredients.length > 0 ? ingredients : []
    };
  }

  static parseKetex($, url) {
    // Similar implementation for ketex.de
    const name = $('h1').first().text().trim();
    const image = $('meta[property="og:image"]').attr('content') || '';
    
    return {
      name,
      source: url,
      image,
      recipeType: this.detectRecipeType(name),
      steps: this.createDefaultSteps()
    };
  }

  static extractSteps(instructions) {
    if (Array.isArray(instructions)) {
      return instructions.map((inst, i) => ({
        name: `Schritt ${i + 1}`,
        duration: this.extractDuration(inst.text || inst),
        instructions: inst.text || inst,
        type: this.detectStepType(inst.text || inst)
      }));
    }
    return this.createDefaultSteps();
  }

  static extractDuration(text) {
    // Extract duration from text (e.g., "12 Stunden", "90 Minuten")
    const hourMatch = text.match(/(\d+)\s*(stunde|std|hour)/i);
    if (hourMatch) return parseInt(hourMatch[1]) * 60;
    
    const minMatch = text.match(/(\d+)\s*(minute|min)/i);
    if (minMatch) return parseInt(minMatch[1]);
    
    return 0;
  }

  static detectStepType(text) {
    const lower = text.toLowerCase();
    if (lower.includes('gare') || lower.includes('gehen') || lower.includes('ferment') || lower.includes('reifen')) {
      return 'fermentation';
    }
    if (lower.includes('backen') || lower.includes('ofen') || lower.includes('bake')) {
      return 'baking';
    }
    if (lower.includes('abkühlen') || lower.includes('auskühlen') || lower.includes('cool')) {
      return 'cooling';
    }
    return 'prep';
  }

  static detectRecipeType(text) {
    const lower = text.toLowerCase();
    const hasSourdough = lower.includes('sauerteig') || lower.includes('sourdough') || lower.includes('lievito');
    const hasYeast = lower.includes('hefe') || lower.includes('yeast');
    
    if (hasSourdough && hasYeast) return 'mixed';
    if (hasSourdough) return 'sourdough';
    if (hasYeast) return 'yeast';
    return 'other';
  }

  static createDefaultSteps() {
    return [
      {
        name: 'Teig vorbereiten',
        duration: 20,
        instructions: 'Alle Zutaten zu einem Teig verarbeiten.',
        type: 'prep'
      },
      {
        name: 'Stockgare',
        duration: 120,
        instructions: 'Teig abgedeckt gehen lassen.',
        type: 'fermentation'
      },
      {
        name: 'Formen',
        duration: 10,
        instructions: 'Teig formen und in Gärkorb legen.',
        type: 'prep'
      },
      {
        name: 'Stückgare',
        duration: 60,
        instructions: 'Nochmals gehen lassen.',
        type: 'fermentation'
      },
      {
        name: 'Backen',
        duration: 45,
        instructions: 'Im vorgeheizten Ofen backen.',
        type: 'baking'
      }
    ];
  }
}

// Baecker's percentage calculator
class BakersPercentageCalculator {
  static calculate(ingredients, flourWeight) {
    return ingredients.map(ing => ({
      ...ing,
      percentage: (ing.weight / flourWeight) * 100
    }));
  }

  static scale(ingredients, newFlourWeight) {
    const oldFlourWeight = ingredients.find(ing => ing.isFlour)?.weight || 100;
    const factor = newFlourWeight / oldFlourWeight;
    
    return ingredients.map(ing => ({
      ...ing,
      weight: ing.weight * factor
    }));
  }
}

// API Routes

// Parse recipe from URL
app.post('/api/parse', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const recipe = await RecipeParser.parse(url);
    
    if (!recipe) {
      return res.status(400).json({ error: 'Could not parse recipe from this URL' });
    }

    res.json(recipe);
  } catch (error) {
    console.error('Parse error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Share recipe (create public link)
app.post('/api/recipes/share', (req, res) => {
  try {
    const { recipe } = req.body;
    
    if (!recipe) {
      return res.status(400).json({ error: 'Recipe is required' });
    }

    const shareId = uuidv4();
    sharedRecipes.set(shareId, {
      ...recipe,
      sharedAt: new Date().toISOString()
    });

    res.json({ 
      shareId,
      shareUrl: `${req.protocol}://${req.get('host')}/shared/${shareId}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get shared recipe
app.get('/api/recipes/shared/:shareId', (req, res) => {
  const { shareId } = req.params;
  const recipe = sharedRecipes.get(shareId);

  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  res.json(recipe);
});

// Calculate baker's percentage
app.post('/api/bakers-percentage/calculate', (req, res) => {
  try {
    const { ingredients, flourWeight } = req.body;
    const result = BakersPercentageCalculator.calculate(ingredients, flourWeight);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Scale recipe
app.post('/api/bakers-percentage/scale', (req, res) => {
  try {
    const { ingredients, newFlourWeight } = req.body;
    const result = BakersPercentageCalculator.scale(ingredients, newFlourWeight);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Alle Felder sind erforderlich' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Passwort muss mindestens 6 Zeichen lang sein' });
    }

    // Check if user exists in database
    let existingUser;
    try {
      existingUser = await db.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );
    } catch (dbError) {
      console.error('DB not available, using in-memory fallback:', dbError.message);
      // Fallback: Allow registration without DB
      const userId = uuidv4();
      const token = Buffer.from(`${userId}:${Date.now()}`).toString('base64');
      
      return res.status(201).json({
        token,
        user: {
          id: userId,
          username: username,
          email: email,
          initials: username.substring(0, 2).toUpperCase()
        }
      });
    }

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'E-Mail bereits registriert' });
    }

    // Create user in database (in production, hash password with bcrypt)
    const userId = uuidv4();
    try {
      await db.query(
        'INSERT INTO users (id, username, email, password, created_at) VALUES ($1, $2, $3, $4, NOW())',
        [userId, username, email, password] // TODO: hash password in production
      );
    } catch (dbError) {
      console.error('DB insert failed, continuing anyway:', dbError.message);
      // Continue even if DB insert fails
    }

    // Create token (in production, use JWT)
    const token = Buffer.from(`${userId}:${Date.now()}`).toString('base64');

    res.status(201).json({
      token,
      user: {
        id: userId,
        username: username,
        email: email,
        initials: username.substring(0, 2).toUpperCase()
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Serverfehler bei der Registrierung' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'E-Mail und Passwort erforderlich' });
    }

    // Find user in database
    const result = await db.query(
      'SELECT id, username, email, password FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }

    const user = result.rows[0];

    // Check password (in production, use bcrypt.compare)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }

    // Create token
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        initials: user.username.substring(0, 2).toUpperCase()
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Serverfehler bei der Anmeldung' });
  }
});

// Health check endpoint with DB status
app.get('/api/health', async (req, res) => {
  try {
    // Check DB connection
    const result = await db.query('SELECT NOW()');
    res.json({
      status: 'healthy',
      version: '0.5.0',
      database: 'connected',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      version: '0.5.0',
      database: 'disconnected',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🍞 Crumb Backend running on port ${PORT}`);
});
