"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import type { Project, ProjectImage } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { GalleryEditor } from "@/components/admin/gallery-editor";

type ProjectWithImages = Project & { images: ProjectImage[] };

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Черновик" },
  { value: "PUBLISHED", label: "Опубликован" },
];

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProjectForm({ project }: { project?: ProjectWithImages }) {
  const router = useRouter();
  const isEdit = Boolean(project);

  const [values, setValues] = useState({
    slug: project?.slug ?? "",
    title: project?.title ?? "",
    tagline: project?.tagline ?? "",
    category: project?.category ?? "",
    status: project?.status ?? "DRAFT",
    order: project?.order ?? 0,
    coverImageUrl: project?.coverImageUrl ?? null,
    heroHeadline: project?.heroHeadline ?? "",
    heroSubheadline: project?.heroSubheadline ?? "",
    story: project?.story ?? "",
    problem: project?.problem ?? "",
    solution: project?.solution ?? "",
    architecture: project?.architecture ?? "",
    results: project?.results ?? "",
    seoTitle: project?.seoTitle ?? "",
    seoDescription: project?.seoDescription ?? "",
    ogImageUrl: project?.ogImageUrl ?? null,
  });

  const [technologies, setTechnologies] = useState<string[]>(project?.technologies ?? []);
  const [techInput, setTechInput] = useState("");
  const [links, setLinks] = useState<{ label: string; href: string }[]>(
    Object.entries((project?.links as Record<string, string>) ?? {}).map(
      ([label, href]) => ({ label, href }),
    ),
  );
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function addTechnology() {
    const value = techInput.trim();
    if (value && !technologies.includes(value)) {
      setTechnologies([...technologies, value]);
    }
    setTechInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...values,
      order: Number(values.order),
      technologies,
      links: Object.fromEntries(
        links.filter((l) => l.label && l.href).map((l) => [l.label, l.href]),
      ),
    };

    try {
      const res = await fetch(
        isEdit ? `/api/admin/projects/${project!.id}` : "/api/admin/projects",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Не удалось сохранить проект");
        return;
      }

      toast.success(isEdit ? "Проект обновлён" : "Проект создан");
      if (!isEdit) {
        router.push(`/control/projects/${data.id}`);
      } else {
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 pb-16">
      <section className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>Название</Label>
          <Input
            value={values.title}
            onChange={(e) => {
              set("title", e.target.value);
              if (!slugTouched) set("slug", slugify(e.target.value));
            }}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Slug (адрес)</Label>
          <Input
            value={values.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", slugify(e.target.value));
            }}
            required
          />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label>Краткое описание</Label>
          <Input value={values.tagline} onChange={(e) => set("tagline", e.target.value)} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Категория</Label>
          <Input value={values.category} onChange={(e) => set("category", e.target.value)} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Статус</Label>
          <Select value={values.status} onValueChange={(v) => set("status", v as "DRAFT" | "PUBLISHED")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Порядок отображения</Label>
          <Input
            type="number"
            value={values.order}
            onChange={(e) => set("order", Number(e.target.value) as never)}
          />
        </div>
        <div>
          <ImageUploadField
            label="Обложка"
            value={values.coverImageUrl}
            onChange={(url) => set("coverImageUrl", url)}
          />
        </div>
      </section>

      <section className="space-y-5 border-t border-border pt-8">
        <h2 className="text-sm font-medium text-accent">Заголовок (Hero)</h2>
        <div className="flex flex-col gap-2">
          <Label>Заголовок</Label>
          <Input value={values.heroHeadline ?? ""} onChange={(e) => set("heroHeadline", e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Подзаголовок</Label>
          <Textarea
            value={values.heroSubheadline ?? ""}
            onChange={(e) => set("heroSubheadline", e.target.value)}
          />
        </div>
      </section>

      <section className="space-y-5 border-t border-border pt-8">
        <h2 className="text-sm font-medium text-accent">История</h2>
        {([
          ["story", "История"],
          ["problem", "Проблема"],
          ["solution", "Решение"],
          ["architecture", "Архитектура"],
          ["results", "Результаты"],
        ] as const).map(([key, label]) => (
          <div key={key} className="flex flex-col gap-2">
            <Label>{label}</Label>
            <Textarea rows={4} value={values[key] ?? ""} onChange={(e) => set(key, e.target.value)} />
          </div>
        ))}
      </section>

      <section className="space-y-3 border-t border-border pt-8">
        <h2 className="text-sm font-medium text-accent">Технологии</h2>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <Badge key={tech} className="gap-1.5 pr-1.5">
              {tech}
              <button
                type="button"
                onClick={() => setTechnologies(technologies.filter((t) => t !== tech))}
                className="rounded-full hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTechnology();
              }
            }}
            placeholder="Введите технологию и нажмите Enter"
          />
          <Button type="button" variant="outline" onClick={addTechnology}>
            <Plus className="size-4" />
          </Button>
        </div>
      </section>

      <section className="space-y-3 border-t border-border pt-8">
        <h2 className="text-sm font-medium text-accent">Ссылки</h2>
        {links.map((link, i) => (
          <div key={i} className="flex gap-2">
            <Input
              placeholder="Название (например, Website)"
              value={link.label}
              onChange={(e) => {
                const next = [...links];
                next[i] = { ...next[i], label: e.target.value };
                setLinks(next);
              }}
            />
            <Input
              placeholder="https://…"
              value={link.href}
              onChange={(e) => {
                const next = [...links];
                next[i] = { ...next[i], href: e.target.value };
                setLinks(next);
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setLinks(links.filter((_, idx) => idx !== i))}
            >
              <X className="size-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setLinks([...links, { label: "", href: "" }])}
        >
          <Plus className="size-4" />
          Добавить ссылку
        </Button>
      </section>

      {isEdit && project && (
        <section className="space-y-3 border-t border-border pt-8">
          <h2 className="text-sm font-medium text-accent">Галерея</h2>
          <GalleryEditor projectId={project.id} images={project.images} />
        </section>
      )}

      <section className="space-y-5 border-t border-border pt-8">
        <h2 className="text-sm font-medium text-accent">SEO</h2>
        <div className="flex flex-col gap-2">
          <Label>SEO заголовок</Label>
          <Input value={values.seoTitle ?? ""} onChange={(e) => set("seoTitle", e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>SEO описание</Label>
          <Textarea value={values.seoDescription ?? ""} onChange={(e) => set("seoDescription", e.target.value)} />
        </div>
        <ImageUploadField
          label="Open Graph изображение"
          value={values.ogImageUrl}
          onChange={(url) => set("ogImageUrl", url)}
        />
      </section>

      <div className="sticky bottom-0 -mx-8 border-t border-border bg-background/95 px-8 py-4 backdrop-blur">
        <Button type="submit" disabled={saving}>
          {saving ? "Сохранение…" : isEdit ? "Сохранить изменения" : "Создать проект"}
        </Button>
      </div>
    </form>
  );
}
