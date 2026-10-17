import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CompanyExplorer, DocumentationExplorer } from "@/components/landing/ContentExplorer";
import { getPublicContent, publicMediaUrl } from "@/lib/public-content";
import type { PublicPost } from "@/lib/public-types";
import "./landing.css";

export const metadata: Metadata = {
  title: "PKL SMK IDN Bogor | Dari ruang belajar ke dunia profesional",
  description: "Kenali program Praktik Kerja Lapangan SMK IDN Bogor: RPL, TKJ, DKV, pendampingan industri, perusahaan tempat PKL, dan cerita siswa.",
};

export const revalidate = 300;

const majors = [
  { number: "01", code: "RPL", icon: "</>", title: "Rekayasa Perangkat Lunak", text: "Mengubah ide menjadi solusi digital. Menerapkan keterampilan pengembangan perangkat lunak melalui pengalaman langsung di industri.", tags: ["Pengembangan aplikasi", "Pemecahan masalah"] },
  { number: "02", code: "TKJ", icon: "⌘", title: "Teknik Komputer Jaringan", text: "Menghubungkan teknologi dan kebutuhan nyata. Mengembangkan kompetensi infrastruktur jaringan dan teknologi di lingkungan profesional.", tags: ["Infrastruktur", "Jaringan komputer"] },
  { number: "03", code: "DKV", icon: "✳", title: "Desain Komunikasi Visual", text: "Memberi bentuk pada gagasan. Menerapkan keterampilan desain komunikasi visual untuk menjawab kebutuhan kreatif dunia industri.", tags: ["Komunikasi visual", "Proses kreatif"] },
];
const journey = [
  ["Temukan tempat yang tepat", "Siswa mencari dan mengajukan tempat PKL dengan bidang usaha yang sesuai kompetensi keahliannya."],
  ["Mulai pengalaman nyata", "Pelaksanaan mengikuti kontrak dengan industri, dengan masa kontrak minimal tiga bulan."],
  ["Tumbuh bersama pembimbing", "Pembimbing sekolah dan industri mendampingi proses belajar melalui komunikasi aktif, monitoring, dan evaluasi."],
  ["Bawa pulang karya & cerita", "Jurnal, laporan akhir, cerita PKL, dan portofolio merekam perjalanan serta kompetensi yang berkembang."],
];
const faqs = [
  ["Apa tujuan program PKL di SMK IDN Bogor?", "PKL menghubungkan pembelajaran sekolah dengan pengalaman kerja nyata. Program ini mengembangkan kompetensi teknis, sikap profesional, disiplin, tanggung jawab, kemandirian, serta kesiapan untuk bekerja atau berwirausaha."],
  ["Bidang keahlian apa saja yang mengikuti program?", "Program mencakup Rekayasa Perangkat Lunak (RPL), Teknik Komputer Jaringan (TKJ), dan Desain Komunikasi Visual (DKV). Bidang perusahaan serta tugas PKL harus sesuai dengan kompetensi keahlian siswa."],
  ["Bagaimana ketentuan kontrak PKL?", "Pedoman menetapkan masa kontrak minimal tiga bulan. Pelaksanaan dan kelanjutan PKL mengikuti ketentuan sekolah serta kontrak yang disepakati dengan industri. Jadwal rinci dapat dikonfirmasi kepada pembimbing sekolah."],
  ["Apakah siswa tetap mendapat pendampingan sekolah?", "Ya. Siswa mendapat pembimbing sekolah dan industri, visitasi guru pembimbing minimal satu kali, pertemuan daring pekanan, dan evaluasi bulanan. Siswa wajib menjaga komunikasi aktif dengan pembimbing."],
  ["Apa saja laporan dan tugas selama PKL?", "Siswa mengisi jurnal pekanan dan menyusun laporan akhir dengan dokumentasi yang relevan. Tugas pembinaan juga meliputi buku cerita PKL, buku tahunan, pembaruan portofolio, serta tugas lain yang ditetapkan sekolah."],
];

