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
  const docsButtonRef = useRef(null);
  const navigate = useNavigate();

  // Click outside logic for popover
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        docsDropdownRef.current &&
        !docsDropdownRef.current.contains(event.target) &&
        docsButtonRef.current &&
        !docsButtonRef.current.contains(event.target)
      ) {
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

  // Position popover next to Documents button
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  useEffect(() => {
    if (isDocsOpen && docsButtonRef.current) {
      const rect = docsButtonRef.current.getBoundingClientRect();
      setPopoverPos({
        top: rect.top + window.scrollY,
        left: rect.right + 8 + window.scrollX,
      });
    }
  }, [isDocsOpen]);

  const mattersIdx = navLinks.findIndex(link => link.name === 'Matters');
  const archiveIdx = navLinks.findIndex(link => link.name === 'Archive');
  const beforeDocs = navLinks.slice(0, mattersIdx + 1);
  const afterDocs = navLinks.slice(mattersIdx + 1);

  const parentItemClass =
    "flex items-center gap-3 p-3 px-4 rounded-md transition-colors cursor-pointer text-gray-700 hover:bg-gray-100 w-full";
  const nestedItemClass =
    "flex items-center gap-3 p-3 pl-10 rounded-md transition-colors cursor-pointer text-gray-700 hover:bg-blue-50 w-full ml-2";

  return (
    <>
      <div className="flex flex-col h-full w-full">
        <div className="pt-[25px] pb-6 px-4 flex items-center space-x-3">
          <HomeIcon className="h-8 w-8 text-blue-600 flex-shrink-0" />
          {!isCollapsed && <span className="text-xl font-bold text-gray-800 truncate">EazyHomes</span>}
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
            onMouseEnter={() => { if (!isCollapsed) setIsDocsOpen(true); }}
            onClick={e => {
              e.stopPropagation();
              if (!isCollapsed) setIsDocsOpen((open) => !open);
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
        <NavLink
          to="/settings/profile"
          className={`flex items-center gap-3 border-t border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer 
            ${!isCollapsed ? "p-4 justify-start" : "px-2 py-3 justify-center"}`}
          style={{ marginTop: "auto" }}
          title={!isCollapsed ? undefined : "Jane Doe - Conveyancer"}
        >
          <img
            src="/images/avatars/face 2 (2).jpg"
            alt="Jane Doe Avatar"
            className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-indigo-100 flex-shrink-0"
          />
          {!isCollapsed && (
            <div className="truncate">
              <p className="text-sm font-medium text-gray-800 truncate">Jane Doe</p>
              <p className="text-xs text-gray-500 truncate">Conveyancer</p>
            </div>
          )}
        </NavLink>
      </div>
    </>
  );
};

export default Sidebar;