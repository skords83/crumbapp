import React, { useState, useEffect } from 'react';
import './App.css';
import { useTheme } from './ThemeContext';
import RecipeImporter from './components/RecipeImporter';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import RecipeEditor from './components/RecipeEditor';
import BakingScheduler from './components/BakingScheduler';
import TimerManager from './components/TimerManager';
import BakersPercentage from './components/BakersPercentage';
import Settings from './components/Settings';
import Search from './components/Search';
import Auth from './components/Auth';

function App() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [scheduledBake, setScheduledBake] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'detail', 'import', 'schedule', 'baking', 'calculator', 'edit', 'settings', 'search'
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [filters, setFilters] = useState({
    showFavoritesOnly: false,
    recipeType: 'all', // 'all', 'sourdough', 'yeast', 'mixed'
    finishToday: false,
    respectNighttime: false
  });

  // Load recipes from localStorage on mount
  useEffect(() => {
    // Check for logged-in user
    const savedUser = localStorage.getItem('crumb-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error loading user', e);
      }
    }
    setIsLoading(false);

    const savedRecipes = localStorage.getItem('crumb-recipes');
    if (savedRecipes) {
      setRecipes(JSON.parse(savedRecipes));
    }

    const savedFavorites = localStorage.getItem('crumb-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    const savedSchedule = localStorage.getItem('crumb-schedule');
    if (savedSchedule) {
      setScheduledBake(JSON.parse(savedSchedule));
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Save recipes to localStorage whenever they change
  useEffect(() => {
    if (recipes.length > 0) {
      localStorage.setItem('crumb-recipes', JSON.stringify(recipes));
    }
  }, [recipes]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('crumb-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save schedule to localStorage
  useEffect(() => {
    if (scheduledBake) {
      localStorage.setItem('crumb-schedule', JSON.stringify(scheduledBake));
    }
  }, [scheduledBake]);

  const handleRecipeImported = (recipe) => {
    const newRecipe = {
      ...recipe,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setRecipes([...recipes, newRecipe]);
    setView('list');
  };

  const handleDeleteRecipe = (id) => {
    const recipe = recipes.find(r => r.id === id);
    const recipeName = recipe ? recipe.name : 'dieses Rezept';
    
    if (window.confirm(`Möchten Sie "${recipeName}" wirklich dauerhaft löschen? Diese Aktion kann nicht rückgängig gemacht werden.`)) {
      setRecipes(recipes.filter(r => r.id !== id));
      setFavorites(favorites.filter(fid => fid !== id));
    }
  };

  const handleToggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fid => fid !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setView('list');
  };

  const handleLogout = () => {
    localStorage.removeItem('crumb-user');
    localStorage.removeItem('crumb-token');
    localStorage.removeItem('crumb-demo-mode');
    setUser(null);
    setView('list');
  };

  const handleStartBaking = (recipe, targetTime) => {
    const schedule = {
      recipe,
      targetTime,
      startedAt: new Date().toISOString(),
      respectNighttime: filters.respectNighttime
    };
    setScheduledBake(schedule);
    setView('baking');
  };

  const handleCompleteBaking = () => {
    setScheduledBake(null);
    localStorage.removeItem('brotzeit-schedule');
    setView('list');
  };

  const handleViewDetail = (recipe) => {
    setActiveRecipe(recipe);
    setView('detail');
  };

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setView('edit');
  };

  const handleSaveEdit = (updatedRecipe) => {
    setRecipes(recipes.map(r => r.id === updatedRecipe.id ? updatedRecipe : r));
    setEditingRecipe(null);
    setActiveRecipe(updatedRecipe);
    setView('detail');
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="App" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh'}}>
        <div style={{textAlign: 'center'}}>
          <svg width="64" height="64" viewBox="0 0 200 200" fill="none" style={{color: 'var(--brown-primary)', marginBottom: '1rem'}}>
            <path d="M 30 80 C 30 60, 52 45, 82 45 C 102 45, 117 50, 122 66 L 122 129 C 117 144, 102 150, 82 150 C 52 150, 30 135, 30 115 Z" fill="currentColor"/>
            <path d="M 122 66 L 122 129 C 122 139, 132 145, 142 145 L 142 50 C 132 50, 122 56, 122 66 Z" fill="currentColor" opacity="0.7"/>
          </svg>
          <p style={{color: 'var(--text-secondary)'}}>Lade Crumb...</p>
        </div>
      </div>
    );
  }

  // Show Auth screen if not logged in
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="header-brand">
            <img src="/logo-bread.svg" alt="Crumb Logo" className="header-logo" />
            <div className="header-text">
              <h1>Crumb</h1>
              <p className="tagline">Perfect Bread, Perfect Timing</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={toggleTheme} title="Theme wechseln">
              {isDarkMode ? (
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <div className="user-menu-container">
              <button className="user-avatar" onClick={() => setView('settings')}>
                {user.initials || user.username?.substring(0, 2).toUpperCase() || 'U'}
              </button>
              <div className="user-dropdown">
                <div className="user-info">
                  <div className="user-name">{user.username || 'User'}</div>
                  <div className="user-email">{user.email || ''}</div>
                </div>
                <button className="dropdown-item" onClick={() => setView('settings')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v6m0 6v6M5.6 5.6l4.2 4.2m4.2 4.2l4.2 4.2M1 12h6m6 0h6M5.6 18.4l4.2-4.2m4.2-4.2l4.2-4.2"/>
                  </svg>
                  Einstellungen
                </button>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Abmelden
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="nav-tabs">
        <div className="nav-tabs-content">
          <button 
            className={`nav-tab ${view === 'list' ? 'active' : ''}`}
            onClick={() => setView('list')}
          >
            <svg viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            Rezepte
          </button>
          <button 
            className={`nav-tab ${view === 'import' ? 'active' : ''}`}
            onClick={() => setView('import')}
          >
            <svg viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            Import
          </button>
          <button 
            className={`nav-tab ${view === 'calculator' ? 'active' : ''}`}
            onClick={() => setView('calculator')}
          >
            <svg viewBox="0 0 24 24">
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
              <polyline points="17 2 12 7 7 2"/>
            </svg>
            Rechner
          </button>
          <button 
            className={`nav-tab ${view === 'settings' ? 'active' : ''}`}
            onClick={() => setView('settings')}
          >
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6M5.6 5.6l4.2 4.2m4.2 4.2l4.2 4.2M1 12h6m6 0h6M5.6 18.4l4.2-4.2m4.2-4.2l4.2-4.2"/>
            </svg>
            Einstellungen
          </button>
          {scheduledBake && (
            <button 
              className={`nav-tab ${view === 'baking' ? 'active' : ''}`}
              onClick={() => setView('baking')}
              style={{color: '#ff6b35', borderBottomColor: view === 'baking' ? '#ff6b35' : 'transparent'}}
            >
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Backen läuft
            </button>
          )}
        </div>
      </nav>

      <main className="app-main">
        {view === 'list' && (
          <RecipeList 
            recipes={recipes}
            favorites={favorites}
            filters={filters}
            onDelete={handleDeleteRecipe}
            onSelect={(recipe) => {
              setActiveRecipe(recipe);
              setView('schedule');
            }}
            onViewDetail={handleViewDetail}
            onToggleFavorite={handleToggleFavorite}
            onFilterChange={handleFilterChange}
          />
        )}

        {view === 'detail' && activeRecipe && (
          <RecipeDetail
            recipe={activeRecipe}
            isFavorite={favorites.includes(activeRecipe.id)}
            onBack={() => setView('list')}
            onStartBaking={() => setView('schedule')}
            onEdit={() => handleEditRecipe(activeRecipe)}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDeleteRecipe}
          />
        )}

        {view === 'edit' && editingRecipe && (
          <RecipeEditor
            recipe={editingRecipe}
            onSave={handleSaveEdit}
            onCancel={() => {
              setEditingRecipe(null);
              setView(activeRecipe ? 'detail' : 'list');
            }}
          />
        )}

        {view === 'import' && (
          <RecipeImporter onRecipeImported={handleRecipeImported} />
        )}

        {view === 'calculator' && (
          <BakersPercentage />
        )}

        {view === 'settings' && (
          <Settings />
        )}

        {view === 'search' && (
          <Search 
            recipes={recipes}
            favorites={favorites}
            onSelectRecipe={handleViewDetail}
          />
        )}

        {view === 'schedule' && activeRecipe && (
          <BakingScheduler 
            recipe={activeRecipe}
            respectNighttime={filters.respectNighttime}
            onStart={handleStartBaking}
            onCancel={() => {
              setActiveRecipe(null);
              setView('list');
            }}
          />
        )}

        {view === 'baking' && scheduledBake && (
          <TimerManager 
            schedule={scheduledBake}
            onComplete={handleCompleteBaking}
          />
        )}
      </main>

      {/* Bottom Navigation - Mobile & PWA */}
      <nav className="bottom-nav">
        <div className="bottom-nav-content">
          <button 
            className={`nav-item ${view === 'list' ? 'active' : ''}`}
            onClick={() => setView('list')}
          >
            <svg viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span className="nav-label">Rezepte</span>
          </button>

          <button 
            className={`nav-item ${view === 'search' ? 'active' : ''}`}
            onClick={() => setView('search')}
          >
            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <span className="nav-label">Suchen</span>
          </button>

          <button 
            className="nav-item center-fab"
            onClick={() => setView('import')}
          >
            <div className="fab-in-nav">
              <svg viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
          </button>

          <button 
            className={`nav-item ${view === 'baking' ? 'active' : ''}`}
            onClick={() => scheduledBake && setView('baking')}
            disabled={!scheduledBake}
          >
            {scheduledBake ? (
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6M5.6 5.6l4.2 4.2m4.2 4.2l4.2 4.2M1 12h6m6 0h6M5.6 18.4l4.2-4.2m4.2-4.2l4.2-4.2"/>
              </svg>
            )}
            <span className="nav-label">{scheduledBake ? 'Timer' : 'Einst.'}</span>
          </button>

          <button 
            className={`nav-item ${view === 'settings' ? 'active' : ''}`}
            onClick={() => setView('settings')}
          >
            <svg viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span className="nav-label">Profil</span>
          </button>
        </div>
      </nav>

      {/* Floating Action Button - Desktop Browser */}
      <button 
        className="fab" 
        onClick={() => setView('import')}
        title="Rezept importieren"
      >
        <svg viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
    </div>
  );
}

export default App;
