"use client";

import { useSiteSettings } from "@/components/admin/use-site-settings";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";

export default function AboutPage() {
  const { settings, setSettings, saving, save } = useSiteSettings();

  if (!settings) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl font-medium text-foreground">About</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Information shown across your site.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          save({
            fullName: settings.fullName,
            role: settings.role,
            tagline: settings.tagline,
            aboutBody: settings.aboutBody,
            avatarUrl: settings.avatarUrl,
          });
        }}
        className="mt-8 max-w-xl space-y-6"
      >
        <div className="flex flex-col gap-2">
          <Label>Full name</Label>
          <Input
            value={settings.fullName}
            onChange={(e) => setSettings({ ...settings, fullName: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Role</Label>
          <Input
            value={settings.role}
            onChange={(e) => setSettings({ ...settings, role: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Tagline (hero subheading)</Label>
          <Textarea
            value={settings.tagline}
            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>About body</Label>
          <Textarea
            rows={6}
            value={settings.aboutBody ?? ""}
            onChange={(e) => setSettings({ ...settings, aboutBody: e.target.value })}
          />
        </div>
        <ImageUploadField
          label="Avatar"
          value={settings.avatarUrl}
          onChange={(url) => setSettings({ ...settings, avatarUrl: url })}
        />
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
