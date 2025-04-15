'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  MdDashboard,
  MdCalendarToday,
  MdPeople,
  MdAssignment,
  MdAccessTime,
  MdExitToApp
} from 'react-icons/md';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function DoctorOverview(params) {
  
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overviewData, setOverviewData] = useState(null);

  const doctorId = userId;
  console.log("hi", doctorId )  

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/auth/me', {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });
        
        if (response.data.success) {
          setUserId(response.data.user._id);
          
          // setDoctor(response.data.user)
        } else {
          throw new Error(response.data.error || 'Failed to fetch user data');
        }
      } catch (err) {
        console.error('User fetch error:', err);
        setError(err.response?.data?.error || err.message);
      }
    };

    fetchUserData();
  }, []);


  useEffect(() => {
    fetchOverviewData();
  }, [doctorId]);


  console.log("hi", doctorId )
  const fetchOverviewData = async () => {
    if (!doctorId) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/doctor/${doctorId}/overview`);
      
      if (response.data.success) {
        setOverviewData(response.data.data);
        console.log("hi", response.data.data )
      } else {
        throw new Error(response.data.error || 'Failed to fetch overview data');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  

  const getStatusBadge = (status) => {
    const colorMap = {
      pending: '#CE592C',
      confirmed: '#0CB8B6',
      canceled: '#1D1F27',
      completed: '#DDDFDE',
    };
    return (
      <span className="status-badge" style={{ backgroundColor: colorMap[status] }}>
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchOverviewData}>Retry</button>
      </div>
    );
  }

  if (!overviewData) {
    return <div className="empty-state">No data available</div>;
  }

  return (
    <div className="overview-container">
      {/* Doctor Profile Section */}
      <div className="profile-section">
        <div className="profile-header">
          {overviewData.doctorInfo.profilePicture ? (
            <img 
              src={overviewData.doctorInfo.profilePicture} 
              alt={overviewData.doctorInfo.name}
              className="profile-avatar"
            />
          ) : (
            <div className="avatar-fallback">
              {overviewData.doctorInfo.name.charAt(0)}
            </div>
          )}
          <div className="profile-info">
            <h2>{overviewData.doctorInfo.name}</h2>
            <p className="specialty">{overviewData.doctorInfo.specialty}</p>
            <div className="contact-info">
              <p>{overviewData.doctorInfo.email}</p>
              <p>{overviewData.doctorInfo.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard 
          icon={<MdPeople size={24} />}
          title="Total Patients"
          value={overviewData.stats.totalPatients}
          color="#0CB8B6"
        />
        <StatCard 
          icon={<MdCalendarToday size={24} />}
          title="Total Appointments"
          value={overviewData.stats.totalAppointments}
          color="#CE592C"
        />
        <StatCard 
          icon={<MdAccessTime size={24} />}
          title="Upcoming Appointments"
          value={overviewData.stats.upcomingAppointments}
          color="#0CB8B6"
        />
        <StatCard 
          icon={<MdAssignment size={24} />}
          title="Recent Prescriptions"
          value={overviewData.recentPrescriptions.length}
          color="#DDDFDE"
        />
      </div>

      {/* Sections */}
      <Section 
        title="Recent Patients" 
        icon={<MdPeople size={20} />}
        items={overviewData.recentPatients}
        renderItem={(patient) => (
          <PatientCard key={patient.id} patient={patient} />
        )}
      />

      <Section 
        title="Upcoming Appointments" 
        icon={<MdCalendarToday size={20} />}
        items={overviewData.upcomingAppointments}
        renderItem={(appt) => (
          <AppointmentCard key={appt.id} appointment={appt} getStatusBadge={getStatusBadge} />
        )}
      />

      <Section 
        title="Recent Prescriptions" 
        icon={<MdAssignment size={20} />}
        items={overviewData.recentPrescriptions}
        renderItem={(pres) => (
          <PrescriptionCard key={pres.id} prescription={pres} />
        )}
      />
    </div>
  );
}

// Reusable Components
function StatCard({ icon, title, value, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: `${color}20` }}>
        {icon}
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <p style={{ color }}>{value}</p>
      </div>
    </div>
  );
}

function Section({ title, icon, items, renderItem }) {
  return (
    <div className="section">
      <h3 className="section-title">
        {icon} {title}
      </h3>
      <div className="items-grid">
        {items.map(item => renderItem(item))}
      </div>
    </div>
  );
}

function PatientCard({ patient }) {
  return (
    <div className="patient-card">
      {patient.profilePicture ? (
        <img src={patient.profilePicture} alt={patient.name} className="patient-avatar" />
      ) : (
        <div className="avatar-fallback">
          {patient.name.charAt(0)}
        </div>
      )}
      <div className="patient-info">
        <h4>{patient.name}</h4>
        <p>{patient.email}</p>
        <p>{patient.phone}</p>
        <p className="last-visit">
          Added {dayjs(patient.lastVisit).fromNow()}
        </p>
      </div>
    </div>
  );
}

function AppointmentCard({ appointment, getStatusBadge }) {
  return (
    <div className="appointment-card">
      <div className="appointment-header">
        {appointment.patientAvatar ? (
          <img src={appointment.patientAvatar} alt={appointment.patientName} className="patient-avatar" />
        ) : (
          <div className="avatar-fallback">
            {appointment.patientName.charAt(0)}
          </div>
        )}
        <div className="patient-info">
          <h4>{appointment.patientName}</h4>
          {getStatusBadge(appointment.status)}
        </div>
      </div>
      <div className="appointment-details">
        <p><strong>Date:</strong> {dayjs(appointment.date).format('MMM D, YYYY')}</p>
        <p><strong>Time:</strong> {appointment.time}</p>
        <p><strong>Type:</strong> {appointment.type}</p>
      </div>
    </div>
  );
}

function PrescriptionCard({ prescription }) {
  return (
    <div className="prescription-card">
      <div className="prescription-header">
        <h4>{prescription.patientName}</h4>
        <p className="prescription-date">
          {dayjs(prescription.date).format('MMM D, YYYY')}
        </p>
      </div>
      <div className="prescription-details">
        <p>{prescription.medication}</p>
      </div>
    </div>
  );
}

// Styles
const styles = `
  .overview-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    background-color: #1D1F27;
    color: #DDDFDE;
    min-height: 100vh;
  }
  
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #0CB8B6;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .error-container {
    background-color: #CE592C;
    color: #DDDFDE;
    padding: 20px;
    border-radius: 8px;
    margin: 20px;
    text-align: center;
  }
  
  .error-container button {
    background-color: #1D1F27;
    color: #DDDFDE;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    margin-top: 10px;
    cursor: pointer;
  }
  
  .profile-section {
    background-color: rgba(12, 184, 182, 0.1);
    border: 1px solid #0CB8B6;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .profile-header {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .profile-avatar, .avatar-fallback {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .avatar-fallback {
    background-color: #0CB8B6;
    color: #1D1F27;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: bold;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
  }
  
  .stat-card {
    background-color: rgba(12, 184, 182, 0.05);
    border: 1px solid #0CB8B6;
    border-radius: 8px;
    padding: 15px;
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .section {
    background-color: rgba(12, 184, 182, 0.05);
    border: 1px solid #0CB8B6;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .items-grid {
    display: grid;
    gap: 15px;
  }
  
  /* Add more styles as needed */
`;

// Inject styles
export const StyleInjector = () => <style jsx global>{styles}</style>;
