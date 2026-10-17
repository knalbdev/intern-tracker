import type { Metadata } from "next";
import { Dashboard } from "@/components/Dashboard";

export const metadata: Metadata = { title: "Ringkasan PKL | PKLtrack" };

export default function Page() {
  return <Dashboard />;
}
