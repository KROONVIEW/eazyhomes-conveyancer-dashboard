import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './ProtectedRoute';
import { FiMenu, FiChevronDown, FiUser, FiLogOut, FiSun, FiMoon, FiFileText, FiGrid, FiUsers, FiUpload, FiSettings, FiPlus } from 'react-icons/fi';

const menuSections = [
  {
    title: 'Navigation',
    items: [
      { label: 'Dashboard Overview', icon: <FiGrid />, route: '/' },
      { label: 'Matters', icon: <FiFileText />, route: '/matters' },
      { label: 'Clients', icon: <FiUsers />, route: '/clients' },
      { label: 'Documents', icon: <FiUpload />, route: '/documents' },
      { label: 'Settings', icon: <FiSettings />, route: '/settings' },
    ],
  },
  {
    title: 'Quick Actions',
    items: [
      { label: 'Add New Matter', icon: <FiPlus />, route: '/matters/new' },
      { label: 'Upload Document', icon: <FiUpload />, route: '/documents/upload' },
    ],
  },
  {
    title: 'User Options',
    items: [
      { label: 'View Profile', icon: <FiUser />, action: 'viewProfile' },
      { label: 'Toggle Light/Dark Mode', icon: <FiSun />, action: 'toggleTheme' },
      { label: 'Logout', icon: <FiLogOut />, action: 'logout' },
    ],
  },
];

const MENU_WIDTH = 320;

const HamburgerMenu = ({ onToggleTheme, triggerIcon }) => {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 56, left: 0 });
  const btnRef = useRef(null);
  const hoverTimeout = useRef();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  // Handle menu actions
  const handleMenuAction = async (item) => {
    if (item.action === 'toggleTheme' && onToggleTheme) {
      onToggleTheme();
    } else if (item.action === 'logout') {
      try {
        await signOut();
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    } else if (item.action === 'viewProfile') {
      navigate('/settings'); // Navigate to settings page where profile can be managed
    }
    setOpen(false);
  };

  // Handle navigation
  const handleNavigation = (route) => {
    navigate(route);
    setOpen(false);
  };

  const calcMenuPos = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      let left = rect.left + window.scrollX;
      // Check if menu would overflow right edge
      if (left + MENU_WIDTH > window.innerWidth - 8) {
        // Align right edge of menu with right edge of icon
        left = rect.right + window.scrollX - MENU_WIDTH;
        if (left < 8) {left = 8;} // Prevent going off the left edge
      }
      // Add a 10px gap below the icon
      setMenuPos({ top: rect.bottom + window.scrollY + 10, left });
    }
  };

  // Open on hover (desktop)
  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout.current);
    calcMenuPos();
    setOpen(true);
  };
  // Close on mouse leave (desktop)
  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setOpen(false), 120);
  };
  // Click for accessibility/mobile
  const handleOpen = () => {
    calcMenuPos();
    setOpen((v) => !v);
  };

  return (
    <div
      style={{ display: 'inline-block', position: 'relative' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={btnRef}
        style={{ background: 'transparent', color: '#222', padding: 0, border: 'none', borderRadius: 8, boxShadow: 'none', display: 'flex', alignItems: 'center' }}
        aria-label="Open menu"
        onClick={handleOpen}
      >
        {triggerIcon || <FiMenu className="w-7 h-7" />}
      </button>
      {open && ReactDOM.createPortal(
        <div
          style={{ position: 'absolute', top: menuPos.top, left: menuPos.left, zIndex: 100001, width: MENU_WIDTH, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          {menuSections.map((section) => (
            <div key={section.title} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>{section.title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {section.items.map((item) => (
                  <li key={item.label} style={{ marginBottom: 4 }}>
                    <button
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, color: '#222', background: 'none', border: 'none', fontWeight: 500, fontSize: 15, width: '100%', textAlign: 'left', transition: 'background 0.2s', cursor: 'pointer' }}
                      onClick={() => item.route ? handleNavigation(item.route) : handleMenuAction(item)}
                      onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ fontSize: 20 }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

export default HamburgerMenu; 