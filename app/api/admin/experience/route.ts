import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { experienceCreateSchema } from "@/lib/validations/admin";

export async function GET() {
  const experience = await prisma.experience.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(experience);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = experienceCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid experience payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const experience = await prisma.experience.create({ data: parsed.data });
  return NextResponse.json(experience, { status: 201 });
}
