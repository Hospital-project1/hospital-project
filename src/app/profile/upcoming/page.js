'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { User, Calendar, Clock, FileText, Calendar as CalendarIcon, Users, Plus, MapPin } from 'lucide-react';

export default function UpcomingAppointmentsPage() {
  const pathname = usePathname();
  const [userData, setUserData] = useState({
    _id: '',
    name: '',
    email: '',
    profilePicture: ''
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user profile data
        const userResponse = await axios.get('/api/auth/profile/personal');
        if (userResponse.data.success) {
          setUserData(userResponse.data.user);
        }
        
        // Get upcoming appointments data
        const appointmentsResponse = await axios.get('/api/auth/profile/upcoming');
        if (appointmentsResponse.data.success) {
          setAppointments(appointmentsResponse.data.appointments);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
        <title>Upcoming Appointments | Hospital Portal</title>
      </Head>
      
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

          {/* Upcoming Appointments Content */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Clock size={20} className="mr-2 text-teal-500" />
                Upcoming Appointments
              </h2>
              <Link 
                href="/appointment"
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md flex items-center text-sm transition-colors duration-200 hover: cursor-pointer"
              >
                <Plus size={16} className="mr-2" />
                Book New Appointment
              </Link>
            </div>
            
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                  <div className={`border-l-4 ${appointment.paymentStatus === 'paid' ? 'border-green-500' : 'border-teal-500'}`}>
                    <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-14 h-14 bg-teal-50 text-teal-500 flex items-center justify-center rounded-full">
                          <CalendarIcon size={24} />
                        </div>
                        <div>
                          <p className="text-base font-medium text-gray-900">{appointment.doctor.specialty}</p>
                          <div className="flex items-center mt-1 text-sm text-gray-600">
                            <Users size={14} className="mr-1 text-teal-500" />
                            <span>Dr.{appointment.doctor.name}</span>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1 text-teal-500" />
                              <span>{formatDate(appointment.appointmentDate)}</span>
                            </div>
                          </div>
                          <div className="mt-2 text-sm">
                            <span className="text-gray-600">Reason: </span>
                            <span className="text-gray-800">{appointment.reason}</span>
                          </div>
                          <div className="mt-1 flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              appointment.paymentStatus === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {appointment.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
                            </span>
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {appointment.appointmentType}
                            </span>
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {appointments.length === 0 && (
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 flex flex-col items-center justify-center">
                  <Clock size={48} className="text-gray-300 mb-3" />
                  <p className="text-center text-gray-500 mb-2">No upcoming appointments.</p>
                  <Link 
                    href="/appointment"
                    className="mt-4 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md flex items-center text-sm transition-colors duration-200"
                  >
                    <Plus size={16} className="mr-2" />
                    Book New Appointment
                  </Link>
                </div>
              )}
            </div>
            
            {appointments.length > 0 && (
              <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-4">
                  <FileText size={18} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-blue-800">Appointment Information</h3>
                  <p className="mt-1 text-sm text-blue-600">
                    Please arrive 15 minutes before your scheduled appointment time. Bring your insurance card and ID with you.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}