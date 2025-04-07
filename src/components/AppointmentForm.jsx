'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { format, isBefore } from 'date-fns';

export default function AppointmentForm({ appointment, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    appointmentDate: '',
    reason: '',
  });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (appointment) {
      setFormData({
        patient: appointment.patient?._id || '',
        doctor: appointment.doctor?._id || '',
        appointmentDate: format(new Date(appointment.appointmentDate), "yyyy-MM-dd'T'HH:mm"),
        reason: appointment.reason || '',
      });
    } else {
      setFormData({
        patient: '',
        doctor: '',
        appointmentDate: '',
        reason: '',
      });
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [patientsRes, doctorsRes] = await Promise.all([
          axios.get('/api/patients'),
          axios.get('/api/doctors'),
        ]);
        setPatients(patientsRes.data.data);
        setDoctors(doctorsRes.data.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appointment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const now = new Date();
    
    if (!formData.reason) {
      newErrors.reason = 'Reason is required';
    }
    
    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Date is required';
    } else if (isBefore(new Date(formData.appointmentDate), now)) {
      newErrors.appointmentDate = 'Date cannot be in the past';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {appointment ? 'Edit Appointment' : 'Create New Appointment'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient
            </label>
            <select
              name="patient"
              value={formData.patient}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
              disabled={loading}
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doctor
            </label>
            <select
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
              disabled={loading}
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name} ({doctor.specialization})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date & Time *
            </label>
            <input
              type="datetime-local"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              className={`w-full border ${errors.appointmentDate ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
              required
              min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
            />
            {errors.appointmentDate && (
              <p className="mt-1 text-sm text-red-600">{errors.appointmentDate}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason *
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className={`w-full border ${errors.reason ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
              rows={3}
              required
            />
            {errors.reason && (
              <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {appointment ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}