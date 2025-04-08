// components/dashboard/tables/RecentPatients.jsx
import { format } from 'date-fns';

// Sample data - would come from your API in a real application
const patients = [
  { id: 1, name: 'Jane Cooper', email: 'jane@example.com', phone: '(555) 123-4567', registeredDate: new Date(2023, 2, 15) },
  { id: 2, name: 'Robert Fox', email: 'robert@example.com', phone: '(555) 987-6543', registeredDate: new Date(2023, 3, 10) },
  { id: 3, name: 'Esther Howard', email: 'esther@example.com', phone: '(555) 333-7890', registeredDate: new Date(2023, 4, 5) },
];

export default function RecentPatients() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-[#DDDFDE]/10">
            <th className="px-4 py-3 text-left text-xs font-medium text-[#DDDFDE]/70 uppercase tracking-wider">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#DDDFDE]/70 uppercase tracking-wider">Email</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#DDDFDE]/70 uppercase tracking-wider">Phone</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#DDDFDE]/70 uppercase tracking-wider">Registered Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#DDDFDE]/10">
          {patients.map((patient) => (
            <tr key={patient.id} className="hover:bg-[#DDDFDE]/5">
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#DDDFDE]">{patient.name}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-[#DDDFDE]/80">{patient.email}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-[#DDDFDE]/80">{patient.phone}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-[#DDDFDE]/80">
                {format(patient.registeredDate, 'MMM dd, yyyy')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}