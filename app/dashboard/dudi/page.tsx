import type { Metadata } from "next";
import { Dashboard } from "@/components/Dashboard";

export const metadata: Metadata = { title: "Data DUDI & Mitra | PKLtrack" };

export default function Page() {
  return <Dashboard view="dudi" />;
}
