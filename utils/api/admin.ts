// User Mobile Session (Admin)
export interface UserMobileSession {
  _id: string;
  mobile: string;
  otp: string;
  isMobileVerification: boolean;
  browser: string;
  ip: string;
  device: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserMobileSessionSearchParams {
  mobile?: string;
  isMobileVerification?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const getUserMobileSessions = async (params: UserMobileSessionSearchParams = {}): Promise<ApiResponse<UserMobileSession[]>> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });
  const query = queryParams.toString();
  return apiRequest<UserMobileSession[]>(`/usermobilesession/${query ? `?${query}` : ''}`);
};

export const verifyUserMobileSession = async (sessionId: string): Promise<ApiResponse<UserMobileSession>> => {
  return apiRequest<UserMobileSession>(`/usermobilesession/${sessionId}/verify`, {
    method: 'PATCH',
  });
};
import { API_CONFIG, getApiUrl } from './config';

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface AdminData {
  _id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  profile_image: string;
  is_active: boolean;
  created_at: string;
  updatedAt: string;
  __v: number;
  auth_token_expiry: string;
  last_login: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    admin: AdminData;
    token: string;
    expiresIn: string;
  };
}

export interface ApiResponse<T = any> {
  status: string;
  message: string;
  data?: T;
  timestamp?: string;
  pagination?: LeadPagination;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Token management
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
};

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('admin_token', token);
};

export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('admin_token');
};

export const getAdminData = (): AdminData | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('admin_data');
  return data ? JSON.parse(data) : null;
};

export const setAdminData = (data: AdminData): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('admin_data', JSON.stringify(data));
};

export const removeAdminData = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('admin_data');
};

// API request helper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized - clear token and redirect to login
      removeToken();
      removeAdminData();
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
      throw new Error('Unauthorized');
    }
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};

