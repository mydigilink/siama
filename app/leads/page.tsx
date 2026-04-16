import { Suspense } from "react";
import LeadsClient from "@/components/leads/LeadsClient";
import Header from "@/components/mainwebsite/header";
import Footer from "@/components/mainwebsite/footer";

type LeadsPageProps = {
  searchParams?: Promise<any>;
};

function LeadsPageContent() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
          <header className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">Leads & Lead Captures</h1>
            <p className="text-sm text-gray-600">Enter token, fetch, and view data.</p>
          </header>

          <LeadsClient />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 py-10 flex items-center justify-center">
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        </div>
      }
    >
      <LeadsPageContent />
    </Suspense>
  );
}

