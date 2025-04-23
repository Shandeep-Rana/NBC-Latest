import AdminHeader from "@/common/AdminFooter";
import "./globals.css";
import { Providers } from "../../providers";

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AdminHeader>
          <Providers>
            {children}
          </Providers>
        </AdminHeader>
      </body>
    </html>
  );
}
