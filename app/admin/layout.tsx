'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getToken, getAdminData, logout } from '@/utils/api/admin';
import styles from './layout.module.scss';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminData, setAdminData] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    try {
      const token = getToken();
      const isLoginPage = pathname === '/admin/login';

      if (!token && !isLoginPage) {
        router.push('/admin/login');
        setIsAuthenticated(false);
      } else if (token && isLoginPage) {
        router.push('/admin/dashboard');
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(!!token);
        if (token) {
          const admin = getAdminData();
          setAdminData(admin);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    }
  }, [pathname, router, mounted]);

  const handleLogout = () => {
    logout();
  };

  // Show loading state while checking authentication or not mounted
  if (!mounted || isAuthenticated === null) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  // Allow access to login page without token - no sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Protect other admin pages
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className={styles.mainLayout}>
      <style>{`
        body {
          overflow: ${isAuthenticated ? 'hidden' : 'auto'};
        }
          .quick-chat-wrapper{display: none!important;}
      `}</style>
      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
      >
        {/* Sidebar Header */}
        <div className={styles.sidebarHeader}>
          {sidebarOpen && (
            <div className={styles.headerContent}>
              <div className={styles.logoIcon}>
                SA
              </div>
              <div>
                <p className={styles.headerText}>Siama CMS Admin</p>
                <p className={styles.headerSubtext}>Control center</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={styles.toggleButton}
            aria-label="Toggle sidebar"
          >
            <svg
              className={`${styles.toggleIcon} ${!sidebarOpen ? styles.rotated : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {/* <a
            href="/admin/dashboard"
            className={`group flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-sm border ${
              pathname === '/admin/dashboard'
                ? 'bg-blue-50 border-blue-100 text-blue-700 shadow-sm'
                : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-200'
            }`}
          >
            <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center text-[11px] font-semibold">
              D
            </span>
            {sidebarOpen && <span className="text-sm font-medium">Dashboard</span>}
          </a> */}

          {/* <a
            href="/admin/leads"
            className={`group flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-sm border ${
              pathname === '/admin/leads'
                ? 'bg-blue-50 border-blue-100 text-blue-700 shadow-sm'
                : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-200'
            }`}
          >
            <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center text-[11px] font-semibold">
              L
            </span>
            {sidebarOpen && <span className="text-sm font-medium">Leads</span>}
          </a> */}

          {/* <a
            href="/admin/categories"
            className={`group flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-sm border ${
              pathname === '/admin/categories'
                ? 'bg-blue-50 border-blue-100 text-blue-700 shadow-sm'
                : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-200'
            }`}
          >
            <span className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center text-[11px] font-semibold">
              C
            </span>
            {sidebarOpen && <span className="text-sm font-medium">Categories</span>}
          </a> */}

          {/* <a
            href="/admin/sub-categories"
            className={`group flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-sm border ${
              pathname === '/admin/sub-categories'
                ? 'bg-blue-50 border-blue-100 text-blue-700 shadow-sm'
                : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-200'
            }`}
          >
            <span className="w-6 h-6 rounded-md bg-yellow-50 text-yellow-600 flex items-center justify-center text-[11px] font-semibold">
              SC
            </span>
            {sidebarOpen && <span className="text-sm font-medium">Sub-Categories</span>}
          </a> */}

          {/* <a
            href="/admin/conditions"
            className={`group flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-sm border ${
              pathname === '/admin/conditions'
                ? 'bg-blue-50 border-blue-100 text-blue-700 shadow-sm'
                : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-200'
            }`}
          >
            <span className="w-6 h-6 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center text-[11px] font-semibold">
              CN
            </span>
            {sidebarOpen && <span className="text-sm font-medium">Conditions</span>}
          </a> */}


          <a
            href="/admin/services"
            className={`${styles.navLink} ${pathname === '/admin/services' ? styles.active : ''}`}
          >
            <span className={`${styles.navIcon} ${styles.teal}`}>
              S
            </span>
            {sidebarOpen && <span className={styles.navText}>Services</span>}
          </a>
          <a href="/admin/coupons" className={`${styles.navLink} ${pathname === '/admin/coupons' ? styles.active : ''}`}>
            <span className={`${styles.navIcon} ${styles.green}`}>
              C
            </span>
            {sidebarOpen && <span className={styles.navText}>Coupons</span>}
          </a>
 <a
            href="/admin/blogs"
            className={`${styles.navLink} ${pathname === '/admin/blogs' ? styles.active : ''}`}
          >
            <span className={`${styles.navIcon} ${styles.teal}`}>
              B
            </span>
            {sidebarOpen && <span className={styles.navText}>Blogs</span>}
          </a>
          <a
            href="/admin/product-sessions"
            className={`${styles.navLink} ${pathname === '/admin/product-sessions' ? styles.active : ''}`}
          >
            <span className={`${styles.navIcon} ${styles.purple}`}>
              PS
            </span>
            {sidebarOpen && <span className={styles.navText}>Product Sessions</span>}
          </a>

          <a
            href="/admin/user-mobile-sessions"
            className={`${styles.navLink} ${pathname === '/admin/user-mobile-sessions' ? styles.active : ''}`}
          >
            <span className={`${styles.navIcon} ${styles.orange}`}>
              UM
            </span>
            {sidebarOpen && <span className={styles.navText}>User Mobile Sessions</span>}
          </a>

          <a
            href="/admin/bookings"
            className={`${styles.navLink} ${pathname === '/admin/bookings' ? styles.active : ''}`}
          >
            <span className={`${styles.navIcon} ${styles.blue}`}>
              B
            </span>
            {sidebarOpen && <span className={styles.navText}>Orders</span>}
          </a>

          {/* <a
            href="/admin/lead-captures"
            className={`group flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-sm border ${
              pathname === '/admin/lead-captures'
                ? 'bg-blue-50 border-blue-100 text-blue-700 shadow-sm'
                : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-200'
            }`}
          >
            <span className="w-6 h-6 rounded-md bg-cyan-50 text-cyan-600 flex items-center justify-center text-[11px] font-semibold">
              LC
            </span>
            {sidebarOpen && <span className="text-sm font-medium">Lead Captures</span>}
          </a> */}
        </nav>

        {/* User Profile Section */}
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {adminData?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            {sidebarOpen && (
              <div className={styles.userDetails}>
                <p className={styles.userName}>{adminData?.name || 'Admin'}</p>
                <p className={styles.userRole}>{adminData?.role?.replace('_', ' ') || 'Admin'}</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              Logout
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${styles.mainContent} ${sidebarOpen ? styles.contentWithOpenSidebar : styles.contentWithClosedSidebar}`}>
        {children}
      </div>
    </div>
  );
}

