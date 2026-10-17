"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { IconBuilding, IconPercent, IconUsers, IconWallet } from "./icons";

const links = [
  { href: "/dashboard", label: "Ringkasan", icon: IconPercent },
  { href: "/dashboard/sebaran", label: "Sebaran PKL", icon: IconBuilding },
  { href: "/dashboard/pendapatan", label: "Pendapatan", icon: IconWallet },
  { href: "/dashboard/peserta", label: "Data peserta", icon: IconUsers },
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
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`nav-link ${pathname === href ? "is-active" : ""}`} aria-current={pathname === href ? "page" : undefined}>
              <Icon /><span>{label}</span>{pathname === href && <span className="nav-dot" />}
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
