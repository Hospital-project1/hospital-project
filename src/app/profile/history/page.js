'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { 
  User, 
  Calendar, 
  Clock, 
  FileText, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  Stethoscope,
  Video,
  AlertCircle
} from 'lucide-react';

export default function BookingHistoryPage() {
  const pathname = usePathname();
  const [userData, setUserData] = useState({
    _id: '',
    name: '',
    email: '',
    profilePicture: ''
  });
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user profile data
        const userResponse = await axios.get('/api/auth/profile/personal');
        if (userResponse.data.success) {
          setUserData(userResponse.data.user);
        }
        
        // Get appointment history data
        const historyResponse = await axios.get('/api/auth/profile/history');
        if (historyResponse.data.success) {
          // Filter only completed appointments
          const completedAppointments = historyResponse.data.appointments.filter(
            appointment => appointment.status === 'completed'
          );
          setBookingHistory(completedAppointments);
          setTotalResults(completedAppointments.length);
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
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculate pagination values
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = Math.min(startIndex + resultsPerPage, totalResults);
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  
  // Handle page changes
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Get current page items
  const currentItems = bookingHistory.slice(startIndex, endIndex);
  
  // Helper function to get appointment type icon
  const getAppointmentTypeIcon = (type) => {
    switch(type.toLowerCase()) {
      case 'video':
        return <Video size={16} className="text-blue-500" />;
      case 'in-person':
        return <Stethoscope size={16} className="text-purple-500" />;
      default:
        return <Calendar size={16} className="text-gray-500" />;
    }
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
                Completed Appointments History
              </h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden shadow">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gradient-to-r from-teal-50 to-teal-100">
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Booking ID</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Specialty</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Doctor</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((booking, index) => (
                      <tr 
                        key={booking.id} 
                        className={`hover:bg-teal-50 transition-colors cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-teal-600">{booking.id.substring(0, 8)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar size={16} className="text-teal-400 mr-2" />
                            <span className="text-sm text-gray-700">{formatDate(booking.appointmentDate)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-teal-50 text-teal-700 border border-teal-100">
                            {booking.doctor.specialty}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-medium text-sm">
                              {booking.doctor.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">Dr. {booking.doctor.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getAppointmentTypeIcon(booking.appointmentType)}
                            <span className="ml-2 text-sm text-gray-700">{booking.appointmentType}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            <CheckCircle size={14} className="mr-1" />
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {bookingHistory.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <Calendar size={64} className="text-gray-300 mb-4" />
                  <p className="text-lg font-medium text-gray-500 mb-2">No completed appointments</p>
                  <p className="text-center text-gray-400 text-sm max-w-md">
                    You don't have any completed appointments in your history yet.
                  </p>
                </div>
              )}
              
              {/* Pagination */}
              {bookingHistory.length > 0 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{endIndex}</span> of{' '}
                          <span className="font-medium">{totalResults}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                              currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-teal-50 hover:text-teal-600 cursor-pointer'
                            }`}
                          >
                            <ChevronLeft size={16} className="h-5 w-5" aria-hidden="true" />
                          </button>
                          
                          {[...Array(totalPages)].map((_, i) => (
                            <button
                              key={i}
                              onClick={() => goToPage(i + 1)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === i + 1
                                  ? 'z-10 bg-teal-50 border-teal-500 text-teal-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                          
                          <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                              currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-teal-50 hover:text-teal-600 cursor-pointer'
                            }`}
                          >
                            <ChevronRight size={16} className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}