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
        fetchDoctors(); // تحديث القائمة
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
        fetchDoctors(); // تحديث القائمة
      } else {
        console.error('Failed to delete doctor:', data.message);
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1D1F27]">إدارة الأطباء</h1>
        <button
          onClick={handleAddDoctor}
          className="bg-[#0CB8B6] hover:bg-[#0a9e9c] text-white px-4 py-2 rounded transition"
        >
          إضافة طبيب جديد
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0CB8B6]"></div>
        </div>
      ) : (
        <>
          {doctors.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">لا يوجد أطباء حتى الآن</p>
            </div>
          ) : (
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
  );
}