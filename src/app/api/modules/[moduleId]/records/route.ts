// src/app/api/modules/[moduleId]/records/route.ts
// GET records list, POST create record

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ApiResponse, IModuleRecord, PaginatedResponse } from "@/models";
import { buildZodSchema } from "@/lib/dynamic-validation";

interface Params {
  params: Promise<{ moduleId: string }>;
}

export async function GET(req: NextRequest, { params }: Params): Promise<NextResponse> {
  try {
    const { moduleId } = await params;
    const { searchParams } = req.nextUrl;

    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? 10)));
    const search = searchParams.get("search") ?? "";

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { fields: { where: { isSearchable: true } } },
    });

    if (!module) {
      return NextResponse.json({ success: false, error: "Modul tidak ditemukan" }, { status: 404 });
    }

    // Build search filter for searchable fields
    const whereClause =
      search && module.fields.length > 0
        ? {
            AND: [
              { moduleId },
              {
                OR: module.fields.map((f) => ({
                  data: { path: [f.name], string_contains: search },
                })),
              },
            ],
          }
        : { moduleId };

    const [records, total] = await Promise.all([
      prisma.moduleRecord.findMany({
        where: whereClause,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.moduleRecord.count({ where: whereClause }),
    ]);

    const response: PaginatedResponse<IModuleRecord> = {
      data: records as unknown as IModuleRecord[],
      total,
      page,
      perPage: pageSize,
      totalPages: Math.ceil(total / pageSize),
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error("[GET /api/modules/[moduleId]/records]", error);
    return NextResponse.json({ success: false, error: "Gagal memuat data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params): Promise<NextResponse<ApiResponse<IModuleRecord>>> {
  try {
    const { moduleId } = await params;
    const body = await req.json();

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { fields: true },
    });

    if (!module) {
      return NextResponse.json({ success: false, error: "Modul tidak ditemukan" }, { status: 404 });
    }

    // Dynamic validation
    const schema = buildZodSchema(module.fields as Parameters<typeof buildZodSchema>[0]);
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
      return NextResponse.json(
        { success: false, error: errors.join(", ") },
        { status: 422 }
      );
    }

    // Check unique constraints
    for (const field of module.fields.filter((f) => f.unique)) {
      const value = parsed.data[field.name];
      if (value === undefined || value === "") continue;

      const existing = await prisma.moduleRecord.findFirst({
        where: {
          moduleId,
          data: { path: [field.name], equals: value },
        },
      });

      if (existing) {
        return NextResponse.json(
          { success: false, error: `${field.label} sudah digunakan` },
          { status: 409 }
        );
      }
    }

    const record = await prisma.moduleRecord.create({
      data: { moduleId, data: parsed.data as object },
    });

    return NextResponse.json(
      { success: true, data: record as unknown as IModuleRecord },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/modules/[moduleId]/records]", error);
    return NextResponse.json({ success: false, error: "Gagal menyimpan data" }, { status: 500 });
  }
}
