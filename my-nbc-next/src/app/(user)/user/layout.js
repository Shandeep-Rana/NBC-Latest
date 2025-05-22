"use client";

import "./globals.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Onest } from 'next/font/google';
import { Providers } from "@/app/providers";
import UserHeader from "@/common/UserHeader";
import UserSideBar from "@/common/UserSidebar";
import { Toaster } from "react-hot-toast";
import "react-phone-input-2/lib/style.css";
import "quill/dist/quill.core.css";
import 'react-datepicker/dist/react-datepicker.css';
import AuthGuard from "@/common/AuthGuard";
import "react-confirm-alert/src/react-confirm-alert.css";

const onest = Onest({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export default function UserLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthGuard allowedRoles={['volunteer', 'skilled person']}>
            <UserHeader />
            <div className="container" id="main">
              <div className="row">
                <div className="col-md-3 volunteer-contact-form mt-3 rounded-3 p-3" id="sidebar" role="navigation">
                  <UserSideBar />
                </div>     
                <div className="col-md-9 main mt-3">
                  {children}
                  <Toaster position="top-right" reverseOrder={false} />
                </div>
              </div>
            </div>
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
