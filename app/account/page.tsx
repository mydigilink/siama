import { Suspense } from "react";
import AccountClient from "./AccountClient";

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      }
    >
      <AccountClient />
    </Suspense>
  );
}
