// components/ThemeProvider.tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mencegah flash of unstyled content (FOUC)
  if (!mounted) {
    return <div className="invisible">{children}</div>;
  }

  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      disableTransitionOnChange // Tambahkan ini agar tidak ada animasi aneh saat switch pertama kali
    >
      {children}
    </NextThemesProvider>
  );
}