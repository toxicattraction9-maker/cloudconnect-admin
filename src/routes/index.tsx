import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Star,
  ShieldCheck,
  Zap,
  BadgeCheck,
  Download,
  Trophy,
  Headset,
  Wallet,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { listApps, type AppRow } from "@/lib/apps.functions";
import { Input } from "@/components/ui/input";

const title = "YonoAppsCenter — Best Earning & Gaming Apps List";
const description =
  "Browse a clean, searchable list of the best Android earning and gaming apps. Filter by new, trending and editor's choice — fast, safe and free.";

export const Route = createFileRoute("/")({
  loader: () => listApps(),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  errorComponent: ({ error }) => (
    <p
      role="alert"
      className="mx-auto max-w-5xl px-4 py-16 text-center text-sm text-muted-foreground"
    >
      {error.message}
    </p>
  ),
  notFoundComponent: () => (
    <p className="mx-auto max-w-5xl px-4 py-16 text-center text-sm text-muted-foreground">
      No apps found.
    </p>
  ),
  component: Index,
});

function AppCard({ app }: { app: AppRow }) {
  return (
    <Link
      to="/app/$slug"
      params={{ slug: app.slug }}
      className="group relative flex items-center gap-3 rounded-2xl border border-border bg-gradient-to-br from-card to-accent/40 p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/15"
    >
      <span className="w-5 shrink-0 text-center text-xs font-extrabold text-primary/70">
        {app.rank}
      </span>
      <img
        src={app.icon}
        alt={`${app.name} app icon`}
        width={56}
        height={56}
        loading="lazy"
        className="h-14 w-14 shrink-0 rounded-xl border border-border object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-foreground">{app.name}</span>
        <span className="mt-1 flex items-center gap-2">
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
            {app.tag}
          </span>
          <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-foreground/80">
            <Star className="h-3 w-3 fill-primary text-primary" />
            {app.rating.toFixed(1)}
          </span>
        </span>
      </span>
      <span className="btn-shine inline-flex shrink-0 items-center gap-1 rounded-lg bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-md shadow-primary/30 transition-transform duration-300 group-hover:scale-105">
        <Download className="h-3.5 w-3.5" />
        Download
      </span>
    </Link>
  );
}

function FeaturedCard({ app, primary }: { app: AppRow; primary: boolean }) {
  return (
    <article
      className={
        "rounded-2xl border bg-card p-4 " +
        (primary ? "border-primary/60 shadow-lg shadow-primary/10" : "border-border")
      }
    >
      <div className="flex items-start gap-3">
        <img
          src={app.icon}
          alt={`${app.name} app icon`}
          width={56}
          height={56}
          loading="lazy"
          className="h-14 w-14 shrink-0 rounded-xl border border-border object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-extrabold tracking-tight text-foreground">{app.name}</h3>
            {app.featured_badge && (
              <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                {app.featured_badge}
              </span>
            )}
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{app.description}</p>
        </div>
      </div>
      <Link
        to="/app/$slug"
        params={{ slug: app.slug }}
        className={
          "mt-3 flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-bold transition-colors " +
          (primary
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "border border-border bg-background text-primary hover:bg-accent")
        }
      >
        {app.featured_cta || "Play Now"}
      </Link>
    </article>
  );
}

