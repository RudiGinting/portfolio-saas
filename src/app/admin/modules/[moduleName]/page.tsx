// src/app/admin/modules/[moduleName]/page.tsx
// ============================================================
// DYNAMIC MODULE PAGE - auto-generated from config
// This single page handles ALL modules dynamically
// ============================================================

import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { DynamicModulePage } from "@/components/admin/DynamicModulePage";

interface Props {
  params: Promise<{ moduleName: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { moduleName } = await params;
  const module = await prisma.module.findUnique({ where: { name: moduleName } });
  return { title: module?.label ?? "Modul" };
}

export default async function ModulePage({ params }: Props) {
  const { moduleName } = await params;

  const module = await prisma.module.findUnique({
    where: { name: moduleName, isActive: true },
    include: {
      fields: { orderBy: { order: "asc" } },
    },
  });

  if (!module) return notFound();

  return (
    <DynamicModulePage
      module={module as Parameters<typeof DynamicModulePage>[0]["module"]}
    />
  );
}
