// src/app/dashboard/doctors/DoctorCard.js
import Image from 'next/image';

export default function DoctorCard({ doctor, onEdit, onDelete }) {
  // استخلاص بيانات الطبيب
  const { user, specialty, details, availability } = doctor;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
      {/* رأس البطاقة مع صورة الطبيب */}
      <div className="bg-[#0CB8B6] p-4 text-center">
        <div className="relative w-24 h-24 mx-auto mb-2 rounded-full overflow-hidden border-4 border-white">
          {user.profilePicture ? (
            <Image
              src={user.profilePicture}
              alt={user.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-[#1D1F27] text-xl font-bold">
              {user.name?.charAt(0)}
            </div>
          )}
        </div>
        <h3 className="text-lg font-bold text-white">{user.name}</h3>
        <p className="text-white opacity-80">{specialty}</p>
      </div>
      
      {/* تفاصيل الطبيب */}
      <div className="p-4">
        <div className="mb-4 space-y-2">
          <div className="flex items-center text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#CE592C] ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-[#1D1F27] truncate" dir="ltr">{user.email}</span>
          </div>
          
          {user.phone && (
            <div className="flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#CE592C] ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-[#1D1F27]" dir="ltr">{user.phone}</span>
            </div>
          )}
        </div>
        
        {details && (
          <div className="mb-3">
            <h4 className="text-sm font-medium text-[#1D1F27] mb-1">نبذة:</h4>
            <p className="text-gray-600 text-sm line-clamp-2">
              {details}
            </p>
          </div>
        )}
        
        {availability && availability.length > 0 && (
          <div className="mb-1">
            <h4 className="text-sm font-medium text-[#1D1F27] mb-1">أوقات العمل:</h4>
            <div className="text-sm text-gray-600">
              {availability.slice(0, 2).map((slot, index) => (
                <div key={index} className="flex justify-between mb-1">
                  <span>{slot.day}:</span>
                  <span dir="ltr">{slot.from} - {slot.to}</span>
                </div>
              ))}
              {availability.length > 2 && (
                <div className="text-[#0CB8B6] text-xs mt-1">+{availability.length - 2} أيام أخرى</div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* أزرار الإجراءات */}
      <div className="border-t border-gray-100 p-3 flex justify-between">
        <button
          onClick={onEdit}
          className="bg-[#0CB8B6] hover:bg-[#0a9e9c] text-white px-3 py-1 rounded text-sm transition"
        >
          تعديل
        </button>
        <button
          onClick={onDelete}
          className="bg-[#CE592C] hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
        >
          حذف
        </button>
      </div>
    </div>
  );
}