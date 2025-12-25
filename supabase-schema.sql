-- Dars (درس) Database Schema - Admin Features
-- Run this in your Supabase SQL Editor

-- Create mosques table
create table if not exists mosques (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  location_url text,
  created_at timestamp with time zone default now()
);

-- Create lessons table (updated with scheduling fields)
create table if not exists lessons (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  lecturer text not null,
  mosque_id uuid references mosques(id) on delete set null,
  mosque_name text not null,
  day text not null,
  time_relation text not null,
  frequency text not null,
  total_lessons integer default 1,
  start_date date,
  end_date date,
  description text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table mosques enable row level security;
alter table lessons enable row level security;

-- Public read access
create policy "Allow public read mosques" on mosques for select to public using (true);
create policy "Allow public read lessons" on lessons for select to public using (true);

-- Admin write access
create policy "Allow all mosques" on mosques for all using (true);
create policy "Allow all lessons" on lessons for all using (true);

-- Seed mosques from the provided list
insert into mosques (name, location_url)
values 
('الجامع الكبير بتلمسان', 'https://www.google.com/maps/search/?api=1&query=Great+Mosque+of+Tlemcen'),
('مسجد سيدي بومدين', 'https://www.google.com/maps/search/?api=1&query=Sidi+Boumediene+Mosque'),
('مسجد سيدي الحلوي', 'https://www.google.com/maps/search/?api=1&query=Sidi+El+Haloui+Mosque'),
('مسجد المشور', 'https://www.google.com/maps/search/?api=1&query=El+Mechouar+Mosque'),
('مسجد سيدي بلحسن', 'https://www.google.com/maps/search/?api=1&query=Sidi+Belahcen+Mosque'),
('مسجد المنصورة', 'https://www.google.com/maps/search/?api=1&query=Mansourah+Mosque'),
('مسجد أغادير', 'https://www.google.com/maps/search/?api=1&query=Agadir+Mosque+Tlemcen'),
('مسجد أولاد الإمام', 'https://www.google.com/maps/search/?api=1&query=Oulad+El+Imam+Mosque'),
('مسجد لالة روية', 'https://www.google.com/maps/search/?api=1&query=Lalla+Ruya+Mosque'),
('مسجد لالة غريبة', 'https://www.google.com/maps/search/?api=1&query=Lalla+Ghriba+Mosque'),
('مسجد سيدي إبراهيم المصمودي', 'https://www.google.com/maps/search/?api=1&query=Sidi+Ibrahim+Al-Masmoudi+Mosque'),
('مسجد الإمام الغزالي', 'https://www.google.com/maps/search/?api=1&query=Al-Imam+Al-Ghazali+Mosque+Tlemcen'),
('مسجد أبي بكر الصديق', 'https://www.google.com/maps/search/?api=1&query=Abu+Bakr+Al-Siddiq+Mosque+Tlemcen'),
('مسجد عمر بن الخطاب', 'https://www.google.com/maps/search/?api=1&query=Omar+Ibn+Al-Khattab+Mosque+Tlemcen'),
('مسجد عثمان بن عفان', 'https://www.google.com/maps/search/?api=1&query=Othman+Ibn+Affan+Mosque+Tlemcen'),
('مسجد علي بن أبي طالب', 'https://www.google.com/maps/search/?api=1&query=Ali+Ibn+Abi+Talib+Mosque+Tlemcen'),
('مسجد الرحمة', 'https://www.google.com/maps/search/?api=1&query=Al-Rahma+Mosque+Tlemcen'),
('مسجد الفتح', 'https://www.google.com/maps/search/?api=1&query=Al-Fath+Mosque+Tlemcen'),
('مسجد ابن باديس', 'https://www.google.com/maps/search/?api=1&query=Ibn+Badis+Mosque+Tlemcen'),
('مسجد الكوثر', 'https://www.google.com/maps/search/?api=1&query=Al-Kawthar+Mosque+Tlemcen'),
('مسجد سيدي السنوسي', 'https://www.google.com/maps/search/?api=1&query=Sidi+Senouci+Mosque'),
('مسجد سيدي الوهاب', 'https://www.google.com/maps/search/?api=1&query=Sidi+Wahab+Mosque'),
('مسجد ابن مرزوق الكفيف', 'https://www.google.com/maps/search/?api=1&query=Ibn+Marzouk+al-Kafif+Mosque'),
('مسجد سيدي الداودي', 'https://www.google.com/maps/search/?api=1&query=Sidi+Daoudi+Mosque'),
('مسجد سيدي البنا', 'https://www.google.com/maps/search/?api=1&query=Sidi+El+Benna+Mosque'),
('مسجد باب زير', 'https://www.google.com/maps/search/?api=1&query=Bab+Zir+Mosque'),
('مسجد الشريف التلمساني', 'https://www.google.com/maps/search/?api=1&query=Al-Sharif+Al-Tilimsani+Mosque'),
('مسجد الشيخ سحنون', 'https://www.google.com/maps/search/?api=1&query=Cheikh+Sahnoun+Mosque'),
('مسجد الموحدين', 'https://www.google.com/maps/search/?api=1&query=Al-Mouahidine+Mosque+Tlemcen'),
('مسجد خالد بن الوليد', 'https://www.google.com/maps/search/?api=1&query=Khalid+Ibn+Al-Walid+Mosque+Tlemcen'),
('مسجد الأنصار', 'https://www.google.com/maps/search/?api=1&query=Al-Ansar+Mosque+Tlemcen')
on conflict (name) do nothing;

-- Seed lessons (updated with valid mosque references)
insert into lessons (title, lecturer, mosque_name, mosque_id, day, time_relation, frequency, total_lessons, start_date, end_date, description)
select 'شرح الأربعين النووية', 'الشيخ أحمد إبراهيم', 'الجامع الكبير بتلمسان', id, 'الجمعة', 'بعد المغرب', 'أسبوعياً', 40, '2025-01-03', '2025-10-03', 'شرح مفصل للأحاديث التأسيسية في الفقه الإسلامي والأخلاق.' from mosques where name = 'الجامع الكبير بتلمسان'
union all
select 'تفسير سورة الكهف', 'د. محمد يوسف', 'مسجد سيدي بومدين', id, 'السبت', 'بعد الفجر', 'أسبوعياً', 12, '2025-01-04', '2025-03-22', 'جلسة صباحية أسبوعية لاستكشاف معاني ودروس سورة الكهف.' from mosques where name = 'مسجد سيدي بومدين'
union all
select 'الأخلاق الإسلامية', 'الأستاذ خالد منصور', 'مسجد المشور', id, 'الاثنين', 'بعد العشاء', 'أسبوعياً', 20, '2025-01-06', '2025-05-19', 'تعلم آداب وأخلاق النبي ﷺ وكيفية تطبيقها في حياتنا اليوم.' from mosques where name = 'مسجد المشور'
union all
select 'فقه العبادات', 'الشيخ سلمان مالك', 'مسجد المنصورة', id, 'الأربعاء', 'قبل المغرب', 'أسبوعياً', 15, '2025-01-08', '2025-04-16', 'دليل خطوة بخطوة لأحكام الصلاة والزكاة والصيام.' from mosques where name = 'مسجد المنصورة'
union all
select 'السيرة النبوية', 'الشيخ عمر عبد الله', 'مسجد سيدي الحلوي', id, 'الأحد', 'بعد العصر', 'مرتين في الأسبوع', 30, '2025-01-05', '2025-04-17', 'رحلة تاريخية عبر حياة رسول الله ﷺ.' from mosques where name = 'مسجد سيدي الحلوي';
