'use client';

import React, { useState } from 'react';
import './globals.css';
import { Providers } from '../../providers';
import AdminHeader from '@/common/AdminHeader';
import AdminSideBar from '@/common/AdminSideBar';
// import MobileSideBar from '@/common/MobileSideBar'; // Adjust path if needed

export default function AdminLayout({ children }) {
  const [isShow, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <html lang="en">
      <body>
        <Providers>
          <AdminHeader handleShow={handleShow} />
          <div className="container-fluid" id="main">
            <div className="row">
              <AdminSideBar />
              {/* <MobileSideBar isShow={isShow} handleClose={handleClose} /> */}
              <div className="col-md-9 col-lg-9 col-12 admin_container col main admin_layout">
                {children}
                <footer className="container-fluid">
                  <p className="text-right small">©2024-2025 Company</p>
                </footer>
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}

