import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { MasterDataManager } from "@/components/admin/MasterDataManager";

export const metadata: Metadata = { title: "Master Data" };

export default async function MasterDataPage() {
  const modules = await prisma.module.findMany({
    include: { fields: { orderBy: { order: "asc" } }, _count: { select: { records: true } } },
    orderBy: { order: "asc" },
  });
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Master Data Builder</h1>
        <p className="text-muted-foreground">Kelola modul dan field secara dinamis tanpa coding</p>
      </div>
      <MasterDataManager modules={modules as Parameters<typeof MasterDataManager>[0]["modules"]} />
    </div>
  );
}
