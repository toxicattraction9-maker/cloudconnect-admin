CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

CREATE POLICY "Users can read their own roles"
  ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  icon text NOT NULL DEFAULT '',
  badge text NOT NULL DEFAULT '',
  tag text NOT NULL DEFAULT 'New',
  rating numeric(2,1) NOT NULL DEFAULT 4.5,
  url text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  screenshots text[] NOT NULL DEFAULT '{}',
  rank integer NOT NULL DEFAULT 999,
  featured boolean NOT NULL DEFAULT false,
  featured_rank integer NOT NULL DEFAULT 0,
  featured_badge text NOT NULL DEFAULT '',
  featured_cta text NOT NULL DEFAULT 'Play Now',
  seo_title text NOT NULL DEFAULT '',
  seo_description text NOT NULL DEFAULT '',
  seo_keywords text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.apps TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.apps TO authenticated;
GRANT ALL ON public.apps TO service_role;
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read apps" ON public.apps FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert apps" ON public.apps FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update apps" ON public.apps FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete apps" ON public.apps FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER apps_set_updated_at BEFORE UPDATE ON public.apps
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.apps_autofill()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.slug IS NULL OR btrim(NEW.slug) = '' THEN
    NEW.slug = trim(both '-' from regexp_replace(lower(NEW.name), '[^a-z0-9]+', '-', 'g'));
  END IF;
  IF btrim(NEW.url) = '' THEN
    NEW.url = 'https://www.yonohub.shop/app/' || NEW.slug;
  END IF;
  IF btrim(NEW.description) = '' THEN
    NEW.description = NEW.name || ' is a trusted Android app listed on YonoAppsCenter. Download the latest version of '
      || NEW.name || ', enjoy smooth gameplay, daily bonuses, fast deposits and quick withdrawals with 24x7 support. '
      || NEW.name || ' ek bharosemand Android app hai. Naya version download karein, daily bonus payein aur turant withdrawal ka maza lein.';
  END IF;
  IF btrim(NEW.seo_title) = '' THEN
    NEW.seo_title = NEW.name || ' APK Download — Latest Version | YonoAppsCenter';
  END IF;
  IF btrim(NEW.seo_description) = '' THEN
    NEW.seo_description = 'Download ' || NEW.name || ' latest version. Rating, screenshots, bonus details and safe download link for '
      || NEW.name || ' on YonoAppsCenter.';
  END IF;
  IF btrim(NEW.seo_keywords) = '' THEN
    NEW.seo_keywords = lower(NEW.name) || ', ' || lower(NEW.name) || ' apk, ' || lower(NEW.name) || ' download, ' || NEW.slug || ', yono apps center';
  END IF;
  IF btrim(NEW.featured_badge) = '' AND NEW.featured THEN
    NEW.featured_badge = 'FEATURED';
  END IF;
  IF NEW.rank IS NULL OR NEW.rank = 999 THEN
    NEW.rank = COALESCE((SELECT max(rank) + 1 FROM public.apps WHERE rank < 900), 1);
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.apps_autofill() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER apps_autofill_before_insert BEFORE INSERT ON public.apps
  FOR EACH ROW EXECUTE FUNCTION public.apps_autofill();

CREATE TABLE public.site_settings (
  id boolean PRIMARY KEY DEFAULT true,
  contact_email text NOT NULL DEFAULT 'support@moreyonogames.com',
  telegram_bot text NOT NULL DEFAULT '@YonoAppsCenterBot',
  telegram_url text NOT NULL DEFAULT 'https://t.me/YonoAppsCenterBot',
  support_note text NOT NULL DEFAULT '',
  seo_title text NOT NULL DEFAULT 'YonoAppsCenter — Best Earning & Gaming Apps',
  seo_description text NOT NULL DEFAULT 'Discover trusted Android earning and gaming apps in one clean place.',
  seo_keywords text NOT NULL DEFAULT 'yono apps, rummy apps, earning apps, slots apps',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_single_row CHECK (id)
);

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER site_settings_set_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_settings (id) VALUES (true);

CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL DEFAULT '/',
  referrer text NOT NULL DEFAULT '',
  session_id text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX page_views_created_at_idx ON public.page_views (created_at DESC);

