import { NextResponse } from "next/server";
import { updateSkill, deleteSkill } from "@/lib/data";
import { skillUpdateSchema } from "@/lib/validations/admin";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = skillUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid skill payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const skill = await updateSkill(id, parsed.data);
  return NextResponse.json(skill);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await deleteSkill(id);
  return NextResponse.json({ ok: true });
}
