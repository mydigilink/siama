"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/mainwebsite/header";
import Footer from "@/components/mainwebsite/footer";
import {
  loginUser,
  registerUser,
  AuthSuccess,
} from "@/utils/api/public";
import { useAuth } from "@/contexts/AuthContext";

type Mode = "login" | "signup";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100";

const primaryButtonClass =
  "inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-sky-600 hover:via-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed";

const ghostButtonClass =
  "inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:opacity-70 disabled:cursor-not-allowed";

export default function LoginPage() {
  const router = useRouter();
  const { setAuthFromLogin, user } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const handleAuthSuccess = (data?: AuthSuccess) => {
    if (!data?.token) return;
    setAuthFromLogin(data);
    setSuccess("Authenticated. Redirecting to your dashboard...");
    setTimeout(() => router.push("/account"), 600);
  };

  useEffect(() => {
    if (user) {
      router.replace("/account");
    }
  }, [user, router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "login") {
        if (!identifier.trim()) {
          setError("Please enter email or phone.");
          setLoading(false);
          return;
        }
        const res = await loginUser({ identifier: identifier.trim(), password });
        if (res.status === "error" || !res.data) {
          setError(res.message || "Login failed. Please check your details.");
        } else {
          handleAuthSuccess(res.data);
        }
      } else {
        if (!phone.trim()) {
          setError("Phone number is required to sign up.");
          setLoading(false);
          return;
        }
        const res = await registerUser({
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim(),
          password,
        });
        if (res.status === "error" || !res.data) {
          setError(res.message || "Sign up failed. Please try again.");
        } else {
          handleAuthSuccess(res.data);
        }
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-24 md:pt-28 lg:pt-32">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="mb-6 space-y-2 text-center">
              <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-100 ring-1 ring-white/10">
              Siama Secure Access
            </div>
            <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
              {mode === "login" ? "Login to continue" : "Create your account"}
            </h1>
            <p className="text-sm text-slate-200">
              Sign in or sign up to manage bookings, leads, and your profile.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-indigo-100">
                  {mode === "login" ? "Welcome back" : "Join Siama"}
                </p>
                <h2 className="text-xl font-semibold text-white">
                  {mode === "login" ? "Login" : "Sign up"}
                </h2>
              </div>
              <div className="inline-flex rounded-full border border-white/20 bg-white/10 p-1">
                <button
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    mode === "login" ? "bg-white text-slate-900" : "text-white"
                  }`}
                  onClick={() => setMode("login")}
                  type="button"
                >
                  Login
                </button>
                <button
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    mode === "signup" ? "bg-white text-slate-900" : "text-white"
                  }`}
                  onClick={() => setMode("signup")}
                  type="button"
                >
                  Sign up
                </button>
              </div>
            </div>

            <form className="space-y-4 pt-5" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {success}
                </div>
              )}

              {mode === "signup" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Full name</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              {mode === "signup" ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Email (optional)</label>
                    <input
                      type="email"
                      className={inputClass}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Phone *</label>
                    <input
                      type="tel"
                      className={inputClass}
                      placeholder="+91-9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Email or Phone</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="you@example.com or +91-9876543210"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Password</label>
                <input
                  type="password"
                  className={inputClass}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3 pt-2">
                <button type="submit" className={primaryButtonClass} disabled={loading}>
                  {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
                </button>
                <button
                  type="button"
                  className={ghostButtonClass}
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  disabled={loading}
                >
                  {mode === "login" ? "Need an account? Sign up" : "Have an account? Login"}
                </button>
              </div>

              <p className="text-center text-xs text-slate-200">
                Bearer token is stored for 7 days. Update profile and change password in your
                dashboard.
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

