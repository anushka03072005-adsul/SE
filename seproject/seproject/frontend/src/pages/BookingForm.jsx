import React, { useState } from 'react';
import api from '../api';

export default function BookingForm({ doctor, onDone }) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      // patient will be set by backend from authenticated user; frontend need not send patient
      await api.post('appointments/', { doctor: doctor.id, start, end });
      alert('Requested');
      onDone();
    } catch (err) {
      alert('Booking failed: ' + (err.response?.data || err.message));
    }
  };

  return (
    <div>
      <h3>Book Dr. {doctor.user.first_name}</h3>
      <form onSubmit={submit}>
        <div>
          <label>Start (ISO):</label>
          <input value={start} onChange={(e) => setStart(e.target.value)} placeholder="2025-10-06T09:00:00Z" />
        </div>
        <div>
          <label>End (ISO):</label>
          <input value={end} onChange={(e) => setEnd(e.target.value)} placeholder="2025-10-06T09:30:00Z" />
        </div>
        <button type="submit">Request Appointment</button>
      </form>
    </div>
  );
}
