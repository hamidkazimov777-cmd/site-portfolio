import { NextResponse } from "next/server";
import { fetchAllSkills, createSkill } from "@/lib/data";
import { skillCreateSchema } from "@/lib/validations/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const skills = await fetchAllSkills();
  return NextResponse.json(skills);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = skillCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid skill payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const skill = await createSkill(parsed.data);
  return NextResponse.json(skill, { status: 201 });
}
