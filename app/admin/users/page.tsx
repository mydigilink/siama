'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usersApi, type AdminUser, type AdminUserPayload, type AdminUserSearchParams } from '@/utils/api/admin';

const PAGE_SIZE = 20;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState<AdminUserSearchParams>({
    page: 1,
    limit: PAGE_SIZE,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [searchTerm, setSearchTerm] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [resetPassword, setResetPassword] = useState('');

  const [formData, setFormData] = useState<AdminUserPayload>({
    name: '',
    phone: '',
    email: '',
    password: '',
    gender: '',
    state: '',
    city: '',
    pincode: '',
    address: '',
  });

  const loadUsers = useCallback(async () => {
    try {
      setLoading((prev) => prev && users.length === 0);
      setSearchLoading(true);
      const response = await usersApi.search({ ...filters, search: searchTerm || filters.search });
      if (response.status === 'success' && response.data) {
        setUsers(response.data);
        const meta = response.pagination as any;
        if (meta) {
          setPagination({
            page: meta.page,
            limit: meta.limit,
            total: meta.total,
            totalPages: meta.totalPages,
          });
        }
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- omit users.length to avoid refetch when data arrives
  }, [filters, searchTerm]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearch = () => {
    setFilters({
      ...filters,
      search: searchTerm || undefined,
      page: 1,
    });
  };

  const handleFilterChange = (key: keyof AdminUserSearchParams, value: any) => {
    if (key === 'page') {
      setFilters({
        ...filters,
        page: value || 1,
      });
    } else {
      setFilters({
        ...filters,
        [key]: value || undefined,
        page: 1,
      });
    }
  };

  const openCreate = () => {
    setIsEdit(false);
    setSelectedUser(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      password: '',
      gender: '',
      state: '',
      city: '',
      pincode: '',
      address: '',
    });
    setShowForm(true);
  };

  const openEdit = (user: AdminUser) => {
    setIsEdit(true);
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      email: user.email || '',
      password: '',
      gender: user.gender || '',
      state: user.state || '',
      city: user.city || '',
      pincode: user.pincode || '',
      address: user.address || '',
    });
    setShowForm(true);
  };

  const submitForm = async () => {
    if (!formData.phone && !formData.email) {
      alert('Provide at least phone or email.');
      return;
    }
    if (!isEdit && !formData.password) {
      alert('Password is required for new users.');
      return;
    }
    try {
      setSubmitting(true);
      const payload: AdminUserPayload = {
        ...formData,
        password: formData.password?.trim() || undefined,
      };
      if (isEdit && selectedUser?._id) {
        delete payload.password;
        await usersApi.update(selectedUser._id, payload);
      } else {
        await usersApi.create(payload);
      }
      setShowForm(false);
      await loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user.');
    } finally {
      setSubmitting(false);
    }
  };

  const openDetail = async (user: AdminUser) => {
    try {
      setShowDetail(true);
      setSelectedUser(user);
      setDetailLoading(true);
      const response = await usersApi.getById(user._id);
      if (response.status === 'success' && response.data) {
        setSelectedUser(response.data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const openResetPassword = (user: AdminUser) => {
    setSelectedUser(user);
    setResetPassword('');
    setShowReset(true);
  };

  const submitResetPassword = async () => {
    if (!resetPassword.trim() || !selectedUser?._id) return;
    try {
      setResetLoading(true);
      await usersApi.resetPassword(selectedUser._id, resetPassword.trim());
      setShowReset(false);
      setResetPassword('');
      alert('Password reset successfully.');
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Failed to reset password.');
    } finally {
      setResetLoading(false);
    }
  };

  const selectedUserName = useMemo(() => selectedUser?.name || 'User', [selectedUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <header className="bg-white/90 backdrop-blur border-b border-gray-200 h-16 flex items-center justify-between px-4 sticky top-0 z-20 shadow-sm">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900">Users</h2>
          <p className="text-xs text-gray-500">Search, create, edit, and reset passwords for users.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-sm rounded-md hover:shadow-md hover:translate-y-[1px] transition-all font-semibold"
          >
            New User
          </button>
        </div>
      </header>

      <main className="p-4 space-y-4">
        <div className="bg-white/90 backdrop-blur rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-semibold text-blue-900">Filters & Search</h3>
              <span className="text-[11px] text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">Refine</span>
            </div>
            <button
              onClick={() => {
                setFilters({ page: 1, limit: PAGE_SIZE, sortBy: 'createdAt', sortOrder: 'desc' });
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
                  placeholder="Name, phone, email..."
                  className="w-full pl-10 pr-3 py-2 text-sm bg-white border-2 border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-gray-700 placeholder-gray-400 shadow-inner"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-800 mb-1.5">Sort By</label>
              <select
                value={filters.sortBy || 'createdAt'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border-2 border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-gray-700"
              >
                <option value="createdAt">Created</option>
                <option value="updatedAt">Updated</option>
                <option value="name">Name</option>
                <option value="phone">Phone</option>
                <option value="email">Email</option>
                <option value="gender">Gender</option>
                <option value="state">State</option>
                <option value="city">City</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-800 mb-1.5">Sort Order</label>
              <select
                value={filters.sortOrder || 'desc'}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border-2 border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-gray-700"
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <button
              onClick={handleSearch}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px]">
              <thead className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Name</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Contact</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Location</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Gender</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Created</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {searchLoading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user, idx) => (
                    <tr
                      key={user._id}
                      className={`transition-colors align-middle ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'} hover:bg-indigo-50/60`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap align-middle">
                        <div className="text-[13px] font-semibold text-gray-900 leading-5">{user.name || '—'}</div>
                        {user.email && <div className="text-xs text-gray-500">{user.email}</div>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap align-middle">
                        <div className="text-[13px] text-gray-900 leading-5">{user.phone || '—'}</div>
                        {user.email_verified && <span className="text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">Email verified</span>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap align-middle">
                        <div className="text-[13px] text-gray-900 leading-5">
                          {user.city || user.state ? `${user.city || ''}${user.city && user.state ? ', ' : ''}${user.state || ''}` : '—'}
                        </div>
                        {user.pincode && <div className="text-xs text-gray-500">Pincode: {user.pincode}</div>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap align-middle">
                        <span className="text-[13px] text-gray-900 leading-5">{user.gender || '—'}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap align-middle">
                        <div className="text-[13px] text-gray-900 leading-5">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap align-middle flex items-center space-x-2">
                        <button
                          onClick={() => openDetail(user)}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full hover:bg-blue-100 transition-all shadow-sm hover:shadow"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openEdit(user)}
                          className="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 rounded-full hover:bg-amber-100 transition-all shadow-sm hover:shadow"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openResetPassword(user)}
                          className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-100 rounded-full hover:bg-purple-100 transition-all shadow-sm hover:shadow"
                        >
                          Reset
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
            <div className="text-xs text-gray-600">
              Page {pagination.page} of {pagination.totalPages || 1} · {pagination.total} total
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => pagination.page > 1 && handleFilterChange('page', (pagination.page || 1) - 1)}
                className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-50"
                disabled={pagination.page <= 1}
              >
                Prev
              </button>
              <button
                onClick={() => pagination.page < (pagination.totalPages || 1) && handleFilterChange('page', (pagination.page || 1) + 1)}
                className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-50"
                disabled={pagination.page >= (pagination.totalPages || 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-30 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  {isEdit ? 'Edit User' : 'New User'}
                  {isEdit && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {selectedUser?.name || 'User'}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-500">Provide contact and address details. Phone or email is required.</p>
              </div>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700 text-lg leading-none">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <section className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900">Basic Info</h4>
                    <span className="text-[11px] text-gray-500">Required</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Field
                      label="Name"
                      value={formData.name || ''}
                      onChange={(v) => setFormData({ ...formData, name: v })}
                    />
                    <Field
                      label="Phone"
                      value={formData.phone || ''}
                      onChange={(v) => setFormData({ ...formData, phone: v })}
                      placeholder="+91..."
                    />
                    <Field
                      label="Email"
                      value={formData.email || ''}
                      onChange={(v) => setFormData({ ...formData, email: v })}
                      type="email"
                    />
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-semibold text-gray-700">Gender</label>
                      <select
                        value={formData.gender || ''}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-gray-900"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  {!isEdit && (
                    <div className="grid grid-cols-1">
                      <Field
                        label="Password"
                        type="password"
                        value={formData.password || ''}
                        onChange={(v) => setFormData({ ...formData, password: v })}
                        placeholder="Set a strong password"
                      />
                    </div>
                  )}
                  {isEdit && (
                    <div className="text-[11px] text-gray-500 bg-white border border-gray-100 rounded-lg px-3 py-2">
                      Password unchanged. Use Reset action from list if you need to set a new one.
                    </div>
                  )}
                  <div className="text-[11px] text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                    At least one of Phone or Email must be provided.
                  </div>
                </section>

                <section className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900">Address</h4>
                    <span className="text-[11px] text-gray-500">Optional</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Field
                      label="State"
                      value={formData.state || ''}
                      onChange={(v) => setFormData({ ...formData, state: v })}
                    />
                    <Field
                      label="City"
                      value={formData.city || ''}
                      onChange={(v) => setFormData({ ...formData, city: v })}
                    />
                    <Field
                      label="Pincode"
                      value={formData.pincode || ''}
                      onChange={(v) => setFormData({ ...formData, pincode: v })}
                    />
                    <Field
                      label="Address"
                      value={formData.address || ''}
                      onChange={(v) => setFormData({ ...formData, address: v })}
                      placeholder="House/Street..."
                    />
                  </div>
                </section>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100">
                Cancel
              </button>
              <button
                onClick={submitForm}
                disabled={submitting}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetail && selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-30 p-4" onClick={() => setShowDetail(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedUserName}</h3>
                <p className="text-xs text-gray-500">Full user details.</p>
              </div>
              <button onClick={() => setShowDetail(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="p-5 space-y-3">
              {detailLoading && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Refreshing...</span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <InfoRow label="Name" value={selectedUser.name} />
                <InfoRow label="Phone" value={selectedUser.phone} />
                <InfoRow label="Email" value={selectedUser.email} />
                <InfoRow label="Gender" value={selectedUser.gender} />
                <InfoRow label="State" value={selectedUser.state} />
                <InfoRow label="City" value={selectedUser.city} />
                <InfoRow label="Pincode" value={selectedUser.pincode} />
                <InfoRow label="Address" value={selectedUser.address} />
                <InfoRow label="Email Verified" value={selectedUser.email_verified ? 'Yes' : 'No'} />
                <InfoRow label="GST No" value={selectedUser.gst_no} />
                <InfoRow label="Created" value={selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : '—'} />
                <InfoRow label="Updated" value={selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleString() : '—'} />
              </div>
            </div>
            <div className="flex items-center justify-end px-5 py-4 border-t border-gray-100">
              <button onClick={() => setShowDetail(false)} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showReset && selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-30 p-4" onClick={() => setShowReset(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Reset Password</h3>
                <p className="text-xs text-gray-500">Set a new password for {selectedUserName}.</p>
              </div>
              <button onClick={() => setShowReset(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="p-5 space-y-3">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">New Password</label>
              <input
                type="password"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                placeholder="Enter new password"
              />
            </div>
            <div className="flex items-center justify-end space-x-3 px-5 py-4 border-t border-gray-100">
              <button onClick={() => setShowReset(false)} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                Cancel
              </button>
              <button
                onClick={submitResetPassword}
                disabled={resetLoading || !resetPassword.trim()}
                className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-60"
              >
                {resetLoading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
      <span className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">{label}</span>
      <span className="text-sm text-gray-900">{value || '—'}</span>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-xs font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-gray-900 placeholder-gray-400"
      />
    </div>
  );
}

