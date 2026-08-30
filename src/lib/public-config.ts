// Public backend config. These are publishable (safe-to-ship) values, kept as
// literal fallbacks so the site builds and runs anywhere (including Vercel)
// without any environment variables being configured by hand.
export const PUBLIC_SUPABASE_URL =
  (import.meta.env["VITE_SUPABASE_URL"] as string | undefined) ||
  "https://fkjhzjshsopgfolnacon.supabase.co";

export const PUBLIC_SUPABASE_KEY =
  (import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined) ||
  "sb_publishable_XyAahgPd3y9XiR8lnhy7Kg__SuQ7Dvf";
