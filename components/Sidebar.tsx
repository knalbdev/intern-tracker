"use client";

import { useEffect, useRef, useState } from "react";
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
  const dialog = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => dialog.current?.close();

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [menuOpen]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const handleResize = () => { if (desktop.matches) dialog.current?.close(); };
    desktop.addEventListener("change", handleResize);
    return () => desktop.removeEventListener("change", handleResize);
  }, []);

  const brand = (
    <Link href="/dashboard" className="brand" onClick={closeMenu} aria-label="PKL Tracker, kembali ke ringkasan">
      <span className="brand-logo"><Image src="/idn.png" alt="IDN" width={38} height={38} priority /></span>
      <span><strong>PKL<span className="text-emerald-600">track</span><span className="text-emerald-500">.</span></strong><small>SMK IDN · Internship monitor</small></span>
    </Link>
  );

  const navigation = (
    <>
      <div className="sidebar-body">
        <p className="nav-caption">WORKSPACE</p>
        <nav aria-label="Navigasi dashboard" className="sidebar-nav">
          {links.map(({ href, label, icon: Icon, developing }) => (
            <Link key={href} href={href} onClick={closeMenu} className={`nav-link ${pathname === href ? "is-active" : ""}`} aria-current={pathname === href ? "page" : undefined}>
              <Icon /><span className="min-w-0 flex-1">{label}</span>{developing ? <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-medium text-amber-700" aria-label="Masih dikembangkan">Dev</span> : pathname === href && <span className="nav-dot" />}
            </Link>
          ))}
        </nav>
        <Link href="/" onClick={closeMenu} className="nav-link mt-5">← Kembali ke beranda</Link>
        <div className="sidebar-note">
          <span className="text-xl text-emerald-600"><IconBuilding /></span>
          <h3>Langkah kecil hari ini.<br />Masa depan yang besar.</h3>
          <p>Pantau perjalanan siswa menuju dunia profesional.</p>
          <a href="https://docs.google.com/spreadsheets/d/1OLl6dywYVx_I_I3sinI5MY-38VTrimp3WaEZ4cCWPJQ" target="_blank" rel="noreferrer">Buka spreadsheet <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className="sidebar-footer"><span className="school-avatar">IDN</span><span><strong>SMK IDN</strong><small>Boarding School</small></span><span className="ml-auto text-slate-400">↗</span></div>
    </>
  );

  return (
    <>
      <aside className="sidebar desktop-sidebar">{brand}{navigation}</aside>
      <div className="mobile-navigation">
        {brand}
        <button type="button" className="mobile-menu-button" aria-label="Buka menu dashboard" aria-haspopup="dialog" aria-expanded={menuOpen} aria-controls="dashboard-mobile-menu" onClick={() => { dialog.current?.showModal(); setMenuOpen(true); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          <span>Menu</span>
        </button>
      </div>
      <dialog ref={dialog} id="dashboard-mobile-menu" className="mobile-drawer" aria-label="Menu dashboard" onClose={() => setMenuOpen(false)} onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeMenu();
      }}>
        <div className="mobile-drawer-heading"><span>Menu dashboard</span><button type="button" className="mobile-close-button" onClick={closeMenu} aria-label="Tutup menu dashboard"><span aria-hidden="true">×</span></button></div>
        {navigation}
      </dialog>
    </>
  );
}
