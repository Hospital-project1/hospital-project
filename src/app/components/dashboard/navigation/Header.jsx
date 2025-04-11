// components/dashboard/navigation/Header.jsx
"use client";
import { useState } from 'react';
import { Bell, Search, User } from 'lucide-react';

export default function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <header className="h-16 border-b border-[#DDDFDE]/10 bg-[#1D1F27] text-[#DDDFDE] flex items-center justify-between px-6">
      {/* <div className="relative w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-[#DDDFDE]/60" />
        </div>
        <input
          type="text"
          className="block w-full py-2 pl-10 pr-3 bg-[#DDDFDE]/10 border border-[#DDDFDE]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0CB8B6]/50 focus:border-[#0CB8B6]"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-[#DDDFDE] rounded-full hover:bg-[#DDDFDE]/10">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#CE592C] rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-[#0CB8B6] flex items-center justify-center">
            <User className="w-5 h-5 text-[#1D1F27]" />
          </div>
          <span className="font-medium text-sm">Admin User</span>
        </div>
      </div> */}
    </header>
  );
}