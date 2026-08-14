import { NextResponse } from "next/server";
import { updateExperience, deleteExperience } from "@/lib/data";
import { experienceUpdateSchema } from "@/lib/validations/admin";

export const dynamic = "force-dynamic";

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

  const experience = await updateExperience(id, parsed.data);
  return NextResponse.json(experience);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await deleteExperience(id);
  return NextResponse.json({ ok: true });
}
