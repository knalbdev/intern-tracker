import type { Metadata } from "next";
import { Dashboard } from "@/components/Dashboard";

export const metadata: Metadata = { title: "Sebaran PKL | PKLtrack" };

export default function Page() {
  return <Dashboard view="sebaran" />;
}
