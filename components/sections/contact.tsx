"use client";

import type { ComponentType, SVGProps } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Phone, Globe } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import type { SiteSettings } from "@prisma/client";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Contact({
  settings,
  dict,
}: {
  settings: SiteSettings;
  dict: Dictionary;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactInput) {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success(dict.contact.success);
      reset();
    } else {
      toast.error(dict.contact.error);
    }
  }

  const socials = [
    settings.email && {
      label: settings.email,
      href: `mailto:${settings.email}`,
      icon: Mail,
    },
    settings.phonePrimary && {
      label: settings.phonePrimary,
      href: `tel:${settings.phonePrimary.replace(/\s+/g, "")}`,
      icon: Phone,
    },
    settings.linkedinUrl && {
      label: "LinkedIn",
      href: settings.linkedinUrl,
      icon: LinkedinIcon,
    },
    settings.githubUrl && {
      label: "GitHub",
      href: settings.githubUrl,
      icon: GithubIcon,
    },
    settings.websiteUrl && {
      label: "Website",
      href: settings.websiteUrl,
      icon: Globe,
    },
  ].filter(Boolean) as { label: string; href: string; icon: IconType }[];

  return (
    <section id="contact" className="py-24">
      <div className="container-page grid gap-16 md:grid-cols-2">
        <div>
          <p className="font-mono text-sm text-accent">{dict.contact.eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {dict.contact.title}
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            {dict.contact.subtitle}
          </p>

          <div className="mt-10 flex flex-col gap-4">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-accent"
              >
                <social.icon className="size-4" />
                {social.label}
              </a>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">{dict.contact.name}</Label>
            <Input
              id="name"
              placeholder={dict.contact.namePlaceholder}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">{dict.contact.email}</Label>
            <Input
              id="email"
              type="email"
              placeholder={dict.contact.emailPlaceholder}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="message">{dict.contact.message}</Label>
            <Textarea
              id="message"
              rows={5}
              placeholder={dict.contact.messagePlaceholder}
              {...register("message")}
            />
            {errors.message && (
              <p className="text-xs text-red-400">{errors.message.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="mt-2 w-fit">
            {isSubmitting ? dict.contact.sending : dict.contact.send}
          </Button>
        </form>
      </div>
    </section>
  );
}
