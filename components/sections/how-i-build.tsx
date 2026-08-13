import type { Dictionary } from "@/lib/i18n/dictionaries";

export function HowIBuild({ dict }: { dict: Dictionary }) {
  return (
    <section id="how-i-build" className="border-b border-border py-24">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="font-mono text-sm text-accent">{dict.howIBuild.eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {dict.howIBuild.title}
          </h2>
        </div>

        <ol className="relative mt-16 max-w-2xl border-l border-border pl-10">
          {dict.howIBuild.steps.map((step, index) => (
            <li key={step.title} className="relative pb-12 last:pb-0">
              <span className="absolute -left-[3.05rem] flex size-9 items-center justify-center rounded-full border border-border bg-surface font-mono text-xs text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-medium text-foreground">{step.title}</h3>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
