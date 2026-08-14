import { notFound } from "next/navigation";
import { fetchProjectById } from "@/lib/data";
import { ProjectForm } from "@/components/admin/project-form";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await fetchProjectById(id);

  if (!project) notFound();

  return (
    <div>
      <h1 className="text-2xl font-medium text-foreground">{project.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">Редактирование деталей проекта.</p>
      <div className="mt-8">
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
