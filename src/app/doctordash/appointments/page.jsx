'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { CalendarOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const statusOptions = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
  { value: 'today', label: 'Today' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'canceled', label: 'Canceled' },
  { value: 'completed', label: 'Completed' },
];

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'clinic', label: 'Clinic Visit' },
  { value: 'video', label: 'Video Consultation' },
];

const sortOptions = [
  { value: 'appointmentDate', label: 'Date' },
  { value: 'createdAt', label: 'Created At' },
];

export default function AppointmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
    status: 'upcoming',
    sort: 'appointmentDate',
    hasMore: false,
  });

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || 'upcoming',
    type: searchParams.get('type') || '',
    sort: searchParams.get('sort') || 'appointmentDate',
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 10,
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

  const fetchAppointments = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value.toString());
      });

      const response = await axios.get(
        `/api/doctor/${userId}/appointments?${params.toString()}`
      );

      if (response.data.success) {
        setAppointments(response.data.data);
        setMeta(response.data.meta);
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
    fetchAppointments();
  }, [filters, userId]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v.toString());
    });
    router.replace(`/appointments?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (page, pageSize) => {
    const newFilters = { ...filters, page, limit: pageSize };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v.toString());
    });
    router.replace(`/appointments?${params.toString()}`, { scroll: false });
  };

  const getStatusBadge = (status) => {
    const colorMap = {
      pending: '#CE592C', // Rust orange
      confirmed: '#0CB8B6', // Teal
      canceled: '#1D1F27', // Dark blue-black
      completed: '#DDDFDE', // Light gray
    };
    return (
      <span
        className="status-badge"
        style={{ backgroundColor: colorMap[status] }}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const colorMap = {
      clinic: '#0CB8B6', // Teal
      video: '#CE592C', // Rust orange
    };
    return (
      <span
        className="type-badge"
        style={{ backgroundColor: colorMap[type] }}
      >
        {type.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="appointments-container">
      <div className="appointments-header">
        <h1>
          <CalendarOutlined /> Appointments
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
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
          <div className="appointments-list">
            {appointments.length === 0 ? (
              <div className="empty-state">
                <p>No appointments found</p>
              </div>
            ) : (
              appointments.map((appt) => (
                <div key={appt.id} className="appointment-card">
                  <div className="appointment-header">
                    <div className="patient-info">
                      <div
                        className="patient-avatar"
                        style={{
                          backgroundColor: '#0CB8B6',
                          color: '#1D1F27',
                        }}
                      >
                        {appt.patient.name.charAt(0)}
                      </div>
                      <div className="patient-details">
                        <h3>{appt.patient.name}</h3>
                        <p>{appt.patient.phone}</p>
                      </div>
                    </div>
                    <div className="appointment-meta">
                      {getStatusBadge(appt.status)}
                      {getTypeBadge(appt.type)}
                    </div>
                  </div>
                  
                  <div className="appointment-body">
                    <div className="appointment-date">
                      <h4>
                        {dayjs(appt.date).format('dddd, MMMM D, YYYY')}
                      </h4>
                      <p>{appt.time}</p>
                      <p>Created {dayjs(appt.createdAt).fromNow()}</p>
                    </div>
                    
                    <div className="appointment-details">
                      <p><strong>Reason:</strong> {appt.reason || 'Not specified'}</p>
                      {appt.type === 'video' && appt.meetingLink && (
                        <a
                          href={appt.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="meeting-link"
                        >
                          Join Meeting
                        </a>
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
                {[5, 10, 20, 50].map((size) => (
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
        .appointments-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          background-color: #1D1F27;
          color: #DDDFDE;
          min-height: 100vh;
        }
        
        .appointments-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #0CB8B6;
        }
        
        .appointments-header h1 {
          color: #0CB8B6;
          margin: 0;
          font-size: 1.8rem;
        }
        
        .filters {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        .search-input {
          display: flex;
          align-items: center;
          background-color: #1D1F27;
          border: 1px solid #0CB8B6;
          border-radius: 4px;
          padding: 0 10px;
        }
        
        .search-input input {
          background: transparent;
          border: none;
          color: #DDDFDE;
          padding: 8px;
          min-width: 200px;
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
        
        .appointments-list {
          display: grid;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .appointment-card {
          background-color: #1D1F27;
          border: 1px solid #0CB8B6;
          border-radius: 8px;
          padding: 15px;
          transition: all 0.3s ease;
        }
        
        .appointment-card:hover {
          border-color: #CE592C;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(12, 184, 182, 0.1);
        }
        
        .appointment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          border-bottom: 1px solid #0CB8B6;
          padding-bottom: 10px;
        }
        
        .patient-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .patient-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
        }
        
        .patient-details h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #DDDFDE;
        }
        
        .patient-details p {
          margin: 0;
          color: #0CB8B6;
          font-size: 0.9rem;
        }
        
        .appointment-meta {
          display: flex;
          gap: 8px;
        }
        
        .status-badge,
        .type-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: bold;
          color: #1D1F27;
        }
        
        .appointment-body {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }
        
        .appointment-date h4 {
          margin: 0 0 5px 0;
          font-size: 1rem;
          color: #DDDFDE;
        }
        
        .appointment-date p {
          margin: 0;
          color: #0CB8B6;
          font-size: 0.9rem;
        }
        
        .appointment-details {
          text-align: right;
        }
        
        .appointment-details p {
          margin: 0 0 10px 0;
          color: #DDDFDE;
        }
        
        .meeting-link {
          background-color: #CE592C;
          color: #DDDFDE;
          padding: 6px 12px;
          border-radius: 4px;
          text-decoration: none;
          font-size: 0.9rem;
          display: inline-block;
        }
        
        .meeting-link:hover {
          background-color: #a04523;
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
        
        .empty-state {
          text-align: center;
          padding: 40px;
          color: #DDDFDE;
          font-size: 1.1rem;
        }
        
        @media (max-width: 768px) {
          .appointments-header {
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
          
          .appointment-body {
            flex-direction: column;
            gap: 10px;
          }
          
          .appointment-details {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
}