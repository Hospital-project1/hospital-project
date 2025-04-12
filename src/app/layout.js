// app/layout.js (Server Component)
import "./globals.css";
import ClientLayout from './ClientLayout';

export const metadata = {
  title: "Hospital Management System",
  description: "Hospital appointment management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}