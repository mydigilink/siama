'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getAllProductSessions,
  createProductSession,
  updateProductSession,
  deleteProductSession,
  type ProductSession,
  type CreateProductSessionDto,
  type UpdateProductSessionDto,
} from '@/utils/api/productSessions';
import { servicesApi, type Service } from '@/utils/api/admin';
import styles from './page.module.scss';

export default function ProductSessionsPage() {
  const [sessions, setSessions] = useState<ProductSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSessions, setTotalSessions] = useState(0);
  const [limit] = useState(10);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState<ProductSession | null>(null);
  
  // Service search states
  const [services, setServices] = useState<Service[]>([]);
  const [serviceSearch, setServiceSearch] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState<CreateProductSessionDto>({
    productId: '',
    count: 1,
    basePrice: 0,
    discount: 0,
  });

  // Fetch all sessions on mount and when page changes
  useEffect(() => {
    fetchAllSessions(currentPage);
  }, [currentPage]);

  // Fetch services when search query changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (serviceSearch.length >= 2) {
        fetchServices(serviceSearch);
      } else if (serviceSearch.length === 0) {
        fetchServices('');
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [serviceSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.searchableSelect}`)) {
        setShowServiceDropdown(false);
      }
    };

    if (showServiceDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showServiceDropdown]);

  const fetchAllSessions = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllProductSessions(page, limit);
      if (response.success && response.data) {
        setSessions(response.data);
        setTotalPages(response.pages || 1);
        setTotalSessions(response.total || 0);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sessions');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async (search: string = '') => {
    setLoadingServices(true);
    try {
      const response = await servicesApi.search({
        page: 1,
        limit: 20,
        sortBy: 'created_at',
        sortOrder: 'desc',
        search: search,
      });
      
      if (response.status === 'success' && response.data) {
        setServices(response.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch services:', err);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate service selection
    if (!selectedService && !formData.productId) {
      setError('Please select a service before creating a session');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await createProductSession(formData);
      if (response.success) {
        setSuccess('Session created successfully!');
        setShowModal(false);
        fetchAllSessions(currentPage);
        resetForm();
        setSelectedService(null);
        setServiceSearch('');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const updateData: UpdateProductSessionDto = {
        count: formData.count,
        basePrice: formData.basePrice,
        discount: formData.discount,
      };
      
      const response = await updateProductSession(editingSession._id, updateData);
      if (response.success) {
        setSuccess('Session updated successfully!');
        setShowModal(false);
        fetchAllSessions(currentPage);
        setEditingSession(null);
        resetForm();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update session');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await deleteProductSession(id);
      if (response.success) {
        setSuccess('Session deleted successfully!');
        fetchAllSessions(currentPage);
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete session');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setEditingSession(null);
    setSelectedService(null);
    setServiceSearch('');
    fetchServices(); // Load initial services
    setShowModal(true);
  };

  const openEditModal = (session: ProductSession) => {
    setEditingSession(session);
    setFormData({
      productId: session.productId,
      sessionId: session.sessionId, // Include sessionId for editing
      count: session.count,
      basePrice: session.basePrice,
      discount: session.discount,
    });
    setSelectedService(null);
    setServiceSearch('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSession(null);
    setSelectedService(null);
    setServiceSearch('');
    setShowServiceDropdown(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      count: 1,
      basePrice: 0,
      discount: 0,
    });
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setServiceSearch(service.name);
    setShowServiceDropdown(false);
    // Use service _id directly as product ID
    setFormData(prev => ({ ...prev, productId: service._id }));
  };

  const calculateFinalPrice = (basePrice: number, discount: number) => {
    return basePrice - (basePrice * discount / 100);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Product Session Pricing</h1>
          <p className={styles.subtitle}>
            Manage pricing for product sessions · {totalSessions} total sessions
          </p>
        </div>
        <button onClick={openCreateModal} className={styles.createButton}>
          + Create Session
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className={styles.alert + ' ' + styles.alertError}>
          <svg className={styles.alertIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className={styles.alert + ' ' + styles.alertSuccess}>
          <svg className={styles.alertIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {success}
        </div>
      )}

      {/* Loading State */}
      {loading && sessions.length === 0 && (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading sessions...</p>
        </div>
      )}

      {/* Sessions Table */}
      {!loading && sessions.length > 0 && (
        <div className={styles.tableContainer}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Slug</th>
                  <th>Session ID</th>
                  <th>Count</th>
                  <th>Base Price</th>
                  <th>Discount</th>
                  <th>Final Price</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session._id}>
                    <td>
                      <span className={styles.productName}>
                        {session.productName || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className={styles.productSlug}>
                        {session.productSlug || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className={styles.sessionId}>#{session.sessionId}</span>
                    </td>
                    <td>
                      <span className={styles.countBadge}>{session.count}</span>
                    </td>
                    <td>₹{session.basePrice.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={styles.discountBadge}>{session.discount}%</span>
                    </td>
                    <td>
                      <span className={styles.finalPrice}>
                        ₹{calculateFinalPrice(session.basePrice, session.discount).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td>{new Date(session.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          onClick={() => openEditModal(session)}
                          className={styles.editButton}
                          title="Edit"
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteSession(session._id)}
                          className={styles.deleteButton}
                          title="Delete"
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              
              <div className={styles.paginationInfo}>
                Page {currentPage} of {totalPages}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
              >
                Next
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && sessions.length === 0 && (
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className={styles.emptyTitle}>No sessions found</h3>
          <p className={styles.emptyText}>Create your first session to get started</p>
          <button onClick={openCreateModal} className={styles.emptyButton}>
            + Create Session
          </button>
        </div>
      )}

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingSession ? `Edit Session #${editingSession.sessionId}` : 'Create New Session'}
              </h2>
              <button onClick={closeModal} className={styles.modalClose}>
                ×
              </button>
            </div>
            
            <form onSubmit={editingSession ? handleUpdateSession : handleCreateSession} className={styles.modalForm}>
              <div className={styles.formGrid}>
                {/* Service Search/Select - Only for Create */}
                {!editingSession && (
                  <div className={styles.formGroup + ' ' + styles.formGroupFull}>
                    <label className={styles.formLabel}>Select Service/Product *</label>
                    <div className={styles.searchableSelect}>
                      <input
                        type="text"
                        value={serviceSearch}
                        onChange={(e) => {
                          setServiceSearch(e.target.value);
                          setShowServiceDropdown(true);
                        }}
                        onFocus={() => setShowServiceDropdown(true)}
                        placeholder="Search service by name or slug..."
                        className={styles.formInput}
                        autoComplete="off"
                      />
                      {showServiceDropdown && (
                        <div className={styles.dropdown}>
                          {loadingServices && (
                            <div className={styles.dropdownLoading}>
                              <div className={styles.miniSpinner}></div>
                              <span>Loading services...</span>
                            </div>
                          )}
                          {!loadingServices && services.length === 0 && (
                            <div className={styles.dropdownEmpty}>
                              No services found
                            </div>
                          )}
                          {!loadingServices && services.length > 0 && (
                            <div className={styles.dropdownList}>
                              {services.map((service) => (
                                <div
                                  key={service._id}
                                  className={styles.dropdownItem}
                                  onClick={() => handleServiceSelect(service)}
                                >
                                  <div className={styles.serviceInfo}>
                                    <span className={styles.serviceName}>{service.name}</span>
                                    {service.slug && (
                                      <span className={styles.serviceSlug}>/{service.slug}</span>
                                    )}
                                  </div>
                                  <span className={styles.serviceId}>ID: {service._id}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {selectedService && (
                      <div className={styles.selectedService}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Selected: <strong>{selectedService.name}</strong> (ID: {selectedService._id})</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Product ID - Show as read-only for edit */}
                {editingSession && (
                  <div className={styles.formGroup + ' ' + styles.formGroupFull}>
                    <label className={styles.formLabel}>Product ID</label>
                    <input
                      type="text"
                      value={formData.productId}
                      className={styles.formInput}
                      disabled
                    />
                  </div>
                )}

                {/* Session ID - Show only for edit mode */}
                {editingSession && (
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Session ID</label>
                    <input
                      type="number"
                      value={formData.sessionId || 0}
                      className={styles.formInput}
                      disabled
                    />
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Count (Sessions) *</label>
                  <input
                    type="number"
                    value={formData.count}
                    onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) || 1 })}
                    className={styles.formInput}
                    required
                    min="1"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Base Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                    className={styles.formInput}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Discount (%) *</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                    className={styles.formInput}
                    required
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>

                <div className={styles.formGroup + ' ' + styles.formGroupFull}>
                  <div className={styles.pricePreview}>
                    <div>
                      <span className={styles.previewLabel}>Total Package Price:</span>
                      <span className={styles.previewValue}>
                        ₹{(formData.basePrice * formData.count).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className={styles.previewLabel}>Final Price After Discount:</span>
                      <strong className={styles.previewFinal}>
                        ₹{calculateFinalPrice(formData.basePrice * formData.count, formData.discount).toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <div>
                      <span className={styles.previewLabel}>Per Session:</span>
                      <span className={styles.previewValue}>
                        ₹{(calculateFinalPrice(formData.basePrice * formData.count, formData.discount) / formData.count).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={closeModal} className={styles.cancelButton}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton} disabled={loading || (!editingSession && !selectedService)}>
                  {loading ? 'Saving...' : editingSession ? 'Update Session' : 'Create Session'}
                </button>
              </div>

              {!editingSession && (
                <div className={styles.modalNote}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Session ID will be auto-generated. You can create multiple pricing tiers for the same product/service.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
