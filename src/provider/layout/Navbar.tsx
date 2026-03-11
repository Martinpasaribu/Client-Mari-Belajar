/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, LogOut, ChevronDown, LayoutDashboard, User, Menu, Settings, ShieldCheck, Monitor } from "lucide-react";
import Link from 'next/link';
import LanguageSwitcher from "../tools/LanguageSwitcher";
import Cookies from 'js-cookie';
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import AppIcon from "../tools/AppIcon";
import { FadeInDown } from "@/components/animations/MotionWrapper";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MobileMenu from "./Burger";
import { useLogout } from "@/hooks/useLogout";
import { LogoutLoading } from "@/components/modals/LogoutLoading";

export default function Navbar({ variant = "guest" }: { variant?: "guest" | "dashboard" }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { handleLogout, isLoading } = useLogout();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Handle Scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle Click Outside Dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);



  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  // 2. Perbaiki logika ThemeIcon
  const ThemeIcon = () => {
    if (theme === "dark") return <Moon size={18} className="text-primary-1" />;
    if (theme === "light") return <Sun size={18} className="text-amber-500" />;
    return <Monitor size={18} className="text-slate-500" />;
  };

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled ? "bg-white/80 dark:bg-dark-bg1/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5 py-0 shadow-lg shadow-slate-200/20" : "bg-transparent border-b border-transparent py-2"}`}>
       
       {isLoading && <LogoutLoading />}

        <FadeInDown className={`${variant === "dashboard" ? "px-6" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}`}>
          <div className="flex justify-between items-center h-16 md:h-20">
            
            <div className="w-full flex justify-between items-center md:items-center gap-4">
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-dark-bg2 text-slate-600 dark:text-slate-300">
                <Menu size={20} />
              </button>

                  {!user ? (
                      <Link href="/" className="flex transition-all hover:opacity-80 active:scale-95">
                        <AppIcon variant="circle" width={isScrolled ? 80 : 70} height={70} className="transition-all duration-500"/>
                      </Link>
                  ):(
                    <div> 
                      
                      </div>
                  )}
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden lg:flex items-center gap-4">
                <LanguageSwitcher />
                <button onClick={toggleTheme} className={`p-2.5 rounded-2xl border transition-all active:scale-95 ${isScrolled ? "bg-bg2 dark:bg-dark-bg2 border-slate-200 dark:border-white/5" : "bg-white/10 backdrop-blur-md border-white/20"}`}>
                  <ThemeIcon />
                </button>
              </div>

              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <div className={`flex items-center gap-2 sm:gap-3 pl-2 border-l transition-colors ${isScrolled ? 'border-slate-100 dark:border-white/5' : 'border-white/20'}`}>
                    <div 
                      onClick={() => setIsProfileOpen(!isProfileOpen)} 
                      className={`flex items-center gap-2 p-1.5 pr-3 rounded-full border cursor-pointer transition-all group ${isScrolled ? "bg-bg2 dark:bg-dark-bg2 border-slate-200 dark:border-white/5" : "bg-white/20 backdrop-blur-sm border-white/30"}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary-1 dark:bg-dark-primary1 flex items-center justify-center text-white text-[10px] font-black uppercase shadow-lg shadow-primary-1/20 transition-transform group-hover:scale-95">
                        {user?.firstname?.substring(0, 2)}
                      </div>
                      <span className={`hidden md:block text-xs font-black uppercase tracking-tight ${isScrolled ? 'text-slate-700 dark:text-slate-200' : 'text-slate-800 dark:text-white'}`}>
                        {user?.firstname?.split(' ')[0]}
                      </span>
                      <ChevronDown size={14} className={`transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''} text-slate-400`} />
                    </div>
                  </div>

                  {/* DESKTOP DROPDOWN */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                        className="absolute right-0 mt-3 w-60 origin-top-right z-[60]"
                      >
                        <div className="bg-white dark:bg-dark-bg2 border border-slate-100 dark:border-white/5 rounded-[1.8rem] shadow-xl p-2">
                          {/* User Info Section - Lebih Ramping */}
                          <div className="flex items-center gap-3 p-3 mb-1 bg-bg2 dark:bg-dark-bg1 rounded-[1.4rem]">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-1 to-primary-2 flex items-center justify-center text-white font-black text-xs shrink-0">
                              {user?.firstname?.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="font-black text-slate-800 dark:text-white text-xs truncate uppercase tracking-tight">
                                {user?.firstname}
                              </span>
                              <div className="flex items-center gap-1 text-[8px] text-primary-1 font-bold uppercase tracking-widest opacity-80">
                                <ShieldCheck size={8} /> {user?.role || 'Siswa'}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-0.5 z-40">
                            <DropdownItem icon={<LayoutDashboard size={14}/>} label="Dashboard" href="/dashboard/main" />
                            <DropdownItem icon={<User size={14}/>} label="Profil" href="/dashboard/profile" />
                            <DropdownItem icon={<Settings size={14}/>} label="Setting" href="/dashboard/settings" />
                            
                            <hr className="my-1.5 border-slate-50 dark:border-white/5 mx-2" />
                            
                            <button 
                              onClick={handleLogout}
                              className="flex items-center gap-3 w-full p-2.5 px-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group"
                            >
                              <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-500/20 group-hover:scale-105 transition-transform">
                                <LogOut size={14} />
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-widest">Keluar</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-6">
                  <Link href="/auth/login" className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-primary-1 transition-colors">Masuk</Link>
                  <Link href="/auth/register" className="bg-primary-1 dark:bg-dark-primary1 text-white px-7 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-1/20 hover:-translate-y-1 transition-all">Daftar</Link>
                </div>
              )}
            </div>
          </div>
        </FadeInDown>
      </nav>

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

// Helper Component untuk Menu Dropdown
function DropdownItem({ icon, label, href }: { icon: any, label: string, href: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 p-2.5 px-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-bg2 dark:hover:bg-dark-bg1 hover:text-primary-1 transition-all group">
      <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/5 group-hover:bg-primary-1 group-hover:text-white transition-all">
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </Link>
  );
}