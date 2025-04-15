'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { UserOutlined, CalendarOutlined, MedicineBoxOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const appointmentOptions = [
  { value: '', label: 'All Patients' },
  { value: 'true', label: 'With Appointments' },
  { value: 'false', label: 'Without Appointments' },
];

const sortFieldOptions = [
  { value: 'createdAt', label: 'Created Date' },
  { value: 'user.name', label: 'Name' },
  { value: 'lastVisitDate', label: 'Last Visit' },
];

const sortOrderOptions = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' },
];

export default function PatientsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patients, setPatients] = useState([]);
  const [userId, setUserId] = useState(null);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 20,
    hasMore: false,
  });

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    hasAppointments: searchParams.get('hasAppointments') || '',
    sortField: searchParams.get('sortField') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 20,
  });

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get('/api/auth/me', {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        
        if (response.data.success) {
          setUserId(response.data.user._id || response.data.user.id);
        }
      } catch (err) {
        console.error('Failed to fetch user ID:', err);
      }
    };

    fetchUserId();
  }, []);

  const fetchPatients = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value.toString());
      });

      const response = await axios.get(
        `/api/doctor/${userId}/patients?${params.toString()}`
      );

      if (response.data.success) {
        setPatients(response.data.data);
        setMeta({
          total: response.data.meta.total,
          page: response.data.meta.page,
          pages: response.data.meta.pages,
          limit: response.data.meta.limit,
          hasMore: response.data.meta.hasMore,
        });
      } else {
        throw new Error(response.data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [filters, userId]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v.toString());
    });
    router.replace(`/patients?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (page, pageSize) => {
    const newFilters = { ...filters, page, limit: pageSize };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v.toString());
    });
    router.replace(`/patients?${params.toString()}`, { scroll: false });
  };

  const getStatusBadge = (lastVisitDate) => {
    const isActive = lastVisitDate && 
      dayjs(lastVisitDate).isAfter(dayjs().subtract(6, 'month'));
    
    return (
      <span
        className="status-badge"
        style={{
          backgroundColor: isActive ? '#0CB8B6' : '#CE592C',
          color: '#1D1F27',
        }}
      >
        {isActive ? 'ACTIVE' : 'INACTIVE'}
      </span>
    );
  };

  return (
    <div className="patients-container">
      <div className="patients-header">
        <h1>
          <UserOutlined /> Patients
        </h1>
        <div className="filters">
          <div className="search-input">
            <SearchOutlined />
            <input
              type="text"
              placeholder="Search patients..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <select
            value={filters.hasAppointments}
            onChange={(e) => handleFilterChange('hasAppointments', e.target.value)}
          >
            {appointmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="sort-container">
            <select
              value={filters.sortField}
              onChange={(e) => handleFilterChange('sortField', e.target.value)}
            >
              {sortFieldOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            >
              {sortOrderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-alert">
          <p>{error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div className="patients-stats">
            <div className="stat-card">
              <h3>Total Patients</h3>
              <p>{meta.total}</p>
            </div>
            <div className="stat-card">
              <h3>Active Patients</h3>
              <p>
                {patients.filter(p => p.stats.lastVisit && 
                  dayjs(p.stats.lastVisit).isAfter(dayjs().subtract(6, 'month'))).length}
              </p>
            </div>
            <div className="stat-card">
              <h3>With Appointments</h3>
              <p>
                {patients.filter(p => p.stats.totalAppointments > 0).length}
              </p>
            </div>
          </div>

          <div className="patients-list">
            {patients.length === 0 ? (
              <div className="empty-state">
                <p>No patients found</p>
              </div>
            ) : (
              patients.map((patient) => (
                <div key={patient.id} className="patient-card">
                  <div className="patient-main">
                    <div className="patient-avatar">
                      {patient.user.avatar ? (
                        <img src={patient.user.avatar} alt={patient.user.name} />
                      ) : (
                        <div 
                          className="avatar-fallback"
                          style={{ backgroundColor: '#0CB8B6', color: '#1D1F27' }}
                        >
                          {patient.user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    
                    <div className="patient-info">
                      <h3>
                        {patient.user.name}
                        {getStatusBadge(patient.stats.lastVisit)}
                      </h3>
                      
                      <div className="patient-contacts">
                        <p>{patient.user.email}</p>
                        <p>{patient.user.phone}</p>
                        {patient.user.dob && (
                          <p>DOB: {dayjs(patient.user.dob).format('MMM D, YYYY')}</p>
                        )}
                      </div>
                      
                      <div className="patient-meta">
                        <span>
                          <CalendarOutlined /> 
                          {patient.stats.lastVisit ? 
                            dayjs(patient.stats.lastVisit).format('MMM D, YYYY') : 
                            'No visits'}
                        </span>
                        <span>
                          <MedicineBoxOutlined /> 
                          {patient.stats.prescriptionCount} prescriptions
                        </span>
                        <span>
                          {patient.stats.totalAppointments} appointments
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="patient-details">
                    <div className="medical-section">
                      <h4>Medical History</h4>
                      {patient.medicalInfo.history.length > 0 ? (
                        <ul>
                          {patient.medicalInfo.history.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>No medical history recorded</p>
                      )}
                    </div>
                    
                    <div className="prescription-section">
                      <h4>Recent Prescriptions</h4>
                      {patient.recentPrescriptions.length > 0 ? (
                        <ul>
                          {patient.recentPrescriptions.map((prescription, index) => (
                            <li key={index}>
                              <span>{dayjs(prescription.date).format('MMM D')}: </span>
                              {prescription.medications.join(', ')}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No recent prescriptions</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="pagination-container">
            <div className="pagination">
              <button
                onClick={() => handlePageChange(meta.page - 1, meta.limit)}
                disabled={meta.page === 1}
              >
                Previous
              </button>
              
              <span>
                Page {meta.page} of {meta.pages}
              </span>
              
              <button
                onClick={() => handlePageChange(meta.page + 1, meta.limit)}
                disabled={meta.page === meta.pages}
              >
                Next
              </button>
              
              <select
                value={meta.limit}
                onChange={(e) => handlePageChange(1, parseInt(e.target.value))}
              >
                {[10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .patients-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          background-color: #1D1F27;
          color: #DDDFDE;
          min-height: 100vh;
        }
        
        .patients-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #0CB8B6;
        }
        
        .patients-header h1 {
          color: #0CB8B6;
          margin: 0;
          font-size: 1.8rem;
        }
        
        .filters {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }
        
        .search-input {
          display: flex;
          align-items: center;
          background-color: #1D1F27;
          border: 1px solid #0CB8B6;
          border-radius: 4px;
          padding: 0 10px;
          min-width: 250px;
        }
        
        .search-input input {
          background: transparent;
          border: none;
          color: #DDDFDE;
          padding: 8px;
          width: 100%;
        }
        
        .search-input input:focus {
          outline: none;
        }
        
        select {
          background-color: #1D1F27;
          color: #DDDFDE;
          border: 1px solid #0CB8B6;
          border-radius: 4px;
          padding: 8px;
          min-width: 120px;
        }
        
        select:focus {
          outline: none;
          border-color: #CE592C;
        }
        
        .sort-container {
          display: flex;
          gap: 8px;
        }
        
        .error-alert {
          background-color: #CE592C;
          color: #DDDFDE;
          padding: 10px 15px;
          border-radius: 4px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .error-alert button {
          background: none;
          border: none;
          color: #DDDFDE;
          font-size: 1.2rem;
          cursor: pointer;
        }
        
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 300px;
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
        
        .patients-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .stat-card {
          background-color: rgba(12, 184, 182, 0.1);
          border: 1px solid #0CB8B6;
          border-radius: 8px;
          padding: 15px;
          text-align: center;
        }
        
        .stat-card h3 {
          margin: 0 0 10px 0;
          color: #DDDFDE;
          font-size: 1rem;
        }
        
        .stat-card p {
          margin: 0;
          color: #0CB8B6;
          font-size: 1.5rem;
          font-weight: bold;
        }
        
        .patients-list {
          display: grid;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .patient-card {
          background-color: #1D1F27;
          border: 1px solid #0CB8B6;
          border-radius: 8px;
          padding: 15px;
          transition: all 0.3s ease;
        }
        
        .patient-card:hover {
          border-color: #CE592C;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(12, 184, 182, 0.1);
        }
        
        .patient-main {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .patient-avatar {
          flex-shrink: 0;
        }
        
        .patient-avatar img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .avatar-fallback {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: bold;
        }
        
        .patient-info {
          flex-grow: 1;
        }
        
        .patient-info h3 {
          margin: 0 0 8px 0;
          font-size: 1.2rem;
          color: #DDDFDE;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .status-badge {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: bold;
        }
        
        .patient-contacts {
          margin-bottom: 10px;
        }
        
        .patient-contacts p {
          margin: 0 0 5px 0;
          color: #0CB8B6;
          font-size: 0.9rem;
        }
        
        .patient-meta {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }
        
        .patient-meta span {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #DDDFDE;
          font-size: 0.9rem;
        }
        
        .patient-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          border-top: 1px solid rgba(12, 184, 182, 0.3);
          padding-top: 15px;
        }
        
        .medical-section, .prescription-section {
          background-color: rgba(12, 184, 182, 0.05);
          padding: 10px;
          border-radius: 4px;
        }
        
        .medical-section h4, .prescription-section h4 {
          margin: 0 0 10px 0;
          color: #0CB8B6;
          font-size: 1rem;
        }
        
        .medical-section ul, .prescription-section ul {
          margin: 0;
          padding-left: 20px;
        }
        
        .medical-section li, .prescription-section li {
          margin-bottom: 5px;
          color: #DDDFDE;
          font-size: 0.9rem;
        }
        
        .prescription-section li span {
          color: #0CB8B6;
        }
        
        .empty-state {
          text-align: center;
          padding: 40px;
          color: #DDDFDE;
          font-size: 1.1rem;
        }
        
        .pagination-container {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        
        .pagination {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .pagination button {
          background-color: #0CB8B6;
          color: #1D1F27;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        
        .pagination button:disabled {
          background-color: #DDDFDE;
          cursor: not-allowed;
        }
        
        .pagination select {
          background-color: #1D1F27;
          color: #DDDFDE;
          border: 1px solid #0CB8B6;
          border-radius: 4px;
          padding: 6px;
        }
        
        @media (max-width: 768px) {
          .patients-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .filters {
            width: 100%;
          }
          
          .search-input {
            width: 100%;
          }
          
          select {
            flex-grow: 1;
          }
          
          .patient-details {
            grid-template-columns: 1fr;
          }
          
          .patient-meta {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}