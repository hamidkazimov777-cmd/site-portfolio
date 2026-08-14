import { NextResponse } from "next/server";
import { fetchAllExperience, createExperience } from "@/lib/data";
import { experienceCreateSchema } from "@/lib/validations/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const experience = await fetchAllExperience();
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

  const experience = await createExperience(parsed.data);
  return NextResponse.json(experience, { status: 201 });
}
