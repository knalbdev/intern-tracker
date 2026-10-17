export type ProgramSection = { id: string; slug: string; title: string; body: string; sort_order: number };
export type Company = {
  id: string;
  name: string;
  industry: string | null;
  location: string | null;
  website_url: string | null;
  description: string;
  logo_path: string | null;
};
export type DocumentationPost = {
  id: string;
  title: string;
  summary: string;
  body: string;
  category: string;
  branch: string | null;
  occurred_on: string | null;
  documentation_images: { id: string; media_path: string; alt_text: string; caption: string | null; sort_order: number }[];
};
export type PublicCompany = Omit<Company, "logo_path"> & { logoUrl: string | null };
export type PublicPost = Omit<DocumentationPost, "documentation_images"> & {
  images: { id: string; url: string; alt: string; caption: string | null }[];
};
