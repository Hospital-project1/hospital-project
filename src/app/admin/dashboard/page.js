"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Users,
  UserPlus,
  Calendar,
  DollarSign,
} from "lucide-react";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function AnalyticsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("/api/analytics")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!data)
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">
            Loading analytics data...
          </p>
        </div>
      </div>
    );

  // تجهيز بيانات الرسم
  const specialtyData = Object.entries(data.specialtyCounts).map(
    ([name, value]) => ({ name, value })
  );

  const summaryData = [
    { name: "Users", value: data.userCount },
    { name: "Doctors", value: data.doctorCount },
    { name: "Appointments", value: data.appointmentCount },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Analytics Dashboard
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={data.userCount}
            icon={<Users className="text-indigo-500" size={24} />}
          />
          <StatCard
            title="Total Doctors"
            value={data.doctorCount}
            icon={<UserPlus className="text-emerald-500" size={24} />}
          />
          <StatCard
            title="Appointments"
            value={data.appointmentCount}
            icon={<Calendar className="text-amber-500" size={24} />}
          />
          <StatCard
            title="Revenue"
            value={`jD ${data.totalRevenue}`}
            icon={<DollarSign className="text-rose-500" size={24} />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
              <TrendingUp className="text-indigo-500" size={20} />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={summaryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  stroke="#6b7280"
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  stroke="#6b7280"
                />
                <ReTooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    color: "#374151",
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                  {summaryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Doctor Specialties
              </h2>
              <div className="text-xs text-gray-700 font-medium bg-gray-100 px-2 py-1 rounded">
                {specialtyData.length} Specialties
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={specialtyData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {specialtyData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  wrapperStyle={{ color: "#374151" }}
                />
                <ReTooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    color: "#374151",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          {icon}
        </div>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {trend && (
            <div className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center">
              {trend}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}