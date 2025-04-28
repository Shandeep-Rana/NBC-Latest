"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-sticky">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <Link href='/' className="navbar-brand" >
              <Image
                src="/images/NBC-Logo.png"
                alt="Logo"
                width={180}
                height={87.31}
                priority
              />
            </Link>
            <div className="collapse navbar-collapse main-menu">
              <div className="nav-menu-wrapper">
                <ul className="navbar-nav mr-auto" id="menu">
                  <li className="nav-item">
                    <Link href='/' className="nav-link">Home</Link>
                  </li>

                  <li className="nav-item submenu">
                    <a className="nav-link" >Community Members</a>
                    <ul>
                      <li className="nav-item"><Link href='/communitymembers/volunteers' className="nav-link">Volunteers</Link></li>
                      <li className="nav-item"><Link href='/communitymembers/donors' className="nav-link">Blood Donors</Link></li>
                      <li className="nav-item"><Link href='/communitymembers/nbc-members' className="nav-link">NBC Members</Link></li>
                      <li className="nav-item"><Link href='/communitymembers/nangal-heros' className="nav-link">Nangal Heroes</Link></li>
                      <li className="nav-item"><Link href='/communitymembers/become-volunteer' className="nav-link">Become a Volunteer</Link></li>
                      <li className="nav-item"> <Link href='/communitymembers/become-donor' className="nav-link">Become a Blood Donor</Link></li>
                      <li className="nav-item"><Link href='/communitymembers/become-nbc-member' className="nav-link">Become an NBC Member</Link></li>
                    </ul>
                  </li>

                  <li className="nav-item submenu">
                    <a className="nav-link">Media & Events</a>
                    <ul>
                      <li className="nav-item"><Link href='/media&events/events' className="nav-link">Events</Link></li>
                      <li className="nav-item"><Link href='/media&events/blogs' className="nav-link">Blogs</Link></li>
                      <li className="nav-item"><Link href='/media&events/news' className="nav-link">News</Link></li>
                      <li className="nav-item"><Link href='/media&events/gallery' className="nav-link">Gallery</Link></li>
                    </ul>
                  </li>

                  <li className="nav-item submenu">
                    <a className="nav-link" >Discover Us</a>
                    <ul>
                      <li className="nav-item"><Link href='/discoverus/whoweare' className="nav-link">Who We Are</Link></li>
                      <li className="nav-item"><Link href='/discoverus/team' className="nav-link">Our Team</Link></li>
                      <li className="nav-item"><a className="nav-link" href="services.html">Services</a></li>
                    </ul>
                  </li>

                  <li className="nav-item">
                    <Link href='/auth/signin' className="nav-link">
                      Sign in
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="contact-now-box">
                <Link href='/contact' className="cutm-con-link" >Contact Us</Link>

              </div>
            </div>

            <div className="navbar-toggle"></div>
          </div>
        </nav>

        <div className="responsive-menu"></div>
      </div>
    </header>
  );
};

export default Header;
