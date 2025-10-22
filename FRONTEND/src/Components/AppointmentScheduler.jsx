import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import config from './config.js';

const AppointmentScheduler = () => {
  const [appointments, setAppointments] = useState([]);
  const [appointment, setAppointment] = useState({
    id: '',
    patientName: '',
    doctorName: '',
    department: '',
    date: '',
    time: '',
    reason: '',
    status: '',
    contact: '',
    email: ''
  });
  const [idToFetch, setIdToFetch] = useState('');
  const [fetchedAppointment, setFetchedAppointment] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);

  const baseUrl = `${config.url}/appointmentapi`;

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  const fetchAllAppointments = async () => {
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setAppointments(res.data);
    } catch (error) {
      setMessage('Failed to fetch appointments.');
    }
  };

  const handleChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    for (let key in appointment) {
      if (!appointment[key] || appointment[key].toString().trim() === '') {
        setMessage(`Please fill out the ${key} field.`);
        return false;
      }
    }
    return true;
  };

  // --- Corrected addAppointment function ---
  const addAppointment = async () => {
  if (!validateForm()) return;

  try {
    // Remove id before sending (since backend auto-generates it)
    const { id, ...payload } = appointment;

    const res = await axios.post(`${baseUrl}/add`, payload);
    setMessage('Appointment added successfully.');
    fetchAllAppointments();
    resetForm();
  } catch (error) {
    console.error(error.response?.data || error.message);
    setMessage('Error adding appointment. Check console for details.');
  }
};


  const updateAppointment = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        ...appointment,
        date: appointment.date,
        time: appointment.time
      };

      await axios.put(`${baseUrl}/update`, payload);
      setMessage('Appointment updated successfully.');
      fetchAllAppointments();
      resetForm();
    } catch (error) {
      console.error(error.response?.data || error.message);
      setMessage('Error updating appointment.');
    }
  };

  const deleteAppointment = async (id) => {
    try {
      const res = await axios.delete(`${baseUrl}/delete/${id}`);
      setMessage(res.data);
      fetchAllAppointments();
    } catch (error) {
      setMessage('Error deleting appointment.');
    }
  };

  const getAppointmentById = async () => {
    try {
      const res = await axios.get(`${baseUrl}/get/${idToFetch}`);
      setFetchedAppointment(res.data);
      setMessage('');
    } catch (error) {
      setFetchedAppointment(null);
      setMessage('Appointment not found.');
    }
  };

  const handleEdit = (appt) => {
    setAppointment(appt);
    setEditMode(true);
    setMessage(`Editing appointment with ID ${appt.id}`);
  };

  const resetForm = () => {
    setAppointment({
      id: '',
      patientName: '',
      doctorName: '',
      department: '',
      date: '',
      time: '',
      reason: '',
      status: '',
      contact: '',
      email: ''
    });
    setEditMode(false);
  };

  return (
    <div className="appointment-container">
      {message && (
        <div className={`message-banner ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <h2>Appointment Scheduler</h2>

      <div>
        <h3>{editMode ? 'Edit Appointment' : 'Add Appointment'}</h3>
        <div className="form-grid">
          <input type="number" name="id" placeholder="ID" value={appointment.id} onChange={handleChange} />
          <input type="text" name="patientName" placeholder="Patient Name" value={appointment.patientName} onChange={handleChange} />
          <input type="text" name="doctorName" placeholder="Doctor Name" value={appointment.doctorName} onChange={handleChange} />
          <select name="department" value={appointment.department} onChange={handleChange}>
            <option value="">Select Department</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Dermatology">Dermatology</option>
            <option value="General">General</option>
          </select>
          <input type="date" name="date" value={appointment.date} onChange={handleChange} />
          <input type="time" name="time" value={appointment.time} onChange={handleChange} />
          <input type="text" name="reason" placeholder="Reason for Visit" value={appointment.reason} onChange={handleChange} />
          <select name="status" value={appointment.status} onChange={handleChange}>
            <option value="">Select Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <input type="text" name="contact" placeholder="Contact" value={appointment.contact} onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" value={appointment.email} onChange={handleChange} />
        </div>

        <div className="btn-group">
          {!editMode ? (
            <button className="btn-blue" onClick={addAppointment}>Add Appointment</button>
          ) : (
            <>
              <button className="btn-green" onClick={updateAppointment}>Update Appointment</button>
              <button className="btn-gray" onClick={resetForm}>Cancel</button>
            </>
          )}
        </div>
      </div>

      <div>
        <h3>Get Appointment By ID</h3>
        <input
          type="number"
          value={idToFetch}
          onChange={(e) => setIdToFetch(e.target.value)}
          placeholder="Enter Appointment ID"
        />
        <button className="btn-blue" onClick={getAppointmentById}>Fetch</button>

        {fetchedAppointment && (
          <div>
            <h4>Appointment Found:</h4>
            <pre>{JSON.stringify(fetchedAppointment, null, 2)}</pre>
          </div>
        )}
      </div>

      <div>
        <h3>All Appointments</h3>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {Object.keys(appointment).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.id}>
                    {Object.keys(appointment).map((key) => (
                      <td key={key}>{appt[key]}</td>
                    ))}
                    <td>
                      <div className="action-buttons">
                        <button className="btn-green" onClick={() => handleEdit(appt)}>Edit</button>
                        <button className="btn-red" onClick={() => deleteAppointment(appt.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentScheduler;
