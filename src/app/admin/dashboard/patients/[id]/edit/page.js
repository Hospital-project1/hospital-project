'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function EditPatientPage({ params }) {
  const router = useRouter();
  const { id } = params;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/patients/${id}`);
        const patient = response.data.data;
        
        setFormData({
          name: patient.name || '',
          email: patient.email || '',
          phone: patient.phone || '',
          address: patient.address || ''
        });
      } catch (err) {
        console.error('Error fetching patient:', err);
        setError(err.message || 'Failed to fetch patient data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPatient();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (submitting) return;
    
    try {
      setSubmitting(true);
      
      await axios.put(`/api/patients/${id}`, formData);
      
      // Redirect back to patients list after successful update
      router.push('/admin/dashboard/patients');
    } catch (err) {
      console.error('Error updating patient:', err);
      setError(err.message || 'Failed to update patient');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-[#DDDFDE]">Loading patient data...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#DDDFDE]">Edit Patient</h1>
        <Link 
          href="/admin/dashboard/patients" 
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Back to List
        </Link>
      </div>
      
      <div className="bg-[#DDDFDE]/10 rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#DDDFDE] mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-[#DDDFDE] focus:outline-none focus:ring-2 focus:ring-[#0CB8B6]"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#DDDFDE] mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-[#DDDFDE] focus:outline-none focus:ring-2 focus:ring-[#0CB8B6]"
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[#DDDFDE] mb-2">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-[#DDDFDE] focus:outline-none focus:ring-2 focus:ring-[#0CB8B6]"
              />
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-[#DDDFDE] mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-[#DDDFDE] focus:outline-none focus:ring-2 focus:ring-[#0CB8B6]"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-[#0CB8B6] text-white rounded-md hover:bg-[#0CB8B6]/90 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Update Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}