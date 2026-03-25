  "use client";
  import { useEffect, useState } from "react";
  import RightSideBar from "@/components/admin/RightSideBar";
  import Link from "next/link";

  export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
      treatments: 0,
      orders: 0,
      revenue: 0,
    });
    
    useEffect(() => {
      async function load() {
        const [treatmentsRes, ordersRes] = await Promise.all([
          fetch("/api/treatments"),
          fetch("/api/orders"),
        ]);

        const tData = await treatmentsRes.json();
        const oData = await ordersRes.json();

        const orders = oData.orders || [];
        const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

        setStats({
          treatments: tData.treatments?.length || 0,
          orders: orders.length,
          revenue,
        });
      }

      load();
    }, []);



    const progress = [
      { name: "John Doe", role: "UI/UX Designer", status: "Tech Interview" },
      { name: "Sam Emmanuel", role: "UI/UX Designer", status: "Task" },
      { name: "John Samuel", role: "PHP Developer", status: "Resume Review", active: true },
      { name: "Sam Emmanuel", role: "UI/UX Designer", status: "Task" },
      { name: "John Doe", role: "Content Designer", status: "Final Interview" },
      { name: "John Samuel", role: "PHP Developer", status: "Resume Review" },
    ];


    const getStatusBadge = (status) => {
      switch (status) {
        case "Tech Interview":
          return "primary";
        case "Task":
          return "warning";
        case "Resume Review":
          return "success";
        case "Final Interview":
          return "danger";
        default:
          return "secondary";
      }
    };

    const handleLogout = async () => {
      try {
        await fetch("/api/admin/logout", { method: "POST" });
        window.location.href = "/admin/login";
      } catch (error) {
        alert("Logout failed");
      }
    };

    return (
    <>
    <div className="row">
      <div className="col-md-12">
        <div className="p-3 p-md-4">
              {/* TOPBAR */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div className="input-group" style={{ maxWidth: "420px" }}>
                  <span className="input-group-text bg-white border-0 rounded-start-4">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 rounded-end-4 shadow-sm"
                    placeholder="Search something..."
                  />
                </div>

                <button className="btn btn-primary rounded-4 px-4 py-2 fw-semibold">
                  Add New <i className="bi bi-chevron-down ms-1"></i>
                </button>
              </div>

              {/* WELCOME BANNER */}
              <div
                className="rounded-4 p-4 p-md-5 mb-4 text-white position-relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #000000, #bdbdbd)",
                }}
              >
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h2 className="fw-bold mb-2">Good Morning, Siama</h2>
                    <p className="mb-3 opacity-75">
                      {/* You have 75 new applications. It is a lot of work for today! So let's start. */}
                    </p>
                    {/* <button className="btn btn-light btn-sm rounded-3 px-3 fw-semibold">
                      Review It
                    </button> */}
                  </div>
                  <div className="col-md-4 d-none d-md-block text-end">
                    <i className="bi bi-person-workspace" style={{ fontSize: "90px", opacity: 0.85 }}></i>
                  </div>
                </div>
              </div>
  <div className="d-flex md:grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-3 shadow-sm border">
            <h5 className="text-gray-500">Total Treatments</h5>
            <p className="text-3xl font-bold mt-0 mb-0">{stats.treatments}</p>
          </div>

          <div className="bg-white rounded-2xl p-3 shadow-sm border">
            <h5 className="text-gray-500">Total Orders</h5>
            <p className="text-3xl font-bold mt-0 mb-0">{stats.orders}</p>
          </div>

          <div className="bg-white rounded-2xl p-3 shadow-sm border">
            <h5 className="text-gray-500">Revenue</h5>
            <p className="text-3xl font-bold mt-0 mb-0">₹{stats.revenue}</p>
          </div>
        </div>
              {/* NEED TO HIRE */}
              {/* <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">You Need to Hire</h5>
                <button className="btn btn-sm btn-primary rounded-pill px-3">View All</button>
              </div>

              <div className="row g-3 mb-4">
                {stats.map((item, index) => (
                  <div className="col-md-4 col-lg-4 col-xl" key={index}>
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                      <div className="card-body text-center p-3">
                        <div
                          className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-4"
                          style={{
                            width: "54px",
                            height: "54px",
                            backgroundColor: item.bg,
                            color: item.color,
                            fontSize: "24px",
                          }}
                        >
                          <i className={item.icon}></i>
                        </div>
                        <h6 className="fw-semibold mb-1">{item.title}</h6>
                        <small className="text-muted">{item.count}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div> */}

              {/* RECRUITMENT PROGRESS */}
              {/* <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Recruitment Progress</h5>
                <button className="btn btn-sm btn-primary rounded-pill px-3">View All</button>
              </div>

              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="px-4 py-3">Full Name</th>
                          <th className="px-4 py-3">Designation</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {progress.map((item, index) => (
                          <tr
                            key={index}
                            style={
                              item.active
                                ? { backgroundColor: "#4f46e5", color: "#fff" }
                                : {}
                            }
                          >
                            <td className="px-4 py-3">{item.name}</td>
                            <td className="px-4 py-3">{item.role}</td>
                            <td className="px-4 py-3">
                              {item.active ? (
                                <span className="badge bg-light text-primary rounded-pill px-3 py-2">
                                  {item.status}
                                </span>
                              ) : (
                                <span
                                  className={`badge bg-${getStatusBadge(
                                    item.status
                                  )} bg-opacity-10 text-${getStatusBadge(item.status)} rounded-pill px-3 py-2`}
                                >
                                  {item.status}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-end">
                              <button
                                className={`btn btn-sm ${
                                  item.active ? "btn-light text-primary" : "btn-light"
                                }`}
                              >
                                <i className="bi bi-three-dots-vertical"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div> */}
            </div>
            </div>
      {/* <div className="col-md-3 "><RightSideBar /></div> */}
      </div> 
      </>
    );
  }