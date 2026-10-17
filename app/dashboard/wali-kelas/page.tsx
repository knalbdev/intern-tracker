import type { Metadata } from "next";
import { UpcomingFeature } from "@/components/UpcomingFeature";

export const metadata: Metadata = { title: "Manajemen Wali Kelas | PKLtrack" };

export default function Page() {
  return (
    <UpcomingFeature
      title="Manajemen Wali Kelas"
      description="Ruang pengelolaan wali kelas dan pendampingan siswa PKL."
      planned={["Pengelolaan data wali kelas.", "Pemetaan wali kelas ke kelas dan siswa.", "Pemantauan perkembangan siswa dampingan."]}
    />
  );
}
