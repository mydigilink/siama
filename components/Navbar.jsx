"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import OneStepLoginModal from "./OneStepLoginModal";
import BookingAppointmentForm from "./BookingAppointmentForm";
import CartCount from "./CartCount";

export default function Navbar() {
  const [userCookie, setUserCookie] = useState(null);
const [showLogin, setShowLogin] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const found = cookies.find((row) => row.startsWith("siama_user="));

    if (found) {
      const value = decodeURIComponent(found.split("=")[1]);
      setUserCookie(value);
    }
  }, []);

  let user = null;

  if (userCookie?.value) {
    try {
      user = JSON.parse(userCookie.value);
    } catch (e) {
      user = null;
    }
  }
    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);

    return (
        <header>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-md-6">
<Image src="/img/logo.jpeg" alt="Logo" width={160} height={60}  className="my-2" />
                </div>
                <div className="col-md-6 d-flex justify-content-end align-items-center gap-3 text-white icons">
                    {/* <i className="bi bi-whatsapp"></i>
                    <i className="bi bi-cart3"></i>
                    <i className="bi bi-person"></i> */}
                    {/* <a href="https://wa.me/918287795045" className=" about-btn ">Consult a Doctor</a> */}
                    {/* <a href="https://wa.me/918287795045" className=" about-btn ">Book an appointment</a> */}
                    <button
  type="button"
  className="about-btn"
  onClick={() => setIsBookingOpen(true)}
>
  Book an appointment
</button>

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

                </div>
             
                </div>  
           
            </div>
            <nav className="navbar navbar-expand-lg navbar-dark custom-navbar sticky-top">
                <div className="container">

                    {/* Mobile Toggle */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#mainNavbar"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="mainNavbar">

                        {/* LEFT MENU */}
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                            <li className="nav-item">
                                <Link className="nav-link" href="#">
                                    Home
                                </Link>
                            </li>

                            {/* Treatment */}
                            <li className="nav-item dropdown">
                                <Link
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    data-bs-toggle="dropdown"
                                >
                                    Treatment
                                </Link>

                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" href="#">Laser Treatment</Link></li>
                                    <li><Link className="dropdown-item" href="#">Skin Rejuvenation</Link></li>
                                    <li><Link className="dropdown-item" href="#">Acne Treatment</Link></li>
                                    <li><Link className="dropdown-item" href="#">Hair Transplant</Link></li>
                                </ul>
                            </li>

                            {/* Concerns */}
                            <li className="nav-item dropdown">
                                <Link
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    data-bs-toggle="dropdown"
                                >
                                    Concerns
                                </Link>

                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" href="#">Acne</Link></li>
                                    <li><Link className="dropdown-item" href="#">Pigmentation</Link></li>
                                    <li><Link className="dropdown-item" href="#">Hair Loss</Link></li>
                                    <li><Link className="dropdown-item" href="#">Dark Circles</Link></li>
                                </ul>
                            </li>

                            {/* Mens */}
                            <li className="nav-item dropdown">
                                <Link
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    data-bs-toggle="dropdown"
                                >
                                    Mens
                                </Link>

                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" href="#">Beard Treatment</Link></li>
                                    <li><Link className="dropdown-item" href="#">Hair Loss</Link></li>
                                    <li><Link className="dropdown-item" href="#">Skin Care</Link></li>
                                </ul>
                            </li>

                            {/* Women */}
                            <li className="nav-item dropdown">
                                <Link
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    data-bs-toggle="dropdown"
                                >
                                    Women
                                </Link>

                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" href="#">Facial Treatment</Link></li>
                                    <li><Link className="dropdown-item" href="#">Skin Tightening</Link></li>
                                    <li><Link className="dropdown-item" href="#">Hair Removal</Link></li>
                                </ul>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" href="/blogs">Blogs</Link>
                            </li>
          <li className="nav-item">
                                <Link className="nav-link" href="/contact">Contact</Link>
                            </li>

                        </ul>

                        {/* RIGHT ICONS */}
                        <div className="d-flex align-items-center gap-3 text-white icons">
                            <i className="bi bi-whatsapp"></i>
                            <i className="bi bi-cart3"></i> <CartCount />
               {console.log("User in Navbar:", user)}          
      {user ? (
        <div className="mt-4">
          <h4>Welcome, {user.phone}</h4>
          <p>You are logged in.</p>

          <form action="/api/auth/logout" method="POST">
            <button className="btn btn-dark">Logout</button>
          </form>
        </div>
      ) : (
        <div className="">
          {/* User Icon */}
          <button
            type="button"
            className="user-login-icon-btn"
            onClick={() => setShowLogin(true)}
            aria-label="Open login"
          >
          <i className="bi bi-person"></i>
          </button>

          {/* Modal */}
          <OneStepLoginModal
            show={showLogin}
            handleClose={() => setShowLogin(false)}
          />
        </div>
      )}  
      {/* <i className="bi bi-person"></i> */}
                        </div>

                    </div>
                </div>
            </nav>
        </header>

    );
}