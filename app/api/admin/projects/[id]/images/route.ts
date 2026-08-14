import { NextResponse } from "next/server";
import { fetchProjectById, createProjectImage } from "@/lib/data";
import { projectImageCreateSchema } from "@/lib/validations/admin";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = projectImageCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid image payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const project = await fetchProjectById(id);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const image = await createProjectImage(id, parsed.data);
  return NextResponse.json(image, { status: 201 });
}
