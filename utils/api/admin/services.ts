// utils/api/admin/services.ts

const BASE = "/api/services";

export const servicesApi = {
  search: async (params: any) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE}?${query}`);
    return res.json();
  },

  getById: async (id: string) => {
    const res = await fetch(`${BASE}/${id}`);
    return res.json();
  },

  create: async (data: any) => {
    const res = await fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  update: async (id: string, data: any) => {
    const res = await fetch(`${BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  toggleStatus: async (id: string) => {
    const res = await fetch(`${BASE}/${id}/status`, {
      method: "PATCH",
    });
    return res.json();
  },

  toggleBestTreatment: async (id: string) => {
    const res = await fetch(`${BASE}/${id}/best`, {
      method: "PATCH",
    });
    return res.json();
  },

  togglePopularProduct: async (id: string) => {
    const res = await fetch(`${BASE}/${id}/popular`, {
      method: "PATCH",
    });
    return res.json();
  },
};