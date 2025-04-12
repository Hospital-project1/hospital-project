"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/adminappointmenr") // تغيير الـ endpoint إلى /api/appointments
      .then((res) => {
        setSchedules(res.data.data || []); // حفظ البيانات في الحالة
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching schedules", err); // التعامل مع الأخطاء
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-8 max-w-7xl mx-auto text-gray-200">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">
          Appointments Management
        </h1>
        <div className="bg-blue-900 text-blue-200 py-2 px-4 rounded-full text-sm font-medium">
          {schedules.length} Total Appointments
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">Loading appointments...</p>
          </div>
        </div>
      ) : schedules.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No Appointments Found
          </h3>
          <p className="text-gray-400">
            There are currently no scheduled appointments in the system.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Appointment Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Payment Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {schedules.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-700 transition-colors duration-150 ease-in-out"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-200">
                      {item.doctorName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-300">
                      {new Date(item.appointmentDate).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        item.isPaid
                          ? "bg-green-900 text-green-200"
                          : "bg-red-900 text-red-200"
                      }`}
                    >
                      {item.isPaid ? "Paid" : "Not Paid"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
