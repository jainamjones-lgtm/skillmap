# Video Audit Report

Generated 2026-08-31. Audited every lesson video across `prisma/lesson-videos.ts` (which takes precedence over inline `v:` ids in `prisma/seed.ts`) by fetching real title/channel via the YouTube oEmbed API and judging topical + platform relevance to each lesson.

## Summary

- Total lessons audited: 202 (across 48 courses)
- Unavailable/unreachable videos (oEmbed non-200): 0
- Passed relevance review unchanged: 161
- Failed and replaced: 41 (38 in the first pass, 3 in the follow-up pass below)

## Replaced entries

| Course | Lesson | Old video (id / title / channel) | Reason for failure | New video (id / title / channel) |
|---|---|---|---|---|
| Affiliate & Partnerships | Managing performance and piracy | `yEDOI2je4sg` — "Managing Information - ACCA Performance Management (PM)" (OpenTuition) | old video was ACCA accounting-exam prep content (keyword collision on "Performance Management") | `o9wh5dSiCds` — "7 Key Strategies for Fraud Prevention in Affiliate Marketing Management" (ZINFI Technologies, Inc.) |
| Brand Strategy for Marketers | Differentiation that matters | `R9KKlPNEBkY` — "Relationship Fundamentals: Togetherness and Differentiation" (Bowen Center) | old video was Bowen Center family-therapy content, unrelated to brand differentiation | `I1X6kjptwWM` — "Differentiation Strategy: How To Differentiate Your Brand in The Sea of Sameness by Peep Laja" (Wynter) |
| Community Management | Measuring community health | `grTIWW-NFY8` — "NEET PG 2022: Epidemiology E01 -Measurements of Mortality \| Let's crack NEET PG \| Dr.Priyanka" (Let's Crack NEET PG) | old video was a medical-exam-prep video on mortality measurement (keyword collision on "measurements") | `9Wi5K69-zfk` — "Your Community Needs These Metrics Now" (Carrie Melissa Jones) |
| Content Marketing Strategy | Production systems that scale | `s9Qh9fWeOAk` — "System Design was HARD until I Learned these 30 Concepts" (Ashish Pratap Singh) | old video was a software-engineering "System Design" tutorial, unrelated | `QMsb6-e8M5Y` — "The #1 Secret To Scaling Content Production & Distribution" (Stephen G. Pope) |
| Content Marketing Strategy | Distribution is 80% of the job | `rBvj1lTfX94` — "The Pareto Principle - 80/20 Rule Explained Pareto Distribution" (Elisha Long) | old video was a generic math Pareto-principle explainer, not marketing content | `UKFmocz14wU` — "How to Develop An Effective Content Distribution Strategy" (Narrato) |
| Display & Retargeting | Creative matching the stage | `mQJVs3trrOM` — "FFMIC 2026 FALL KNOCKOUT STAGE DAY-3 WATCH PARTY 🥶 \|\| TG vs TAG vs S8UL vs GODL  RNTX #nonstopgaming" (Nonstop Gaming) | old video was an esports/gaming watch-party livestream (keyword collision on "stage") | `rLRsgz0d8o0` — "The Only Facebook Retargeting Funnel You'll Ever Need" (Samuel Darby) |
| Google Ads & PPC Search | Account and campaign architecture | `7HE2hYHHNYQ` — "Meta Ads Account & Campaign Creation Step-by-Step (Beginner to Pro Guide 2026)" (Eradigicloud) | old video was a Meta Ads tutorial, wrong ad platform | `JLFjRx0vO_0` — "How to Properly Structure A Google Ads Campaign in 2024 (Tutorial & Real Examples)" (Tradesman Digital Marketing) |
| Google Ads & PPC Search | Reporting and optimization rhythm | `41e3s32EhYw` — "Establish a Rapid, Real Time Reporting Rhythm to Steer Your Business Through Unprecedented Change" (Positive Vision) | old video was generic business-reporting content, not PPC-specific | `3lckgws2dgQ` — "Google Ads Optimization Checklist \| What You Should Be Doing Weekly" (Clicks Geek) |
| Growth Data & Storytelling | The narrative arc of a data story | `yarMvDCk064` — "How to TELL A STORY in video editing [Pt 1 of 2] - 'What is a narrative arc?'" (Unsplice) | old video was about narrative arc in video editing, not data storytelling | `WNyXRB4JhQE` — "The Art of Data Storytelling" (Liora) |
| Growth Marketing Playbook | The experiment engine | `mFn4R4yL5uY` — "Growth Marketing for B2B: Build a Pipeline You Can Actually Close" (Sales and Marketing Playbook: Unleashed) | old video was generic B2B pipeline content, not about experimentation | `ZLenpqD3_vI` — "A/B Testing Framework for Growth Teams: Hypotheses, Metrics & Impact" (Adasight Academy) |
| Growth Marketing Playbook | Retention and lifecycle economics | `aXjYSuPULYY` — "Determining Economic Life Cycle with CAM" (AssetWorks) | old video was about physical-asset economic life cycle (AssetWorks), unrelated | `g97fLPK3Fm0` — "Customer Lifetime Value (LTV): Predicting Long-Term Revenue \| Product Management Explained" (CodeLucky) |
| HubSpot CRM Quickstart | Pipelines and stages | `t8QM5zunC44` — "HubSpot CRM Tutorial for Beginners 2026 (Step-by-Step)" (Metics Media) | duplicate of lessons 1 and 5 (same beginner tutorial); weak fit for pipelines/stages | `IRgh2quy71E` — "HubSpot Sales Pipeline Tutorial: Set Up Stages, Rules & Probabilities \| HubSpot Excellence" (HubSpot Excellence) |
| HubSpot CRM Quickstart | Scoring and workflow hygiene | `LsCnlJeGCEg` — "How Voice-Based Clinical Workflows Are Changing Hygiene, Documentation & Perio Case Acceptance" (Scott Leune Practice Mastery) | old video was dental-practice clinical-workflow content (keyword collision on "hygiene") | `kwLKg9LVDuE` — "How to SET UP Lead Scoring in HubSpot (Step by Step)" (Answer ASAP) |
| HubSpot CRM Quickstart | Reporting basics | `t8QM5zunC44` — "HubSpot CRM Tutorial for Beginners 2026 (Step-by-Step)" (Metics Media) | duplicate of lessons 1 and 3 (same beginner tutorial); replaced with official HubSpot reporting tutorial | `7C6r20v-7Jo` — "HubSpot Reports & Dashboards Tutorial (2024)" (HubSpot) |
| Influencer Marketing Campaigns | The strategy before the creator | `HGZnMJFLuqE` — "The Top 7 Content Strategies To Get Ahead of Everyone Else" (Joanna Wiebe) | old video was generic content-strategy advice, not influencer-specific | `aKFNkCb7X_k` — "Influencer Marketing Strategy: Step-By-Step Tutorial (Free Template)" (HubSpot Marketing) |
| Influencer Marketing Campaigns | The 3-R framework for creators | `0RHXJ_I2wlY` — "Why Freemium Communities Fail (& The 3 R’s to Charge What You’re Worth)" (Mighty Networks) | old video was about community monetization, unrelated to creator tiers | `sKLYwcAkMgg` — "Types of Influencers in Marketing: Nano, Micro, Macro & Mega Explained" (PixiNews) |
| Influencer Marketing Campaigns | Tier mix and pricing reality | `D7rjhWIemiM` — "Why Every Salon Owner Needs Tiered Pricing \| @TheSalonRebelPodcast" (The Salon Rebel Podcast) | old video was about salon business tiered pricing, unrelated | `FpJdbfDdcio` — "Influencer Pricing Explained: How Much Influencers Really Charge (2025 Guide)" (Influencer Hero) |
| Influencer Marketing Campaigns | Amplification and measurement | `KBn1Qzk897Y` — "Understanding Power Amplifier Measurements" (Audio Science Review) | old video was about audio power-amplifier measurements (keyword collision on "amplifier") | `GivK2gIWXQ4` — "How to Measure Influencer Marketing ROI (5-Step Guide + Formula Explained)" (Influencer Hero) |
| Landing Pages That Convert | Speed, mobile and the build | `anWvo8bV2Hc` — "BUFFED MIYA WTFF FULL ATTACK SPEED BUILD!💀 (+999% ATK SPEED HACK!..) - MLBB🔥" (Miya only) | old video was a Mobile Legends gaming clip (keyword collision on "speed"/"build") | `ZdgJrclVmYQ` — "Optimize Your Landing Pages For Mobile" (Michelle Kop - Google Ads) |
| Market Research & Insights | Research that grounds strategy | `Y6f1GHjD5JQ` — "5.5 Grounded theory \| Qualitative Methods \| Qualitative Analysis \| UvA" (Research Methods and Statistics (FMG, UvA)) | old video was an academic qualitative-methods lecture, not marketing-oriented | `mUEIh0JD3p8` — "How to do Market Research right: Qualitative and Quantitative explained (2025 Guide)" (Sergey Gorenko) |
| Marketing Analytics with GA4 | How GA4 thinks (events, not pageviews) | `2PAf3CyLG2I` — "Not set in Google Analytics 4. How to solve it?" (Analytics Mania - Google Analytics & Tag Manager) | old video was a narrow troubleshooting clip, not an events-vs-pageviews explainer | `N5mGXJLrtrs` — "Events in Google Analytics 4 // 2021 Tutorial // Automatic, Recommended and Custom Events in GA4" (Loves Data) |
| Marketing Analytics with GA4 | Custom events and conversions | `ctggDPQp3Xo` — "Facebook Custom Events & Conversions: Easy Setup Guide with GTM" (Vertex Marketing Agency) | old video was about Facebook custom events, wrong platform for a GA4 lesson | `A546lw0g_4s` — "GA4 Key Events – How to Track Conversions in Google Analytics 4 (2025 Update)" (Loves Data) |
| Marketing Attribution & ROI | Reporting that defends budget | `Cl7M4w0LKhU` — "Marketing Attribution Tutorial: Everything You Need to Get Started" (Ruben Ugarte) | duplicate of lesson 4; weak fit for the budget-defense reporting lesson | `EvPIAe5ZtBk` — "Cracking the Code: Mastering Attribution Reporting \| Hubspot User Group '25" (Neighbourhood Co.) |
| Marketing Automation Systems | From manual to automated | `N5n-yX9xQDA` — "From Manual to Automated: Advanced Risk Assessments" (ServiceNow Community) | old video was ServiceNow IT risk-assessment content, unrelated | `s6oqrw3UZaM` — "How to Implement Marketing Automation: A Step-by-Step Guide for Beginners" (Thalita Milan - Tech & Marketing Tips) |
| Marketing Automation Systems | Workflow design principles | `Exw3uxUYgqw` — "Automation Workflow Design:  Start from the End" (George W) | old video was generic, non-marketing workflow-design content | `hrPq583QSWI` — "Marketing Automation 101: Build Your First Workflow (Step-by-Step)" (Marketecs) |
| Marketing Automation Systems | Ops hygiene and reporting | `MOvYZ-Q7x_0` — "JMP progress report on WASH in healthcare facilities: WASH and IPC" (UNC Water and Health Conference) | old video was a WASH (water/sanitation) health-conference report, unrelated | `dPjq8ozXkS0` — "10 Essential Data Hygiene Practices for Marketing Success" (PGM Solutions) |
| Marketing Strategy: Plans that Win | Positioning and the offer | `K400f3nvtrI` — "MARKETING 101: Marketing Segmentation, Targeting, and Positioning" (Adam Erhart) | duplicate of lesson 3; weak fit for the positioning/offer lesson | `SI0XD9e9Tl8` — "How To Write A Positioning Statement (Brand Template + Example)" (Brand Master Academy) |
| Performance Analysis | Reading performance, not reports | `p7ywb7-nNJQ` — "“Step Aside—This Is a Family Photo!” My Son’s Wife Screamed in My Face at Their Wedding—So I..." (Silent Sweet Revenge) | old video was an unrelated family-drama story video | `WBgMkU0HTx0` — "How to Choose Marketing Metrics That Actually Drive Sales" (Sales & Marketing Training by IMPACT) |
| Performance Analysis | Variance and root cause | `xAv_JM4W08Q` — "Six Bad Practices of Root Cause Analysis" (TapRooT®) | old video was industrial safety root-cause-analysis content (TapRooT), not marketing | `ZZkndYLbmow` — "My Approach to Analysing Your Performance Marketing Campaigns (Optimisation Hacks)" (Proverve - Performance Marketing Elite Coaching) |
| Performance Marketing Playbook | Building a channel portfolio | `jefp7vkPnuE` — "How to Build Your Own Portfolio Website in Minutes with AI ! 🤯" (Website Learners) | old video was about building a personal portfolio website, wrong meaning of "portfolio" | `pH6Zjrd3IB4` — "What is the Marketing Channel Mix? Promotion Channel Strategy" (Management Courses - Mike Clayton) |
| Performance Marketing Playbook | Budget allocation and scaling | `7Aiw6JO9vmM` — "Budget 2026 for MSMEs: Where Is the Government Allocating & How Is It Spending?" (MSME TALK) | old video was about Indian government MSME fiscal budget, unrelated | `xuMcr3L_c9I` — "How to allocate your marketing budget for higher ROI: Step-by-step guide" (Connective Web Design) |
| Personalization at Scale | On-site and dynamic experiences | `zCGzM0JxvRg` — "Real-Time UI Generation: Building Dynamic Web Experiences with GenUI" (Adam Lucek) | old video was a generic dev/AI coding channel, not marketing personalization | `D-CAsdfqZ0k` — "Dynamically Personalize Content Seamlessly & at Scale with Marketo Engage \| Adobe for Business" (Adobe for Business) |
| Podcasting & Audio | Audio as the trust medium | `0k7Ce0e0Vjc` — "How to Build Brand Authority Through Content and Proof" (Follow Up Media) | old video never mentioned podcasting/audio; weak fit | `ZMQ-5SLcJcs` — "The Growth Loop: How Brands use Podcasting to Drive Awareness, Trust, and Demand" (Podcast Movement) |
| Podcasting & Audio | Distribution and measurement | `bPFNxD3Yg6U` — "The Shape of Data: Distributions: Crash Course Statistics #7" (CrashCourse) | old video was a statistics course on probability distributions (keyword collision on "Distribution") | `mQC5azLx4BI` — "How To Measure Your Podcast Metrics & Downloads On All Platforms" (The Millennial Entrepreneur Harrison Baron) |
| Presentation Design | Decks that make decisions happen | `GXxm2Vy7dbM` — "Give Me 23 Minutes and Never Struggle With a Decision Again" (Jay Shetty Podcast) | old video was a personal decision-making podcast episode, not about decks | `aMxvnonuI7Q` — "The Best Presentation Design Tips to Create the Perfect Deck" (Slidebean) |
| Prompt Engineering for Marketers | The R-O-C-F-F framework | `p09yRj47kNM` — "Google's 9 Hour AI Prompt Engineering Course In 20 Minutes" (Tina Huang) | duplicate of lesson 1; weak fit for framework-specific lesson | `h6RFksMw99Q` — "Well Structured Prompts Explained with Examples (No Coding!) \| Prompt Engineering \| GenAI" (Sundeep Saradhi Kanthety) |
| Storytelling & Brand Narrative | Narrative as connective tissue | `0z9rF2kJaXs` — "Connective Tissue \| Everything you need to know!" (Dr Matt & Dr Mike) | old video was medical/anatomy content about literal connective tissue | `a4ewfQKheVs` — "What is a Brand Narrative? (and WHY every brand needs one)" (Hoffi) |
| Storytelling & Brand Narrative | Plot, proof and repetition | `-mu5RmxB4Wk` — ""What to do if anyone takes Illegal Possession of your Land?" Good arguments by both Advocates #law" (Law Now) | old video was unrelated legal content about land-possession disputes | `a6XX8a46wzE` — "Why Brands Repeat Themselves" (Philippe Khin) |

## Courses with at least one changed video

- affiliate-partnerships
- brand-strategy-for-marketers
- community-management
- content-marketing-strategy
- display-retargeting
- google-ads-ppc-search
- growth-data-storytelling
- growth-marketing-playbook
- hubspot-crm-quickstart
- influencer-marketing-campaigns
- landing-pages-that-convert
- market-research-insights
- marketing-analytics-with-ga4
- marketing-attribution-roi
- marketing-automation-systems
- marketing-strategy-plans-that-win
- performance-analysis
- performance-marketing-playbook
- personalization-at-scale
- podcasting-audio
- presentation-design
- prompt-engineering-for-marketers
- storytelling-brand-narrative

## Method

1. Parsed `prisma/seed.ts` (the `courses` and `generated` arrays) without executing `main()` or touching the database, to build the authoritative `courseSlug|order -> lesson title` map (202 lessons total, matching slugify() in seed.ts).
2. Parsed `prisma/lesson-videos.ts` and merged; confirmed all 202 lessons have an explicit `LESSON_VIDEOS` entry (no lesson fell back to `generateVideoUrl` or an inline-only `v:`), and no stale keys existed.
3. Called the YouTube oEmbed API for all 193 unique video ids (8-way parallel via `xargs`), recording HTTP status, title, and channel. All 193 returned HTTP 200 with a title.
4. Manually reviewed every (lesson topic, real video title/channel) pair against the FAIL criteria (unavailable, off-topic, non-marketing/non-instructional, clickbait, non-English, weak duplicate use). Found 38 failing entries, largely keyword-collision mismatches (e.g. "amplification" -> audio amplifier hardware, "hygiene" -> dental clinic workflows, "stage" -> esports tournament, "distribution" -> statistics distributions, "measurements" -> medical mortality stats) plus a few wrong-platform swaps (Meta Ads video used for a Google Ads lesson, Facebook custom events used for a GA4 lesson) and same-course duplicate reuse.
5. Sourced replacement candidates via web search restricted to youtube.com and credible marketing/education channels (HubSpot, Loves Data, Adobe/Marketo, Wynter, Brand Master Academy, IMPACT, Influencer Hero, etc.), then verified every replacement id via the same oEmbed call before use — no unverified ids were written.
6. Rewrote `prisma/lesson-videos.ts` with the 38 ids swapped in place, preserving the export shape, alphabetical key order, and 2-space indentation. Left `prisma/seed.ts` untouched (its 28 inline `v:` fields are already fully superseded by `LESSON_VIDEOS` for every lesson, so removing them was unnecessary and risked colliding with concurrent edits from other agents).
7. Verified the rewritten file with `npx tsc --noEmit --skipLibCheck prisma/lesson-videos.ts` (passes) and by importing it with `tsx`, confirming `Object.keys(LESSON_VIDEOS).length === 202`.


## Follow-up pass: marketing-orientation review

A second sweep re-read all 197 remaining video titles specifically against the
"must be marketing-oriented" bar (rather than only "must be on-topic"). Three videos were
on-topic but were **developer/IT tooling tutorials** rather than marketing instruction, and were
replaced. Each replacement was verified via oEmbed before use.

| Course | Lesson | Old video (id / title / channel) | Reason for failure | New video (id / title / channel) |
|---|---|---|---|---|
| Agentic Marketing | Supervision and guardrails | `ruiLq0OzjkI` — "Guardrails with LangChain: A Complete Crash Course for Building Safe AI Agents" (Krish Naik) | on-topic but a developer-framework (LangChain) coding tutorial, not marketing instruction | `iqelqdr7qbo` — "How AI Stays on Brand: Guardrails for Compliance & Safety" (Braze) |
| AI Workflow Automation | Workflows that run on their own | `_w-jVw8Uhc0` — "NEW Copilot Workflows Agent Will Automate Your Job (Full Tutorial)" (Collaboration Simplified) | Microsoft Copilot Studio / IT-productivity tutorial, not marketing workflow automation | `SWzEVKCqPwc` — "8 AI Marketing Workflows That Will Drive INSANE Growth" (Leveling Up with Eric Siu) |
| Prompt Engineering for Marketers | Evaluation and refinement loops | `c55QeP69I2E` — "Create Skills with the Iterative Refine Loop in Copilot Studio" (Andrew Hess) | Copilot Studio product tutorial, not a general prompt evaluation/refinement lesson | `9UqVyIgpl74` — "Lesson 5 of Prompt Engineering: Evaluating & Refining Prompts" (Aleksandar Popovic) |

### Availability re-verification

After the follow-up pass, all **197 unique video ids** covering all **202 lessons** were re-checked
against the YouTube oEmbed API one by one: **197/197 returned HTTP 200** with a title — every
lesson video is live and embeddable. Every title was then scanned for the off-topic patterns that
caused the original failures (gaming, medical/exam prep, hardware, unrelated academic lectures,
non-English, non-instructional); the only remaining matches were false positives on the words
"crash course" and "anatomy" inside genuine marketing titles
("Headlines Copywriting Crash Course", "The Anatomy Of A High Converting Landing Page").

The database was reseeded after each pass, so all 202 `Lesson.videoUrl` values in `dev.db` match
this file exactly (verified programmatically: 202 matching, 0 mismatched, 0 unmapped).


## New-course videos (curriculum expansion)

Six new marketing courses were added to `prisma/seed.ts` (Marketing Operations & RevOps,
Campaign & Project Management, Marketing Finance & Budgeting, Privacy Ethics & Governance,
Events & Field Marketing, Shopper & Channel Marketing — 30 lessons, 5 each). Each lesson needed
a real, topical video sourced and verified from scratch; none of the 30 ids were reused from the
existing 202-entry map or from each other.

**Verification method.** Every candidate id was checked against the YouTube oEmbed endpoint
(`/oembed?url=...&format=json`) and only written in if it returned HTTP 200 with a title/author —
this also confirmed the video is not private, deleted, or region-blocked. The returned title and
channel were then read against the lesson's actual subject matter (not just keyword overlap) and
against a list of credible marketing/business-education channels, per the brief.

**Duration.** Partway through this pass a hard constraint was added: no lesson video may be under
300s (no Shorts/clips), the target band is 600–900s, up to 3600s is acceptable for a genuinely
strong teaching resource but only sparingly, and duration had to be checked by scraping
`lengthSeconds` off the watch page rather than guessed. That scrape worked for the first ~101
candidates checked, after which YouTube began rate-limiting this session's IP (HTTP 429 via a
`/sorry/index` bot-check page) and the scrape stopped returning data even after slowing the
request cadence and adding a browser User-Agent. Per the coordinator's guidance, the scrape was
not retried in a tight loop; oEmbed relevance verification continued as normal for every
candidate, and for lessons where every duration-verified candidate was either off-topic, too
short, or undesirably long, a second-round candidate was chosen on title/channel signal only
(favoring "guide", "explained", "tutorial", full-sentence titles from a named educational or
vendor channel, and explicitly avoiding "#shorts", "in N seconds/minutes", quick-tip framing, or
vertical-clip channels) and its **Length is marked `unverified`** below rather than guessed. 24 of
the 30 have a scraped, confirmed length; 6 are unverified pending the coordinator's YouTube Data
API key.

