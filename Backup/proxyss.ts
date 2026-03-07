// // src/proxy.ts
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Jika di root, arahkan ke /id
//   if (pathname === '/') {
//     return NextResponse.redirect(new URL('/id', request.url));
//   }

//   return NextResponse.next();
// }

// // WAJIB: Export fungsi dengan nama 'proxy' untuk Next.js 16
// export default proxy;

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// };