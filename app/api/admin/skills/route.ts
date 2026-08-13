import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { skillCreateSchema } from "@/lib/validations/admin";

export async function GET() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });
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

  const skill = await prisma.skill.create({ data: parsed.data });
  return NextResponse.json(skill, { status: 201 });
}
