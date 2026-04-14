/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/shared/LayoutWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import SidebarDashboard from "./SidebarDashboard";
import Footer from "./Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 1. Cek apakah ini halaman Auth (Login/Register)
  const isAuthPage = pathname.includes("/auth/");

  // 2. Cek apakah ini halaman Dashboard
  const isDashboardPage = pathname.includes("/dashboard") || pathname.includes("/attempts");

  // KONDISI A: Halaman Login/Register (Tanpa Navbar)
  if (isAuthPage) {
    return <main>{children}</main>;
  }

  // KONDISI B: Halaman Dashboard (Punya Sidebar & Layout Khusus)
  if (isDashboardPage) {
    return (
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
        <SidebarDashboard /> {/* Sidebar Kiri */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar variant="dashboard" /> {/* Navbar atas versi dashboard */}
          <main className="flex-1 overflow-y-auto p-3 md:p-8">
            {children}
          </main>
          {/* <Footer/> */}
        </div>
      </div>
    );
  }

  // KONDISI C: Halaman Utama / Guest (Navbar Landing Page + Footer)
  return (
    <>
      <Navbar variant="guest" />
      <main>{children}</main>
      <Footer/>
      {/* <Footer /> Tambahkan jika ada */}
    </>
  );
}