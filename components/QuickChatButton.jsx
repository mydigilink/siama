"use client";

import { useState, useEffect, useRef } from "react";
import BookingAppointmentForm from "./BookingAppointmentForm";

export default function QuickChatButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const menuRef = useRef(null);

  const whatsappNumber = "919955667759"; // replace with your WhatsApp number
  const callNumber = "8287795045"; // replace with your call number

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when booking modal is open
  useEffect(() => {
    if (isBookingOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isBookingOpen]);

  const handleBookAppointment = () => {
    setIsMenuOpen(false);
    setIsBookingOpen(true);
  };

  return (
    <>
      <div className="quick-chat-wrapper" ref={menuRef}>
        {/* Floating Menu */}
        <div className={`quick-chat-menu ${isMenuOpen ? "show" : ""}`}>
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="quick-chat-action whatsapp"
          >
            <span className="icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 32 32"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16.003 3C8.832 3 3 8.74 3 15.8c0 2.484.72 4.9 2.085 6.985L3 29l6.422-2.03A13.12 13.12 0 0 0 16.003 28.6C23.174 28.6 29 22.86 29 15.8 29 8.74 23.174 3 16.003 3Zm0 23.45a10.9 10.9 0 0 1-5.565-1.53l-.398-.236-3.81 1.205 1.24-3.67-.258-.38A10.63 10.63 0 0 1 5.1 15.8C5.1 9.89 10.01 5.08 16.003 5.08c5.992 0 10.9 4.81 10.9 10.72s-4.908 10.65-10.9 10.65Zm6.03-7.98c-.33-.165-1.95-.955-2.252-1.065-.302-.11-.522-.165-.742.165-.22.33-.852 1.065-1.045 1.285-.192.22-.385.247-.715.082-.33-.165-1.392-.507-2.652-1.615-.98-.86-1.64-1.923-1.833-2.253-.192-.33-.02-.508.145-.673.148-.147.33-.385.495-.577.165-.193.22-.33.33-.55.11-.22.055-.412-.028-.577-.082-.165-.742-1.78-1.017-2.44-.267-.64-.538-.55-.742-.56h-.632c-.22 0-.577.082-.88.412-.302.33-1.155 1.128-1.155 2.75 0 1.622 1.183 3.19 1.347 3.41.165.22 2.327 3.547 5.64 4.972.788.34 1.402.542 1.882.694.79.252 1.51.216 2.08.13.635-.095 1.95-.797 2.225-1.567.275-.77.275-1.43.192-1.567-.082-.137-.302-.22-.632-.385Z" />
              </svg>
            </span>
            <span>WhatsApp</span>
          </a>

          <button
            onClick={handleBookAppointment}
            className="quick-chat-action booking"
          >
            <span className="icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
            <span>Book Appointment</span>
          </button>

          <a href={`tel:${callNumber}`} className="quick-chat-action call">
            <span className="icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.78.65 2.62a2 2 0 0 1-.45 2.11L8.1 9.91a16 16 0 0 0 6 6l1.46-1.21a2 2 0 0 1 2.11-.45c.84.31 1.72.53 2.62.65A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <span>Call Now</span>
          </a>
        </div>

        {/* Main Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="quick-chat-btn"
          aria-label="Quick Chat"
        >
          {isMenuOpen ? (
            <span className="quick-chat-main-icon close-icon">×</span>
          ) : (
            <>
              <span className="quick-chat-main-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <span>Quick Chat</span>
            </>
          )}
        </button>
      </div>

      {/* Old Booking Popup */}
      {isBookingOpen && (
        <div
          className="quick-chat-overlay"
          onClick={() => setIsBookingOpen(false)}
        >
          <div
            className="quick-chat-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="quick-chat-close"
              onClick={() => setIsBookingOpen(false)}
              aria-label="Close Modal"
            >
              ×
            </button>

            <BookingAppointmentForm />
          </div>
        </div>
      )}

      <style jsx>{`
    
      `}</style>
    </>
  );
}