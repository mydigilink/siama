"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/mainwebsite/header";
import Footer from "@/components/mainwebsite/footer";
import { updateProfile, changePassword } from "@/utils/api/public";
import { useAuth } from "@/contexts/AuthContext";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100";

const primaryButtonClass =
  "inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-sky-600 hover:via-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed";

export default function AccountClient() {
  const router = useRouter();
  const { token, user, loading, refreshUser, logout, setAuthFromLogin } = useAuth();
  const [localLoading, setLocalLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [profileForm, setProfileForm] = useState({
    name: "",
    gender: "",
    gst_no: "",
    state: "",
    state_id: "",
    city: "",
    city_id: "",
    pincode: "",
    address: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const load = async () => {
      setLocalLoading(true);
      setError(null);
      await refreshUser();
      setLocalLoading(false);
    };
    load();
  }, [refreshUser]);

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await updateProfile(token, profileForm);
      if (res.status === "error" || !res.data?.user) {
        setError(res.message || "Update failed. Please check your details.");
      } else {
        setAuthFromLogin({ token, user: res.data.user });
        setMessage("Profile updated successfully.");
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setPwdSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await changePassword(token, passwordForm);
      if (res.status === "error" || !res.data?.token) {
        setError(res.message || "Password change failed.");
      } else {
        setAuthFromLogin({ token: res.data.token, user: user || undefined, expiresIn: res.data.expiresIn });
        setPasswordForm({ oldPassword: "", newPassword: "" });
        setMessage("Password changed. Token refreshed for the next 7 days.");
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setPwdSaving(false);
    }
  };

  const handleLogout = async () => {
    logout();
    router.push("/login");
  };

  const handleChange = (field: string, value: string) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const displayName = user?.name || "Guest user";
  const displayEmail = user?.email || "Not provided";
  const displayPhone = user?.phone || "Not provided";
  const displayGender = user?.gender || "Not set";
  const formatDateTime = (value?: string) => {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const displayLastLogin = formatDateTime((user as any)?.last_login);
  // Sync form when user loads
  useEffect(() => {
    if (!user) return;
    setProfileForm({
      name: user.name || "",
      gender: user.gender || "",
      gst_no: user.gst_no || "",
      state: user.state || "",
      state_id: (user as any).state_id || "",
      city: user.city || "",
      city_id: (user as any).city_id || "",
      pincode: user.pincode || "",
      address: user.address || "",
    });
  }, [user]);

  useEffect(() => {
    if (!token && !loading && !localLoading) {
      router.replace("/login");
    }
  }, [token, loading, localLoading, router]);

  if (!token && !loading && !localLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-5 sm:px-8 py-14 pt-24 md:pt-28 lg:pt-32 space-y-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-8 shadow-2xl shadow-slate-200/60">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] text-indigo-600">Dashboard</p>
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Account overview</h1>
              <p className="text-base text-slate-600">
                Manage your profile, security, and session settings in one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => refreshUser()}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700"
              >
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-lg shadow-slate-200/60">
              <p className="text-xs uppercase tracking-[0.16em] text-indigo-600">User</p>
              <p className="text-lg font-semibold">{displayName}</p>
              <p className="text-xs text-slate-600">{displayEmail}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-lg shadow-slate-200/60">
              <p className="text-xs uppercase tracking-[0.16em] text-indigo-600">Phone</p>
              <p className="text-lg font-semibold">{displayPhone}</p>
              <p className="text-xs text-slate-600">Gender: {displayGender}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-lg shadow-slate-200/60">
              <p className="text-xs uppercase tracking-[0.16em] text-indigo-600">Session</p>
              <p className="text-lg font-semibold">
                {token ? "Active" : "Not active"}
              </p>
              <p className="text-xs text-slate-600">Last login: {displayLastLogin}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-lg shadow-slate-200/60">
              <p className="text-xs uppercase tracking-[0.16em] text-indigo-600">Actions</p>
              <p className="text-lg font-semibold">Profile & Security</p>
              <p className="text-xs text-slate-600">Update info, change password</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}
        {message && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-indigo-600">Profile</p>
                <h2 className="text-xl font-semibold text-slate-900">Edit profile</h2>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>Token expires in 7 days from login.</span>
                <button
                  type="button"
                  onClick={() => setShowProfileForm((v) => !v)}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700"
                >
                  {showProfileForm ? "Close" : "Edit"}
                </button>
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-slate-600">Loading profile...</p>
            ) : showProfileForm ? (
              <form className="space-y-4" onSubmit={handleProfileSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Name</label>
                    <input
                      className={inputClass}
                      value={profileForm.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Gender</label>
                    <input
                      className={inputClass}
                      value={profileForm.gender}
                      onChange={(e) => handleChange("gender", e.target.value)}
                      placeholder="Female / Male / Other"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">GST No</label>
                    <input
                      className={inputClass}
                      value={profileForm.gst_no}
                      onChange={(e) => handleChange("gst_no", e.target.value)}
                      placeholder="GST number"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">State</label>
                    <input
                      className={inputClass}
                      value={profileForm.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                      placeholder="State"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">City</label>
                    <input
                      className={inputClass}
                      value={profileForm.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Pincode</label>
                    <input
                      className={inputClass}
                      value={profileForm.pincode}
                      onChange={(e) => handleChange("pincode", e.target.value)}
                      placeholder="Pincode"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Address</label>
                  <textarea
                    className={`${inputClass} min-h-[96px]`}
                    value={profileForm.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Full address"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowProfileForm(false)}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
                  >
                    Cancel
                  </button>
                  <button type="submit" className={primaryButtonClass} disabled={saving}>
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                  <span className="font-semibold text-slate-800 w-28">Name</span>
                  <span>{displayName}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                  <span className="font-semibold text-slate-800 w-28">Email</span>
                  <span>{displayEmail}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                  <span className="font-semibold text-slate-800 w-28">Phone</span>
                  <span>{displayPhone}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                  <span className="font-semibold text-slate-800 w-28">Gender</span>
                  <span>{displayGender}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                  <span className="font-semibold text-slate-800 w-28">GST No</span>
                  <span>{profileForm.gst_no || "Not set"}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                  <span className="font-semibold text-slate-800 w-28">State</span>
                  <span>{profileForm.state || "Not set"}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                  <span className="font-semibold text-slate-800 w-28">City</span>
                  <span>{profileForm.city || "Not set"}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                  <span className="font-semibold text-slate-800 w-28">Pincode</span>
                  <span>{profileForm.pincode || "Not set"}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                  <span className="font-semibold text-slate-800 w-28">Address</span>
                  <span>{profileForm.address || "Not set"}</span>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.18em] text-indigo-600">Security</p>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Change password</h2>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm((v) => !v)}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700"
                >
                  {showPasswordForm ? "Close" : "Change"}
                </button>
              </div>
            </div>
            {showPasswordForm ? (
              <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Current password</label>
                  <input
                    type="password"
                    className={inputClass}
                    value={passwordForm.oldPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, oldPassword: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">New password</label>
                  <input
                    type="password"
                    className={inputClass}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
                  >
                    Cancel
                  </button>
                  <button type="submit" className={primaryButtonClass} disabled={pwdSaving}>
                    {pwdSaving ? "Updating..." : "Update password"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-semibold text-slate-800">Secure your account</p>
                <p className="text-sm text-slate-600">
                  Click &quot;Change&quot; to update your password. Tokens refresh automatically after change.
                </p>
              </div>
            )}

            <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Session info</p>
              <ul className="mt-2 space-y-1">
                <li>• Token is required for protected routes (Authorization: Bearer &lt;token&gt;).</li>
                <li>• Token refreshes when you change password.</li>
                <li>• Logout to clear token from this device.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
