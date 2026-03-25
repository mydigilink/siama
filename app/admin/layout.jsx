import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

import LayoutWrapperAdmin from "@/components/admin/LayoutWrapperAdmin";
export default function AdminLayout({ children }) {
  return (
    <LayoutWrapperAdmin>
        {children}
    </LayoutWrapperAdmin>
//     <div className="flex min-h-screen bg-gray-100">
//       {/* <AdminSidebar /> */}

//       <div className="flex-1 flex flex-col">
//         {/* <AdminHeader /> */}
//         <main className="p-6">{children}</main>
//       </div>
//     </div>
   );
}