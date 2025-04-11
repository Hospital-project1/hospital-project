// src/app/dashboard/doctors/DoctorCard.js
import Image from 'next/image';

export default function DoctorCard({ doctor, onEdit, onDelete }) {
  // Extract doctor data
  const { user, specialty, details, availability } = doctor;
  
  return (
    <div className="bg-[#1D1F27]/70 rounded-lg shadow-lg overflow-hidden border border-[#DDDFDE]/10 hover:shadow-xl transition-shadow">
      {/* Card header with doctor image */}
      <div className="bg-[#0CB8B6] p-4 text-center">
        <div className="relative w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden border-4 border-white">
          {user.profilePicture ? (
            <Image
              src={user.profilePicture}
              alt={user.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#DDDFDE] text-[#1D1F27] text-xl font-bold">
              {user.name?.charAt(0)}
            </div>
          )}
        </div>
        <h3 className="text-lg font-bold text-white">{user.name}</h3>
        <p className="text-white opacity-90 text-sm">{specialty}</p>
      </div>
      
      {/* Doctor details */}
      <div className="p-4">
        <div className="mb-3 space-y-2">
          <div className="flex items-center text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#CE592C] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-[#DDDFDE] truncate">{user.email}</span>
          </div>
          
          {user.phone && (
            <div className="flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#CE592C] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-[#DDDFDE]">{user.phone}</span>
            </div>
          )}
        </div>
        
        {details && (
          <div className="mb-3">
            <h4 className="text-sm font-medium text-white mb-1">Bio:</h4>
            <p className="text-[#DDDFDE]/80 text-sm line-clamp-2">
              {details}
            </p>
          </div>
        )}
        
        {availability && availability.length > 0 && (
          <div className="mb-1">
            <h4 className="text-sm font-medium text-white mb-1">Working Hours:</h4>
            <div className="text-sm text-[#DDDFDE]/80 bg-[#1D1F27]/90 p-2 rounded-md border border-[#DDDFDE]/10">
              {availability.slice(0, 2).map((slot, index) => (
                <div key={index} className="flex justify-between mb-1">
                  <span className="font-medium">{slot.day}:</span>
                  <span>{slot.from} - {slot.to}</span>
                </div>
              ))}
              {availability.length > 2 && (
                <div className="text-[#0CB8B6] text-xs mt-1 text-center">+{availability.length - 2} more days</div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="border-t border-[#DDDFDE]/10 p-3 flex justify-end gap-2">
        <button
          onClick={onEdit}
          className="bg-[#0CB8B6] hover:bg-[#0CB8B6]/90 text-white px-3 py-1 rounded text-sm transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
        <button
          onClick={onDelete}
          className="bg-[#CE592C] hover:bg-[#CE592C]/90 text-white px-3 py-1 rounded text-sm transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
}