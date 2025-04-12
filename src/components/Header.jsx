// components/Header.jsx
"use client";

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function Header() {
  const [doctorName, setDoctorName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDoctorName(decoded.name); // تأكد إن المفتاح الصحيح هو "name"
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, []);

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3">
            <span className="text-sm text-gray-600">
              Dr. {doctorName || "Loading..."}
            </span>
          </div>
          <button className="rounded-full h-8 w-8 bg-gray-200 flex items-center justify-center">
            <span className="sr-only">Open user menu</span>
            <div className="h-7 w-7 rounded-full bg-gray-300"></div>
          </button>
        </div>
      </div>
    </header>
  );
}
