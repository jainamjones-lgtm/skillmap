# SkillMap: Product Requirements Document

**Version 1.0** · Status: built, pre-launch
Stack: Next.js 16, React 19, Prisma 7, SQLite

Related documents: `DESIGN.md` (design system), `CURRICULUM_COVERAGE.md` (curriculum audit),
`VIDEO_AUDIT.md` (video provenance and length policy), `SKILLMAP_WEBSITE_BREAKDOWN.txt`
(implementation walkthrough).

---

## 1. Product summary

SkillMap is a learning platform for marketers. Every marketing skill in the catalogue carries a
demand score from 0 to 100 that represents how much the market is hiring for it. Those scores
render as an interactive map, and every skill on the map links to the courses that teach it.

The product contains 53 scored skills, 54 courses and 232 video lessons. Skills are grouped into
7 territories. A learner signs up, reads the map, opens a skill, enrols in a course, and works
through video lessons while the system tracks progress.

Every figure in this document was read from the running database rather than estimated. Each
requirement carries a build status of Built, Partial or Not built, so the document describes the
product as it currently exists.

---

## 2. Problem statement

Marketing skills change faster than course catalogues are revised. A marketer deciding what to
learn next faces three specific gaps.

Course catalogues sort by popularity and recency, which surfaces what sold in previous quarters
rather than what employers are currently hiring for. A learner browsing 200 marketing courses
receives no signal about which skills carry salary or hiring weight.

Hiring demand data sits in job boards and industry reports, separate from the platforms where
learning happens. Cross-referencing the two before enrolling requires research that most
learners will not do.

Courses are packaged as standalone products, so the relationships between skills stay invisible.
A learner cannot see that marketing analytics, attribution and performance analysis form a
cluster, or which adjacent skill to learn after finishing one.

SkillMap addresses these by leading with the demand signal. The map is the first thing a visitor
sees, and each course is presented as the action attached to a scored skill.

---

## 3. Objectives

| ID | Objective | Reasoning |
|---|---|---|
| G1 | Make hiring demand readable at a glance | The demand map is the product's differentiator, so a visitor who cannot read the market signal within seconds receives no more value than from a standard catalogue. |
| G2 | Connect every skill to a course | A demand score with no available course produces information the learner cannot act on. |
| G3 | Make courses completable | Short video lessons with visible progress produce completions, and completion is the outcome that demonstrates the product worked. |
| G4 | Keep catalogue content accurate | A single irrelevant or dead lesson video costs more learner trust than a missing course, because it signals the catalogue is unmaintained. |
| G5 | Allow catalogue changes without engineering | Content velocity drops when every course edit requires a code deploy. |

---

## 4. Scope

### In scope for version 1

Account creation and authentication, the demand map, catalogue search and filtering, course
enrolment, video lesson delivery, progress tracking, course reviews, and an admin interface for
managing courses and lessons.

### Out of scope for version 1

The following were excluded by decision, and the reasoning for each is recorded here.

**Third-party instructors and revenue sharing.** The catalogue is curated so that content
standards in section 10 can be enforced centrally.

**Payments.** Pricing was removed from the database schema, not concealed in the interface.
There is no cart, no checkout and no payment integration. Reintroducing pricing requires a
schema migration.

**Certificates and proctored assessment.** Completion is recorded for the learner's own use.
Issuing credentials would create an accreditation obligation the product does not currently
support.

**Discussion, following and activity feeds.** Reviews are the only social feature, which keeps
moderation load proportional to a small team.

**Job listings.** SkillMap reads labour market signals and does not transact in the labour
market.

---

## 5. Users and roles

The system defines two roles in the `Role` enum: `STUDENT` and `ADMIN`. Unauthenticated visitors
form a third state with no database record.

**Learner (`STUDENT`).** A working marketer with one to eight years of experience who suspects
their skills have drifted from what employers now hire for. Time is their binding constraint,
so lessons must fit inside a working day. They need to know which skill is worth learning and
they need to finish what they start.

**Curator (`ADMIN`).** Owns the catalogue. Creates and edits courses, orders lessons, attaches
videos and maintains demand scores. They need to publish and correct content without a deploy.

**Visitor.** Sees the landing page only. They must be able to judge catalogue quality and scope
before creating an account, so the landing page exposes real skills, real courses and the live
map.

---

## 6. User stories

