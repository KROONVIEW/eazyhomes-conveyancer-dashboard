import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
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
} from "@heroicons/react/24/outline";
import { FiArchive } from "react-icons/fi";

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

const Sidebar = ({ isMobileOpen, toggleSidebar, isCollapsed }) => {
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const docsDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (docsDropdownRef.current && !docsDropdownRef.current.contains(event.target)) {
        setIsDocsOpen(false);
      }
    }
    if (isDocsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDocsOpen]);

  const mattersIdx = navLinks.findIndex(link => link.name === 'Matters');
  const archiveIdx = navLinks.findIndex(link => link.name === 'Archive');
  const beforeDocs = navLinks.slice(0, mattersIdx + 1);
  const afterDocs = navLinks.slice(mattersIdx + 1);

  const parentItemClass =
    "flex items-center gap-3 p-3 px-4 rounded-md transition-colors cursor-pointer text-gray-700 hover:bg-gray-100 w-full";
  const nestedItemClass =
    "flex items-center gap-3 p-3 pl-10 rounded-md transition-colors cursor-pointer text-gray-700 hover:bg-blue-50 w-full ml-2";

  if (isMobileOpen) {
    return (
      <>
        <div className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden" onClick={toggleSidebar} />
        <div
          className={`sidebar fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-white border-r border-gray-200 shadow-sm flex flex-col w-64 md:hidden`}
        >
          <div className="pt-[25px] pb-6 px-4 flex items-center space-x-3">
            <HomeIcon className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">EazyHomes</span>
          </div>
          <div className="flex justify-end p-2">
            <XMarkIcon className="w-6 h-6 text-gray-700 cursor-pointer" onClick={toggleSidebar} />
          </div>
          <div className="flex flex-col flex-1 p-2 space-y-2 justify-between">
            <div>
              {navLinks.map((link) => (
                <NavLink
                  to={link.to}
                  key={link.name}
                  className={({ isActive }) =>
                    `${parentItemClass} ${isActive ? "bg-blue-100 text-blue-600" : ""}`
                  }
                  onClick={toggleSidebar}
                >
                  <link.icon className="w-6 h-6" />
                  <span className="text-sm">{link.name}</span>
                </NavLink>
              ))}
            </div>
            <NavLink
              to="/settings/profile"
              className={`flex items-center gap-3 p-4 border-t border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer justify-start`}
              style={{ marginTop: "auto" }}
              onClick={toggleSidebar}
            >
              <img src="/images/avatars/face 2 (2).jpg" alt="Jane Doe Avatar" className="w-10 h-10 rounded-full" />
              <div>
                <p className="text-sm font-medium text-gray-800">Jane Doe</p>
                <p className="text-xs text-gray-500">Conveyancer</p>
              </div>
            </NavLink>
          </div>
        </div>
      </>
    );
  }

  const showText = !isCollapsed;

  return (
    <div
      className={`sidebar fixed top-0 left-0 z-40 h-screen transition-colors duration-300 bg-white border-r-2 border-gray-200 shadow-sm flex flex-col w-full`}
    >
      <div className="pt-[25px] pb-6 px-4 flex items-center space-x-3">
        <HomeIcon className="h-8 w-8 text-blue-600 flex-shrink-0" />
        {showText && <span className="text-xl font-bold text-gray-800 truncate">EazyHomes</span>}
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden p-2 space-y-1">
        {navLinks.map((link) => {
          if (link.name === 'Documents') {
            return (
              <div
                key={link.name}
                ref={docsDropdownRef}
                onMouseEnter={() => { if (showText) setIsDocsOpen(true); }}
                onMouseLeave={() => setIsDocsOpen(false)}
                onClick={() => { if (showText) setIsDocsOpen((open) => !open); }}
                className="relative focus:outline-none"
                tabIndex={showText ? 0 : -1}
                onKeyDown={e => {
                  if (!showText) return;
                  if (e.key === 'Enter' || e.key === ' ') setIsDocsOpen((open) => !open);
                  if (e.key === 'Escape') setIsDocsOpen(false);
                }}
              >
                <div className={`${parentItemClass} ${isDocsOpen && showText ? "bg-blue-50" : ""}`}>
                  <DocumentIcon className="w-6 h-6 flex-shrink-0" />
                  {showText && <span className="text-sm truncate">Documents</span>}
                </div>
                {isDocsOpen && showText && (
                  <div className="pl-6 w-full">
                    <NavLink to="/documents/upload" className={({ isActive }) => `${nestedItemClass} ${isActive ? 'bg-blue-100 text-blue-700 font-semibold' : ''}`}>
                      <span className="text-sm truncate">Upload</span>
                    </NavLink>
                    <NavLink to="/documents/download" className={({ isActive }) => `${nestedItemClass} ${isActive ? 'bg-blue-100 text-blue-700 font-semibold' : ''}`}>
                      <span className="text-sm truncate">Download</span>
                    </NavLink>
                  </div>
                )}
              </div>
            );
          }
          return (
            <NavLink
              to={link.to}
              key={link.name}
              className={({ isActive }) =>
                `${parentItemClass} ${isActive ? "bg-blue-100 text-blue-600" : ""}`
              }
              title={showText ? undefined : link.name}
            >
              <link.icon className="w-6 h-6 flex-shrink-0" />
              {showText && <span className="text-sm truncate">{link.name}</span>}
            </NavLink>
          );
        })}
      </div>

      <NavLink
        to="/settings/profile"
        className={`flex items-center gap-3 border-t border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer 
          ${showText ? "p-4 justify-start" : "px-2 py-3 justify-center"}`}
        style={{ marginTop: "auto" }}
        title={showText ? undefined : "Jane Doe - Conveyancer"}
      >
        <img
          src="/images/avatars/face 2 (2).jpg"
          alt="Jane Doe Avatar"
          className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-indigo-100 flex-shrink-0"
        />
        {showText && (
          <div className="truncate">
            <p className="text-sm font-medium text-gray-800 truncate">Jane Doe</p>
            <p className="text-xs text-gray-500 truncate">Conveyancer</p>
          </div>
        )}
      </NavLink>
    </div>
  );
};

export default Sidebar; 