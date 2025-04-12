// pages/doctors/[id].js
import { useRouter } from 'next/router';
import Head from 'next/head';
import doctors from '@/team';

export default function DoctorProfile() {
  const router = useRouter();
  const { id } = router.query;

  const doctor = doctors.find((doc) => doc.id === parseInt(id));

  if (!doctor) return <div className="p-8 text-center">Doctor not found</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>{doctor.name.toUpperCase()} - {doctor.specialization}</title>
        <meta name="description" content={`${doctor.specialization} profile`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-teal-500 w-full">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row">
          {/* صورة الدكتور */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <div className="relative h-96 w-full md:w-96 mx-auto bg-gray-200 rounded-lg shadow-lg">
              <img 
                src={doctor.image || "/api/placeholder/400/500"} 
                alt={doctor.name}
                className="h-full w-full object-cover rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-teal-600 rounded-full p-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* جدول العمل */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">Book a visit with {doctor.name.split(' ')[0]}</h3>
              <h4 className="text-2xl font-bold mb-6">WORKING HOURS</h4>

              {doctor.schedule.map((day) => (
                <div key={day.day} className="flex justify-between items-center border-b border-gray-200 py-4 last:border-none">
                  <div className="font-medium text-gray-700">{day.day.toUpperCase()}</div>
                  <div className="text-gray-600">{day.time}</div>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm hover:bg-orange-600 transition-colors">
                    BOOK
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* معلومات الدكتور */}
          <div className="w-full md:w-2/3 md:pl-8">
            <div className="text-white mb-4">
              <p className="text-xl">{doctor.specialization}</p>
              <h1 className="text-4xl font-bold mt-2">{doctor.name.toUpperCase()}</h1>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <p className="text-gray-700 leading-relaxed">{doctor.description}</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow">
                <p className="text-gray-700 leading-relaxed">
                  {doctor.about}
                </p>
              </div>
              <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow">
                <p className="text-gray-700 leading-relaxed">
                  {doctor.skills}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* التنقل بين الدكاترة */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Our Doctors</h2>
        <div className="flex flex-wrap gap-4">
          {doctors.map((doc) => (
            <button
              key={doc.id}
              onClick={() => router.push(`/doctors/${doc.id}`)}
              className={`px-4 py-2 rounded-md ${
                doc.id === parseInt(id) ? 'bg-teal-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {doc.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