| ID | Role | Story |
|---|---|---|
| J1 | Visitor | I can see what the platform teaches before signing up, so I can judge whether an account is worth creating. |
| J2 | Learner | I can see which skills carry the highest hiring demand, so I choose what to learn from evidence. |
| J3 | Learner | I can open a skill and see every course that teaches it, so I move from signal to action in one step. |
| J4 | Learner | I can search and filter the catalogue, so I find a specific topic without browsing the map. |
| J5 | Learner | I can enrol in a course and watch its lessons in order. |
| J6 | Learner | I can see how far through a course I am and what remains. |
| J7 | Learner | I can resume the course I was last working on, so I do not lose my place between sessions. |
| J8 | Learner | I can review a course I have taken, so later learners can judge it. |
| J9 | Admin | I can create and edit courses and lessons without a deploy. |
| J10 | Admin | I can attach a skill to each course, so the map stays accurate as the catalogue grows. |

---

## 7. Product surfaces

The application exposes 14 routes. Access is enforced twice, once in middleware
(`src/proxy.ts`) and again in the data layer through `requireAuth` and `requireAdmin`, so a
route is never protected by navigation alone.

| Route | Access | Function |
|---|---|---|
| `/` | Public | Landing page: hero, track browser, live skill map, closing call to action. Authenticated users are redirected to `/dashboard`. |
| `/signup`, `/login` | Public | Account creation and sign in. Authenticated users are redirected away. |
| `/dashboard` | Learner | Resume panel for the most recent course, demand pulse, recommended courses, progress totals, demand snapshot table. |
| `/dashboard/skill-map` | Learner | Full demand map with a territory detail panel. |
| `/skill/[slug]` | Learner | One skill: map with the skill highlighted, demand score, description, and every course teaching it. |
| `/dashboard/browse` | Learner | Catalogue with text search, category filter, level filter and sort. |
| `/courses/[slug]` | Learner | Course detail: hero, curriculum list, reviews, enrolment panel. |
| `/courses/[slug]/learn` | Enrolled learner | Lesson player: embedded video, lesson text, lesson list, completion control. |
| `/dashboard/my-courses` | Learner | Enrolments split into in progress and completed. |
| `/dashboard/profile` | Learner | Account details, learning totals, display name editing. |
| `/dashboard/admin` and 3 sub-routes | Admin | Course list, course creation, course editing, lesson editor. |

---

## 8. Functional requirements

### 8.1 Accounts and access

| ID | Requirement | Status |
|---|---|---|
| FR-1.1 | A visitor creates an account with name, email and password. Passwords require 8 or more characters including at least one letter and one number, and are stored as bcrypt hashes at cost factor 12. | Built |
| FR-1.2 | Sessions are stateless HS256 JWTs held in an `httpOnly`, `sameSite=lax` cookie, marked `secure` in production, expiring after 7 days. | Built |
| FR-1.3 | Sign in is limited to 10 attempts per email and IP combination per 10 minutes. | Partial. The counter is an in-process map, so it resets on restart and does not apply across instances. |
| FR-1.4 | Every authenticated route re-verifies the session server side before returning data. | Built |
| FR-1.5 | A learner can change their display name. | Built |
| FR-1.6 | A user can recover a forgotten password. | Not built. No email transport exists. |
| FR-1.7 | Email addresses are verified at signup. | Not built |

### 8.2 Demand map

| ID | Requirement | Status |
|---|---|---|
| FR-2.1 | Each skill renders as a circle sized by demand score and coloured by demand tier, grouped inside a territory ring. | Built |
| FR-2.2 | Node positions are computed from the data at render time. No position is hard coded, and no two nodes overlap at any catalogue size. | Built |
| FR-2.3 | The map renders correctly before JavaScript executes. Pan and zoom are added on top as a single transform. | Built |
| FR-2.4 | Each territory displays its highest scoring skills by default. Remaining skills open in a side panel through a `+N more` control, so every skill stays reachable while the default view stays legible. | Built |
| FR-2.5 | Every node links to its skill page. Selecting a skill performs a navigation, so a panel cannot display content from a previously selected skill. | Built |
| FR-2.6 | Every node is reachable and operable by keyboard, and focusing a node scrolls it into view. | Built |
| FR-2.7 | The map occupies identical dimensions on every surface that renders it. | Built |

### 8.3 Discovery

