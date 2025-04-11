// src/app/dashboard/doctors/page.js
'use client';

import { useState, useEffect } from 'react';
import DoctorCard from './DoctorCard';
import DoctorModal from './DoctorModal';

export default function DoctorsDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'delete'
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [viewMode, setViewMode] = useState('slot'); // 'card' or 'slot'

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/doctors');
      const data = await response.json();
      
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        console.error('Failed to fetch doctors:', data.message);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData, isEdit = false) => {
    try {
      const url = isEdit 
        ? `/api/doctors/${selectedDoctor._id}` 
        : '/api/doctors';
      
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsModalOpen(false);
        fetchDoctors(); // Update the list
      } else {
        console.error(`Failed to ${isEdit ? 'update' : 'add'} doctor:`, data.message);
      }
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'adding'} doctor:`, error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/doctors/${selectedDoctor._id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsModalOpen(false);
        fetchDoctors(); // Update the list
      } else {
        console.error('Failed to delete doctor:', data.message);
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  return (
    <div className="min-h-screen bg-[#1D1F27] text-white px-4 py-6">
      <div className="container mx-auto">
        <div className="bg-[#1D1F27] rounded-lg shadow-lg p-6 mb-6 border border-[#DDDFDE]/10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Doctor Management</h1>
              <p className="text-[#DDDFDE]/70 mt-1">Manage your clinic's medical staff</p>
            </div>
            <button
              onClick={handleAddDoctor}
              className="bg-[#0CB8B6] hover:bg-[#0CB8B6]/90 text-white px-4 py-2 rounded-md transition flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Doctor
            </button>
          </div>
        </div>

        {/* View toggle controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-white font-medium">
            {doctors.length > 0 && !loading ? (
              <span>{doctors.length} doctors found</span>
            ) : (
              <span>&nbsp;</span>
            )}
          </div>
          <div className="bg-[#1D1F27] rounded-lg shadow-lg border border-[#DDDFDE]/10 p-1 flex">
            <button
              onClick={() => toggleViewMode('card')}
              className={`px-3 py-1.5 rounded ${
                viewMode === 'card'
                  ? 'bg-[#0CB8B6] text-white'
                  : 'text-[#DDDFDE] hover:bg-[#DDDFDE]/10'
              } transition-colors flex items-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Card
            </button>
            <button
              onClick={() => toggleViewMode('slot')}
              className={`px-3 py-1.5 rounded ${
                viewMode === 'slot'
                  ? 'bg-[#0CB8B6] text-white'
                  : 'text-[#DDDFDE] hover:bg-[#DDDFDE]/10'
              } transition-colors flex items-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Slot
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12 bg-[#1D1F27]/50 rounded-lg shadow-lg border border-[#DDDFDE]/10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0CB8B6]"></div>
          </div>
        ) : (
          <>
            {doctors.length === 0 ? (
              <div className="text-center py-12 bg-[#1D1F27]/50 rounded-lg shadow-lg border border-[#DDDFDE]/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-[#CE592C]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                </svg>
                <p className="text-white mt-4">No doctors available yet</p>
                <button
                  onClick={handleAddDoctor}
                  className="mt-4 bg-[#0CB8B6]/10 text-[#0CB8B6] px-4 py-2 rounded-md hover:bg-[#0CB8B6]/20 transition"
                >
                  Add your first doctor
                </button>
              </div>
            ) : (
              <div className="bg-[#1D1F27]/50 rounded-lg p-6 border border-[#DDDFDE]/10 shadow-lg">
                {viewMode === 'card' ? (
                  // Card View
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map((doctor) => (
                      <DoctorCard
                        key={doctor._id}
                        doctor={doctor}
                        onEdit={() => handleEditDoctor(doctor)}
                        onDelete={() => handleDeleteDoctor(doctor)}
                      />
                    ))}
                  </div>
                ) : (
                  // Slot View
                  <div className="border border-[#DDDFDE]/10 rounded-lg overflow-hidden">
                    {doctors.map((doctor, index) => (
                      <div 
                        key={doctor._id} 
                        className={`flex flex-wrap md:flex-nowrap items-center p-4 ${
                          index % 2 === 0 ? 'bg-[#1D1F27]' : 'bg-[#1D1F27]/80'
                        } ${index !== doctors.length - 1 ? 'border-b border-[#DDDFDE]/10' : ''}`}
                      >
                        {/* Doctor Avatar */}
                        <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-[#0CB8B6] mr-4 mb-2 md:mb-0">
                          {doctor.user.profilePicture ? (
                            <img 
                              src={doctor.user.profilePicture} 
                              alt={doctor.user.name} 
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#DDDFDE] text-[#1D1F27] font-bold">
                              {doctor.user.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        
                        {/* Doctor Name & Specialty */}
                        <div className="w-full md:w-1/4 mb-2 md:mb-0">
                          <h3 className="font-bold text-white">{doctor.user.name}</h3>
                          <p className="text-sm text-[#DDDFDE]/70">{doctor.specialty}</p>
                        </div>
                        
                        {/* Contact Info */}
                        <div className="w-full md:w-1/3 mb-2 md:mb-0 md:px-4">
                          <div className="flex items-center text-sm mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#CE592C] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-[#DDDFDE] truncate">{doctor.user.email}</span>
                          </div>
                          {doctor.user.phone && (
                            <div className="flex items-center text-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#CE592C] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span className="text-[#DDDFDE]">{doctor.user.phone}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Availability */}
                        {doctor.availability && doctor.availability.length > 0 && (
                          <div className="w-full md:w-1/4 mb-2 md:mb-0 md:px-4">
                            <h4 className="text-xs font-medium text-white mb-1">Working Hours:</h4>
                            <div className="text-xs text-[#DDDFDE]/70">
                              {doctor.availability.slice(0, 1).map((slot, index) => (
                                <div key={index} className="flex justify-between mb-1">
                                  <span>{slot.day}:</span>
                                  <span>{slot.from} - {slot.to}</span>
                                </div>
                              ))}
                              {doctor.availability.length > 1 && (
                                <div className="text-[#0CB8B6] text-xs">+{doctor.availability.length - 1} more days</div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Actions */}
                        <div className="flex md:justify-end space-x-2 w-full md:w-auto">
                          <button
                            onClick={() => handleEditDoctor(doctor)}
                            className="bg-[#0CB8B6] hover:bg-[#0CB8B6]/90 text-white px-2 py-1 rounded text-xs flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDoctor(doctor)}
                            className="bg-[#CE592C] hover:bg-[#CE592C]/90 text-white px-2 py-1 rounded text-xs flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <DoctorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode={modalMode}
          doctor={selectedDoctor}
          onSubmit={handleSubmit}
          onDelete={handleDeleteConfirm}
        />
      </div>
    </div>
  );
}