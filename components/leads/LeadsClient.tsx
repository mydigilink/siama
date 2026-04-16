"use client";

import { useEffect, useMemo, useState } from "react";
type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};


type LeadCapture = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  scheduleDateTime?: string;
  address?: string;
  service?: string;
  categoryName?: string;
  ipAddress?: string;
  userAgent?: string;
  status?: string;
  referrerUrl?: string;
  pagePath?: string;
  createdAt?: string;
  updatedAt?: string;
};

type Lead = {
  _id: string;
  name: string;
  number: string;
  address?: string;
  gender?: string;
  city?: string;
  state?: string;
  service?: { _id: string; name: string };
  createdAt?: string;
};

const DEFAULT_BASE =
  process.env.NEXT_PUBLIC_PUBLIC_API_BASE_URL || "";

export default function LeadsClient() {
  const [token, setToken] = useState("");
  const [referrerUrl, setReferrerUrl] = useState("");
  const [pagePath, setPagePath] = useState("");
  const [captures, setCaptures] = useState<LeadCapture[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [capturesPg, setCapturesPg] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [leadsPg, setLeadsPg] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("public_data_token");
    if (storedToken) setToken(storedToken);

    if (typeof window !== "undefined") {
      setReferrerUrl(document.referrer || window.location.href);
      setPagePath(window.location.pathname);
    }
  }, []);

  const headers = useMemo(
    () => ({
      "x-public-token": token.trim(),
    }),
    [token]
  );

  const fetchSecure = async <T,>(
    endpoint: string,
    page: number,
    limit: number
  ): Promise<{ data: T[]; pagination: Pagination; error?: string }> => {
    const fallback: Pagination = { page, limit, total: 0, totalPages: 1 };

    if (!token.trim()) {
      return { data: [], pagination: fallback, error: "Please enter a token first." };
    }

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (referrerUrl) params.append("referrerUrl", referrerUrl);
      if (pagePath) params.append("pagePath", pagePath);

      const res = await fetch(`${DEFAULT_BASE}${endpoint}?${params.toString()}`, {
        headers,
      });
      if (!res.ok) {
        const text = await res.text();
        return { data: [], pagination: fallback, error: `${res.status} ${res.statusText} - ${text}` };
      }
      const json = await res.json();
      return {
        data: json.data || [],
        pagination: json.pagination || fallback,
      };
    } catch (err: any) {
      return { data: [], pagination: fallback, error: err?.message || "Request failed" };
    }
  };

  const loadData = async (opts?: { capturesPage?: number; leadsPage?: number }) => {
    const cPage = opts?.capturesPage ?? capturesPg.page;
    const lPage = opts?.leadsPage ?? leadsPg.page;
    setLoading(true);
    setError(null);

    const [capRes, leadRes] = await Promise.all([
      fetchSecure<LeadCapture>("/lead-captures/secure", cPage, capturesPg.limit),
      fetchSecure<Lead>("/leads/secure", lPage, leadsPg.limit),
    ]);

    if (capRes.error || leadRes.error) {
      setError(capRes.error || leadRes.error || "Something went wrong.");
    }

    setCaptures(capRes.data);
    setCapturesPg(capRes.pagination);

    setLeads(leadRes.data);
    setLeadsPg(leadRes.pagination);
    setLoading(false);

    // persist token/base for convenience
    sessionStorage.setItem("public_data_token", token.trim());
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Public Data Token</label>
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
              placeholder="Enter x-public-token"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadData({ capturesPage: 1, leadsPage: 1 })}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-sm"
          >
            Load data
          </button>
          {loading && <span className="text-xs text-gray-600">Loading…</span>}
          {error && <span className="text-xs text-red-600">{error}</span>}
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Lead Captures</h2>
          <div className="text-sm text-gray-600">
            Page {capturesPg.page} of {capturesPg.totalPages || 1}
          </div>
        </div>
        <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Referrer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Page</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Schedule</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {captures.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-6 text-center text-sm text-gray-600">
                      {loading ? "Loading..." : "No lead captures found."}
                    </td>
                  </tr>
                ) : (
                  captures.map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{lead.name || "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{lead.phone || "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{lead.email || "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{lead.status || "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{lead.categoryName || "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-[220px] truncate" title={lead.referrerUrl || "—"}>
                        {lead.referrerUrl || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{lead.pagePath || "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {lead.scheduleDateTime ? new Date(lead.scheduleDateTime).toLocaleString() : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-700">
          <div>
            Showing page {capturesPg.page} of {capturesPg.totalPages || 1}
          </div>
          <div className="space-x-2">
            <button
              onClick={() => {
                if (capturesPg.page > 1) {
                  setCapturesPg((p) => ({ ...p, page: p.page - 1 }));
                  loadData({ capturesPage: capturesPg.page - 1 });
                }
              }}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm disabled:opacity-50"
              disabled={capturesPg.page <= 1 || loading}
            >
              Prev
            </button>
            <button
              onClick={() => {
                if (capturesPg.page < (capturesPg.totalPages || 1)) {
                  setCapturesPg((p) => ({ ...p, page: p.page + 1 }));
                  loadData({ capturesPage: capturesPg.page + 1 });
                }
              }}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm disabled:opacity-50"
              disabled={capturesPg.page >= (capturesPg.totalPages || 1) || loading}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Leads</h2>
          <div className="text-sm text-gray-600">
            Page {leadsPg.page} of {leadsPg.totalPages || 1}
          </div>
        </div>
        <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Number</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">City/State</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-600">
                      {loading ? "Loading..." : "No leads found."}
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{lead.name || "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{lead.number || "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {[lead.city, lead.state].filter(Boolean).join(", ") || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{lead.service?.name || "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-700">
          <div>
            Showing page {leadsPg.page} of {leadsPg.totalPages || 1}
          </div>
          <div className="space-x-2">
            <button
              onClick={() => {
                if (leadsPg.page > 1) {
                  setLeadsPg((p) => ({ ...p, page: p.page - 1 }));
                  loadData({ leadsPage: leadsPg.page - 1 });
                }
              }}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm disabled:opacity-50"
              disabled={leadsPg.page <= 1 || loading}
            >
              Prev
            </button>
            <button
              onClick={() => {
                if (leadsPg.page < (leadsPg.totalPages || 1)) {
                  setLeadsPg((p) => ({ ...p, page: p.page + 1 }));
                  loadData({ leadsPage: leadsPg.page + 1 });
                }
              }}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm disabled:opacity-50"
              disabled={leadsPg.page >= (leadsPg.totalPages || 1) || loading}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