| ID | Requirement | Status |
|---|---|---|
| FR-3.1 | The catalogue filters by free text query, category and level, and sorts by featured, newest, most popular or top rated. | Built |
| FR-3.2 | Filter state is held in the URL, so a filtered view can be shared and survives a page reload. | Built |
| FR-3.3 | A skill page lists every course teaching that skill, with the course filed under the skill shown first. | Built |
| FR-3.4 | Search matches course title, headline and category. | Partial. Matching is substring only, with no lesson content search, stemming or typo tolerance. |
| FR-3.5 | Recommended courses reflect the individual learner's history. | Partial. Ranking currently uses global enrolment counts, so every learner sees the same list. |

### 8.4 Learning

| ID | Requirement | Status |
|---|---|---|
| FR-4.1 | A learner enrols in any published course. Enrolment is unique per learner and course. | Built |
| FR-4.2 | The lesson player displays an embedded video, the lesson text, and the full lesson list with completion state. | Built |
| FR-4.3 | Marking a lesson complete recalculates course progress as completed lessons divided by total lessons, rounded to a whole percent. Reaching 100 percent sets `completedAt`. | Built |
| FR-4.4 | Progress appears on the dashboard, the course page and My Courses. The most recent course resumes in one click. | Built |
| FR-4.5 | Lessons hold a fixed order inside a course, enforced by a unique constraint on course and order. | Built |
| FR-4.6 | A learner submits one review per enrolled course, with a rating from 1 to 5 and an optional comment. | Built |
| FR-4.7 | Video playback position is retained inside a lesson. | Not built. Completion is recorded per lesson. |

### 8.5 Catalogue administration

| ID | Requirement | Status |
|---|---|---|
| FR-5.1 | An admin creates, edits and deletes courses, setting title, headline, description, level, duration, category, skill and thumbnail colour. | Built |
| FR-5.2 | An admin adds, edits, reorders and deletes lessons, including the video URL. | Built |
| FR-5.3 | Every admin mutation validates through a shared Zod schema and returns field level errors. | Built |
| FR-5.4 | Deleting a course cascades to its lessons, enrolments and reviews. | Built |
| FR-5.5 | An admin edits skills and demand scores through the interface. | Not built. Skills are managed in the seed file, so changing a score requires a reseed. |
| FR-5.6 | Reviews can be moderated or removed. | Not built |

---

## 9. Demand scoring model

Each skill carries an integer `demandScore` between 0 and 100. The observed range across the
current 53 skills is 60 to 98. Scores are curated from hiring research and job market signals,
stored in the `Skill` table, and applied at seed time.

### Tier thresholds

Tiers are calculated against the observed range rather than fixed values, so the colouring stays
informative as the catalogue changes. The thresholds sit at 84, 62 and 34 percent of the range.
These are deliberately high because the catalogue is weighted toward in demand skills, and lower
thresholds classified almost every skill as high demand, which removed the signal the colour was
carrying.

| Tier | Position within observed range | Colour |
|---|---|---|
| Very high demand | 84 percent and above | Demand red |
| High demand | 62 percent and above | Demand red |
| Moderate demand | 34 percent and above | Demand amber |
| Emerging | Below 34 percent | Neutral grey |

### Territories

Skills group into 7 territories: AI and Emerging, Analytics and Data, Content and Social,
Creative and Web, Lifecycle and Automation, Paid Media, and Strategy and Brand. Raw course
categories in the database are fragmented, with separate values such as "Analytics" and
"Analytics & Data", so a normalisation map collapses them onto the 7 territories. The same
normalisation drives the track browser on the landing page.

### Current limitation

Scores are curated and do not refresh automatically. There is no job board integration, and a
score changes when the seed file is edited. The skill map page states this to the learner.
Replacing curation with a live data feed is the highest value item in section 17, and the schema
supports it without change because only the source of the number differs.

---

## 10. Content standards

The catalogue is the product, so these standards are enforced and auditable.

**Video relevance.** Each lesson video teaches that lesson's topic and is marketing or business
education content. Relevance is verified against the live video title and channel retrieved from
the video host, so a URL alone is never treated as evidence.

**Video length.** No lesson video runs under 5 minutes, which excludes short form clips. The
target band is 10 to 15 minutes. Videos longer than the band are permitted only where the video
is the strongest available teaching resource for that topic.

**Stated duration.** A lesson's stated duration is derived from the real length of its video,
and a course's duration is the sum of its lesson durations. This prevents the stated time and
the actual time from diverging.

**Availability.** Every video is live and embeddable. Videos that are private, deleted or region
blocked fail the audit and are replaced.

**Imagery.** Course and hero images use free licence stock photography, and each URL is verified
to return a live image. Adjacent cards in a grid use different images.

