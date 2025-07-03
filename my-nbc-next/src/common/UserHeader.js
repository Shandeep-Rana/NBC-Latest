"use client";

import React, { useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { getUserInfoFromToken } from '@/constants';
import { logoutUser } from '@/Slice/authLogin';
import TranslateComponent from './TranslateComponent';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useRouter } from "next/navigation";

const UserHeader = ({ mobiletoggleNav }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const [isNavVisible, setIsNavVisible] = useState(false);
    const toggleNav = () => setIsNavVisible(!isNavVisible);
    const handleLogout = () => dispatch(logoutUser(router));

    const [showCommunity, setShowCommunity] = useState(false);
    const [showMedia, setShowMedia] = useState(false);
    const [showDiscover, setShowDiscover] = useState(false);

    const toggleCommunity = () => setShowCommunity(!showCommunity);
    const toggleMedia = () => setShowMedia(!showMedia);
    const toggleDiscover = () => setShowDiscover(!showDiscover);

    const [user, setUser] = useState("");

    useEffect(() => {
        const userInfo = getUserInfoFromToken();
        if (userInfo) setUser(userInfo);
    }, []);

    const role = user?.roleName

    const hasSkilledPersonRole = Array.isArray(role) ? role.includes('skilled person') : role === 'skilled person';

    const isActive = (path) => pathname === path ? 'current-menu-item' : '';

    const updateProfileFromStorage = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        setUser(user);
    };

    useEffect(() => {
        updateProfileFromStorage();
        window.addEventListener('storage', updateProfileFromStorage);
        return () => window.removeEventListener('storage', updateProfileFromStorage);
    }, []);

    return (
        <>
            <header id="masthead" className="container-fluid site-header position-relative site-header-transparent" style={{ background: "#121213" }}>
                <div className="top-header">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 d-none d-lg-block">
                                <div className="header-contact-info">
                                    <ul className="d-none">
                                        <li>
                                            <a href="tel:+01977259912">
                                                <i className="fas fa-phone-alt"></i> +01 (977) 2599 12
                                            </a>
                                        </li>
                                        <li>
                                            <a href="mailto:email@example.com">
                                                <i className="fas fa-envelope"></i> email@example.com
                                            </a>
                                        </li>
                                        <li>
                                            <i className="fas fa-map-marker-alt"></i> 3146 Koontz Lane, California
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-4 d-flex justify-content-lg-end justify-content-between">
                                <div className="header-social social-links">
                                    <ul>
                                        <li>
                                            <a href="https://www.facebook.com/nangalbycycle" target="_blank" rel="noopener noreferrer">
                                                <i className="fab fa-facebook-f" aria-hidden="true"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://x.com/nangalbycycle" target="_blank" rel="noopener noreferrer">
                                                <i className="fab fa-x-twitter" aria-hidden="true"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://www.youtube.com/@Nangalbycycle" target="_blank" rel="noopener noreferrer">
                                                <i className="fab fa-youtube" aria-hidden="true"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://www.instagram.com/nangalbycycle" target="_blank" rel="noopener noreferrer">
                                                <i className="fab fa-instagram" aria-hidden="true"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <TranslateComponent />
                <div className="bottom-header">
                    <div className="container d-flex justify-content-between align-items-center">
                        {/* Logo */}
                        <div className="site-identity">
                            <h1 className="site-title">
                                <Link href="/">
                                    <Image className="white-logo" src='/images/unbound-logo.png' alt="logo" width={200} height={52} />
                                </Link>
                            </h1>
                        </div>

                        {/* Navigation */}
                        <div className="main-navigation">
                            <nav id="navigation" className="navigation d-none d-lg-inline-block">
                                <ul>
                                    <li>
                                        <Link href="/" className={isActive('/home') ? 'current-menu-item' : ''}>
                                            Home
                                        </Link>
                                    </li>

                                    <li className="menu-item-has-children">
                                        <Link href="#">Community Members</Link>
                                        <ul>
                                            <li>
                                                <Link href="/volunteers" className={isActive('/volunteers') ? 'current-menu-item' : ''}>
                                                    Volunteers
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/donor" className={isActive('/donor') ? 'current-menu-item' : ''}>
                                                    Blood Donors
                                                </Link>
                                            </li>
                                            <li><Link href="/skilled-persons">NBC Members</Link></li>
                                            <li><Link href="/nangal-heroes">Nangal Heroes</Link></li>
                                            <li><Link href="/become-volunteer">Become a Volunteer</Link></li>
                                            <li><Link href="/become-donor">Become a Blood Donor</Link></li>
                                            <li><Link href="/become-nbc-member">Become an NBC Member</Link></li>
                                        </ul>
                                    </li>

                                    <li className="menu-item-has-children">
                                        <Link href="#">Media & Events</Link>
                                        <ul>
                                            <li>
                                                <Link href="/events" className={isActive('/events') ? 'current-menu-item' : ''}>
                                                    Events
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/blogs" className={isActive('/blogs') ? 'current-menu-item' : ''}>
                                                    Blogs
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/gallery" className={isActive('/gallery') ? 'current-menu-item' : ''}>
                                                    Gallery
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>

                                    <li className="menu-item-has-children">
                                        <Link href="#">Discover Us</Link>
                                        <ul>
                                            <li>
                                                <Link href="/about"><span className="semi-bold">Who We Are</span></Link>
                                            </li>
                                            <li>
                                                <Link href="/team"><span className="semi-bold">Team</span></Link>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        {/* Contact Button */}
                        <div className="header-btn d-inline-block">
                            <Link href="/contact" className="button-round">Contact Us</Link>
                        </div>

                        {/* Profile Dropdown */}
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic" className="btn-dark">
                                <Image
                                    src={user?.userProfile || '/images/Generic-img.png'}
                                    alt="profile"
                                    width={40}
                                    height={40}
                                    className="user_profile_image"
                                />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item>
                                    <Link href="/user/edit-profile">
                                        <i className="fa-solid fa-user px-2"></i> Edit Profile
                                    </Link>
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    <Link href="/user/socialmedialinks">
                                        <i className="fa-solid fa-users px-2"></i> Social Media
                                    </Link>
                                </Dropdown.Item>

                                {hasSkilledPersonRole && (
                                    <Dropdown.Item>
                                        <Link href="/member/my/specializedskill">
                                            <i className="fa-solid fa-lightbulb px-2"></i> Specialized Skill
                                        </Link>
                                    </Dropdown.Item>
                                )}

                                <Dropdown.Item>
                                    <Link href="/password/change-password">
                                        <i className="fa-solid fa-key px-2"></i> Change Password
                                    </Link>
                                </Dropdown.Item>

                                <Dropdown.Item onClick={handleLogout} style={{ color: 'red' }}>
                                    <i className="fa-solid fa-arrow-right-from-bracket px-2"></i> Log Out
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
                <div className="mobile-menu-container">
                    <div className="slicknav_menu">
                        <button onClick={toggleNav} aria-haspopup="true" className="slicknav_btn slicknav_collapsed">
                            <span className="slicknav_menutxt">Menu</span>
                            <span className="slicknav_icon">
                                <span className="slicknav_icon-bar"></span>
                                <span className="slicknav_icon-bar"></span>
                                <span className="slicknav_icon-bar"></span>
                            </span>
                        </button>

                        <nav id="navigation" className={`slicknav_nav navigation ${isNavVisible ? "d-block" : "d-none"} d-lg-inline-block`}>
                            <ul>
                                <li>
                                    <Link href="/home" className={isActive('/home')} onClick={mobiletoggleNav}>
                                        Home
                                    </Link>
                                </li>

                                {/* Community Members Dropdown */}
                                <li className="menu-item-has-children slicknav_parent slicknav_collapsed">
                                    <div className="slicknav_parent-link slicknav_row">
                                        <span>Community Members</span>
                                        <button onClick={toggleCommunity} className="slicknav_item" aria-haspopup="true">
                                            <span className="slicknav_arrow">
                                                {showCommunity ? <i className="fas fa-minus"></i> : <i className="fas fa-plus"></i>}
                                            </span>
                                        </button>
                                    </div>
                                    <ul role="menu" aria-hidden={!showCommunity} style={{
                                        height: showCommunity ? '315px' : '0px',
                                        overflow: 'hidden',
                                        transition: 'height 1s ease'
                                    }}>
                                        <li><Link href="/volunteers" className={isActive('/volunteers')} onClick={mobiletoggleNav}>Volunteers</Link></li>
                                        <li><Link href="/donor" className={isActive('/donor')} onClick={mobiletoggleNav}>Donors</Link></li>
                                        <li><Link href="/skilled-persons" onClick={mobiletoggleNav}>NBC Members</Link></li>
                                        <li><Link href="/nangal-heroes" onClick={mobiletoggleNav}>Nangal Heroes</Link></li>
                                        <li><Link href="/become-volunteer" onClick={mobiletoggleNav}>Become a volunteer</Link></li>
                                        <li><Link href="/become-donor" onClick={mobiletoggleNav}>Become a Blood Donor</Link></li>
                                        <li><Link href="/become-nbc-member" onClick={mobiletoggleNav}>Become an NBC Member</Link></li>
                                    </ul>
                                </li>

                                {/* Media & Events Dropdown */}
                                <li className="menu-item-has-children slicknav_parent slicknav_collapsed">
                                    <div className="slicknav_parent-link slicknav_row">
                                        <span>Media & Events</span>
                                        <button onClick={toggleMedia} className="slicknav_item" aria-haspopup="true">
                                            <span className="slicknav_arrow">
                                                {showMedia ? <i className="fas fa-minus"></i> : <i className="fas fa-plus"></i>}
                                            </span>
                                        </button>
                                    </div>
                                    <ul role="menu" aria-hidden={!showMedia} style={{
                                        height: showMedia ? '135px' : '0px',
                                        overflow: 'hidden',
                                        transition: 'height 1s ease'
                                    }}>
                                        <li><Link href="/events" className={isActive('/events')} onClick={mobiletoggleNav}>Events</Link></li>
                                        <li><Link href="/blogs" className={isActive('/blogs')} onClick={mobiletoggleNav}>Blogs</Link></li>
                                        <li><Link href="/gallery" className={isActive('/gallery')} onClick={mobiletoggleNav}>Gallery</Link></li>
                                    </ul>
                                </li>

                                {/* Discover Us Dropdown */}
                                <li className="menu-item-has-children slicknav_parent slicknav_collapsed">
                                    <div className="slicknav_parent-link slicknav_row">
                                        <span>Discover Us</span>
                                        <button onClick={toggleDiscover} className="slicknav_item" aria-haspopup="true">
                                            <span className="slicknav_arrow">
                                                {showDiscover ? <i className="fas fa-minus"></i> : <i className="fas fa-plus"></i>}
                                            </span>
                                        </button>
                                    </div>
                                    <ul role="menu" aria-hidden={!showDiscover} style={{
                                        height: showDiscover ? '135px' : '0px',
                                        overflow: 'hidden',
                                        transition: 'height 1s ease'
                                    }}>
                                        <li><Link href="/about" className={isActive('/about')} onClick={mobiletoggleNav}>Who We Are</Link></li>
                                        <li><Link href="/team" className={isActive('/team')} onClick={mobiletoggleNav}>Team</Link></li>
                                        <li><Link href="/contact" className={isActive('/contact')} onClick={mobiletoggleNav}>Contact Us</Link></li>
                                    </ul>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>
        </>
    )
}

export default UserHeader;