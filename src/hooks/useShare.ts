/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
export const useShareLogic = (data: any) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const attemptId = data?.attemptId || data?.id;
  const previewPath = `/attempt/result/${attemptId}`;
  
  // Link Murni
  const shareUrl = `${baseUrl}${previewPath}`;

  // Teks Promosi (hanya untuk WA/Twitter)
  const shareText = `🔥 Hasil Latihan di Mari Belajar!\n\n` +
    `📖 Materi: ${data.babName}\n` +
    `🎯 Skor: ${data.score}/100\n` +
    `🏆 Predikat: "${data.rating}"\n\n` +
    `Ayo asah kemampuanmu juga! 🚀`;

  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);

  const socialLinks = {
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    // Instagram & TikTok tidak support text via URL, diarahkan ke profil atau buka app
    instagram: `https://www.instagram.com/`,
    tiktok: `https://www.tiktok.com/`,
  };

  return { 
    shareUrl, // Ini hanya link saja
    socialLinks, 
    combined: `${shareText}\n\nLink: ${shareUrl}` 
  };
};