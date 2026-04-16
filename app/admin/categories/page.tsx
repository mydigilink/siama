'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  categoriesApi,
  type Category,
  type CategoryPayload,
  type CategorySearchParams,
} from '@/utils/api/admin';

const PAGE_SIZE = 20;

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState<CategorySearchParams>({
    page: 1,
    limit: PAGE_SIZE,
    sortBy: 'priority',
    sortOrder: 'asc',
  });
  const [searchTerm, setSearchTerm] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState<CategoryPayload>({
    name: '',
    description: '',
    image: '',
    priority: 1,
    status: true,
    type: 'service',
    slug: '',
  });

  const [showDetail, setShowDetail] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      setLoading((prev) => prev && categories.length === 0);
      setSearchLoading(true);
      const response = await categoriesApi.search(filters);
      if (response.status === 'success' && response.data) {
        setCategories(response.data);
        if (response.pagination) {
          setPagination({
            page: response.pagination.page,
            limit: response.pagination.limit,
            total: response.pagination.total,
            totalPages: response.pagination.totalPages,
          });
        }
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- omit categories.length to avoid refetch when data arrives
  }, [filters]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleSearch = () => {
    setFilters({
      ...filters,
      search: searchTerm || undefined,
      page: 1,
    });
  };

  const handleFilterChange = (key: keyof CategorySearchParams, value: any) => {
    setFilters({
      ...filters,
      [key]: value || undefined,
      page: 1,
    });
  };

  const openCreate = () => {
    setIsEdit(false);
    setFormData({
      name: '',
      description: '',
      image: '',
      priority: 1,
      status: true,
      type: 'service',
      slug: '',
    });
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setIsEdit(true);
    setFormData({
      name: cat.name || '',
      description: cat.description || '',
      image: cat.image || '',
      priority: cat.priority ?? 1,
      status: cat.status ?? true,
      type: cat.type || 'service',
      slug: cat.slug || '',
    });
    setSelectedCategory(cat);
    setShowForm(true);
  };

  const submitForm = async () => {
    try {
      setSubmitting(true);
      const payload: CategoryPayload = {
        ...formData,
        priority: Number(formData.priority) || 0,
      };

      if (isEdit && selectedCategory?._id) {
        await categoriesApi.update(selectedCategory._id, payload);
      } else {
        await categoriesApi.create(payload);
      }
      setShowForm(false);
      await loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      await categoriesApi.toggleStatus(id);
      await loadCategories();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to toggle status.');
    }
  };

  const openDetail = async (id: string) => {
    try {
      setShowDetail(true);
      setDetailLoading(true);
      const response = await categoriesApi.getById(id);
      if (response.status === 'success' && response.data) {
        setSelectedCategory(response.data);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setShowDetail(false);
    setSelectedCategory(null);
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
          <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
          <p className="text-xs text-gray-500">Manage service categories (status change, create/edit).</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white text-sm rounded-md hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 transition-all font-semibold shadow-md"
          >
            New Category
          </button>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Filters */}
        <div className="bg-white/90 backdrop-blur rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-100">
                <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-blue-900">Filters & Search</h3>
              <span className="text-[11px] text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">Refine</span>
            </div>
            <button
              onClick={() => {
                setFilters({ page: 1, limit: PAGE_SIZE, sortBy: 'priority', sortOrder: 'asc' });
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
                  placeholder="Name, slug..."
                  className="w-full pl-10 pr-3 py-2 text-sm bg-white border-2 border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-gray-700 placeholder-gray-400 shadow-inner"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-800 mb-1.5">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border-2 border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-gray-700"
              >
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-800 mb-1.5">Sort</label>
              <select
                value={filters.sortBy || 'priority'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border-2 border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-gray-700"
              >
                <option value="priority">Priority</option>
                <option value="created_at">Created</option>
                <option value="name">Name</option>
              </select>
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

        {/* Table */}
        <div className="bg-white/95 backdrop-blur rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px]">
              <thead className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Priority</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Updated</th>
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
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                      No categories found
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-indigo-50/40 transition-colors border-b border-gray-100 align-middle">
                      <td className="px-5 py-3 whitespace-nowrap align-middle">
                        <div className="text-sm font-semibold text-gray-900 leading-5">{cat.name}</div>
                        {cat.slug && <div className="text-xs text-gray-500">/{cat.slug}</div>}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap align-middle">
                        <div className="text-sm text-gray-900 leading-5 capitalize">{cat.type || 'service'}</div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap align-middle">
                        <div className="text-sm text-gray-900 leading-5">{cat.priority ?? '-'}</div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap align-middle">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${cat.status ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                          {cat.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500 align-middle">
                        {cat.updated_at ? new Date(cat.updated_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap align-middle flex items-center space-x-2">
                        <button
                          onClick={() => openDetail(cat._id)}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full hover:bg-blue-100 transition-colors shadow-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openEdit(cat)}
                          className="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 rounded-full hover:bg-amber-100 transition-colors shadow-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleStatus(cat._id)}
                          className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full hover:bg-emerald-100 transition-colors shadow-sm"
                        >
                          Toggle
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
                  onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                  disabled={pagination.page === 1}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-full hover:bg-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
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

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40 px-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-amber-50 via-yellow-50 to-white">
              <div>
                <p className="text-sm font-semibold text-gray-900">{isEdit ? 'Edit Category' : 'New Category'}</p>
                <p className="text-xs text-gray-500">Fill the details and submit.</p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Name *</label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                    placeholder="Category name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Slug (optional)</label>
                  <input
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                    placeholder="home-cleaning"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Type</label>
                  <input
                    value={formData.type || ''}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                    placeholder="service"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Priority</label>
                  <input
                    type="number"
                    value={formData.priority ?? 0}
                    onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                    placeholder="1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Image URL</label>
                  <input
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                    rows={3}
                    placeholder="Short description"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.status ?? true}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                    className="h-4 w-4 text-amber-500 border-gray-300 rounded focus:ring-amber-400"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </div>
              </div>
            </div>

            <div className="px-5 pb-4 flex items-center justify-end space-x-2 border-t border-gray-100 pt-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitForm}
                disabled={submitting || !formData.name.trim()}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 rounded-md hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 transition-all shadow-md disabled:opacity-60"
              >
                {submitting ? 'Saving...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40 px-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 via-white to-gray-50">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedCategory?.name || 'Category detail'}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedCategory?.slug ? `/${selectedCategory.slug}` : '—'}
                </p>
              </div>
              <button
                onClick={closeDetail}
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
                    <p className="font-semibold text-gray-900">{selectedCategory?.name || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Slug</p>
                    <p className="font-semibold text-gray-900">{selectedCategory?.slug || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="font-semibold text-gray-900 capitalize">{selectedCategory?.type || 'service'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Priority</p>
                    <p className="font-semibold text-gray-900">{selectedCategory?.priority ?? 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Status</p>
                    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${selectedCategory?.status ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                      {selectedCategory?.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-xs text-gray-500">Description</p>
                    <p className="font-semibold text-gray-900">{selectedCategory?.description || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="font-semibold text-gray-900">
                      {selectedCategory?.created_at ? new Date(selectedCategory.created_at).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Updated</p>
                    <p className="font-semibold text-gray-900">
                      {selectedCategory?.updated_at ? new Date(selectedCategory.updated_at).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-xs text-gray-500">Image</p>
                    <p className="font-semibold text-gray-900 break-all">{selectedCategory?.image || 'N/A'}</p>
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


