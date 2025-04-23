'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dropdown } from 'react-bootstrap';
import { useDispatch } from 'react-redux'; // Adjust to your redux path
import { logoutUser } from '@/Slice/authLogin';

const AdminHeader = ({ handleShow }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogOutClick = () => {
    dispatch(logoutUser(router));
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark position-sticky top-0" style={{ zIndex: 1000 }}>
      <div className="container-fluid site-identity">
        <button className="btn" onClick={handleShow} id="btn_toggle">
          <i className="h4 text-white fa-solid fa-bars"></i>
        </button>
        <Link href="/" className="navbar-brand">
          <Image className="white-logo" src='/images/unbound-logo.png' alt="logo" width={120} height={40} />
        </Link>
        <div className="d-flex gap-2">
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdownBasic">
              Admin
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as="span">
                <Link href="/admin/user-profile" className="text-black text-decoration-none">
                  <i className="fas fa-user"></i> Profile
                </Link>
              </Dropdown.Item>
              <Dropdown.Item as="span">
                <Link href="/password/change-password" className="text-black text-decoration-none">
                  <i className="fas fa-screwdriver-wrench"></i> Setting
                </Link>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogOutClick} as="button" className="text-danger">
                <i className="fas fa-arrow-right-from-bracket"></i> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
};

export default AdminHeader;
