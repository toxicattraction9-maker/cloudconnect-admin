import type { ReactNode } from "react";

export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{intro}</p>
      <div className="mt-8 space-y-6">{children}</div>
    </div>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-base font-bold text-foreground">{heading}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}
