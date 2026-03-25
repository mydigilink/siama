"use client";

import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie"; // Install this: npm install js-cookie

export default function OneStepLoginModal({ show, handleClose }) {
  const modalRef = useRef(null);
  const bsModalRef = useRef(null);

  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [demoOtp, setDemoOtp] = useState("");

  // 1. Load Google Script & Initialize
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com", // Replace this
        callback: handleGoogleLogin,
      });
    };
  }, []);

  const handleGoogleLogin = async (response) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });
      const data = await res.json();

      if (data.success) {
        // Create cookie for portal access (valid for 7 days)
        Cookies.set("user_session", data.token, { expires: 7, secure: true });
        setMessage("Login successful!");
        finalizeLogin();
      }
    } catch (err) {
      setMessage("Google Sign-In failed.");
    } finally {
      setLoading(false);
    }
  };

  // Render Google button when step is 'phone'
  useEffect(() => {
    if (show && step === "phone" && window.google) {
      window.google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { theme: "outline", size: "large", width: "100%", text: "continue_with" }
      );
    }
  }, [show, step]);

  const finalizeLogin = () => {
    setTimeout(() => {
      closeModal();
      window.location.href = "/portal"; // Redirect to portal based on cookie
    }, 800);
  };
  // Initialize Bootstrap modal only once
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initBootstrap = async () => {
      const bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");

      if (modalRef.current && !bsModalRef.current) {
        bsModalRef.current = new bootstrap.Modal(modalRef.current, {
          backdrop: true,
          keyboard: true,
        });

        // when modal closes manually
        modalRef.current.addEventListener("hidden.bs.modal", () => {
          if (handleClose) handleClose();
        });
      }
    };

    initBootstrap();
  }, [handleClose]);

  // Control modal open/close from parent
  useEffect(() => {
    if (!bsModalRef.current) return;

    if (show) {
      bsModalRef.current.show();
    } else {
      bsModalRef.current.hide();
    }
  }, [show]);

  const resetState = () => {
    setStep("phone");
    setPhone("");
    setOtp("");
    setLoading(false);
    setMessage("");
    setDemoOtp("");
  };

  const closeModal = () => {
    if (bsModalRef.current) {
      bsModalRef.current.hide();
    }
    if (handleClose) handleClose();
    resetState();
  };

  const handleSendOtp = async () => {
    setMessage("");

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setMessage("Please enter a valid 10 digit mobile number.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!data.success) {
        setMessage(data.message || "Failed to send OTP");
        return;
      }

      // if demo otp available from API
      setDemoOtp(data.demoOtp || "");
      setStep("otp");
      setMessage("OTP sent successfully.");
    } catch (error) {
      setMessage("Something went wrong while sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  // const handleVerifyOtp = async () => {
  //   setMessage("");

  //   if (!/^\d{4,6}$/.test(otp)) {
  //     setMessage("Please enter valid OTP.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const res = await fetch("/api/auth/verify-otp", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ phone, otp }),
  //     });

  //     const data = await res.json();

  //     if (!data.success) {
  //       setMessage(data.message || "OTP verification failed");
  //       return;
  //     }

  //     setMessage("Login successful!");

  //     setTimeout(() => {
  //       closeModal();
  //       window.location.reload();
  //     }, 800);
  //   } catch (error) {
  //     setMessage("Something went wrong while verifying OTP.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const handleVerifyOtp = async () => {
    setMessage("");
    try {
      setLoading(true);
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();

      if (data.success) {
        // Create cookie upon OTP success
        Cookies.set("user_session", data.token, { expires: 7 });
        setMessage("Login successful!");
        finalizeLogin();
      } else {
        setMessage(data.message || "Invalid OTP");
      }
    } catch (error) {
      setMessage("Verification failed.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="modal fade" id="oneStepLoginModal" tabIndex="-1" ref={modalRef}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 overflow-hidden" style={{ borderRadius: "0px" }}>
          <div className="row g-0">
            <div className="col-lg-6 d-none d-lg-block">
              <img src="/img/aboutmain.jpeg" alt="Login" className="w-100 h-100 object-fit-cover" />
            </div>

            <div className="col-lg-6 bg-white">
              <div className="position-relative p-4 p-lg-5 h-100 d-flex flex-column justify-content-center">
                <button type="button" className="btn-close position-absolute top-0 end-0 m-4" onClick={closeModal}></button>

                <h2 className="text-center mb-4" style={{ fontSize: "32px", fontWeight: "400" }}>
                  SIGN IN
                </h2><p>
                  Welcome back! Log in to continue and access your account instantly.
                </p>
                {step === "phone" ? (
                  <>
                    <div className="d-flex gap-3 mb-3">
                      <div className="d-flex align-items-center justify-content-center border rounded" style={{ width: "80px", height: "64px" }}>+91</div>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        style={{ height: "64px", fontSize: "20px" }}
                      />
                    </div>

                    <button className="btn btn-dark w-100 mb-3" onClick={handleSendOtp} disabled={loading} style={{ height: "58px" }}>
                      {loading ? "Sending..." : "Continue with Phone"}
                    </button>

                    {/* Divider */}
                    <div className="d-flex align-items-center my-3">
                      <hr className="flex-grow-1" />
                      <span className="mx-2 text-muted small">or continue with</span>
                      <hr className="flex-grow-1" />
                    </div>

                    {/* Google Button Container */}
                    <div id="googleBtn" className="w-100"></div>
                  </>
                ) : (
                  // ... (Keep OTP Input UI same as your original)
                  <div className="text-center">
                     <input 
                        type="tel" 
                        className="form-control mb-3" 
                        placeholder="Enter OTP" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        style={{ height: "64px" }}
                      />
                     <button className="btn btn-dark w-100" onClick={handleVerifyOtp} disabled={loading}>Verify</button>
                  </div>
                )}

                {message && <p className={`mt-3 text-center ${message.includes("successful") ? "text-success" : "text-danger"}`}>{message}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>  
  );
}