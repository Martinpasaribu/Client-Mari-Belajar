import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing'; // Jika di folder yang sama
// ATAU gunakan alias jika kamu sudah setup:
// import { routing } from '@/i18n/routing'; 

import { notFound } from 'next/navigation';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
