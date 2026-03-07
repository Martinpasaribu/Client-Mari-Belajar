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

  // Logika Dimensi
  const isCircle = variant === 'circle';
  const finalWidth = isCircle ? size : (width || 150);
  const finalHeight = isCircle ? size : (height || 40);

  if (!mounted) {
    return <div style={{ width: finalWidth, height: finalHeight }} className={className} />;
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        style={{ 
          width: finalWidth, 
          height: finalHeight,
          aspectRatio: isCircle ? '1/1' : 'auto' 
        }} 
        className={`relative flex items-center justify-center ${isCircle ? 'overflow-hidden rounded-full' : ''}`}
      >
        {/* LIGHT MODE LOGO */}
        <div className="dark:hidden flex items-center justify-center w-full h-full">
          <Image 
            src="/assets/image/logo/icon-light.png" 
            alt="Logo Light" 
            fill // Menggunakan fill agar mengikuti ukuran kontainer div
            priority
            sizes={`${finalWidth}px`}
            className={`${isCircle ? 'object-cover' : 'object-contain'} transition-all`}
          />
        </div>

        {/* DARK MODE LOGO */}
        <div className="hidden dark:flex items-center justify-center w-full h-full">
          <Image 
            src="/assets/image/logo/icon-dark.png" 
            alt="Logo Dark" 
            fill
            priority
            sizes={`${finalWidth}px`}
            className={`${isCircle ? 'object-cover' : 'object-contain'} transition-all`}
          />
        </div>
      </div>
    </div>
  );
}