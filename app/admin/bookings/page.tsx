'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminData } from '@/utils/api/admin';
import { ordersApi, type Order, type OrderSearchParams } from '@/utils/api/admin';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState<OrderSearchParams>({
    page: 1,
    limit: 20,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const router = useRouter();

  const loadBookings = useCallback(async () => {
    try {
      setSearchLoading(true);
      const response = await ordersApi.getAll(filters);
      if (response.status === 'success') {
        const data = response.data;
        if (Array.isArray(data)) {
          setBookings(data);
        }
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setSearchLoading(false);
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const admin = getAdminData();
    if (!admin) {
      router.push('/admin/login');
      return;
    }
    loadBookings();
  }, [router, loadBookings]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedOrder) {
        setSelectedOrder(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedOrder]);

  const handleSearch = () => {
    setFilters({
      ...filters,
      page: 1,
    });
  };

  const handleFilterChange = (key: keyof OrderSearchParams, value: any) => {
    setFilters({
      ...filters,
      [key]: value || undefined,
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters({
      ...filters,
      page,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
            <p className="text-sm text-gray-600 mt-1">Manage and track all service orders</p>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Filters */}
        <div className="bg-white/90 backdrop-blur rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="initiated">Initiated</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white/90 backdrop-blur rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Orders ({pagination.total})</h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading orders...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600">No orders found</p>
            </div>
          ) : (
            <>
              <div className="overflow-auto hidden md:block scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 max-h-96 border border-gray-200 rounded-lg">
                <div className="min-w-full inline-block">
                  <table className="w-full">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-20">Order ID</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-28">Customer</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell min-w-32">Products</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-20">Amount</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell min-w-16">Status</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell min-w-16">Payment</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell min-w-24">Slot</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell min-w-24">Created</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-16">Actions</th>
                      </tr>
                    </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((order: Order) => (
                      <tr key={order._id} className="hover:bg-gray-50/50">
                        <td className="px-2 py-1 whitespace-nowrap">
                          <div className="text-xs font-medium text-gray-900">
                            {order.orderId}
                          </div>
                        </td>
                        <td className="px-2 py-1">
                          <div>
                            <div className="text-xs font-medium text-gray-900 truncate max-w-24">
                              {order.customerName || order.user?.name || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500 truncate max-w-24">
                              {order.customerPhone || order.user?.phone || order.address?.phoneNumber || ''}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-1 hidden md:table-cell">
                          <div className="text-xs text-gray-900">
                            {order.products.length > 0 ? (
                              <div>
                                {order.products.slice(0, 1).map((product: any, index: number) => (
                                  <div key={product._id} className="mb-1 truncate max-w-28" title={`${product.productId.name} ${product.sessionName ? `(${product.sessionName})` : ''} x${product.quantity}`}>
                                    {product.productId.name} {product.sessionName ? `(${product.sessionName})` : ''} x{product.quantity}
                                  </div>
                                ))}
                                {order.products.length > 1 && (
                                  <div className="text-xs text-gray-500">
                                    +{order.products.length - 1} more
                                  </div>
                                )}
                              </div>
                            ) : 'N/A'}
                          </div>
                        </td>
                        <td className="px-2 py-1 whitespace-nowrap">
                          <div className="text-xs text-gray-900">
                            ₹{order.payableAmount.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.paymentType}
                          </div>
                        </td>
                        <td className="px-2 py-1 whitespace-nowrap hidden sm:table-cell">
                          <span className={`inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-2 py-1 whitespace-nowrap hidden lg:table-cell">
                          <span className={`inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-2 py-1 whitespace-nowrap hidden xl:table-cell text-xs text-gray-900">
                          {order.slot ? formatDate(order.slot) : 'N/A'}
                        </td>
                        <td className="px-2 py-1 whitespace-nowrap hidden xl:table-cell text-xs text-gray-500">
                          {formatDate(order.createAt)}
                        </td>
                        <td className="px-2 py-1 whitespace-nowrap text-xs font-medium">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded text-xs font-medium transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>

              {/* Mobile Card View - visible only on small screens */}
              <div className="md:hidden space-y-4">
                {bookings.map((order: Order) => (
                  <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <div className="text-xs font-medium text-gray-900">
                          Order #{order.orderId}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(order.createAt)}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded text-xs font-medium transition-colors"
                      >
                        View
                      </button>
                    </div>

                    <div className="space-y-1 mb-2">
                      <div>
                        <div className="text-xs font-medium text-gray-900 truncate">
                          {order.customerName || order.user?.name || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {order.customerPhone || order.user?.phone || order.address?.phoneNumber || ''}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-700 font-medium">Services:</div>
                        <div className="text-xs text-gray-900">
                          {order.products.length > 0 ? (
                            <div>
                              {order.products.slice(0, 2).map((product: any, index: number) => (
                                <div key={product._id} className="mb-1 truncate" title={`${product.productId.name} ${product.sessionName ? `(${product.sessionName})` : ''} x${product.quantity}`}>
                                  {product.productId.name} {product.sessionName ? `(${product.sessionName})` : ''} x{product.quantity}
                                </div>
                              ))}
                              {order.products.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{order.products.length - 2} more
                                </div>
                              )}
                            </div>
                          ) : 'N/A'}
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <div>
                          <div className="font-medium text-gray-900">
                            ₹{order.payableAmount.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.paymentType}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-1">
                            {order.slot ? formatDate(order.slot) : 'No slot'}
                          </div>
                          <div className="flex space-x-1">
                            <span className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            <span className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded ${getPaymentStatusColor(order.paymentStatus)}`}>
                              {order.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-6 space-y-6">
              {/* Order Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Order ID:</span>
                      <p className="text-sm text-gray-900">{selectedOrder.orderId}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Payment Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Payment Type:</span>
                      <p className="text-sm text-gray-900">{selectedOrder.paymentType}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Created:</span>
                      <p className="text-sm text-gray-900">{formatDate(selectedOrder.createAt)}</p>
                    </div>
                    {selectedOrder.slot && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Appointment Slot:</span>
                        <p className="text-sm text-gray-900">{formatDate(selectedOrder.slot)}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Name:</span>
                      <p className="text-sm text-gray-900">{selectedOrder.customerName || selectedOrder.user?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Phone:</span>
                      <p className="text-sm text-gray-900">{selectedOrder.customerPhone || selectedOrder.user?.phone || selectedOrder.address?.phoneNumber || 'N/A'}</p>
                    </div>
                    {selectedOrder.customerEmail && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Email:</span>
                        <p className="text-sm text-gray-900">{selectedOrder.customerEmail}</p>
                      </div>
                    )}
                    {(selectedOrder.customerAddress || selectedOrder.address) && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Address:</span>
                        <div className="text-sm text-gray-900">
                          {selectedOrder.customerAddress ? (
                            <>
                              <p>{selectedOrder.customerAddress.street}</p>
                              <p>{selectedOrder.customerAddress.city}, {selectedOrder.customerAddress.state} {selectedOrder.customerAddress.pincode}</p>
                            </>
                          ) : selectedOrder.address ? (
                            <>
                              <p>{selectedOrder.address.address}</p>
                              <p>{selectedOrder.address.building}</p>
                              <p>{selectedOrder.address.landmark}</p>
                              <p>{selectedOrder.address.city}, {selectedOrder.address.pinCode}</p>
                            </>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Products</h3>
                <div className="space-y-4">
                  {selectedOrder.products.map((product, index) => (
                    <div key={product._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <img
                          src={product.productId.image || '/placeholder-image.jpg'}
                          alt={product.productId.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.jpg';
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{product.productId.name}</h4>
                          <p className="text-sm text-gray-500">{product.productId.category} - {product.productId.sub_category}</p>
                          {product.sessionName && (
                            <p className="text-sm text-blue-600">Session: {product.sessionName}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm text-gray-600">Quantity: {product.quantity}</span>
                            <span className="text-sm font-medium text-gray-900">₹{product.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Subtotal:</span>
                      <span className="text-sm font-medium">₹{selectedOrder.subTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Service Charge:</span>
                      <span className="text-sm font-medium">₹{selectedOrder.serviceCharge.toLocaleString()}</span>
                    </div>
                    {selectedOrder.visitingCharge > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Visiting Charge:</span>
                        <span className="text-sm font-medium">₹{selectedOrder.visitingCharge.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedOrder.cuponDiscount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-green-600">Coupon Discount:</span>
                        <span className="text-sm font-medium text-green-600">-₹{selectedOrder.cuponDiscount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="text-base font-medium text-gray-900">Total Amount:</span>
                      <span className="text-base font-bold text-gray-900">₹{selectedOrder.payableAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {selectedOrder.ip && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">IP Address:</span>
                        <p className="text-sm text-gray-900">{selectedOrder.ip}</p>
                      </div>
                    )}
                    {selectedOrder.userAgent && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">User Agent:</span>
                        <p className="text-sm text-gray-900 truncate">{selectedOrder.userAgent}</p>
                      </div>
                    )}
                    {selectedOrder.referrer && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Referrer:</span>
                        <p className="text-sm text-gray-900 truncate">{selectedOrder.referrer}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}