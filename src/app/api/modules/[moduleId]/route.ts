import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params { params: Promise<{ moduleId: string }> }

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { moduleId } = await params;
    const module = await prisma.module.findUnique({ where: { id: moduleId } });
    if (!module) return NextResponse.json({ success: false, error: "Modul tidak ditemukan" }, { status: 404 });
    if (module.isSystem) return NextResponse.json({ success: false, error: "Modul sistem tidak dapat dihapus" }, { status: 403 });
    await prisma.module.delete({ where: { id: moduleId } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ success: false, error: "Gagal menghapus modul" }, { status: 500 }); }
}
