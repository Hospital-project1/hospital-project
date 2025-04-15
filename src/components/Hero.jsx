"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          className="h-full w-full object-cover"
        >
          <source src="https://videos.pexels.com/video-files/8460012/8460012-hd_1920_1080_24fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#1D1F27]/80 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-end px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className={`transition-all duration-1000 text-right ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-[#DDDFDE]">THE </span>
            <span className="text-[#0CB8B6]">RIGHT</span>
          </h1>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#DDDFDE]">
            PEDIATRICIAN
          </h2>
          
          <p className="text-[#DDDFDE] max-w-lg mb-8 text-lg ml-auto">
            We are always fully focused on helping your child and you to overcome any hurdle, 
            whether it's chicken pox or just a seasonal flue.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 mb-12 justify-end">
            <div className="flex items-center">
              <div>
                <h3 className="font-bold text-[#0CB8B6]">HEALTHY ADVICES</h3>
                <p className="text-[#DDDFDE]">Expert guidance for your family's health</p>
              </div>
              <div className="bg-[#0CB8B6] rounded-full p-3 ml-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex items-center">
              <div>
                <h3 className="font-bold text-[#0CB8B6]">ALWAYS AVAILABLE</h3>
                <p className="text-[#DDDFDE]">24/7 care when you need it most</p>
              </div>
              <div className="bg-[#0CB8B6] rounded-full p-3 ml-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <Link 
            href="/appointment"
            className="bg-[#CE592C] hover:bg-[#CE592C]/90 text-white font-bold py-3 px-8 rounded-md inline-block transition-all"
          >
            Book an Appointment
          </Link>
        </div>
      </div>
      
    </div>
  );
};

export default HeroSection;