"use client";

import { FaInstagram, FaFacebookF, FaYoutube, FaTiktok } from "react-icons/fa";
import FacebookPageEmbed from "./FacebookPageEmbed";
import InstagramFeed from "./InstagramFeed";

export default function Footer() {
  return (
    <><InstagramFeed />
    <footer className="footer-section">

      <div className="container">

        <div className="row gy-4">

          {/* Logo + About */}
          <div className="col-lg-4">
            <h3 className="footer-logo">Siama</h3>

            <p className="footer-text">
              Let us make you confident by reaching out to you at door step
              and showering the beauty all over. Book your appointment
              today to bring the change.
            </p>
            <h5 className="footer-title">Connect with us</h5>

            <div className="footer-social">

              <a href="#"><FaInstagram /></a>
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaYoutube /></a>
              <a href="#"><FaTiktok /></a>

            </div>
          </div>

          {/* Services */}
          <div className="col-lg-2">
            <h5 className="footer-title">Services</h5>

            <ul className="footer-links">
              <li>Laser Hair Reduction</li>
              <li>Skin Rejuvenation</li>
              <li>Hair Treatment</li>
              <li>Advanced Laser Facial</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-3">
            <h5 className="footer-title">Need support?</h5>

            <p className="footer-contact">
              Phone: (+91) 8287795045
            </p>

            <p className="footer-contact">
              Email: reach.siama@gmail.com
            </p>
          </div>

          {/* Social */}
          <div className="col-lg-3">
            <FacebookPageEmbed />
          </div>

        </div>

        {/* Bottom Footer */}

        <div className="footer-bottom">

          <p>© 2026 Siama. All rights reserved.</p>

          <div className="footer-policy">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
          </div>

        </div>

      </div>

    </footer></>
  );
}