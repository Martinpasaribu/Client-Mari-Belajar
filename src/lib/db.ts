export async function getCourseBySlug(slug: string) {
  // 1. Validasi awal: Jangan fetch jika slug tidak ada
  if (!slug || slug === 'undefined') {
    console.error("getCourseBySlug: Slug is missing");
    return null;
  }

  // 2. Pastikan base URL memiliki protokol https://
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.startsWith('http')
    ? process.env.NEXT_PUBLIC_API_URL
    : `https://${process.env.NEXT_PUBLIC_API_URL}`;

  try {
    const res = await fetch(`${baseUrl}/catalogs/slug/${slug}`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) return null;
    
    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}