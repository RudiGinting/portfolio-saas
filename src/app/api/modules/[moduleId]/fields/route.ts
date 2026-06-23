import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { moduleFieldSchema } from "@/lib/dynamic-validation";

interface Params { params: Promise<{ moduleId: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { moduleId } = await params;
    const body = await req.json();
    const parsed = moduleFieldSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 422 });
    const existing = await prisma.moduleField.findUnique({ where: { moduleId_name: { moduleId, name: parsed.data.name } } });
    if (existing) return NextResponse.json({ success: false, error: "Field dengan nama tersebut sudah ada" }, { status: 409 });
    const field = await prisma.moduleField.create({ data: { ...parsed.data, moduleId, isVisible: true, isSystem: false } });
    return NextResponse.json({ success: true, data: field }, { status: 201 });
  } catch { return NextResponse.json({ success: false, error: "Gagal menambahkan field" }, { status: 500 }); }
}
