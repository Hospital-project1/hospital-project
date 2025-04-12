// components/DoctorTeamGrid.jsx
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaLinkedinIn, FaGooglePlusG, FaTooth, FaUserMd, FaPlus } from 'react-icons/fa';
import { MdChildCare } from 'react-icons/md';
import { FaCut } from 'react-icons/fa';

const SocialButton = ({ icon, bgColor = "bg-gray-200", textColor = "text-gray-700", outline = false }) => {
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 
      ${outline ? 'border border-gray-300 hover:bg-gray-100' : bgColor} 
      ${outline ? textColor : 'text-white'} 
      hover:shadow-md cursor-pointer`}>
      {icon}
    </div>
  );
};

const DoctorCard = ({ doctor, onClick }) => {
  const { name, title, description, imageUrl, specialty, socialIcons } = doctor;
  
  // Map specialty to icon
  const getSpecialtyIcon = () => {
    switch (specialty) {
      case 'pediatrician':
        return <MdChildCare size={20} />;
      case 'dental':
        return <FaTooth size={20} />;
      case 'cosmetic':
        return <FaCut size={20} />;
      case 'general':
        return <FaUserMd size={20} />;
      default:
        return <FaUserMd size={20} />;
    }
  };
  
  return (
    <div className="bg-white rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Image container */}
      <div className="relative">
        <Image 
          src={imageUrl || "/api/placeholder/400/320"} 
          alt={`Dr. ${name}`}
          width={400} 
          height={320}
          className="w-full h-64 object-cover"
        />
        
        {/* Social icons overlaid on image */}
        <div className="absolute bottom-4 left-4 flex space-x-2">
          {socialIcons.map((icon, index) => (
            <Link href={icon.url || "#"} key={index}>
              <SocialButton 
                icon={icon.icon} 
                bgColor={icon.bgColor} 
              />
            </Link>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-gray-700 text-lg font-medium">{title}</h3>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{name}</h2>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
        
        {/* Bottom social links */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex space-x-2">
            <SocialButton icon={<FaFacebook size={16} />} outline />
            <SocialButton icon={<FaTwitter size={16} />} outline />
            <SocialButton icon={<FaGooglePlusG size={16} />} outline />
          </div>
          
          <button 
  onClick={() => router.push(`/doctors/${doctor.id}`)}
  className="text-teal-500 hover:text-teal-700 flex items-center gap-1 font-medium text-sm transition-colors"
>
  View Profile <FaPlus size={12} />
</button>
        </div>
      </div>
    </div>
  );
};

// Doctor Details Modal Component
const DoctorModal = ({ doctor, onClose }) => {
  if (!doctor) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Dr. {doctor.name}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <Image 
                src={doctor.imageUrl || "/api/placeholder/400/500"} 
                alt={`Dr. ${doctor.name}`}
                width={400} 
                height={500}
                className="w-full h-auto rounded-lg"
              />
              
              <div className="mt-6 flex justify-center space-x-3">
                {doctor.socialIcons.map((icon, index) => (
                  <Link href={icon.url || "#"} key={index}>
                    <SocialButton 
                      icon={icon.icon} 
                      bgColor={icon.bgColor} 
                    />
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="md:w-2/3">
              <div className="mb-4 pb-4 border-b border-gray-200">
                <h3 className="text-xl text-gray-700 font-medium">{doctor.title}</h3>
                <p className="text-gray-900 mt-2">{doctor.fullDescription || doctor.description}</p>
              </div>
              
              <div className="mb-4 pb-4 border-b border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Specialization</h4>
                <p className="text-gray-700">{doctor.specialization || doctor.title}</p>
              </div>
              
              <div className="mb-4 pb-4 border-b border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Education</h4>
                <ul className="text-gray-700 space-y-2">
                  {doctor.education ? (
                    doctor.education.map((edu, idx) => (
                      <li key={idx}>{edu}</li>
                    ))
                  ) : (
                    <li>Medical University Graduate</li>
                  )}
                </ul>
              </div>
              
              <div className="mb-4">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Schedule</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 font-medium">Working days</p>
                    <p className="text-gray-900">Monday - Friday</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Working hours</p>
                    <p className="text-gray-900">08:00 - 16:00</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded font-medium transition-colors">
                  Book an Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DoctorTeamGrid = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  const doctors = [
    {
      id: 1,
      name: "Sussie Wolff",
      title: "Pediatrician",
      specialty: "pediatrician",
      description: "A physician/doctor in pediatrics is a medical practitioner that works directly with children.",
      fullDescription: "Dr. Sussie Wolff specializes in the health of infants, children, and adolescents. With over 10 years of experience, she focuses on preventive health care and treats children who are acutely or chronically ill.",
      imageUrl: "https://images.pexels.com/photos/7446991/pexels-photo-7446991.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      education: [
        "MD, Harvard Medical School",
        "Pediatric Residency, Boston Children's Hospital"
      ],
      socialIcons: [
        { icon: <MdChildCare size={20} />, bgColor: "bg-teal-500", url: "#" },
        { icon: <FaLinkedinIn size={16} />, bgColor: "bg-blue-600", url: "#" }
      ]
    },
    {
      id: 2,
      name: "Ashley Willson",
      title: "Dental surgeon",
      specialty: "dental",
      description: "Cardiologists specialize in diagnosing and treating diseases of the cardiovascular system.",
      fullDescription: "Dr. Ashley Willson is a skilled dental surgeon with expertise in oral surgery, implantology, and restorative dentistry. She is committed to providing painless dental treatments with the latest technologies.",
      imageUrl: "https://images.pexels.com/photos/19596247/pexels-photo-19596247/free-photo-of-portrait-of-smiling-black-woman-doctor-in-medical-robe.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      education: [
        "DDS, University of Pennsylvania",
        "Oral Surgery Residency, NYU Langone Medical Center"
      ],
      socialIcons: [
        { icon: <FaTooth size={20} />, bgColor: "bg-teal-500", url: "#" },
        { icon: <FaLinkedinIn size={16} />, bgColor: "bg-blue-600", url: "#" }
      ]
    },
    {
      id: 3,
      name: "Gabriela Beckett",
      title: "Cosmetic Surgeon",
      specialty: "cosmetic",
      description: "A typical day includes patient consultations, skin biopsies, cosmetic procedures, and diagnosing skin disorders.",
      fullDescription: "Dr. Gabriela Beckett is a board-certified cosmetic surgeon specializing in facial rejuvenation, body contouring, and minimally invasive procedures. She combines artistic vision with surgical precision to achieve natural-looking results.",
      imageUrl: "https://images.pexels.com/photos/15960473/pexels-photo-15960473/free-photo-of-a-doctor-putting-on-rubber-gloves.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2https://images.pexels.com/photos/6129121/pexels-photo-6129121.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      education: [
        "MD, Johns Hopkins University School of Medicine",
        "Residency in Plastic Surgery, Mayo Clinic",
        "Fellowship in Aesthetic Surgery, Manhattan Eye, Ear & Throat Hospital"
      ],
      socialIcons: [
        { icon: <FaCut size={20} />, bgColor: "bg-teal-500", url: "#" },
        { icon: <FaLinkedinIn size={16} />, bgColor: "bg-blue-600", url: "#" }
      ]
    },
    {
      id: 4,
      name: "George Button",
      title: "General Doctor",
      specialty: "general",
      description: "General practitioners diagnose and treat a wide range of conditions and refer patients to specialists when necessary.",
      imageUrl: "https://images.pexels.com/photos/4930708/pexels-photo-4930708.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      education: [
        "MD, Stanford University School of Medicine",
        "Residency in Internal Medicine, Massachusetts General Hospital"
      ],
      socialIcons: [
        { icon: <FaUserMd size={20} />, bgColor: "bg-teal-500", url: "#" },
        { icon: <FaLinkedinIn size={16} />, bgColor: "bg-blue-600", url: "#" }
      ]
    }
  ];
  

  
  const handleDoctorClick = (doctor) => {
    setSelectedDoctor(doctor);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };
  
  const handleCloseModal = () => {
    setSelectedDoctor(null);
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="bg-gray-100 py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
        <h2 className="text-3xl font-bold uppercase text-gray-800 mb-2">Meet Our Team</h2>
        <div className="w-16 h-1 bg-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our team of highly qualified doctors with different specializations are ready to provide the best medical care for you and your family.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ">
  {doctors.map((doctor) => (
    <div className="w-full max-w-xs mx-auto">
      <DoctorCard 
        key={doctor.id} 
        doctor={doctor} 
        onClick={handleDoctorClick}
      />
    </div>
  ))}
</div>

        
        {/* View more button */}
        <div className="mt-12 text-center">
          <Link href="/team">
            <button className="bg-white border-2 border-teal-500 text-teal-500 hover:bg-teal-50 px-8 py-3 rounded-md font-medium transition-colors">
              View All Team Members
            </button>
          </Link>
        </div>
      </div>
      
      {/* Doctor Modal */}
      {selectedDoctor && (
        <DoctorModal 
          doctor={selectedDoctor} 
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default DoctorTeamGrid;