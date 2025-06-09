import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { NavLink, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  InboxIcon as ChatBubbleBottomCenterIcon,
  FolderIcon,
  DocumentIcon,
  UserIcon as UsersIcon,
  CurrencyDollarIcon as ArrowRightOnRectangleIcon,
  CogIcon as Cog8ToothIcon,
  Bars3Icon,
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  ArchiveBoxIcon as ArchiveIcon,
  ClipboardDocumentListIcon,
  BookOpenIcon,
  ArrowRightOnRectangleIcon as LogoutIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { FiArchive } from "react-icons/fi";
import { useAuth } from "./ProtectedRoute";

const navLinks = [
  { name: "Dashboard", icon: HomeIcon, to: "/" },
  { name: "Messages", icon: ChatBubbleBottomCenterIcon, to: "/messages" },
  { name: "Calendar", icon: CalendarIcon, to: "/calendar" },
  { name: "Tasks", icon: ClipboardDocumentListIcon, to: "/tasks" },
  { name: "Scheduling", icon: ClockIcon, to: "/scheduling" },
  { name: "Matters", icon: FolderIcon, to: "/matters" },
  { name: "Clients", icon: UsersIcon, to: "/clients" },
  { name: "Transfers", icon: ArrowRightOnRectangleIcon, to: "/transfers" },
  { name: "Archive", icon: FiArchive, to: "/archive" },
  { name: "Knowledge Base", icon: BookOpenIcon, to: "/knowledge-base" },
  { name: "Audit Trail", icon: DocumentTextIcon, to: "/audit-trail" },
  { name: "Client Portal", icon: UsersIcon, to: "/client-portal" },
  { name: "Invoice", icon: DocumentTextIcon, to: "/invoice" },
  { name: "Settings", icon: Cog8ToothIcon, to: "/settings" },
];

// Edit Profile Modal Component
const EditProfileModal = ({ isOpen, onClose, profile, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    jobTitle: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        jobTitle: profile.jobTitle || ''
      });
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) {return null;}

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Profile</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter last name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter job title"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

