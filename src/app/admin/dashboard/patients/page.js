// app/(admin)/dashboard/patients/page.js
import Link from 'next/link';

export default function PatientsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#DDDFDE]">Patient Records</h1>
        <Link 
          href="/dashboard/patients/add" 
          className="px-4 py-2 bg-[#0CB8B6] text-white rounded-md hover:bg-[#0CB8B6]/90 transition-colors"
        >
          Add New Patient
        </Link>
      </div>
      
      {/* Patient list and filter controls would go here */}
      <div className="bg-[#DDDFDE]/10 rounded-lg p-6">
        <p className="text-[#DDDFDE]">Patient records will be displayed here</p>
      </div>
    </div>
  );
}