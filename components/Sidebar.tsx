"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { IconBuilding, IconPercent, IconUsers, IconWallet } from "./icons";

const links = [
  { id: "ringkasan", label: "Ringkasan", icon: IconPercent },
  { id: "sebaran", label: "Sebaran PKL", icon: IconBuilding },
  { id: "pendapatan", label: "Pendapatan", icon: IconWallet },
  { id: "peserta", label: "Data peserta", icon: IconUsers },
];

export function Sidebar() {
  const [active, setActive] = useState("ringkasan");
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (visible.length) setActive(visible[0].target.id);
    }, { rootMargin: "-15% 0px -60% 0px" });
    // Sections arrive after the spreadsheet request finishes.
    const observed = new Set<Element>();
    const observe = () => links.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section && !observed.has(section)) {
        observer.observe(section);
        observed.add(section);
      }
    });
    observe();
    const mutation = new MutationObserver(observe);
    mutation.observe(document.body, { childList: true, subtree: true });
    return () => { observer.disconnect(); mutation.disconnect(); };
  }, []);

  return (
    <aside className="sidebar">
      <a href="#ringkasan" className="brand" aria-label="PKL Tracker, kembali ke ringkasan">
        <span className="brand-logo"><Image src="/idn.png" alt="IDN" width={38} height={38} priority /></span>
        <span><strong>PKL<span className="text-emerald-600">track</span><span className="text-emerald-500">.</span></strong><small>SMK IDN · Internship monitor</small></span>
      </a>
      <div className="sidebar-body">
        <p className="nav-caption">WORKSPACE</p>
        <nav aria-label="Navigasi dashboard" className="sidebar-nav">
          {links.map(({ id, label, icon: Icon }) => (
            <a key={id} href={`#${id}`} onClick={() => setActive(id)} className={`nav-link ${active === id ? "is-active" : ""}`} aria-current={active === id ? "location" : undefined}>
              <Icon /><span>{label}</span>{active === id && <span className="nav-dot" />}
            </a>
          ))}
        </nav>
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
