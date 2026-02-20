import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import Landing from './components/Landing';
import ProfileSetup from './components/ProfileSetup';
import Dashboard from './components/Dashboard';

const API = 'http://localhost:5000/api';

// Get or create a persistent UUID for this browser session
const getOrCreateUUID = () => {
  let uuid = localStorage.getItem('internmatch-uuid');
  if (!uuid) {
    uuid = uuidv4();
    localStorage.setItem('internmatch-uuid', uuid);
  }
  return uuid;
};

function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'profile' | 'dashboard'
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('internmatch-theme') || 'theme-dark');

  useEffect(() => {
    document.body.className = theme === 'theme-dark' ? 'theme-dark' : '';
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'theme-dark' ? 'theme-light' : 'theme-dark';
    setTheme(next);
    localStorage.setItem('internmatch-theme', next);
  };

  const handleProfileSubmit = async ({ name, domain, skills, preference }) => {
    const uuid = getOrCreateUUID();
    const profile = { uuid, name, domain, skills, preference };

    // POST to backend
    try {
      await axios.post(`${API}/users`, profile);
    } catch (err) {
      console.error('Backend not reachable, continuing in offline mode:', err.message);
    }

    setUser(profile);
    setView('dashboard');
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => setView('landing')}>
          <i className="fa-solid fa-briefcase"></i>
          <span>InternMatch</span>
        </div>
        <div className="nav-controls" style={{ display: 'flex', gap: '0.5rem' }}>
          {user && view === 'dashboard' && (
            <button className="btn btn-outline" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
              onClick={() => setView('profile')}>
              <i className="fa-solid fa-pen mr-1"></i> Edit Profile
            </button>
          )}
          <button className="btn-icon" id="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
            <i className={`fa-regular ${theme === 'theme-dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
        </div>
      </nav>

      {/* Main App Container */}
      <main className="app-container">
        {view === 'landing' && (
          <Landing onGetStarted={() => setView('profile')} />
        )}

        {view === 'profile' && (
          <ProfileSetup
            initialData={user}
            onSubmit={handleProfileSubmit}
          />
        )}

        {view === 'dashboard' && user && (
          <Dashboard
            user={user}
            onEditProfile={() => setView('profile')}
          />
        )}
      </main>
    </>
  );
}

export default App;