GRANT INSERT ON public.page_views TO anon, authenticated;
GRANT SELECT ON public.page_views TO authenticated;
GRANT ALL ON public.page_views TO service_role;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record a view" ON public.page_views FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read views" ON public.page_views FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.apps (slug, name, icon, badge, tag, rating, url, rank)
SELECT v.slug, v.name, v.icon, v.badge, v.tag, v.rating,
       'https://www.yonohub.shop/app/' || v.slug,
       (row_number() OVER ())::int
FROM (VALUES
('ind-rummy','Ind Rummy','https://i.ibb.co/0y4qBLXH/logo-17.png','top','New',4.8),
('rummy-ludo','Rummy Ludo','https://i.ibb.co/LhQXnqXn/logo-3.png','','New',4.6),
('goldrummy','GOLDRUMMY','https://crjcrqhldkmjgnnbuqao.supabase.co/storage/v1/object/public/media/apps/83c13121-bae0-47e7-9a1f-4f9bb933f95a.jpg','New','New',4),
('bingo-101','Bingo 101','https://i.ibb.co/jPfwGJts/logo-36.png','Top','New',4),
('hindi777','HINDI777','https://crjcrqhldkmjgnnbuqao.supabase.co/storage/v1/object/public/media/apps/5202196d-f394-4c61-aaea-338ad66abeb1.jpg','Top Win','New',5),
('diwa-x','DIWA X','https://crjcrqhldkmjgnnbuqao.supabase.co/storage/v1/object/public/media/apps/dcdaf43b-07fc-443a-ad05-c8b219dfd942.jpg','New','New',4.7),
('yono-games','YONO GAMES','https://crjcrqhldkmjgnnbuqao.supabase.co/storage/v1/object/public/media/apps/a1374d73-7503-4606-9f5b-4d62908d56e2.jpg','HOT','New',5),
('win-rummy','Win Rummy','https://crjcrqhldkmjgnnbuqao.supabase.co/storage/v1/object/public/media/apps/0c0cd3ef-af24-4f90-a9e9-300e96cc95b1.jpg','New','New',4.1),
('boss-rummy','Boss Rummy','https://i.ibb.co/XM0ysYV/693b9926245fa.png','Hot','New',4.1),
('yono-rummy','Yono Rummy','https://i.ibb.co/ycLnwxnH/logo-41.png','','New',5),
('dhan-game','Dhan Game','https://crjcrqhldkmjgnnbuqao.supabase.co/storage/v1/object/public/media/apps/046507b2-19f7-4205-ad12-167b7f9b73d6.jpg','New','New',4.7),
('max-rummy','Max Rummy','https://crjcrqhldkmjgnnbuqao.supabase.co/storage/v1/object/public/media/apps/7465a5ac-e8e7-470b-af14-d7b03715c6bc.jpg','New','New',4.3),
('diwa-game','Diwa Game','https://crjcrqhldkmjgnnbuqao.supabase.co/storage/v1/object/public/media/apps/73ae1d34-494c-4e3f-8ebf-abbcb5023e3d.webp','Hot','New',4.8),
('raja-luck','RAJA LUCK','https://crjcrqhldkmjgnnbuqao.supabase.co/storage/v1/object/public/media/apps/c02e2879-2d0e-4757-9b65-351b0ad06574.jpg','Hot','Trending',5),
('good-slots','GOOD SLOTS','https://crjcrqhldkmjgnnbuqao.supabase.co/storage/v1/object/public/media/apps/ffe790b4-244e-4d94-95d2-1c09cbbb7ced.jpg','Hot','Trending',4.4),
('mqm-bet','MQM BET','https://crjcrqhldkmjgnnbuqao.supabase.co/storage/v1/object/public/media/apps/57b54f0a-35d3-495b-b71b-c93c2d3176b2.jpg','Hot','Trending',4.8),
('yn777','YN777','https://crjcrqhldkmjgnnbuqao.supabase.co/storage/v1/object/public/media/apps/ef357126-eade-4907-bf1b-7178d2d8480f.jpg','','Earning',4.4),
('slots-spin','SLOTS SPIN','https://crjcrqhldkmjgnnbuqao.supabase.co/storage/v1/object/public/media/apps/e5bf08c9-613b-460d-af8e-7fa210e57529.jpg','','Earning',4.2),
('hi-rummy','HI RUMMY','https://crjcrqhldkmjgnnbuqao.supabase.co/storage/v1/object/public/media/apps/643078db-25d0-4c39-9682-eaf87dce32ab.jpg','','Earning',4.9),
('rummy91','RUMMY91','https://crjcrqhldkmjgnnbuqao.supabase.co/storage/v1/object/public/media/apps/9c2bba93-9072-4ee6-9126-771863f31269.jpg','','Earning',4.5),
('101z','101z','https://crjcrqhldkmjgnnbuqao.supabase.co/storage/v1/object/public/media/apps/8ef25f1b-09ee-4da2-b756-1692258e94c6.webp','','Earning',4.2),
('jaihoslots','JAIHOSLOTS','https://crjcrqhldkmjgnnbuqao.supabase.co/storage/v1/object/public/media/apps/0ca5c323-f1b5-42b1-b499-744e1f17246f.webp','','Earning',4.3),
('mbm-bet','MBM BET','https://crjcrqhldkmjgnnbuqao.supabase.co/storage/v1/object/public/media/apps/810ee725-6780-4a0d-9874-74801d815238.jpg','','Editor''s Choice',4.3),
('diwa777','Diwa777','https://crjcrqhldkmjgnnbuqao.supabase.co/storage/v1/object/public/media/apps/947961ff-4f12-4b9a-bd96-f24685535822.jpg','Hot','Editor''s Choice',4.5),
('diwa-win','Diwa Win','https://crjcrqhldkmjgnnbuqao.supabase.co/storage/v1/object/public/media/apps/8b7a7064-541b-4b99-9522-f5778647ccec.webp','New','New',5),
('diwa-vip','Diwa Vip','https://crjcrqhldkmjgnnbuqao.supabase.co/storage/v1/object/public/media/apps/aab0fd97-bee7-4905-bc58-61c67bf8d952.jpg','New','New',4.4),
('diwa-top','Diwa Top','https://crjcrqhldkmjgnnbuqao.supabase.co/storage/v1/object/public/media/apps/0e78c31c-0348-4d23-8764-934407643a9b.webp','New','Earning',4.6),
('ind-slots','Ind Slots','https://i.ibb.co/qLFb2hwk/logo-19.png','','Trending',4.8),
('yono-slots','Yono Slots','https://i.ibb.co/ycLnwxnH/logo-41.png','','Trending',4.8),
('top-rummy','Top Rummy','https://i.ibb.co/wNG83MLx/logo-2.png','','Editor''s Choice',4.4),
('jaiho-arcade','Jaiho Arcade','https://i.ibb.co/8LG0MGfr/logo-21.png','','Editor''s Choice',4.6),
('neta-vip','Neta Vip','https://i.ibb.co/4nN1fr9t/logo.png','','New',5),
('slots-winner','Slots Winner','https://i.ibb.co/Zzn4QH97/logo-25.png','','New',4.6),
('yono-vip','Yono Vip','https://i.ibb.co/MxYnrNKV/logo-40.png','','Editor''s Choice',4.9),
('yono-777','Yono 777','https://i.ibb.co/HfkP7q9n/logo-44.png','','Trending',4.8),
('joy-rummy','Joy Rummy','https://i.ibb.co/YTj93TXm/695cdb6aefd5f.jpg','','Editor''s Choice',4.5),
('jaiho-rummy','Jaiho Rummy','https://i.ibb.co/GQB7mrK8/logo-23.png','','Editor''s Choice',5),
('spin-777','Spin 777','https://i.ibb.co/mF65q9pR/logo-31.png','','Trending',4),
('gogo-rummy','Gogo Rummy','https://i.ibb.co/tpRcmxwr/logo-34.png','','New',5),
('spin-winner','Spin Winner','https://i.ibb.co/ycPJqxVD/logo-32.png','','Editor''s Choice',4.2),
('inr-rummy','Inr Rummy','https://i.ibb.co/67WX681g/6948fb4665db0.png','','Trending',4.1),
('game-rummy','Game Rummy','https://i.ibb.co/HDJzJQNN/logo-9.png','','New',4.7),
('jaiho-win','Jaiho Win','https://i.ibb.co/8n00h0L1/logo-16.png','','Editor''s Choice',4),
('love-rummy','Love Rummy','https://i.ibb.co/216Yk8yx/logo-12.png','','Trending',4.3),
('rumble-rummy','Rumble Rummy','https://i.ibb.co/mr8GyZRw/logo-8.png','','New',5),
('spin-gold','Spin Gold','https://i.ibb.co/20WFWD3y/logo-30.png','','Editor''s Choice',4.7),
('jaiho-91','JAIHO 91','https://iili.io/BijDIFp.jpg','','Trending',5),
('ind-club','Ind Club','https://i.ibb.co/nNGfzhN4/logo-18.png','','New',4.1),
('rummy-888','Rummy 888','https://i.ibb.co/sdFmWGrk/Rummy888.png','','Editor''s Choice',4.3),
('spin-101','Spin 101','https://i.ibb.co/gLkdKNqG/logo-29.png','','New',4.8),
('bet-213','Bet 213','https://i.ibb.co/SHgfGxK/logo-35.png','','Editor''s Choice',4.2),
('yono-arcade','Yono Arcade','https://i.ibb.co/QjQp9CLF/logo-42.png','','Trending',4.8),
('jaiho-777','Jaiho 777','https://i.ibb.co/YT14LQfG/logo-22.png','','New',4.5),
('jaiho-spin','Jaiho Spin','https://i.ibb.co/fzQ2S4wM/logo-24.png','','Editor''s Choice',5),
('789-jackpot','789 Jackpot','https://i.ibb.co/d4sQ2sgy/logo-33.png','','Trending',5),
('share-slots','Share Slots','https://i.ibb.co/Jj3GS6QC/logo-13.png','','New',4.7),
('maha-games','Maha Games','https://i.ibb.co/WvWqhVj8/logo-14.png','','Editor''s Choice',4.3),
('777-game','777 Game','https://i.ibb.co/ds8WWP1Z/logo-4.png','','Trending',4.6),
('ok-rummy','Ok Rummy','https://i.ibb.co/M5WGGDSy/logo.png','','New',4.6),
('rummy-77','Rummy 77','https://i.ibb.co/YBv1f8D7/Rummy77.png','','Editor''s Choice',4.5),
('saga-slots','Saga Slots','https://i.ibb.co/b55wNKN5/logo-26.png','','Trending',4),
('spin-crush','Spin Crush','https://i.ibb.co/211Yrr1v/logo-28.png','','New',4.4),
('567-slots','567 Slots','https://i.ibb.co/PzjdKb9s/logo-39.png','','Editor''s Choice',4.5),
('club-inr','Club Inr','https://i.ibb.co/sph1Zrxh/logo-10.png','','New',5),
('diwa-slot','Diwa Slot','https://iili.io/B4y5d2p.jpg','','Editor''s Choice',5)
) AS v(slug, name, icon, badge, tag, rating);

UPDATE public.apps SET featured = true, featured_rank = 1, featured_badge = '#1 RUMMY APP', featured_cta = 'Play Now',
  description = 'Trusted app with daily bonuses & withdrawals from Rs.100. Play Points, Pool, & Deals Rummy with smooth gameplay and 24/7 support.'
  WHERE slug = 'yono-rummy';
UPDATE public.apps SET featured = true, featured_rank = 2, featured_badge = 'PREMIUM EXPERIENCE', featured_cta = 'VIP Access',
  description = 'Combines slots, poker, rummy, & arcade in one platform. Unlock exclusive tournaments, higher limits, & priority bonuses.'
  WHERE slug = 'yono-vip';
UPDATE public.apps SET featured = true, featured_rank = 3, featured_badge = 'ALL-IN-ONE HUB', featured_cta = 'Browse Hub',
  description = 'Offers slots, card games, & arcade fun with instant welcome bonuses, daily tournaments, & a lag-free experience.'
  WHERE slug = 'yono-games';
