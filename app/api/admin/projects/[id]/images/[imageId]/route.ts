import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) {
  const { id, imageId } = await params;
  await prisma.projectImage.delete({
    where: { id: imageId, projectId: id },
  });
  return NextResponse.json({ ok: true });
}
