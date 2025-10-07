import React, { useEffect, useState } from 'react';
import api from '../api';
import BookingForm from './BookingForm';

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('doctors/').then((r) => setDoctors(r.data)).catch(() => setDoctors([]));
  }, []);

  return (
    <div>
      <h2>Doctors</h2>
      <ul>
        {doctors.map((d) => (
          <li key={d.id}>
            {d.user.first_name} {d.user.last_name} - {d.specialty}
            <button onClick={() => setSelected(d)}>Book</button>
          </li>
        ))}
      </ul>
      {selected && <BookingForm doctor={selected} onDone={() => setSelected(null)} />}
    </div>
  );
}
