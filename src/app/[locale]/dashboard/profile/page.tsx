/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  ShieldCheck, 
  Calendar,
  Edit3,
  Save,
  KeyRound
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  FadeInContainer, 
  FadeInItem, 
  BlurIn, 
  ScaleIn 
} from "@/components/animations/MotionWrapper";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  // Mock data untuk melengkapi UI jika data user belum lengkap
  const userData = {
    firstname: user?.firstname || "User",
    lastname: user?.lastname || "E-Learning",
    email: user?.email || "user@example.com",
    phone: "+62 812 3456 7890",
    location: "Jakarta, Indonesia",
    joinedDate: "Maret 2024",
    role: "Premium Member"
  };

  return (
    <div className="min-h-screen bg-bg1 dark:bg-dark-bg1 pb-20">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-1/4 w-[400px] h-[400px] bg-primary-1/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-primary-2/5 blur-[100px] rounded-full pointer-events-none" />

      <FadeInContainer className="relative z-10 max-w-5xl mx-auto px-6 pt-12">
        
        {/* HEADER SECTION */}
        <FadeInItem className="mb-12">
          <BlurIn>
            <h1 className="text-4xl md:text-5xl font-black text-primary-2 dark:text-white tracking-tighter uppercase italic">
              User <span className="text-primary-1">Profile.</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Kelola informasi pribadi dan keamanan akun kamu di sini.
            </p>
          </BlurIn>
        </FadeInItem>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDE: AVATAR & QUICK STATS */}
          <div className="lg:col-span-1 space-y-8">
            <ScaleIn className="bg-white dark:bg-dark-bg2 rounded-[3rem] p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary-1/20 to-primary-2/20" />
              
              <div className="relative mt-4 mb-6 inline-block">
                <div className="w-32 h-32 rounded-[2.5rem] bg-primary-1 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-primary-1/40 border-4 border-white dark:border-dark-bg2">
                  {userData.firstname.substring(0, 2).toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-white/10 text-primary-1 hover:scale-110 transition-transform">
                  <Camera size={18} />
                </button>
              </div>

              <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-none uppercase">
                {userData.firstname} {userData.lastname}
              </h2>
              <p className="text-primary-1 font-bold text-xs uppercase tracking-widest mt-2">
                {userData.role}
              </p>

              <div className="mt-8 pt-8 border-t border-slate-50 dark:border-white/5 flex justify-around">
                <div>
                  <p className="text-xl font-black text-slate-800 dark:text-white">12</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Kursus</p>
                </div>
                <div className="w-[1px] bg-slate-100 dark:bg-white/5" />
                <div>
                  <p className="text-xl font-black text-slate-800 dark:text-white">85%</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Selesai</p>
                </div>
              </div>
            </ScaleIn>

            <FadeInItem className="bg-primary-2 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-primary-2/20">
              <ShieldCheck className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32" />
              <h3 className="text-lg font-black italic mb-2">Akun Terverifikasi</h3>
              <p className="text-white/70 text-sm font-medium leading-relaxed">
                Identitas kamu telah diverifikasi untuk akses penuh ke semua fitur platform.
              </p>
            </FadeInItem>
          </div>

          {/* RIGHT SIDE: FORMS */}
          <div className="lg:col-span-2 space-y-8">
            <FadeInItem className="bg-white dark:bg-dark-bg2 rounded-[3rem] p-8 md:p-10 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary-1/10 text-primary-1 rounded-2xl">
                    <User size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Informasi Pribadi</h3>
                </div>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    isEditing 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {isEditing ? <><Save size={14} /> Simpan</> : <><Edit3 size={14} /> Edit Profil</>}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProfileField label="Nama Depan" value={userData.firstname} icon={<User size={16}/>} isEditing={isEditing} />
                <ProfileField label="Nama Belakang" value={userData.lastname} icon={<User size={16}/>} isEditing={isEditing} />
                <ProfileField label="Alamat Email" value={userData.email} icon={<Mail size={16}/>} isEditing={isEditing} />
                <ProfileField label="Nomor Telepon" value={userData.phone} icon={<Phone size={16}/>} isEditing={isEditing} />
                <ProfileField label="Lokasi" value={userData.location} icon={<MapPin size={16}/>} isEditing={isEditing} />
                <ProfileField label="Terdaftar Sejak" value={userData.joinedDate} icon={<Calendar size={16}/>} isEditing={false} />
              </div>
            </FadeInItem>

            <FadeInItem className="bg-white dark:bg-dark-bg2 rounded-[3rem] p-8 md:p-10 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-primary-2/10 text-primary-2 rounded-2xl">
                  <KeyRound size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Keamanan Akun</h3>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
                <div>
                  <h4 className="font-black text-slate-800 dark:text-white text-sm uppercase">Kata Sandi</h4>
                  <p className="text-xs text-slate-500 font-medium">Terakhir diubah 3 bulan yang lalu</p>
                </div>
                <button className="w-full md:w-auto px-6 py-3 bg-primary-2 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary-2/20 hover:scale-[1.02] active:scale-95 transition-all">
                  Ganti Password
                </button>
              </div>
            </FadeInItem>
          </div>

        </div>
      </FadeInContainer>
    </div>
  );
}

// Sub-component untuk input field agar kode lebih bersih
function ProfileField({ label, value, icon, isEditing }: { label: string, value: string, icon: any, isEditing: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all ${
        isEditing 
        ? 'border-primary-1 bg-white dark:bg-dark-bg1 ring-4 ring-primary-1/5' 
        : 'border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800/30'
      }`}>
        <div className="text-slate-400">{icon}</div>
        {isEditing ? (
          <input 
            type="text" 
            defaultValue={value}
            className="bg-transparent w-full text-sm font-bold text-slate-800 dark:text-white outline-none focus:none"
          />
        ) : (
          <span className="text-sm font-bold text-slate-800 dark:text-white">{value}</span>
        )}
      </div>
    </div>
  );
}