export default function AppointmentsCard({ appointments }) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
        
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{appointment.patientName}</h3>
                  <p className="text-gray-600 text-sm">{appointment.reason}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{appointment.date}</p>
                  <p className="text-gray-600 text-sm">{appointment.time}</p>
                </div>
              </div>
              <div className="mt-2 flex space-x-2">
                <button className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Complete</button>
                <button className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Reschedule</button>
                <button className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">Cancel</button>
              </div>
            </div>
          ))}
        </div>
        
        <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          View All Appointments
        </button>
      </div>
    );
  }