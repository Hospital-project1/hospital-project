'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Overview() {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get logged-in doctor data
        const authRes = await axios.get('/api/auth/me');
        const authData = authRes.data;
        const doctorId = authData?.user?._id;
        console.log(doctorId);
        if (!doctorId) {
          throw new Error('لم يتم العثور على معرف الدكتور');
        }

        const [doctorRes, patientsRes, appointmentsRes] = await Promise.all([
          axios.get(`/api/doctors/${doctorId}/overview`),
          axios.get(`/api/doctors/${doctorId}/patients`),
          axios.get(`/api/doctors/${doctorId}/appointments`)
        ]);

        setDoctorData({
          doctor: doctorRes.data.data.doctor,
          patients: patientsRes.data.data,
          appointments: appointmentsRes.data.data,
          name: authData.user.name
        });
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) return <div className="p-4 text-center">جار التحميل...</div>;
  if (error) return <div className="p-4 text-red-500">خطأ: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">مرحباً دكتور {doctorData?.doctor?.user?.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* بطاقة الطبيب */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">معلوماتي</h2>
          <p>التخصص: {doctorData?.doctor?.specialty?.name}</p>
          <p>البريد: {doctorData?.doctor?.user?.email}</p>
          <p>الهاتف: {doctorData?.doctor?.user?.phone}</p>
        </div>

        {/* الإحصائيات */}
        <div className="lg:col-span-2 grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3>عدد المرضى</h3>
            <p className="text-2xl font-bold">{doctorData?.patients?.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3>المواعيد القادمة</h3>
            <p className="text-2xl font-bold">{doctorData?.appointments?.length}</p>
          </div>
        </div>

        {/* قائمة المرضى */}
        <div className="lg:col-span-3">
          <h2 className="text-xl font-bold mb-4">مرضاي</h2>
          <div className="bg-white p-4 rounded-lg shadow">
            {doctorData?.patients?.map(patient => (
              <div key={patient._id} className="border-b py-2">
                <p>{patient.user.name}</p>
                <p className="text-sm text-gray-500">{patient.user.phone}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
