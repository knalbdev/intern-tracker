import type { Metadata } from "next";
import { Dashboard } from "@/components/Dashboard";

export const metadata: Metadata = { title: "Pendapatan | PKLtrack" };

export default function Page() {
  return <Dashboard view="pendapatan" />;
}
