import { routing } from "@/i18n/routing";
import { getAllCourses } from "@/lib/db";
import type { MetadataRoute } from "next";

const baseUrl = "https://yourdomain.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await getAllCourses();

  const staticRoutes = routing.locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
  }));

  const courseRoutes = courses.flatMap((course) =>
    routing.locales.map((locale) => ({
      url: `${baseUrl}/${locale}/courses/${course.slug}`,
      lastModified: course.updatedAt ?? new Date(),
    }))
  );

  return [...staticRoutes, ...courseRoutes];
}
