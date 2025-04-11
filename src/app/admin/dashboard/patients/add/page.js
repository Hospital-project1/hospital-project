// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function AddPatientPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     phone: '',
//     address: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       setLoading(true);
//       setError('');
      
//       // Add role field to form data
//       const patientData = {
//         ...formData,
//         role: 'patient' // Set role to patient
//       };
      
//       const response = await fetch('/api/patients', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(patientData),
//       });
      
//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to add patient');
//       }
      
//       // Redirect to patients page on success
//       router.push('/admin/dashboard/patients');
//       router.refresh();
      
//     } catch (err) {
//       console.error('Error adding patient:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-[#DDDFDE]">Add New Patient</h1>
//         <Link 
//           href="/admin/dashboard/patients" 
//           className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
//         >
//           Back to Patients
//         </Link>
//       </div>
      
//       <div className="bg-[#DDDFDE]/10 rounded-lg p-6">
//         {error && (
//           <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-500">
//             {error}
//           </div>
//         )}
        
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="mb-4">
//               <label htmlFor="name" className="block text-sm font-medium text-[#DDDFDE] mb-1">
//                 Full Name*
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-3 py-2 bg-gray-700 text-[#DDDFDE] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0CB8B6]"
//               />
//             </div>
            
//             <div className="mb-4">
//               <label htmlFor="email" className="block text-sm font-medium text-[#DDDFDE] mb-1">
//                 Email Address*
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-3 py-2 bg-gray-700 text-[#DDDFDE] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0CB8B6]"
//               />
//             </div>
            
//             <div className="mb-4">
//               <label htmlFor="password" className="block text-sm font-medium text-[#DDDFDE] mb-1">
//                 Password*
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-3 py-2 bg-gray-700 text-[#DDDFDE] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0CB8B6]"
//               />
//             </div>
            
//             <div className="mb-4">
//               <label htmlFor="phone" className="block text-sm font-medium text-[#DDDFDE] mb-1">
//                 Phone Number
//               </label>
//               <input
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 bg-gray-700 text-[#DDDFDE] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0CB8B6]"
//               />
//             </div>
            
//             <div className="mb-4 md:col-span-2">
//               <label htmlFor="address" className="block text-sm font-medium text-[#DDDFDE] mb-1">
//                 Address
//               </label>
//               <textarea
//                 id="address"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 rows="3"
//                 className="w-full px-3 py-2 bg-gray-700 text-[#DDDFDE] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0CB8B6]"
//               ></textarea>
//             </div>
//           </div>
          
//           <div className="mt-6">
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-6 py-2 bg-[#0CB8B6] text-white rounded-md hover:bg-[#0CB8B6]/90 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Adding Patient...' : 'Add Patient'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function AddPatientPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      // Add role field to form data and set isDeleted to false explicitly
      const patientData = {
        ...formData,
        role: 'patient', // Set role to patient
        isDeleted: false // Explicitly set isDeleted to false
      };
      
      // Using Axios instead of fetch
      const response = await axios.post('/api/patients', patientData);
      
      // Redirect to patients page on success
      router.push('/admin/dashboard/patients');
      router.refresh();
      
    } catch (err) {
      console.error('Error adding patient:', err);
      // Get the error message from the Axios error response
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add patient';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#DDDFDE]">Add New Patient</h1>
        <Link 
          href="/admin/dashboard/patients" 
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Back to Patients
        </Link>
      </div>
      
      <div className="bg-[#DDDFDE]/10 rounded-lg p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-500">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-[#DDDFDE] mb-1">
                Full Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 text-[#DDDFDE] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0CB8B6]"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-[#DDDFDE] mb-1">
                Email Address*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 text-[#DDDFDE] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0CB8B6]"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-[#DDDFDE] mb-1">
                Password*
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                className="w-full px-3 py-2 bg-gray-700 text-[#DDDFDE] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0CB8B6]"
              />
              <p className="text-xs text-gray-400 mt-1">Password must be at least 6 characters</p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-[#DDDFDE] mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +966 500000000"
                className="w-full px-3 py-2 bg-gray-700 text-[#DDDFDE] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0CB8B6]"
              />
            </div>
            
            <div className="mb-4 md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-[#DDDFDE] mb-1">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                placeholder="Enter patient's full address"
                className="w-full px-3 py-2 bg-gray-700 text-[#DDDFDE] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0CB8B6]"
              ></textarea>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#0CB8B6] text-white rounded-md hover:bg-[#0CB8B6]/90 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding Patient...' : 'Add Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}