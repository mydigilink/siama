"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      router.push("/admin/dashboard");
    } else {
      alert(data.message);
    }

    setLoading(false);
  };

  return (
 <div className="container-fluid p-0">
      <div className="row g-0" style={{ minHeight: "100vh" }}>
        
        {/* LEFT SIDE */}
        <div style={{backgroundImage:"url(/img/aboutmain.jpeg)"}} className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center text-white login-left">
          <div className="px-5">
            {/* <h1 className="display-4 fw-bold mb-3 text-shadow">
              Hello <br /> SIAMA! 👋
            </h1>

            <p className="lead">
              SIAMA automates repetitive and manual sales-marketing tasks.  
              Get highly productive through automation and save tons of time!
            </p> */}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-light">
          <div style={{ width: "100%", maxWidth: "420px" }} className="p-4">

         

            <h3 className="fw-bold mb-2">Welcome Back! SIAMA</h3>

            <p className="text-muted mb-4">
              Don't have an account? <a href="https://wa.me/+918299881237?text=I%20am%20interested%20in%20your%20services">Request Access</a>
            </p>

            <form onSubmit={handleSubmit}>
              
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-dark w-100 py-3 mb-3"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login Now"}
              </button>

              {/* <button
                type="button"
                className="btn btn-outline-secondary w-100 py-3 mb-3"
              >
                Login with Google
              </button>

              <div className="text-center">
                <small>
                  Forgot password? <a href="#">Click here</a>
                </small>
              </div> */}
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}