function Index() {
  const allApps = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All Apps");

  const featured = useMemo(
    () =>
      allApps
        .filter((a) => a.featured)
        .sort((a, b) => a.featured_rank - b.featured_rank)
        .slice(0, 3),
    [allApps],
  );

  const categories = useMemo(() => ["All Apps", "New App"], []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allApps.filter(
      (a) =>
        (category === "All Apps" || (category === "New App" && a.tag === "New")) &&
        (q === "" || a.name.toLowerCase().includes(q)),
    );
  }, [query, category, allApps]);

  return (
    <div className="mx-auto max-w-5xl px-4 pt-4">
      {/* Banner */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <img
          src="/images/banner.jpg"
          alt="YonoAppsCenter — upload, download and earn with top third-party apps"
          width={1600}
          height={840}
          className="w-full object-cover"
        />
        <div className="p-4 sm:p-6">
          <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Yono<span className="text-primary">AppsCenter</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Handpicked earning &amp; gaming apps — updated daily.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { icon: ShieldCheck, label: "100% Safe" },
              { icon: Zap, label: "Fast Download" },
              { icon: BadgeCheck, label: "Trusted Apps" },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground"
              >
                <Icon className="h-3.5 w-3.5 text-primary" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Search */}
      <div className="relative mt-5">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search apps..."
          aria-label="Search apps"
          className="h-12 rounded-xl pl-9 text-sm"
        />
      </div>

      {/* Categories */}
      <div className="-mx-4 mt-4 overflow-x-auto px-4 pb-1">
        <div className="flex w-max gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={
                "whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition-colors " +
                (category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground")
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <section className="mt-5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-base font-bold text-foreground">{category}</h2>
          <span className="text-xs text-muted-foreground">{filtered.length} apps</span>
        </div>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {filtered.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="py-14 text-center text-sm text-muted-foreground">
            No apps found for "{query}".
          </p>
        )}
      </section>

      {/* Featured apps — shown after the full list */}
      {featured.length > 0 && (
        <section className="mt-6 rounded-2xl border border-border bg-secondary/50 p-4 sm:p-6">
          <div className="text-center">
            <span className="inline-block rounded-full bg-background px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
              Featured Apps
            </span>
            <h2 className="mt-3 text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              All New Yono Apps
            </h2>
            <p className="mx-auto mt-1 max-w-xl text-sm text-muted-foreground">
              Curated selection of top-rated gaming apps with secure play, fast withdrawals, and
              daily rewards.
            </p>
          </div>
          <div className="mt-4 grid gap-3">
            {featured.map((app, i) => (
              <FeaturedCard key={app.id} app={app} primary={i === 0} />
            ))}
          </div>
        </section>
      )}

      <HomeInfoSections />
    </div>
  );
}

const highlights = [
  { icon: Trophy, title: "Compete & Win", text: "Play skill-based games and win real rewards every day." },
  { icon: Wallet, title: "Fast Withdrawals", text: "Quick and secure payouts directly to your account." },
  { icon: Headset, title: "24x7 Support", text: "Round-the-clock help whenever you need it." },
  { icon: Sparkles, title: "Daily Rewards", text: "Login bonuses, referral rewards and special events." },
];

const stats = [
  { value: "90+", label: "Apps & Games" },
  { value: "25K+", label: "Active Players" },
  { value: "125+", label: "Tournaments" },
  { value: "₹100", label: "Min Withdrawal" },
];

const moods = [
  {
    title: "Card & Strategy",
    text: "Rummy, poker and teen patti style games where smart planning decides every hand.",
  },
  {
    title: "Slots & Spin",
    text: "Fast spin games with daily jackpots, free spins and instant wallet credits.",
  },
  {
    title: "Colour & Number",
    text: "Simple prediction games that need small stakes and quick decisions.",
  },
  {
    title: "Fantasy & Adventure",
    text: "Tournament-based titles with leaderboards, seasons and bigger prize pools.",
  },
  {
    title: "Casual Games",
    text: "Easy-going titles for short breaks — ludo, bingo and arcade fun.",
  },
  {
    title: "Quick Challenges",
    text: "Fast-paced matches that test timing, focus and reaction in under a minute.",
  },
];

const whyPoints = [
  {
    title: "Fresh & Updated Collection",
    text: "Popular apps plus new releases, with ratings and details arranged in a simple way.",
  },
  {
    title: "Easy Navigation",
    text: "Search, filter by category and open any app page without confusing menus.",
  },
  {
    title: "Every Genre Covered",
    text: "Card, slots, colour prediction, fantasy and casual apps in one single list.",
  },
];


