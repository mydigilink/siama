"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumb({
  homeLabel = "Home",
  className = "",
}) {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");

    const label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    return {
      href,
      label,
    };
  });

  return (
    <section className={`bg-gray-100 py-4 ${className}`}>
      <div className="container mx-auto px-0">
        <nav
          className="d-flex  align-items-center flex-wrap text-sm text-gray-600"
          aria-label="Breadcrumb"
        >
          <Link
            href="/"
            className="d-flex align-items-center gap-2 hover:text-black transition"
          >
            <Home size={16} />
            <span>{homeLabel}</span>
          </Link>

          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <div key={item.href} className="d-flex  align-items-center">
                <ChevronRight size={16} className="mx-2 text-gray-400" />

                {isLast ? (
                  <span className="font-medium text-black">{item.label}</span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-black transition"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </section>
  );
}