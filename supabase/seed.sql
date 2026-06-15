-- ============================================================================
-- F.I.R.E — Seed data: 5 clubs + 8 competitions (all pre-approved)
-- Run AFTER schema.sql. Safe to re-run (uses fixed UUIDs + upsert).
-- ============================================================================

-- ---- CLUBS -----------------------------------------------------------------
insert into public.clubs (id, name, description, category, meeting_schedule, contact_email, contact_person, is_approved, member_count)
values
  ('11111111-0000-0000-0000-000000000001',
   'Robotics & AI Society',
   'Build autonomous robots, train ML models, and compete in national robotics leagues. Beginners welcome — we run termly bootcamps.',
   'Tech', 'Wednesdays 3:30–5:30pm', 'robotics@fire.sg', 'Mr. Tan Wei Ming', true, 48),

  ('11111111-0000-0000-0000-000000000002',
   'Debate & Public Speaking',
   'Sharpen your argumentation and rhetoric. We train for World Schools, British Parliamentary, and the National Schools Debate.',
   'Debate', 'Mondays & Thursdays 4–6pm', 'debate@fire.sg', 'Ms. Priya Raman', true, 36),

  ('11111111-0000-0000-0000-000000000003',
   'Entrepreneurship Club',
   'Turn ideas into ventures. Pitch nights, startup mentorship, and prep for business case competitions across Singapore.',
   'Business', 'Fridays 3–5pm', 'biz@fire.sg', 'Mr. Daniel Lee', true, 29),

  ('11111111-0000-0000-0000-000000000004',
   'Math Olympiad Training',
   'Rigorous problem-solving for SMO, AMC, and IMO aspirants. Weekly problem sets and mock contests.',
   'Math', 'Tuesdays 4–6pm', 'matholympiad@fire.sg', 'Dr. Goh Hui Ling', true, 41),

  ('11111111-0000-0000-0000-000000000005',
   'Creative Arts Collective',
   'Visual art, digital design, and film. Exhibit your work at the annual showcase and enter national art competitions.',
   'Arts', 'Wednesdays 3–5pm', 'arts@fire.sg', 'Ms. Aishah Karim', true, 33)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, category = excluded.category,
  meeting_schedule = excluded.meeting_schedule, is_approved = true, member_count = excluded.member_count;

-- ---- COMPETITIONS ----------------------------------------------------------
insert into public.competitions
  (id, title, description, category, organizer, deadline, event_date, eligibility, registration_link, prize, format, region, club_id, is_approved, is_featured)
