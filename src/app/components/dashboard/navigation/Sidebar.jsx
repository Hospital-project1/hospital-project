// components/dashboard/navigation/Sidebar.jsx
"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, UsersIcon, CalendarIcon, CreditCardIcon, 
  UserPlusIcon, ClipboardIcon, ChartBarIcon, MessageSquareIcon,
  Menu, X
} from 'lucide-react';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  
  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Patients', href: '/admin/dashboard/patients', icon: UsersIcon },
    { name: 'Doctors', href: '/admin/dashboard/doctors', icon: UserPlusIcon },
    { name: 'Appointments', href: '/admin/dashboard/appointments', icon: CalendarIcon },
    // { name: 'Schedules', href: '/admin/dashboard/schedules', icon: ClipboardIcon },
    { name: 'Billing', href: '/admin/dashboard/billing', icon: CreditCardIcon },
    // { name: 'Analytics', href: '/admin/dashboard/analytics', icon: ChartBarIcon },
    // { name: 'Feedback', href: '/admin/dashboard/feedback', icon: MessageSquareIcon },
    { name: 'contact', href: '/admin/dashboard/contact', icon: MessageSquareIcon },
  ];
  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-[#1D1F27] text-[#DDDFDE] transition-all duration-300 border-r border-[#DDDFDE]/10 h-screen sticky top-0`}>
      <div className="flex items-center justify-between p-4 border-b border-[#DDDFDE]/10">
        {!collapsed && <h1 className="text-xl font-bold text-[#0CB8B6]">Hospital Admin</h1>}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="p-1 rounded-md hover:bg-[#DDDFDE]/10 text-[#DDDFDE]"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>
      
      <nav className="p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} p-2.5 rounded-md transition-colors ${
                isActive 
                  ? 'bg-[#0CB8B6]/20 text-[#0CB8B6]' 
                  : 'text-[#DDDFDE] hover:bg-[#DDDFDE]/10'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}