-- ============================================================================
-- F.I.R.E — Port the GIIS clubs from the Lovable app (app.find-involve-reach-engage.com)
-- Adds the richer club profile columns, then upserts the 16 live clubs under the
-- SAME UUIDs they have in the Lovable database. Idempotent / safe to re-run.
--
-- Run AFTER schema.sql and migration-hardening.sql.
--
-- Contact details (contact_email, contact_phone) are hidden from signed-out visitors,
-- exactly like the Lovable app: anon only gets a column-level SELECT on the public
-- columns (see the GRANT at the bottom). The real numbers/emails are NOT in this repo
-- (it is public) — they live in supabase/private/club-contacts.local.sql.
-- If you add a column to clubs later, grant it to anon too or signed-out pages break.
-- ============================================================================

alter table public.clubs add column if not exists vision             text;
alter table public.clubs add column if not exists mission            text;
alter table public.clubs add column if not exists president          text;
alter table public.clubs add column if not exists vice_president     text;
alter table public.clubs add column if not exists secretary          text;
alter table public.clubs add column if not exists treasurer          text;
alter table public.clubs add column if not exists instagram          text;
alter table public.clubs add column if not exists linkedin           text;
alter table public.clubs add column if not exists website            text;
alter table public.clubs add column if not exists grade_requirements text;
alter table public.clubs add column if not exists contact_phone      text;
alter table public.clubs add column if not exists is_open            boolean not null default true;
alter table public.clubs add column if not exists school             text not null default 'GIIS Singapore';
alter table public.clubs add column if not exists tags               text[] not null default '{}';

create index if not exists idx_clubs_school on public.clubs(school);

insert into public.clubs
  (id, name, description, category, vision, mission, president, vice_president, secretary,
   treasurer, instagram, linkedin, website, grade_requirements, is_open, school,
   is_approved, member_count)
select v.id::uuid, v.name, v.description, v.category, v.vision, v.mission, v.president,
       v.vice_president, v.secretary, v.treasurer, v.instagram, v.linkedin, v.website,
       v.grade_requirements, v.is_open, v.school, true, 0
