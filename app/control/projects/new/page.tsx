import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-medium text-foreground">New project</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Create a new product case study.
      </p>
      <div className="mt-8">
        <ProjectForm />
      </div>
    </div>
  );
}
