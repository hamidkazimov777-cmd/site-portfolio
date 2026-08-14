"use client";

import { useState } from "react";
import type { Prisma } from "@prisma/client";
import { useSiteSettings } from "@/components/admin/use-site-settings";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";

export default function SeoPage() {
  const { settings, setSettings, saving, save } = useSiteSettings();
  const [schemaText, setSchemaText] = useState<string | null>(null);
  const [schemaError, setSchemaError] = useState<string | null>(null);

  if (!settings) return <p className="text-sm text-muted-foreground">Загрузка…</p>;

  const currentSchemaText =
    schemaText ??
    (settings.schemaJsonLd ? JSON.stringify(settings.schemaJsonLd, null, 2) : "");

  return (
    <div>
      <h1 className="text-2xl font-medium text-foreground">SEO</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Метаданные для поисковиков и соцсетей.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          let schemaJsonLd: Prisma.JsonValue = settings.schemaJsonLd;
          if (schemaText !== null) {
            try {
              schemaJsonLd = schemaText.trim() ? JSON.parse(schemaText) : null;
              setSchemaError(null);
            } catch {
              setSchemaError("Некорректный JSON");
              return;
            }
          }
          save({
            seoTitle: settings.seoTitle,
            seoDescription: settings.seoDescription,
            ogImageUrl: settings.ogImageUrl,
            twitterHandle: settings.twitterHandle,
            schemaJsonLd,
          });
        }}
        className="mt-8 max-w-xl space-y-6"
      >
        <div className="flex flex-col gap-2">
          <Label>SEO заголовок</Label>
          <Input
            value={settings.seoTitle ?? ""}
            onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>SEO описание</Label>
          <Textarea
            value={settings.seoDescription ?? ""}
            onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
          />
        </div>
        <ImageUploadField
          label="Open Graph изображение"
          value={settings.ogImageUrl}
          onChange={(url) => setSettings({ ...settings, ogImageUrl: url })}
        />
        <div className="flex flex-col gap-2">
          <Label>Twitter аккаунт</Label>
          <Input
            placeholder="@handle"
            value={settings.twitterHandle ?? ""}
            onChange={(e) => setSettings({ ...settings, twitterHandle: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Schema.org JSON-LD</Label>
          <Textarea
            rows={10}
            className="font-mono text-xs"
            value={currentSchemaText}
            onChange={(e) => setSchemaText(e.target.value)}
          />
          {schemaError && <p className="text-xs text-red-400">{schemaError}</p>}
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? "Сохранение…" : "Сохранить изменения"}
        </Button>
      </form>
    </div>
  );
}
