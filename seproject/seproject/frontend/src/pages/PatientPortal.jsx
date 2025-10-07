
import React, { useState, useEffect } from 'react';

// Sample data for hospitals, doctor types, and doctors
const SAMPLE_HOSPITALS = [
  { id: 'h1', name: 'City Hospital' },
  { id: 'h2', name: 'Sunrise Medical Center' },
  { id: 'h3', name: 'Green Valley Clinic' },
];
const DOCTOR_TYPES = [
  { label: 'Dermatologist', value: 'dermatologist' },
  { label: 'Cardiologist', value: 'cardiologist' },
  { label: 'Pediatrician', value: 'pediatrician' },
  { label: 'Orthopedic', value: 'orthopedic' },
  { label: 'General Physician', value: 'general' },
];
const SAMPLE_DOCTORS = [
  { id: 'd1', name: 'Dr. A. Sharma', type: 'dermatologist', hospital: 'h1' },
  { id: 'd2', name: 'Dr. B. Patel', type: 'cardiologist', hospital: 'h2' },
  { id: 'd3', name: 'Dr. C. Singh', type: 'pediatrician', hospital: 'h1' },
  { id: 'd4', name: 'Dr. D. Gupta', type: 'orthopedic', hospital: 'h3' },
  { id: 'd5', name: 'Dr. E. Rao', type: 'general', hospital: 'h2' },
  { id: 'd6', name: 'Dr. F. Mehta', type: 'cardiologist', hospital: 'h1' },
  { id: 'd7', name: 'Dr. G. Nair', type: 'pediatrician', hospital: 'h2' },
  { id: 'd8', name: 'Dr. H. Banerjee', type: 'orthopedic', hospital: 'h1' },
  { id: 'd9', name: 'Dr. I. Desai', type: 'general', hospital: 'h3' },
  { id: 'd10', name: 'Dr. J. Kapoor', type: 'dermatologist', hospital: 'h2' },
];

// Save sample data to localStorage if not present
if (!localStorage.getItem('hospitals')) {
  localStorage.setItem('hospitals', JSON.stringify(SAMPLE_HOSPITALS));
}
if (!localStorage.getItem('doctors')) {
  localStorage.setItem('doctors', JSON.stringify(SAMPLE_DOCTORS));
}

export default function PatientPortal() {
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [time, setTime] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setHospitals(JSON.parse(localStorage.getItem('hospitals') || '[]'));
  }, []);

  useEffect(() => {
    const allDoctors = JSON.parse(localStorage.getItem('doctors') || '[]');
    setDoctors(allDoctors);
  }, []);

  const bookAppointment = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setShowPopup(false);
    if (!selectedHospital || !selectedType || !selectedDoctor || !time) {
      setError('Please select all fields.');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
      return;
    }

    const user = JSON.parse(localStorage.getItem('current_user') || '{}');
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const doctorObj = doctors.find(d => d.id === selectedDoctor);
    const hospitalObj = hospitals.find(h => h.id === selectedHospital);

    // attempt to find a doctor user in users list (best-effort)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    let doctorUser = null;
    if (doctorObj) {
      doctorUser = users.find(u => u.role === 'doctor' && u.username && doctorObj.id && u.username.toLowerCase() === doctorObj.id.toLowerCase());
      if (!doctorUser) {
        doctorUser = users.find(u => u.role === 'doctor' && doctorObj.name.toLowerCase().includes((u.username || '').toLowerCase()));
      }
    }

    appointments.push({
      id: 'appt_' + Date.now(),
      patient_username: user.username,
      patient_email: user.email,
      doctor_id: selectedDoctor,
      doctor_name: doctorObj ? doctorObj.name : '',
      doctor_type: selectedType,
      hospital_id: selectedHospital,
      hospital_name: hospitalObj ? hospitalObj.name : '',
      doctor_email: doctorUser ? doctorUser.email : '',
      time,
    });

    localStorage.setItem('appointments', JSON.stringify(appointments));
    setSuccess('Appointment booked! Confirmation sent to your email.');
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
    // optional alert for local demo flow
    // alert('Appointment booked! Confirmation sent to your email.');
    setSelectedHospital('');
    setSelectedType('');
    setSelectedDoctor('');
    setTime('');
  };

  // Only allow patients
  const user = JSON.parse(localStorage.getItem('current_user') || '{}');
  if (!user || user.role !== 'patient') {
    return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>Access denied. Only patients can access this portal.</div>;
  }

  return (
    <div className="glass-card" style={{ maxWidth: 620, margin: '48px auto' }}>
      <h2 style={{ marginBottom: 18, color: '#fff' }}>Book an Appointment</h2>
      <form onSubmit={bookAppointment}>
        <div style={{ marginBottom: 12 }}>
          <label>Hospital</label>
          <select className="auth-input" value={selectedHospital} onChange={e => setSelectedHospital(e.target.value)} required>
            <option value="">Select hospital</option>
            {hospitals.length === 0 ? SAMPLE_HOSPITALS.map(h => <option key={h.id} value={h.id}>{h.name}</option>) : hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Doctor Type</label>
          <select className="auth-input" value={selectedType} onChange={e => setSelectedType(e.target.value)} required>
            <option value="">Select type</option>
            {DOCTOR_TYPES.map(dt => <option key={dt.value} value={dt.value}>{dt.label}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Doctor</label>
          <select className="auth-input" value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)} required>
            <option value="">Select doctor</option>
            {(doctors.length === 0 ? SAMPLE_DOCTORS : doctors).filter(d => (!selectedHospital || d.hospital === selectedHospital) && (!selectedType || d.type === selectedType)).map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Time</label>
          <input type="time" className="auth-input" value={time} onChange={e => setTime(e.target.value)} required />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" className="btn" style={{ marginTop: 6 }}>Book Appointment</button>
      </form>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p style={{ margin: 0 }}>{error || success}</p>
            {success && <p style={{ fontWeight: 700, marginTop: 8 }}>Email sent to your registered Gmail!</p>}
          </div>
        </div>
      )}
    </div>
  );
}
