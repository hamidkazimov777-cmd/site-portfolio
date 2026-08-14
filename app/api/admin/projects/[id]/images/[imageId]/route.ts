import { NextResponse } from "next/server";
import { deleteProjectImage } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) {
  const { id, imageId } = await params;
  await deleteProjectImage(id, imageId);
  return NextResponse.json({ ok: true });
}
