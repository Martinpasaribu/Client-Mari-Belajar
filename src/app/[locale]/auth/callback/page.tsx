'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import Cookies from 'js-cookie';

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAuth } = useAuthStore();

useEffect(() => {
  const token = searchParams.get('token');

  if (token) {
    // 1. Simpan token ke Cookie
    Cookies.set('token', token, { expires: 1 });
    
    // 2. Fetch data profil user asli dari Backend
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const userData = await response.json();
        
        // 3. Simpan data ASLI (firstname, email, dll) ke Zustand
        setAuth(userData, token);
        
        router.push('/dashboard/main');
      } catch (error) {
        console.error("Gagal mengambil profil:", error);
        router.push('/login?error=profile_failed');
      }
    };

    fetchProfile();
  } else {
    router.push('/login?error=no_token');
  }
}, [searchParams, setAuth, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-gray-600">Menyambungkan akun Google kamu...</p>
    </div>
  );
}