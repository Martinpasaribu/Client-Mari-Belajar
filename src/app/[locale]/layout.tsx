import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../styles/globals.css";
import Navbar from "@/provider/layout/Navbar";
import { ThemeProvider } from "@/provider/tools/ThemeProvider";
import { ToastProvider } from "@/context/ToastContext";
// --- Tambahkan Import Ini ---
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { getTranslations } from 'next-intl/server';
import LayoutWrapper from "@/provider/layout/LayoutWrapper";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {

  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: 'Metadata'
  });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      languages: {
        id: '/id',
        en: '/en'
      }
    }
  };
}


export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {

  const { locale } = await params;

if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
  notFound();
}


  const messages = await getMessages({ locale }); // ⬅️ PENTING

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
          >
            <ToastProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </ToastProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}