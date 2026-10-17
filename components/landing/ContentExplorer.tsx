"use client";

import { useState } from "react";
import Image from "next/image";
import type { PublicCompany, PublicPost } from "@/lib/public-types";

function EmptyContent({ unavailable, kind }: { unavailable: boolean; kind: string }) {
  return <div className="lp-empty"><span aria-hidden="true">↗</span><h3>{unavailable ? "Konten sedang tidak tersedia" : `${kind} segera hadir`}</h3><p>{unavailable ? "Silakan kunjungi kembali beberapa saat lagi." : "Cerita dan informasi terbaru akan tampil di sini setelah diterbitkan oleh sekolah."}</p></div>;
}

function MediaImage({ src, alt, className, width, height }: { src: string; alt: string; className: string; width: number; height: number }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className={`${className} lp-image-fallback`}>Gambar tidak tersedia</div>;
  return <Image src={src} alt={alt} width={width} height={height} className={className} unoptimized onError={() => setFailed(true)} />;
}

export function CompanyExplorer({ companies, unavailable }: { companies: PublicCompany[]; unavailable: boolean }) {
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("");
  const [expanded, setExpanded] = useState(false);
  const industries = [...new Set(companies.map((company) => company.industry).filter((value): value is string => Boolean(value)))].sort();
  const filtered = companies.filter((company) => (!industry || company.industry === industry) && [company.name, company.industry, company.location, company.description].join(" ").toLowerCase().includes(query.trim().toLowerCase()));
  if (!companies.length) return <EmptyContent unavailable={unavailable} kind="Profil perusahaan" />;
  return <>
    <div className="lp-explorer-controls"><label><span>Cari perusahaan</span><input type="search" placeholder="Nama, bidang, atau lokasi…" value={query} onChange={(event) => { setQuery(event.target.value); setExpanded(false); }} /></label><label><span>Bidang industri</span><select value={industry} onChange={(event) => { setIndustry(event.target.value); setExpanded(false); }}><option value="">Semua bidang</option>{industries.map((value) => <option key={value}>{value}</option>)}</select></label></div>
    <p className="lp-result-count" role="status">{filtered.length} perusahaan ditemukan</p>
    <div className="lp-company-grid">{(expanded ? filtered : filtered.slice(0, 6)).map((company) => <article key={company.id} className="lp-company"><div className="lp-company-top">{company.logoUrl ? <MediaImage src={company.logoUrl} alt={`Logo ${company.name}`} width={72} height={72} className="lp-company-logo" /> : <span className="lp-company-initial" aria-hidden="true">{company.name.slice(0, 1)}</span>}<span className="lp-chip">{company.industry || "Tempat PKL"}</span></div><h3>{company.name}</h3>{company.location && <p className="lp-company-location">↗ {company.location}</p>}<p>{company.description}</p>{company.website_url?.startsWith("https://") && <a href={company.website_url} target="_blank" rel="noreferrer">Website perusahaan <span aria-hidden="true">↗</span></a>}</article>)}</div>
    {!filtered.length && <div className="lp-empty"><h3>Perusahaan belum ditemukan</h3><button onClick={() => { setQuery(""); setIndustry(""); }}>Reset pencarian dan filter ↗</button></div>}
    {filtered.length > 6 && <button className="lp-more" onClick={() => setExpanded(!expanded)}>{expanded ? "Tampilkan lebih sedikit ↑" : `Lihat semua ${filtered.length} perusahaan ↓`}</button>}
  </>;
}

const categories: Record<string, string> = { kegiatan: "Kegiatan", visitasi: "Visitasi", "cerita-siswa": "Cerita siswa", karya: "Karya" };

export function DocumentationExplorer({ posts, unavailable }: { posts: PublicPost[]; unavailable: boolean }) {
  const [category, setCategory] = useState("");
  const filtered = posts.filter((post) => !category || post.category === category);
  if (!posts.length) return <EmptyContent unavailable={unavailable} kind="Dokumentasi kegiatan" />;
  return <><div className="lp-category-tabs" role="group" aria-label="Filter dokumentasi">{[["", "Semua cerita"], ...Object.entries(categories)].map(([key, label]) => <button key={key} aria-pressed={category === key} onClick={() => setCategory(key)}>{label}</button>)}</div><div className="lp-post-grid">{filtered.map((post) => <article className="lp-post" key={post.id}>{post.images[0] ? <MediaImage src={post.images[0].url} alt={post.images[0].alt} width={720} height={480} className="lp-post-cover" /> : <div className="lp-post-cover lp-story-cover" aria-hidden="true"><span>{categories[post.category] || "Cerita PKL"}</span><strong>Langkah nyata.<br />Cerita bermakna.</strong><span>SMK IDN BOGOR ↗</span></div>}<div className="lp-post-body"><div className="lp-post-meta"><span>{categories[post.category] || "Kegiatan"}</span>{post.occurred_on && <time dateTime={post.occurred_on}>{new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" }).format(new Date(`${post.occurred_on}T00:00:00+07:00`))}</time>}</div><h3>{post.title}</h3><p>{post.summary}</p><details><summary>Baca cerita <span aria-hidden="true">↗</span></summary><div className="lp-post-full">{post.body && <p>{post.body}</p>}{post.branch && <p>Cabang: {post.branch}</p>}{post.images.map((image) => <figure key={image.id}><MediaImage src={image.url} alt={image.alt} width={720} height={480} className="lp-detail-image" />{image.caption && <figcaption>{image.caption}</figcaption>}</figure>)}</div></details></div></article>)}</div>{!filtered.length && <p className="lp-empty" role="status">Belum ada dokumentasi pada kategori ini.</p>}</>;
}
