/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppIcon from '@/provider/tools/AppIcon';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      // Menggunakan flow yang konsisten
      router.push('/auth/login?registered=true');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
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
          {/* <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">
            DAFTAR <span className="text-primary">AKUN</span>
          </h2> */}
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
            Mulai petualangan belajarmu sekarang
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              placeholder="Jhon Doe"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="nama@email.com"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            ) : 'Buat Akun Sekarang'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
          Sudah punya akun?{' '}
          <Link href="/auth/login" className="font-bold text-primary hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}