from (values
  ('2eb8c148-5966-420c-9d40-a6d3dcb36a56', $q$GIIS Art Club$q$, null, $q$Arts & Culture$q$, null, null, $q$Divyesh Srivastava$q$, $q$Shambhavi Kasar$q$, $q$Mingrui Gong (Flora)$q$, null, $q$@artclub_giispg$q$, null, null, null, true, $q$GIIS Singapore$q$),
  ('4ae76531-ae13-4fe7-ba80-02fb8f148f48', $q$GIIS Aviation & Astronomy Club$q$, $q$To provide hands-on learning experiences in aviation and astronomy through workshops, stargazing events, guest lectures, and collaborative projects.$q$, $q$STEM$q$, $q$To inspire the next generation of aerospace pioneers and astronomers, fostering a community where students can explore the infinite possibilities of flight and space.$q$, $q$To provide hands-on learning experiences in aviation and astronomy through workshops, stargazing events, guest lectures, and collaborative projects.$q$, $q$Rian Mallik$q$, $q$Parthiv Prasanth$q$, $q$Roshan Kesavan$q$, null, null, null, $q$https://giisaac.org/$q$, null, true, $q$GIIS Singapore$q$),
  ('2cd0ccf3-1500-4add-9f55-24a87c7202e2', $q$GIIS Culinary Club$q$, null, $q$Lifestyle$q$, null, null, $q$Lavitra Maheshwari$q$, $q$Nistha Nirmita Mahanta$q$, $q$Ninad Pendse$q$, null, $q$@giis_culinaryclub$q$, null, null, null, true, $q$GIIS Singapore$q$),
  ('8728e384-7439-40ff-80f9-2e534531f155', $q$GIIS Culture Kaleidoscope Club$q$, null, $q$Arts & Culture$q$, null, null, $q$Aadya Sreeja Rahul$q$, $q$Anusha Kaushik$q$, $q$Smriti Ramakrishnan$q$, null, $q$@giis.culture.ks.club$q$, null, null, null, true, $q$GIIS Singapore$q$),
  ('905293fe-f44b-4520-ad91-77427a069657', $q$GIIS Dance For Change Club$q$, null, $q$Arts & Culture$q$, null, null, $q$Twisha Umesh$q$, $q$Anushka Sree Srinivasa Varadhan$q$, $q$Tanvi Tantri$q$, null, $q$@giis.danceforchange$q$, null, null, null, true, $q$GIIS Singapore$q$),
  ('4a16c006-001e-428f-972c-fc1876525adc', $q$GIIS Film Club$q$, $q$To engage students in the world of cinema through film screenings, filmmaking workshops, and creative competitions that encourage storytelling and skill development.$q$, $q$Arts & Culture$q$, $q$To empower young storytellers to see the world through a cinematic lens, fostering creativity, critical thinking, and collaboration.$q$, $q$To engage students in the world of cinema through film screenings, filmmaking workshops, and creative competitions that encourage storytelling and skill development.$q$, $q$Shloka Deb$q$, $q$Shreya Soman$q$, $q$Meenal Maheshwari$q$, null, $q$@giis.filmclub$q$, null, null, null, true, $q$GIIS Singapore$q$),
  ('b3716131-d7e1-481e-8d5d-e0dfeadcbe1e', $q$GIIS Interact Club$q$, $q$To uphold Service Above Self by engaging in community and international service, developing leadership, and promoting goodwill and understanding.$q$, $q$Service$q$, $q$To empower a generation of young leaders committed to service, integrity, and creating meaningful change in their communities and around the world.$q$, $q$To uphold Service Above Self by engaging in community and international service, developing leadership, and promoting goodwill and understanding.$q$, $q$Purvaa Prakash$q$, $q$Iraj Gupta$q$, $q$Naisha Raturi$q$, null, $q$@globalinteract$q$, null, null, null, true, $q$GIIS Singapore$q$),
  ('e3697836-4782-409f-a990-a9a2a9c05375', $q$GIIS MedVet Club and Red Cross Youth Chapter$q$, null, $q$Health & Science$q$, null, null, $q$Iraj Gupta$q$, $q$Nameh Singh Gulati$q$, $q$Deeksha Vasanthkumar$q$, $q$Nikhil Kawadkar$q$, $q$@giisredcrossyouth.medvetclub$q$, null, $q$https://giismedvet.org$q$, null, true, $q$GIIS Singapore$q$),
  ('637b97bc-1068-48d3-a13a-ee85ba3b1a62', $q$GIIS Photography Club$q$, $q$To help students explore, enrich and express their skills/interest in photography through various competitions and seminars.$q$, $q$Arts & Culture$q$, $q$To foster a community of budding photographers who work together to create impactful visual projects and contribute meaningfully to school initiatives.$q$, $q$To help students explore, enrich and express their skills/interest in photography through various competitions and seminars.$q$, $q$Vivan Shandilya$q$, $q$Atharva Kaushal$q$, null, null, $q$@giisphotographyclub$q$, $q$@GIIS Photography Club$q$, null, null, true, $q$GIIS Singapore$q$),
  ('683d2997-d7c2-415a-aa22-700fe3b337e2', $q$GIIS PULSE Club$q$, $q$An Applied Physics club aiming to promote love for Physics in students across the world, affiliated with PULSE organisation$q$, $q$STEM$q$, $q$To inspire the next generation of engineers and physicists, fostering a community where students can explore the infinite possibilities of physics in everyday life.$q$, $q$To promote love for physics in students across the world, through hands on learning and making sure physics is accessible and available for everyone.$q$, $q$Jivitesh Gupta$q$, $q$Siddharth Bansal$q$, $q$Ahan Mathew$q$, null, $q$@giisphysics.pulse$q$, null, null, $q$Grades 9-12$q$, true, $q$GIIS Singapore$q$),
  ('e4ac96d9-e682-4174-8c8b-d76e8f58535d', $q$GIIS Research Society$q$, $q$Equip students with the skills, resources, and confidence to conduct interdisciplinary research. Provide structured mentorship and research training. Create opportunities for publication and recognition.$q$, $q$Academic$q$, $q$The GIIS Research Society aims to be the leading student-led academic body at GIIS, fostering a strong culture of intellectual inquiry and high-quality, original research.$q$, $q$Equip students with the skills, resources, and confidence to conduct interdisciplinary research. Provide structured mentorship and research training. Create opportunities for publication and recognition.$q$, $q$Avinash Reddy$q$, $q$Aarya Pandey$q$, $q$Aanish Chaudhary$q$, null, $q$@giisresearchsociety$q$, $q$@giisresearchsociety$q$, null, null, true, $q$GIIS Singapore$q$),
  ('0e997564-9337-4ea5-8320-3a466245d5ee', $q$GIIS STEM Club$q$, null, $q$STEM$q$, null, null, $q$Arnav Rai$q$, $q$Rohit Panwar$q$, $q$Vindhya Gummadi$q$, null, null, null, null, null, true, $q$GIIS Singapore$q$),
  ('11dcf5a7-2075-43ea-8056-c933c8c8d786', $q$GIIS Sustainability Sphere$q$, null, $q$Service$q$, null, null, $q$Janessa Mathai$q$, $q$Drishnna Sharma$q$, $q$Lahari Gowni$q$, null, $q$@giis.sustainability.sphere$q$, null, null, null, true, $q$GIIS Singapore$q$),
  ('21beda04-2f39-44db-9bc9-aa75d582cff7', $q$GIIS Tech Club$q$, null, $q$STEM$q$, null, null, $q$Anuraag Vombatkere$q$, $q$Duaa Sherief$q$, $q$Ansh Vaibhav Sanghavi$q$, null, $q$@giistechclub$q$, null, null, null, true, $q$GIIS Singapore$q$),
  ('9a93bd47-eaf6-4b4b-8f87-3810aba769b7', $q$MindMach Club$q$, $q$A combination of making students attain knowledge about the benefits and drawbacks of AI, equipping them with skills for data analytics and to teach them how we can integrate AI into school life responsibly.$q$, $q$STEM$q$, $q$To cultivate curiosity, creativity, and critical thinking while equipping the future generation with the skills and knowledge for a future powered by AI.$q$, $q$A combination of making students attain knowledge about the benefits and drawbacks of AI, equipping them with skills for data analytics and to teach them how we can integrate AI into school life responsibly.$q$, $q$Ashmitha Pitani$q$, $q$Medha Radheshyam$q$, $q$Sonakshi Ray$q$, null, $q$@giis.mindmach.club$q$, $q$@GIISMindMach Club$q$, null, null, true, $q$GIIS Singapore$q$),
  ('a6a6e07b-8b26-46da-8679-590b5ebdd6e3', $q$The GIIS Computing Maths Club$q$, null, $q$STEM$q$, null, null, $q$Saranik Mallick$q$, $q$Hrishik Deb$q$, $q$Vaibhav Seshadri$q$, null, null, null, null, null, true, $q$GIIS Singapore$q$)
) as v(id, name, description, category, vision, mission, president, vice_president, secretary,
       treasurer, instagram, linkedin, website, grade_requirements, is_open, school)
on conflict (id) do nothing;

-- ---- hide contact details from signed-out visitors ---------------------------
revoke select on public.clubs from anon;
grant select (
  id, name, description, category, meeting_schedule, contact_person,
  logo_url, banner_url, leader_id, is_approved, member_count, created_at,
  vision, mission, president, vice_president, secretary, treasurer,
  instagram, linkedin, website, grade_requirements, is_open, school, tags
) on public.clubs to anon;
