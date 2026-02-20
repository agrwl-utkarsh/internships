import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Landing from './components/Landing';
import ProfileSetup from './components/ProfileSetup';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';

const API = 'http://localhost:5000/api';

function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'login' | 'register' | 'profile-edit' | 'dashboard'
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('internmatch-theme') || 'theme-dark');
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Configure Axios Interceptor for JWT
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('internmatch-token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => axios.interceptors.request.eject(requestInterceptor);
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('internmatch-token');
      if (token) {
        try {
          const res = await axios.get(`${API}/auth/me`);
          setUser(res.data);
          setView('dashboard');
        } catch (err) {
          console.error('Session invalid, clearing token');
          localStorage.removeItem('internmatch-token');
        }
      }
      setLoadingInitial(false);
    };
    fetchMe();
  }, []);

  useEffect(() => {
    document.body.className = theme === 'theme-dark' ? 'theme-dark' : '';
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'theme-dark' ? 'theme-light' : 'theme-dark';
    setTheme(next);
    localStorage.setItem('internmatch-theme', next);
  };

  const handleRegister = async (userData) => {
    const res = await axios.post(`${API}/auth/register`, userData);
    localStorage.setItem('internmatch-token', res.data.token);
    setUser(res.data);
    setView('dashboard');
  };

  const handleLogin = async (email, password) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    localStorage.setItem('internmatch-token', res.data.token);
    setUser(res.data);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('internmatch-token');
    setUser(null);
    setView('landing');
  };

  const handleProfileUpdate = async ({ name, domain, skills, preference }) => {
    try {
      const res = await axios.put(`${API}/users/profile`, { name, domain, skills, preference });
      setUser(prev => ({ ...prev, ...res.data }));
      setView('dashboard');
    } catch (err) {
      console.error('Failed to update profile', err);
      // Fallback
      setUser(prev => ({ ...prev, name, domain, skills, preference }));
      setView('dashboard');
    }
  };

  if (loadingInitial) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ color: 'var(--c-primary)' }}></i>
    </div>;
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => setView(user ? 'dashboard' : 'landing')}>
          <i className="fa-solid fa-briefcase"></i>
          <span>InternMatch</span>
        </div>
        <div className="nav-controls" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {!user ? (
            <>
              <button className="btn btn-outline" style={{ fontSize: '0.875rem', padding: '0.4rem 0.8rem' }} onClick={() => setView('login')}>Log in</button>
              <button className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.4rem 0.8rem' }} onClick={() => setView('register')}>Sign up</button>
            </>
          ) : (
            <>
              {view === 'dashboard' && (
                <button className="btn btn-outline" style={{ fontSize: '0.875rem', padding: '0.4rem 0.8rem' }} onClick={() => setView('profile-edit')}>
                  <i className="fa-solid fa-pen mr-1"></i> Edit Profile
                </button>
              )}
              <button className="btn btn-outline" style={{ fontSize: '0.875rem', padding: '0.4rem 0.8rem', borderColor: 'transparent' }} onClick={handleLogout}>
                Log out
              </button>
            </>
          )}

          <button className="btn-icon ml-2" id="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
            <i className={`fa-regular ${theme === 'theme-dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
        </div>
      </nav>

      <main className="app-container">
        {view === 'landing' && (
          <Landing onGetStarted={() => setView(user ? 'dashboard' : 'register')} />
        )}

        {view === 'login' && (
          <Login onLogin={handleLogin} onSwitchToRegister={() => setView('register')} />
        )}

        {view === 'register' && (
          <Register onRegister={handleRegister} onSwitchToLogin={() => setView('login')} />
        )}

        {view === 'profile-edit' && user && (
          <ProfileSetup
            initialData={user}
            onSubmit={handleProfileUpdate}
          />
        )}

        {view === 'dashboard' && user && (
          <Dashboard
            user={user}
            onEditProfile={() => setView('profile-edit')}
          />
        )}
      </main>
    </>
  );
}

export default App;