const tips = [
  {
    title: "Start Smart: Tips for New Players",
    points: [
      "Begin with practice or low-stake games to learn the rules.",
      "Set a daily budget and stick to it — play responsibly.",
      "Claim welcome bonuses and daily rewards before you play.",
    ],
  },
  {
    title: "Win More Games",
    points: [
      "Learn one game well instead of jumping between many.",
      "Watch how experienced players build their strategies.",
      "Use free tournaments to sharpen your skills risk-free.",
    ],
  },
  {
    title: "It's Encouraging Rewards",
    points: [
      "Earn cashback, referral bonuses and festival offers.",
      "Withdraw winnings quickly with trusted payment methods.",
      "Regular players unlock VIP perks and bigger bonuses.",
    ],
  },
];

const faqs = [
  {
    q: "How to Download?",
    a: "Tap the Download button on any app card, open the app detail page and follow the install steps. All apps install in under a minute.",
  },
  {
    q: "Is it Safe?",
    a: "Yes. Every app listed on YonoAppsCenter is checked for security, fair play and reliable withdrawals before being published.",
  },
  {
    q: "Is it free to use?",
    a: "YonoAppsCenter is 100% free. Browse, compare and download any app without charges or sign-up.",
  },
  {
    q: "How often are new apps added?",
    a: "Our list is updated daily with the newest earning and gaming apps, so check back often for fresh picks.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-foreground"
      >
        {q}
        <ChevronDown
          className={
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform " +
            (open ? "rotate-180" : "")
          }
        />
      </button>
      {open && <p className="px-4 pb-3 text-sm leading-relaxed text-muted-foreground">{a}</p>}
    </div>
  );
}

