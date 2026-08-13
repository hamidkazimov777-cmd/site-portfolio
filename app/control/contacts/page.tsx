"use client";

import { useSiteSettings } from "@/components/admin/use-site-settings";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ContactsPage() {
  const { settings, setSettings, saving, save } = useSiteSettings();

  if (!settings) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl font-medium text-foreground">Contacts</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Contact details shown on your site and in the footer.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          save({
            email: settings.email,
            phonePrimary: settings.phonePrimary,
            phoneSecondary: settings.phoneSecondary,
            linkedinUrl: settings.linkedinUrl,
            githubUrl: settings.githubUrl,
            websiteUrl: settings.websiteUrl,
          });
        }}
        className="mt-8 max-w-xl space-y-6"
      >
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={settings.email ?? ""}
            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Phone (primary)</Label>
          <Input
            value={settings.phonePrimary ?? ""}
            onChange={(e) => setSettings({ ...settings, phonePrimary: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Phone (secondary)</Label>
          <Input
            value={settings.phoneSecondary ?? ""}
            onChange={(e) => setSettings({ ...settings, phoneSecondary: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>LinkedIn URL</Label>
          <Input
            value={settings.linkedinUrl ?? ""}
            onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>GitHub URL</Label>
          <Input
            value={settings.githubUrl ?? ""}
            onChange={(e) => setSettings({ ...settings, githubUrl: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Website URL</Label>
          <Input
            value={settings.websiteUrl ?? ""}
            onChange={(e) => setSettings({ ...settings, websiteUrl: e.target.value })}
          />
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
