import React, { useState } from 'react';
// import api from '../api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState('');

  const submit = (e) => {
    e.preventDefault();
    setPopupMsg('');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setPopupMsg('Login successful! Redirecting...');
      setShowPopup(true);
      // Set current_user for portal access
      localStorage.setItem('current_user', JSON.stringify(user));
      setTimeout(() => {
        setShowPopup(false);
        onLogin('dummy-token', user);
      }, 1200);
    } else {
      setPopupMsg('Login failed. Please check your credentials.');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    }
  };

  return (
    <div className="auth-card">
      <h2>Login</h2>
      <form onSubmit={submit} style={{ width: '100%' }}>
        <div style={{ width: '100%', marginBottom: 18 }}>
          <label>Username</label>
          <input type="text" placeholder="Your username" className="auth-input" value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
        </div>
        <div style={{ width: '100%', marginBottom: 18 }}>
          <label>Password</label>
          <input type="password" placeholder="Password" className="auth-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn">Login</button>
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
