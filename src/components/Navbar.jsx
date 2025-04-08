"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Main Navbar Component
export const MainNavbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Mock user state - replace with your actual authentication logic
  const [user, setUser] = useState(null); // Set to null when no user, or user object when logged in

  
  const handleLogout = () => {
    setUser(null);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="container mx-auto flex justify-center items-center py-3 px-4 md:px-6">
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
          
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="rounded-full p-2.5 bg-[#DDDFDE] hover:bg-[#0CB8B6] transition-colors duration-300 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0CB8B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link 
                    href="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#0CB8B6] hover:text-white"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#0CB8B6] hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/register" 
              className="bg-[#0CB8B6] hover:bg-[#0aa8a6] text-white font-medium py-2 px-4 rounded-full text-sm transition-colors duration-300"
            >
              Join Us
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

// Combined Navbar Component
export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <MainNavbar />
    </header>
  );
};

export default Navbar;