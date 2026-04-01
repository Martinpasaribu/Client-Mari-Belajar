"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios'; // Atau gunakan fetch jika tidak pakai axios
import AppIcon from '@/provider/tools/AppIcon';

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Panggil API NestJS yang baru dibuat
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, { email });
      
      setIsLoading(false);
      setIsSubmitted(true);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBFA] dark:bg-[#080705] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 select-none">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md text-center"
      >
        <div className="flex justify-center mb-8">
          <AppIcon variant="circle" width={90} height={90} />
        </div>
      </motion.div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[450px]">
        <div className="bg-white dark:bg-[#18181b] py-10 px-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-100 dark:border-white/5 rounded-[2.5rem]">
          
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form-step"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-[#0f172a] dark:text-white uppercase tracking-tight">
                    Lupa Password?
                  </h2>
                  <p className="mt-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] leading-relaxed">
                    Masukkan email terdaftar untuk menerima instruksi reset.
                  </p>
                </div>

                {error && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold"
                  >
                    <AlertCircle size={16} /> {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-[#00BD9D] transition-colors">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-12 pr-4 py-4 bg-[#fafafa] dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl text-sm font-bold text-[#0f172a] dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-[#00BD9D]/10 focus:border-[#00BD9D] transition-all select-text"
                        placeholder="nama@email.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-4 bg-[#00BD9D] dark:bg-[#1F7D53] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-[#00BD9D]/20 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-70 disabled:translate-y-0 disabled:active:scale-100"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      "Kirim Instruksi Reset"
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-step"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-green-50 dark:bg-green-500/10 text-[#00BD9D] rounded-full flex items-center justify-center">
                    <CheckCircle2 size={44} strokeWidth={2.5} />
                  </div>
                </div>
                <h2 className="text-2xl font-black text-[#0f172a] dark:text-white uppercase tracking-tight mb-3">
                  Email Terkirim!
                </h2>
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed mb-10">
                  Periksa inbox <span className="text-[#00BD9D]">{email}</span>. Pastikan juga memeriksa folder spam jika tidak menemukannya.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#00BD9D] transition-colors border-b border-transparent hover:border-[#00BD9D] pb-1"
                >
                  Ganti email atau coba lagi
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10 pt-8 border-t border-slate-50 dark:border-white/5 text-center">
            <Link 
              href="/auth/login" 
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#00BD9D] transition-all"
            >
              <ArrowLeft size={14} /> Kembali ke halaman Login
            </Link>
          </div>
        </div>
        
        <p className="mt-10 text-center text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-slate-700">
          Mari Belajar &bull; 2026
        </p>
      </div>
    </div>
  );
}