import { NextResponse } from "next/server";
import { fetchAllProjects, createProject, projectSlugExists } from "@/lib/data";
import { projectCreateSchema } from "@/lib/validations/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const projects = await fetchAllProjects();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = projectCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid project payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (await projectSlugExists(parsed.data.slug)) {
    return NextResponse.json(
      { error: "A project with this slug already exists" },
      { status: 409 },
    );
  }

  const project = await createProject(parsed.data);
  return NextResponse.json(project, { status: 201 });
}
