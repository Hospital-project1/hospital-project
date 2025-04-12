import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastProvider from './ToastProvider';
import { AuthProvider } from '@/app/context/AuthContext'; 

export const metadata = {
  title: "Hospital Management System",
  description: "Hospital appointment management system",
};

export default function MainLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider> 
          <Navbar /> 
          <main className="flex-grow container mx-auto">
            {children}
          </main>
          <ToastProvider />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}