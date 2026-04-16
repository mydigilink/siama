// User Mobile Session (Public)
export interface PublicUserMobileSession {
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

export interface CreateUserMobileSessionPayload {
  mobile: string;
  otp: string;
  browser: string;
  ip: string;
  device: string;
}

export const createUserMobileSession = async (payload: CreateUserMobileSessionPayload): Promise<PublicApiResponse<PublicUserMobileSession>> => {
  return publicApiRequest<PublicUserMobileSession>(`/usermobilesession`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
// Public API Configuration
// Public base URL must come from environment (no hard-coded URLs)
const PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_PUBLIC_API_BASE_URL ||
  process.env.PUBLIC_API_BASE_URL ||
  (process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL || process.env.ADMIN_API_BASE_URL)?.replace('/admin', '/public');

if (!PUBLIC_API_BASE_URL) {
  throw new Error('Public API base URL is not configured in environment variables.');
}

// Generic response
export interface PublicApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Base request helper
const publicApiRequest = async <T>(endpoint: string, init?: RequestInit): Promise<PublicApiResponse<T>> => {
  const response = await fetch(`${PUBLIC_API_BASE_URL}${endpoint}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers as Record<string, string>),
    },
    cache: 'no-store',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return {
      status: 'error',
      message: data?.message || 'Request failed',
      data,
    };
  }
  return data as PublicApiResponse<T>;
};

// ----- Public User Auth -----
export interface PublicUser {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  profile_image?: string;
  gender?: string;
  gst_no?: string;
  state?: string;
  state_id?: string;
  city?: string;
  city_id?: string;
  pincode?: string;
  address?: string;
  saved_address?: string[];
  createdAt?: string;
  updatedAt?: string;
  areasTreatedSection: {
  enabled: { type: Boolean, default: true },
  badge: { type: String, default: "Laser Hair Removal" },
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },

  womenIntro: { type: String, default: "" },
  womenAreas: [{ type: String }],

  menIntro: { type: String, default: "" },
  menAreas: [{ type: String }],

  howItWorksTitle: { type: String, default: "How Laser Hair Removal Works" },
  howItWorksParagraphs: [{ type: String }],

  benefitsTitle: { type: String, default: "Benefits of Laser Hair Removal" },
  benefitsSubtitle: { type: String, default: "" },
  benefits: [{ type: String }],

  beforeTitle: { type: String, default: "Before the Treatment" },
  beforeItems: [{ type: String }],

  afterTitle: { type: String, default: "After the Treatment" },
  afterItems: [{ type: String }],

  idealTitle: { type: String, default: "Ideal For" },
  idealItems: [{ type: String }],

  notIdealTitle: { type: String, default: "May Not Be Ideal For" },
  notIdealItems: [{ type: String }],

  ctaTitle: { type: String, default: "" },
  ctaText: { type: String, default: "" },
  ctaButtonText: { type: String, default: "Book Consultation" },
  ctaButtonLink: { type: String, default: "#book-appointment" }
},
}

export interface AuthSuccess {
  user: PublicUser;
  token: string;
  expiresIn?: string;
}

export type RegisterPayload = Partial<PublicUser> & {
  password: string;
  phone?: string;
  email?: string;
};

export type LoginPayload = {
  identifier?: string;
  phone?: string;
  email?: string;
  password: string;
};

export type UpdateProfilePayload = Partial<PublicUser>;

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

const authHeaders = (token?: string): Record<string, string> =>
  token ? { Authorization: `Bearer ${token}` } : {};

const cleanBody = (payload: Record<string, any>) =>
  JSON.stringify(
    Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    )
  );

export const registerUser = (
  payload: RegisterPayload
): Promise<PublicApiResponse<AuthSuccess>> => {
  return publicApiRequest<AuthSuccess>('/users/register', {
    method: 'POST',
    body: cleanBody(payload),
  });
};

export const loginUser = (payload: LoginPayload): Promise<PublicApiResponse<AuthSuccess>> => {
  return publicApiRequest<AuthSuccess>('/users/login', {
    method: 'POST',
    body: cleanBody(payload),
  });
};

export const getMe = (token: string): Promise<PublicApiResponse<{ user: PublicUser }>> => {
  return publicApiRequest<{ user: PublicUser }>('/users/me', {
    headers: authHeaders(token),
  });
};

export const updateProfile = (
  token: string,
  payload: UpdateProfilePayload
): Promise<PublicApiResponse<{ user: PublicUser }>> => {
  return publicApiRequest<{ user: PublicUser }>('/users/me', {
    method: 'PUT',
    headers: authHeaders(token),
    body: cleanBody(payload),
  });
};

export const changePassword = (
  token: string,
  payload: ChangePasswordPayload
): Promise<PublicApiResponse<{ token: string; expiresIn?: string }>> => {
  return publicApiRequest<{ token: string; expiresIn?: string }>('/users/change-password', {
    method: 'PUT',
    headers: authHeaders(token),
    body: cleanBody(payload),
  });
};

export const logoutUser = (token: string): Promise<PublicApiResponse<{ message: string }>> => {
  return publicApiRequest<{ message: string }>('/users/logout', {
    method: 'POST',
    headers: authHeaders(token),
  });
};

// Lead submission payload interface
export interface LeadSubmissionPayload {
  name: string;
  number: string;
  address?: string;
  gender?: string;
  city?: string;
  state?: string;
}

// Submit lead to public API
export const submitLead = async (payload: LeadSubmissionPayload): Promise<PublicApiResponse<any>> => {
  return publicApiRequest('/leads', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

// Shared types
export interface PublicCategory {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  slug?: string;
  priority?: number;
  type?: string;
  sub_categories?: PublicSubCategory[];
  services?: PublicService[];
}

export interface PublicSubCategory {
  _id: string;
  category?: PublicCategory | string;
  name: string;
  description?: string;
  image?: string;
  slug?: string;
  priority?: number;
  services?: PublicService[];
}

export interface PublicCondition {
  _id: string;
  name: string;
  image?: string;
  status?: boolean;
  category?: string | PublicCategory;
  slug?: string;
  createdAt?: string;
}

export interface PublicService {
  areasTreatedSection: any;
  _id: string;
  category?: PublicCategory | string;
  sub_category?: PublicSubCategory | string;
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
  tags?: (PublicCondition | string)[];
  aboutUs?: string;
  benefits?: Array<{ benefits: string }>;
  postTreatmentCare?: Array<{ tips: string }>;
  slug?: string;
  created_at?: string;
  updated_at?: string;
  
}

// Categories (public)
export const getPublicCategories = (params?: { page?: number; limit?: number }): Promise<PublicApiResponse<PublicCategory[]>> => {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', String(params.page));
  if (params?.limit) query.append('limit', String(params.limit));
  return publicApiRequest(`/categories${query.toString() ? `?${query}` : ''}`);
};

export const getPublicCategoriesTree = (): Promise<PublicApiResponse<PublicCategory[]>> => {
  return publicApiRequest('/categories/tree');
};

export const getPublicCategoryBySlug = (slug: string): Promise<PublicApiResponse<PublicCategory>> => {
  return publicApiRequest(`/categories/${slug}`);
};

// Sub-categories (public)
export const getPublicSubCategories = (params?: { page?: number; limit?: number; category?: string }): Promise<PublicApiResponse<PublicSubCategory[]>> => {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', String(params.page));
  if (params?.limit) query.append('limit', String(params.limit));
  if (params?.category) query.append('category', params.category);
  return publicApiRequest(`/sub-categories${query.toString() ? `?${query}` : ''}`);
};

export const getPublicSubCategoriesByCategory = (categorySlug: string): Promise<PublicApiResponse<PublicSubCategory[]>> => {
  return publicApiRequest(`/sub-categories/by-category/${categorySlug}`);
};

export const getPublicSubCategoryBySlug = (slug: string): Promise<PublicApiResponse<PublicSubCategory>> => {
  return publicApiRequest(`/sub-categories/${slug}`);
};

// Conditions (public)
export const getPublicConditions = (params?: { page?: number; limit?: number; category?: string }): Promise<PublicApiResponse<PublicCondition[]>> => {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', String(params.page));
  if (params?.limit) query.append('limit', String(params.limit));
  if (params?.category) query.append('category', params.category);
  return publicApiRequest(`/conditions${query.toString() ? `?${query}` : ''}`);
};

export const getPublicConditionsByCategory = (categorySlug: string): Promise<PublicApiResponse<PublicCondition[]>> => {
  return publicApiRequest(`/conditions/by-category/${categorySlug}`);
};

export const getPublicConditionBySlug = (slug: string): Promise<PublicApiResponse<PublicCondition>> => {
  return publicApiRequest(`/conditions/${slug}`);
};

// Services (public)
export const getPublicServices = (params?: {
  page?: number;
  limit?: number;
  category?: string;
  sub_category?: string;
  tags?: string | string[];
  bestTreatment?: 'true';
  popularProduct?: 'true';
  search?: string; // client-side name
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<PublicApiResponse<PublicService[]>> => {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    if (k === 'tags' && Array.isArray(v)) {
      const joined = v.filter(Boolean).join(',');
      if (joined) query.append('tags', joined);
    } else if (k === 'search') {
      // API expects q instead of search
      query.append('q', String(v));
    } else {
      query.append(k, String(v));
    }
  });
  return publicApiRequest(`/services${query.toString() ? `?${query}` : ''}`);
};

export const getPublicServiceBySlug = (slug: string): Promise<PublicApiResponse<PublicService>> => {
  return publicApiRequest(`/services/${slug}`);
};

export const getPublicServicesByCategorySlug = (slug: string, params?: { page?: number; limit?: number }): Promise<PublicApiResponse<PublicService[]>> => {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', String(params.page));
  if (params?.limit) query.append('limit', String(params.limit));
  return publicApiRequest(`/services/category/${slug}${query.toString() ? `?${query}` : ''}`);
};

export const getPublicServicesBySubCategorySlug = (slug: string, params?: { page?: number; limit?: number }): Promise<PublicApiResponse<PublicService[]>> => {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', String(params.page));
  if (params?.limit) query.append('limit', String(params.limit));
  return publicApiRequest(`/services/sub-category/${slug}${query.toString() ? `?${query}` : ''}`);
};

export const getPublicBestTreatments = (): Promise<PublicApiResponse<PublicService[]>> => {
  return publicApiRequest('/services/best-treatments');
};

export const getPublicPopularProducts = (): Promise<PublicApiResponse<PublicService[]>> => {
  return publicApiRequest('/services/popular-products');
};

export const searchPublicServices = (q: string, limit = 10): Promise<PublicApiResponse<PublicService[]>> => {
  return publicApiRequest(`/services/search?q=${encodeURIComponent(q)}&limit=${limit}`);
};

