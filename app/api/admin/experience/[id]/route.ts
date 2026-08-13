import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { experienceUpdateSchema } from "@/lib/validations/admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = experienceUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid experience payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const experience = await prisma.experience.update({
    where: { id },
    data: parsed.data,
  });
  return NextResponse.json(experience);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await prisma.experience.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
