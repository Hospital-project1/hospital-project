

"use client";
import { useState, useEffect } from 'react';
import DashboardMetricCard from '../../components/dashboard/ui/MetricCard';
import RecentPatients from '../../components/dashboard/tables/RecentPatients';
import UpcomingAppointments from '../../components/dashboard/tables/UpcomingAppointments';
import RevenueChart from '../../components/dashboard/charts/RevenueChart';

export default function Dashboard() {
  const [stats, setStats] = useState({
    patients: { total: '...', trend: '...' },
    appointments: { total: '...', trend: '...' },
    revenue: { total: '...', trend: '...' },
    feedback: { average: '...', trend: '...' }
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardStats();
  }, []);
  
  return (
    <div className="space-y-6">
      {/* <h1 className="text-2xl font-bold text-[#DDDFDE]">Dashboard Overview</h1> */}
{/*       
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardMetricCard 
          title="Total Patients" 
          value={loading ? '...' : stats.patients.total.toLocaleString()} 
          trend={stats.patients.trend} 
          icon="patients" 
          accentColor="#0CB8B6"
        />
        <DashboardMetricCard 
          title="Appointments" 
          value={loading ? '...' : stats.appointments.total.toLocaleString()} 
          trend={stats.appointments.trend} 
          icon="appointments"
          accentColor="#CE592C" 
        />
        <DashboardMetricCard 
          title="Revenue" 
          value={loading ? '...' : `$${stats.revenue.total.toLocaleString()}`} 
          trend={stats.revenue.trend} 
          icon="revenue" 
          accentColor="#0CB8B6"
        />
        <DashboardMetricCard 
          title="Feedback" 
          value={loading ? '...' : `${stats.feedback.average}/5`} 
          trend={stats.feedback.trend} 
          icon="feedback" 
          accentColor="#CE592C"
        />
      </div> */}
      
      {/* Rest of the dashboard remains the same */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#DDDFDE]/10 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4 text-[#DDDFDE]">Revenue Overview</h2>
          <RevenueChart />
        </div>
        <div className="bg-[#DDDFDE]/10 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4 text-[#DDDFDE]">Upcoming Appointments</h2>
          <UpcomingAppointments />
        </div>
      </div> */}
{/*       
      <div className="bg-[#DDDFDE]/10 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4 text-[#DDDFDE]">Recent Patients</h2>
        <RecentPatients />
      </div> */}
    </div>
  );
}