Two lessons (`marketing-operations-revops|2` and `privacy-ethics-governance|5`) ended up with a
confirmed-but-long pick (1384s and 1069s) because every mid-length candidate for those specific
topics (enterprise marketing taxonomy governance; data-governance operating models) was either a
sub-300s clip or a 25–60 minute webinar — no other lesson in this batch exceeds 911s.

| Course | Lesson | Video id | Length (s) | Title | Channel |
|---|---|---|---|---|---|
| Marketing Operations & RevOps | 1. What marketing operations actually owns | `zJa5gAZOidw` | 478 | Marketing Operations – Beginner's Guide \| Basics of Marketing Operations | UniAthena |
| Marketing Operations & RevOps | 2. Campaign taxonomy and naming | `DUyOAJ4X0SY` | 1384 | Marketing Taxonomy 101 | Claravine |
| Marketing Operations & RevOps | 3. Lifecycle stages and lead routing | `doIUYCO0xUs` | 714 | Decoding HubSpot's Lifecycle, Lead + Deal Stages | Kiwi Creative |
| Marketing Operations & RevOps | 4. Data quality and the audit habit | `TiiG0cynE1g` | unverified | 6 Tips & Tools to Improve Data Quality in Salesforce | Salesforce Explorer |
| Marketing Operations & RevOps | 5. Reporting and change management | `gqBUrCsVPNg` | 670 | How to build marketing reports that actually drive decisions | Funnel |
| Campaign & Project Management | 1. The brief is the plan's foundation | `m9KNriatkZs` | 364 | How to Write a Powerful CREATIVE BRIEF (GUIDE) | HubSpot Marketing |
| Campaign & Project Management | 2. Scope, milestones and the critical path | `AWzP01i1ZIU` | unverified | Project Planning & Scheduling Explained \| Critical Path Method (CPM) Made Simple | MBA For Every One |
| Campaign & Project Management | 3. Risks, contingency and the pre-mortem | `x97IzhB5bPo` | 353 | Pre-Mortem: Avoid Project Failure with This Simple Trick! | Online PM Courses – Mike Clayton |
| Campaign & Project Management | 4. Running the campaign to launch | `lviXtSN-iUw` | 622 | How to Launch a Marketing Campaign (Step-by-Step Guide) | The Modern Marketing Institute |
| Campaign & Project Management | 5. Retrospectives that change behaviour | `YtQcPu9gd4A` | 613 | How To Run An Effective Project Retrospective | Helena Liu |
| Marketing Finance & Budgeting | 1. The commercial vocabulary | `E3_VI3RNY4I` | 911 | 20 Marketing Metrics That Drive REVENUE: The LTV, CAC, & ROAS Framework | Rafal Reyzer |
| Marketing Finance & Budgeting | 2. Building a marketing budget | `Bl6UX7oNHEM` | 421 | How to Create a Marketing Budget – Even If You've Never Made One Before! | The Seasoned Marketer |
| Marketing Finance & Budgeting | 3. Unit economics and payback | `MV4_Y2YHqL0` | 433 | CAC Analysis in Excel: LTV/CAC Ratio & Payback Period \| CLV Dashboard Part 2 | Dan McCarthy |
| Marketing Finance & Budgeting | 4. The business case | `Zj_RhGZevdQ` | 390 | How to write a business case that gets approved | Association for Project Management |
| Marketing Finance & Budgeting | 5. Reporting numbers to leadership | `LP5Y8d_5f-c` | 597 | How to Create the Best Marketing Dashboards That ACTUALLY Make Sense | Funnel |
| Privacy, Ethics & Governance | 1. The data you are actually holding | `dzAForR-3ik` | unverified | GDPR How to Address the Data: Data Flow Mapping and Inventory | KPMG US |
| Privacy, Ethics & Governance | 2. Consent, preferences and unsubscribes | `l2LqzAFEcn0` | 399 | GDPR Compliance for Email Marketing Explained (Tutorial Included!) | Omnisend |
| Privacy, Ethics & Governance | 3. Disclosure and honest claims | `SgYjaSPzgPE` | 383 | Mastering Influencer Marketing: Understanding FTC Guidelines for Success | Debutify |
| Privacy, Ethics & Governance | 4. Automated decisions and AI governance | `hSFKGGNPhP0` | unverified | Guardrails For Growth: Responsible AI In Business & Marketing | Tenlo Marketing |
| Privacy, Ethics & Governance | 5. The governance operating rhythm | `HL3qZWwj_00` | 1069 | 11. Structuring Data Governance | Texas Department of Information Resources |
| Events & Field Marketing | 1. Strategy before venue | `jWEim5HwKXs` | unverified | The Core Principles of Strategic Event Marketing: Measurement, Ownership, and Pipeline Impact | Rockway Exhibits + Events |
| Events & Field Marketing | 2. Budget, vendors and logistics | `-SHUR17qYvo` | 870 | Event Logistics and Venue Management \| Online Training | Training Express |
| Events & Field Marketing | 3. Promotion and registration | `jAeDUIQOXRc` | 798 | Event Marketing: 5 Tactics to Sell Out | Skift Meetings |
| Events & Field Marketing | 4. Lead capture and follow-up | `cpiq3M2VQNk` | 862 | How to Capture & Follow Up With Conference Leads in HubSpot \| Strategic HubSpot Tutorial | The Gist – HubSpot Strategists |
| Events & Field Marketing | 5. Measuring beyond attendance | `IbPHkjLDyY8` | 687 | A Strategic Approach to Event ROI Measurement | Rockway Exhibits + Events |
| Shopper & Channel Marketing | 1. Three audiences, not one | `Y_ZOVefxp78` | 730 | What is Shopper Marketing and Where Does It Fit With Category Management | Sue Nicholls |
| Shopper & Channel Marketing | 2. Category and channel economics | `FNY-Gg8MJ-M` | 682 | Retail Management \| Category Management \| Tutorialspoint | TutorialsPoint |
| Shopper & Channel Marketing | 3. Designing promotions that pay | `d6dceVDWQv4` | unverified | Improving Trade Promotion Planning and Sales Forecasting | Promomash |
| Shopper & Channel Marketing | 4. Merchandising and in-store execution | `f39PKg-zLAs` | 554 | In Store Design for Visual Merchandising \| Online Course | Training Express |
| Shopper & Channel Marketing | 5. The retailer conversation and the review | `xV2AJCnS3lo` | 605 | Secrets To Impress Retail Buyers: Tips To Prepare, Present, & Succeed In Meetings! | RetailBound |

