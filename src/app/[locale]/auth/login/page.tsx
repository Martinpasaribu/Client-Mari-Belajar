/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import AppIcon from '@/provider/tools/AppIcon';
import { useToast } from '@/context/ToastContext'; // Import Toast
import { LoginLoading } from '@/components/modals/LoginLoading'; // Import Component Loading tadi
import { AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { setAuth } = useAuthStore();
  const { showToast, updateToast } = useToast();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Jalankan toast loading dan simpan ID-nya
    const toastId = showToast("Sedang memverifikasi akun...", "loading");
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      // Simpan data autentikasi
      setAuth(data.user, data.access_token);
      Cookies.set('token', data.access_token, { expires: 1, path: '/' }); 
      
      // 2. Update toast menjadi sukses
      updateToast(toastId, "Login berhasil! Selamat datang kembali.", "success");
      
      // Beri sedikit delay agar user bisa melihat animasi LoginLoading sebelum pindah
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      router.push('/dashboard/main');
    } catch (error: any) {
      // 3. Update toast jika gagal
      const errorMessage = error.response?.data?.message || 'Login gagal, periksa email atau password';
      updateToast(toastId, errorMessage, "error");
      setLoading(false);
    }
  };

  const loginGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-xl border border-slate-100 dark:border-slate-800">
          <div className="text-center mb-8">
            <div className='w-full text-center'>
              <AppIcon size={100} variant='circle' />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
              Lanjutkan progres belajarmu hari ini
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="nama@email.com"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-1 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Password
                  </label>
                  <Link href="/auth/forgot-password"  className="text-[10px] font-bold text-primary-1 hover:underline uppercase tracking-tighter">
                    Lupa password?
                  </Link>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-1 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button
              disabled={loading}
              className="w-full rounded-xl bg-primary-1 dark:bg-dark-primary1 py-3 font-bold text-white shadow-lg shadow-primary-1/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              Masuk Sekarang
            </button>

            

            <Link href="/"
            >
              <p 
                className="w-full rounded-xl bg-gray-200 dark:bg-dark-primary1 text-center py-3 font-bold text-gray-400 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
              Tamu
            </p>
            </Link>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100 dark:border-slate-800"></span>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-black tracking-widest">Atau</span>
            </div>
          </div>

          <button
            onClick={loginGoogle}
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98]"
          >
            <img src="/assets/icon/google.png" className="h-5 w-5" alt="G" />
            <span>Masuk dengan Google</span>
          </button>

          <p className="mt-8 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
            Belum punya akun?{' '}
            <Link href="/auth/register" className="font-bold text-primary-1 hover:underline">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>

      {/* FULL SCREEN LOADING */}
      <AnimatePresence>
        {loading && <LoginLoading />}
      </AnimatePresence>
    </>
  );
}