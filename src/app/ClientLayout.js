// app/ClientLayout.js (Client Component)
'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastProvider from './ToastProvider';
import { AuthProvider } from '@/app/context/AuthContext';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isAdminRoute = pathname.startsWith('/admin');
  const isDoctorOverview = pathname.startsWith('/doctorOverview');
  
  const hideNavbarFooter = isAuthPage || isAdminRoute || isDoctorOverview;

  return (
    <AuthProvider>
      {!hideNavbarFooter && <Navbar />}
      <main className="flex-grow container mx-auto">
        {children}
      </main>
      <ToastProvider />
      {!hideNavbarFooter && <Footer />}
    </AuthProvider>
  );
}