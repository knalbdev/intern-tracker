import "server-only";
import type { Company, DocumentationPost, ProgramSection } from "./public-types";

export type ContentResult<T> = { items: T[]; unavailable: boolean };

async function readPublished<T>(table: string, params: Record<string, string>): Promise<ContentResult<T>> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!base || !key) return { items: [], unavailable: true };

  try {
    const url = new URL(`/rest/v1/${table}`, base);
    url.search = new URLSearchParams({ ...params, is_published: "eq.true" }).toString();
    const response = await fetch(url, {
      headers: { apikey: key },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.error(`[public-content] ${table}: HTTP ${response.status}`);
      return { items: [], unavailable: true };
    }
    const items: unknown = await response.json();
    if (!Array.isArray(items)) return { items: [], unavailable: true };
    return { items: items as T[], unavailable: false };
  } catch {
    // Do not log credentials, request URLs, or database error bodies.
    console.error(`[public-content] ${table}: request unavailable`);
    return { items: [], unavailable: true };
  }
}

export async function getPublicContent() {
  const [sections, companies, posts] = await Promise.all([
    readPublished<ProgramSection>("content_sections", {
      select: "id,slug,title,body,sort_order",
      academic_year: "eq.2026/2027",
      order: "sort_order.asc",
    }),
    readPublished<Company>("companies", {
      select: "id,name,industry,location,website_url,description,logo_path",
      order: "name.asc",
    }),
    readPublished<DocumentationPost>("documentation_posts", {
      select: "id,title,summary,body,category,branch,occurred_on,documentation_images(id,media_path,alt_text,caption,sort_order)",
      academic_year: "eq.2026/2027",
      order: "occurred_on.desc.nullslast,created_at.desc",
      limit: "12",
    }),
  ]);
  return { sections, companies, posts };
}

export function publicMediaUrl(path: string | null): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base || !path) return null;
  // Database values are storage paths, never arbitrary external image URLs.
  const segments = path.split("/");
  if (segments.some((part) => !part || part === "." || part === "..") || path.includes(":")) return null;
  try {
    return new URL(`/storage/v1/object/public/site-media/${segments.map(encodeURIComponent).join("/")}`, base).toString();
  } catch {
    return null;
  }
}
