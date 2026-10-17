"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { IconBuilding, IconCheck, IconPercent, IconUsers, IconWallet } from "./icons";

const links: { href: string; label: string; icon: typeof IconUsers; developing?: boolean }[] = [
  { href: "/dashboard", label: "Ringkasan", icon: IconPercent },
  { href: "/dashboard/sebaran", label: "Sebaran PKL", icon: IconBuilding },
  { href: "/dashboard/pendapatan", label: "Pendapatan", icon: IconWallet },
  { href: "/dashboard/target-pendapatan", label: "Target Rp20 juta", icon: IconCheck },
  { href: "/dashboard/target-gaji", label: "Gaji ≥ Rp2 juta", icon: IconWallet },
  { href: "/dashboard/dudi", label: "Data DUDI & Mitra", icon: IconBuilding },
  { href: "/dashboard/peserta", label: "Data peserta", icon: IconUsers },
  { href: "/dashboard/wali-kelas", label: "Manajemen Wali Kelas", icon: IconUsers, developing: true },
  { href: "/dashboard/penilaian", label: "Penilaian PKL", icon: IconCheck, developing: true },
  { href: "/dashboard/sertifikat", label: "Sertifikat PKL", icon: IconPercent, developing: true },
  { href: "/dashboard/mou", label: "MoU", icon: IconBuilding, developing: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/dashboard" className="brand" aria-label="PKL Tracker, kembali ke ringkasan">
        <span className="brand-logo"><Image src="/idn.png" alt="IDN" width={38} height={38} priority /></span>
        <span><strong>PKL<span className="text-emerald-600">track</span><span className="text-emerald-500">.</span></strong><small>SMK IDN · Internship monitor</small></span>
      </Link>
      <div className="sidebar-body">
        <p className="nav-caption">WORKSPACE</p>
        <nav aria-label="Navigasi dashboard" className="sidebar-nav">
          {links.map(({ href, label, icon: Icon, developing }) => (
            <Link key={href} href={href} className={`nav-link ${pathname === href ? "is-active" : ""}`} aria-current={pathname === href ? "page" : undefined}>
              <Icon /><span className="min-w-0 flex-1">{label}</span>{developing ? <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-medium text-amber-700" aria-label="Masih dikembangkan">Dev</span> : pathname === href && <span className="nav-dot" />}
            </Link>
          ))}
        </nav>
        <Link href="/" className="nav-link mt-5">← Kembali ke beranda</Link>
        <div className="sidebar-note">
          <span className="text-xl text-emerald-600"><IconBuilding /></span>
          <h3>Langkah kecil hari ini.<br />Masa depan yang besar.</h3>
          <p>Pantau perjalanan siswa menuju dunia profesional.</p>
          <a href="https://docs.google.com/spreadsheets/d/1OLl6dywYVx_I_I3sinI5MY-38VTrimp3WaEZ4cCWPJQ" target="_blank" rel="noreferrer">Buka spreadsheet <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className="sidebar-footer"><span className="school-avatar">IDN</span><span><strong>SMK IDN</strong><small>Boarding School</small></span><span className="ml-auto text-slate-400">↗</span></div>
    </aside>
  );
}