**Coverage.** Every skill on the map has at least one course, because a scored skill with no
course presents the learner with information they cannot act on.

### Measured compliance

| Measure | Value |
|---|---|
| Lessons with a verified video | 232 of 232 |
| Videos under 5 minutes or over 60 minutes | 0 |
| Courses with a verified image | 54 of 54 |
| Skills with no course | 0 |
| Median lesson length | 15 minutes |
| Longest lesson | 59 minutes |

30 of 232 lessons currently run longer than 30 minutes, and 55 percent of lessons run 15 minutes
or under. The video length standard permits long videos only where they are the strongest
resource, so this gap is recorded as an open decision in section 16.

---

## 11. Data model

The schema defines 7 entities. Referential rules are enforced in the database rather than in
application code.

| Entity | Purpose | Constraints |
|---|---|---|
| User | Learner or admin account | Unique email. Role enum. The password hash never leaves the data layer. |
| Skill | A scored capability shown on the map | Unique name and slug. Holds category, demand score, description and colour. |
| Course | A learning unit | Unique slug. Optional primary skill, set to null if the skill is deleted. Status field gates publication. |
| Lesson | One video with accompanying text | Unique combination of course and order. Cascades on course deletion. |
| Enrollment | A learner's relationship to a course | Unique combination of user and course. Holds progress percent and completion timestamp. |
| LessonCompletion | One completed lesson | Unique combination of enrolment and lesson, so a lesson cannot be counted twice. |
| Review | A rating with optional comment | Unique combination of user and course, so each learner reviews a course once. |

### Course to skill coverage

A course is filed under one primary skill through `Course.skillId`, and most courses teach
several skills. A many to many join table records the secondary skills a course covers, so a
skill page lists every course that teaches it. Before this relation existed, each skill
displayed exactly one course. The median skill now shows 4 courses.

### Catalogue totals

| Entity | Count |
|---|---|
| Skills | 53 |
| Courses | 54 |
| Lessons | 232 |
| Coverage links | 183 |

---

## 12. Non-functional requirements

| ID | Area | Requirement | Status |
|---|---|---|---|
| NFR-1 | Accessibility | All text meets WCAG AA contrast. Every interactive element shows a visible focus state. Demand state is communicated by label or score in addition to colour. | Built |
| NFR-2 | Accessibility | The map is fully keyboard operable. Each node exposes an accessible name stating the skill, its score, its tier and its course count. | Built |
| NFR-3 | Motion | The `prefers-reduced-motion` setting suppresses the demand pulse animation and transitions. | Built |
| NFR-4 | Responsive layout | No horizontal page scroll occurs at any width from 390 pixels upward. Wide content scrolls inside its own container. | Built |
| NFR-5 | Rendering | Pages render as server components by default. Client JavaScript is used only where interaction requires it, and the map renders without JavaScript. | Built |
| NFR-6 | Authorisation | Access checks run in the data layer as well as middleware. Admin actions re-check the role server side. | Built |
| NFR-7 | Privacy | The system stores name, email and password hash. It runs no tracking scripts, no third party analytics and no advertising pixels. | Built |
| NFR-8 | Data management | Schema changes ship as versioned Prisma migrations. The seed script is idempotent and safe to re-run. | Built |
| NFR-9 | Scalability | The system supports concurrent load across more than one instance. | Partial. SQLite on local disk allows a single writer, so a Postgres migration is required before multi-instance deployment. |
| NFR-10 | Observability | Production error tracking and usage analytics are in place. | Not built |

---

## 13. Design system

The design system is named Warm Professionalism. Tokens are defined in `src/app/globals.css`,
which is the single source of truth, and `DESIGN.md` holds the written specification.

**Theme.** The product ships one light theme. There is no dark variant and no theme toggle, so
one palette is maintained. Page backgrounds are white, and the warm tint appears in banded
sections.

**Colour.** A white canvas carries near black text on a warm neutral surface ramp. One action
colour, crimson `#ba0036`, is used for buttons, links and active navigation. Three demand
signals, red, amber and grey, are reserved for market demand so that colour retains meaning.

**Typography.** Inter is the only typeface. Hierarchy is carried by weight and line height, and
tabular numerals are used wherever figures align in columns.

**Shape and depth.** Buttons and chips are pill shaped, cards use a 16 pixel radius. Structure
comes from hairline borders. One shadow level exists and appears on hover and on floating
elements such as dropdowns and the map legend.

