'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminData, checkHealth } from '@/utils/api/admin';
import type { AdminData, ApiResponse } from '@/utils/api/admin';

export default function AdminDashboardPage() {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [healthStatus, setHealthStatus] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const admin = getAdminData();
    if (!admin) {
      router.push('/admin/login');
      return;
    }
    setAdminData(admin);

    // Check API health
    checkHealth()
      .then((response) => {
        setHealthStatus(response);
      })
      .catch((err) => {
        console.error('Health check failed:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4 sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
        </div>
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors relative">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="p-4">
          {/* Welcome Section */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              Welcome back, {adminData?.name || 'Admin'}! 👋
            </h3>
            <p className="text-sm text-gray-600">Here&apos;s what&apos;s happening with your platform today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-100 rounded-md">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <h4 className="text-xs font-medium text-gray-600 mb-1">Total Users</h4>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-100 rounded-md">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
              <h4 className="text-xs font-medium text-gray-600 mb-1">Total Orders</h4>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-100 rounded-md">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h4 className="text-xs font-medium text-gray-600 mb-1">Revenue</h4>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-orange-100 rounded-md">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <h4 className="text-xs font-medium text-gray-600 mb-1">Growth</h4>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
          </div>

          {/* Admin Info Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Admin Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Name</p>
                <p className="text-sm font-semibold text-gray-900">{adminData?.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Phone</p>
                <p className="text-sm font-semibold text-gray-900">{adminData?.phone}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
                <p className="text-sm font-semibold text-gray-900">{adminData?.email}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Role</p>
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 capitalize">
                  {adminData?.role?.replace('_', ' ')}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Status</p>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                  adminData?.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {adminData?.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Last Login</p>
                <p className="text-sm font-semibold text-gray-900">
                  {adminData?.last_login 
                    ? new Date(adminData.last_login).toLocaleString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* API Health Status */}
          {healthStatus && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">API Health Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Status</p>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                    healthStatus.status === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {healthStatus.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Service</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {healthStatus.data?.service || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Database</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {healthStatus.data?.database || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Uptime</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {healthStatus.data?.uptime ? `${healthStatus.data.uptime}s` : 'N/A'}
                  </p>
                </div>
              </div>
              {healthStatus.message && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600">{healthStatus.message}</p>
                </div>
              )}
            </div>
          )}
        </main>
    </>
  );
}
