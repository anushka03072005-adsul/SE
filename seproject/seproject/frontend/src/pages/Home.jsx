import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home({ me }) {
  const navigate = useNavigate();
  return (
    <div className="glass-card home-container" style={{ maxWidth: 760, margin: '60px auto' }}>
      <h2 className="home-title">Welcome{me && me.username ? `, ${me.username}` : ''}!</h2>
      <p className="home-sub">Choose your portal</p>

      <div className="role-buttons">
        <div className="role-card role-patient" onClick={() => navigate('/patient')} tabIndex={0} onKeyPress={e => { if (e.key === 'Enter') navigate('/patient'); }}>
          <span className="role-emoji">🧑‍🦱</span>
          <span className="role-title">Patient Portal</span>
          <span className="role-sub">Book appointments, view doctors</span>
        </div>

        <div className="role-card role-doctor" onClick={() => navigate('/doctor')} tabIndex={0} onKeyPress={e => { if (e.key === 'Enter') navigate('/doctor'); }}>
          <span className="role-emoji">🩺</span>
          <span className="role-title">Doctor Portal</span>
          <span className="role-sub">See appointments, manage patients</span>
        </div>
      </div>
    </div>
  );
}