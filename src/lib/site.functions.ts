import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from "./public-config";

export type SiteSettings = {
  contact_email: string;
  telegram_bot: string;
  telegram_url: string;
  support_note: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
};

export const SETTINGS_COLUMNS =
  "contact_email, telegram_bot, telegram_url, support_note, seo_title, seo_description, seo_keywords";

export const DEFAULT_SETTINGS: SiteSettings = {
  contact_email: "support@moreyonogames.com",
  telegram_bot: "@YonoAppsCenterBot",
  telegram_url: "https://t.me/YonoAppsCenterBot",
  support_note: "",
  seo_title: "YonoAppsCenter — Best Earning & Gaming Apps",
  seo_description: "Discover trusted Android earning and gaming apps in one clean place.",
  seo_keywords: "yono apps, rummy apps, earning apps, slots apps",
};

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

export const getSiteSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteSettings> => {
    const { data, error } = await publicClient()
      .from("site_settings")
      .select(SETTINGS_COLUMNS)
      .limit(1)
      .maybeSingle();
    if (error || !data) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(data as Partial<SiteSettings>) };
  },
);
