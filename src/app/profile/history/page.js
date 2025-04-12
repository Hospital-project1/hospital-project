'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { User, Calendar, Clock, FileText, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function BookingHistoryPage() {
  const pathname = usePathname();
  const [userData, setUserData] = useState({
    _id: '',
    name: '',
    email: '',
    profilePicture: ''
  });
  const [loading, setLoading] = useState(true);
  
  const bookingHistory = [
    { id: "BK001", date: "2025-03-10", department: "Cardiology", doctor: "Dr. Smith", status: "Completed" },
    { id: "BK002", date: "2025-02-15", department: "Orthopedics", doctor: "Dr. Johnson", status: "Completed" },
    { id: "BK003", date: "2025-01-20", department: "Neurology", doctor: "Dr. Williams", status: "Cancelled" }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get('/api/auth/profile/personal');
        if (data.success) {
          setUserData(data.user);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
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
        <title>Booking History | Hospital Portal</title>
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

          {/* Booking History Content */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <FileText size={20} className="mr-2 text-teal-500" />
                Booking History
              </h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-teal-50">
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Booking ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Department</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Doctor</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookingHistory.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-teal-600">{booking.id}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar size={14} className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-700">{formatDate(booking.date)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.doctor}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${booking.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {bookingHistory.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Calendar size={48} className="text-gray-300 mb-3" />
                  <p className="text-center text-gray-500">No booking history available.</p>
                </div>
              )}
              
              {/* Pagination */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">3</span> of{' '}
                        <span className="font-medium">3</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <a
                          href="#"
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <ChevronLeft size={16} className="h-5 w-5" aria-hidden="true" />
                        </a>
                        <a
                          href="#"
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-teal-50 text-sm font-medium text-teal-600 hover:bg-teal-100"
                        >
                          1
                        </a>
                        <a
                          href="#"
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <ChevronRight size={16} className="h-5 w-5" aria-hidden="true" />
                        </a>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}