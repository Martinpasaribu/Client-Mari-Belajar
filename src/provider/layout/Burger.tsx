/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
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
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[100] bg-white dark:bg-slate-900 lg:hidden flex flex-col p-8"
        >
          {/* Header Mobile Menu */}
          <div className="flex justify-between items-center mb-12">
            <AppIcon size={80} />
            <button
              onClick={onClose}
              className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-300"
            >
              <X size={24} />
            </button>
          </div>

          {/* Nav Links */}
          <div className="flex-1 space-y-4 overflow-y-auto">


            {user && (
              <>
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-6" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 mb-2">
                  User Area
                </p>
                <MobileNavLink href="/dashboard/main" label="Main" onClick={onClose} />
                <MobileNavLink href="/dashboard/modules" label="modules" onClick={onClose} />
                <MobileNavLink href="/dashboard/history" label="History" onClick={onClose} />
                <MobileNavLink href="/dashboard/profile" label="profile" onClick={onClose} />
                <MobileNavLink href="/dashboard/transactions" label="transactions" onClick={onClose} />
                <MobileNavLink href="/dashboard/settings" label="settings" onClick={onClose} />
                <button
                  onClick={() => {
                    handleLogout();
                    onClose();
                  }}
                  className="w-full flex items-center gap-4 p-5 text-red-500 font-black uppercase tracking-widest italic"
                >
                  <LogOut size={20} /> Keluar Akun
                </button>
              </>
            )}
            
            {!user && (
              <div className="grid grid-cols-1 gap-4 mb-8">
                <Link
                  href="/auth/login"
                  onClick={onClose}
                  className="p-5 bg-slate-50 dark:bg-slate-800 rounded-[2rem] font-black uppercase tracking-widest text-center text-xs"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register"
                  onClick={onClose}
                  className="p-5 bg-primary-1 text-white rounded-[2rem] font-black uppercase tracking-widest text-center shadow-xl shadow-primary-1/20 text-xs"
                >
                  Daftar Sekarang
                </Link>
              </div>
            )}

            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 mb-2">
              Main Menu
            </p>

  
            <MobileNavLink href="/catalogs" label="Dashboard" onClick={onClose} />
            <MobileNavLink href="/about" label="Tentang Kami" onClick={onClose} />
            <MobileNavLink href="/privacy-policy" label="Privacy & Policy" onClick={onClose} />
            <MobileNavLink href="/terms-condition" label="Terms Condition" onClick={onClose} />


          </div>

          {/* Footer Mobile Menu */}
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <LanguageSwitcher />
            <button
              onClick={toggleTheme}
              className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl italic font-black uppercase text-[10px] flex items-center gap-2"
            >
              {themeIcon} {theme} Mode
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MobileNavLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between p-5 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-[2rem] font-black uppercase tracking-tighter italic text-xl text-slate-800 dark:text-white hover:bg-primary-1 hover:text-white transition-all"
    >
      {label}
      <ChevronDown size={20} className="-rotate-90" />
    </Link>
  );
}