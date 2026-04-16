'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Coupon = {
  _id?: string;
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  maxDiscount?: number;
  minCartValue?: number;
  validTill?: string;
  isActive?: boolean;
};

export default function CouponAdmin() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<Coupon>({
    code: '',
    type: 'percentage',
    value: 0,
    maxDiscount: 0,
    minCartValue: 0,
    validTill: '',
  });

  /* ================= FETCH ================= */
  const fetchCoupons = async () => {
    const res = await fetch('/api/admin/coupons/list');
    const data = await res.json();
    setCoupons(data.data || []);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const url = editingId
      ? `/api/admin/coupons/update/${editingId}`
      : '/api/admin/coupons/create';

    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.status === 'success') {
      alert(editingId ? 'Updated' : 'Created');

      setForm({
        code: '',
        type: 'percentage',
        value: 0,
        maxDiscount: 0,
        minCartValue: 0,
        validTill: '',
      });

      setEditingId(null);
      fetchCoupons();
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (c: Coupon) => {
    setForm({
      code: c.code,
      type: c.type,
      value: c.value,
      maxDiscount: c.maxDiscount || 0,
      minCartValue: c.minCartValue || 0,
      validTill: c.validTill?.split('T')[0] || '',
    });

    setEditingId(c._id || null);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    if (!confirm('Delete coupon?')) return;

    await fetch(`/api/admin/coupons/delete/${id}`, {
      method: 'DELETE',
    });

    fetchCoupons();
  };

  /* ================= TOGGLE ================= */
  const toggleStatus = async (id: string) => {
    await fetch(`/api/admin/coupons/toggle/${id}`, {
      method: 'PATCH',
    });

    fetchCoupons();
  };

  /* ================= UI ================= */
  return (
   <>
   <div className="p-10">
         <div className="flex justify-between mb-6">
           <h1 className="text-2xl font-bold">{editingId ? 'Edit Coupon' : 'Create Coupon'}</h1>
{/*    
           <Link
             href="/admin/blogs/new"
             className="bg-black text-white px-4 py-2"
           >
             Create Blog
           </Link> */}
         </div>
    <form
  onSubmit={handleSubmit}
  className=" gap-6 mb-8 p-6 border border-gray-200 rounded-2xl bg-white shadow-sm"
>
  {/* Coupon Code */}
  <div className="w-full space-y-2">
    <label className="text-sm font-semibold text-gray-700">
      Coupon Code
    </label>
    <div className="relative">
      <input
        value={form.code}
        onChange={(e) =>
          setForm({ ...form, code: e.target.value.toUpperCase() })
        }
        placeholder="Enter coupon code"
        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
    </div>
  </div>

  {/* Type */}
  <div className="w-full space-y-2">
    <label className="text-sm font-semibold text-gray-700">
      Coupon Type
    </label>
    <select
      value={form.type}
      onChange={(e) =>
        setForm({ ...form, type: e.target.value as any })
      }
      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
    >
      <option value="percentage">Percentage</option>
      <option value="flat">Flat</option>
    </select>
  </div>

  {/* Value */}
  <div className="w-full space-y-2">
    <label className="text-sm font-semibold text-gray-700">
      Value
    </label>
    <div className="relative">
      <input
        type="number"
        value={form.value}
        onChange={(e) =>
          setForm({ ...form, value: Number(e.target.value) })
        }
        placeholder="Enter value"
        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>

  {/* Max Discount */}
  {form.type === 'percentage' && (
    <div className="w-full space-y-2">
      <label className="text-sm font-semibold text-gray-700">
        Max Discount
      </label>
      <input
        type="number"
        value={form.maxDiscount}
        onChange={(e) =>
          setForm({ ...form, maxDiscount: Number(e.target.value) })
        }
        placeholder="Max discount"
        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )}

  {/* Min Cart */}
  <div className="w-full space-y-2">
    <label className="text-sm font-semibold text-gray-700">
      Minimum Cart Value
    </label>
    <input
      type="number"
      value={form.minCartValue}
      onChange={(e) =>
        setForm({ ...form, minCartValue: Number(e.target.value) })
      }
      placeholder="Minimum order value"
      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Expiry */}
  <div className="w-full space-y-2">
    <label className="text-sm font-semibold text-gray-700">
      Expiry Date
    </label>
    <input
      type="date"
      value={form.validTill}
      onChange={(e) =>
        setForm({ ...form, validTill: e.target.value })
      }
      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Button */}
  <button
    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
  >
    {editingId ? 'Update Coupon' : 'Create Coupon'}
  </button>
</form>

       </div>
  <div style={{ padding: 20, maxWidth: 1000, margin: 'auto' }}>
      <h1 style={{ marginBottom: 20 }}>
        
      </h1>

      {/* FORM */}
     
      {/* TABLE */}
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
  <table className="w-full text-sm text-left">
    
    {/* HEADER */}
    <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
      <tr>
        <th className="px-6 py-4">Code</th>
        <th className="px-6 py-4">Type</th>
        <th className="px-6 py-4">Value</th>
        <th className="px-6 py-4">Min Cart</th>
        <th className="px-6 py-4">Status</th>
        <th className="px-6 py-4 text-right">Actions</th>
      </tr>
    </thead>

    {/* BODY */}
    <tbody className="divide-y divide-gray-100">
      {coupons.map((c) => (
        <tr
          key={c._id}
          className="hover:bg-gray-50 transition"
        >
          {/* CODE */}
          <td className="px-6 py-4 font-semibold text-gray-900">
            {c.code}
          </td>

          {/* TYPE */}
          <td className="px-6 py-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              c.type === 'percentage'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {c.type === 'percentage' ? '%' : '₹'}
            </span>
          </td>

          {/* VALUE */}
          <td className="px-6 py-4 font-medium">
            {c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}
          </td>

          {/* MIN CART */}
          <td className="px-6 py-4 text-gray-600">
            ₹{c.minCartValue || 0}
          </td>

          {/* STATUS */}
          <td className="px-6 py-4">
            <button
              onClick={() => toggleStatus(c._id!)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                c.isActive
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              {c.isActive ? 'Active' : 'Disabled'}
            </button>
          </td>

          {/* ACTIONS */}
          <td className="px-6 py-4 text-right space-x-2">
            <button
              onClick={() => handleEdit(c)}
              className="px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(c._id!)}
              className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </div> </> 
  );
}