// components/dashboard/charts/RevenueChart.jsx
"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data - this would come from your API in a real application
const data = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
  { name: 'Jul', revenue: 3490 },
  { name: 'Aug', revenue: 4000 },
  { name: 'Sep', revenue: 4500 },
  { name: 'Oct', revenue: 5200 },
  { name: 'Nov', revenue: 4800 },
  { name: 'Dec', revenue: 6000 },
];

export default function RevenueChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#DDDFDE20" />
          <XAxis 
            dataKey="name" 
            stroke="#DDDFDE80" 
            tick={{ fill: '#DDDFDE80' }} 
          />
          <YAxis 
            stroke="#DDDFDE80" 
            tick={{ fill: '#DDDFDE80' }} 
            tickFormatter={(value) => `$${value}`} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1D1F27', 
              borderColor: '#DDDFDE20',
              color: '#DDDFDE' 
            }} 
            formatter={(value) => [`$${value}`, 'Revenue']}
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#0CB8B6" 
            strokeWidth={2} 
            dot={{ fill: '#0CB8B6', r: 4 }} 
            activeDot={{ r: 8, fill: '#0CB8B6' }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}