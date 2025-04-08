// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// import { Inter } from 'next/font/google';
import './globals.css';
import ToastProvider from './ToastProvider';

// const inter = Inter({ 
//   subsets: ['latin'],
//   variable: '--font-inter',
// });

export const metadata = {
  title: "Hospital Management System",
  description: "Hospital appointment management system",
};

export default function MainLayout({ children }) {
  return (
    <html lang="en">
      <body >
        <Navbar />
        <main className="flex-grow container mx-auto">
          {children}
        </main>
         <ToastProvider />
        <Footer />

      </body>
    </html>
  );
}