// src/app/dashboard/doctors/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import DoctorModal from '../DoctorModal';

export default function DoctorDetails({ params }) {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('');
  const router = useRouter();
  
  const doctorId = params.id;
  
  useEffect(() => {
    fetchDoctorDetails();
  }, [doctorId]);
  
  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/doctors/${doctorId}`);
      const data = await response.json();
      
      if (data.success) {
        setDoctor(data.doctor);
      } else {
        setError(data.message || 'حدث خطأ أثناء جلب بيانات الطبيب');
      }
    } catch (error) {
      console.error('Error fetching doctor details:', error);
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = () => {
    setModalMode('edit');
    setIsModalOpen(true);
  };
  
  const handleDelete = () => {
    setModalMode('delete');
    setIsModalOpen(true);
  };
  
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/doctors/${doctorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setDoctor(data.doctor);
        setIsModalOpen(false);
      } else {
        console.error('Failed to update doctor:', data.message);
      }
    } catch (error) {
      console.error('Error updating doctor:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/doctors/${doctorId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        router.push('/dashboard/doctors');
      } else {
        console.error('Failed to delete doctor:', data.message);
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0CB8B6]"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
        <Link 
          href="/dashboard/doctors" 
          className="mt-4 inline-block bg-[#0CB8B6] hover:bg-[#0a9e9c] text-white px-4 py-2 rounded transition"
        >
          العودة إلى قائمة الأطباء
        </Link>
      </div>
    );
  }
  
  if (!doctor) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p>لم يتم العثور على الطبيب</p>
        </div>
        <Link 
          href="/dashboard/doctors" 
          className="mt-4 inline-block bg-[#0CB8B6] hover:bg-[#0a9e9c] text-white px-4 py-2 rounded transition"
        >
          العودة إلى قائمة الأطباء
        </Link>
      </div>
    );
  }
  
  const { user, specialty, details, availability } = doctor;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <Link 
          href="/dashboard/doctors" 
          className="inline-flex items-center text-[#0CB8B6] hover:text-[#0a9e9c]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          العودة إلى قائمة الأطباء
        </Link>
        
        <div className="flex space-x-2 rtl:space-x-reverse">
          <button
            onClick={handleEdit}
            className="bg-[#0CB8B6] hover:bg-[#0a9e9c] text-white px-3 py-1.5 rounded transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            تعديل
          </button>
          <button
            onClick={handleDelete}
            className="bg-[#CE592C] hover:bg-red-600 text-white px-3 py-1.5 rounded transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            حذف
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* معلومات الطبيب الأساسية */}
          <div className="bg-[#0CB8B6] text-white p-6 flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white mb-4">
              {user.profilePicture ? (
                <Image
                  src={user.profilePicture}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-[#1D1F27] text-3xl font-bold">
                  {user.name?.charAt(0)}
                </div>
              )}
            </div>
            
            <h1 className="text-xl font-bold mb-1">{user.name}</h1>
            <p className="text-white opacity-80 mb-6">{specialty}</p>
            
            <div className="w-full space-y-3">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span dir="ltr">{user.email}</span>
              </div>
              
              {user.phone && (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span dir="ltr">{user.phone}</span>
                </div>
              )}
              
              {user.address && (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{user.address}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* نبذة ومعلومات الطبيب */}
          <div className="md:col-span-2 p-6">
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-[#1D1F27] border-b border-gray-200 pb-2">نبذة عن الطبيب</h2>
              {details ? (
                <p className="text-gray-700 leading-relaxed">{details}</p>
              ) : (
                <p className="text-gray-500 italic">لا توجد معلومات إضافية عن هذا الطبيب.</p>
              )}
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4 text-[#1D1F27] border-b border-gray-200 pb-2">مواعيد العمل</h2>
              
              {availability && availability.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availability.map((slot, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-50 border border-gray-200 rounded p-3"
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-[#1D1F27]">{slot.day}</div>
                        <div className="text-gray-600 bg-white px-2 py-1 rounded border border-gray-200" dir="ltr">
                          {slot.from} - {slot.to}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">لم يتم تحديد مواعيد عمل لهذا الطبيب.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* النوافذ المنبثقة للتعديل والحذف */}
      <DoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        doctor={doctor}
        onSubmit={handleSubmit}
        onDelete={handleDeleteConfirm}
      />
    </div>
  );
}// src/app/dashboard/doctors/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import DoctorModal from '../DoctorModal';

export default function DoctorDetails({ params }) {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('');
  const router = useRouter();
  
  const doctorId = params.id;
  
  useEffect(() => {
    fetchDoctorDetails();
  }, [doctorId]);
  
  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/doctors/${doctorId}`);
      const data = await response.json();
      
      if (data.success) {
        setDoctor(data.doctor);
      } else {
        setError(data.message || 'حدث خطأ أثناء جلب بيانات الطبيب');
      }
    } catch (error) {
      console.error('Error fetching doctor details:', error);
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = () => {
    setModalMode('edit');
    setIsModalOpen(true);
  };
  
  const handleDelete = () => {
    setModalMode('delete');
    setIsModalOpen(true);
  };
  
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/doctors/${doctorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setDoctor(data.doctor);
        setIsModalOpen(false);
      } else {
        console.error('Failed to update doctor:', data.message);
      }
    } catch (error) {
      console.error('Error updating doctor:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/doctors/${doctorId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        router.push('/dashboard/doctors');
      } else {
        console.error('Failed to delete doctor:', data.message);
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0CB8B6]"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
        <Link 
          href="/dashboard/doctors" 
          className="mt-4 inline-block bg-[#0CB8B6] hover:bg-[#0a9e9c] text-white px-4 py-2 rounded transition"
        >
          العودة إلى قائمة الأطباء
        </Link>
      </div>
    );
  }
  
  if (!doctor) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p>لم يتم العثور على الطبيب</p>
        </div>
        <Link 
          href="/dashboard/doctors" 
          className="mt-4 inline-block bg-[#0CB8B6] hover:bg-[#0a9e9c] text-white px-4 py-2 rounded transition"
        >
          العودة إلى قائمة الأطباء
        </Link>
      </div>
    );
  }
  
  const { user, specialty, details, availability } = doctor;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <Link 
          href="/dashboard/doctors" 
          className="inline-flex items-center text-[#0CB8B6] hover:text-[#0a9e9c]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          العودة إلى قائمة الأطباء
        </Link>
        
        <div className="flex space-x-2 rtl:space-x-reverse">
          <button
            onClick={handleEdit}
            className="bg-[#0CB8B6] hover:bg-[#0a9e9c] text-white px-3 py-1.5 rounded transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            تعديل
          </button>
          <button
            onClick={handleDelete}
            className="bg-[#CE592C] hover:bg-red-600 text-white px-3 py-1.5 rounded transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            حذف
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* معلومات الطبيب الأساسية */}
          <div className="bg-[#0CB8B6] text-white p-6 flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white mb-4">
              {user.profilePicture ? (
                <Image
                  src={user.profilePicture}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-[#1D1F27] text-3xl font-bold">
                  {user.name?.charAt(0)}
                </div>
              )}
            </div>
            
            <h1 className="text-xl font-bold mb-1">{user.name}</h1>
            <p className="text-white opacity-80 mb-6">{specialty}</p>
            
            <div className="w-full space-y-3">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span dir="ltr">{user.email}</span>
              </div>
              
              {user.phone && (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span dir="ltr">{user.phone}</span>
                </div>
              )}
              
              {user.address && (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{user.address}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* نبذة ومعلومات الطبيب */}
          <div className="md:col-span-2 p-6">
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-[#1D1F27] border-b border-gray-200 pb-2">نبذة عن الطبيب</h2>
              {details ? (
                <p className="text-gray-700 leading-relaxed">{details}</p>
              ) : (
                <p className="text-gray-500 italic">لا توجد معلومات إضافية عن هذا الطبيب.</p>
              )}
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4 text-[#1D1F27] border-b border-gray-200 pb-2">مواعيد العمل</h2>
              
              {availability && availability.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availability.map((slot, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-50 border border-gray-200 rounded p-3"
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-[#1D1F27]">{slot.day}</div>
                        <div className="text-gray-600 bg-white px-2 py-1 rounded border border-gray-200" dir="ltr">
                          {slot.from} - {slot.to}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">لم يتم تحديد مواعيد عمل لهذا الطبيب.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* النوافذ المنبثقة للتعديل والحذف */}
      <DoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        doctor={doctor}
        onSubmit={handleSubmit}
        onDelete={handleDeleteConfirm}
      />
    </div>
  );
}