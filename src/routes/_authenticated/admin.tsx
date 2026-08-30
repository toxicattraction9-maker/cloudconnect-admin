import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Plus, Save, Star, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { APP_COLUMNS, type AppRow } from "@/lib/apps.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const title = "Admin — YonoAppsCenter";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: "Manage apps, ranking and featured apps on YonoAppsCenter." },
      { property: "og:title", content: title },
      { property: "og:description", content: "Manage apps, ranking and featured apps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Draft = Omit<AppRow, "id" | "screenshots"> & { id?: string; screenshotsText: string };

const emptyDraft: Draft = {
  slug: "",
  name: "",
  icon: "",
  badge: "",
  tag: "New",
  rating: 4.5,
  url: "",
  description: "",
  screenshotsText: "",
  rank: 999,
  featured: false,
  featured_rank: 99,
  featured_badge: "",
  featured_cta: "Play Now",
  seo_title: "",
  seo_description: "",
  seo_keywords: "",
};

function toDraft(app: AppRow): Draft {
  const { screenshots, ...rest } = app;
  return { ...rest, screenshotsText: (screenshots ?? []).join("\n") };
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function AdminPage() {
  const navigate = useNavigate();
  const [apps, setApps] = useState<AppRow[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  async function load() {
    const { data, error } = await supabase
      .from("apps")
      .select(APP_COLUMNS)
      .order("rank", { ascending: true });
    if (error) {
      toast.error(error.message);
      return;
    }
    setApps((data ?? []).map((r) => ({ ...r, rating: Number(r.rating) })) as AppRow[]);
  }

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return;
      const { data } = await supabase.rpc("has_role", { _user_id: uid, _role: "admin" });
      setIsAdmin(Boolean(data));
      await load();
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? apps.filter((a) => a.name.toLowerCase().includes(q)) : apps;
  }, [apps, query]);

  async function save() {
    if (!draft) return;
    if (!draft.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    const payload = {
      slug: draft.slug.trim() || slugify(draft.name),
      name: draft.name.trim(),
      icon: draft.icon.trim(),
      badge: draft.badge.trim(),
      tag: draft.tag.trim() || "New",
      rating: Number(draft.rating) || 0,
      url: draft.url.trim(),
      description: draft.description,
      screenshots: draft.screenshotsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      rank: Number(draft.rank) || 999,
      featured: draft.featured,
      featured_rank: Number(draft.featured_rank) || 99,
      featured_badge: draft.featured_badge.trim(),
      featured_cta: draft.featured_cta.trim() || "Play Now",
      seo_title: draft.seo_title.trim(),
      seo_description: draft.seo_description.trim(),
      seo_keywords: draft.seo_keywords.trim(),
    };
    const { error } = draft.id
      ? await supabase.from("apps").update(payload).eq("id", draft.id)
      : await supabase.from("apps").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(draft.id ? "App updated" : "App added");
    setDraft(null);
    await load();
  }

  async function remove(app: AppRow) {
    if (!confirm(`Delete ${app.name}?`)) return;
    const { error } = await supabase.from("apps").delete().eq("id", app.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("App deleted");
    await load();
  }

  async function move(app: AppRow, dir: -1 | 1) {
    const ordered = [...apps].sort((a, b) => a.rank - b.rank);
    const i = ordered.findIndex((a) => a.id === app.id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= ordered.length) return;
    const other = ordered[j]!;
    const [rankA, rankB] = [app.rank, other.rank];
    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase.from("apps").update({ rank: rankB }).eq("id", app.id),
      supabase.from("apps").update({ rank: rankA }).eq("id", other.id),
    ]);
    const error = e1 ?? e2;
    if (error) {
      toast.error(error.message);
      return;
    }
    await load();
  }

  async function toggleFeatured(app: AppRow) {
    const { error } = await supabase
      .from("apps")
      .update({ featured: !app.featured })
      .eq("id", app.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    await load();
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  if (isAdmin === false) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-lg font-bold text-foreground">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This account does not have admin permissions.
        </p>
        <Button className="mt-4" onClick={signOut}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-extrabold tracking-tight text-foreground">Admin panel</h1>
        <div className="ml-auto flex gap-2">
          <Button size="sm" onClick={() => setDraft({ ...emptyDraft })}>
            <Plus className="h-4 w-4" /> Add app
          </Button>
          <Button size="sm" variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>

      {draft && (
        <section className="mt-5 rounded-2xl border border-border bg-card p-4">
          <h2 className="text-base font-bold text-foreground">
            {draft.id ? `Edit ${draft.name}` : "New app"}
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={draft.slug}
                placeholder={slugify(draft.name)}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="icon">Icon URL</Label>
              <Input
                id="icon"
                value={draft.icon}
                onChange={(e) => setDraft({ ...draft, icon: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="url">Download URL</Label>
              <Input
                id="url"
                value={draft.url}
                onChange={(e) => setDraft({ ...draft, url: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="tag">Category / tag</Label>
              <Input
                id="tag"
                value={draft.tag}
                onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={draft.rating}
                onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="rank">Rank (lower = higher up)</Label>
              <Input
                id="rank"
                type="number"
                value={draft.rank}
                onChange={(e) => setDraft({ ...draft, rank: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="badge">Badge</Label>
              <Input
                id="badge"
                value={draft.badge}
                onChange={(e) => setDraft({ ...draft, badge: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </div>

          <div className="mt-3">
            <Label htmlFor="shots">Screenshot URLs (one per line)</Label>
            <Textarea
              id="shots"
              rows={3}
              value={draft.screenshotsText}
              onChange={(e) => setDraft({ ...draft, screenshotsText: e.target.value })}
            />
          </div>

          <div className="mt-4 rounded-xl border border-border p-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
              />
              Show in Featured Apps (top 3)
            </label>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div>
                <Label htmlFor="frank">Featured position</Label>
                <Input
                  id="frank"
                  type="number"
                  value={draft.featured_rank}
                  onChange={(e) => setDraft({ ...draft, featured_rank: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="fbadge">Featured badge</Label>
                <Input
                  id="fbadge"
                  value={draft.featured_badge}
                  onChange={(e) => setDraft({ ...draft, featured_badge: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="fcta">Button text</Label>
                <Input
                  id="fcta"
                  value={draft.featured_cta}
                  onChange={(e) => setDraft({ ...draft, featured_cta: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-border p-3">
            <p className="text-sm font-bold text-foreground">SEO</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Leave blank and the details are generated automatically from the app name.
            </p>
            <div className="mt-3 grid gap-3">
              <div>
                <Label htmlFor="seotitle">SEO title</Label>
                <Input
                  id="seotitle"
                  value={draft.seo_title}
                  onChange={(e) => setDraft({ ...draft, seo_title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="seodesc">SEO description</Label>
                <Textarea
                  id="seodesc"
                  rows={2}
                  value={draft.seo_description}
                  onChange={(e) => setDraft({ ...draft, seo_description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="seokw">SEO keywords</Label>
                <Input
                  id="seokw"
                  value={draft.seo_keywords}
                  onChange={(e) => setDraft({ ...draft, seo_keywords: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button onClick={save} disabled={saving}>
              <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" onClick={() => setDraft(null)}>
              Cancel
            </Button>
          </div>
        </section>
      )}

      <Input
        className="mt-5"
        placeholder="Search apps..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <ul className="mt-3 space-y-2">
        {filtered.map((app) => (
          <li
            key={app.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
          >
            <span className="w-7 shrink-0 text-center text-xs font-bold text-muted-foreground">
              {app.rank}
            </span>
            <img
              src={app.icon}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-lg border border-border object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-foreground">{app.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {app.tag} · {app.rating.toFixed(1)}
                {app.featured ? ` · featured #${app.featured_rank}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button size="icon" variant="ghost" aria-label="Move up" onClick={() => move(app, -1)}>
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Move down"
                onClick={() => move(app, 1)}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Toggle featured"
                onClick={() => toggleFeatured(app)}
              >
                <Star className={app.featured ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4"} />
              </Button>
              <Button size="sm" variant="outline" onClick={() => setDraft(toDraft(app))}>
                Edit
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Delete app"
                onClick={() => remove(app)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


type Settings = {
  contact_email: string;
  telegram_bot: string;
  telegram_url: string;
  support_note: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
};

function SettingsPanel() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select(
          "contact_email, telegram_bot, telegram_url, support_note, seo_title, seo_description, seo_keywords",
        )
        .limit(1)
        .maybeSingle();
      if (data) setSettings(data as Settings);
    })();
  }, []);

  async function saveSettings() {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase.from("site_settings").update(settings).neq("id", 0);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Settings saved");
  }

  if (!settings) return null;

  return (
    <section className="mt-5 rounded-2xl border border-border bg-card p-4">
      <h2 className="text-base font-bold text-foreground">Contact &amp; site SEO</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="cemail">Contact email</Label>
          <Input
            id="cemail"
            value={settings.contact_email}
            onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="ctg">Telegram bot / handle</Label>
          <Input
            id="ctg"
            value={settings.telegram_bot}
            onChange={(e) => setSettings({ ...settings, telegram_bot: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="ctgurl">Telegram link</Label>
          <Input
            id="ctgurl"
            value={settings.telegram_url}
            onChange={(e) => setSettings({ ...settings, telegram_url: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="skw">Site SEO keywords</Label>
          <Input
            id="skw"
            value={settings.seo_keywords}
            onChange={(e) => setSettings({ ...settings, seo_keywords: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="stitle">Site SEO title</Label>
          <Input
            id="stitle"
            value={settings.seo_title}
            onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="sdesc">Site SEO description</Label>
          <Input
            id="sdesc"
            value={settings.seo_description}
            onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
          />
        </div>
      </div>
      <div className="mt-3">
        <Label htmlFor="snote">Extra support note (shown on Contact page)</Label>
        <Textarea
          id="snote"
          rows={2}
          value={settings.support_note}
          onChange={(e) => setSettings({ ...settings, support_note: e.target.value })}
        />
      </div>
      <Button className="mt-3" onClick={saveSettings} disabled={saving}>
        <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save settings"}
      </Button>
    </section>
  );
}

function TrafficPanel() {
  const [stats, setStats] = useState<{ total: number; day: number; top: [string, number][] } | null>(
    null,
  );

  useEffect(() => {
    (async () => {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data } = await supabase
        .from("page_views")
        .select("path, created_at")
        .order("created_at", { ascending: false })
        .limit(2000);
      if (!data) return;
      const counts = new Map<string, number>();
      let day = 0;
      for (const row of data) {
        counts.set(row.path, (counts.get(row.path) ?? 0) + 1);
        if (row.created_at >= since) day += 1;
      }
      const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
      setStats({ total: data.length, day, top });
    })();
  }, []);

  return (
    <section className="mt-5 rounded-2xl border border-border bg-card p-4">
      <h2 className="text-base font-bold text-foreground">Live traffic</h2>
      {!stats ? (
        <p className="mt-2 text-sm text-muted-foreground">Loading visits…</p>
      ) : (
        <>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs text-muted-foreground">Views (last 24h)</p>
              <p className="text-xl font-extrabold text-foreground">{stats.day}</p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs text-muted-foreground">Recent views tracked</p>
              <p className="text-xl font-extrabold text-foreground">{stats.total}</p>
            </div>
          </div>
          <ul className="mt-3 space-y-1 text-sm">
            {stats.top.map(([path, count]) => (
              <li key={path} className="flex justify-between gap-3 text-muted-foreground">
                <span className="truncate">{path}</span>
                <span className="font-semibold text-foreground">{count}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
