'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
const PUBLIC_IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ||
  '';

import {
  type PublicService,
  type PublicCategory,
  type PublicSubCategory,
  type PublicCondition,
  getPublicSubCategoriesByCategory,
  getPublicServices,
} from '@/utils/api/public';
import styles from './style.module.scss';

// Same category as ConcernsServicesWidget (Female) – sub_category id from navigation
const SERVICES_LISTING_CATEGORY_ID = '665451b416a3fd61d1e6e104';

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

interface Props {
  initialServices: PublicService[];
  initialPagination: Pagination;
  categories: PublicCategory[];
  conditions: PublicCondition[];
  pageSize: number;
}

export default function ServicesListingClient({
  initialServices,
  initialPagination,
  categories,
  conditions,
  pageSize,
}: Props) {
  const [services, setServices] = useState<PublicService[]>(initialServices);
  const [subCategories, setSubCategories] = useState<PublicSubCategory[]>([]);

  const [loading, setLoading] = useState(initialServices.length === 0);
  const [searchLoading, setSearchLoading] = useState(false);

  const [pagination, setPagination] = useState<Pagination>(initialPagination);
  const [search, setSearch] = useState('');
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [best, setBest] = useState(false);
  const [popular, setPopular] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const filtersTopRef = useRef<HTMLDivElement>(null);

  const sanitizeHtml = (html?: string) => {
    if (!html) return '';
    let safe = html;
    safe = safe.replace(/<\s*(script|style|iframe|object|embed|frame|frameset)[^>]*>[\s\S]*?<\/\s*\1\s*>/gi, '');
    safe = safe.replace(/\son\w+=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
    safe = safe.replace(/javascript:/gi, '');
    return safe;
  };

  useEffect(() => {
    if (category) {
      loadSubCategories(category);
    } else {
      setSubCategories([]);
      setSubCategory('');
    }
  }, [category]);

  const hasInitialData = initialServices.length > 0;
  const isFirstSearchRef = useRef(true);

  // Debounce search input to avoid spamming API
  useEffect(() => {
    // Skip extra fetch on first render when we already have server data
    if (isFirstSearchRef.current) {
      isFirstSearchRef.current = false;
      if (!hasInitialData) {
        loadServices(1, { search }, false);
      }
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setPagination((p) => ({ ...p, page: 1 }));
      loadServices(1, { search }, true);
    }, 500);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: debounced search only, loadServices is stable
  }, [search, hasInitialData]); 

  const loadSubCategories = async (catId: string) => {
    try {
      const res = await getPublicSubCategoriesByCategory(catId);
      if (res.status === 'success' && res.data) setSubCategories(res.data);
    } catch (error) {
      console.error('Error loading sub-categories', error);
    }
  };

  const loadServices = async (
    page = 1,
    overrides: Partial<{
      category: string;
      subCategory: string;
      best: boolean;
      popular: boolean;
      sortBy: string;
      sortOrder: 'asc' | 'desc';
      search: string;
    }> = {},
    scrollToTop = false
  ) => {
    try {
      const nextCategory = overrides.category ?? category;
      const nextSubCategory = overrides.subCategory ?? subCategory;
      const nextBest = overrides.best ?? best;
      const nextPopular = overrides.popular ?? popular;
      const nextSortBy = overrides.sortBy ?? sortBy;
      const nextSortOrder = overrides.sortOrder ?? sortOrder;
      const nextSearch = overrides.search ?? search;

      setLoading(true);
      setSearchLoading(true);
      const response = await getPublicServices({
        page,
        limit: pageSize,
        category: nextSubCategory ? SERVICES_LISTING_CATEGORY_ID : (nextCategory || undefined),
        sub_category: nextSubCategory || undefined,
        search: nextSearch || undefined,
        bestTreatment: nextBest ? 'true' : undefined,
        popularProduct: nextPopular ? 'true' : undefined,
        sortBy: nextSortBy,
        sortOrder: nextSortOrder,
      });
      if (response.status === 'success' && response.data) {
        setServices(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        } else {
          setPagination({ page, limit: pageSize, total: response.data.length, totalPages: 1 });
        }
      }
      if (scrollToTop) {
        requestAnimationFrame(() => {
          filtersTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    } catch (error) {
      console.error('Error loading services', error);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const resetFilters = () => {
    setCategory('');
    setSubCategory('');
    setBest(false);
    setPopular(false);
    setSortBy('created_at');
    setSortOrder('desc');
    setSearch('');
    setPagination((p) => ({ ...p, page: 1 }));
    loadServices(1, {
      category: '',
      subCategory: '',
      best: false,
      popular: false,
      sortBy: 'created_at',
      sortOrder: 'desc',
      search: '',
    }, true);
  };

  const filteredSubCategories = useMemo(() => subCategories, [subCategories]);

  return (
    <>
      <main ref={filtersTopRef} className={styles.mainContainer}>
        <div className={styles.contentWrapper}>
          {/* Filters sidebar */}
          <aside className={styles.filtersSidebar}>
            <div className={styles.filtersCard}>
              <div className={styles.filtersHeader}>
                <h3 className={styles.filtersTitle}>Filters</h3>
                <button
                  onClick={resetFilters}
                  className={styles.resetButton}
                >
                  Reset
                </button>
              </div>

              <div className={styles.filtersContent}>
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Search</label>
                  <div className={styles.inputWrapper}>
                    <div className={styles.searchIconWrapper}>
                      <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (setPagination((p) => ({ ...p, page: 1 })), loadServices(1, { search }, true))}
                      placeholder="Search by name or description"
                      className={styles.filterInput}
                    />
                  </div>
                </div>

                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCategory(value);
                      setSubCategory('');
                      setPagination((p) => ({ ...p, page: 1 }));
                      loadServices(1, { category: value, subCategory: '' }, true);
                    }}
                    className={`${styles.filterSelect} ${styles.filterSelect}`}
                  >
                    <option value="">All</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Sub-Category</label>
                  <select
                    value={subCategory}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSubCategory(value);
                      setPagination((p) => ({ ...p, page: 1 }));
                      loadServices(1, { subCategory: value }, true);
                    }}
                    className={`${styles.filterSelect} ${styles.filterSelect}`}
                  >
                    <option value="">All</option>
                    {filteredSubCategories.map((s) => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={best}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setBest(checked);
                        setPagination((p) => ({ ...p, page: 1 }));
                        loadServices(1, { best: checked }, true);
                      }}
                      className={styles.checkboxInput}
                    />
                    <span>Best</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={popular}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setPopular(checked);
                        setPagination((p) => ({ ...p, page: 1 }));
                        loadServices(1, { popular: checked }, true);
                      }}
                      className={`${styles.checkboxInput} ${styles.checkboxInputPopular}`}
                    />
                    <span>Popular</span>
                  </label>
                </div>

                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Sort</label>
                  <div
                    className={styles.sortGroup}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '12px',
                      width: '100%',
                    }}
                  >
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSortBy(value);
                        loadServices(1, { sortBy: value }, true);
                      }}
                      className={`${styles.filterSelect} ${styles.sortSelect}`}
                      style={{ minWidth: 160, width: '100%' }}
                    >
                      <option value="created_at">Newest</option>
                      <option value="name">Name</option>
                      <option value="rating">Rating</option>
                      <option value="price">Price</option>
                    </select>
                    <select
                      value={sortOrder}
                      onChange={(e) => {
                        const value = e.target.value as 'asc' | 'desc';
                        setSortOrder(value);
                        loadServices(1, { sortOrder: value }, true);
                      }}
                      className={`${styles.filterSelect} ${styles.sortOrderSelect}`}
                      style={{ minWidth: 150, width: '100%' }}
                    >
                      <option value="desc">High to Low (↓)</option>
                      <option value="asc">Low to High (↑)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Listing */}
          <section className={styles.servicesSection}>
            <div className={styles.servicesGrid}>
              {searchLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className={styles.loadingCard} />
                ))
              ) : services.length === 0 ? (
                <div className={styles.emptyState}>
                  No services found. Try adjusting filters.
                </div>
              ) : (
                services.map((svc) => (
                  <Link
                    key={svc._id}
                    href={`/services/${svc.slug || svc._id}`}
                    className={styles.serviceCard}
                  >
                    <div className={styles.cardGradient}></div>

                    <div className={styles.serviceImageContainer}>
                      {svc.image ? (
                        <Image
                          src={svc.image.startsWith('http') ? svc.image : `${svc.image}`}
                          alt={svc.name || 'Service'}
                          width={400}
                          height={300}
                          className={styles.serviceImage}
                          sizes="(max-width: 768px) 100vw, (max-width: 1003px) 50vw, 400px"
                          unoptimized
                        />
                      ) : (
                        <div className={styles.serviceImagePlaceholder}>
                          {svc.name?.charAt(0)?.toUpperCase() || 'S'}
                        </div>
                      )}
                      {svc.service_charge && (
                        <div className={styles.priceBadge}>
                          ₹{svc.service_charge}
                        </div>
                      )}
                    </div>

                    <div className={styles.serviceContent}>
                      <div className={styles.serviceHeader}>
                        <div className={styles.serviceInfo}>
                          <h3 className={styles.serviceName}>{svc.name || 'Service'}</h3>
                          <p className={styles.serviceCategory}>
                            {typeof svc.category === 'object' && svc.category ? (svc.category as any).name : ''}
                          </p>
                        </div>
                      </div>

                      <div className={styles.serviceDetails}>
                        {/* <div className={styles.ratingContainer}>
                          <div className={styles.stars}>
                            {[...Array(5)].map((_, i) => {
                              const rating = svc.ratingAverage ?? 4.8;
                              return (
                                <svg
                                  key={i}
                                  width="18"
                                  height="18"
                                  viewBox="0 0 20 20"
                                  fill={i < Math.floor(rating) ? "#FFD700" : "none"}
                                  stroke={i < Math.floor(rating) ? "#FFD700" : "#E0E0E0"}
                                  strokeWidth="2"
                                  className={styles.star}
                                >
                                  <path d="M10 1L12.5 7.5L19 8.5L14 13L15.5 19.5L10 16L4.5 19.5L6 13L1 8.5L7.5 7.5L10 1Z" />
                                </svg>
                              );
                            })}
                          </div>
                          <span className={styles.ratingValue}>{(svc.ratingAverage ?? 4.8).toFixed(1)}</span>
                        </div> */}

                        {/* <div className={styles.durationContainer}>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={styles.durationIcon}
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <span className={styles.durationText}>{svc.estimate_time || '—'}</span>
                        </div> */}

                        {/* {svc.description && (
                          <div
                            className={styles.descriptionContainer}
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(svc.description) }}
                          />
                        )} */}
                      </div>

                      <div className={styles.serviceTags}>
                        <span className={`${styles.serviceTag} ${styles.serviceTagBlue}`}>
                          {typeof svc.sub_category === 'object' && svc.sub_category ? (svc.sub_category as any).name : 'Hair Care'}
                        </span>
                        <span className={`${styles.serviceTag} ${styles.serviceTagGold}`}>
                          {svc.consult_charge ? 'Consult' : 'Popular'}
                        </span>
                      </div>

                      <button className={styles.viewButton}>
                        <svg className={styles.viewButtonIcon} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 4.5a.5.5 0 0 1 .79-.407l5.5 4a.5.5 0 0 1 0 .814l-5.5 4A.5.5 0 0 1 9 12.5V11H4.5A1.5 1.5 0 0 1 3 9.5v-3A1.5 1.5 0 0 1 4.5 5H9V4.5Z" />
                        </svg>
                        View Service
                      </button>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <div className={styles.paginationInfo}>
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </div>
                <div className={styles.paginationControls}>
                  <button
                    onClick={() => { const next = Math.max(1, pagination.page - 1); setPagination((p) => ({ ...p, page: next })); loadServices(next, {}, true); }}
                    disabled={pagination.page === 1}
                    className={styles.paginationButton}
                  >
                    Previous
                  </button>
                  <span className={styles.paginationPage}>
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => { const next = Math.min(pagination.totalPages, pagination.page + 1); setPagination((p) => ({ ...p, page: next })); loadServices(next, {}, true); }}
                    disabled={pagination.page >= pagination.totalPages}
                    className={styles.paginationButton}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