All 232 lessons in `dev.db` (202 existing + 30 new) were reseeded and verified programmatically
to match `LESSON_VIDEOS` exactly: 232 matching, 0 mismatched, 0 unmapped. `npx tsc --noEmit`
passes clean.

## Length-policy pass

Generated 2026-08-31. A second pass enforced the site's video-length policy — nothing under
300s (5 min), no Shorts, target 600–900s (10–15 min), longer only sparingly and never past
3600s (60 min) — across the 20 lessons that had drifted outside that window (8 too short, 12
too long). Each replacement was verified with all three checks: YouTube oEmbed (relevance),
the `/shorts/<id>` probe (must return 303, not 200), and a scraped `lengthSeconds` from the
watch page (300–3600s required). None of the 232 lessons now sit outside 5–60 minutes, and none
of these 20 replacements landed over 30 minutes, so the "no more than ~3 videos over 30 min"
budget for the catalogue is untouched by this pass.

| Course | Lesson | Old video (id / length) | Reason | New video (id / length / title / channel) |
|---|---|---|---|---|
| Content Marketing Strategy | 1. Content strategy, not content tasks | `UlSLziMzBdQ` / 5640s (94 min) | too long | `TcdbemNhlyI` / 1153s (19.2 min) — "How to Create a Content Marketing Strategy that Works [Beginners Guide]" (Rank Math SEO) |
| Content Marketing Strategy | 3. Production systems that scale | `QMsb6-e8M5Y` / 263s | too short | `w0hZJdPt--Q` / 590s (9.8 min) — "The Only System You Need for Content Repurposing" (Jacqui Naunton // White Deer) |
| Content Marketing Strategy | 4. Distribution is 80% of the job | `UKFmocz14wU` / 45s | too short | `If1H1fEm4FU` / 636s (10.6 min) — "Content Distribution Strategy to 10x your Reach and Growth" (StoryLabai) |
| Shopper & Channel Marketing | 3. Designing promotions that pay | `d6dceVDWQv4` / 112s | too short | `UV3fOXm9WOY` / 338s (5.6 min) — "Effective model for trade marketing with strategy and examples" (Uni Square Concepts) |
| PR & Communications | 3. Measuring PR like marketing | `w66pngZLxio` / 115s | too short | `bggYfmIaiPk` / 338s (5.6 min) — "What Tools Help Measure Public Relations Success?" (Crisis Response Coach) |
| Campaign & Project Management | 2. Scope, milestones and the critical path | `AWzP01i1ZIU` / 131s | too short | `ijZ8AISuYZo` / 1478s (24.6 min) — "Critical Path Method (CPM) Made Simple: A Complete Guide" (PM Aspirant) |
| Privacy, Ethics & Governance | 1. The data you are actually holding | `dzAForR-3ik` / 162s | too short | `MdnwQ33yTBg` / 1170s (19.5 min) — "Data Inventories, Mapping, and Records of Process \| Privacy PowerUp #3" (TrustArc) |
| Influencer Marketing Campaigns | 2. The 3-R framework for creators | `sKLYwcAkMgg` / 186s | too short | `Rz-sxmy1VhE` / 395s (6.6 min) — "How to Judge an Influencer - The 3R Test for Influencers" (Professor Wolters) |
| Affiliate & Partnerships | 3. Managing performance and piracy | `o9wh5dSiCds` / 190s | too short | `yevkUZDMHg4` / 392s (6.5 min) — "Affiliate Fraud: What It Is and How to Stop It" (Trackdesk) |
| Affiliate & Partnerships | 2. Recruiting and onboarding partners | `AJynQE6IMKg` / 3600s (60 min) | too long | `baDyVWcoCxE` / 315s (5.25 min) — "Affiliate Recruitment is Hard... Until You Learn This" (Rewardful) |
| Performance Marketing Playbook | 1. The performance mindset | `Mf2rEH0C1Vw` / 7200s (120 min) | too long | `qcdxj9wdvu8` / 1296s (21.6 min) — "How to Calculate CAC & LTV \| The 2 Key Metrics for Growth" (Rish from Mapplinks) |
| Lifecycle & Retention Marketing | 3. Engagement and loyalty loops | `4fLBhviGaKE` / 4380s (73 min) | too long | `TUeVLYeHDcw` / 389s (6.5 min) — "The Loyalty Loop – Why Retention Is the New Reach" (Cyber PR Army Solutions Inc.) |
| Lifecycle & Retention Marketing | 4. Re-engagement and win-back | `T92KL7Kw620` / 4980s (83 min) | too long | `XZcRcNd3A38` / 434s (7.2 min) — "3 Part Re-Engagement Email Campaign: How to Win Back Inactive Subscribers With This Email Series" (Kate Emiley) |
| Product Marketing: Go-To-Market | 2. Buyer personas and jobs-to-be-done | `xQV7HVyAJjc` / 4140s (69 min) | too long | `nKbnpi7UPNE` / 898s (15.0 min) — "Best Buyer Personas: A Jobs-to-Be-Done Framework for Creating Buyer Personas - Adrienne Barnes" (Wynter) |
| Lead Generation Systems | 1. The lead-gen machine | `elOF2kB7YqM` / 4020s (67 min) | too long | `TB5iX6MwKTg` / 482s (8.0 min) — "How to Build a Converting Lead Generation Funnel in 3 Steps" (Snovio) |
| Brand Strategy for Marketers | 5. Measuring brand health | `D9cuOFlribg` / 3960s (66 min) | too long | `ZbPUi247wI8` / 482s (8.0 min) — "Brand tracking – Explained!" (Attest) |
| Personalization at Scale | 3. Segment-level journeys | `x9V-7G3QGGI` / 3900s (65 min) | too long | `mpy5vyyqelk` / 599s (10.0 min) — "How to Create Personalized Customer Journeys with AI (Loop Marketing Tailor Stage)" (HubSpot Marketing) |
| Video Content Creation Bootcamp | 1. The video-first content plan | `acL-XLck5xE` / 3720s (62 min) | too long | `fpKsqCpH7rA` / 535s (8.9 min) — "How To Create A Video Marketing Strategy" (Nate Woodbury) |
| Visual Design & Canva | 1. Visual consistency as brand trust | `y1YiAKzivsg` / 3660s (61 min) | too long | `3b6thkp9Mbk` / 1073s (17.9 min) — "How to Setup Your Canva Brand Kit (2025) \| Logos, Colours, Fonts, Brand Imagery & More" (Brenda Cadman, Canva Verified Expert) |
| Performance Analysis | 3. Acting on the analysis | `F6cnASKpzIg` / 3600s (60 min) | too long | `Av-Q4HWya8Y` / 728s (12.1 min) — "How to Make Data Driven Decisions in Marketing (12 Minutes)" (BioTech Whisperer) |

Candidates discarded during sourcing (all caught before spending a watch-page request, or
disqualified once one confirmed the length):

- **Shorts** (`/shorts/<id>` returned 200): `_VC8lfsqRCE`, `4rO3rI4acFg`, `Zk1wfHKVbZc`,
  `N23I4sM2NeE`, `xwkaoz7dcP4`, `asDuE3hoMoQ`, `-i53ZFa4mhU` — 7 discarded.
- **Too short on the watch-page check** (<300s): `72h8Lerjv88` (177s), `qduiHxylQms` (181s),
  `gSJSqvs20F0` (130s), `vV3YUaUg5i8` (291s), `te0bpu58bZ4` (146s) — 5 discarded.
- **Too long on the watch-page check** (over the 3600s/60 min cap, or compliant but consuming
  the catalogue's >30 min budget unnecessarily when a tighter same-topic fit existed):
  `8vj3uyH66OI` (3775s, over the cap), `KylU9gq2_qM` (5720s, over the cap), `OkO1927ZPlA`
  (2121s), `kcTBD4R1IQ4` (3040s), `1DjbBrHcrXQ` (3521s), `bLO1LhZs5rg` (1876s), `zF1saaXA-ms`
  (2834s), `7DhsQOfoEjg` (3155s), `Z3VOBDDg4xs` (2941s), `W5bP1I9ipwM` (1766s) — 10 discarded
  in favor of tighter-length alternatives on the same topic.

No HTTP 429 was hit during this pass. Watch-page requests were paced at 3+ seconds apart and
run strictly sequentially (never in parallel); oEmbed and the `/shorts/` probe (118 candidate
ids checked, 7 caught as Shorts before spending a watch-page request) were used first to filter
candidates, so 35 watch-page duration checks (20 first-choice + 15 fallback) were needed in
total to land all 20 compliant replacements — comfortably under the ~110-request threshold that
triggered the earlier rate-limit today.
