// lib/api.ts (atau ganti nama jadi db.ts jika kamu mau tetap pakai nama itu)

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCourseBySlug(slug: string) {
  try {
    const res = await fetch(`${API_URL}/catalogs/slug/${slug}`, {
      next: { revalidate: 3600 } // Cache data selama 1 jam
    });
    
    if (!res.ok) return null;
    
    const result = await res.json();
    return result.data; // Sesuaikan dengan struktur JSON API kamu
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}