import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-medium text-foreground">Новый проект</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Создание нового кейса продукта.
      </p>
      <div className="mt-8">
        <ProjectForm />
      </div>
    </div>
  );
}
