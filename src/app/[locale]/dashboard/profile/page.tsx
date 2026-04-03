/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { 
  User, Mail, Phone, MapPin, Camera, 
  ShieldCheck, Calendar, Edit3, Save, KeyRound, Loader2, ChevronLeft 
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/axios";
import { useToast } from "@/context/ToastContext";
import { 
  FadeInContainer, FadeInItem, BlurIn, ScaleIn 
} from "@/components/animations/MotionWrapper";
import Link from 'next/link';
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { showToast, updateToast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    phone: user?.phone || "",
    location: user?.location || "Jakarta, Indonesia",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await api.patch("/users/profile", formData);
      if (response.data.success) {
        setUser(response.data.data); 
        showToast("Profil berhasil diperbarui!", "success");
        setIsEditing(false);
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || "Gagal memperbarui profil", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);

    let toastId: number = 0;
    try {
      const id = showToast("Sedang mengupload foto...", "loading");
      toastId = typeof id === 'number' ? id : 0;

      const res = await api.post("/users/profile/avatar", uploadData);

      if (res.data && res.data.success) {
        setUser(res.data.data); 
        if (toastId !== 0) updateToast(toastId, "Foto profil diperbarui!", "success");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Gagal upload foto';
      if (toastId !== 0) updateToast(toastId, errorMessage, "error");
      else showToast(errorMessage, "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors duration-300">
      
      {/* MOBILE HEADER NAVIGATION */}
      <div className="lg:hidden flex items-center justify-between p-3 md:p-6 bg-white dark:bg-slate-900 border-b dark:border-white/5 sticky top-0 z-30">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-500"><ChevronLeft /></button>
        <h1 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white ">My Profile</h1>
        <div className="w-8" /> {/* Spacer */}
      </div>

      <FadeInContainer className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:pt-12 pt-6">
        
        {/* DESKTOP TITLE (Hidden on Mobile) */}
        <FadeInItem className="hidden lg:block mb-12">
          <BlurIn>
            <h1 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter uppercase ">
              User <span className="text-primary-1">Profile.</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium ">
              Kelola informasi pribadi dan keamanan akun kamu.
            </p>
          </BlurIn>
        </FadeInItem>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* LEFT SIDE: AVATAR CARD */}
          <div className="lg:col-span-4 space-y-6">
            <ScaleIn className="bg-white dark:bg-slate-900 rounded-[2.5rem] lg:rounded-[3rem] p-6 lg:p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-20 lg:h-24 bg-gradient-to-r from-primary-1/10 to-primary-2/10" />
              
              <div className="relative mt-2 lg:mt-4 mb-6 inline-block">
                <div className="w-28 h-28 lg:w-36 lg:h-36 rounded-[2rem] lg:rounded-[2.5rem] bg-primary-1 overflow-hidden flex items-center justify-center text-white text-3xl lg:text-4xl font-black shadow-2xl border-4 border-white dark:border-slate-800">
                  {user?.avatar?.url ? (
                    <img src={user.avatar.url} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    user?.firstname?.substring(0, 2).toUpperCase()
                  )}
                </div>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-white/10 text-primary-1 hover:scale-110 transition-transform active:scale-90"
                >
                  <Camera size={18} />
                </button>
              </div>

              <h2 className="text-xl lg:text-2xl font-black text-slate-800 dark:text-white uppercase">
                {user?.firstname} {user?.lastname}
              </h2>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-1/10 rounded-full mt-3">
                 <ShieldCheck size={12} className="text-primary-1" />
                 <p className="text-primary-1 font-black text-[9px] uppercase tracking-widest">
                  {user?.role || 'Member'}
                </p>
              </div>
            </ScaleIn>

            {/* QUICK STATS (Optional Addition for Fill) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-white/5 text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <p className="text-xs font-bold text-emerald-500 uppercase">Aktif</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-white/5 text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tipe</p>
                <p className="text-xs font-bold text-primary-1 uppercase">{user?.account_type || 'Free'}</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: FORMS */}
          <div className="lg:col-span-8 space-y-6 lg:space-y-8">
            <FadeInItem className="bg-white dark:bg-slate-900 rounded-[2.5rem] lg:rounded-[3rem] p-6 md:p-10 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary-1/10 text-primary-1 rounded-2xl hidden sm:block">
                    <User size={20} />
                  </div>
                  <h3 className="text-lg lg:text-xl font-black text-slate-800 dark:text-white uppercase  tracking-tight">Informasi Pribadi</h3>
                </div>
                
                <button 
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  disabled={isLoading}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    isEditing 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : isEditing ? (
                    <><Save size={14} /> Simpan</>
                  ) : (
                    <><Edit3 size={14} /> Edit Profil</>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8">
                <ProfileInput label="Nama Depan" name="firstname" value={formData.firstname} icon={<User size={16}/>} isEditing={isEditing} onChange={handleInputChange} />
                <ProfileInput label="Nama Belakang" name="lastname" value={formData.lastname} icon={<User size={16}/>} isEditing={isEditing} onChange={handleInputChange} />
                <ProfileInput label="Alamat Email" name="email" value={user?.email || ""} icon={<Mail size={16}/>} isEditing={false} />
                <ProfileInput label="Nomor Telepon" name="phone" value={formData.phone} icon={<Phone size={16}/>} isEditing={isEditing} onChange={handleInputChange} />
                <div className="md:col-span-2">
                   <ProfileInput label="Lokasi" name="location" value={formData.location} icon={<MapPin size={16}/>} isEditing={isEditing} onChange={handleInputChange} />
                </div>
              </div>
            </FadeInItem>

            {/* SECURITY SECTION */}
            <FadeInItem className="bg-white dark:bg-slate-900 rounded-[2.5rem] lg:rounded-[3rem] p-6 md:p-10 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary-2/10 text-primary-2 rounded-2xl hidden sm:block">
                  <KeyRound size={20} />
                </div>
                <h3 className="text-lg lg:text-xl font-black text-slate-800 dark:text-white uppercase  tracking-tight">Keamanan Akun</h3>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 p-6 lg:p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
                <div className="space-y-1">
                  <h4 className="font-black text-slate-800 dark:text-white text-sm uppercase">Kata Sandi</h4>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                    Terakhir diperbarui: {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('id-ID') : 'Baru saja'}
                  </p>
                </div>
                <Link 
                  href="/auth/forgot-password"  
                  className="w-full sm:w-auto text-center px-6 py-3 bg-white dark:bg-slate-700 rounded-xl text-[10px] font-black text-primary-1 border border-primary-1/20 hover:bg-primary-1 hover:text-white transition-all uppercase tracking-widest"
                >
                  Ganti Password
                </Link>
              </div>
            </FadeInItem>
          </div>
        </div>
      </FadeInContainer>
    </div>
  );
}

function ProfileInput({ label, name, value, icon, isEditing, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{label}</label>
      <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all duration-300 ${
        isEditing 
        ? 'border-primary-1 bg-white dark:bg-slate-900 ring-4 ring-primary-1/5 shadow-sm' 
        : 'border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800/30'
      }`}>
        <div className={`transition-colors ${isEditing ? 'text-primary-1' : 'text-slate-400'}`}>{icon}</div>
        <input 
          type="text" 
          name={name}
          value={value}
          disabled={!isEditing}
          onChange={onChange}
          autoComplete="off"
          className="bg-transparent w-full text-sm font-bold text-slate-800 dark:text-white outline-none disabled:opacity-60 placeholder:text-slate-300"
        />
      </div>
    </div>
  );
}