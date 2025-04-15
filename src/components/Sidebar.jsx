'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  MdDashboard,
  MdCalendarToday,
  MdPeople,
  MdAssignment,
  MdMenu,
  MdChevronRight
} from 'react-icons/md';

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const menuItems = [
    {
      name: 'النظرة العامة',
      path: '/doctordash',
      icon: <MdDashboard size={20} />,
      exact: true
    },
    {
      name: 'المواعيد',
      path: '/doctordash/appointments',
      icon: <MdCalendarToday size={20} />,
      subItems: [
        { name: 'جدولة جديدة', path: '/doctordash/appointments/new' },
        { name: 'قائمة المواعيد', path: '/doctordash/appointments' }
      ]
    },
    {
      name: 'المرضى',
      path: '/doctordash/patients',
      icon: <MdPeople size={20} />,
      subItems: [
        { name: 'سجل المرضى', path: '/doctordash/patients' },
        { name: 'إضافة مريض', path: '/doctordash/patients/new' }
      ]
    },
    {
      name: 'التقارير',
      path: '/doctordash/reports',
      icon: <MdAssignment size={20} />
    }
  ];

  const toggleSubmenu = (index) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  return (
    <div className={`sidebar-container ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2>{isCollapsed ? 'لو' : 'لوحة التحكم'}</h2>
        <button 
          className="toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <MdMenu size={24} />
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item, index) => (
            <li key={item.path}>
              {item.subItems ? (
                <>
                  <div 
                    className={`nav-link ${pathname.startsWith(item.path) ? 'active' : ''}`}
                    onClick={() => toggleSubmenu(index)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {!isCollapsed && (
                      <>
                        <span className="nav-text">{item.name}</span>
                        <MdChevronRight 
                          size={20} 
                          className={`submenu-arrow ${activeSubmenu === index ? 'open' : ''}`}
                        />
                      </>
                    )}
                  </div>
                  
                  {!isCollapsed && activeSubmenu === index && (
                    <ul className="submenu">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.path}>
                          <Link 
                            href={subItem.path}
                            className={`submenu-link ${pathname === subItem.path ? 'active' : ''}`}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  href={item.path}
                  className={`nav-link ${(item.exact ? pathname === item.path : pathname.startsWith(item.path)) ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!isCollapsed && <span className="nav-text">{item.name}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <style jsx>{`
        .sidebar-container {
          width: 250px;
          height: 100vh;
          background-color: #1D1F27;
          color: #DDDFDE;
          display: flex;
          flex-direction: column;
          padding: 20px 0;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
          transition: width 0.3s ease;
          position: fixed;
          right: 0;
          top: 0;
          z-index: 100;
        }
        
        .sidebar-container.collapsed {
          width: 80px;
        }
        
        .sidebar-header {
          padding: 0 20px 20px;
          border-bottom: 1px solid #0CB8B6;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .sidebar-header h2 {
          color: #0CB8B6;
          margin: 0;
          font-size: 1.5rem;
          transition: opacity 0.3s ease;
        }
        
        .sidebar-container.collapsed .sidebar-header h2 {
          opacity: 0;
          width: 0;
        }
        
        .toggle-btn {
          background: none;
          border: none;
          color: #DDDFDE;
          cursor: pointer;
          padding: 5px;
        }
        
        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
        }
        
        .sidebar-nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .sidebar-nav li {
          margin: 5px 0;
        }
        
        .nav-link {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          color: #DDDFDE;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          gap: 15px;
        }
        
        .nav-link:hover {
          background-color: rgba(12, 184, 182, 0.1);
        }
        
        .nav-link.active {
          background-color: #0CB8B6;
          color: #1D1F27;
          font-weight: bold;
        }
        
        .nav-icon {
          min-width: 24px;
          display: flex;
          justify-content: center;
        }
        
        .nav-text {
          transition: opacity 0.3s ease;
        }
        
        .sidebar-container.collapsed .nav-text {
          opacity: 0;
          width: 0;
          height: 0;
          overflow: hidden;
        }
        
        .submenu {
          padding-right: 30px;
          overflow: hidden;
          transition: max-height 0.3s ease;
          max-height: 500px;
        }
        
        .submenu-link {
          display: block;
          padding: 10px 15px;
          color: #DDDFDE;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }
        
        .submenu-link:hover {
          background-color: rgba(12, 184, 182, 0.1);
        }
        
        .submenu-link.active {
          color: #0CB8B6;
          font-weight: bold;
        }
        
        .submenu-arrow {
          transition: transform 0.3s ease;
          margin-right: auto;
        }
        
        .submenu-arrow.open {
          transform: rotate(90deg);
        }
        
        @media (max-width: 768px) {
          .sidebar-container {
            width: 80px;
          }
          
          .sidebar-container:not(.collapsed) {
            width: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default Sidebar;