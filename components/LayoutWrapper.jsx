"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuickChatButton from "./QuickChatButton";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
            <Navbar />  
              {children}
                <Footer />
                  <QuickChatButton />
         
    </>
  );
}