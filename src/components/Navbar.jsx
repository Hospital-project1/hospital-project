"use client"

import React, { useContext, useState } from 'react';
import { useRouter } from "next/navigation";
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { AuthContext } from '@/app/context/AuthContext'; 

export const MainNavbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, setUser, loading } = useContext(AuthContext); 
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {});
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMobileMenu = (e) => {
    e.stopPropagation();
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      setSearchOpen(false);
    }
  };

  const toggleSearch = (e) => {
    e.stopPropagation();
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setMobileMenuOpen(false);
    }
  };

  if (loading) {
    return (
      <nav className="w-full bg-white border-b border-gray-200">
        <div className="container mx-auto flex justify-center items-center py-3 px-4">
          <div className="animate-pulse h-8 w-32 bg-gray-200 rounded"></div>
        </div>
      </nav>
    );
  }

  const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/about-us", label: "ABOUT US" },
    { href: "/contact", label: "CONTACT US" },
    { href: "/special-offers", label: "SPECIAL OFFERS" },
    { href: "/blog", label: "BLOG / NEWS" }
  ];

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 relative">
        {/* Top row - Logo and mobile buttons */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image 
                src="/logo.png" 
                alt="Medicare Jordan Logo" 
                width={140} 
                height={45} 
                className="h-auto w-auto max-h-10 md:max-h-12"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-6 lg:space-x-8 mx-auto">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-[#1D1F27] hover:text-[#0CB8B6] font-medium text-sm lg:text-base transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Search & Auth */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-1.5 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0CB8B6] focus:border-transparent text-sm w-48 lg:w-56"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0CB8B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
            
            {user ? (
              <div className="flex items-center gap-2">
                <Link 
                  href="/profile/personal"
                  className="rounded-full p-2.5 bg-[#DDDFDE] hover:bg-[#0CB8B6] transition-colors duration-300 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0CB8B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </Link>
                <button
                  onClick={handleLogout}
                  className="border border-[#0CB8B6] text-[#0CB8B6] hover:bg-[#0CB8B6] hover:text-white font-medium py-2 px-4 rounded-full text-sm transition-colors duration-300 hover: cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link 
                  href="/login" 
                  className="border border-[#0CB8B6] text-[#0CB8B6] hover:bg-[#0CB8B6] hover:text-white font-medium py-2 px-4 rounded-full text-sm transition-colors duration-300"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-[#0CB8B6] hover:bg-[#0aa8a6] text-white font-medium py-2 px-4 rounded-full text-sm transition-colors duration-300"
                >
                  Join Us
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Search Button */}
            <button 
              onClick={toggleSearch}
              className="p-2 text-gray-600 hover:text-[#0CB8B6] focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            {/* Mobile User Menu or Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link 
                  href="/profile/personal"
                  className="rounded-full p-2 bg-[#DDDFDE] hover:bg-[#0CB8B6] transition-colors duration-300 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0CB8B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </Link>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="border border-[#0CB8B6] text-[#0CB8B6] hover:bg-[#0CB8B6] hover:text-white font-medium py-1.5 px-3 rounded-full text-xs transition-colors duration-300"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 hover:text-[#0CB8B6] focus:outline-none"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Expandable) */}
        {searchOpen && (
          <div className="md:hidden mt-3 pb-2 animate-fadeIn">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0CB8B6] focus:border-transparent text-sm w-full"
                autoFocus
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0CB8B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Mobile Navigation Menu (Expandable) */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 border-t border-gray-200 animate-fadeIn">
            <div className="py-2 space-y-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="block py-2 px-3 text-base font-medium text-[#1D1F27] hover:text-[#0CB8B6] hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Join Us and Logout buttons */}
              {!user ? (
                <Link 
                  href="/register" 
                  className="block w-full text-center bg-[#0CB8B6] hover:bg-[#0aa8a6] text-white font-medium py-2 px-4 rounded-full text-sm transition-colors duration-300 mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Join Us
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="block w-full text-center border border-[#0CB8B6] text-[#0CB8B6] hover:bg-[#0CB8B6] hover:text-white font-medium py-2 px-4 rounded-full text-sm transition-colors duration-300 mt-2 hover:cursor-pointer"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <MainNavbar />
    </header>
  );
};

export default Navbar;