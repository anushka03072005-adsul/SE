import React, { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import PatientPortal from './pages/PatientPortal';
import DoctorPortal from './pages/DoctorPortal';
import api from './api';
import './App.css';

export default function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('access_token')
  );
  const [me, setMe] = useState<any>(null);

  const onLogin = (t: string, meData?: any) => {
    setToken(t);
    api.setAuthToken(t);
    setMe(meData || null);
    localStorage.setItem('access_token', t);
  };

  const onLogout = () => {
    setToken(null);
    setMe(null);
    api.setAuthToken(null);
    localStorage.removeItem('access_token');
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-left">
            <Link to="/" className="brand">
              🏥 SE Project
            </Link>
          </div>

          <div className="nav-right">
            {token && me ? (
              <>
                <span className="welcome">
                  Welcome,&nbsp;
                  <strong>{me.username || me.email}</strong>
                </span>
                <button onClick={onLogout} className="btn-logout">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/signup" className="nav-link">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>

        <main className="content">
          <Routes>
            <Route
              path="/"
              element={
                token && me ? <Home me={me} /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/login"
              element={
                token && me ? (
                  <Navigate to="/" />
                ) : (
                  <Login onLogin={onLogin} />
                )
              }
            />
            <Route
              path="/signup"
              element={<Signup onSignup={() => (window.location.href = '/login')} />}
            />
            <Route
              path="/patient"
              element={
                token && me ? <PatientPortal /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/doctor"
              element={
                token && me ? <DoctorPortal /> : <Navigate to="/login" />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
