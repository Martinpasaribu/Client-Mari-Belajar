import { getCourseBySlug } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";

/* =========================
   METADATA FUNCTION
========================= */
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params;
  
  // Validasi slug untuk mencegah fetch dengan nilai "undefined"
  if (!slug || slug === 'undefined') return { title: "Course Not Found" };

  const course = await getCourseBySlug(slug);

  if (!course) return { title: "Course Not Found" };

  // Safety Check: Gunakan Optional Chaining agar tidak error jika title[locale] kosong
  const title = course.title?.[locale] ?? course.title?.["en"] ?? course.name ?? "Course Detail";
  const description = course.description?.[locale] ?? course.description?.["en"] ?? "";
  const imageUrl = course.thumbnail || "https://yourdomain.com/default-og.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://yourdomain.com/${locale}/courses/${slug}`,
      siteName: "My Course App",
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl]
    }
  };
}

/* =========================
   PAGE COMPONENT
========================= */
export default async function CoursePage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params;

  // Pastikan slug ada sebelum query
  if (!slug || slug === 'undefined') notFound();

  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      {/* Gunakan fallback agar tidak error "Cannot read property of undefined" */}
      <h1 className="text-3xl font-black uppercase italic tracking-tighter">
        {course.title?.[locale] ?? course.title?.['en'] ?? course.name}
      </h1>
      
      <div className="mt-4 text-slate-600 leading-relaxed">
        {course.description?.[locale] ?? course.description?.['en'] ?? "No description available."}
      </div>
    </main>
  );
}