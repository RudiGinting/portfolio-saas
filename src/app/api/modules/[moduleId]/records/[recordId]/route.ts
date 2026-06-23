import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { buildZodSchema } from "@/lib/dynamic-validation";

interface Params { params: Promise<{ moduleId: string; recordId: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { moduleId, recordId } = await params;
    const body = await req.json();
    const module = await prisma.module.findUnique({ where: { id: moduleId }, include: { fields: true } });
    if (!module) return NextResponse.json({ success: false, error: "Modul tidak ditemukan" }, { status: 404 });
    const schema = buildZodSchema(module.fields as Parameters<typeof buildZodSchema>[0]);
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.errors.map(e => e.message).join(", ") }, { status: 422 });
    const record = await prisma.moduleRecord.update({ where: { id: recordId }, data: { data: parsed.data as object } });
    return NextResponse.json({ success: true, data: record });
  } catch { return NextResponse.json({ success: false, error: "Gagal memperbarui data" }, { status: 500 }); }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { recordId } = await params;
    await prisma.moduleRecord.delete({ where: { id: recordId } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ success: false, error: "Gagal menghapus data" }, { status: 500 }); }
}
