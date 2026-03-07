// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

// 1. Inisialisasi middleware i18n
const handleI18nRouting = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localeDetection: false,
  localeCookie: {
    name: 'MY_APP_LOCALE'
  }
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 2. Tentukan halaman mana saja yang butuh Login (Protected Routes)
  // Kita cek apakah pathname mengandung '/dashboard', '/attempts', atau '/profile'
  // Pastikan mengecek juga setelah locale (misal: /id/dashboard)
  const isProtectedRoute = pathname.match(/\/(id|en)\/(dashboard|attempts|profile)/) || 
                           pathname.startsWith('/dashboard') || 
                           pathname.startsWith('/attempts');

  // 3. Ambil token dari Cookies (BUKAN localStorage, karena middleware jalan di Server)
  const token = request.cookies.get('token')?.value;

  // 4. Jika mencoba akses halaman terproteksi tapi tidak ada token
  if (isProtectedRoute && !token) {
    // Ambil locale saat ini atau gunakan default
    const locale = request.cookies.get('MY_APP_LOCALE')?.value || routing.defaultLocale;
    
    // Redirect ke halaman login dengan locale yang sesuai
    const loginUrl = new URL(`/${locale}/auth/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 5. Jalankan middleware i18n jika pengecekan auth lolos
  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    '/', 
    '/(id|en)/:path*',
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
};




// import createMiddleware from 'next-intl/middleware';
// import { routing } from './i18n/routing';

// export default createMiddleware({
//   locales: routing.locales,
//   defaultLocale: routing.defaultLocale,
// localeDetection: false, // Ubah jadi false untuk menghentikan auto-redirect
//   localeCookie: {
//     name: 'MY_APP_LOCALE'
//   }
// });

// export const config = {
//  matcher: [
//     '/', 
//     '/(id|en)/:path*', // Sesuaikan dengan locale yang Anda punya
//     '/((?!_next|_vercel|.*\\..*).*)'
//   ]
// };
