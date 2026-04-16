import { Suspense } from "react";
import Header from "@/components/mainwebsite/header";
import Footer from "@/components/mainwebsite/footer";
import Link from "next/link";

function NotFoundContent() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-indigo-50/40 text-gray-900">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-100 blur-3xl opacity-70" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-amber-100 blur-3xl opacity-70" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 py-20 lg:py-28">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
              <div className="space-y-6">
                <p className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm">
                  404 · Page not found
                </p>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
                  We can’t find the page you’re looking for.
                </h1>
                <p className="text-lg text-gray-700 leading-relaxed">
                  The link may be broken or the page may have been moved. Let’s get you back to the right place—try heading home or explore our services.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    Go to Home
                    <span aria-hidden>→</span>
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-indigo-100 bg-white text-indigo-700 font-semibold shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                  >
                    Browse Services
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-gray-200 text-gray-800 font-semibold shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
                  >
                    Contact Us
                  </Link>
                </div>

                <div className="mt-8 grid sm:grid-cols-3 gap-4">
                  {[
                    { title: "Book a consult", desc: "Quick response from our care team." },
                    { title: "Find a treatment", desc: "Laser, skin, hair & more specialties." },
                    { title: "Talk to experts", desc: "Personalized plans to meet your goals." },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-gray-100 bg-white/70 p-4 shadow-sm backdrop-blur-sm"
                    >
                      <div className="text-base font-semibold text-gray-900">{item.title}</div>
                      <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="rounded-3xl bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-xl shadow-indigo-100 p-10 text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 border border-indigo-100 shadow-md">
                    <span className="text-4xl font-bold text-indigo-700">404</span>
                  </div>
                  <h2 className="mt-6 text-2xl font-semibold text-gray-900">Let’s get you back</h2>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    Still need help? Reach out to our support team and we’ll guide you to the right destination.
                  </p>
                  <div className="mt-6 flex flex-col gap-3">
                    <a
                      href="tel:+918287795045"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
                    >
                      Call us · 82877 95045
                    </a>
                    <a
                      href="mailto:reach.siama@gmail.com"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
                    >
                      Email support
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      }
    >
      <NotFoundContent />
    </Suspense>
  );
}

