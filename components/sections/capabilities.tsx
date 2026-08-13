"use client";

import { useMemo, useState } from "react";
import type { Experience, Skill, SkillCategory } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const CATEGORY_ORDER: SkillCategory[] = ["PRODUCT", "AI", "DEVELOPMENT", "DESIGN"];

export function Capabilities({
  skills,
  experience,
  dict,
}: {
  skills: Skill[];
  experience: Experience[];
  dict: Dictionary;
}) {
  const [tab, setTab] = useState<string>("PRODUCT");

  const grouped = useMemo(() => {
    const map = new Map<SkillCategory, Skill[]>();
    for (const category of CATEGORY_ORDER) map.set(category, []);
    for (const skill of skills) {
      map.get(skill.category)?.push(skill);
    }
    return map;
  }, [skills]);

  function formatRange(exp: Experience) {
    const start = format(exp.startDate, "yyyy");
    if (exp.isCurrent || !exp.endDate) return `${start} — ${dict.capabilities.present}`;
    return `${start} — ${format(exp.endDate, "yyyy")}`;
  }

  return (
    <section id="capabilities" className="border-b border-border py-24">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="font-mono text-sm text-accent">{dict.capabilities.eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {dict.capabilities.title}
          </h2>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="mt-12">
          <TabsList>
            {CATEGORY_ORDER.map((category) => (
              <TabsTrigger key={category} value={category}>
                {dict.capabilities.tabs[category]}
              </TabsTrigger>
            ))}
            <TabsTrigger value="EXPERIENCE">
              {dict.capabilities.tabs.EXPERIENCE}
            </TabsTrigger>
          </TabsList>

          {CATEGORY_ORDER.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="flex flex-wrap gap-3">
                {(grouped.get(category) ?? []).map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </TabsContent>
          ))}

          <TabsContent value="EXPERIENCE">
            <ol className="relative max-w-2xl border-l border-border pl-10">
              {experience.map((exp) => (
                <li key={exp.id} className="relative pb-10 last:pb-0">
                  <span className="absolute -left-[2.55rem] top-1 size-3 rounded-full border-2 border-accent bg-background" />
                  <p className="font-mono text-xs text-muted-foreground">
                    {formatRange(exp)}
                  </p>
                  <h3 className="mt-1 text-lg font-medium text-foreground">
                    {exp.role}
                  </h3>
                  {exp.company && (
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                  )}
                  {exp.description && (
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                      {exp.description}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
