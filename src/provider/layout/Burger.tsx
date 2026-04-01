/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  X, LogOut, ChevronRight, LayoutDashboard, 
  BookOpen, History, User, CreditCard, 
  Settings, Info, ShieldCheck, FileText
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // <--- 1. WAJIB IMPORT INI
import AppIcon from "../tools/AppIcon";
import LanguageSwitcher from "../tools/LanguageSwitcher";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  handleLogout: () => void;
  toggleTheme: () => void;
  themeIcon: React.ReactNode;
  theme: string;
}

export default function MobileMenu({
  isOpen,
  onClose,
  user,
  handleLogout,
  toggleTheme,
  themeIcon,
  theme,
}: MobileMenuProps) {
  
  const pathname = usePathname(); // <--- 2. AMBIL URL SAAT INI

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[90] lg:hidden"
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-[100] w-[85%] max-w-sm bg-white dark:bg-slate-900 lg:hidden flex flex-col shadow-2xl overflow-hidden"
          >
            <div className="p-6 flex justify-between items-center border-b dark:border-white/5">
              <AppIcon size={40} variant="circle" />
              <button
                onClick={onClose}
                className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 hover:scale-110 transition-transform"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {user ? (
                <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 mb-2">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary-1 flex items-center justify-center text-white font-black text-xl shadow-lg border-2 border-white dark:border-slate-700 overflow-hidden">
                      {user.avatar?.url ? (
                        <img src={user.avatar.url} alt="profile" className="w-full h-full object-cover" />
                      ) : user.firstname?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 dark:text-white uppercase italic leading-tight">
                        {user.firstname} {user.lastname}
                      </h4>
                      <p className="text-[10px] font-bold text-primary-1 uppercase tracking-widest mt-1">
                        {user.account_type || 'Free'} Member
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 grid grid-cols-2 gap-3">
                   <Link href="/auth/login" onClick={onClose} className="py-3 bg-slate-100 dark:bg-slate-800 text-center rounded-xl font-black text-[10px] uppercase tracking-widest">Masuk</Link>
                   <Link href="/auth/register" onClick={onClose} className="py-3 bg-primary-1 text-white text-center rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary-1/20">Daftar</Link>
                </div>
              )}

              <nav className="p-4 space-y-6">
                {user && (
                  <div>
                    <p className="px-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-3">User Dashboard</p>
                    <div className="space-y-1">
                      {/* 3. TAMBAHKAN PROPS active DENGAN PENGECEKAN PATHNAME */}
                      <MobileNavLink icon={<LayoutDashboard size={18}/>} href="/dashboard/main" label="Overview" active={pathname === "/dashboard/main"} onClick={onClose} />
                      <MobileNavLink icon={<BookOpen size={18}/>} href="/dashboard/modules" label="Materi Belajar" active={pathname === "/dashboard/modules"} onClick={onClose} />
                      <MobileNavLink icon={<History size={18}/>} href="/dashboard/history" label="Riwayat Latihan" active={pathname === "/dashboard/history"} onClick={onClose} />
                      <MobileNavLink icon={<User size={18}/>} href="/dashboard/profile" label="Profil Saya" active={pathname === "/dashboard/profile"} onClick={onClose} />
                      <MobileNavLink icon={<CreditCard size={18}/>} href="/dashboard/transactions" label="Transaksi" active={pathname === "/dashboard/transactions"} onClick={onClose} />
                      <MobileNavLink icon={<Settings size={18}/>} href="/dashboard/settings" label="Pengaturan" active={pathname === "/dashboard/settings"} onClick={onClose} />
                    </div>
                  </div>
                )}

                <div>
                  <p className="px-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-3">Informasi</p>
                  <div className="space-y-1">
                    <MobileNavLink icon={<Info size={18}/>} href="/about" label="Tentang Kami" active={pathname === "/about"} onClick={onClose} />
                    <MobileNavLink icon={<ShieldCheck size={18}/>} href="/privacy-policy" label="Privasi" active={pathname === "/privacy-policy"} onClick={onClose} />
                    <MobileNavLink icon={<FileText size={18}/>} href="/terms-conditions" label="Syarat & Ketentuan" active={pathname === "/terms-conditions"} onClick={onClose} />
                  </div>
                </div>
              </nav>
            </div>

            <div className="p-6 border-t dark:border-white/5 space-y-4 bg-slate-50/30 dark:bg-slate-900">
              <div className="flex gap-3">
                <button onClick={toggleTheme} className="flex-1 flex items-center justify-center gap-2 p-3.5 bg-white dark:bg-slate-800 rounded-2xl border dark:border-white/5 shadow-sm">
                  {themeIcon}
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">{theme}</span>
                </button>
                <LanguageSwitcher />
              </div>

              {user && (
                <button
                  onClick={() => { handleLogout(); onClose(); }}
                  className="w-full flex items-center justify-center gap-3 p-4 text-red-500 bg-red-50 dark:bg-red-500/10 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all"
                >
                  <LogOut size={16} /> Keluar Aplikasi
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


// 4. UPDATE KOMPONEN INI AGAR MENERIMA PROP active
function MobileNavLink({ href, label, onClick, icon, active }: { href: string; label: string; onClick: () => void, icon: React.ReactNode, active: boolean }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      // 5. BERIKAN LOGIC WARNA DISINI
      className={`group flex items-center justify-between p-4 rounded-2xl transition-all border ${
        active 
          ? "bg-primary-1/10 border-primary-1/20 text-primary-1 shadow-sm shadow-primary-1/5" 
          : "bg-transparent border-transparent text-slate-700 dark:text-slate-400 hover:bg-primary-1/5 dark:hover:bg-primary-1/10 hover:border-primary-1/10"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`transition-colors ${active ? "text-primary-1" : "text-slate-400 group-hover:text-primary-1"}`}>
          {icon}
        </div>
        <span className={`text-sm uppercase transition-colors ${active ? "font-black" : "font-bold group-hover:text-primary-1"}`}>
          {label}
        </span>
      </div>
      
      {/* Panah muncul lebih jelas kalau aktif */}
      <ChevronRight 
        size={16} 
        className={`transition-all ${active ? "text-primary-1 translate-x-1" : "text-slate-300 group-hover:text-primary-1 group-hover:translate-x-1"}`} 
      />
    </Link>
  );
}