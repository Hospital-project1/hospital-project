// components/dashboard/ui/MetricCard.jsx
import { Users, Calendar, DollarSign, MessageSquare } from "lucide-react";

const iconComponents = {
  patients: Users,
  appointments: Calendar,
  revenue: DollarSign,
  feedback: MessageSquare,
};

export default function DashboardMetricCard({
  title,
  value,
  trend = " ", // قيمة افتراضية
  icon,
  accentColor,
}) {
  const IconComponent = iconComponents[icon] || Users;

  return (
    <div className="bg-[#DDDFDE]/10 rounded-lg p-4 border border-[#DDDFDE]/5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#DDDFDE]/70">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-[#DDDFDE]">{value}</h3>
        </div>
        <div
          className="p-2 rounded-md"
          style={{ backgroundColor: `${accentColor}20` }}
        >
          <IconComponent className="w-6 h-6" style={{ color: accentColor }} />
        </div>
      </div>

      {/* عرض trend فقط إذا كانت موجودة */}
      {trend && (
        <p className="mt-2 text-xs">
          <span
            className="font-medium"
            style={{ color: trend.startsWith("+") ? "#0CB8B6" : "#CE592C" }}
          >
            {trend}
          </span>
          {/* <span className="text-[#DDDFDE]/70 ml-1">since last month</span> */}
        </p>
      )}
    </div>
  );
}