export default async function Home() {
  const { sections, companies, posts } = await getPublicContent();
  const about = sections.items.find((section) => section.slug === "tentang-program");
  const additionalSections = sections.items.filter((section) => section.slug !== "tentang-program");
  const publicCompanies = companies.items.map(({ logo_path, ...company }) => ({ ...company, logoUrl: publicMediaUrl(logo_path) }));
  const publicPosts: PublicPost[] = posts.items.map(({ documentation_images, ...post }) => ({
    ...post,
    images: [...(documentation_images || [])].sort((a, b) => a.sort_order - b.sort_order).flatMap((image) => {
      const url = publicMediaUrl(image.media_path);
      return url ? [{ id: image.id, url, alt: image.alt_text, caption: image.caption }] : [];
    }),
  }));

  return (
    <div id="top" className="lp">
      <a href="#program" className="lp-skip">Lewati navigasi</a>
      <header className="lp-header">
        <Link href="/" className="lp-brand" aria-label="Beranda PKL SMK IDN Bogor"><Image src="/idn.png" alt="Logo IDN" width={42} height={42} priority /><span>PKL<span className="lp-brand-light">track</span><b>.</b><small>SMK IDN BOGOR</small></span></Link>
        <nav className="lp-nav" aria-label="Navigasi utama"><a href="#program">Program PKL</a><a href="#keahlian">Bidang keahlian</a><a href="#perusahaan">Perusahaan</a><a href="#dokumentasi">Dokumentasi</a><a href="#kontak">Kontak</a></nav>
        <Link href="/dashboard" className="lp-dashboard-link">Dashboard PKL <span aria-hidden="true">↗</span></Link>
        <details className="lp-mobile-menu"><summary>Menu <span aria-hidden="true">☰</span></summary><nav aria-label="Navigasi ponsel"><a href="#program">Program PKL</a><a href="#keahlian">Bidang keahlian</a><a href="#perusahaan">Perusahaan</a><a href="#dokumentasi">Dokumentasi</a><a href="#kontak">Kontak</a><a href="#faq">Tanya jawab</a></nav></details>
      </header>
      <main>
        <section className="lp-hero lp-container">
          <div className="lp-hero-copy"><div className="lp-eyebrow"><span className="lp-live-dot" /> PRAKTIK KERJA LAPANGAN · 2026/2027</div><h1>Dari ruang<br />belajar, ke dunia<br /><em>profesional.</em><span className="lp-hero-asterisk" aria-hidden="true">✳</span></h1><p>Pengalaman nyata. Kompetensi yang bertumbuh.<br />Langkah pertama siswa SMK IDN Bogor untuk berkarya, beradaptasi, dan memberi arti di dunia industri.</p><div className="lp-hero-actions"><a href="#program" className="lp-button">Kenali program kami <span aria-hidden="true">↗</span></a><a href="#dokumentasi" className="lp-text-link">Jelajahi cerita PKL <span aria-hidden="true">↓</span></a></div><div className="lp-hero-footnote"><span className="lp-mini-mark" aria-hidden="true">IDN</span><p>Pembelajaran di sekolah.<br /><strong>Pengalaman di dunia nyata.</strong></p></div></div>
          <div className="lp-art" role="img" aria-label="Ilustrasi perjalanan kompetensi RPL, TKJ, dan DKV menuju pengalaman profesional">
            <div className="lp-art-grid" /><div className="lp-art-orbit" /><span className="lp-art-label">YOUR NEXT CHAPTER</span><span className="lp-art-spark" aria-hidden="true">✳</span>
            <div className="lp-art-code"><div><i /><i /><i /><span>learn. build. grow.</span></div><p><span>const</span> masaDepan = &#123;<br />&nbsp; bekal: <b>&apos;kompetensi&apos;</b>,<br />&nbsp; langkah: <b>&apos;pengalaman&apos;</b>,<br />&nbsp; tujuan: <b>&apos;berkarya&apos;</b><br />&#125;;</p><footer><span>RPL</span> IDE MENJADI SOLUSI ↗</footer></div>
            <div className="lp-art-design"><span>DKV / VISUAL THINKING</span><div className="lp-design-shapes"><i /><b /><em /></div><strong>Make it<br /><em>meaningful.</em></strong></div>
            <div className="lp-art-network"><span className="lp-network-icon" aria-hidden="true">⌘</span><div><b>Terhubung.<br />Siap bertumbuh.</b><span>TKJ / CONNECTING POSSIBILITIES</span></div></div>
            <div className="lp-art-caption"><span>01 — 03</span><span>TIGA KEAHLIAN. SATU SEMANGAT.</span><span aria-hidden="true">↗</span></div>
          </div>
        </section>
        <div className="lp-value-strip"><div className="lp-container"><span><b>03</b> Bidang keahlian</span><span><i aria-hidden="true">↗</i> Pengalaman industri nyata</span><span><i aria-hidden="true">◎</i> Pendampingan berkelanjutan</span><span><i aria-hidden="true">✳</i> Kompetensi & karakter</span></div></div>
        <section id="program" className="lp-about lp-container lp-section"><div><p className="lp-eyebrow">01 / TENTANG PROGRAM</p><h2>Belajar lebih jauh.<br />Melangkah <em>lebih siap.</em></h2><a href="#perjalanan" className="lp-text-link">Lihat perjalanan PKL <span aria-hidden="true">↘</span></a></div><div className="lp-about-copy"><span className="lp-overline">MENJEMBATANI SEKOLAH DAN INDUSTRI</span><h3>{about?.title || "Pengalaman yang membentuk masa depan."}</h3><p>{about?.body || "Praktik Kerja Lapangan SMK IDN Bogor memberi siswa kesempatan menerapkan ilmu di lingkungan industri yang sesungguhnya. Melalui pengalaman langsung, siswa mengembangkan keterampilan profesional sekaligus karakter yang disiplin, bertanggung jawab, dan berintegritas."}</p><div className="lp-about-values"><div><span>01</span><strong>Kompetensi nyata</strong><p>Menerapkan keahlian pada kebutuhan industri.</p></div><div><span>02</span><strong>Karakter profesional</strong><p>Belajar mandiri, berkolaborasi, dan bertanggung jawab.</p></div></div></div></section>
        <section id="keahlian" className="lp-majors-wrap"><div className="lp-container lp-section"><div className="lp-section-heading"><div><p className="lp-eyebrow">02 / BIDANG KEAHLIAN</p><h2>Beda keahlian.<br /><em>Sama-sama berdampak.</em></h2></div><p>Setiap siswa membawa potensinya sendiri.<br />Industri menjadi ruang untuk mengembangkannya.</p></div><div className="lp-major-grid">{majors.map((major) => <article className="lp-major" key={major.code}><div className="lp-major-top"><span>{major.number} / {major.code}</span><b aria-hidden="true">{major.icon}</b></div><h3>{major.title}</h3><p>{major.text}</p><div className="lp-major-tags">{major.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></article>)}</div></div></section>
        <section id="perjalanan" className="lp-container lp-section"><div className="lp-section-heading"><div><p className="lp-eyebrow">03 / PERJALANAN PKL</p><h2>Setiap langkah,<br /><em>punya makna.</em></h2></div><p>Belajar tidak berhenti di kelas.<br />Di sinilah pengalaman baru dimulai.</p></div><div className="lp-journey">{journey.map(([title, text], index) => <article key={title}><span className="lp-step">0{index + 1}<span aria-hidden="true">↗</span></span><h3>{title}</h3><p>{text}</p></article>)}</div><div className="lp-mentoring"><span className="lp-mentoring-symbol" aria-hidden="true">◎</span><div><p className="lp-eyebrow">TUMBUH, TANPA BERJALAN SENDIRI</p><h3>Ada pembimbing di setiap prosesnya.</h3><p>Pembimbing sekolah dan industri, jurnal pekanan, pertemuan daring mingguan, serta evaluasi bulanan mendampingi perkembangan siswa.</p></div><a href="#faq" className="lp-text-link">Tentang pendampingan <span aria-hidden="true">↗</span></a></div></section>
        <section id="perusahaan" className="lp-companies-wrap"><div className="lp-container lp-section"><div className="lp-section-heading"><div><p className="lp-eyebrow">04 / PERUSAHAAN TEMPAT PKL</p><h2>Ruang bertumbuh.<br /><em>Kesempatan berkarya.</em></h2></div><p>Kenali perusahaan tempat siswa<br />mendapatkan pengalaman profesional.</p></div><CompanyExplorer companies={publicCompanies} unavailable={companies.unavailable} /></div></section>
        <section id="dokumentasi" className="lp-container lp-section"><div className="lp-section-heading"><div><p className="lp-eyebrow">05 / DOKUMENTASI & CERITA</p><h2>Di balik pengalaman,<br /><em>ada cerita.</em></h2></div><p>Catatan perjalanan, kegiatan, dan karya.<br />Langsung dari proses belajar di dunia nyata.</p></div><DocumentationExplorer posts={publicPosts} unavailable={posts.unavailable} /></section>
        <section id="faq" className="lp-faq-wrap"><div className="lp-container lp-section lp-faq"><div><p className="lp-eyebrow">06 / TANYA JAWAB</p><h2>Kenali programnya.<br /><em>Siapkan langkahmu.</em></h2><p>Informasi program merujuk pada pedoman PKL<br />SMK IDN Bogor tahun ajaran 2026/2027.</p></div><div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div>{additionalSections.length > 0 && <div className="lp-container lp-program-details"><h3>Informasi program selengkapnya</h3>{additionalSections.map((section) => <details key={section.id}><summary>{section.title}<span aria-hidden="true">+</span></summary><p>{section.body}</p></details>)}</div>}</section>
        <section id="kontak" className="lp-container lp-section lp-contact">
          <div><p className="lp-eyebrow">07 / HUBUNGI KAMI</p><h2>Mari terhubung.<br /><em>Buka peluang bersama.</em></h2><p>Informasi program dan kerja sama PKL SMK IDN Bogor.</p></div>
          <a href="mailto:internship@idn.sch.id" className="lp-button">internship@idn.sch.id <span aria-hidden="true">↗</span></a>
        </section>
        <section className="lp-container lp-cta"><div><p className="lp-eyebrow">PENGALAMAN HARI INI. BEKAL UNTUK ESOK.</p><h2>Satu langkah nyata.<br /><em>Banyak kemungkinan.</em></h2></div><div><p>Ikuti perkembangan program PKL<br />melalui dashboard pemantauan.</p><Link href="/dashboard" className="lp-button">Buka dashboard PKL <span aria-hidden="true">↗</span></Link></div><span className="lp-cta-spark" aria-hidden="true">✳</span></section>
      </main>
      <footer className="lp-footer lp-container"><Link href="/" className="lp-brand"><Image src="/idn.png" alt="IDN" width={34} height={34} /><span>PKL<span className="lp-brand-light">track</span><b>.</b><small>SMK IDN BOGOR</small></span></Link><p>Kompetensi. Karakter. Pengalaman nyata.</p><a href="mailto:internship@idn.sch.id">internship@idn.sch.id ↗</a><a href="#top">Kembali ke atas ↑</a><small>Program PKL · Tahun ajaran 2026/2027</small></footer>
    </div>
  );
}
