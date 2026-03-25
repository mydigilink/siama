"use client";

import { useEffect, useRef } from "react";

export default function SiamaExitIntentPopup() {
  const modalRef = useRef(null);
  const bsModalRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.bootstrap) return;

    const alreadyShown = sessionStorage.getItem("siamaExitPopupShown");
    if (alreadyShown) return;

    if (modalRef.current) {
      bsModalRef.current = new window.bootstrap.Modal(modalRef.current, {
        backdrop: true,
        keyboard: true,
      });
    }

    const showPopup = () => {
      if (!bsModalRef.current) return;
      if (sessionStorage.getItem("siamaExitPopupShown")) return;

      bsModalRef.current.show();
      sessionStorage.setItem("siamaExitPopupShown", "true");
    };

    const isMobile = window.innerWidth < 768;

    let mobileTimer;

    if (isMobile) {
      mobileTimer = setTimeout(() => {
        showPopup();
      }, 8000); // show after 8 sec on mobile
    } else {
      const handleMouseOut = (e) => {
        // Exit intent: mouse leaves from top
        if (e.clientY <= 10) {
          showPopup();
        }
      };

      document.addEventListener("mouseout", handleMouseOut);

      return () => {
        document.removeEventListener("mouseout", handleMouseOut);
        if (mobileTimer) clearTimeout(mobileTimer);
      };
    }

    return () => {
      if (mobileTimer) clearTimeout(mobileTimer);
    };
  }, []);

  return (
    <>
      <div
        className="modal fade"
        id="siamaExitIntentModal"
        tabIndex="-1"
        aria-labelledby="siamaExitIntentModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content siama-exit-modal border-0 overflow-hidden rounded-4 position-relative">
            {/* Close Button */}
            <button
              type="button"
              className="btn-close siama-close-btn position-absolute top-0 end-0 m-3 z-3 bg-white rounded-circle p-2 opacity-100 shadow-sm"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>

            {/* Top Banner */}
            <div className="p-3 bg-white">
              <img
                src="/images/siama-exit-banner.jpg"
                alt="SIAMA Offer Banner"
                className="img-fluid w-100 rounded-4"
              />
            </div>

            {/* Content */}
            <div className="px-4 pb-4 pt-2 text-center">
              <h2
                className="fw-bold mb-3"
                style={{
                  fontSize: "clamp(28px, 4vw, 42px)",
                  lineHeight: "1.15",
                  color: "#111",
                  fontFamily: '"Playfair Display", serif',
                }}
              >
                Get discounts upto 50% off
              </h2>

              <p
                className="mb-4"
                style={{
                  fontSize: "clamp(18px, 2.5vw, 26px)",
                  fontWeight: 500,
                  color: "#555",
                }}
              >
                on select packages
              </p>

              {/* Phone Input */}
              <div
                className="d-flex align-items-center mb-3"
                style={{
                  border: "1.5px solid #1f1f1f",
                  borderRadius: "14px",
                  overflow: "hidden",
                  height: "58px",
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    minWidth: "56px",
                    height: "100%",
                    fontSize: "20px",
                    borderRight: "1px solid #d9d9d9",
                  }}
                >
                  🇮🇳
                </div>

                <input
                  type="tel"
                  className="form-control border-0 shadow-none h-100"
                  placeholder="Enter your mobile number"
                  style={{
                    fontSize: "18px",
                    paddingLeft: "16px",
                    color: "#111",
                  }}
                />
              </div>

              {/* Checkbox */}
              <div className="form-check text-start mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="siamaTermsCheck"
                />
                <label
                  className="form-check-label"
                  htmlFor="siamaTermsCheck"
                  style={{ fontSize: "15px", color: "#555" }}
                >
                  I agree to the{" "}
                  <a
                    href="/terms-and-conditions"
                    style={{
                      color: "#7c3aed",
                      textDecoration: "none",
                    }}
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>

              {/* CTA Button */}
              <button
                type="button"
                className="btn w-100 text-white fw-medium"
                style={{
                  height: "56px",
                  borderRadius: "14px",
                  background: "linear-gradient(90deg, #6f42c1 0%, #8b5cf6 100%)",
                  border: "none",
                  fontSize: "18px",
                }}
              >
                Explore Offers
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .siama-exit-modal {
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.18);
          background: #fff;
        }

        .siama-close-btn {
          width: 40px;
          height: 40px;
        }

        @media (max-width: 575px) {
          .modal-dialog {
            margin: 12px;
          }
        }
      `}</style>
    </>
  );
}