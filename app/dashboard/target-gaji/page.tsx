import type { Metadata } from "next";
import { Dashboard } from "@/components/Dashboard";

export const metadata: Metadata = { title: "Target Gaji Rp2 Juta | PKLtrack" };

export default function Page() {
  return <Dashboard view="gaji" />;
}