function HomeInfoSections() {
  return (
    <>
      {/* Stats */}
      <section className="mt-8 grid grid-cols-2 gap-3 rounded-2xl border border-border bg-secondary/50 p-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-xl font-extrabold tracking-tight text-primary sm:text-2xl">
              {s.value}
            </p>
            <p className="mt-0.5 text-xs font-medium text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Highlights */}
      <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">

        {highlights.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-2xl border border-border bg-card p-4 text-center shadow-sm"
          >
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
              <Icon className="h-5 w-5 text-primary" />
            </span>
            <h3 className="mt-2 text-sm font-bold text-foreground">{title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
          </div>
        ))}
      </section>

      {/* About — English */}
      <section className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h2 className="text-xl font-extrabold tracking-tight text-foreground">
          About Yono<span className="text-primary">AppsCenter</span>
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          YonoAppsCenter is a free directory where you can find, compare and download the best
          Android earning and gaming apps in one place. Every app listed on YonoAppsCenter is
          checked by hand for safe gameplay, fast withdrawals and genuine daily rewards, so
          beginners can start without confusion. The team behind YonoAppsCenter updates the ranking
          every day using real ratings, install trends and user feedback, which means the list you
          see on YonoAppsCenter is always fresh. You do not need an account to browse
          YonoAppsCenter — just search, open an app page, read the details and tap download.
          YonoAppsCenter also explains how each app pays, which bonus offers are running and what a
          new player should do first. Use YonoAppsCenter to avoid fake links and copy apps, because
          every download button on YonoAppsCenter points to the official source. Bookmark this
          page and check back daily for new picks.

        </p>
      </section>

      {/* About — Hindi */}
      <section className="mt-4 rounded-2xl border border-border bg-card p-5 sm:p-6" lang="hi">
        <h2 className="text-xl font-extrabold tracking-tight text-foreground">
          YonoAppsCenter के बारे में (हिंदी)
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          YonoAppsCenter एक फ्री डायरेक्टरी है जहाँ आपको सबसे भरोसेमंद Android earning और gaming
          ऐप्स एक ही जगह मिलते हैं। YonoAppsCenter पर लिस्ट होने वाला हर ऐप पहले चेक किया जाता है —
          सुरक्षित गेमप्ले, तेज़ विदड्रॉल और असली डेली रिवॉर्ड। नए यूज़र भी YonoAppsCenter की मदद से
          आसानी से शुरुआत कर सकते हैं, क्योंकि हर ऐप का डिटेल पेज बताता है कि कमाई कैसे होती है और
          बोनस कैसे मिलता है। YonoAppsCenter की रैंकिंग रोज़ अपडेट होती है, इसलिए ऊपर वही ऐप दिखते
          हैं जिन्हें यूज़र सबसे ज़्यादा पसंद कर रहे हैं। YonoAppsCenter इस्तेमाल करने के लिए किसी
          अकाउंट या पेमेंट की ज़रूरत नहीं है। नकली लिंक और डुप्लीकेट ऐप से बचने के लिए हमेशा
          YonoAppsCenter का डाउनलोड बटन ही इस्तेमाल करें। ज़िम्मेदारी से खेलें, अपना बजट तय करें और
          नए ऐप्स के लिए रोज़ YonoAppsCenter पर आते रहें। YonoAppsCenter आपकी भरोसेमंद जगह है।
        </p>
      </section>


      {/* Tips */}
      <section className="mt-8">
        <h2 className="text-xl font-extrabold tracking-tight text-foreground">
          Start Smart: Play &amp; Win More
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {tips.map((tip) => (
            <article key={tip.title} className="rounded-2xl border border-border bg-card p-4">
              <h3 className="text-sm font-bold text-foreground">{tip.title}</h3>
              <ul className="mt-2 space-y-1.5">
                {tip.points.map((p) => (
                  <li key={p} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                    <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Why explore */}
      <section className="mt-8">
        <h2 className="text-xl font-extrabold tracking-tight text-foreground">
          Why Explore Apps Here?
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {whyPoints.map((w) => (
            <article key={w.title} className="rounded-2xl border border-border bg-card p-4">
              <h3 className="text-sm font-bold text-foreground">{w.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{w.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Games for every mood */}
      <section className="mt-8">
        <h2 className="text-xl font-extrabold tracking-tight text-foreground">
          Games for Every Mood
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Whether you enjoy a competitive challenge or prefer something relaxing, every play style
          is covered in one collection.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {moods.map((m) => (
            <article key={m.title} className="rounded-2xl border border-border bg-card p-4">
              <h3 className="text-sm font-bold text-foreground">{m.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{m.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Collection + payments */}
      <section className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h2 className="text-xl font-extrabold tracking-tight text-foreground">
          All Yono Apps Collection 2026
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Explore Yono slots, bingo, rummy, colour prediction and more. Every listed app is
          optimised for Indian players, with a minimum withdrawal starting from ₹100 and instant
          payouts supported through popular payment apps.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["UPI", "Paytm", "PhonePe", "GPay", "Bank Transfer"].map((p) => (
            <span
              key={p}
              className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground"
            >
              {p}
            </span>
          ))}
        </div>
      </section>

      {/* Legal alert */}
      <section className="mt-4 grid gap-3 sm:grid-cols-2">
        <article className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4">
          <h3 className="text-sm font-bold text-foreground">Important Legal Alert</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Rummy and real-money gaming apps are restricted in certain regions. They are prohibited
            by government regulations in Andhra Pradesh, Sikkim, Nagaland, Assam, Arunachal Pradesh,
            Tamil Nadu, Odisha and Telangana. Residents of these states should not download or play
            these apps.
          </p>
        </article>
        <article className="rounded-2xl border border-border bg-card p-4">
          <h3 className="text-sm font-bold text-foreground">Platform Disclaimer</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            YonoAppsCenter is an independent informational directory. We do not operate or own any
            third-party app listed here. Real-money apps involve financial risk — play responsibly
            and only if you are 18+.
          </p>
        </article>
      </section>

      {/* FAQ */}

      <section className="mt-8 mb-8">
        <h2 className="text-xl font-extrabold tracking-tight text-foreground">
          Frequently Asked Questions
        </h2>
        <div className="mt-4 grid gap-2.5">
          {faqs.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>
    </>
  );
}
