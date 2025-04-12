// app/(admin)/dashboard/layout.js
import DashboardSidebar from '../../components/dashboard/navigation/Sidebar';
import DashboardHeader from '../../components/dashboard/navigation/Header';
import { Inter } from 'next/font/google';
// import '../../../globals.css';
import '../../../../src/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Hospital Admin Dashboard',
  description: 'Hospital Management System Admin Dashboard',
};

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#1D1F27] text-[#DDDFDE]">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <DashboardHeader /> */}
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}