// Upload file helper
export const uploadFile = async (file: File, folder: string = 'services'): Promise<{ url: string }> => {
  const token = getToken();
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // Don't set Content-Type header - let browser set it with boundary for FormData

  const response = await fetch(`${API_BASE_URL}/admin-data/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized - clear token and redirect to login
      removeToken();
      removeAdminData();
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
      throw new Error('Unauthorized');
    }
    const error = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(error.message || 'Upload failed');
  }

  const data = await response.json();
  // Handle different response formats
  if (data.status === 'success' && data.data?.url) {
    return { url: data.data.url };
  } else if (data.url) {
    return { url: data.url };
  } else if (data.data?.url) {
    return { url: data.data.url };
  }
  throw new Error('Invalid response format from upload endpoint');
};

// Login API
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(error.message || 'Login failed');
  }

  const data: LoginResponse = await response.json();
  
  // Store token and admin data
  if (data.data?.token) {
    setToken(data.data.token);
  }
  if (data.data?.admin) {
    setAdminData(data.data.admin);
  }

  return data;
};

// Logout
export const logout = (): void => {
  removeToken();
  removeAdminData();
  if (typeof window !== 'undefined') {
    window.location.href = '/admin/login';
  }
};

// Health check API
export const checkHealth = async (): Promise<ApiResponse> => {
  return apiRequest(API_CONFIG.ENDPOINTS.HEALTH);
};

// Lead Types
export interface Lead {
  _id: string;
  name: string;
  number: string;
  city?: string;
  state?: string;
  gender?: string;
  address?: string;
  service?: {
    _id: string;
    name: string;
    slug: string;
    price?: number;
  };
  status?: 'new' | 'contacted' | 'interested' | 'not_interested' | 'converted' | 'closed';
  notes?: string;
  created_at?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface LeadStatistics {
  total: number;
  today: number;
  last7Days: number;
  byStatus: Array<{ _id: string; count: number }>;
  byCity: Array<{ _id: string; count: number }>;
  byService: Array<{ _id: string; count: number }>;
}

export interface LeadSearchParams {
  search?: string;
  service?: string;
  city?: string;
  state?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface LeadPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore?: boolean;
}

export type Pagination = LeadPagination;

// Lead Capture (public leads captured) types
export interface LeadCapture {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  scheduleDateTime?: string;
  address?: string;
  service?: { _id: string; name: string };
  categoryName?: string;
  ipAddress?: string;
  userAgent?: string;
  status?: 'new' | 'contacted' | 'closed';
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadCaptureSearchParams {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'scheduleDateTime' | 'name' | 'phone' | 'status';
  sortOrder?: 'asc' | 'desc';
  status?: '' | 'new' | 'contacted' | 'closed';
  service?: string;
  search?: string;
  q?: string;
}

export interface LeadCapturePagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Order Types
export interface Order {
  _id: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  user?: {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    profile_image?: string;
  };
  address?: {
    _id: string;
    user: string;
    name: string;
    email: string;
    address: string;
    building: string;
    phoneNumber: string;
    pinCode: string;
    landmark: string;
    state: string;
    city: string;
  };
  products: Array<{
    productId: {
      _id: string;
      name: string;
      category: string;
      sub_category: string;
      image: string;
    };
    quantity: number;
    price: number;
    sessionId?: string;
    sessionName?: string;
    isCancell: boolean;
    _id: string;
  }>;
  cuponDiscount: number;
  orderId: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'initiated';
  orderStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  subTotal: number;
  serviceCharge: number;
  visitingCharge: number;
  payableAmount: number;
  slot: string;
  paymentType: 'COD' | 'Online';
  refundableAmount: number;
  ip?: string;
  userAgent?: string;
  referrer?: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createAt: string;
  __v?: number;
}

export interface OrderSearchParams {
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'initiated';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Users Types
export interface AdminUser {
  _id: string;
  name?: string;
  phone?: string;
  email?: string;
  gender?: string;
  state?: string;
  city?: string;
  pincode?: string;
  address?: string;
  profileImage?: string;
  profile_image?: string;
  email_verified?: boolean;
  gst_no?: string;
  state_id?: string;
  city_id?: string;
  saved_address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUserSearchParams {
  page?: number;
  limit?: number;
  q?: string;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'phone' | 'email' | 'gender' | 'state' | 'city';
  sortOrder?: 'asc' | 'desc';
}

export interface AdminUserPayload {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  gender?: string;
  state?: string;
  city?: string;
  pincode?: string;
  address?: string;
  profileImage?: string;
  profile_image?: string;
  email_verified?: boolean;
  gst_no?: string;
  state_id?: string;
  city_id?: string;
  saved_address?: string;
}

// Category & Sub-category Types
export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  slug?: string;
  priority?: number;
  status?: boolean;
  type?: string;
  sub_categories?: Array<Partial<SubCategory>>;
  services?: Array<{
    _id: string;
    name: string;
    slug: string;
    price?: number;
  }>;
  created_at?: string;
  updated_at?: string;
}

export interface SubCategory {
  _id: string;
  category: string | Category | { _id: string; name: string; slug?: string };
  name: string;
  description?: string;
  image?: string;
  slug?: string;
  priority?: number;
  status?: boolean;
  services?: Array<{
    _id: string;
    name: string;
    slug: string;
    price?: number;
  }>;
  created_at?: string;
  updated_at?: string;
}

export interface CategorySearchParams {
  page?: number;
  limit?: number;
  status?: 'true' | 'false';
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SubCategorySearchParams {
  page?: number;
  limit?: number;
  category?: string;
  status?: 'true' | 'false';
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Conditions Types
export interface Condition {
  _id: string;
  name: string;
  image?: string;
  status?: boolean;
  category?: string | Category | { _id: string; name: string; slug?: string };
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConditionSearchParams {
  page?: number;
  limit?: number;
  category?: string;
  status?: 'true' | 'false';
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ConditionPayload {
  name: string;
  image?: string;
  status?: boolean;
  category?: string;
  slug?: string;
}

// Services Types
export interface Service {
  _id: string;
  category: string | Category | { _id: string; name: string; slug?: string };
  sub_category: string | SubCategory | { _id: string; name: string; slug?: string };
  name: string;
  description?: string;
  image?: string;
  images?: string[];
  service_mode?: string;
  service_charge?: string;
  consult_charge?: string;
  estimate_time?: string;
  status?: boolean;
  faq?: Array<{ question: string; answer: string }>;
  ratingAverage?: number;
  ratingNumber?: number;
  bestTreatment?: boolean;
  popularProduct?: boolean;
  tags?: string[] | Condition[];
  aboutUs?: string;
  benefits?: Array<{ benefits: string }>;
  postTreatmentCare?: Array<{ tips: string }>;
  slug?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceSearchParams {
  page?: number;
  limit?: number;
  category?: string;
  sub_category?: string;
  status?: 'true' | 'false';
  bestTreatment?: 'true' | 'false';
  popularProduct?: 'true' | 'false';
  search?: string; // mapped to q for API
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ServicePayload {
  category: string;
  sub_category: string;

  name?: string;
  slug?: string;
  description?: string;

  image?: string;
  images?: string[];

  service_mode?: string;
  service_charge?: string;
  consult_charge?: string;
  estimate_time?: string;

  status?: boolean;
  bestTreatment?: boolean;
  popularProduct?: boolean;

  ratingAverage?: number;
  ratingNumber?: number;

  tags?: string[];
  aboutUs?: string;

  // ✅ FAQ
  faq?: Array<{
    question: string;
    answer: string;
  }>;

  // ✅ Benefits
  benefits?: Array<{
    benefits: string;
  }>;

  // ✅ Post Treatment Care
  postTreatmentCare?: Array<{
    tips: string;
  }>;

  // ✅ NEW: Areas Treated Section
  areasTreatedSection?: {
    enabled?: boolean;

    badge?: string;
    title?: string;
    subtitle?: string;

    womenIntro?: string;
    womenAreas?: string[];

    menIntro?: string;
    menAreas?: string[];

    howItWorksTitle?: string;
    howItWorksParagraphs?: string[];

    benefitsTitle?: string;
    benefitsSubtitle?: string;
    benefits?: string[];

    beforeTitle?: string;
    beforeItems?: string[];

    afterTitle?: string;
    afterItems?: string[];

    idealTitle?: string;
    idealItems?: string[];

    notIdealTitle?: string;
    notIdealItems?: string[];

    ctaTitle?: string;
    ctaText?: string;
    ctaButtonText?: string;
    ctaButtonLink?: string;
  };
}

export interface AreasTreatedSection {
  enabled?: boolean;
  badge?: string;
  title?: string;
  subtitle?: string;

  womenIntro?: string;
  womenAreas?: string[];

  menIntro?: string;
  menAreas?: string[];

  howItWorksTitle?: string;
  howItWorksParagraphs?: string[];

  benefitsTitle?: string;
  benefitsSubtitle?: string;
  benefits?: string[];

  beforeTitle?: string;
  beforeItems?: string[];

  afterTitle?: string;
  afterItems?: string[];

  idealTitle?: string;
  idealItems?: string[];

  notIdealTitle?: string;
  notIdealItems?: string[];

  ctaTitle?: string;
  ctaText?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
}
// Lead API Functions
export const leadsApi = {
  // Get statistics
  getStatistics: async (): Promise<ApiResponse<LeadStatistics>> => {
    return apiRequest<LeadStatistics>(API_CONFIG.ENDPOINTS.LEADS.STATISTICS);
  },

  // Search leads
  search: async (params: LeadSearchParams): Promise<ApiResponse<Lead[]>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
    const query = queryParams.toString();
    const response = await apiRequest<any>(`${API_CONFIG.ENDPOINTS.LEADS.SEARCH}${query ? `?${query}` : ''}`);
    // Handle response structure: { status: "success", data: Lead[], pagination: {...} }
    if (response.status === 'success') {
      const result: ApiResponse<Lead[]> = {
        status: response.status,
        message: response.message || '',
        data: Array.isArray(response.data) ? response.data : [],
        pagination: response.pagination,
      };
      return result;
    }
    return response as ApiResponse<Lead[]>;
  },

  // Get all leads
  getAll: async (params?: {
    service?: string;
    city?: string;
    state?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Lead[]>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return apiRequest<Lead[]>(`${API_CONFIG.ENDPOINTS.LEADS.BASE}${query ? `?${query}` : ''}`);
  },

  // Get single lead
  getById: async (id: string): Promise<ApiResponse<Lead>> => {
    return apiRequest<Lead>(`${API_CONFIG.ENDPOINTS.LEADS.BASE}/${id}`);
  },

  // Update lead status
  updateStatus: async (id: string, status: Lead['status'], notes?: string): Promise<ApiResponse<Lead>> => {
    return apiRequest<Lead>(`${API_CONFIG.ENDPOINTS.LEADS.BASE}/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  },

  // Export leads
  export: async (params?: {
    service?: string;
    city?: string;
    state?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ApiResponse<Lead[]>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return apiRequest<Lead[]>(`${API_CONFIG.ENDPOINTS.LEADS.EXPORT}${query ? `?${query}` : ''}`);
  },
};

// Orders API
export const ordersApi = {
  getAll: async (params: OrderSearchParams = {}): Promise<ApiResponse<Order[]>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
    const query = queryParams.toString();
    const response = await apiRequest<any>(`${API_CONFIG.ENDPOINTS.ORDERS.BASE}${query ? `?${query}` : ''}`);
    if (response.status === 'success') {
      const result: ApiResponse<Order[]> = {
        status: response.status,
        message: response.message || '',
        data: Array.isArray(response.data) ? response.data : [],
        pagination: response.pagination,
      };
      return result;
    }
    return response;
  },
};