values
  ('22222222-0000-0000-0000-000000000001',
   'Singapore Science & Engineering Fair (SSEF)',
   'The premier pre-tertiary research competition in Singapore. Present an original STEM research project to a panel of expert judges and qualify for international fairs like Regeneron ISEF.',
   'Science', 'Science Centre Singapore & A*STAR',
   (current_date + interval '21 days')::date, (current_date + interval '60 days')::date,
   'Secondary 3 to JC2 / equivalent', 'https://www.science.edu.sg/ssef',
   'Up to S$5,000 + ISEF qualification', 'onsite', 'Singapore',
   '11111111-0000-0000-0000-000000000001', true, true),

  ('22222222-0000-0000-0000-000000000002',
   'National Schools Debating Championship',
   'Singapore''s flagship secondary-school debate tournament in the World Schools format. Teams of five argue prepared and impromptu motions over multiple rounds.',
   'Debate', 'Julia Gabriel / MOE',
   (current_date + interval '5 days')::date, (current_date + interval '40 days')::date,
   'Secondary 1–4', 'https://example.com/nsdc',
   'National champion title + trophy', 'onsite', 'Singapore',
   '11111111-0000-0000-0000-000000000002', true, true),

  ('22222222-0000-0000-0000-000000000003',
   'Singapore Mathematical Olympiad (SMO)',
   'The most prestigious mathematics competition for Singapore students, organised by the Singapore Mathematical Society. Junior, Senior, and Open sections.',
   'Math', 'Singapore Mathematical Society',
   (current_date + interval '12 days')::date, (current_date + interval '45 days')::date,
   'All secondary & JC students', 'https://sms.math.nus.edu.sg/smo',
   'Gold / Silver / Bronze medals', 'onsite', 'Singapore',
   '11111111-0000-0000-0000-000000000004', true, false),

  ('22222222-0000-0000-0000-000000000004',
   'Conrad Challenge',
   'A global innovation and entrepreneurship competition where student teams design solutions to real-world problems and pitch to industry experts.',
   'Business', 'Conrad Foundation',
   (current_date + interval '28 days')::date, (current_date + interval '120 days')::date,
   'Ages 13–18', 'https://www.conradchallenge.org',
   'Up to US$10,000 in scholarships', 'hybrid', 'Global',
   '11111111-0000-0000-0000-000000000003', true, false),

  ('22222222-0000-0000-0000-000000000005',
   'F1 in Schools National Finals',
   'Design, build, and race a miniature CO2-powered F1 car. Combines engineering, branding, and project management in a fast-paced STEM challenge.',
   'STEM', 'F1 in Schools Singapore',
   (current_date + interval '3 days')::date, (current_date + interval '30 days')::date,
   'Secondary & JC', 'https://www.f1inschools.com',
   'World Finals qualification', 'onsite', 'Singapore',
   '11111111-0000-0000-0000-000000000001', true, false),

  ('22222222-0000-0000-0000-000000000006',
   'Google Code-in / Hack4Good',
   'A weekend hackathon where students build tech-for-good prototypes addressing community and sustainability challenges. Mentors from the tech industry on site.',
   'Tech', 'Hack4Good SG',
   (current_date + interval '18 days')::date, (current_date + interval '25 days')::date,
   'Ages 14–18, all skill levels', 'https://example.com/hack4good',
   'S$3,000 prize pool + internships', 'hybrid', 'Singapore',
   '11111111-0000-0000-0000-000000000001', true, true),

  ('22222222-0000-0000-0000-000000000007',
   'UOB Painting of the Year (Youth)',
   'One of Southeast Asia''s most established art competitions. Submit an original artwork in any 2D medium for a chance to exhibit nationally.',
   'Arts', 'United Overseas Bank',
   (current_date + interval '40 days')::date, (current_date + interval '90 days')::date,
   'Open to youth artists 13–18', 'https://www.uobandart.com',
   'S$2,000 + national exhibition', 'onsite', 'Singapore',
   '11111111-0000-0000-0000-000000000005', true, false),

  ('22222222-0000-0000-0000-000000000008',
   'International Olympiad in Informatics — National Round',
   'The national selection round for competitive programming. Solve algorithmic problems under timed conditions to join Team Singapore.',
   'Tech', 'NOI Singapore / NUS School of Computing',
   (current_date + interval '9 days')::date, (current_date + interval '35 days')::date,
   'Secondary & JC with programming experience', 'https://www.noi.sg',
   'Team Singapore selection', 'online', 'Both',
   '11111111-0000-0000-0000-000000000001', true, false)
on conflict (id) do update set
  title = excluded.title, description = excluded.description, deadline = excluded.deadline,
  is_approved = true, is_featured = excluded.is_featured;

-- ---- A few sample community submissions (pending) --------------------------
insert into public.community_submissions
  (submitted_by_name, submitted_by_email, type, title, description, category, deadline, registration_link, organizer, status)
values
  ('Rachel Ng', 'rachel@example.com', 'competition',
   'Astronomy Challenge 2026', 'A stargazing and astrophysics quiz competition for secondary students.',
   'Science', (current_date + interval '50 days')::date, 'https://example.com/astro', 'Science Centre Observatory', 'pending'),
  ('Marcus Tan', 'marcus@example.com', 'club',
   'Chess Strategy Club', 'Weekly chess training and inter-school tournament prep.',
   'Other', null, null, 'Marcus Tan', 'pending')
on conflict do nothing;
