"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuickChatButton from "../QuickChatButton";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import "../../app/admin.css";
import Link from "next/link";
export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
 

  const isAdminRoute = pathname.startsWith("/admin/login");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
     <div className="container-fluid p-0" style={{ backgroundColor: "#f6f7fb" }}>
      <div className="row g-0" style={{ minHeight: "100vh" }}>
        {/* LEFT SIDEBAR */}
      <AdminSidebar />

        {/* MAIN CONTENT */}
        <div className="col-lg-10 col-12">
        {children}  
        </div>

        {/* RIGHT SIDEBAR */}
      
      </div>
    </div>
    {/* <div className="flex min-h-screen bg-gray-100">
            <AdminHeader />  
          
              
            <main className="row flex-1">
            <AdminSidebar />  
            <div className="col-md-10">
             
            </div>
            </main>
          </div> */}
              
         
    </>
  );
}