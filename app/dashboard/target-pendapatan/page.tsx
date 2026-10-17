import type { Metadata } from "next";
import { Dashboard } from "@/components/Dashboard";

export const metadata: Metadata = { title: "Target Pendapatan Rp20 Juta | PKLtrack" };

export default function Page() {
  return <Dashboard view="target" />;
}
