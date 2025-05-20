'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { confirmAlert } from 'react-confirm-alert';
import RoleUpgradeModal from '@/components/user/RoleUpgradeModel';

const UserSideBar = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    const handleStorage = () => {
      const updatedUser = JSON.parse(localStorage.getItem('user'));
      setUser(updatedUser);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleUpgradeClick = () => {
    confirmAlert({
      title: <div style={{ fontSize: '20px' }}>Confirm to become Blood Donor</div>,
      message: 'Are you sure you want to become a Blood donor?',
      buttons: [
        {
          label: 'Yes',
          onClick: toggleModal,
        },
        {
          label: 'No',
        },
      ],
    });
  };

  const isDonor = user?.roleName?.includes('donor');

  const navItems = [
    { label: 'Events', href: '/user/events/userevents' },
    { label: 'Blogs', href: '/user/blogs/blogslist' },
    { label: 'News', href: '/user/news' },
    { label: 'Gallery', href: '/user/gallery' },
  ];

  return (
    <>
      <div className="site-identity">
        <h1 className="site-title">
          <Link href="/">
            <Image className="white-logo" src='/images/unbound-logo1.png' width='200' height='52' alt="logo" />
          </Link>
        </h1>
      </div>
      <hr />
      <nav className="nav flex-column sticky-top pl-0 mt-3 text-uppercase align-items-start">
        {navItems.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`nav-link text-dark fw-bold ${pathname === href ? 'current-menu-item' : ''}`}
          >
            <i className="fa-solid fa-list px-2"></i>
            {label}
          </Link>
        ))}
        <br />
        {!isDonor && (
          <div className="header-btn d-inline-block">
            <button className="button-round" onClick={handleUpgradeClick}>
              Become Donor
            </button>
          </div>
        )}
      </nav>
      <RoleUpgradeModal isOpen={isModalOpen} toggleModal={toggleModal} />
    </>
  );
};

export default UserSideBar;
