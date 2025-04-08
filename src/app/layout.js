import { Inter } from 'next/font/google';
import './globals.css';
import ToastProvider from './ToastProvider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: "Hospital Management System",
  description: "Hospital appointment management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}