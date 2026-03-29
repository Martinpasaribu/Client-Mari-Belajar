/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface AppIconProps {
  variant?: 'circle' | 'rectangle';
  size?: number; 
  width?: number; 
  height?: number; 
  className?: string;
}

export default function AppIcon({ 
  variant = 'circle', 
  size = 100, 
  width, 
  height, 
  className = "" 
}: AppIconProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Logika Dimensi Desktop
  const isCircle = variant === 'circle';
  const finalWidth = isCircle ? size : (width || 150);
  const finalHeight = isCircle ? size : (height || 40);

  if (!mounted) {
    return <div style={{ width: finalWidth, height: finalHeight }} className={className} />;
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`relative md:w-30 flex items-center justify-center ${isCircle ? 'overflow-hidden' : ''}`}
        style={{ 
          // Perbaikan: Gunakan tinggi yang lebih kecil di mobile (misal 45px) 
          // agar tidak "meledak" atau melebihi elemen induk/navbar.
          // width: isCircle ? '45px' : 'auto', 
          height: '50px', 
          minWidth: isCircle ? '55px' : '55px',
          aspectRatio: isCircle ? '1/1' : 'auto' 
        }}
      >
        <style jsx>{`
          @media (min-width: 768px) {
            .logo-container {
              width: ${finalWidth}px !important;
              height: ${finalHeight}px !important;
            }
          }
        `}</style>
        
        <div className="logo-container w-full h-full relative flex items-center justify-center">
          
          {/* 1. LIGHT MODE LOGO (Desktop Only) */}
          <div className="hidden md:flex dark:md:hidden items-center justify-center w-full h-full">
            <Image 
              src="/assets/image/logo/icon-light.png" 
              alt="Logo Light" 
              fill 
              priority
              sizes={`${finalWidth}px`}
              // Menggunakan object-contain agar logo teks tidak terpotong jika container terbatas
              className="object-contain transition-all"
            />
          </div>

          {/* 2. DARK MODE LOGO (Desktop Only) */}
          <div className="hidden dark:md:flex items-center justify-center w-full h-full">
            <Image 
              src="/assets/image/logo/icon-dark.png" 
              alt="Logo Dark" 
              fill
              priority
              sizes={`${finalWidth}px`}
              className="object-contain transition-all"
            />
          </div>

          {/* 3. MOBILE LOGO (Mobile Only - Light) */}        
          <div className="flex md:hidden dark:hidden items-center justify-center w-full h-full">
            <Image 
              src="/assets/image/logoBase/main/IconBase1.png" 
              alt="Logo Light Mobile" 
              fill 
              priority
              sizes="45px"
              className="object-contain transition-all"
            />
          </div>

          {/* 4. MOBILE LOGO (Mobile Only - Dark) */}  
          <div className="hidden dark:flex dark:md:hidden items-center justify-center w-full h-full">
            <Image 
              src="/assets/image/logoBase/main/IconBase2.png" 
              alt="Logo Dark Mobile" 
              fill 
              priority
              sizes="45px"
              className="object-contain transition-all"
            />
          </div>

        </div>
      </div>
    </div>
  );
}