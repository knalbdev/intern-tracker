import type { Metadata } from "next";
import { UpcomingFeature } from "@/components/UpcomingFeature";

export const metadata: Metadata = { title: "MoU | PKLtrack" };

export default function Page() {
  return (
    <UpcomingFeature
      title="MoU"
      description="Ruang pengelolaan dokumen kerja sama PKL antara sekolah dan perusahaan."
      planned={[
        "Pencatatan MoU dan pengaitan dengan perusahaan DUDI & Mitra.",
        "Pengelolaan dokumen, masa berlaku, dan status kerja sama.",
        "Pencarian, peninjauan, dan pengunduhan dokumen sesuai hak akses.",
      ]}
    />
  );
}
