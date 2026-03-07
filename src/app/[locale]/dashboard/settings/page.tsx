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

      <FadeInContainer className="relative z-10 max-w-4xl mx-auto px-6 pt-12">
        
        {/* HEADER */}
        <FadeInItem className="mb-12">
          <BlurIn>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary-1 text-white rounded-2xl shadow-lg shadow-primary-1/20">
                <Settings size={24} />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-primary-2 dark:text-white tracking-tighter uppercase italic leading-none">
                  App <span className="text-primary-1">Settings.</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Atur preferensi aplikasi untuk kenyamanan belajarmu.</p>
              </div>
            </div>
          </BlurIn>
        </FadeInItem>

        <div className="grid grid-cols-1 gap-8">
          
          {/* SEKSI 1: APPEARANCE (TEMA) */}
          <FadeInItem className="bg-white dark:bg-dark-bg2 rounded-[3rem] p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none">
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