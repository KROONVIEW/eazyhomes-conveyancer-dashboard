import React, { useState, useCallback, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import {
  HomeIcon,
  InboxIcon as ChatBubbleBottomCenterIcon,
  FolderIcon,
  DocumentIcon,
  UserIcon as UsersIcon,
  CurrencyDollarIcon as ArrowRightOnRectangleIcon,
  CogIcon as Cog8ToothIcon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  ArchiveBoxIcon as ArchiveIcon,
  ClipboardDocumentListIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { FiArchive } from "react-icons/fi";
import HamburgerMenu from './HamburgerMenu';
import { NavLink } from "react-router-dom";
import FloatingActionButton from './FloatingActionButton';

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  React.useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isDesktop;
}

const SIDEBAR_WIDTH = 256; // px
const SIDEBAR_COLLAPSED_WIDTH = 64; // px
const EXPAND_COLLAPSE_DELAY = 300; // ms delay for collapse on mouse leave

const Layout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Default to collapsed
  const collapseTimerRef = useRef(null);
  const mouseIsOverSidebarRef = useRef(false);
  const ignoreNextMouseEnterRef = useRef(false);
  const isDesktop = useIsDesktop();

  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen((prev) => !prev);
  }, []);

  const handleMouseEnterSidebar = useCallback(() => {
    mouseIsOverSidebarRef.current = true;
    clearTimeout(collapseTimerRef.current); // Cancel any pending collapse

    if (ignoreNextMouseEnterRef.current) {
      ignoreNextMouseEnterRef.current = false; // Consume the flag
      return;
    }

    if (isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
    }
  }, [isSidebarCollapsed]);

  const handleMouseLeaveSidebar = useCallback(() => {
    mouseIsOverSidebarRef.current = false;
    clearTimeout(collapseTimerRef.current);
    collapseTimerRef.current = setTimeout(() => {
      if (!mouseIsOverSidebarRef.current) {
        ignoreNextMouseEnterRef.current = true; // Set flag to ignore the potential immediate MouseEnter due to shrink
        setIsSidebarCollapsed(true);
      }
    }, EXPAND_COLLAPSE_DELAY);
  }, []);
  
  useEffect(() => {
    // Cleanup the collapse timer if the component unmounts
    return () => {
      clearTimeout(collapseTimerRef.current);
    };
  }, []);

  const sidebarWrapperWidth = isSidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

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

  // Find index of Documents
  const docsIdx = navLinks.findIndex(link => link.name === 'Matters');
  const beforeDocs = navLinks.slice(0, docsIdx + 1);
  const afterDocs = navLinks.slice(docsIdx + 1);

  return (
    <div className="relative min-h-screen">
      {/* Desktop Sidebar */}
      {isDesktop && (
        <div
          className="sidebar-fixed bg-white border-r-2 border-gray-200 shadow-sm flex flex-col items-center py-4"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: isSidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
            height: '100vh',
            minHeight: '100vh',
            transition: 'width 0.3s cubic-bezier(.4,0,.2,1)',
            zIndex: 9999,
            transform: 'none',
            willChange: 'width'
          }}
          onMouseEnter={handleMouseEnterSidebar}
          onMouseLeave={handleMouseLeaveSidebar}
        >
          <Sidebar isCollapsed={isSidebarCollapsed} />
        </div>
      )}
      
      {/* Mobile Sidebar */}
      {!isDesktop && isMobileSidebarOpen && (
        <Sidebar
          isMobileOpen={true}
          toggleSidebar={toggleMobileSidebar}
          isCollapsed={false}
        />
      )}
      
      {/* Main Content */}
      <div 
        className="app-container min-h-screen bg-gray-50 transition-all duration-300"
        style={{
          marginLeft: isDesktop ? (isSidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH) : 0,
          transition: 'margin-left 0.3s cubic-bezier(.4,0,.2,1)',
          width: `calc(100% - ${isDesktop ? (isSidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH) : 0}px)`
        }}
      >
        <main className="main-content w-full px-6 py-6 max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Global Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
};

export default Layout; 