"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Top Navbar Component
export const TopNavbar = () => {
    return (
      <div className="w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto flex flex-wrap justify-between items-center py-3 px-4 md:px-6 relative">
          <div className="flex items-center md:left-40">
            <Link href="/">
              <Image 
                src="/logo.png" 
                alt="Medicare Jordan Logo" 
                width={140} 
                height={45} 
                className="mr-2"
              />
            </Link>
          </div>
          
          <div className="flex flex-wrap justify-end items-center gap-6 md:gap-10">
            <div className="flex items-center gap-2">
              <div className="rounded-full p-2.5 bg-[#DDDFDE]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0CB8B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Sunday - Thursday 08:00-19:00</p>
                <p className="text-gray-600 text-sm">Friday and Saturday - 09:00-14:00</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="rounded-full p-2.5 bg-[#DDDFDE]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0CB8B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div>
                <p className="font-medium">+962 6 560 7811</p>
                <p className="text-gray-600 text-sm">Office@MedicareJordan.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="rounded-full p-2.5 bg-[#DDDFDE]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0CB8B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div>
                <p className="font-medium">7th Circle</p>
                <p className="text-gray-600 text-sm">Amman, Jordan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

// Main Navbar Component
export const MainNavbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="container mx-auto flex justify-center items-center py-3 px-4 md:px-6">
        <div className="flex space-x-4 md:space-x-6 lg:space-x-8 mx-auto">
          <Link href="/" className="text-[#1D1F27] hover:text-[#0CB8B6] font-medium text-sm md:text-base">
            HOME
          </Link>
          <Link href="/about-us" className="text-[#1D1F27] hover:text-[#0CB8B6] font-medium text-sm md:text-base">
            ABOUT US
          </Link>
          <Link href="/contact-us" className="text-[#1D1F27] hover:text-[#0CB8B6] font-medium text-sm md:text-base">
            CONTACT US
          </Link>
          <Link href="/departments" className="text-[#1D1F27] hover:text-[#0CB8B6] font-medium text-sm md:text-base">
            DEPARTMENTS
          </Link>
          <Link href="/special-offers" className="text-[#1D1F27] hover:text-[#0CB8B6] font-medium text-sm md:text-base">
            SPECIAL OFFERS
          </Link>
          <Link href="/blog" className="text-[#1D1F27] hover:text-[#0CB8B6] font-medium text-sm md:text-base">
            BLOG / NEWS
          </Link>
        </div>
        
        <div className="flex items-center gap-3 absolute right-4 md:right-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-1.5 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0CB8B6] focus:border-transparent text-sm w-36 md:w-48 lg:w-56"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0CB8B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
          
          <Link href="/profile" className="rounded-full p-2.5 bg-[#DDDFDE] hover:bg-[#0CB8B6] transition-colors duration-300 group">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0CB8B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
};

// Combined Navbar Component
export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <TopNavbar />
      <MainNavbar />
    </header>
  );
};

export default Navbar;