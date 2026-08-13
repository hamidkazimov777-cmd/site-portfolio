"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import type { Project } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  async function load() {
    const res = await fetch("/api/admin/projects");
    setProjects(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function togglePublish(project: Project) {
    const nextStatus = project.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setProjects(
      (prev) =>
        prev?.map((p) => (p.id === project.id ? { ...p, status: nextStatus } : p)) ??
        null,
    );

    const res = await fetch(`/api/admin/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });

    if (!res.ok) {
      toast.error("Failed to update status");
      load();
    } else {
      toast.success(nextStatus === "PUBLISHED" ? "Published" : "Moved to draft");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/projects/${deleteTarget.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setProjects((prev) => prev?.filter((p) => p.id !== deleteTarget.id) ?? null);
      toast.success("Project deleted");
    } else {
      toast.error("Failed to delete project");
    }
    setDeleteTarget(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, edit and publish your product case studies.
          </p>
        </div>
        <Button asChild>
          <Link href="/control/projects/new">
            <Plus className="size-4" />
            New project
          </Link>
        </Button>
      </div>

      <div className="mt-8 space-y-3">
        {projects === null && (
          <p className="text-sm text-muted-foreground">Loading…</p>
        )}
        {projects?.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No projects yet. Create your first one.
          </p>
        )}
        {projects?.map((project) => (
          <Card key={project.id}>
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/control/projects/${project.id}`}
                    className="truncate text-sm font-medium text-foreground hover:text-accent"
                  >
                    {project.title}
                  </Link>
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                    {project.category}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {project.tagline}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-4">
                <a
                  href={`/en/projects/${project.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-accent"
                  title="View live"
                >
                  <ExternalLink className="size-4" />
                </a>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {project.status === "PUBLISHED" ? "Published" : "Draft"}
                  </span>
                  <Switch
                    checked={project.status === "PUBLISHED"}
                    onCheckedChange={() => togglePublish(project)}
                  />
                </div>
                <button
                  onClick={() => setDeleteTarget(project)}
                  className="text-muted-foreground transition-colors hover:text-red-400"
                  title="Delete"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              This will permanently delete &ldquo;{deleteTarget?.title}&rdquo; and its
              images. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
