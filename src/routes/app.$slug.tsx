import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Star, Download } from "lucide-react";
import { listApps } from "@/lib/apps.functions";

export const Route = createFileRoute("/app/$slug")({
  loader: async ({ params }) => {
    const all = await listApps();
    const app = all.find((a) => a.slug === params.slug);
    if (!app) throw notFound();
    const pool = all.filter((a) => a.slug !== params.slug);
    const related = [
      ...pool.filter((a) => a.tag === app.tag),
      ...pool.filter((a) => a.tag !== app.tag),
    ].slice(0, 6);
    return { app, related };
  },

  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "App not found — YonoAppsCenter" }, { name: "robots", content: "noindex" }],
      };
    }
    const app = loaderData.app;
    const title = `${app.name} APK Download — YonoAppsCenter`;
    const description =
      app.description.slice(0, 155) ||
      `Download ${app.name}, rated ${app.rating.toFixed(1)} on YonoAppsCenter. Safe, fast and free.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:image", content: app.icon },
        { name: "twitter:image", content: app.icon },
      ],
    };
  },
  errorComponent: ({ error }) => (
    <p
      role="alert"
      className="mx-auto max-w-5xl px-4 py-16 text-center text-sm text-muted-foreground"
    >
      {error.message}
    </p>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-5xl px-4 py-16 text-center">
      <h1 className="text-lg font-bold text-foreground">App not found</h1>
      <Link to="/" className="mt-3 inline-block text-sm font-semibold text-primary">
        Back to all apps
      </Link>
    </div>
  ),
  component: AppDetailPage,
});

function AppDetailPage() {
  const { app, related } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-5xl px-4 py-4">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> All apps
      </Link>

      <article className="mt-4 rounded-2xl border border-border bg-card p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <img
            src={app.icon}
            alt={`${app.name} app icon`}
            width={80}
            height={80}
            className="h-20 w-20 shrink-0 rounded-2xl border border-border object-cover"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              {app.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
                {app.tag}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                {app.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <a
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-shine mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-center text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:shadow-primary/40"
        >
          <Download className="h-4 w-4" />
          Download {app.name}
        </a>

        <section className="mt-6">
          <h2 className="text-base font-bold text-foreground">About this app</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {app.description ||
              `${app.name} is listed on YonoAppsCenter. A detailed description will be added soon.`}
          </p>
        </section>

        <section className="mt-6 rounded-xl border border-border bg-secondary/40 p-4">
          <h2 className="text-base font-bold text-foreground">
            {app.name} — full details &amp; how to earn
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {app.name} is a {app.tag.toLowerCase()} app listed on YonoAppsCenter with a user rating
            of {app.rating.toFixed(1)} out of 5. Download the {app.name} APK from the official link
            above, install it on your Android phone and register with your mobile number to open
            your account. New players usually get a welcome bonus inside {app.name}, so claim it
            before you start. Earning works in three simple ways: play the games and win from your
            skill and daily practice, collect login and festival bonuses that {app.name} adds to
            your wallet, and share your referral code — every friend who joins {app.name} through
            your link adds a commission to your balance. Winnings can be withdrawn to UPI or a bank
            account after you complete the app&apos;s KYC step. Always set a budget before playing,
            start with small stakes, and use only the verified {app.name} link listed on
            YonoAppsCenter.
          </p>
        </section>


        {app.screenshots.length > 0 && (
          <section className="mt-6">
            <h2 className="text-base font-bold text-foreground">Screenshots</h2>
            <div className="-mx-1 mt-3 flex gap-3 overflow-x-auto px-1 pb-2">
              {app.screenshots.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`${app.name} screenshot ${i + 1}`}
                  loading="lazy"
                  className="h-64 w-auto shrink-0 rounded-xl border border-border object-cover"
                />
              ))}
            </div>
          </section>
        )}
      </article>

      {related.length > 0 && (
        <section className="mt-6">
          <h2 className="text-base font-bold text-foreground">Related apps</h2>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                to="/app/$slug"
                params={{ slug: r.slug }}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/50"
              >
                <img
                  src={r.icon}
                  alt={`${r.name} app icon`}
                  width={48}
                  height={48}
                  loading="lazy"
                  className="h-12 w-12 shrink-0 rounded-xl border border-border object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-foreground">{r.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    {r.rating.toFixed(1)} · {r.tag}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
