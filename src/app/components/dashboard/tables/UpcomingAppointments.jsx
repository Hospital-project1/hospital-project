// components/dashboard/tables/UpcomingAppointments.jsx
import { format } from 'date-fns';

// Sample data - would come from your API in a real application
const appointments = [
  { 
    id: 1, 
    patientName: 'Jane Cooper', 
    doctorName: 'Dr. Smith', 
    time: new Date(2025, 3, 9, 10, 30), 
    status: 'Confirmed' 
  },
  { 
    id: 2, 
    patientName: 'Robert Fox', 
    doctorName: 'Dr. Johnson', 
    time: new Date(2025, 3, 9, 13, 0), 
    status: 'Pending' 
  },
  { 
    id: 3, 
    patientName: 'Esther Howard', 
    doctorName: 'Dr. Williams', 
    time: new Date(2025, 3, 10, 9, 0), 
    status: 'Confirmed' 
  },
];

export default function UpcomingAppointments() {
  return (
    <div className="space-y-3">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="flex flex-col p-3 rounded-md bg-[#DDDFDE]/5">
          <div className="flex justify-between items-start">
            <p className="font-medium text-[#DDDFDE]">{appointment.patientName}</p>
            <span 
              className={`text-xs px-2 py-1 rounded-full ${
                appointment.status === 'Confirmed' 
                  ? 'bg-[#0CB8B6]/20 text-[#0CB8B6]' 
                  : 'bg-[#CE592C]/20 text-[#CE592C]'
              }`}
            >
              {appointment.status}
            </span>
          </div>
          <p className="text-sm text-[#DDDFDE]/70">{appointment.doctorName}</p>
          <p className="text-sm text-[#DDDFDE]/70 mt-2">
            {format(appointment.time, 'MMM dd, yyyy')} at {format(appointment.time, 'h:mm a')}
          </p>
        </div>
      ))}
    </div>
  );
}