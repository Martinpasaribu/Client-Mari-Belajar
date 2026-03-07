import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/db";

/* =========================
   METADATA FUNCTION
========================= */
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) return {};

  const title = course.title[locale] ?? course.title["en"];
  const description =
    course.description[locale] ?? course.description["en"];

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
          url: course.thumbnail, // dari database
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
      images: [course.thumbnail]
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

  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return (
    <div>
      <h1>{course.title[locale]}</h1>
      <p>{course.description[locale]}</p>
    </div>
  );
}
