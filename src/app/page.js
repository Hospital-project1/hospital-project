// pages/index.js
"use client"
import { useState } from 'react';
import Image from 'next/image';
import HeroSection from '@/components/Hero';
import DoctorTeamGrid from "@/components/team"
import LatestNews from "@/components/news"

export default function Home() {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  
  const categories = [
    {
      id: 'pediatrician',
      title: 'PEDIATRICIAN',
      tagline: "For your child's healthy growth",
      description: "Our pediatric specialists provide comprehensive care for children's general health, growth, and development from infancy through adolescence.",
      iconColor: '#20B2AA',
      imagePath: "/pediatrician.jpg", // ضع مسار الصورة الحقيقي هنا
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"></path>
          <path d="M8 4h8"></path>
          <path d="M12 7v5"></path>
          <path d="M8 14h8"></path>
        </svg>
      )
    },
    {
      id: 'pulmonologist',
      title: 'PULMONOLOGIST',
      tagline: "Breathing difficulties?",
      description: "Expert care for childhood respiratory conditions including asthma, allergies, and other lung-related health issues.",
      iconColor: '#20B2AA',
      imagePath: "/pulmonologist.jpg", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.4 19A3.42 3.42 0 0 1 5 15.6c0-1.8 1.5-3.2 3.4-3.2 1.8 0 3.2 1.3 3.4 3"></path>
          <path d="M19 9.3V5.6A2.6 2.6 0 0 0 16.4 3a2.6 2.6 0 0 0-2.6 2.6V9"></path>
          <path d="M19 9.4a3.4 3.4 0 0 1-6.8 0V9"></path>
          <path d="M13 9.4v1.5"></path>
          <path d="M16 9.4v2.1"></path>
          <path d="M16 21v-2"></path>
          <path d="M13 20.7V19"></path>
          <path d="M13 14v-1.5"></path>
          <path d="M19 15v-2"></path>
          <path d="M8.3 15H10"></path>
        </svg>
      )
    },
    {
      id: 'gastroenterologist',
      title: 'GASTROENTEROLOGIST',
      tagline: "Digestive problems?",
      description: "Specialized treatment for children's digestive system disorders, from food intolerances to chronic conditions.",
      iconColor: '#20B2AA',
      imagePath: "/gastroenterologist.jpg", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path>
          <line x1="6" x2="18" y1="17" y2="17"></line>
        </svg>
      )
    },
    {
      id: 'infectious',
      title: 'PEDIATRIC INFECTIOUS DISEASE',
      tagline: "Fever or infections?",
      description: "Dedicated team for diagnosing and treating childhood infections, fevers, and immune system disorders.",
      iconColor: '#20B2AA',
      imagePath: "/infectious.jpg", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 19H5c-1 0-2-1-2-2v-1a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v1c0 1-1 2-2 2h-3"></path>
          <path d="M8 19a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-1z"></path>
          <path d="M12 3c-1.2 0-2.4.6-3 1.7A4 4 0 0 0 12 9a4 4 0 0 0 3-4.3A3 3 0 0 0 12 3"></path>
        </svg>
      )
    }
  ];

  return (
    <>
    <HeroSection/>
    <div className="container mx-auto px-4 py-8 mt-20">
    <h2 className="relative text-3xl font-bold text-center mb-25">
  {/* Decorative underline with gradient colors */}
  <span className="relative inline-block">
    <span className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-[#0CB8B6] via-[#CE592C] to-[#DDDFDE]" ></span>
    Our Departments
  </span>
  
  {/* Decorative elements */}
  <span className="absolute -left-4 -top-4 w-8 h-8 rounded-full bg-[#0CB8B6] opacity-20"></span>
  <span className="absolute -right-4 -bottom-4 w-8 h-8 rounded-full bg-[#CE592C] opacity-20"></span>
</h2>
  
  {/* قسم العيادات وساعات العمل في صف أفقي */}
  <div className="flex flex-col lg:flex-row gap-6">
    {/* أقسام العيادات */}
    <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
      {categories.map((category) => (
        <div 
          key={category.id}
          className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
          onMouseEnter={() => setHoveredCategory(category.id)}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <div className="relative h-40 w-full">
            <Image 
              src={category.imagePath} 
              alt={category.title}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="p-6">
            <div className="flex flex-col items-center mb-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: category.iconColor }}
              >
                <div className="text-white">
                  {category.icon}
                </div>
              </div>
              <p className="text-sm text-center text-gray-600">{category.tagline}</p>
              <h3 className="text-xl font-bold text-center">{category.title}</h3>
            </div>
            <p className="text-gray-600 text-center text-sm">
              {hoveredCategory === category.id ? category.description : ''}
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* ساعات العمل */}
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm w-full lg:w-1/4">
      <h2 className="text-2xl font-bold text-center mb-4">WORKING HOURS</h2>
      <div className="mb-2 text-center text-red-600 font-medium">
        Emergency Department: Open 24/7
      </div>
      <div className="space-y-2">
        {[
          { day: 'Monday', hours: '8:00 AM – 2:30 PM' },
          { day: 'Tuesday', hours: '8:00 AM – 7:00 PM' },
          { day: 'Wednesday', hours: '8:00 AM – 7:00 PM' },
          { day: 'Thursday', hours: '8:00 AM – 7:00 PM' },
          { day: 'Friday', hours: '8:00 AM – 7:00 PM' },
          { day: 'Saturday', hours: 'Closed (Emergency Only)' },
          { day: 'Sunday', hours: 'Closed (Emergency Only)' }
        ].map((schedule) => (
          <div key={schedule.day} className="flex justify-between border-b border-gray-200 py-2">
            <span className="font-medium text-gray-700">{schedule.day}</span>
            <span className="text-gray-600">{schedule.hours}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>


 {/* نبذة بسيطة   */}

 <div className="relative bg-gray-100 mt-20 mb-50">
  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center min-h-screen opacity-20"
    style={{
      backgroundImage: `url("https://images.pexels.com/photos/5998448/pexels-photo-5998448.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")`,
    }}
  ></div>
  
  {/* Content overlay */}
  <div className="relative px-6 py-16 md:py-24 md:px-16 z-10">
    <div className="container mx-auto text-gray-800">
      <h2 className="text-lg text-gray-700 font-medium tracking-wide">Dr. Sara Dweik</h2>
      
      <div className="mt-4 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="text-gray-800">OUR </span>
          <span className="text-teal-500">TEAM</span>
        </h1>
      </div>
      
      <div className="w-full md:w-2/3">
        <p className="text-gray-800 text-base md:text-lg leading-relaxed mb-12 font-medium">
        Dr. Sara Dweik is dedicated to providing her patients with the best possible care. 
          We at MediCare are focused on helping you. After receiving successful care for various 
          aches and pains over the years, Dr. Woshiack found her calling to help others get well.
        </p>
        
        <div className="mt-8 md:mt-12">
          <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 uppercase font-medium transition duration-300">
            Find out more
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<DoctorTeamGrid/>
<LatestNews/>
<iframe 
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108264.69324993144!2d36.07711067579379!3d32.007754103535824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca0113f2c4721%3A0xfc2551f906fd8ec4!2z2KfZhNmF2LPYqti02YHZiSDYp9mE2KrYrti12LXZig!5e0!3m2!1sar!2sjo!4v1744229521129!5m2!1sar!2sjo"
  width="100%"  // جعل العرض 100% من عرض الصفحة
  height="500px"  
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>



    </>
  );
}
  
