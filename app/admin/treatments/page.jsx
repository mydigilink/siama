"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminTreatmentsPage() {
  const [treatments, setTreatments] = useState([]);

  const loadTreatments = async () => {
    const res = await fetch("/api/treatments");
    const data = await res.json();
    setTreatments(data.treatments || []);
  };

  useEffect(() => {
    loadTreatments();
  }, []);

  const deleteTreatment = async (id) => {
    if (!confirm("Delete this treatment?")) return;

    await fetch(`/api/treatments/${id}`, { method: "DELETE" });
    loadTreatments();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Treatments</h1>
        <Link
          href="/admin/treatments/new"
          className="bg-black text-white px-5 py-3 rounded-lg"
        >
          Add New
        </Link>
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Gender</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {treatments.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="p-4">{item.title}</td>
                <td className="p-4 capitalize">{item.gender}</td>
                <td className="p-4">{item.category}</td>
                <td className="p-4">₹{item.salePrice > 0 ? item.salePrice : item.price}</td>
                <td className="p-4">{item.active ? "Active" : "Inactive"}</td>
                <td className="p-4 flex gap-2">
                  <Link
                    href={`/admin/treatments/edit/${item._id}`}
                    className="px-3 py-1 border rounded"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteTreatment(item._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}