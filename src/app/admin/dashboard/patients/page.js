'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 7,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    fetchPatients(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit]);

  const fetchPatients = async (page = 1, limit = 9) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/patients?page=${page}&limit=${limit}`);
      setPatients(response.data.data);
      setPagination({
        ...pagination,
        page,
        limit,
        totalPages: response.data.pagination.totalPages,
        total: response.data.pagination.total
      });
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(err.message || 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  // Navigate to previous page
  const handlePreviousPage = () => {
    if (pagination.page > 1) {
      fetchPatients(pagination.page - 1, pagination.limit);
    }
  };

  // Navigate to next page
  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      fetchPatients(pagination.page + 1, pagination.limit);
    }
  };

  // Navigate to specific page
  const handlePageChange = (page) => {
    fetchPatients(page, pagination.limit);
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
        fetchPatients(pagination.page, pagination.limit);
      } catch (err) {
        console.error('Error deleting patient:', err);
        alert('Failed to delete patient');
      }
    }
  };

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5; // Max number of page buttons to show
    
    let startPage = Math.max(1, pagination.page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={handlePreviousPage}
        disabled={pagination.page === 1}
        className={`px-3 py-1 rounded-md ${
          pagination.page === 1 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        &laquo;
      </button>
    );
    
    // First page
    if (startPage > 1) {
      buttons.push(
        <button
          key="1"
          onClick={() => handlePageChange(1)}
          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          1
        </button>
      );
      
      // Ellipsis if needed
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="px-3 py-1 text-gray-700">...</span>
        );
      }
    }
    
    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${
            pagination.page === i 
              ? 'bg-[#0CB8B6] text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }
    
    // Ellipsis if needed
    if (endPage < pagination.totalPages - 1) {
      buttons.push(
        <span key="ellipsis2" className="px-3 py-1 text-gray-700">...</span>
      );
    }
    
    // Last page
    if (endPage < pagination.totalPages) {
      buttons.push(
        <button
          key={pagination.totalPages}
          onClick={() => handlePageChange(pagination.totalPages)}
          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          {pagination.totalPages}
        </button>
      );
    }
    
    // Next button
    buttons.push(
      <button
        key="next"
        onClick={handleNextPage}
        disabled={pagination.page === pagination.totalPages}
        className={`px-3 py-1 rounded-md ${
          pagination.page === pagination.totalPages 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        &raquo;
      </button>
    );
    
    return buttons;
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black">Patient Records</h1>
            <p className="text-gray-600 mt-1">Manage your clinic's patient information</p>
          </div>
          <Link
            href="/admin/dashboard/patients/add"
            className="bg-[#0CB8B6] hover:bg-[#0CB8B6]/90 text-white px-4 py-2 rounded-md transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Patient
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
        {loading ? (
          <p className="text-gray-700">Loading patients...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : patients.length === 0 ? (
          <p className="text-gray-700">No patients found</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.map((patient) => (
                    <tr key={patient._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.phone || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.address || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(patient.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleDelete(patient._id)}
                          className="text-red-500 hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                        <Link
                          href={`/admin/dashboard/patients/${patient._id}/edit`}
                          className="text-yellow-600 hover:underline"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination controls */}
            <div className="mt-6 flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-700 mb-4 md:mb-0">
                Showing page {pagination.page} of {pagination.totalPages} (Total records: {pagination.total})
              </div>
              <div className="flex space-x-2">
                {renderPaginationButtons()}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}