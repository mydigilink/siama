'use client';

import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import JoditCDNEditor from "@/components/admin/siama/JoditCDNEditor";
import debounce from 'lodash.debounce';
import { useRef } from 'react';
// import { servicesApi } from '@/utils/api/admin/services';
import {
  servicesApi,
  categoriesApi,
  subCategoriesApi,
  conditionsApi,
  uploadFile,
  type Service,
  type ServicePayload,
  type ServiceSearchParams,
  type Category,
  type SubCategory,
  type Condition,
} from '@/utils/api/admin';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
const serviceCache = new Map<string, any>();
const CMS_SCHEMA = [
  {
    section: "Basic Info",
    fields: [
      { name: "name", label: "Service Name", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "aboutUs", label: "About Us", type: "textarea" }
    ]
  },
  {
    section: "Media",
    fields: [
      { name: "image", label: "Main Image", type: "text" },
      { name: "images", label: "Gallery Images", type: "array" }
    ]
  },
  {
    section: "Pricing",
    fields: [
      { name: "service_charge", label: "Service Charge", type: "text" },
      { name: "consult_charge", label: "Consult Charge", type: "text" },
      { name: "estimate_time", label: "Estimate Time", type: "text" }
    ]
  },
  {
    section: "Flags",
    fields: [
      { name: "status", label: "Active", type: "checkbox" },
      { name: "bestTreatment", label: "Best Treatment", type: "checkbox" },
      { name: "popularProduct", label: "Popular Product", type: "checkbox" }
    ]
  }
];
 const concernsMenuItems = [
    { label: "Acne", slug: "acne" },
    { label: "Pigmentation", slug: "pigmentation" },
    { label: "Antiaging", slug: "antiaging" },
    { label: "Hair Loss", slug: "hair-loss"},
    { label: "Hair Fall", slug: "hair-fall" },
    { label: "Dark Lips", slug: "dark-lips" },
    { label: "Dark Circle", slug: "dark-circle" },
    { label: "Acne Scar", slug: "acne-scar" },
    { label: "Dull & Dehydrated Skin", slug: "dull-dehydrated-skin" },
    { label: "Wrinkles", slug: "wrinkles" },
    { label: "Gaps in Teeth", slug: "gaps-in-teeth" },
    { label: "Crooked Teeth", slug: "crooked-teeth"},
    { label: "Misaligned teeth", slug: "misaligned-teeth" },
    { label: "Missing Tooth", slug: "missing-tooth" },
    { label: "Full Mouth Rehabilitation", slug: "full-mouth-rehabilitation" },
    { label: "Pain in Tooth", slug: "pain-in-tooth" },
    { label: "Yellow Teeth", slug: "yellow-teeth" },
    
  ];
const renderField = (field: any, formData: any, setFormData: any) => {
  const value = formData[field.name];

  switch (field.type) {
    case "text":
      return (
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder={field.label}
          value={value || ""}
          onChange={(e) =>
            setFormData({ ...formData, [field.name]: e.target.value })
          }
        />
      );

    case "textarea":
      return (
        <textarea
          className="w-full border px-3 py-2 rounded"
          placeholder={field.label}
          value={value || ""}
          onChange={(e) =>
            setFormData({ ...formData, [field.name]: e.target.value })
          }
        />
      );

    case "checkbox":
      return (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) =>
              setFormData({ ...formData, [field.name]: e.target.checked })
            }
          />
          {field.label}
        </label>
      );

    case "array":
      return (
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder={`${field.label} (comma separated)`}
          value={(value || []).join(", ")}
          onChange={(e) =>
            setFormData({
              ...formData,
              [field.name]: e.target.value.split(",").map((v) => v.trim())
            })
          }
        />
      );

    default:
      return null;
  }
};
const PAGE_SIZE = 20;
const DEFAULT_AREAS = {
  enabled: false,

  badge: '',
  title: '',
  subtitle: '',

  womenIntro: '',
  womenAreas: [],

  menIntro: '',
  menAreas: [],

  howItWorksTitle: '',
  howItWorksParagraphs: [],

  benefitsTitle: '',
  benefitsSubtitle: '',
  benefits: [],

  beforeTitle: '',
  beforeItems: [],

  afterTitle: '',
  afterItems: [],

  idealTitle: '',
  idealItems: [],

  notIdealTitle: '',
  notIdealItems: [],

  ctaTitle: '',
  ctaText: '',
  ctaButtonText: '',
  ctaButtonLink: ''
};
export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState<ServiceSearchParams>({
    page: 1,
    limit: PAGE_SIZE,
    sortBy: 'created_at',
    sortOrder: 'desc',
  });
  const [searchTerm, setSearchTerm] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
const [formData, setFormData] = useState<any>({
  category: '',
  sub_category: '',
  name: '',
  slug: '',
  description: '',
  image: '',
  images: [],

  service_mode: '',
  service_charge: '',
  consult_charge: '',
  estimate_time: '',

  status: true,
  bestTreatment: false,
  popularProduct: false,

  ratingAverage: undefined,
  ratingNumber: undefined,

  tags: [],
  aboutUs: '',

  benefits: [],
  postTreatmentCare: [],
  faq: [],

  areasTreatedSection: { ...DEFAULT_AREAS }
});
  useEffect(() => {
    loadCategoriesOptions();
    loadConditionsOptions();
  }, []);

  useEffect(() => {
    if (filters.category) {
      loadSubCategoriesOptions(filters.category);
    } else {
      setSubCategories([]);
    }
  }, [filters.category]);
