import "./globals.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Onest } from 'next/font/google';
import 'animate.css/animate.min.css';
import Wow from "@/common/Wow";
import Header from "@/common/Header";
import CustomCursor from "@/common/CustomCursor";
import Footer from "@/common/Footer";
import "react-phone-input-2/lib/style.css";
import 'react-datepicker/dist/react-datepicker.css';
import { Providers } from "@/app/providers";
import { Toaster } from "react-hot-toast";

const onest = Onest({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata = {
  title: "Nangal-By-Cycle",
  description: "Generated by create next app",
};

export default function AuthLayout({ children }) {
  return (
    <html lang="en">
      <body className={onest.className}>
        <Wow />
        <CustomCursor />
        <Providers>
          <Header />
          {children}
          <Toaster position="top-right" reverseOrder={false} />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
