import React from "react";

export default function ContactFooter() {
  return (
    <footer className="contact-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Contact Us</h3>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-label">Email:</span>
              <a href="mailto:info@younihack.com">info@younihack.com</a>
            </div>
            <div className="contact-item">
              <span className="contact-label">Phone:</span>
              <a href="tel:+40123456789">+40 758 603 307</a>
            </div>
            <div className="contact-item">
              <span className="contact-label">Location:</span>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Universitatea+Politehnica+Bucuresti,+Bucuresti,+Romania" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Open location in Google Maps"
              >
                Universitatea Politehnica Bucuresti, Bucuresti, Romania
              </a>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="https://www.instagram.com/younihack" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <span className="social-icon">📸</span>
              Instagram
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <div className="quick-links">
            <a href="#event">Event Details</a>
            <a href="#why">Why Participate</a>
            <a href="#register">Register</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>$ echo "Copyright (c) 2025 YouniHack | All systems secured and rights reserved | Build v2025.01"</p>
      </div>
    </footer>
  );
}
