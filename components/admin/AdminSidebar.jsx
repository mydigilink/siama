"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
 const menu = [
    { name: "Dashboard", icon: "bi bi-grid-fill", path: "/admin/dashboard" },
    { name: "Blogs", icon: "bi bi-journal-text", path: "/admin/blogs" },
    { name: "Create Blog", icon: "bi bi-plus-square", path: "/admin/blogs/create" },
    { name: "Media", icon: "bi bi-images", path: "/admin/media" },
    { name: "Settings", icon: "bi bi-gear", path: "/admin/settings" },
  ];
  
  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

//   const menu = [
//     { name: "Dashboard", path: "/admin/dashboard" },
//     { name: "Blogs", path: "/admin/blogs" },
//     { name: "Create Blog", path: "/admin/blogs/create" },
//   ];

  return (
    // <aside className="col-md-2 w-64 bg-black text-white min-h-screen ">
    //   {/* <h2 className="text-2xl font-bold mb-8">Siama Admin</h2> */}

    //   <nav className="space-y-3">
    //     {menu.map((item) => (
    //   <li>  <Link
    //         key={item.path}
    //         href={item.path}
    //         className={` admin-sidebar-link block px-1 py-1 rounded-lg ${
    //           pathname === item.path
    //             ? "bg-orange-500"
    //             : "bg-zinc-900 hover:bg-zinc-800"
    //         }`}
    //       >
    //         {item.name}
    //       </Link>
    //       </li>  
    //     ))}
    //   </nav>
    // </aside>
    <>  <div className="col-lg-2 d-none d-lg-block">
          <div
            className="bg-white border-end d-flex flex-column p-4"
            style={{ minHeight: "100vh" }}
          >
            <div className="d-flex align-items-center gap-2 mb-5">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                style={{
                  width: "36px",
                  height: "36px",
                  backgroundColor: "#000000",
                }}
              >
                S
              </div>
              <h5 className="mb-0 fw-bold">Administrator</h5>
            </div>

            <nav className="d-flex flex-column gap-2">
              {menu.map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  className={`text-decoration-none d-flex align-items-center gap-3 px-3 py-3 rounded-3 ${
                    index === 0 ? "text-primary bg-primary bg-opacity-10 fw-semibold" : "text-dark"
                  }`}
                >
                  <i className={item.icon}></i>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-auto">
              <button
                onClick={handleLogout}
                className="btn btn-light w-100 text-start d-flex align-items-center gap-2"
              >
                <i className="bi bi-box-arrow-right"></i> Logout
              </button>
            </div>
          </div>
        </div></>
  );
}