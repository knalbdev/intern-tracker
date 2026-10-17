import type { Metadata } from "next";
import { UpcomingFeature } from "@/components/UpcomingFeature";

export const metadata: Metadata = { title: "Penilaian PKL | PKLtrack" };

export default function Page() {
  return (
    <UpcomingFeature
      title="Penilaian PKL"
      description="Ruang pengelolaan penilaian dan evaluasi hasil PKL siswa."
      planned={["Pengelolaan komponen dan kriteria penilaian.", "Pencatatan penilaian dari sekolah dan industri.", "Rekap hasil evaluasi PKL siswa."]}
    />
  );
}
