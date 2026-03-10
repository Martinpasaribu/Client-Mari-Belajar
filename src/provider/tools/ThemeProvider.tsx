/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mencegah flash of unstyled content (FOUC)
  // return <div className="invisible">{children}</div> sudah benar untuk mencegah kedipan putih
  if (!mounted) {
    return <div className="invisible">{children}</div>;
  }

  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem={true} // Pastikan ini eksplisit true
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}