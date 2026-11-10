-- Demo services for Nefer Dental Studio (a fictional clinic). Prices are demo values in EGP.
-- Keep in sync with src/data/services.ts, which the site uses before Supabase is connected.

insert into public.services
  (slug, name, description, duration_minutes, price_egp, price_unit, is_popular, sort_order)
values
  ('check-up-and-consultation', 'Check-up and consultation',
   'A full exam, a gum check and a clear treatment plan with prices.',
   30, 500, 'per visit', true, 1),
  ('scaling-and-polishing', 'Scaling and polishing',
   'Removes tartar and surface stains, then polishes every tooth smooth. Recommended every six months.',
   45, 1200, 'per session', true, 2),
  ('tooth-colored-filling', 'Tooth-colored filling',
   'Repairs a cavity with composite resin, shaded to match the tooth around it.',
   45, 1500, 'per tooth', true, 3),
  ('teeth-whitening', 'Teeth whitening',
   'In-clinic whitening for both arches in one visit, with sensitivity care afterwards.',
   60, 6000, 'both arches', true, 4),
  ('root-canal-treatment', 'Root canal treatment',
   'Cleans and seals an infected tooth under local anaesthetic. Most teeth need one or two sessions.',
   60, 3500, 'per session', false, 5),
  ('orthodontic-consultation', 'Orthodontic consultation',
   'Braces or clear aligners: we check your bite, take photos and walk you through the options.',
   30, 700, 'per visit', false, 6),
  ('kids-dental-check-up', 'Kids dental check-up',
   'A gentle check for children from age 4, with fluoride if they need it.',
   30, 450, 'per visit', false, 7),
  ('implant-consultation', 'Implant consultation',
   'Checks whether an implant suits you, with an X-ray review and a written quote.',
   30, 800, 'per visit', false, 8)
on conflict (slug) do nothing;

-- Owner access (run once, after creating the owner in Authentication → Users):
--   insert into public.admin_users (user_id)
--   select id from auth.users where email = 'owner@your-clinic.com';
