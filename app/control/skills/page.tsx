"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import type { Skill, SkillCategory } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const CATEGORIES: { value: SkillCategory; label: string }[] = [
  { value: "PRODUCT", label: "Продукт" },
  { value: "AI", label: "AI" },
  { value: "DEVELOPMENT", label: "Разработка" },
  { value: "DESIGN", label: "Дизайн" },
];

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[] | null>(null);
  const [tab, setTab] = useState<SkillCategory>("PRODUCT");
  const [inputs, setInputs] = useState<Record<SkillCategory, string>>({
    PRODUCT: "",
    AI: "",
    DEVELOPMENT: "",
    DESIGN: "",
  });

  async function load() {
    const res = await fetch("/api/admin/skills");
    setSkills(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function addSkill(category: SkillCategory) {
    const name = inputs[category].trim();
    if (!name) return;

    const order = skills?.filter((s) => s.category === category).length ?? 0;
    const res = await fetch("/api/admin/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, name, order }),
    });
    if (res.ok) {
      const skill = await res.json();
      setSkills((prev) => [...(prev ?? []), skill]);
      setInputs((prev) => ({ ...prev, [category]: "" }));
    } else {
      toast.error("Не удалось добавить навык");
    }
  }

  async function removeSkill(id: string) {
    setSkills((prev) => prev?.filter((s) => s.id !== id) ?? null);
    const res = await fetch(`/api/admin/skills/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Не удалось удалить навык");
      load();
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-medium text-foreground">Навыки</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Управление тегами навыков на главной странице.
      </p>

      <Tabs value={tab} onValueChange={(v) => setTab(v as SkillCategory)} className="mt-8">
        <TabsList>
          {CATEGORIES.map((c) => (
            <TabsTrigger key={c.value} value={c.value}>
              {c.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIES.map((c) => (
          <TabsContent key={c.value} value={c.value}>
            <div className="flex flex-wrap gap-2">
              {skills
                ?.filter((s) => s.category === c.value)
                .map((skill) => (
                  <Badge key={skill.id} className="gap-1.5 pr-1.5 text-sm">
                    {skill.name}
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="rounded-full hover:text-foreground"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
            </div>
            <div className="mt-4 flex max-w-sm gap-2">
              <Input
                placeholder={`Добавить навык: ${c.label.toLowerCase()}`}
                value={inputs[c.value]}
                onChange={(e) => setInputs((prev) => ({ ...prev, [c.value]: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill(c.value);
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={() => addSkill(c.value)}>
                <Plus className="size-4" />
              </Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
