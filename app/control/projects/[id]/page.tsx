import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProjectForm } from "@/components/admin/project-form";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!project) notFound();

  return (
    <div>
      <h1 className="text-2xl font-medium text-foreground">{project.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">Editing project details.</p>
      <div className="mt-8">
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
