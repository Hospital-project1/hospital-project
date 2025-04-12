"use client";

import { useState } from 'react';
import { Calendar, Users, FileText, Clock, Settings, LogOut, Home, CreditCard, PieChart, DollarSign, Briefcase } from 'lucide-react';

export default function DoctorDashboard() {



    const fetchStats = async () => {
        try {
          const [appointmentsRes, patientsRes] = await Promise.all([
            fetch('/api/appointments'),
            fetch('/api/patients')
          ]);
          
          const appointments = await appointmentsRes.json();
          const patients = await patientsRes.json();
          
          // حساب الإحصائيات
          const todayAppointments = appointments.filter(app => {
            const appDate = new Date(app.appointmentDate);
            const today = new Date();
            return appDate.toDateString() === today.toDateString();
          }).length;
          
          const weeklyStats = {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            appointments: [0, 0, 0, 0, 0, 0, 0], // سيتم ملؤها
            newPatients: [0, 0, 0, 0, 0, 0, 0] // سيتم ملؤها
          };
          
          // حساب الإحصائيات الأسبوعية
          appointments.forEach(app => {
            const day = new Date(app.appointmentDate).getDay(); // 0-6
            weeklyStats.appointments[day]++;
          });
          
          patients.forEach(patient => {
            const day = new Date(patient.createdAt).getDay();
            weeklyStats.newPatients[day]++;
          });
          
          return {
            totalAppointments: appointments.length,
            totalPatients: patients.length,
            todayAppointments,
            weeklyStats
          };
          
        } catch (error) {
          console.error('Error fetching stats:', error);
          return null;
        }
      };

      
  const [activePatient, setActivePatient] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // حالة جديدة للتبويب النشط
  
  // Sample data for the dashboard
  const recentAppointments = [
    { id: 1, patient: "John Smith", date: "25 April 2025", time: "09:30 AM", type: "Check-up", status: "Completed" },
    { id: 2, patient: "Maria Garcia", date: "25 April 2025", time: "11:00 AM", type: "Follow-up", status: "Upcoming" },
    { id: 3, patient: "Robert Johnson", date: "26 April 2025", time: "10:15 AM", type: "Consultation", status: "Upcoming" },
  ];

  const weeklyStats = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    appointments: [4, 3, 5, 3, 6, 2, 0],
    newPatients: [1, 0, 2, 1, 1, 0, 0],
  };

  const patientDistribution = [
    { name: "Regular", percentage: 45, color: "bg-blue-600" },
    { name: "New", percentage: 25, color: "bg-cyan-500" },
    { name: "Referral", percentage: 20, color: "bg-orange-500" },
    { name: "Emergency", percentage: 10, color: "bg-pink-500" },
  ];

  // محتوى التبويبات
  const renderTabContent = () => {
    switch(activeTab) {
      case 'appointments':
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">إدارة المواعيد</h2>
            <p>هنا يمكنك عرض وإدارة جميع المواعيد...</p>
          </div>
        );
      case 'patients':
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">إدارة المرضى</h2>
            <p>هنا يمكنك عرض وإدارة سجلات المرضى...</p>
          </div>
        );
      case 'reports':
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">التقارير والإحصائيات</h2>
            <p>هنا يمكنك عرض التقارير والإحصائيات...</p>
          </div>
        );
      default: // dashboard
        return (
          <>
            {/* Summary Cards */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Today's Summary</h3>
                <button className="text-[#0CB8B6] font-medium">See All</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#0CB8B6] text-white p-6 rounded-lg shadow">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-blue-100">Total Appointments</p>
                      <h4 className="text-3xl font-bold mt-2">12</h4>
                      <p className="mt-2 text-blue-200">Today, April 25</p>
                    </div>
                    <div className="bg-[#0CB8B6] p-3 rounded-full">
                      <Calendar size={24} />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-500">Patients</p>
                      <h4 className="text-3xl font-bold mt-2">45</h4>
                      <p className="mt-2 text-gray-400">This Week</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-full">
                      <Users size={24} className="text-gray-500" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-500">New Patients</p>
                      <h4 className="text-3xl font-bold mt-2">5</h4>
                      <p className="mt-2 text-gray-400">Today, April 25</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-full">
                      <Users size={24} className="text-gray-500" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-500">Revenue</p>
                      <h4 className="text-3xl font-bold mt-2">$2,540</h4>
                      <p className="mt-2 text-gray-400">This Week</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-full">
                      <DollarSign size={24} className="text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Appointments */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Recent Appointments</h3>
                  <button className="text-[#0CB8B6] font-medium">See All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="pb-3 font-medium">Patient</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Type</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentAppointments.map(appointment => (
                        <tr key={appointment.id} className="border-b last:border-0">
                          <td className="py-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gray-200 mr-3 flex items-center justify-center overflow-hidden">
                                <img src={`/api/placeholder/32/32`} alt={appointment.patient} className="w-full h-full object-cover" />
                              </div>
                              <span className="font-medium">{appointment.patient}</span>
                            </div>
                          </td>
                          <td className="py-3 text-gray-500">{appointment.date} - {appointment.time}</td>
                          <td className="py-3 text-gray-500">{appointment.type}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              appointment.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                              appointment.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Patient Distribution */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Patient Statistics</h3>
                <div className="mb-6">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#0CB8B6] bg-blue-200">
                          Patient Distribution
                        </span>
                      </div>
                    </div>
                    {patientDistribution.map((item, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-gray-700">{item.name}</span>
                          <span className="text-xs font-semibold text-gray-700">{item.percentage}%</span>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                          <div style={{ width: `${item.percentage}%` }} className={`${item.color} rounded`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Weekly Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Activity</h3>
                <div className="h-64 flex items-end space-x-2">
                  {weeklyStats.labels.map((day, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="w-full flex flex-col items-center space-y-1">
                        <div 
                          className="w-full bg-[#0CB8B6] rounded-t" 
                          style={{ height: `${weeklyStats.appointments[index] * 20}px` }}
                        ></div>
                        <div 
                          className="w-full bg-cyan-500 rounded-t" 
                          style={{ height: `${weeklyStats.newPatients[index] * 20}px` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">{day}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-4 space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#0CB8B6] rounded-full mr-2"></div>
                    <span className="text-sm text-gray-500">Appointments</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-500">New Patients</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Upcoming Tasks</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <FileText size={16} className="text-[#0CB8B6]" />
                        </div>
                        <div>
                          <h4 className="font-medium">Update patient records</h4>
                          <p className="text-xs text-gray-500">Today, 2:00 PM</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Pending</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-lg mr-3">
                          <Users size={16} className="text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Team meeting</h4>
                          <p className="text-xs text-gray-500">Today, 4:30 PM</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="bg-blue-100 text-[#0CB8B6] text-xs px-2 py-1 rounded">Upcoming</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="bg-purple-100 p-2 rounded-lg mr-3">
                          <Calendar size={16} className="text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Review schedules</h4>
                          <p className="text-xs text-gray-500">Tomorrow, 10:00 AM</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="bg-blue-100 text-[#0CB8B6] text-xs px-2 py-1 rounded">Upcoming</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="bg-[#0CB8B6] text-white p-1 rounded">
              <FileText size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-800">DocDash.</h1>
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-4">
            <li>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center w-full ${activeTab === 'dashboard' ? 'text-[#0CB8B6]' : 'text-gray-500'} font-medium`}
              >
                <Home className="mr-3" size={20} />
                Dashboard
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('appointments')}
                className={`flex items-center w-full ${activeTab === 'appointments' ? 'text-[#0CB8B6]' : 'text-gray-500'} font-medium`}
              >
                <Calendar className="mr-3" size={20} />
                Appointments
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('patients')}
                className={`flex items-center w-full ${activeTab === 'patients' ? 'text-[#0CB8B6]' : 'text-gray-500'} font-medium`}
              >
                <Users className="mr-3" size={20} />
                Patients
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('reports')}
                className={`flex items-center w-full ${activeTab === 'reports' ? 'text-[#0CB8B6]' : 'text-gray-500'} font-medium`}
              >
                <FileText className="mr-3" size={20} />
                Reports
              </button>
            </li>
            <li>
              <a href="#" className="flex items-center text-gray-500 hover:text-blue-600">
                <Clock className="mr-3" size={20} />
                Schedule
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-gray-500 hover:text-blue-600">
                <CreditCard className="mr-3" size={20} />
                Billing
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-gray-500 hover:text-blue-600">
                <PieChart className="mr-3" size={20} />
                Analytics
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-gray-500 hover:text-blue-600">
                <Settings className="mr-3" size={20} />
                Settings
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-gray-500 hover:text-blue-600">
                <LogOut className="mr-3" size={20} />
                Logout
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {activeTab === 'dashboard' ? 'Overview' : 
               activeTab === 'appointments' ? 'Appointments' :
               activeTab === 'patients' ? 'Patients' :
               activeTab === 'reports' ? 'Reports' : 'Dashboard'}
            </h2>
            
            {/* تبويبات إضافية داخل المحتوى الرئيسي */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'dashboard' ? 'text-[#0CB8B6] border-b-2 border-[#0CB8B6]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'appointments' ? 'text-[#0CB8B6] border-b-2 border-[#0CB8B6]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Appointments
              </button>
              <button
                onClick={() => setActiveTab('patients')}
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'patients' ? 'text-[#0CB8B6] border-b-2 border-[#0CB8B6]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Patients
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'reports' ? 'text-[#0CB8B6] border-b-2 border-[#0CB8B6]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Reports
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search for something" 
                className="py-2 px-4 pr-10 rounded-full bg-gray-100 w-64 focus:outline-none"
              />
              <button className="absolute right-3 top-2.5">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            <button className="p-2 relative">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              <img src="/api/placeholder/40/40" alt="Doctor profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}




