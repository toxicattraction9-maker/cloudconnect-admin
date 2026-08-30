import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from "./public-config";

export type AppRow = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  badge: string;
  tag: string;
  rating: number;
  url: string;
  description: string;
  screenshots: string[];
  rank: number;
  featured: boolean;
  featured_rank: number;
  featured_badge: string;
  featured_cta: string;
};

export const APP_COLUMNS =
  "id, slug, name, icon, badge, tag, rating, url, description, screenshots, rank, featured, featured_rank, featured_badge, featured_cta";

function publicClient() {
  const key = PUBLIC_SUPABASE_KEY;
  return createClient(PUBLIC_SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const listApps = createServerFn({ method: "GET" }).handler(async (): Promise<AppRow[]> => {
  const { data, error } = await publicClient()
    .from("apps")
    .select(APP_COLUMNS)
    .order("rank", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({ ...row, rating: Number(row.rating) })) as AppRow[];
});
