"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { SiteSettings } from "@prisma/client";

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/settings");
    setSettings(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function save(patch: Partial<SiteSettings>) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        setSettings(await res.json());
        toast.success("Сохранено");
      } else {
        toast.error("Не удалось сохранить");
      }
    } finally {
      setSaving(false);
    }
  }

  return { settings, setSettings, saving, save };
}
