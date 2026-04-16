"use client";

import { useEffect, useState } from "react";
import { leadCapturesApi, LeadCapture, LeadCaptureSearchParams } from "@/utils/api/admin";

const statusOptions: Array<{ label: string; value: "" | "new" | "contacted" | "closed" }> = [
  { label: "All statuses", value: "" },
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Closed", value: "closed" },
];

const sortOptions: Array<{ label: string; value: LeadCaptureSearchParams["sortBy"] }> = [
  { label: "Created (newest)", value: "createdAt" },
  { label: "Schedule time", value: "scheduleDateTime" },
  { label: "Name", value: "name" },
  { label: "Phone", value: "phone" },
  { label: "Status", value: "status" },
];

export default function LeadCapturesPage() {
  const [leads, setLeads] = useState<LeadCapture[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | "new" | "contacted" | "closed">("");
  const [sortBy, setSortBy] = useState<LeadCaptureSearchParams["sortBy"]>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<LeadCapture | null>(null);

  const loadLeads = async (overrides: Partial<LeadCaptureSearchParams> = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await leadCapturesApi.search({
        page,
        limit,
        status,
        sortBy,
        sortOrder,
        search,
        ...overrides,
      });
      setLeads(res.data || []);
      if (res.pagination?.totalPages) {
        setTotalPages(res.pagination.totalPages);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load lead captures");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status, sortBy, sortOrder]);

  const handleSearch = () => {
    setPage(1);
    loadLeads({ page: 1, search });
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
    loadLeads({ page: 1, search: "", status: "", sortBy: "createdAt", sortOrder: "desc" });
  };

  return (
    <div className="py-4 space-y-4">
      <header className="bg-white/90 backdrop-blur border border-gray-200 rounded-xl px-4 py-3 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Lead Captures</h1>
          <p className="text-xs text-gray-600">Admin-only view of captured leads.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetFilters}
            className="px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            Reset
          </button>
        </div>
      </header>

      <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Search (name / phone / email / category)</label>
            <div className="flex gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                placeholder="Jane, +91..., hair"
              />
              <button
                onClick={handleSearch}
                className="px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-indigo-700"
              >
                Search
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none min-w-[150px]"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Sort by</label>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none min-w-[170px]"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value || ""}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div>
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Schedule</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-sm text-gray-600">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-sm text-red-600">
                      {error}
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-sm text-gray-600">
                      No leads found.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{lead.name || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{lead.phone || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{lead.email || "—"}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            lead.status === "closed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : lead.status === "contacted"
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : "bg-blue-50 text-blue-700 border border-blue-100"
                          }`}
                        >
                          {lead.status || "new"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{lead.service?.name || "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {lead.scheduleDateTime
                          ? new Date(lead.scheduleDateTime).toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => setSelected(lead)}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full hover:bg-blue-100 transition"
                        >
                          View
                        </button>
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
            Page {page} of {totalPages || 1}
          </div>
          <div className="space-x-2">
            <button
              onClick={() => page > 1 && setPage(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => page < totalPages && setPage(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40 px-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selected.name || "Lead"}</h3>
                <p className="text-xs text-gray-600">Captured lead details</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5 max-h-[70vh] overflow-y-auto space-y-3">
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-800">
                <div>
                  <p className="text-gray-500 text-xs">Name</p>
                  <p className="font-semibold">{selected.name || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Phone</p>
                  <p className="font-semibold">{selected.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Email</p>
                  <p className="font-semibold">{selected.email || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Status</p>
                  <p className="font-semibold capitalize">{selected.status || "new"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Service</p>
                  <p className="font-semibold">{selected.service?.name || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Category</p>
                  <p className="font-semibold">{selected.categoryName || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Schedule</p>
                  <p className="font-semibold">
                    {selected.scheduleDateTime ? new Date(selected.scheduleDateTime).toLocaleString() : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Created</p>
                  <p className="font-semibold">
                    {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "—"}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-gray-500 text-xs">Address</p>
                  <p className="font-semibold">{selected.address || "—"}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-gray-500 text-xs">User Agent</p>
                  <p className="font-semibold break-words text-xs text-gray-700">{selected.userAgent || "—"}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-gray-500 text-xs">IP Address</p>
                  <p className="font-semibold">{selected.ipAddress || "—"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

