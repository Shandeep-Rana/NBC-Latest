'use client';
import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <>
      <footer className='main-footer'>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="main-footer-box">
                <div className="footer-about">
                  <div className="footer-logo">
                    <Image
                      src="/images/NBC-logo.png"
                      alt="NBC Logo"
                      width={180}
                      height={87.3}
                      priority
                    />
                  </div>

                  <div className="footer-contact-detail">
                    <div className="footer-contact-item">
                      <p className="mb-0">Need live support!</p>
                      <h3>
                        <a href="mailto:info@nangalbycycle.com">
                          info@nangalbycycle.com
                        </a>
                      </h3>
                    </div>
                  </div>

                  <div className="footer-social-links">
                    <h3>Follow on</h3>
                    <ul>
                      <li>
                        <a href="#">
                          <i className="fab fa-pinterest"></i> {/* Pinterest */}
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-twitter"></i> {/* Twitter */}
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-facebook-f"></i> {/* Facebook */}
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-instagram"></i> {/* Instagram */}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="footer-links-box">
                  <div className="newsletter-form">
                    <form id="newsletterForm" action="#" method="POST">
                      <div className="form-group">
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          id="mail"
                          placeholder="Enter Your Email"
                          required
                        />
                        <button type="submit" className="newsletter-btn">
                          <i className="far fa-paper-plane"></i> {/* Paper plane icon */}
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="footer-links">
                    <h3>Quick link</h3>
                    <ul>
                      <li><a href="index.html"> Home</a></li>
                      <li><a href="volunteers.html"> Volunteers</a></li>
                      <li><a href="blood-donors.html"> Blood Donors</a></li>
                      <li><a href="events.html"> Events</a></li>
                    </ul>
                  </div>

                  <div className="footer-links footer-service-links">
                    <h3>Services</h3>
                    <ul>
                      <li><a href="blood-donors.html"> Blood Donors</a></li>
                      <li><a href="contact.html"> Blood Request Portal</a></li>
                      <li><a href="contact.html"> Educational Support</a></li>
                      <li><a href="contact.html">Youth Development</a></li>
                    </ul>
                  </div>

                  <div className="footer-links">
                    <h3>Support</h3>
                    <ul>
                      <li><a href="team.html"> Our Team</a></li>
                      <li><a href="contact.html"> Contact Us</a></li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="footer-copyright">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="copyright-text">
                  <p>Copyright © 2025 All Rights Reserved.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
