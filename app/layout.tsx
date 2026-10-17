import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PKL SMK IDN Bogor",
  icons: {
    icon: "/idn.png?v=idn",
    shortcut: "/favicon.ico?v=idn",
    apple: "/apple-touch-icon.png?v=idn",
  },
  description: "Program Praktik Kerja Lapangan SMK IDN Bogor — kompetensi, karakter, dan pengalaman nyata di dunia industri.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
