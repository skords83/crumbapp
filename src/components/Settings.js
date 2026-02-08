import React from 'react';
import { useTheme } from '../ThemeContext';
import './Settings.css';

function Settings() {
  const { isDarkMode, toggleTheme, colorTheme, changeColorTheme } = useTheme();

  const themes = [
    {
      id: 'natural',
      name: 'Natural & Organic',
      description: 'Warm & Authentisch',
      preview: {
        primary: '#8B7355',
        secondary: '#F5F5DC',
        accent: '#FFD700'
      }
    },
    {
      id: 'modern',
      name: 'Modern & Fresh',
      description: 'Clean & Energetisch',
      preview: {
        primary: '#1E40AF',
        secondary: '#F97316',
        accent: '#10B981'
      }
    },
    {
      id: 'premium',
      name: 'Premium Minimal',
      description: 'Hochwertig & Professionell',
      preview: {
        primary: '#1F2937',
        secondary: '#D4AF37',
        accent: '#DC2626'
      }
    }
  ];

  return (
    <div className="settings">
      <div className="settings-header">
        <h2>⚙️ Einstellungen</h2>
        <p className="settings-subtitle">Passe Crumb an deine Vorlieben an</p>
      </div>

      <div className="settings-content">
        {/* Dark Mode Toggle */}
        <div className="settings-section">
          <h3>Darstellung</h3>
          
          <div className="setting-item">
            <div className="setting-info">
              <label>Dark Mode</label>
              <p className="setting-description">Dunkles Design für bessere Lesbarkeit bei Nacht</p>
            </div>
            <button 
              className={`toggle-switch ${isDarkMode ? 'active' : ''}`}
              onClick={toggleTheme}
              aria-label="Dark Mode umschalten"
            >
              <span className="toggle-slider"></span>
            </button>
          </div>
        </div>

        {/* Color Theme Selector */}
        <div className="settings-section">
          <h3>Farbthema</h3>
          <p className="section-description">
            Wähle ein Farbschema, das zu deinem Stil passt
          </p>

          <div className="theme-grid">
            {themes.map(theme => (
              <div 
                key={theme.id}
                className={`theme-card ${colorTheme === theme.id ? 'active' : ''}`}
                onClick={() => changeColorTheme(theme.id)}
              >
                <div className="theme-preview">
                  <div className="preview-colors">
                    <div 
                      className="color-bar" 
                      style={{ backgroundColor: theme.preview.primary }}
                    ></div>
                    <div 
                      className="color-bar" 
                      style={{ backgroundColor: theme.preview.secondary }}
                    ></div>
                    <div 
                      className="color-bar" 
                      style={{ backgroundColor: theme.preview.accent }}
                    ></div>
                  </div>
                  <div className="preview-sample">
                    <img src="/icons/logo.svg" alt={theme.name} width="80" />
                  </div>
                </div>
                <div className="theme-info">
                  <h4>{theme.name}</h4>
                  <p>{theme.description}</p>
                </div>
                {colorTheme === theme.id && (
                  <div className="active-badge">✓ Aktiv</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* App Info */}
        <div className="settings-section">
          <h3>Über Crumb</h3>
          
          <div className="app-info">
            <div className="info-row">
              <span className="info-label">Version</span>
              <span className="info-value">0.5.6</span>
            </div>
            <div className="info-row">
              <span className="info-label">Tagline</span>
              <span className="info-value">Perfect Bread, Perfect Timing</span>
            </div>
            <div className="info-row">
              <span className="info-label">Entwickelt mit</span>
              <span className="info-value">❤️ für Brotbäcker</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
