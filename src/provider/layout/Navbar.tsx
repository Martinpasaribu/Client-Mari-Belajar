/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/static-components */
"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, LogOut, Bell, Monitor, ChevronDown, LayoutDashboard, User } from "lucide-react";
import Link from 'next/link';
import LanguageSwitcher from "../tools/LanguageSwitcher";
import Cookies from 'js-cookie';
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import AppIcon from "../tools/AppIcon";
// Import wrapper baru
import { FadeInDown, FadeInContainer, FadeInItem, BlurIn, SlideInRight, ScaleIn } from "@/components/animations/MotionWrapper";
import { useEffect, useRef, useState } from "react";

export default function Navbar({ variant = "guest" }: { variant?: "guest" | "dashboard" }) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Menutup dropdown saat klik di luar area profile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const isDashboard = variant === "dashboard";

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors">
      {/* Bungkus isi Nav dengan FadeInDown agar muncul dari atas saat page load */}
      <FadeInDown className={`${isDashboard ? "px-6" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}`}>
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* SISI KIRI: LOGO */}
          <div className="flex items-center">
            {!isDashboard ? (
              <Link href="/" className="flex justify-center items-center transition-opacity hover:opacity-80">
                <AppIcon 
                  size={80} 
                  className="rounded-full" 
                />
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/" className="lg:hidden">
                  <AppIcon variant="circle" size={35} />
                </Link>
                <h1 className="hidden lg:block font-black text-xl tracking-tighter">
                  DASH<span className="text-primary-1">BOARD</span>
                </h1>
              </div>
            )}
          </div>

          {/* SISI KANAN: ACTIONS */}
          {/* Gunakan FadeInContainer agar item-item kecil muncul bergantian (staggered) */}
          <FadeInContainer className="flex items-center gap-2 sm:gap-4">
            <FadeInItem className="hidden sm:block">
              <LanguageSwitcher />
            </FadeInItem>
            
            <FadeInItem>
              <button
                onClick={toggleTheme}
                className="group relative p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary-1 transition-all active:scale-95"
              >
                <ThemeIcon />
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all bg-slate-800 text-white text-[10px] px-2 py-1 rounded capitalize font-bold z-50">
                  {theme}
                </span>
              </button>
            </FadeInItem>

              {/* Sudah Login  */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <SlideInRight className="flex items-center gap-2 sm:gap-3 pl-2 border-l border-slate-100 dark:border-slate-800">
                    {isDashboard && (
                      <button className="p-2 text-slate-400 hover:text-primary-1 transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                      </button>
                    )}
                    
                    {/* Tombol Profile Trigger */}
                    <div 
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-full border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-primary-1 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary-1 flex items-center justify-center text-white text-[10px] font-black uppercase shadow-inner group-hover:scale-95 transition-transform">
                        {user?.firstname?.substring(0, 2)}
                      </div>
                      
                      <span className="hidden md:block text-xs font-bold px-1 text-slate-700 dark:text-slate-200">
                        {user?.firstname?.split(' ')[0]}
                      </span>
                      
                      <ChevronDown size={14} className={`text-slate-400 mr-1 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </SlideInRight>

                  {/* DROPDOWN MENU */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-56 origin-top-right z-[60]">
                      <ScaleIn className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-2xl shadow-primary-2/20 overflow-hidden p-2">
                        <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 mb-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selamat Datang,</p>
                          <p className="text-sm font-bold text-primary-2 dark:text-white truncate">{user?.firstname}</p>
                        </div>

                        <div className="space-y-1">
                          <Link 
                            href="/dashboard/main"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-primary-1/5 hover:text-primary-1 rounded-2xl transition-all"
                          >
                            <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <LayoutDashboard size={16} />
                            </div>
                            Dashboard User
                          </Link>

                          <Link 
                            href="/dashboard/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-primary-1/5 hover:text-primary-1 rounded-2xl transition-all"
                          >
                            <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <User size={16} />
                            </div>
                            Profil Saya
                          </Link>
                        </div>

                        <div className="mt-1 pt-1 border-t border-slate-50 dark:border-slate-800">
                          <button 
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all"
                          >
                            <div className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg">
                              <LogOut size={16} />
                            </div>
                            Keluar Akun
                          </button>
                        </div>
                      </ScaleIn>
                    </div>
                  )}
                </div>
              ) : (
              // Belum Login 
              <div className="flex items-center gap-2 sm:gap-4">
                <FadeInItem className="hidden sm:block">
                  <Link href="/auth/login" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary-1 transition-colors">
                    Masuk
                  </Link>
                </FadeInItem>
                <FadeInItem>
                  <Link 
                    href="/auth/register" 
                    className="bg-primary-1 dark:bg-dark-primary1 text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-primary-1/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-tight"
                  >
                    Daftar
                  </Link>
                </FadeInItem>
              </div>
            )}
          </FadeInContainer>
        </div>
      </FadeInDown>
    </nav>
  );
}