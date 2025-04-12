// components/DoctorProfile.jsx
export default function DoctorProfile({ doctor }) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <img 
            src={doctor.user.profilePicture || '/default-avatar.png'} 
            alt="صورة الطبيب"
            className="w-20 h-20 rounded-full"
          />
          <div className="ml-4">
            <h1 className="text-2xl font-bold">{doctor.user.name}</h1>
            <p className="text-gray-600">{doctor.specialty.name}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <p><span className="font-semibold">البريد الإلكتروني:</span> {doctor.user.email}</p>
          <p><span className="font-semibold">الهاتف:</span> {doctor.user.phone}</p>
          <p><span className="font-semibold">العنوان:</span> {doctor.user.address}</p>
        </div>
      </div>
    );
  }