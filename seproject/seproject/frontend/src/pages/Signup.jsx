import React, { useState } from 'react';
// import api from '../api';

export default function Signup({ onSignup }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState('patient');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState('');

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setPopupMsg('Passwords do not match');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
      return;
    }
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.username === username)) {
      setPopupMsg('Username already exists');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
      return;
    }
    if (users.find(u => u.email === email)) {
      setPopupMsg('Email already exists');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
      return;
    }
    const newUser = { username, email, password, role };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    // Set current_user for immediate access after signup
    localStorage.setItem('current_user', JSON.stringify(newUser));
    setPopupMsg('Account created! Redirecting to login...');
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      onSignup();
    }, 1800);
  };

  return (
    <div className="auth-card">
      <h2>Sign Up</h2>
      <form onSubmit={submit} style={{ width: '100%' }}>
        <div style={{ width: '100%', marginBottom: 18 }}>
          <label>Username</label>
          <input type="text" placeholder="Choose a username" className="auth-input" value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
        </div>
        <div style={{ width: '100%', marginBottom: 18 }}>
          <label>Email</label>
          <input type="email" placeholder="you@example.com" className="auth-input" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div style={{ width: '100%', marginBottom: 18 }}>
          <label>Password</label>
          <input type="password" placeholder="Create a password" className="auth-input" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div style={{ width: '100%', marginBottom: 18 }}>
          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm password" className="auth-input" value={confirm} onChange={e => setConfirm(e.target.value)} required />
        </div>
        <div style={{ width: '100%', marginBottom: 18 }}>
          <label>Role</label>
          <select className="auth-input" value={role} onChange={e => setRole(e.target.value)}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>
        <button type="submit" className="btn">Sign Up</button>
      </form>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>{popupMsg}</p>
          </div>
        </div>
      )}
    </div>
  );
}