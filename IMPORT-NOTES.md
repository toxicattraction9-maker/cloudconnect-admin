# YonoAppsCenter — import into another Lovable account

1. Create a new project in the other Lovable account and upload this zip
   (or unzip it into a GitHub repo and connect that repo).
2. In the new project, ask Lovable to **enable Lovable Cloud**. This regenerates
   `src/integrations/supabase/*` and `.env` with the NEW backend's keys.
   Those files were intentionally removed from this zip — they belong to the
   original project's backend.
3. Ask Lovable to **apply the SQL in `supabase/migrations/`** (app_details table,
   user_roles table, has_role function, RLS policies and grants).
4. Sign up at `/auth`, then ask Lovable to grant that email the `admin` role.
5. Admin panel: `/admin`. App list data lives in `src/data/apps.ts`.
