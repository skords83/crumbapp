import React, { useState } from 'react';
import './Auth.css';

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }

    if (formData.password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ein Fehler ist aufgetreten');
      }

      // Store token
      localStorage.setItem('crumb-token', data.token);
      localStorage.setItem('crumb-user', JSON.stringify(data.user));

      // Call onLogin callback
      if (onLogin) {
        onLogin(data.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Demo mode - no backend required
    const demoUser = {
      id: 'demo',
      username: 'Demo User',
      email: 'demo@crumb.app',
      initials: 'DU'
    };
    
    localStorage.setItem('crumb-user', JSON.stringify(demoUser));
    localStorage.setItem('crumb-demo-mode', 'true');
    
    if (onLogin) {
      onLogin(demoUser);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <img src="/logo-bread.svg" alt="Crumb" style={{width: '64px', height: '64px', color: 'var(--brown-primary)'}} />
          </div>
          <h1>Crumb</h1>
          <p className="auth-tagline">Perfect Bread, Perfect Timing</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Anmelden
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Registrieren
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Benutzername</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required={!isLogin}
                placeholder="Dein Name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">E-Mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="deine@email.de"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Passwort</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Mindestens 6 Zeichen"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Passwort bestätigen</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!isLogin}
                placeholder="Passwort wiederholen"
              />
            </div>
          )}

          {error && (
            <div className="auth-error">{error}</div>
          )}

          <button type="submit" className="btn-auth-primary" disabled={loading}>
            {loading ? 'Laden...' : (isLogin ? 'Anmelden' : 'Registrieren')}
          </button>
        </form>

        <div className="auth-divider">
          <span>oder</span>
        </div>

        <button className="btn-demo" onClick={handleDemoLogin}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          Demo-Modus (ohne Anmeldung)
        </button>

        <p className="auth-footer">
          {isLogin ? 'Noch kein Konto?' : 'Bereits registriert?'}
          {' '}
          <button 
            type="button"
            className="auth-switch"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Jetzt registrieren' : 'Zur Anmeldung'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;
