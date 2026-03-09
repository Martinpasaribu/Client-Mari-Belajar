/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import Image from 'next/image';
import AppIcon from '@/provider/tools/AppIcon';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      // 1. Simpan di Zustand
      setAuth(data.user, data.access_token);
      
      // 2. Simpan di Cookie (Wajib untuk Middleware)
      Cookies.set('token', data.access_token, { expires: 1, path: '/' }); 
      
      // 3. Redirect ke Dashboard
      router.push('/dashboard/main');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Login gagal, periksa email atau password');
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-xl border border-slate-100 dark:border-slate-800">
        <div className="text-center mb-8">
          
          {/* ICON */}
          <div className='w-full text-center'>
            <AppIcon 
              size={100} 
              variant='circle'
              className=" " 
            />
          </div>

          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">
            {/* MASUK <span className="text-primary">AKUN</span> */}
          </h2>
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
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Password
                </label>
                <Link href="/auth/forgot-password"  className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter">
                  Lupa password?
                </Link>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button
            disabled={loading}
            className="w-full rounded-xl bg-primary-1 dark:bg-dark-primary1 py-3 font-bold text-white shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:bg-slate-300 dark:disabled:bg-slate-700"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </span>
            ) : 'Masuk Sekarang'}
          </button>
        </form>

        <div className="relative my-3 md:my-6">
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
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="G" />
          <span>Masuk dengan Google</span>
        </button>

        <p className="mt-8 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
          Belum punya akun?{' '}
          <Link href="/auth/register" className="font-bold text-primary hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}