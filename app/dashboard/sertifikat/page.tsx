import type { Metadata } from "next";
import { UpcomingFeature } from "@/components/UpcomingFeature";

export const metadata: Metadata = { title: "Sertifikat PKL | PKLtrack" };

export default function Page() {
  return (
    <UpcomingFeature
      title="Sertifikat PKL"
      description="Ruang pengelolaan sertifikat hasil pelaksanaan PKL siswa."
      planned={["Pengelolaan template dan data sertifikat.", "Penyiapan sertifikat berdasarkan data siswa.", "Pengunduhan dan pencetakan sertifikat."]}
    />
  );
}