**Layout.** Content sits inside a 1280 pixel maximum width on an 8 pixel base grid, with 24
pixel side margins on mobile and 80 pixel margins on desktop. Major sections are separated by
64 pixels.

**Icons.** All icons are inline SVG, which removes any icon font or CDN dependency.

---

## 14. Success metrics

Each metric maps to an objective in section 3. None are instrumented yet, as recorded in NFR-10.

| Objective | Metric | Reasoning |
|---|---|---|
| G1 | Proportion of visitors who interact with the map before signing up | Measures whether the demand first framing changes behaviour, which page views cannot show. |
| G2 | Conversion rate from skill page to enrolment | Measures the core loop where a demand signal produces an enrolment. |
| G3 | Course completion rate, and lessons completed per active learner per week | Completion is the target outcome and weekly lesson count is its leading indicator. |
| G3 | Return rate within 7 days of a first lesson | Course completion requires repeat sessions, so single session usage predicts abandonment. |
| G4 | Count of videos failing the content audit each quarter | Converts the catalogue trust standard in section 10 into a measured figure. |
| G5 | Number of catalogue changes shipped without a deploy | Measures whether admin tooling removed the engineering dependency. |

Time on site and page views are excluded as metrics. Both rise when a learner struggles to find
what they need, so they would reward the failure state.

---

## 15. Assumptions and risks

### Assumptions

Marketers will act on a curated demand score when its source is stated openly on the page.

Third party video hosting is acceptable for version 1, because learners judge a lesson by its
relevance and length before they consider who produced it.

A curated catalogue of approximately 50 courses provides enough coverage, since the product
competes on demand signal quality and not on catalogue size.

### Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Third party videos are deleted or made private | High. A dead video breaks a lesson with no visible error. | Run the availability audit on a schedule. The audit pipeline and its record already exist in `VIDEO_AUDIT.md`. |
| Demand scores become outdated | High. The scores are the product's central claim, so stale scores mislead learners. | Set a refresh cadence. Stating the curation method openly manages expectations in the short term only. |
| SQLite constrains deployment | Medium. Single writer access blocks multi-instance hosting. | Prisma abstracts the database provider, so migrating to Postgres before launch requires a configuration and migration change. |
| No password recovery path | Medium. A learner who forgets their password cannot regain access. | Requires email transport, which blocks public launch. |
| Rate limiting holds state in process | Medium. The limit resets on restart and does not apply across instances. | Move the counter to shared storage during the Postgres migration. |
| Curated catalogue limits growth rate | Low in the near term. Curation is a deliberate trade for content quality. | Review if coverage gaps become the most common learner complaint. |

---

## 16. Open decisions

| ID | Decision required | Reasoning |
|---|---|---|
| Q1 | The source and refresh frequency of demand scores at steady state | Curated scores are the product's central claim and manual curation does not scale with the catalogue. |
| Q2 | Whether the 30 lessons over 30 minutes move into the 10 to 15 minute band, or the standard changes to permit them | The current catalogue matches neither the stated standard nor a relaxed one. |
| Q3 | Whether the product stays free or introduces pricing later | Pricing was removed from the schema, so reintroducing it requires a migration and not an interface change. |
| Q4 | Whether course completion produces a shareable artefact | Certificates were excluded as accreditation, and a shareable completion record serves referral instead, which is a separate decision. |
| Q5 | Whether video moves to self hosting | This determines whether the availability risk in section 15 is permanent or temporary. |
| Q6 | Whether one course per skill is sufficient coverage | 5 skills currently hold a single course, and this sets both the content backlog and the coverage standard in section 10. |

---

## 17. Future scope

The following items are ordered by expected value.

**Live demand data.** Replace curated scores with a job market feed. This converts the product's
central claim from a curated estimate into a measured figure, and the schema already supports it.

**Email transport.** Password reset, address verification and lesson reminders. Password
recovery blocks public launch.

**Postgres migration.** Required before any deployment across more than one instance.

**Personalised recommendations.** Rank recommended courses using the learner's own history and
the demand scores, replacing the current global enrolment ranking.

**Learning paths.** Ordered sequences of courses aimed at a role rather than a single skill.

**Assessment.** Knowledge checks between lessons, which is a prerequisite for any credential
feature.

**Team accounts.** Organisation accounts, seat management and manager reporting. This is the
clearest commercial path and represents a substantially different product surface.

**Native mobile applications.** The responsive web application currently serves mobile users.
