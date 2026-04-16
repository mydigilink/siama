// API Configuration
// Admin base URL must come from environment (no hard-coded URLs)
const ADMIN_API_BASE_URL =
  process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;

if (!ADMIN_API_BASE_URL) {
  throw new Error('Admin API base URL is not configured in environment variables.');
}

export const API_CONFIG = {
  BASE_URL: ADMIN_API_BASE_URL,
  ENDPOINTS: {
    LOGIN: '/admin-data/login',
    HEALTH: '/health',
    LEADS: {
      BASE: '/leads',
      STATISTICS: '/leads/statistics',
      SEARCH: '/leads/search',
      EXPORT: '/leads/export',
      BULK_DELETE: '/leads/bulk-delete',
    },
    CATEGORIES: {
      BASE: '/categories',
      TOGGLE_STATUS: (id: string) => `/categories/${id}/toggle-status`,
    },
    SUB_CATEGORIES: {
      BASE: '/sub-categories',
      BY_CATEGORY: (categoryId: string) => `/sub-categories/by-category/${categoryId}`,
      TOGGLE_STATUS: (id: string) => `/sub-categories/${id}/toggle-status`,
    },
    CONDITIONS: {
      BASE: '/conditions',
      BY_CATEGORY: (categoryId: string) => `/conditions/by-category/${categoryId}`,
      TOGGLE_STATUS: (id: string) => `/conditions/${id}/toggle-status`,
    },
    SERVICES: {
      BASE: '/services',
      STATISTICS: '/services/statistics',
      BY_CATEGORY: (categoryId: string) => `/services/by-category/${categoryId}`,
      BY_SUB_CATEGORY: (subCategoryId: string) => `/services/by-sub-category/${subCategoryId}`,
      TOGGLE_STATUS: (id: string) => `/services/${id}/toggle-status`,
      TOGGLE_BEST: (id: string) => `/services/${id}/toggle-best-treatment`,
      TOGGLE_POPULAR: (id: string) => `/services/${id}/toggle-popular`,
    },
    LEAD_CAPTURES: {
      BASE: '/lead-captures',
    },
    USERS: {
      BASE: '/users',
      RESET_PASSWORD: (id: string) => `/users/${id}/reset-password`,
    },
    ORDERS: {
      BASE: '/orders',
    },
  },
} as const;

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

