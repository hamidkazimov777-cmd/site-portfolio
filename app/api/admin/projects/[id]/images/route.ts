import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { projectImageCreateSchema } from "@/lib/validations/admin";

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

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const image = await prisma.projectImage.create({
    data: { ...parsed.data, projectId: id },
  });

  return NextResponse.json(image, { status: 201 });
}
