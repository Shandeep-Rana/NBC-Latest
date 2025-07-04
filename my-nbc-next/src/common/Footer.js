'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
                    <Link href="/" className="navbar-brand">
                      <Image
                        src="/images/NBC-Logo.png"
                        alt="Logo"
                        width={180}
                        height={87.31}
                        priority
                      />
                    </Link>
                  </div>

                  <div className="footer-contact-detail">
                    <div className="footer-contact-item">
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
                        <a href="https://www.youtube.com/@Nangalbycycle" target="_blank" rel="noopener noreferrer">
                          <i className="fab fa-youtube"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://x.com/nangalbycycle_" target="_blank" rel="noopener noreferrer">
                          <i className="fab fa-x-twitter"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://www.facebook.com/officialnangalbycycle" target="_blank" rel="noopener noreferrer">
                          <i className="fab fa-facebook-f"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://www.instagram.com/nangalbycycle" target="_blank" rel="noopener noreferrer">
                          <i className="fab fa-instagram"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="footer-links-box">
                  {/* <div className="newsletter-form">
                    <form id="newsletterForm" action="#" method="POST">
                      <div className="form-group"> */}
                        {/* <input
                          type="email"
                          name="email"
                          className="form-control"
                          id="mail"
                          placeholder="Enter Your Email"
                          required
                        /> */}
                        {/* <button type="submit" className="newsletter-btn">
                          <i className="far fa-paper-plane"></i> 
                        </button> */}
                      {/* </div>
                    </form>
                  </div> */}

                  <div className="footer-links">
                    <h3>Quick link</h3>
                    <ul>
                      <li><Link href="/">Home</Link></li>
                      <li><Link href="/communitymembers/volunteers">Volunteers</Link></li>
                      <li><Link href="/communitymembers/donors">Blood Donors</Link></li>
                      <li><Link href="/communitymembers/nbc-members">NBC Member</Link></li>
                      <li><Link href="/e-certificates">E-Certificates</Link></li>
                    </ul>
                  </div>

                  <div className="footer-links footer-service-links">
                    <h3>Services</h3>
                    <ul>
                      <li><Link href="/mediaevents/events">Events</Link></li>
                      <li><Link href="/mediaevents/blogs">Blogs</Link></li>
                      <li><Link href="/bloodrequirementform">Blood Request Portal</Link></li>
                      <li><Link href="/mediaevents/gallery">gallery</Link></li>
                      <li><Link href="/mediaevents/news">News</Link></li>
                    </ul>
                  </div>

                  <div className="footer-links">
                    <h3>Support</h3>
                    <ul>
                      <li><Link href="/discoverus/team">Our Team</Link></li>
                      <li><Link href="/contact">Contact Us</Link></li>
                      <li><Link href="/feedback">FeedBack</Link></li>
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
