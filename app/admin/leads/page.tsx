'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminData } from '@/utils/api/admin';
import { leadsApi, getAdminData as getAdmin, type Lead, type LeadStatistics, type LeadSearchParams } from '@/utils/api/admin';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statistics, setStatistics] = useState<LeadStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState<LeadSearchParams>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const router = useRouter();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, leadsRes] = await Promise.all([
        leadsApi.getStatistics(),
        leadsApi.search(filters),
      ]);

      if (statsRes.status === 'success' && statsRes.data) {
        setStatistics(statsRes.data);
      }

      if (leadsRes.status === 'success') {
        const data = leadsRes.data;
        if (Array.isArray(data)) {
          setLeads(data);
        }
        if (leadsRes.pagination) {
          setPagination(leadsRes.pagination);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadLeads = useCallback(async () => {
    try {
      setSearchLoading(true);
      const response = await leadsApi.search(filters);
      if (response.status === 'success') {
        const data = response.data;
        if (Array.isArray(data)) {
          setLeads(data);
        }
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setSearchLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const admin = getAdmin();
    if (!admin) {
      router.push('/admin/login');
      return;
    }
    loadData();
  }, [router, loadData]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const handleSearch = () => {
    setFilters({
      ...filters,
      search: searchTerm || undefined,
      page: 1,
    });
  };

  const handleFilterChange = (key: keyof LeadSearchParams, value: any) => {
    setFilters({
      ...filters,
      [key]: value || undefined,
      page: 1,
    });
  };

  const openLeadDetail = async (id: string) => {
    try {
      setShowDetail(true);
      setDetailLoading(true);
      const response = await leadsApi.getById(id);
      if (response.status === 'success' && response.data) {
        setSelectedLead(response.data);
      } else {
        const fallback = leads.find((l) => l._id === id) || null;
        setSelectedLead(fallback);
      }
    } catch (error) {
      console.error('Error fetching lead detail:', error);
      const fallback = leads.find((l) => l._id === id) || null;
      setSelectedLead(fallback);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeLeadDetail = () => {
    setShowDetail(false);
    setSelectedLead(null);
  };



  const handleExport = async () => {
    try {
      const response = await leadsApi.export(filters);
      if (response.status === 'success' && response.data) {
        // Convert to CSV
        const csv = convertToCSV(response.data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Failed to export leads. You may not have permission.');
    }
  };

  const convertToCSV = (data: Lead[]): string => {
    const headers = ['Name', 'Phone', 'City', 'State', 'Service', 'Status', 'Created At'];
    const rows = data.map(lead => {
      const dateStr = lead.created_at || lead.createdAt;
      return [
        lead.name,
        lead.number,
        lead.city || '',
        lead.state || '',
        lead.service?.name || '',
        lead.status || 'new',
        dateStr ? new Date(dateStr).toLocaleString() : 'N/A',
      ];
    });
    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      interested: 'bg-purple-100 text-purple-800',
      not_interested: 'bg-gray-100 text-gray-800',
      converted: 'bg-green-100 text-green-800',
      closed: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur border-b border-gray-200 h-16 flex items-center justify-between px-4 sticky top-0 z-20 shadow-sm">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900">Lead Management</h2>
          <p className="text-xs text-gray-500">Track and review incoming enquiries in one place.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm rounded-md hover:from-emerald-600 hover:to-emerald-700 transition-all font-medium flex items-center space-x-2 shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export</span>
          </button>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="bg-white/90 backdrop-blur rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">Overview</span>
              </div>
              <h4 className="text-xs font-semibold text-gray-600 mb-1">Total Leads</h4>
              <p className="text-3xl font-bold text-gray-900">{statistics.total}</p>
              <p className="text-[11px] text-gray-500 mt-1">Across all time</p>
            </div>

            <div className="bg-white/90 backdrop-blur rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">Today</span>
              </div>
              <h4 className="text-xs font-semibold text-gray-600 mb-1">Today&apos;s Leads</h4>
              <p className="text-3xl font-bold text-gray-900">{statistics.today}</p>
              <p className="text-[11px] text-gray-500 mt-1">New enquiries today</p>
            </div>

            <div className="bg-white/90 backdrop-blur rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100">7 Days</span>
              </div>
              <h4 className="text-xs font-semibold text-gray-600 mb-1">Last 7 Days</h4>
              <p className="text-3xl font-bold text-gray-900">{statistics.last7Days}</p>
              <p className="text-[11px] text-gray-500 mt-1">Weekly trend</p>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white/90 backdrop-blur rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-100">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-blue-900">Filters & Search</h3>
              <span className="text-[11px] text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">Refine results</span>
            </div>
            <button
              onClick={() => {
                setFilters({ page: 1, limit: 20, sortBy: 'createdAt', sortOrder: 'desc' });
                setSearchTerm('');
              }}
              className="text-xs text-blue-700 hover:text-blue-900 font-medium px-2 py-1 rounded-md hover:bg-blue-100 transition-colors border border-blue-100 bg-blue-50"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-blue-800 mb-1.5">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Name, phone, city..."
                  className="w-full pl-10 pr-3 py-2 text-sm bg-white border-2 border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-gray-700 placeholder-gray-400 shadow-inner"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-800 mb-1.5">City</label>
              <input
                type="text"
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                placeholder="Filter by city"
                className="w-full px-3 py-2 text-sm bg-white border-2 border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-gray-700 placeholder-gray-400 shadow-inner"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-800 mb-1.5">Date From</label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border-2 border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-gray-700 shadow-inner"
              />
            </div>
          </div>
          <div className="flex items-center justify-end mt-3 pt-3 border-t border-blue-100">
            <button
              onClick={handleSearch}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-sm rounded-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all font-medium flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white/95 backdrop-blur rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px]">
              <thead className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">City</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Service</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Created</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {searchLoading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                      No leads found
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-indigo-50/40 transition-colors border-b border-gray-100 align-middle">
                      <td className="px-5 py-3 whitespace-nowrap align-middle">
                        <div className="text-sm font-semibold text-gray-900 leading-5">{lead.name}</div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap align-middle">
                        <div className="text-sm text-gray-900 leading-5">{lead.number}</div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap align-middle">
                        <div className="text-sm text-gray-900 leading-5">{lead.city || 'N/A'}</div>
                        {lead.state && <div className="text-xs text-gray-500 leading-4">{lead.state}</div>}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap align-middle">
                        <div className="text-sm text-gray-900 leading-5">{lead.service?.name || 'N/A'}</div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap align-middle">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${getStatusColor(lead.status || 'new')}`}>
                          {lead.status || 'new'}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500 align-middle">
                        {(lead.created_at || lead.createdAt) 
                          ? new Date(lead.created_at || lead.createdAt || '').toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap align-middle">
                        <button
                          onClick={() => openLeadDetail(lead._id)}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full hover:bg-blue-100 transition-colors shadow-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-gray-700">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-full hover:bg-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-full hover:bg-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Lead Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40 px-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 via-white to-gray-50">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedLead?.name || 'Lead detail'}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedLead?.number ? `Phone: ${selectedLead.number}` : 'Phone not available'}
                </p>
              </div>
              <button
                onClick={closeLeadDetail}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5">
              {detailLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-semibold text-gray-900">{selectedLead?.name || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-900">{selectedLead?.number || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Gender</p>
                    <p className="font-semibold text-gray-900 capitalize">{selectedLead?.gender || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Status</p>
                    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${getStatusColor(selectedLead?.status || 'new')}`}>
                      {selectedLead?.status || 'new'}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">City</p>
                    <p className="font-semibold text-gray-900">{selectedLead?.city || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">State</p>
                    <p className="font-semibold text-gray-900">{selectedLead?.state || 'N/A'}</p>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="font-semibold text-gray-900">{selectedLead?.address || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Service</p>
                    <p className="font-semibold text-gray-900">{selectedLead?.service?.name || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="font-semibold text-gray-900">
                      {(selectedLead?.created_at || selectedLead?.createdAt)
                        ? new Date(selectedLead?.created_at || selectedLead?.createdAt || '').toLocaleString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-xs text-gray-500">Notes</p>
                    <p className="font-semibold text-gray-900">{selectedLead?.notes || 'N/A'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

