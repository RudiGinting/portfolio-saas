import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) return NextResponse.json({ success: false, error: "IDs wajib diisi" }, { status: 400 });
    await prisma.moduleRecord.deleteMany({ where: { id: { in: ids } } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ success: false, error: "Gagal menghapus data" }, { status: 500 }); }
}
