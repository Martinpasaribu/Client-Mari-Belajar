/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, LogOut, Bell, Monitor, ChevronDown, LayoutDashboard, User, Menu } from "lucide-react";
import Link from 'next/link';
import LanguageSwitcher from "../tools/LanguageSwitcher";
import Cookies from 'js-cookie';
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import AppIcon from "../tools/AppIcon";
import { FadeInDown, FadeInContainer, FadeInItem, SlideInRight } from "@/components/animations/MotionWrapper";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MobileMenu from "./Burger";

export default function Navbar({ variant = "guest" }: { variant?: "guest" | "dashboard" }) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 1024) setIsMobileMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    Cookies.remove('token');
    router.push('/auth/login');
  };

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const ThemeIcon = () => {
    if (theme === "dark") return <Moon size={18} className="text-primary-1" />;
    if (theme === "light") return <Sun size={18} className="text-amber-500" />;
    return <Monitor size={18} className="text-slate-500" />;
  };

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 py-0 shadow-lg shadow-slate-200/20 dark:shadow-none" : "bg-transparent border-b border-transparent py-2"}`}>
        <FadeInDown className={`${variant === "dashboard" ? "px-6" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}`}>
          <div className="flex justify-between items-center h-16 md:h-20">
            
            <div className="flex w-full justify-between items-center gap-4">
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <Menu size={20} />
              </button>
              <Link href="/" className="flex justify-center items-center transition-all hover:opacity-80 active:scale-95">
                <AppIcon size={isScrolled ? 80 : 100} className="transition-all duration-500" variant="circle"/>
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden lg:flex items-center gap-4">
                <LanguageSwitcher />
                <button onClick={toggleTheme} className={`p-2.5 rounded-2xl border transition-all active:scale-95 ${isScrolled ? "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700" : "bg-white/10 backdrop-blur-md border-white/20"}`}>
                  <ThemeIcon />
                </button>
              </div>

              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <div className={`flex items-center gap-2 sm:gap-3 pl-2 border-l transition-colors ${isScrolled ? 'border-slate-100 dark:border-slate-800' : 'border-white/20'}`}>
                    <div onClick={() => setIsProfileOpen(!isProfileOpen)} className={`flex items-center gap-2 p-1 rounded-full border cursor-pointer transition-all group ${isScrolled ? "bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700" : "bg-white/20 backdrop-blur-sm border-white/30"}`}>
                      <div className="w-8 h-8 rounded-full bg-primary-1 flex items-center justify-center text-white text-[10px] font-black uppercase shadow-lg shadow-primary-1/20 group-hover:scale-90 transition-transform">{user?.firstname?.substring(0, 2)}</div>
                      <span className={`hidden md:block text-xs font-black px-1 uppercase tracking-tight ${isScrolled ? 'text-slate-700 dark:text-slate-200' : 'text-slate-800'}`}>{user?.firstname?.split(' ')[0]}</span>
                      <ChevronDown size={14} className={`mr-1 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''} text-slate-400`} />
                    </div>
                  </div>
                  {/* Dropdown Desktop tetap di sini karena posisinya 'absolute' terhadap profil */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-4 w-64 origin-top-right z-[60]">
                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-2xl p-3">
                           {/* ... isi dropdown sama seperti sebelumnya ... */}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-6">
                  <Link href="/auth/login" className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Masuk</Link>
                  <Link href="/auth/register" className="bg-primary-1 text-white px-7 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-1/20">Daftar</Link>
                </div>
              )}
            </div>
          </div>
        </FadeInDown>
      </nav>

      {/* Render Mobile Menu di Luar Nav Utama */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        handleLogout={handleLogout}
        toggleTheme={toggleTheme}
        themeIcon={<ThemeIcon />}
        theme={theme || "system"}
      />
    </>
  );
}