"use client"

import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const footerStyle = {
    backgroundColor: '#1D1F27',
    color: 'white',
    padding: '2rem 0',
  };

  const headingStyle = {
    color: '#0CB8B6',
    marginBottom: '1rem',
    fontWeight: '600',
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '0.5rem',
    transition: 'color 0.3s ease',
  };

  const iconStyle = {
    backgroundColor: '#0CB8B6',
    color: 'white',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '0.5rem',
    transition: 'background-color 0.3s ease',
  };

  const contactItemStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
  };

  const highlightStyle = {
    color: '#CE592C',
  };

  return (
    <footer style={footerStyle}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 style={headingStyle}>CARELINK HOSPITAL</h4>
            <p>
              Your trusted healthcare provider in Amman. Delivering compassionate care and medical excellence to the community of Jordan.
            </p>
          </div>

          <div>
            <h4 style={headingStyle}>USEFUL LINKS</h4>
            <a href="/services" style={linkStyle}>Our Services</a>
            <a href="/doctors" style={linkStyle}>Our Doctors</a>
            <a href="/appointments" style={linkStyle}>Book Appointment</a>
            <a href="/emergency" style={linkStyle}>Emergency Care</a>
          </div>

          <div>
            <h4 style={headingStyle}>CONTACT</h4>
            <div style={contactItemStyle}>
              <div style={iconStyle}>
                <FaMapMarkerAlt />
              </div>
              <span>Amman, Jordan</span>
            </div>
            <div style={contactItemStyle}>
              <div style={iconStyle}>
                <FaEnvelope />
              </div>
              <span>info@carelink.jo</span>
            </div>
            <div style={contactItemStyle}>
              <div style={iconStyle}>
                <FaPhone />
              </div>
              <span>+962 6 XXX XXXX</span>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-600" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <p>© {new Date().getFullYear()} Copyright: <span style={highlightStyle}>CareLink Hospital</span></p>
          </div>
          <div className="flex mt-4 md:mt-0">
            <a href="#" className="mx-2" style={iconStyle}>
              <FaFacebookF />
            </a>
            <a href="#" className="mx-2" style={iconStyle}>
              <FaTwitter />
            </a>
            <a href="#" className="mx-2" style={iconStyle}>
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;