// src/app/api/modules/route.ts
// GET all modules, POST create module

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ApiResponse, IModule } from "@/models";
import { masterDataConfig } from "@/config/master-data.config";
import { createSlug } from "@/lib/utils";

// Seed modules from config on first access
async function syncConfigModules() {
  for (const [key, config] of Object.entries(masterDataConfig)) {
    const existing = await prisma.module.findUnique({ where: { name: key } });
    if (existing) continue;

    await prisma.module.create({
      data: {
        name: key,
        label: config.label,
        description: config.description,
        icon: config.icon,
        isActive: true,
        isSystem: false,
        order: Object.keys(masterDataConfig).indexOf(key),
        fields: {
          create: config.fields.map((f, i) => ({
            name: f.name,
            label: f.label ?? f.name,
            type: f.type,
            required: f.required ?? false,
            unique: f.unique ?? false,
            defaultValue: f.defaultValue,
            placeholder: f.placeholder,
            options: f.options ?? undefined,
            validation: f.validation ?? undefined,
            order: f.order ?? i,
            isVisible: true,
            isSearchable: f.isSearchable ?? false,
          })),
        },
      },
    });
  }
}

export async function GET(): Promise<NextResponse<ApiResponse<IModule[]>>> {
  try {
    await syncConfigModules();

    const modules = await prisma.module.findMany({
      where: { isActive: true },
      include: {
        fields: { orderBy: { order: "asc" } },
        _count: { select: { records: true } },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, data: modules as unknown as IModule[] });
  } catch (error) {
    console.error("[GET /api/modules]", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat modul" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<IModule>>> {
  try {
    const body = await req.json();
    const { name, label, description, icon } = body;

    if (!name || !label) {
      return NextResponse.json(
        { success: false, error: "Nama dan label modul wajib diisi" },
        { status: 400 }
      );
    }

    const moduleName = createSlug(name).replace(/-/g, "_");
    const existing = await prisma.module.findUnique({ where: { name: moduleName } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Modul dengan nama tersebut sudah ada" },
        { status: 409 }
      );
    }

    const count = await prisma.module.count();
    const module = await prisma.module.create({
      data: {
        name: moduleName,
        label,
        description,
        icon,
        isActive: true,
        isSystem: false,
        order: count,
      },
      include: { fields: true, _count: { select: { records: true } } },
    });

    return NextResponse.json({ success: true, data: module as unknown as IModule }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/modules]", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat modul" },
      { status: 500 }
    );
  }
}
