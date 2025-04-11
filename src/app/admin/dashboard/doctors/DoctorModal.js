// src/app/dashboard/doctors/DoctorModal.js
import { useState, useEffect } from 'react';

export default function DoctorModal({ isOpen, onClose, mode, doctor, onSubmit, onDelete }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    specialty: '',
    details: '',
    profilePicture: '',
    availability: []
  });
  
  const [availabilityInput, setAvailabilityInput] = useState({
    day: '',
    from: '',
    to: ''
  });
  
  const [errors, setErrors] = useState({});
  
  const specialties = ["Orthopedist", "	Internist", "Dermatologist" ,"ENT Doctor" ,"doctor"];
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // Update data when selected doctor changes
  useEffect(() => {
    if (doctor && (mode === 'edit' || mode === 'delete')) {
      setFormData({
        name: doctor.user.name || '',
        email: doctor.user.email || '',
        password: '', // Password only needed for adding
        phone: doctor.user.phone || '',
        address: doctor.user.address || '',
        specialty: doctor.specialty || '',
        details: doctor.details || '',
        profilePicture: doctor.user.profilePicture || '',
        availability: doctor.availability || []
      });
    } else {
      // Reset form for adding
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        specialty: '',
        details: '',
        profilePicture: '',
        availability: []
      });
    }
    
    // Reset errors
    setErrors({});
  }, [doctor, mode]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleAvailabilityChange = (e) => {
    const { name, value } = e.target;
    setAvailabilityInput(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const addAvailability = () => {
    // Verify time input data
    if (!availabilityInput.day || !availabilityInput.from || !availabilityInput.to) {
      return;
    }
    
    // Add new working time
    setFormData(prev => ({
      ...prev,
      availability: [
        ...prev.availability,
        { ...availabilityInput }
      ]
    }));
    
    // Reset input fields
    setAvailabilityInput({
      day: '',
      from: '',
      to: ''
    });
  };
  
  const removeAvailability = (index) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index)
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Check required fields
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (mode === 'add' && !formData.password) newErrors.password = 'Password is required for new doctors';
    if (!formData.specialty) newErrors.specialty = 'Specialty is required';
    
    // Validate email format
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // If we're editing and password is empty, don't send it
    const dataToSubmit = { ...formData };
    if (mode === 'edit' && !dataToSubmit.password) {
      delete dataToSubmit.password;
    }
    
    onSubmit(dataToSubmit, mode === 'edit');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-[#1D1F27] rounded-lg shadow-xl w-full max-w-3xl max-h-screen overflow-y-auto text-[#DDDFDE]" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">
              {mode === 'add' && 'Add New Doctor'}
              {mode === 'edit' && 'Edit Doctor'}
              {mode === 'delete' && 'Delete Doctor'}
            </h2>
            <button 
              onClick={onClose}
              className="text-[#DDDFDE]/70 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Add/Edit Form */}
          {(mode === 'add' || mode === 'edit') && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-md font-medium mb-4 text-white pb-2 border-b border-[#DDDFDE]/20">Basic Information</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-1">Full Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full p-2 bg-[#1D1F27]/50 border rounded text-white ${errors.name ? 'border-red-500' : 'border-[#DDDFDE]/30'}`}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-1">Email Address*</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full p-2 bg-[#1D1F27]/50 border rounded text-white ${errors.email ? 'border-red-500' : 'border-[#DDDFDE]/30'}`}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-1">
                      {mode === 'edit' ? 'Password (Leave empty to keep current)' : 'Password*'}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full p-2 bg-[#1D1F27]/50 border rounded text-white ${errors.password ? 'border-red-500' : 'border-[#DDDFDE]/30'}`}
                    />
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-2 bg-[#1D1F27]/50 border border-[#DDDFDE]/30 rounded text-white"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full p-2 bg-[#1D1F27]/50 border border-[#DDDFDE]/30 rounded text-white"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-1">Profile Picture URL</label>
                    <input
                      type="text"
                      name="profilePicture"
                      value={formData.profilePicture}
                      onChange={handleChange}
                      className="w-full p-2 bg-[#1D1F27]/50 border border-[#DDDFDE]/30 rounded text-white"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                
                {/* Doctor Information */}
                <div>
                  <h3 className="text-md font-medium mb-4 text-white pb-2 border-b border-[#DDDFDE]/20">Doctor Information</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-1">Specialty*</label>
                    <select
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      className={`w-full p-2 bg-[#1D1F27]/50 border rounded text-white ${errors.specialty ? 'border-red-500' : 'border-[#DDDFDE]/30'}`}
                    >
                      <option value="">Select Specialty</option>
                      {specialties.map(specialty => (
                        <option key={specialty} value={specialty}>
                          {specialty}
                        </option>
                      ))}
                    </select>
                    {errors.specialty && <p className="text-red-400 text-xs mt-1">{errors.specialty}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-1">Doctor Bio</label>
                    <textarea
                      name="details"
                      value={formData.details}
                      onChange={handleChange}
                      rows="3"
                      className="w-full p-2 bg-[#1D1F27]/50 border border-[#DDDFDE]/30 rounded text-white"
                    ></textarea>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-1">Working Hours</label>
                    
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <select
                        name="day"
                        value={availabilityInput.day}
                        onChange={handleAvailabilityChange}
                        className="p-2 bg-[#1D1F27]/50 border border-[#DDDFDE]/30 rounded text-sm text-white"
                      >
                        <option value="">Day</option>
                        {daysOfWeek.map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                      
                      <input
                        type="time"
                        name="from"
                        value={availabilityInput.from}
                        onChange={handleAvailabilityChange}
                        className="p-2 bg-[#1D1F27]/50 border border-[#DDDFDE]/30 rounded text-sm text-white"
                        placeholder="From"
                      />
                      
                      <input
                        type="time"
                        name="to"
                        value={availabilityInput.to}
                        onChange={handleAvailabilityChange}
                        className="p-2 bg-[#1D1F27]/50 border border-[#DDDFDE]/30 rounded text-sm text-white"
                        placeholder="To"
                      />
                    </div>
                    
                    <button
                      type="button"
                      onClick={addAvailability}
                      className="bg-[#0CB8B6] text-white px-2 py-1 rounded text-sm hover:bg-[#0CB8B6]/90"
                    >
                      Add Time Slot
                    </button>
                    
                    {/* Display added working hours */}
                    {formData.availability.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <h4 className="text-sm font-medium text-white">Added Working Hours:</h4>
                        <div className="max-h-36 overflow-y-auto">
                          {formData.availability.map((slot, index) => (
                            <div 
                              key={index} 
                              className="flex justify-between items-center bg-[#1D1F27]/70 border border-[#DDDFDE]/10 p-2 rounded mb-1 text-sm"
                            >
                              <span>
                                {slot.day}: {slot.from} - {slot.to}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeAvailability(index)}
                                className="text-[#CE592C] hover:text-red-400"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-[#DDDFDE]/10 hover:bg-[#DDDFDE]/20 text-white px-4 py-2 rounded transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0CB8B6] hover:bg-[#0CB8B6]/90 text-white px-4 py-2 rounded transition"
                >
                  {mode === 'add' ? 'Add Doctor' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
          
          {/* Delete confirmation */}
          {mode === 'delete' && doctor && (
            <div className="text-center py-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#CE592C] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              
              <p className="text-lg mb-6 text-white">
                Are you sure you want to delete <span className="font-bold">{doctor.user.name}</span>?
              </p>
              
              <p className="text-sm text-[#DDDFDE]/70 mb-6">
                All data related to this doctor will be permanently deleted. This action cannot be undone.
              </p>
              
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-[#DDDFDE]/10 hover:bg-[#DDDFDE]/20 text-white px-4 py-2 rounded transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  className="bg-[#CE592C] hover:bg-[#CE592C]/90 text-white px-4 py-2 rounded transition"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}