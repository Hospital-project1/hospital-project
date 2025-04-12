// components/AppointmentsCalendar.jsx
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function AppointmentsCalendar({ appointments }) {
  const events = appointments.map(appointment => ({
    title: `موعد مع ${appointment.patient.user.name}`,
    start: new Date(appointment.appointmentDate),
    end: new Date(appointment.appointmentDate),
    status: appointment.status,
  }));

  const eventStyleGetter = (event) => {
    const backgroundColor = event.status === 'confirmed' ? '#3B82F6' : '#F59E0B';
    return { style: { backgroundColor } };
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
        culture="ar"
        messages={{
          today: 'اليوم',
          previous: 'السابق',
          next: 'التالي',
          month: 'شهر',
          week: 'أسبوع',
          day: 'يوم',
        }}
      />
    </div>
  );
}