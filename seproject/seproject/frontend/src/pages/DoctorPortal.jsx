
import React, { useEffect, useState } from 'react';

export default function DoctorPortal() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('current_user'));
      // fallback for legacy key
      if (!user || !user.role) {
        const legacy = JSON.parse(localStorage.getItem('currentUser'));
        if (legacy && legacy.role) {
          localStorage.setItem('current_user', JSON.stringify(legacy));
        }
      }
      if (!user || user.role !== 'doctor') {
        setError('Access denied. Only doctors can view this portal.');
        setAppointments([]);
        setLoading(false);
        return;
      }
      const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      // In this frontend-only app, doctor_id is the doctor's id (e.g., 'd2'), not the user id. So we need to match by doctor name or username.
      // Match by doctor_id: user.username should be the doctor id (e.g., 'd2')
      const myAppointments = allAppointments.filter(a => {
        if (!user) return false;
        return a.doctor_id && user.username && a.doctor_id.toLowerCase() === user.username.toLowerCase();
      });
      setAppointments(myAppointments);
      setLoading(false);
    } catch (e) {
      setError('Failed to load appointments.');
      setAppointments([]);
      setLoading(false);
    }
  }, []);

  return (
    <div className="glass-card" style={{ maxWidth: 760, margin: '48px auto' }}>
      <h2 style={{ marginBottom: 12, color: '#fff' }}>Doctor Portal</h2>
      <h3 style={{ marginBottom: 12, color: '#fff' }}>Your Appointments</h3>
      {loading && <div style={{ color: '#fff' }}>Loading...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && appointments.length === 0 && (
        <div style={{ color: '#a1c4fd', fontWeight: 700 }}>No appointments yet.</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 12 }}>
        {appointments.map((appt, idx) => (
          <div key={appt.id || idx} className="glass-card" style={{ background: '#f7fafc', borderRadius: 12, padding: '1rem 1rem', color: '#1f2937' }}>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 6 }}>Patient: {appt.patient_username}</div>
            <div style={{ fontSize: 0.98 + 'rem' }}>Hospital: {appt.hospital_name}</div>
            <div style={{ fontSize: 0.98 + 'rem' }}>Type: {appt.doctor_type}</div>
            <div style={{ fontSize: 0.98 + 'rem' }}>Time: {appt.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