const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")   // remove special chars
    .replace(/\s+/g, "-")           // replace spaces with -
    .replace(/-+/g, "-");           // remove multiple -
};
  const loadCategoriesOptions = async () => {
    try {
      const response = await categoriesApi.search({ page: 1, limit: 200, sortBy: 'priority', sortOrder: 'asc' });
      if (response.status === 'success' && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadSubCategoriesOptions = async (categoryId: string) => {
    try {
      const response = await subCategoriesApi.getByCategory(categoryId);
      if (response.status === 'success' && response.data) {
        setSubCategories(response.data);
      }
    } catch (error) {
      console.error('Error loading sub-categories:', error);
    }
  };

  const loadConditionsOptions = async () => {
    try {
      const response = await conditionsApi.search({ page: 1, limit: 200, sortBy: 'name', sortOrder: 'asc' });
      if (response.status === 'success' && response.data) {
        setConditions(response.data);
      }
    } catch (error) {
      console.error('Error loading conditions:', error);
    }
  };
const lastRequestRef = useRef('');

const loadServices = useCallback(async () => {
  const cacheKey = JSON.stringify({
    ...filters,
    search: searchTerm
  });

  // ✅ 1. PREVENT SAME REQUEST SPAM
  if (lastRequestRef.current === cacheKey) return;
  lastRequestRef.current = cacheKey;

  // ✅ 2. RETURN FROM CACHE
  if (serviceCache.has(cacheKey)) {
    const cached = serviceCache.get(cacheKey);
    setServices(cached.data);
    setPagination(cached.pagination);
    setLoading(false);
    return;
  }

  // ✅ 3. PREVENT DOUBLE CALL
  if (searchLoading) return;

  try {
    setSearchLoading(true);

    const response = await servicesApi.search({
      ...filters,
      search: searchTerm || filters.search
    });

    if (response.status === 'success' && response.data) {
      setServices(response.data);

      if (response.pagination) {
        setPagination(response.pagination);
      }

      // ✅ 4. SAVE CACHE
      serviceCache.set(cacheKey, {
        data: response.data,
        pagination: response.pagination
      });
    }
  } catch (error) {
    console.error('Error loading services:', error);
  } finally {
    setLoading(false);
    setSearchLoading(false);
  }
}, [filters, searchTerm, searchLoading]);
  const loadServices__ = useCallback(async () => {
    try {
      setLoading((prev) => prev && services.length === 0);
      setSearchLoading(true);
      const response = await servicesApi.search({ ...filters, search: searchTerm || filters.search });
      if (response.status === 'success' && response.data) {
        setServices(response.data);
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
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- omit services.length to avoid refetch when data arrives
  }, [filters, searchTerm]);

  // useEffect(() => {
  //   loadServices();
  // }, [loadServices]);
const debouncedLoad = useMemo(
  () => debounce(loadServices, 400),
  [loadServices]
);

useEffect(() => {
  debouncedLoad();

  return () => {
    debouncedLoad.cancel();
  };
}, [debouncedLoad]);
  const handleSearch = () => {
    setFilters({
      ...filters,
      search: searchTerm || undefined,
      page: 1,
    });
  };

  const handleFilterChange = (key: keyof ServiceSearchParams, value: any) => {
    setFilters({
      ...filters,
      [key]: value || undefined,
      page: 1,
    });
  };
const handleClone = (svc: Service) => {
  setIsEdit(false);
  setSelectedService(null);

  setFormData({
    category: typeof svc.category === 'string'
      ? svc.category
      : (svc.category as any)?._id || '',

    sub_category: typeof svc.sub_category === 'string'
      ? svc.sub_category
      : (svc.sub_category as any)?._id || '',

    // ✅ COPY NAME but mark
    name: `${svc.name} Copy`,
    slug: '',

    description: svc.description || '',
    image: svc.image || '',
    images: svc.images || [],

    service_mode: svc.service_mode || '',
    service_charge: svc.service_charge || '',
    consult_charge: svc.consult_charge || '',
    estimate_time: svc.estimate_time || '',

    status: true,
    bestTreatment: svc.bestTreatment ?? false,
    popularProduct: svc.popularProduct ?? false,

    ratingAverage: svc.ratingAverage ?? undefined,
    ratingNumber: svc.ratingNumber ?? undefined,

    benefits: svc.benefits || [],
    postTreatmentCare: svc.postTreatmentCare || [],
    faq: svc.faq || [],

    tags: (svc.tags as any)?.map((t: any) =>
      typeof t === 'string' ? t : t?._id
    ) || [],

    aboutUs: svc.aboutUs || '',

    // ✅ VERY IMPORTANT FIX
    areasTreatedSection: {
      ...DEFAULT_AREAS,
      ...((svc as any).areasTreatedSection || {})
    }
  });

  setShowForm(true);
};
const openCreate = () => {
  setIsEdit(false);
  setSelectedService(null);

  setFormData({
    category: '',
    sub_category: '',
    name: '',
    slug: '',
    description: '',
    image: '',
    images: [],

    service_mode: '',
    service_charge: '',
    consult_charge: '',
    estimate_time: '',

    status: true,
    bestTreatment: false,
    popularProduct: false,

    ratingAverage: undefined,
    ratingNumber: undefined,

    tags: [],
    aboutUs: '',

    benefits: [],
    postTreatmentCare: [],
    faq: [],

    areasTreatedSection: { ...DEFAULT_AREAS }
  });

  setShowForm(true);
};

const openEdit = (svc: Service) => {
  setIsEdit(true);
  setSelectedService(svc);

  setFormData({
    category: typeof svc.category === 'string'
      ? svc.category
      : (svc.category as any)?._id || '',

    sub_category: typeof svc.sub_category === 'string'
      ? svc.sub_category
      : (svc.sub_category as any)?._id || '',

    // ✅ KEEP ORIGINAL (FIXED)
    name: svc.name || '',
    slug: svc.slug || '',

    description: svc.description || '',
    image: svc.image || '',
    images: svc.images || [],

    service_mode: svc.service_mode || '',
    service_charge: svc.service_charge || '',
    consult_charge: svc.consult_charge || '',
    estimate_time: svc.estimate_time || '',

    // ✅ KEEP ORIGINAL
    status: svc.status ?? true,
    bestTreatment: svc.bestTreatment ?? false,
    popularProduct: svc.popularProduct ?? false,

    ratingAverage: svc.ratingAverage ?? undefined,
    ratingNumber: svc.ratingNumber ?? undefined,

    benefits: svc.benefits || [],
    postTreatmentCare: svc.postTreatmentCare || [],
    faq: svc.faq || [],

    tags: (svc.tags as any)?.map((t: any) =>
      typeof t === 'string' ? t : t?._id
    ) || [],

    aboutUs: svc.aboutUs || '',

    // ✅ FIXED (IMPORTANT)
    areasTreatedSection: {
      ...DEFAULT_AREAS,
      ...((svc as any).areasTreatedSection || {})
    }
  });

  setShowForm(true);
};
  // const submitForm = async () => {
  //   try {
  //     setSubmitting(true);
  //     const payload: ServicePayload = {
  //       ...formData,
  //       images: formData.images?.filter((i) => i.trim()) || [],
  //       tags: formData.tags?.filter(Boolean),
  //       ratingAverage: formData.ratingAverage ? Number(formData.ratingAverage) : undefined,
  //       ratingNumber: formData.ratingNumber ? Number(formData.ratingNumber) : undefined,
  //       benefits: formData.benefits
  //         ?.map((b) => ({ benefits: (b?.benefits || '').trim() }))
  //         .filter((b) => b.benefits),
  //       postTreatmentCare: formData.postTreatmentCare
  //         ?.map((c) => ({ tips: (c?.tips || '').trim() }))
  //         .filter((c) => c.tips),
  //       faq: formData.faq
  //         ?.map((f) => ({
  //           question: (f?.question || '').trim(),
  //           answer: (f?.answer || '').trim(),
  //         }))
  //         .filter((f) => f.question || f.answer),
  //     };
  //     // Remove name and slug from payload
      
  //     if (isEdit && selectedService?._id) {
  //       console.log('payload', payload);
  //       delete (payload as any).name;
  //       delete (payload as any).slug;
  //       await servicesApi.update(selectedService._id, payload);
  //     } else {
  //       await servicesApi.create(payload);
  //     }
  //     setShowForm(false);
  //     await loadServices();
  //   } catch (error) {
  //     console.error('Error saving service:', error);
  //     alert('Failed to save service.');
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };
  const submitForm = async () => {
  try {
    setSubmitting(true);

    const payload: any = {
      ...formData,

      image: formData.image || undefined,
      service_mode: formData.service_mode || undefined,
      service_charge: formData.service_charge || undefined,
      consult_charge: formData.consult_charge || undefined,
      estimate_time: formData.estimate_time || undefined,

      ratingAverage: formData.ratingAverage || undefined,
      ratingNumber: formData.ratingNumber || undefined,

      tags: formData.tags?.length ? formData.tags : undefined,

      images: formData.images?.filter(Boolean)?.length
        ? formData.images
        : undefined,

      benefits: formData.benefits?.length
        ? formData.benefits.map((b: any) => ({
            benefits: b?.benefits?.trim()
          })).filter((b: any) => b.benefits)
        : undefined,

      postTreatmentCare: formData.postTreatmentCare?.length
        ? formData.postTreatmentCare.map((c: any) => ({
            tips: c?.tips?.trim()
          })).filter((c: any) => c.tips)
        : undefined,

      faq: formData.faq?.length
        ? formData.faq.map((f: any) => ({
            question: f?.question?.trim(),
            answer: f?.answer?.trim()
          })).filter((f: any) => f.question || f.answer)
        : undefined,

      areasTreatedSection: formData.areasTreatedSection?.enabled
        ? {
            ...formData.areasTreatedSection,
            womenAreas: formData.areasTreatedSection.womenAreas?.filter(Boolean),
            menAreas: formData.areasTreatedSection.menAreas?.filter(Boolean),
            howItWorksParagraphs: formData.areasTreatedSection.howItWorksParagraphs?.filter(Boolean),
            benefits: formData.areasTreatedSection.benefits?.filter(Boolean),
            beforeItems: formData.areasTreatedSection.beforeItems?.filter(Boolean),
            afterItems: formData.areasTreatedSection.afterItems?.filter(Boolean),
            idealItems: formData.areasTreatedSection.idealItems?.filter(Boolean),
            notIdealItems: formData.areasTreatedSection.notIdealItems?.filter(Boolean),
          }
        : undefined
    };

    if (isEdit && selectedService?._id) {
      delete payload.name;
      delete payload.slug;
      await servicesApi.update(selectedService._id, payload);
    } else {
      await servicesApi.create(payload);
    }

    // ✅ CLEAR CACHE AFTER CHANGE
    serviceCache.clear();
    lastRequestRef.current = '';

    setShowForm(false);
    await loadServices();

  } catch (error) {
    console.error(error);
    alert('Failed to save');
  } finally {
    setSubmitting(false);
  }
};
const submitForm__ = async () => {
  try {
    setSubmitting(true);

    const payload: any = {
      ...formData,

      // ✅ REMOVE EMPTY VALUES
      image: formData.image || undefined,
      service_mode: formData.service_mode || undefined,
      service_charge: formData.service_charge || undefined,
      consult_charge: formData.consult_charge || undefined,
      estimate_time: formData.estimate_time || undefined,

      ratingAverage: formData.ratingAverage || undefined,
      ratingNumber: formData.ratingNumber || undefined,

      tags: formData.tags?.length ? formData.tags : undefined,

      images: formData.images?.filter(Boolean)?.length
        ? formData.images
        : undefined,

      benefits: formData.benefits?.length
        ? formData.benefits.map((b: any) => ({
            benefits: b?.benefits?.trim()
          })).filter((b: any) => b.benefits)
        : undefined,

      postTreatmentCare: formData.postTreatmentCare?.length
        ? formData.postTreatmentCare.map((c: any) => ({
            tips: c?.tips?.trim()
          })).filter((c: any) => c.tips)
        : undefined,

      faq: formData.faq?.length
        ? formData.faq.map((f: any) => ({
            question: f?.question?.trim(),
            answer: f?.answer?.trim()
          })).filter((f: any) => f.question || f.answer)
        : undefined,

      // ✅ ONLY SAVE IF ENABLED
      areasTreatedSection: formData.areasTreatedSection?.enabled
        ? {
            ...formData.areasTreatedSection,

            womenAreas: formData.areasTreatedSection.womenAreas?.filter(Boolean),
            menAreas: formData.areasTreatedSection.menAreas?.filter(Boolean),
            howItWorksParagraphs: formData.areasTreatedSection.howItWorksParagraphs?.filter(Boolean),
            benefits: formData.areasTreatedSection.benefits?.filter(Boolean),
            beforeItems: formData.areasTreatedSection.beforeItems?.filter(Boolean),
            afterItems: formData.areasTreatedSection.afterItems?.filter(Boolean),
            idealItems: formData.areasTreatedSection.idealItems?.filter(Boolean),
            notIdealItems: formData.areasTreatedSection.notIdealItems?.filter(Boolean),
          }
        : undefined
    };

    if (isEdit && selectedService?._id) {
      delete payload.name;
      delete payload.slug;
      await servicesApi.update(selectedService._id, payload);
    } else {
      await servicesApi.create(payload);
    }

    setShowForm(false);
    await loadServices();
  } catch (error) {
    console.error(error);
    alert('Failed to save');
  } finally {
    setSubmitting(false);
  }
};
const toggleStatus = async (id: string) => {
  await servicesApi.toggleStatus(id);
  serviceCache.clear();
  lastRequestRef.current = '';
  await loadServices();
};

const toggleBest = async (id: string) => {
  await servicesApi.toggleBestTreatment(id);
  serviceCache.clear();
  lastRequestRef.current = '';
  await loadServices();
};

const togglePopular = async (id: string) => {
  await servicesApi.togglePopularProduct(id);
  serviceCache.clear();
  lastRequestRef.current = '';
  await loadServices();
};
  const toggleStatus__ = async (id: string) => {
    try {
      await servicesApi.toggleStatus(id);
      await loadServices();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to toggle status.');
    }
  };

  const toggleBest_ = async (id: string) => {
    try {
      await servicesApi.toggleBestTreatment(id);
      await loadServices();
    } catch (error) {
      console.error('Error toggling best treatment:', error);
      alert('Failed to toggle best treatment.');
    }
  };

  const togglePopular_ = async (id: string) => {
    try {
      await servicesApi.togglePopularProduct(id);
      await loadServices();
    } catch (error) {
      console.error('Error toggling popular product:', error);
      alert('Failed to toggle popular product.');
    }
  };

  const openDetail = async (svc: Service) => {
    try {
      setShowDetail(true);
      setSelectedService(svc); // show immediately
      setDetailLoading(true);
      const response = await servicesApi.getById(svc._id);
      if (response.status === 'success' && response.data) {
        setSelectedService(response.data);
      }
    } catch (error) {
      console.error('Error fetching service:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setShowDetail(false);
    setSelectedService(null);
  };

  const selectedCategoryId = useMemo(
    () => formData.category || (typeof selectedService?.category === 'string' ? selectedService.category : (selectedService?.category as any)?._id || ''),
    [formData.category, selectedService]
  );

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
          <h2 className="text-lg font-semibold text-gray-900">Services</h2>
          <p className="text-xs text-gray-500">Manage services (view/update/toggle best & popular).</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white text-sm rounded-md hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 transition-all font-semibold shadow-md"
          >
            New Service
          </button>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Filters */}
        <div className="bg-white/90 backdrop-blur rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-semibold text-blue-900">Filters & Search</h3>
              <span className="text-[11px] text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">Refine</span>
            </div>
            <button
              onClick={() => {
                setFilters({ page: 1, limit: PAGE_SIZE, sortBy: 'created_at', sortOrder: 'desc' });
                setSearchTerm('');
              }}
              className="text-xs text-blue-700 hover:text-blue-900 font-medium px-2 py-1 rounded-md hover:bg-blue-100 transition-colors border border-blue-100 bg-blue-50"
            >
              Clear All 
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
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
                  placeholder="Name, description..."
                  className="w-full pl-10 pr-3 py-2 text-sm bg-white border-2 border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-gray-700 placeholder-gray-400 shadow-inner"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-800 mb-1.5">Category</label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border-2 border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-gray-700"
              >
                <option value="">All</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-800 mb-1.5">Sub-Category</label>
              <select
                value={filters.sub_category || ''}
                onChange={(e) => handleFilterChange('sub_category', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border-2 border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-gray-700"
              >
                <option value="">All</option>
                {subCategories.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
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
              <label className="block text-xs font-semibold text-blue-800 mb-1.5">Flags</label>
              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-1 text-xs text-gray-700">
                  <input
                    type="checkbox"
                    checked={filters.bestTreatment === 'true'}
                    onChange={(e) => handleFilterChange('bestTreatment', e.target.checked ? 'true' : undefined)}
                    className="h-4 w-4 text-amber-500 border-gray-300 rounded focus:ring-amber-400"
                  />
                  <span>Best</span>
                </label>
                <label className="flex items-center space-x-1 text-xs text-gray-700">
                  <input
                    type="checkbox"
                    checked={filters.popularProduct === 'true'}
                    onChange={(e) => handleFilterChange('popularProduct', e.target.checked ? 'true' : undefined)}
                    className="h-4 w-4 text-amber-500 border-gray-300 rounded focus:ring-amber-400"
                  />
                  <span>Popular</span>
                </label>
              </div>
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
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px]">
              <thead className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Name</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Category</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Price</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Rating</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Flags</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {searchLoading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                      No services found
                    </td>
                  </tr>
                ) : (
                  services.map((svc, idx) => (
                    <tr
                      key={svc._id}
                      className={`transition-colors align-middle ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'} hover:bg-indigo-50/60`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap align-middle">
                        <div className="text-[13px] font-semibold text-gray-900 leading-5">{svc.name}</div>
                        {svc.slug && <div className="text-xs text-gray-500">/{svc.slug}</div>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap align-middle">
                        <div className="text-[13px] text-gray-900 leading-5">
                          {typeof svc.category === 'string'
                            ? categories.find((c) => c._id === svc.category)?.name || '—'
                            : (svc.category as any)?.name || '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap align-middle">
                        <div className="text-[13px] text-gray-900 leading-5">
                          {svc.service_charge ? `₹${svc.service_charge}` : 'N/A'}
                        </div>
                        {svc.consult_charge && (
                          <div className="text-xs text-gray-500">Consult: ₹{svc.consult_charge}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap align-middle">
                        <div className="text-[13px] text-gray-900 leading-5">
                          {svc.ratingAverage ? svc.ratingAverage.toFixed(2) : '—'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {svc.ratingNumber ? `${svc.ratingNumber} rating${svc.ratingNumber > 1 ? 's' : ''}` : 'No ratings'}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap align-middle space-x-1">
                        {svc.bestTreatment && (
                          <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-100">Best</span>
                        )}
                        {svc.popularProduct && (
                          <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100">Popular</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap align-middle">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${svc.status ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                          {svc.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap align-middle flex items-center space-x-2">
                        <button
                          onClick={() => openDetail(svc)}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full hover:bg-blue-100 transition-all shadow-sm hover:shadow"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openEdit(svc)}
                          className="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 rounded-full hover:bg-amber-100 transition-all shadow-sm hover:shadow"
                        >
                          Edit
                        </button>
                        <button
  onClick={() => handleClone(svc)}
  className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-100 rounded-full hover:bg-purple-100 transition-all shadow-sm hover:shadow"
>
  Clone
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
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-amber-50 via-yellow-50 to-white">
              <div>
                <p className="text-sm font-semibold text-gray-900">{isEdit ? 'Edit Service' : 'New Service'}</p>
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

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-col sm:flex-col gap-4 sm:gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Name *</label>
                  <input
  value={formData.name}
  onChange={(e) => {
    const name = e.target.value;

    setFormData((prev: { slug: any; }) => ({
      ...prev,
      name,
      slug: isSlugEdited ? prev.slug : generateSlug(name),
    }));
  }}
  className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
  placeholder="Service name"
/>
{/* <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                    placeholder="Service name"
                  /> */}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Slug (optional)</label>
                 <input
  value={formData.slug || ""}
  onChange={(e) => {
    setIsSlugEdited(true); // user manually editing
    setFormData({ ...formData, slug: generateSlug(e.target.value) });
  }}
  className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
  placeholder="service-slug"
/>
                  {/* <input
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                    placeholder="service-slug"
                  /> */}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({ ...formData, category: e.target.value, sub_category: '' });
                      loadSubCategoriesOptions(e.target.value);
                    }}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Sub-Category *</label>
                  <select
                    value={formData.sub_category}
                    onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                  >
                    <option value="">Select sub-category</option>
                    {subCategories.map((s) => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Service Charge</label>
                  <input
                    value={formData.service_charge || ''}
                    onChange={(e) => setFormData({ ...formData, service_charge: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                    placeholder="4900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Consult Charge</label>
                  <input
                    value={formData.consult_charge || ''}
                    onChange={(e) => setFormData({ ...formData, consult_charge: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                    placeholder="20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Estimate Time</label>
                  <input
                    value={formData.estimate_time || ''}
                    onChange={(e) => setFormData({ ...formData, estimate_time: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                    placeholder="60 mins"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Service Mode</label>
                  <input
                    value={formData.service_mode || ''}
                    onChange={(e) => setFormData({ ...formData, service_mode: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                    placeholder="onsite / online"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Rating Average</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.ratingAverage ?? ''}
                    onChange={(e) => setFormData({ ...formData, ratingAverage: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                    placeholder="e.g., 4.50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Rating Count</label>
                  <input
                    type="number"
                    value={formData.ratingNumber ?? ''}
                    onChange={(e) => setFormData({ ...formData, ratingNumber: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                    placeholder="e.g., 12"
                  />
                </div>
             <div className="sm:col-span-2">
  <label className="block text-xs font-semibold text-gray-700 mb-1">
    FAQ
  </label>

  <div className="space-y-2">
    {(formData.faq || []).map((f: any, idx: number) => (
      <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-2">

        <input
          value={f?.question || ''}
          onChange={(e) => {
            const updated = [...(formData.faq || [])];
            updated[idx] = { ...updated[idx], question: e.target.value };

            setFormData((prev: any) => ({
              ...prev,
              faq: updated
            }));
          }}
          className="px-3 py-2 text-sm border rounded-lg"
          placeholder="Question"
        />

        <div className="flex gap-2">
          <input
            value={f?.answer || ''}
            onChange={(e) => {
              const updated = [...(formData.faq || [])];
              updated[idx] = { ...updated[idx], answer: e.target.value };

              setFormData((prev: any) => ({
                ...prev,
                faq: updated
              }));
            }}
            className="flex-1 px-3 py-2 text-sm border rounded-lg"
            placeholder="Answer"
          />

          <button
            type="button"
            onClick={() => {
              const updated = (formData.faq || []).filter(
                (_: any, i: number) => i !== idx
              );

              setFormData((prev: any) => ({
                ...prev,
                faq: updated
              }));
            }}
            className="px-3 py-2 text-xs text-red-600 bg-red-50 border rounded-lg"
          >
            Remove
          </button>
        </div>

      </div>
    ))}

    <button
      type="button"
      onClick={() =>
        setFormData((prev: any) => ({
          ...prev,
          faq: [...(prev.faq || []), { question: '', answer: '' }]
        }))
      }
      className="px-3 py-2 text-xs text-amber-700 bg-amber-50 border rounded-lg"
    >
      + Add FAQ
    </button>
  </div>
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Gallery Images</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length === 0) return;
                          
                          // Validate files
                          for (const file of files) {
                            if (file.size > 5 * 1024 * 1024) {
                              alert(`Image ${file.name} is too large. Maximum size is 5MB.`);
                              e.target.value = '';
                              return;
                            }
                            if (!file.type.startsWith('image/')) {
                              alert(`File ${file.name} is not a valid image.`);
                              e.target.value = '';
                              return;
                            }
                          }
                          
                          setUploadingImages(true);
                          try {
                            const uploadPromises = files.map(file => uploadFile(file, 'services'));
                            const results = await Promise.all(uploadPromises);
                            const newUrls = results.map(result => result.url);
                            setFormData({ 
                              ...formData, 
                              images: [...(formData.images || []), ...newUrls] 
                            });
                          } catch (error) {
                            console.error('Error uploading images:', error);
                            alert(error instanceof Error ? error.message : 'Failed to upload images. Please try again.');
                          } finally {
                            setUploadingImages(false);
                            e.target.value = '';
                          }
                        }}
                        disabled={uploadingImages}
                        className="hidden"
                        id="gallery-images-upload"
                      />
                      {/* <label
                        htmlFor="gallery-images-upload"
                        className={`flex-1 px-4 py-2 text-sm font-semibold text-center border border-gray-300 rounded-lg cursor-pointer transition-colors ${
                          uploadingImages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {uploadingImages ? 'Uploading...' : 'Choose Images'}
                      </label> */}
                    </div>
                    
                    {/* Image Previews */}
                  {(formData.images || []).length > 0 && (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">

    {(formData.images || []).map((imageUrl: string, index: number) => (
      <div key={index} className="relative group w-full h-24">

        <Image
          src={imageUrl}
          alt={`Gallery ${index + 1}`}
          fill
          className="object-cover rounded-lg border border-gray-200"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
          unoptimized
        />

        <button
          type="button"
          onClick={() => {
            const updated = (formData.images || []).filter(
              (_: any, i: number) => i !== index
            );

            setFormData((prev: any) => ({
              ...prev,
              images: updated
            }));
          }}
          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs"
          title="Remove image"
        >
          ×
        </button>

      </div>
    ))}

  </div>
)}
                    
                    {/* Manual URL Input */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Or enter URLs manually (comma separated)</label>
                      <input
                        type="text"
                        value={formData.images?.join(', ') || ''}
                        onChange={(e) => setFormData({ ...formData, images: e.target.value.split(',').map((v) => v.trim()).filter(Boolean) })}
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                        placeholder="https://img1.jpg, https://img2.jpg"
                      />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Description (HTML allowed)</label>
                   <JoditCDNEditor
                         value={formData.description}
                       onChange={(value:string) => 
                             setFormData((prev:any) => ({
                             ...prev,
                             description: value
                           }))
                       }
                  
                         //  onChange={(value:string) =>
                        //    setForm((prev:any) => ({
                        //      ...prev,
                        //      content: value
                        //    }))
                        //  }
                       />
                          {/* <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                    rows={3}
                    placeholder="<p>Service description...</p>"
                  /> */}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">About Us (optional)</label>
                  <textarea
                    value={formData.aboutUs || ''}
                    onChange={(e) => setFormData({ ...formData, aboutUs: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                    rows={2}
                    placeholder="Short about text"
                  />
                </div>
              
                {/* <div className="sm:col-span-2">
  <div className="flex justify-between items-center mb-2">
    <label className="text-xs font-semibold">Dynamic Sections</label>

    <button
      type="button"
      onClick={() =>
        setFormData((prev: any) => ({
          ...prev,
          sections: [
            ...(prev.sections || []),
            {
              key: `section_${Date.now()}`,
              label: 'New Section',
              value: ''
            }
          ]
        }))
      }
      className="px-3 py-1 text-xs bg-blue-600 text-white rounded"
    >
      + Add Section
    </button>
  </div>

  <div className="space-y-4">
    {(formData.sections || []).map((section: any, index: number) => (
      <div key={section.key} className="border p-3 rounded-lg bg-gray-50">

        <input
          value={section.label}
          onChange={(e) => {
            const updated = [...formData.sections];
            updated[index].label = e.target.value;
            setFormData({ ...formData, sections: updated });
          }}
          placeholder="Section Title"
          className="w-full mb-2 px-3 py-2 border rounded"
        />

        <JoditCDNEditor
          value={section.value}
          onChange={(value: string) => {
            const updated = [...formData.sections];
            updated[index].value = value;
            setFormData({ ...formData, sections: updated });
          }}
        />

        <div className="text-right mt-2">
          <button
            type="button"
            onClick={() => {
              const updated = formData.sections.filter((_: any, i: number) => i !== index);
              setFormData({ ...formData, sections: updated });
            }}
            className="text-red-500 text-xs"
          >
            Remove
          </button>
        </div>

      </div>
    ))}
  </div>
</div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tags (Conditions)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                    {conditions.map((c) => {
                      const checked = formData.tags?.includes(c._id);
                      return (
                        <label key={c._id} className="flex items-center space-x-2 text-xs text-gray-700">
                          <input
                            type="checkbox"
                            checked={!!checked}
                            onChange={(e) => {
                              const next = new Set(formData.tags || []);
                              if (e.target.checked) next.add(c._id);
                              else next.delete(c._id);
                              setFormData({ ...formData, tags: Array.from(next) });
                            }}
                            className="h-4 w-4 text-amber-500 border-gray-300 rounded focus:ring-amber-400"
                          />
                          <span>{c.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="sm:col-span-2">
  <label className="text-xs font-semibold mb-2 block">
    Areas Treated Section
  </label>

  <div className="space-y-2 border p-3 rounded bg-gray-50">

    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={formData.areasTreatedSection.enabled}
        onChange={(e) =>
          setFormData({
            ...formData,
            areasTreatedSection: {
              ...formData.areasTreatedSection,
              enabled: e.target.checked
            }
          })
        }
      />
      Enable
    </label>

    <input
      placeholder="Badge"
      value={formData.areasTreatedSection.badge}
      onChange={(e) =>
        setFormData({
          ...formData,
          areasTreatedSection: {
            ...formData.areasTreatedSection,
            badge: e.target.value
          }
        })
      }
      className="w-full px-3 py-2 border rounded"
    />

    <input
      placeholder="Title"
      value={formData.areasTreatedSection.title}
      onChange={(e) =>
        setFormData({
          ...formData,
          areasTreatedSection: {
            ...formData.areasTreatedSection,
            title: e.target.value
          }
        })
      }
      className="w-full px-3 py-2 border rounded"
    />

    <textarea
      placeholder="Subtitle"
      value={formData.areasTreatedSection.subtitle}
      onChange={(e) =>
        setFormData({
          ...formData,
          areasTreatedSection: {
            ...formData.areasTreatedSection,
            subtitle: e.target.value
          }
        })
      }
      className="w-full px-3 py-2 border rounded"
    />
  </div>
</div> */}

                <div className="flex items-center space-x-3 sm:col-span-2">
                  <label className="flex items-center space-x-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.status ?? true}
                      onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                      className="h-4 w-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-400"
                    />
                    <span>Status Active</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.bestTreatment ?? false}
                      onChange={(e) => setFormData({ ...formData, bestTreatment: e.target.checked })}
                      className="h-4 w-4 text-amber-500 border-gray-300 rounded focus:ring-amber-400"
                    />
                    <span>Best Treatment</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.popularProduct ?? false}
                      onChange={(e) => setFormData({ ...formData, popularProduct: e.target.checked })}
                      className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
                    />
                    <span>Popular</span>
                  </label>
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
                disabled={submitting || !formData.category || !formData.sub_category}
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40 px-4" onClick={closeDetail}>
          <div
            className="bg-white w-full max-w-3xl max-h-[80vh] rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 via-white to-gray-50">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Service Detail
                </p>
                <p className="text-xs text-gray-500">
                  {selectedService?.slug ? `/${selectedService.slug}` : '—'}
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

            <div className="p-5 overflow-y-auto max-h-[calc(80vh-56px)]">
              {detailLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-semibold text-gray-900">{selectedService?.name || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Slug</p>
                    <p className="font-semibold text-gray-900">{selectedService?.slug || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="font-semibold text-gray-900">
                      {typeof selectedService?.category === 'string'
                        ? categories.find((c) => c._id === selectedService.category)?.name || 'N/A'
                        : (selectedService?.category as any)?.name || 'N/A'}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Sub-Category</p>
                    <p className="font-semibold text-gray-900">
                      {typeof selectedService?.sub_category === 'string'
                        ? subCategories.find((s) => s._id === selectedService.sub_category)?.name || 'N/A'
                        : (selectedService?.sub_category as any)?.name || 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Status</p>
                    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${selectedService?.status ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                      {selectedService?.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Best Treatment</p>
                    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${selectedService?.bestTreatment ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                      {selectedService?.bestTreatment ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Popular Product</p>
                    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${selectedService?.popularProduct ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                      {selectedService?.popularProduct ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-xs text-gray-500">Price</p>
                    <p className="font-semibold text-gray-900">
                      {selectedService?.service_charge ? `₹${selectedService.service_charge}` : 'N/A'}
                      {selectedService?.consult_charge ? ` · Consult ₹${selectedService.consult_charge}` : ''}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Rating Average</p>
                    <p className="font-semibold text-gray-900">
                      {selectedService?.ratingAverage ? selectedService.ratingAverage.toFixed(2) : 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Rating Count</p>
                    <p className="font-semibold text-gray-900">
                      {selectedService?.ratingNumber ?? 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-xs text-gray-500">Description</p>
                    <p className="font-semibold text-gray-900 break-words">{selectedService?.description || 'N/A'}</p>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-xs text-gray-500">About Us</p>
                    <p className="font-semibold text-gray-900 break-words">{selectedService?.aboutUs || 'N/A'}</p>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-xs text-gray-500">Image</p>
                    <p className="font-semibold text-gray-900 break-all">{selectedService?.image || 'N/A'}</p>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-xs text-gray-500">Gallery Images</p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                      {selectedService?.images?.length
                        ? selectedService.images.map((img, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 rounded-md border border-gray-200 break-all">{img}</span>
                          ))
                        : 'N/A'}
                    </div>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-xs text-gray-500">Tags (Conditions)</p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                      {selectedService?.tags && Array.isArray(selectedService.tags) && selectedService.tags.length > 0
                        ? (selectedService.tags as any[]).map((t, idx) => {
                            const name = typeof t === 'string'
                              ? conditions.find((c) => c._id === t)?.name || t
                              : t?.name || t?._id || '';
                            return (
                              <span key={`${t}-${idx}`} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100">{name}</span>
                            );
                          })
                        : 'N/A'}
                    </div>
                  </div>
                  {/* <div className="space-y-1 sm:col-span-2">
                    <p className="text-xs text-gray-500">Pre-treatment Care</p>
                    {selectedService?.benefits && selectedService.benefits.length > 0 ? (
                      <ul className="space-y-1 text-gray-800">
                        {selectedService.benefits.map((b, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <span className="mt-[6px] mr-2 h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                            <span className="leading-5">{b.benefits}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-700">N/A</p>
                    )}
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-xs text-gray-500">Post-treatment Care</p>
                    {selectedService?.postTreatmentCare && selectedService.postTreatmentCare.length > 0 ? (
                      <ul className="space-y-1 text-gray-800">
                        {selectedService.postTreatmentCare.map((c, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <span className="mt-[6px] mr-2 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                            <span className="leading-5">{c.tips}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-700">N/A</p>
                    )}
                  </div> */}
                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-xs text-gray-500">FAQ</p>
                    {selectedService?.faq && selectedService.faq.length > 0 ? (
                      <div className="space-y-2 text-gray-800">
                        {selectedService.faq.map((f, idx) => (
                          <div key={idx} className="rounded-md border border-gray-100 bg-gray-50 px-3 py-2">
                            <p className="text-xs font-semibold text-gray-900">Q: {f.question}</p>
                            <p className="text-sm text-gray-700 mt-1">A: {f.answer}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700">N/A</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="font-semibold text-gray-900">
                      {selectedService?.created_at ? new Date(selectedService.created_at).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Updated</p>
                    <p className="font-semibold text-gray-900">
                      {selectedService?.updated_at ? new Date(selectedService.updated_at).toLocaleString() : 'N/A'}
                    </p>
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


