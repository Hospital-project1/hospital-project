'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/patients');
      setPatients(response.data.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(err.message || 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Function to handle soft delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await axios.delete(`/api/patients/${id}`);
        // Refresh the patients list after deletion
        fetchPatients();
      } catch (err) {
        console.error('Error deleting patient:', err);
        alert('Failed to delete patient');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#DDDFDE]">Patient Records</h1>
        <Link 
          href="/admin/dashboard/patients/add" 
          className="px-4 py-2 bg-[#0CB8B6] text-white rounded-md hover:bg-[#0CB8B6]/90 transition-colors"
        >
          Add New Patient
        </Link>
      </div>
      
      <div className="bg-[#DDDFDE]/10 rounded-lg p-6">
        {loading ? (
          <p className="text-[#DDDFDE]">Loading patients...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : patients.length === 0 ? (
          <p className="text-[#DDDFDE]">No patients found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-600">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#DDDFDE] uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#DDDFDE] uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#DDDFDE] uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#DDDFDE] uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#DDDFDE] uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#DDDFDE] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {patients.map((patient) => (
                  <tr key={patient._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#DDDFDE]">{patient.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#DDDFDE]">{patient.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#DDDFDE]">{patient.phone || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#DDDFDE]">{patient.address || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#DDDFDE]">{formatDate(patient.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#DDDFDE] space-x-2">
                      <button
                        onClick={() => handleDelete(patient._id)}
                        className="text-red-500 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                      <Link
                        href={`/admin/dashboard/patients/${patient._id}/edit`}
                        className="text-yellow-500 hover:underline"
                      >
                        Edit
                      </Link>
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
}