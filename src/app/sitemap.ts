/* eslint-disable @typescript-eslint/no-explicit-any */
import { routing } from "@/i18n/routing";
import type { MetadataRoute } from "next";

// 1. Arahkan ke URL Website kamu, bukan API
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://domain.com';

// Fungsi helper untuk fetch data (pastikan di-export atau diimpor dengan benar)
async function getAllCourses() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
      next: { revalidate: 3600 } // Cache selama 1 jam
    });
    const result = await res.json();
    return result.data || []; // Sesuaikan dengan struktur response API kamu
  } catch (error) {
    console.error("Sitemap Fetch Error:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await getAllCourses();

  // 2. Route Statis (Home Page untuk setiap bahasa)
  const staticRoutes: MetadataRoute.Sitemap = routing.locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  }));

  // 3. Route Dinamis (Courses)
  const courseRoutes: MetadataRoute.Sitemap = courses.flatMap((course: any) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}/category/${course.slug || course._id}`,
      lastModified: new Date(course.updatedAt || new Date()),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  );

  return [...staticRoutes, ...courseRoutes];
}