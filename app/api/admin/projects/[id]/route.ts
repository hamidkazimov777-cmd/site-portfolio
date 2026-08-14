import { NextResponse } from "next/server";
import {
  fetchProjectById,
  updateProject,
  deleteProject,
  projectSlugExists,
} from "@/lib/data";
import { projectUpdateSchema } from "@/lib/validations/admin";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const project = await fetchProjectById(id);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(project);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = projectUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid project payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (parsed.data.slug && (await projectSlugExists(parsed.data.slug, id))) {
    return NextResponse.json(
      { error: "A project with this slug already exists" },
      { status: 409 },
    );
  }

  const project = await updateProject(id, parsed.data);
  return NextResponse.json(project);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await deleteProject(id);
  return NextResponse.json({ ok: true });
}
