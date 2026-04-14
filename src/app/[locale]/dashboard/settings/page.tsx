/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { 
  Settings, 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  ShieldCheck, 
  Smartphone,
  Check,
  ChevronRight,
  Palette
} from "lucide-react";
import { useTheme } from "next-themes";
import { 
  FadeInContainer, 
  FadeInItem, 
  BlurIn, 
  ScaleIn 
} from "@/components/animations/MotionWrapper";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    browser: false,
    update: true
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-bg1 dark:bg-dark-bg1 pb-20">
      {/* Decorative Background */}
      <div className="fixed top-20 right-0 w-[300px] h-[300px] bg-primary-1/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="fixed bottom-20 left-0 w-[300px] h-[300px] bg-primary-2/10 blur-[100px] rounded-full pointer-events-none" />

      <FadeInContainer className="relative z-10 max-w-4xl mx-auto px-3 md:px-6 pt-12">
        
        {/* HEADER */}
        <FadeInItem className="mb-8 md:mb-14 px-2 sm:px-0">
          <BlurIn>
            <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8">
              
              {/* Kiri: Ikon dan Judul */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-5 md:gap-8 text-center sm:text-left">
                
                {/* Icon Container - Ukuran lebih kecil di mobile */}
                <div className="relative group shrink-0">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-primary-1 to-primary-2 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative p-4 md:p-5 bg-white dark:bg-slate-900 text-primary-1 rounded-[1.5rem] md:rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/10">
                    <Settings 
                      size={28} 
                      strokeWidth={2.5} 
                      className="md:w-8 md:h-8 group-hover:rotate-90 transition-transform duration-700" 
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-start space-y-2 md:space-y-1">
                  {/* Badge Kecil - Terpusat di mobile */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="hidden sm:block h-[2px] w-6 md:w-8 bg-primary-1"></span>
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary-1">
                      System Preference
                    </span>
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 dark:text-white tracking-tighter leading-none uppercase">
                    App <span className="text-primary-1 not-italic">Settings.</span>
                  </h1>
                  
                  <p className="max-w-xs md:max-w-md text-slate-500 dark:text-slate-400 font-medium text-xs md:text-sm lg:text-base leading-relaxed">
                    Personalisasi pengalaman belajarmu. Atur tampilan, keamanan, dan notifikasi dalam satu tempat.
                  </p>
                </div>
              </div>

              {/* Kanan: Status/Info - Muncul di Tablet ke atas (md) */}
              <div className="hidden md:flex self-center lg:self-end">
                <div className="px-5 py-2.5 rounded-xl md:rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center gap-3">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    System Ready
                  </span>
                </div>
              </div>

            </div>
          </BlurIn>
          
          {/* Garis Pemisah dengan Margin yang menyesuaikan */}
          <div className="mt-8 md:mt-10 h-[1px] w-full bg-gradient-to-r from-slate-200 via-transparent to-transparent dark:from-white/10"></div>
        </FadeInItem>

        <div className="grid grid-cols-1 gap-8">
          
          {/* SEKSI 1: APPEARANCE (TEMA) */}
          <FadeInItem className="bg-white dark:bg-dark-bg2 rounded-4xl md:rounded-[3rem] p-7 md:p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="flex items-center gap-4 mb-8">
              <Palette className="text-primary-1" size={20} />
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Tampilan & Tema</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ThemeOption 
                active={theme === 'light'} 
                onClick={() => setTheme('light')}
                icon={<Sun size={20} />}
                label="Terang"
              />
              <ThemeOption 
                active={theme === 'dark'} 
                onClick={() => setTheme('dark')}
                icon={<Moon size={20} />}
                label="Gelap"
              />
              <ThemeOption 
                active={theme === 'system'} 
                onClick={() => setTheme('system')}
                icon={<Smartphone size={20} />}
                label="Sistem"
              />
            </div>
          </FadeInItem>

          {/* SEKSI 2: NOTIFICATIONS */}
          <FadeInItem className="bg-white dark:bg-dark-bg2 rounded-[3rem] p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="flex items-center gap-4 mb-8">
              <Bell className="text-primary-1" size={20} />
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Pusat Notifikasi</h3>
            </div>

            <div className="space-y-4">
              <ToggleOption 
                label="Notifikasi Email" 
                desc="Dapatkan laporan belajar mingguan di inbox kamu."
                enabled={notifications.email}
                onToggle={() => toggleNotification('email')}
              />
              <ToggleOption 
                label="Notifikasi Browser" 
                desc="Munculkan peringatan saat jadwal belajar dimulai."
                enabled={notifications.browser}
                onToggle={() => toggleNotification('browser')}
              />
              <ToggleOption 
                label="Update Platform" 
                desc="Beritahu saya jika ada fitur atau materi baru."
                enabled={notifications.update}
                onToggle={() => toggleNotification('update')}
              />
            </div>
          </FadeInItem>

          {/* SEKSI 3: LANGUAGE & REGION */}
          <FadeInItem className="bg-white dark:bg-dark-bg2 rounded-[3rem] p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Globe className="text-primary-1" size={20} />
                <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Bahasa & Wilayah</h3>
              </div>
              <button className="flex items-center gap-2 text-primary-1 font-bold text-xs uppercase tracking-widest hover:underline">
                Ubah Bahasa <ChevronRight size={14} />
              </button>
            </div>
          </FadeInItem>

        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex justify-end gap-4">
           <button className="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
             Reset ke Default
           </button>
           <button className="px-10 py-4 bg-primary-1 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary-1/20 hover:scale-[1.05] active:scale-95 transition-all">
             Simpan Perubahan
           </button>
        </div>

      </FadeInContainer>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function ThemeOption({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-center gap-3 p-6 rounded-[2rem] border-2 transition-all ${
        active 
        ? 'border-primary-1 bg-primary-1/5 text-primary-1 shadow-inner' 
        : 'border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800/30 text-slate-400 hover:border-slate-200'
      }`}
    >
      {icon}
      <span className="font-black text-xs uppercase tracking-widest">{label}</span>
    </button>
  );
}

function ToggleOption({ label, desc, enabled, onToggle }: any) {
  return (
    <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-white/5 hover:border-primary-1/30 transition-all group">
      <div>
        <h4 className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-tight mb-1">{label}</h4>
        <p className="text-xs text-slate-400 font-medium">{desc}</p>
      </div>
      <button 
        onClick={onToggle}
        className={`w-14 h-8 rounded-full transition-all relative ${
          enabled ? 'bg-primary-1 shadow-lg shadow-primary-1/20' : 'bg-slate-200 dark:bg-slate-700'
        }`}
      >
        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-all ${
          enabled ? 'left-7' : 'left-1'
        }`} />
      </button>
    </div>
  );
}