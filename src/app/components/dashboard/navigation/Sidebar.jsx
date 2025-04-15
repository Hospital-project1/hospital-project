"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  CreditCardIcon,
  UserPlusIcon,
  ClipboardIcon,
  ChartBarIcon,
  MessageSquareIcon,
  Menu,
  X,
  LogOut
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: HomeIcon },
    { name: "Patients", href: "/admin/dashboard/patients", icon: UsersIcon },
    { name: "Doctors", href: "/admin/dashboard/doctors", icon: UserPlusIcon },
    {
      name: "Appointments",
      href: "/admin/dashboard/appointments",
      icon: CalendarIcon,
    },
    // { name: 'Schedules', href: '/admin/dashboard/schedules', icon: ClipboardIcon },
    { name: "Billing", href: "/admin/dashboard/billing", icon: CreditCardIcon },
    // { name: 'Analytics', href: '/admin/dashboard/analytics', icon: ChartBarIcon },
    // { name: 'Feedback', href: '/admin/dashboard/feedback', icon: MessageSquareIcon },
    {
      name: "Contact",
      href: "/admin/dashboard/contact",
      icon: MessageSquareIcon,
    },
  ];

  const handleLogout = () => {
    // You can add any logout logic here if needed in the future
    // For example: clearing localStorage, cookies, etc.
    router.push('/');
  };

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } bg-gray-50 text-gray-700 transition-all duration-300 border-r border-gray-200 h-screen sticky top-0 flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <h1 className="text-xl font-bold text-teal-500">Hospital Admin</h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-gray-200 text-gray-700"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <nav className="p-2 space-y-1 flex-grow">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center ${
                collapsed ? "justify-center" : "justify-start"
              } p-2.5 rounded-md transition-colors ${
                isActive
                  ? "bg-teal-100 text-teal-600"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout button at the bottom */}
      <div className="p-2 border-t border-gray-200 mt-auto">
        <button 
          onClick={handleLogout}
          className={`w-full flex items-center ${
            collapsed ? "justify-center" : "justify-start"
          } p-2.5 rounded-md transition-colors text-gray-700 hover:bg-red-100 hover:text-red-600`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </aside>
  );
}