// Categories API
export interface CategoryPayload {
  name: string;
  description?: string;
  image?: string;
  priority?: number;
  status?: boolean;
  type?: string;
  slug?: string;
}

export const categoriesApi = {
  search: async (params: CategorySearchParams): Promise<ApiResponse<Category[]>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
    const query = queryParams.toString();
    const response = await apiRequest<any>(`${API_CONFIG.ENDPOINTS.CATEGORIES.BASE}${query ? `?${query}` : ''}`);
    if (response.status === 'success') {
      const result: ApiResponse<Category[]> = {
        status: response.status,
        message: response.message || '',
        data: Array.isArray(response.data) ? response.data : [],
        pagination: response.pagination,
      };
      return result;
    }
    return response as ApiResponse<Category[]>;
  },

  getById: async (id: string): Promise<ApiResponse<Category>> => {
    return apiRequest<Category>(`${API_CONFIG.ENDPOINTS.CATEGORIES.BASE}/${id}`);
  },

  create: async (payload: CategoryPayload): Promise<ApiResponse<Category>> => {
    return apiRequest<Category>(API_CONFIG.ENDPOINTS.CATEGORIES.BASE, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: Partial<CategoryPayload>): Promise<ApiResponse<Category>> => {
    return apiRequest<Category>(`${API_CONFIG.ENDPOINTS.CATEGORIES.BASE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  toggleStatus: async (id: string): Promise<ApiResponse<Category>> => {
    const endpoint = typeof API_CONFIG.ENDPOINTS.CATEGORIES.TOGGLE_STATUS === 'function'
      ? API_CONFIG.ENDPOINTS.CATEGORIES.TOGGLE_STATUS(id)
      : `/categories/${id}/toggle-status`;
    return apiRequest<Category>(endpoint, { method: 'PATCH' });
  },
};

// Sub-categories API
export interface SubCategoryPayload {
  category: string;
  name: string;
  description?: string;
  image?: string;
  priority?: number;
  status?: boolean;
  slug?: string;
}

export const subCategoriesApi = {
  search: async (params: SubCategorySearchParams): Promise<ApiResponse<SubCategory[]>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
    const query = queryParams.toString();
    const response = await apiRequest<any>(`${API_CONFIG.ENDPOINTS.SUB_CATEGORIES.BASE}${query ? `?${query}` : ''}`);
    if (response.status === 'success') {
      const result: ApiResponse<SubCategory[]> = {
        status: response.status,
        message: response.message || '',
        data: Array.isArray(response.data) ? response.data : [],
        pagination: response.pagination,
      };
      return result;
    }
    return response as ApiResponse<SubCategory[]>;
  },

  getById: async (id: string): Promise<ApiResponse<SubCategory>> => {
    return apiRequest<SubCategory>(`${API_CONFIG.ENDPOINTS.SUB_CATEGORIES.BASE}/${id}`);
  },

  getByCategory: async (categoryId: string): Promise<ApiResponse<SubCategory[]>> => {
    const endpoint = typeof API_CONFIG.ENDPOINTS.SUB_CATEGORIES.BY_CATEGORY === 'function'
      ? API_CONFIG.ENDPOINTS.SUB_CATEGORIES.BY_CATEGORY(categoryId)
      : `/sub-categories/by-category/${categoryId}`;
    return apiRequest<SubCategory[]>(endpoint);
  },

  create: async (payload: SubCategoryPayload): Promise<ApiResponse<SubCategory>> => {
    return apiRequest<SubCategory>(API_CONFIG.ENDPOINTS.SUB_CATEGORIES.BASE, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: Partial<SubCategoryPayload>): Promise<ApiResponse<SubCategory>> => {
    return apiRequest<SubCategory>(`${API_CONFIG.ENDPOINTS.SUB_CATEGORIES.BASE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  toggleStatus: async (id: string): Promise<ApiResponse<SubCategory>> => {
    const endpoint = typeof API_CONFIG.ENDPOINTS.SUB_CATEGORIES.TOGGLE_STATUS === 'function'
      ? API_CONFIG.ENDPOINTS.SUB_CATEGORIES.TOGGLE_STATUS(id)
      : `/sub-categories/${id}/toggle-status`;
    return apiRequest<SubCategory>(endpoint, { method: 'PATCH' });
  },
};

// Conditions API
export const conditionsApi = {
  search: async (params: ConditionSearchParams): Promise<ApiResponse<Condition[]>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
    const query = queryParams.toString();
    const response = await apiRequest<any>(`${API_CONFIG.ENDPOINTS.CONDITIONS.BASE}${query ? `?${query}` : ''}`);
    if (response.status === 'success') {
      const result: ApiResponse<Condition[]> = {
        status: response.status,
        message: response.message || '',
        data: Array.isArray(response.data) ? response.data : [],
        pagination: response.pagination,
      };
      return result;
    }
    return response as ApiResponse<Condition[]>;
  },

  getById: async (id: string): Promise<ApiResponse<Condition>> => {
    return apiRequest<Condition>(`${API_CONFIG.ENDPOINTS.CONDITIONS.BASE}/${id}`);
  },

  getByCategory: async (categoryId: string): Promise<ApiResponse<Condition[]>> => {
    const endpoint = typeof API_CONFIG.ENDPOINTS.CONDITIONS.BY_CATEGORY === 'function'
      ? API_CONFIG.ENDPOINTS.CONDITIONS.BY_CATEGORY(categoryId)
      : `/conditions/by-category/${categoryId}`;
    return apiRequest<Condition[]>(endpoint);
  },

  create: async (payload: ConditionPayload): Promise<ApiResponse<Condition>> => {
    return apiRequest<Condition>(API_CONFIG.ENDPOINTS.CONDITIONS.BASE, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: Partial<ConditionPayload>): Promise<ApiResponse<Condition>> => {
    return apiRequest<Condition>(`${API_CONFIG.ENDPOINTS.CONDITIONS.BASE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  toggleStatus: async (id: string): Promise<ApiResponse<Condition>> => {
    const endpoint = typeof API_CONFIG.ENDPOINTS.CONDITIONS.TOGGLE_STATUS === 'function'
      ? API_CONFIG.ENDPOINTS.CONDITIONS.TOGGLE_STATUS(id)
      : `/conditions/${id}/toggle-status`;
    return apiRequest<Condition>(endpoint, { method: 'PATCH' });
  },
};

// Services API
export const servicesApi = {
  search: async (params: ServiceSearchParams): Promise<ApiResponse<Service[]>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      if (key === 'search') {
        queryParams.append('q', String(value));
      } else {
        queryParams.append(key, String(value));
      }
    });
    const query = queryParams.toString();
    const response = await apiRequest<any>(`${API_CONFIG.ENDPOINTS.SERVICES.BASE}${query ? `?${query}` : ''}`);
    if (response.status === 'success') {
      const result: ApiResponse<Service[]> = {
        status: response.status,
        message: response.message || '',
        data: Array.isArray(response.data) ? response.data : [],
        pagination: response.pagination,
      };
      return result;
    }
    return response as ApiResponse<Service[]>;
  },

  getStatistics: async (): Promise<ApiResponse<any>> => {
    return apiRequest<any>(API_CONFIG.ENDPOINTS.SERVICES.STATISTICS);
  },

  getById: async (id: string): Promise<ApiResponse<Service>> => {
    return apiRequest<Service>(`${API_CONFIG.ENDPOINTS.SERVICES.BASE}/${id}`);
  },

  getByCategory: async (categoryId: string): Promise<ApiResponse<Service[]>> => {
    const endpoint = typeof API_CONFIG.ENDPOINTS.SERVICES.BY_CATEGORY === 'function'
      ? API_CONFIG.ENDPOINTS.SERVICES.BY_CATEGORY(categoryId)
      : `/services/by-category/${categoryId}`;
    return apiRequest<Service[]>(endpoint);
  },

  getBySubCategory: async (subCategoryId: string): Promise<ApiResponse<Service[]>> => {
    const endpoint = typeof API_CONFIG.ENDPOINTS.SERVICES.BY_SUB_CATEGORY === 'function'
      ? API_CONFIG.ENDPOINTS.SERVICES.BY_SUB_CATEGORY(subCategoryId)
      : `/services/by-sub-category/${subCategoryId}`;
    return apiRequest<Service[]>(endpoint);
  },

  create: async (payload: ServicePayload): Promise<ApiResponse<Service>> => {
    return apiRequest<Service>(API_CONFIG.ENDPOINTS.SERVICES.BASE, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: Partial<ServicePayload>): Promise<ApiResponse<Service>> => {
    return apiRequest<Service>(`${API_CONFIG.ENDPOINTS.SERVICES.BASE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  toggleStatus: async (id: string): Promise<ApiResponse<Service>> => {
    const endpoint = typeof API_CONFIG.ENDPOINTS.SERVICES.TOGGLE_STATUS === 'function'
      ? API_CONFIG.ENDPOINTS.SERVICES.TOGGLE_STATUS(id)
      : `/services/${id}/toggle-status`;
    return apiRequest<Service>(endpoint, { method: 'PATCH' });
  },

  toggleBestTreatment: async (id: string): Promise<ApiResponse<Service>> => {
    const endpoint = typeof API_CONFIG.ENDPOINTS.SERVICES.TOGGLE_BEST === 'function'
      ? API_CONFIG.ENDPOINTS.SERVICES.TOGGLE_BEST(id)
      : `/services/${id}/toggle-best-treatment`;
    return apiRequest<Service>(endpoint, { method: 'PATCH' });
  },

  togglePopularProduct: async (id: string): Promise<ApiResponse<Service>> => {
    const endpoint = typeof API_CONFIG.ENDPOINTS.SERVICES.TOGGLE_POPULAR === 'function'
      ? API_CONFIG.ENDPOINTS.SERVICES.TOGGLE_POPULAR(id)
      : `/services/${id}/toggle-popular`;
    return apiRequest<Service>(endpoint, { method: 'PATCH' });
  },
};

export const leadCapturesApi = {
  search: async (params: LeadCaptureSearchParams = {}): Promise<ApiResponse<LeadCapture[]>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'search') {
          queryParams.append('q', String(value));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });
    const query = queryParams.toString();
    return apiRequest(`${API_CONFIG.ENDPOINTS.LEAD_CAPTURES.BASE}${query ? `?${query}` : ''}`);
  },
  getById: async (id: string): Promise<ApiResponse<LeadCapture>> => {
    return apiRequest(`${API_CONFIG.ENDPOINTS.LEAD_CAPTURES.BASE}/${id}`);
  },
};

// Users API
export const usersApi = {
  search: async (params: AdminUserSearchParams = {}): Promise<ApiResponse<AdminUser[]>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      if (key === 'search') {
        queryParams.append('q', String(value));
      } else {
        queryParams.append(key, String(value));
      }
    });
    const query = queryParams.toString();
    const response = await apiRequest<any>(`${API_CONFIG.ENDPOINTS.USERS.BASE}${query ? `?${query}` : ''}`);
    if (response.status === 'success') {
      const pagination = response.pagination || response.meta;
      const result: ApiResponse<AdminUser[]> = {
        status: response.status,
        message: response.message || '',
        data: Array.isArray(response.data) ? response.data : [],
        pagination: pagination
          ? {
              total: pagination.total,
              page: pagination.page,
              limit: pagination.limit,
              totalPages: pagination.totalPages,
            }
          : undefined,
      };
      return result;
    }
    return response as ApiResponse<AdminUser[]>;
  },

  getById: async (id: string): Promise<ApiResponse<AdminUser>> => {
    return apiRequest<AdminUser>(`${API_CONFIG.ENDPOINTS.USERS.BASE}/${id}`);
  },

  create: async (payload: AdminUserPayload): Promise<ApiResponse<AdminUser>> => {
    return apiRequest<AdminUser>(API_CONFIG.ENDPOINTS.USERS.BASE, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: async (id: string, payload: Partial<AdminUserPayload>): Promise<ApiResponse<AdminUser>> => {
    return apiRequest<AdminUser>(`${API_CONFIG.ENDPOINTS.USERS.BASE}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  resetPassword: async (id: string, newPassword: string): Promise<ApiResponse<{ token: string; expiresIn: string }>> => {
    return apiRequest(`${API_CONFIG.ENDPOINTS.USERS.RESET_PASSWORD(id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ newPassword }),
    });
  },
};

// Generic API call function
export const adminApi = {
  get: <T>(endpoint: string): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, { method: 'GET' });
  },
  post: <T>(endpoint: string, body?: any): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
  put: <T>(endpoint: string, body?: any): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },
  delete: <T>(endpoint: string): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, { method: 'DELETE' });
  },
};


