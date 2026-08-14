"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import type { Experience } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

type DraftExperience = {
  id?: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  order: number;
};

function toDraft(exp: Experience): DraftExperience {
  return {
    id: exp.id,
    role: exp.role,
    company: exp.company ?? "",
    startDate: exp.startDate.toString().slice(0, 10),
    endDate: exp.endDate ? exp.endDate.toString().slice(0, 10) : "",
    isCurrent: exp.isCurrent,
    description: exp.description ?? "",
    order: exp.order,
  };
}

export default function ExperiencePage() {
  const [items, setItems] = useState<DraftExperience[] | null>(null);

  async function load() {
    const res = await fetch("/api/admin/experience");
    const data: Experience[] = await res.json();
    setItems(data.map(toDraft));
  }

  useEffect(() => {
    load();
  }, []);

  function addNew() {
    setItems((prev) => [
      ...(prev ?? []),
      {
        role: "",
        company: "",
        startDate: new Date().toISOString().slice(0, 10),
        endDate: "",
        isCurrent: true,
        description: "",
        order: prev?.length ?? 0,
      },
    ]);
  }

  function update(index: number, patch: Partial<DraftExperience>) {
    setItems((prev) => prev?.map((item, i) => (i === index ? { ...item, ...patch } : item)) ?? null);
  }

  async function save(index: number) {
    const item = items?.[index];
    if (!item) return;

    const payload = {
      role: item.role,
      company: item.company || null,
      startDate: item.startDate,
      endDate: item.isCurrent ? null : item.endDate || null,
      isCurrent: item.isCurrent,
      description: item.description || null,
      order: item.order,
    };

    if (item.id) {
      const res = await fetch(`/api/admin/experience/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) toast.success("Сохранено"); else toast.error("Не удалось сохранить");
    } else {
      const res = await fetch("/api/admin/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const created = await res.json();
        update(index, { id: created.id });
        toast.success("Создано");
      } else {
        toast.error("Не удалось создать");
      }
    }
  }

  async function remove(index: number) {
    const item = items?.[index];
    if (!item) return;
    if (item.id) {
      const res = await fetch(`/api/admin/experience/${item.id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Не удалось удалить");
        return;
      }
    }
    setItems((prev) => prev?.filter((_, i) => i !== index) ?? null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-foreground">Опыт</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Управление таймлайном карьеры.
          </p>
        </div>
        <Button onClick={addNew}>
          <Plus className="size-4" />
          Добавить запись
        </Button>
      </div>

      <div className="mt-8 space-y-6">
        {items?.map((item, index) => (
          <Card key={item.id ?? `new-${index}`}>
            <CardContent className="space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>Должность</Label>
                  <Input value={item.role} onChange={(e) => update(index, { role: e.target.value })} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Компания (необязательно)</Label>
                  <Input value={item.company} onChange={(e) => update(index, { company: e.target.value })} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Дата начала</Label>
                  <Input
                    type="date"
                    value={item.startDate}
                    onChange={(e) => update(index, { startDate: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Дата окончания</Label>
                  <Input
                    type="date"
                    disabled={item.isCurrent}
                    value={item.endDate}
                    onChange={(e) => update(index, { endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={item.isCurrent}
                  onCheckedChange={(checked) => update(index, { isCurrent: checked })}
                />
                <span className="text-sm text-muted-foreground">Текущая должность</span>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Описание</Label>
                <Textarea
                  value={item.description}
                  onChange={(e) => update(index, { description: e.target.value })}
                />
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" className="text-red-400" onClick={() => remove(index)}>
                  <Trash2 className="size-4" />
                  Удалить
                </Button>
                <Button onClick={() => save(index)}>Сохранить</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