const Sidebar = ({ isMobileOpen, toggleSidebar, isCollapsed }) => {
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const docsDropdownRef = useRef(null);
  const docsButtonRef = useRef(null);
  const userMenuRef = useRef(null);
  const userButtonRef = useRef(null);
  const navigate = useNavigate();
  const { user, profile, signOut, updateProfile } = useAuth();

  // Click outside logic for popovers
  useEffect(() => {
    function handleClickOutside(event) {
      // Handle docs dropdown
      if (
        docsDropdownRef.current &&
        !docsDropdownRef.current.contains(event.target) &&
        docsButtonRef.current &&
        !docsButtonRef.current.contains(event.target)
      ) {
        setIsDocsOpen(false);
      }
      
      // Handle user menu dropdown
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    }
    
    if (isDocsOpen || isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDocsOpen, isUserMenuOpen]);

  // Position popovers
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const [userMenuPos, setUserMenuPos] = useState({ top: 0, left: 0 });
  
  useEffect(() => {
    if (isDocsOpen && docsButtonRef.current) {
      const rect = docsButtonRef.current.getBoundingClientRect();
      setPopoverPos({
        top: rect.top + window.scrollY,
        left: rect.right + 8 + window.scrollX,
      });
    }
  }, [isDocsOpen]);

  useEffect(() => {
    if (isUserMenuOpen && userButtonRef.current) {
      const rect = userButtonRef.current.getBoundingClientRect();
      setUserMenuPos({
        top: rect.top + window.scrollY - 120, // Position above the user button
        left: rect.right + 8 + window.scrollX,
      });
    }
  }, [isUserMenuOpen]);

  const mattersIdx = navLinks.findIndex(link => link.name === 'Matters');
  const archiveIdx = navLinks.findIndex(link => link.name === 'Archive');
  const beforeDocs = navLinks.slice(0, mattersIdx + 1);
  const afterDocs = navLinks.slice(mattersIdx + 1);

  const parentItemClass =
    "flex items-center gap-3 p-3 px-4 rounded-md transition-colors cursor-pointer text-gray-700 hover:bg-gray-100 w-full";
  const nestedItemClass =
    "flex items-center gap-3 p-3 pl-10 rounded-md transition-colors cursor-pointer text-gray-700 hover:bg-blue-50 w-full ml-2";

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Handle profile edit
  const handleProfileEdit = async (formData) => {
    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        jobTitle: formData.jobTitle
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Get user display info
  const getUserDisplayName = () => {
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    if (user?.displayName) {
      return user.displayName;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getUserRole = () => {
    if (profile?.jobTitle) {
      return profile.jobTitle;
    }
    if (profile?.role) {
      return profile.role.charAt(0).toUpperCase() + profile.role.slice(1);
    }
    return 'User';
  };

  // Get dynamic branding
  const getBrandingName = () => {
    // CEO can set firm name, others see their firm name or default
    if (profile?.firmName && profile.firmName.trim()) {
      return profile.firmName;
    }
    return 'EasyHomes';
  };

  // Smart text stacking for long firm names
  const renderBrandingText = (text) => {
    if (isCollapsed) {return null;}
    
    const words = text.split(' ');
    if (words.length > 2 || text.length > 15) {
      // Stack text for long names
      const midPoint = Math.ceil(words.length / 2);
      const firstLine = words.slice(0, midPoint).join(' ');
      const secondLine = words.slice(midPoint).join(' ');
      
      return (
        <div className="text-center">
          <div className="text-lg font-light text-gray-800 leading-tight">{firstLine}</div>
          {secondLine && <div className="text-lg font-light text-gray-800 leading-tight">{secondLine}</div>}
        </div>
      );
    }
    
    return <span className="text-xl font-light text-gray-800 truncate">{text}</span>;
  };

  return (
    <>
      <div className="flex flex-col h-full w-full">
        {/* Dynamic Branding Header */}
        <div className="pt-[25px] pb-6 px-4 flex items-center space-x-3">
          <HomeIcon className="h-8 w-8 text-blue-600 flex-shrink-0" />
          {renderBrandingText(getBrandingName())}
        </div>
        
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden p-2 space-y-1">
          {beforeDocs.map((link) => (
            <NavLink
              to={link.to}
              key={link.name}
              className={({ isActive }) =>
                `${parentItemClass} ${isActive ? "bg-blue-100 text-blue-600" : ""}`
              }
              title={isCollapsed ? link.name : undefined}
            >
              <link.icon className="w-6 h-6 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm truncate">{link.name}</span>}
            </NavLink>
          ))}
          {/* Documents popover nav item */}
          <div
            key="Documents"
            className="relative focus:outline-none"
            tabIndex={isCollapsed ? -1 : 0}
            ref={docsButtonRef}
            onMouseEnter={() => { if (!isCollapsed) {setIsDocsOpen(true);} }}
            onClick={e => {
              e.stopPropagation();
              if (!isCollapsed) {setIsDocsOpen((open) => !open);}
            }}
            aria-haspopup="true"
            aria-expanded={isDocsOpen}
          >
            <div
              className={`${parentItemClass} ${isDocsOpen && !isCollapsed ? "bg-blue-50" : ""}`}
              title={isCollapsed ? 'Documents' : undefined}
            >
              <DocumentIcon className="w-6 h-6 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm truncate">Documents</span>}
            </div>
            {isDocsOpen && !isCollapsed && ReactDOM.createPortal(
              <div
                ref={docsDropdownRef}
                className="absolute w-40 bg-white border border-gray-200 rounded-md shadow-lg z-[9999] py-2"
                style={{
                  top: popoverPos.top,
                  left: popoverPos.left,
                  position: 'absolute',
                  minWidth: 160,
                }}
                onMouseEnter={() => setIsDocsOpen(true)}
                // Don't close on mouse leave, only on click-outside or button click
              >
                <button
                  className={nestedItemClass}
                  onClick={e => {
                    e.stopPropagation();
                    setIsDocsOpen(false);
                    setTimeout(() => navigate('/documents/upload'), 0);
                  }}
                >
                  <span className="text-sm truncate">Upload</span>
                </button>
                <button
                  className={nestedItemClass}
                  onClick={e => {
                    e.stopPropagation();
                    setIsDocsOpen(false);
                    setTimeout(() => navigate('/documents/download'), 0);
                  }}
                >
                  <span className="text-sm truncate">Download</span>
                </button>
              </div>,
              document.body
            )}
          </div>
          {afterDocs.map((link) => (
            <NavLink
              to={link.to}
              key={link.name}
              className={({ isActive }) =>
                `${parentItemClass} ${isActive ? "bg-blue-100 text-blue-600" : ""}`
              }
              title={isCollapsed ? link.name : undefined}
            >
              <link.icon className="w-6 h-6 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm truncate">{link.name}</span>}
            </NavLink>
          ))}
        </div>
        
        {/* User Profile Section with Edit Functionality */}
        <div
          ref={userButtonRef}
          className={`border-t border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer 
            ${!isCollapsed ? "p-4" : "px-2 py-3"} flex items-center gap-3`}
          style={{ marginTop: "auto" }}
          onClick={(e) => {
            e.stopPropagation();
            if (!isCollapsed) {setIsUserMenuOpen(!isUserMenuOpen);}
          }}
          title={isCollapsed ? `${getUserDisplayName()} - ${getUserRole()}` : undefined}
        >
          {/* Profile Picture with real-time updates */}
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0 relative">
            {profile?.profilePicture ? (
              <img 
                src={profile.profilePicture} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getUserDisplayName().charAt(0).toUpperCase()
            )}
          </div>
          {!isCollapsed && (
            <div className="truncate flex-1">
              <p className="text-sm font-medium text-gray-800 truncate">{getUserDisplayName()}</p>
              <p className="text-xs text-gray-500 truncate">{getUserRole()}</p>
            </div>
          )}
          {!isCollapsed && (
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>

        {/* User Menu Dropdown with Edit Option */}
        {isUserMenuOpen && !isCollapsed && ReactDOM.createPortal(
          <div
            ref={userMenuRef}
            className="absolute w-48 bg-white border border-gray-200 rounded-md shadow-lg z-[9999] py-2"
            style={{
              top: userMenuPos.top,
              left: userMenuPos.left,
              position: 'absolute',
            }}
          >
            <button
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsUserMenuOpen(false);
                setIsEditModalOpen(true);
              }}
            >
              <PencilIcon className="w-4 h-4" />
              Edit Profile
            </button>
            <button
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsUserMenuOpen(false);
                navigate('/settings');
              }}
            >
              <Cog8ToothIcon className="w-4 h-4" />
              Profile Settings
            </button>
            <hr className="my-1 border-gray-200" />
            <button
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsUserMenuOpen(false);
                handleLogout();
              }}
            >
              <LogoutIcon className="w-4 h-4" />
              Sign Out
            </button>
          </div>,
          document.body
        )}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onSave={handleProfileEdit}
      />
    </>
  );
};

export default Sidebar;