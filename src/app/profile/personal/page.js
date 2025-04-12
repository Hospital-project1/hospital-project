'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { User, Phone, Mail, MapPin, Camera, Calendar, Edit2, Save, X, Clock } from 'lucide-react';

export default function PersonalInfoPage() {
  const pathname = usePathname();
  const [userData, setUserData] = useState({
    _id: '',
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    profilePicture: '',
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get('/api/auth/profile/personal');
        
        if (data.success) {
          setUserData(data.user);
          setEditData({
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phoneNumber,
            address: data.user.address,
            profilePicture: data.user.profilePicture
          });
        } else {
          throw new Error(data.message || 'Failed to fetch user data');
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const { data } = await axios.put('/api/auth/profile/personal', editData);
      
      if (data.success) {
        setUserData(data.user);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: userData.name,
      email: userData.email,
      phone: userData.phoneNumber,
      address: userData.address,
      profilePicture: userData.profilePicture
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-4 border-t-teal-500 border-teal-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-teal-600 font-medium">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Personal Information | Hospital Portal</title>
      </Head>

      {/* Toaster Provider */}
      <Toaster 
          position="top-right"
          toastOptions={{
            success: {
              style: {
                background: '#10B981',
                color: 'white',
              },
              duration: 3000,
            },
            error: {
              style: {
                background: '#EF4444',
                color: 'white',
              },
              duration: 3000,
            },
          }}
      />
      
      <div className="max-w-4xl mx-auto pt-10 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-400 px-6 py-6">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative group">
                {userData.profilePicture ? (
                  <img 
                    src={userData.profilePicture} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-teal-500 text-2xl font-bold shadow-md">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                {isEditing && (
                  <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md">
                    <Camera size={16} className="text-teal-500" />
                  </div>
                )}
              </div>
              <div className="ml-0 sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-white">{userData.name}</h1>
                <div className="flex items-center justify-center sm:justify-start mt-1">
                  <User size={14} className="text-teal-100" />
                  <p className="text-teal-100 ml-1 text-sm">Patient ID: {userData._id.substring(0, 8)}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              <Link
                href="/profile/personal"
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center ${
                  pathname === '/profile/personal'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-teal-500 hover:border-teal-300'
                }`}
              >
                <User size={16} className="mr-2" />
                Personal Information
              </Link>
              <Link
                href="/profile/history"
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center ${
                  pathname === '/profile/history'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-teal-500 hover:border-teal-300'
                }`}
              >
                <Calendar size={16} className="mr-2" />
                Booking History
              </Link>
              <Link
                href="/profile/upcoming"
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center ${
                  pathname === '/profile/upcoming'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-teal-500 hover:border-teal-300'
                }`}
              >
                <Clock size={16} className="mr-2" />
                Upcoming Appointments
              </Link>
            </nav>
          </div>

          {/* Personal Info Content */}
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
              {!isEditing && (
                <button 
                  type="button" 
                  onClick={handleEditClick}
                  className="flex items-center bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <Edit2 size={16} className="mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
            
            {isEditing ? (
              <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-500">
                      <User size={16} className="mr-2 text-teal-500" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-500">
                      <Mail size={16} className="mr-2 text-teal-500" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-500">
                      <Phone size={16} className="mr-2 text-teal-500" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleInputChange}
                      placeholder="07XXXXXXXX"
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-500">
                      <MapPin size={16} className="mr-2 text-teal-500" />
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={editData.address}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2"
                    />
                  </div>
                  <div className="md:col-span-2 pt-4 flex space-x-3">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="flex items-center bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex items-center bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                      <X size={16} className="mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-500">
                      <User size={16} className="mr-2 text-teal-500" />
                      Full Name
                    </label>
                    <div className="p-2 bg-white rounded-md border border-gray-100 text-gray-900">{userData.name || 'Not provided'}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-500">
                      <Mail size={16} className="mr-2 text-teal-500" />
                      Email
                    </label>
                    <div className="p-2 bg-white rounded-md border border-gray-100 text-gray-900">{userData.email || 'Not provided'}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-500">
                      <Phone size={16} className="mr-2 text-teal-500" />
                      Phone
                    </label>
                    <div className="p-2 bg-white rounded-md border border-gray-100 text-gray-900">{userData.phoneNumber || 'Not provided'}</div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-500">
                      <MapPin size={16} className="mr-2 text-teal-500" />
                      Address
                    </label>
                    <div className="p-2 bg-white rounded-md border border-gray-100 text-gray-900">{userData.address || 'Not provided'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}