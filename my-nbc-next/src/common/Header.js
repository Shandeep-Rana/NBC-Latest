"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getUserInfoFromToken, ROLES } from "@/constants";
import { logoutUser } from "@/Slice/authLogin";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

const Header = () => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const userInfo = getUserInfoFromToken();
    if (userInfo) setUser(userInfo);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser(router));
    setUser(null);
  };

  return (
    <header className="main-header">
      <div className="header-sticky">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <Link href="/" className="navbar-brand">
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
                    <Link href="/" className="nav-link">Home</Link>
                  </li>

                  <li className="nav-item submenu">
                    <a className="nav-link">Community Members</a>
                    <ul>
                      <li><Link href="/communitymembers/volunteers" className="nav-link">Volunteers</Link></li>
                      <li><Link href="/communitymembers/donors" className="nav-link">Blood Donors</Link></li>
                      <li><Link href="/communitymembers/nbc-members" className="nav-link">NBC Members</Link></li>
                      <li><Link href="/communitymembers/nangal-heros" className="nav-link">Nangal Heroes</Link></li>
                      <li><Link href="/communitymembers/become-volunteer" className="nav-link">Become a Volunteer</Link></li>
                      <li><Link href="/communitymembers/become-donor" className="nav-link">Become a Blood Donor</Link></li>
                      <li><Link href="/communitymembers/become-nbc-member" className="nav-link">Become an NBC Member</Link></li>
                    </ul>
                  </li>

                  <li className="nav-item submenu">
                    <a className="nav-link">Media & Events</a>
                    <ul>
                      <li><Link href="/media&events/events" className="nav-link">Events</Link></li>
                      <li><Link href="/media&events/blogs" className="nav-link">Blogs</Link></li>
                      <li><Link href="/media&events/news" className="nav-link">News</Link></li>
                      <li><Link href="/media&events/gallery" className="nav-link">Gallery</Link></li>
                    </ul>
                  </li>

                  <li className="nav-item submenu">
                    <a className="nav-link">Discover Us</a>
                    <ul>
                      <li><Link href="/discoverus/whoweare" className="nav-link">Who We Are</Link></li>
                      <li><Link href="/discoverus/team" className="nav-link">Our Team</Link></li>
                      <li><a className="nav-link" href="services.html">Services</a></li>
                    </ul>
                  </li>

                  {!user ? (
                    <li className="nav-item">
                      <Link href="/auth/signin" className="nav-link">Sign in</Link>
                    </li>
                  ) : (
                    <li className="nav-item submenu user-dropdown">
                      <a className="nav-link d-flex align-items-center gap-2">
                        <Image
                          src={user?.userProfile || "/images/Generic-img.png"}
                          alt="user"
                          width={40}
                          height={40}
                          className="user_profile_image"
                        />
                      </a>
                      <ul>
                        <li>
                          <Link href={user.roleName.includes(ROLES.Admin) ? "/admin" : "/user"} className="nav-link">
                            <i className="fa-solid fa-user px-2"></i>
                            Edit Profile
                          </Link>
                        </li>

                        {!user.roleName.includes(ROLES.Admin) && (
                          <>
                            <li>
                              <Link href="/user/socialmedialinks" className="nav-link">
                                <i className="fa-solid fa-users px-2"></i>
                                Social Media
                              </Link>
                            </li>
                            <li>
                              <Link href="/user/blogs" className="nav-link">
                                <i className="fa-solid fa-pen px-2 pt-1"></i>
                                Blogs
                              </Link>
                            </li>
                            <li>
                              <Link href="/user/events" className="nav-link">
                                <i className="fa-solid fa-list px-2 pt-1"></i>
                                Events
                              </Link>
                            </li>
                            <li>
                              <Link href="/user/gallery" className="nav-link">
                                <i className="fa-solid fa-image px-2 pt-1"></i>
                                Gallery
                              </Link>
                            </li>
                          </>
                        )}

                        <li>
                          <Link href="/password/change-password" className="nav-link">
                            <i className="fa-solid fa-key px-2"></i>
                            Change Password
                          </Link>
                        </li>
                        <li>
                          <a onClick={handleLogout} className="nav-link" style={{ color: "red", cursor: "pointer" }}>
                            <i className="fa-solid fa-arrow-right-from-bracket px-2"></i>
                            Log Out
                          </a>
                        </li>
                      </ul>
                    </li>
                  )}
                </ul>
              </div>

              <div className="contact-now-box d-flex align-items-center gap-3">
                <Link href="/contact" className="cutm-con-link">Contact Us</Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="responsive-menu"></div>
      </div>
    </header>
  );
};

export default Header;
