import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { contactFormSchema } from "@/lib/dynamic-validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactFormSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: "Data tidak valid" }, { status: 422 });
    const message = await prisma.contactMessage.create({ data: parsed.data });
    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Gagal mengirim pesan" }, { status: 500 });
  }
}
