import { PrismaClient } from "../src/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcryptjs";
import { LESSON_VIDEOS } from "./lesson-videos";
import { COURSE_IMAGES } from "./course-images";
import { COURSE_COVERS } from "./course-skills";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* ------------------------------------------------------------------ */
/* Skills — demand scores grounded in 2026 hiring research             */
/* ------------------------------------------------------------------ */

type SkillSeed = {
  name: string;
  category: string;
  demandScore: number;
  color: string;
  description: string;
};

const skills: SkillSeed[] = [
  // Operations, commercial and governance disciplines (guide sections 3.11,
  // 3.14, 3.15 and the cross-cutting core capabilities in section 2)
  { name: "Marketing Operations & RevOps", category: "Lifecycle & Automation", demandScore: 82, color: "#e0563f", description: "Making marketing measurable and repeatable: campaign taxonomy, data models, lead routing, reporting and system governance across the marketing and sales stack." },
  { name: "Campaign & Project Management", category: "Strategy & Brand", demandScore: 76, color: "#c15b8a", description: "Turning a marketing goal into scope, milestones, owners, dependencies and quality checks — the skill that decides whether a plan actually ships." },
  { name: "Marketing Finance & Budgeting", category: "Analytics & Data", demandScore: 74, color: "#b8603f", description: "Commercial literacy for marketers: budgets, CAC, lifetime value, payback, margin and the business case that wins funding for a plan." },
  { name: "Privacy, Ethics & Governance", category: "Analytics & Data", demandScore: 71, color: "#a4644f", description: "Using customer data lawfully and respectfully: consent, data flows, disclosure of sponsored content, claims review and brand safety controls." },
  { name: "Events & Field Marketing", category: "Creative & Web", demandScore: 65, color: "#d4795e", description: "In-person and partner-led programmes — events, field marketing, sponsorships and experiential — run from brief and budget through lead capture to pipeline reporting." },
  { name: "Shopper & Channel Marketing", category: "Strategy & Brand", demandScore: 62, color: "#9c6b73", description: "Influencing demand inside retail and distributor ecosystems: category analysis, promotions, merchandising, sell-in and post-promotion evaluation." },
  // AI & Emerging
  { name: "AI Marketing", category: "AI & Emerging", demandScore: 98, color: "#ff5f6d", description: "Applying generative AI across campaign creation, segmentation, personalization and measurement. The #1 skill marketers expect to need over the next five years." },
  { name: "Prompt Engineering", category: "AI & Emerging", demandScore: 90, color: "#ff7480", description: "Writing structured prompts that turn AI tools into reliable marketing teammates for copy, research, strategy and creative." },
  { name: "AI Workflow Automation", category: "AI & Emerging", demandScore: 88, color: "#ff8a5c", description: "Designing multi-step automated workflows that move leads, content and reporting through the funnel without manual work." },
  { name: "GEO / AEO", category: "AI & Emerging", demandScore: 85, color: "#ffa05c", description: "Generative Engine Optimization — earning presence in AI answers, chatbots and LLM search surfaces." },
  { name: "Agentic Marketing", category: "AI & Emerging", demandScore: 74, color: "#b48aff", description: "Agentic commerce and autonomous agents that execute campaign tasks end-to-end under human supervision." },

  // Analytics & Data
  { name: "Marketing Analytics (GA4)", category: "Analytics & Data", demandScore: 94, color: "#22d3ee", description: "Reading GA4, tracking events and turning behavioral data into decisions. The most universally required marketing skill." },
  { name: "Performance Analysis", category: "Analytics & Data", demandScore: 92, color: "#38c8ee", description: "Interpreting conversion, ROI and channel performance to reallocate budget toward what actually works." },
  { name: "Data Visualization", category: "Analytics & Data", demandScore: 82, color: "#5fb4ee", description: "Building charts, dashboards and narratives that make numbers persuasive to stakeholders." },
  { name: "A/B Testing & Experimentation", category: "Analytics & Data", demandScore: 80, color: "#7b9fee", description: "Designing rigorous experiments on ads, landing pages and emails and reading the results correctly." },
  { name: "Marketing Attribution", category: "Analytics & Data", demandScore: 76, color: "#8e8bee", description: "Modeling which channels and touches actually drive revenue across multi-touch journeys." },
  { name: "Market Research & Insights", category: "Analytics & Data", demandScore: 70, color: "#a07cee", description: "Surveys, interviews and secondary research that keep strategy grounded in real customer behavior." },

  // Paid Media
  { name: "Performance Marketing", category: "Paid Media", demandScore: 93, color: "#ffb85c", description: "Full-funnel paid acquisition built around measurable ROI, incrementality and efficiency targets." },
  { name: "Google Ads / PPC", category: "Paid Media", demandScore: 90, color: "#ffc968", description: "Search, Shopping and PMax campaigns — structure, bidding, keyword strategy and ad copy." },
  { name: "Influencer Marketing", category: "Paid Media", demandScore: 89, color: "#ffd975", description: "The fastest-growing marketing job. Finding creators, structuring collaborations and amplifying content." },
  { name: "Meta & Paid Social", category: "Paid Media", demandScore: 87, color: "#b8e25c", description: "Facebook and Instagram ads — audiences, creative testing and full-funnel social acquisition." },
  { name: "Programmatic Advertising", category: "Paid Media", demandScore: 73, color: "#70e27c", description: "Automated media buying across display and video using DSPs, data and real-time bidding." },
  { name: "Paid Video Advertising", category: "Paid Media", demandScore: 72, color: "#5ce2a0", description: "Video-first campaigns on YouTube, CTV and social — hooks, creative and placement strategy." },
  { name: "Display & Retargeting", category: "Paid Media", demandScore: 66, color: "#4ce0c8", description: "Audience-driven display and retargeting funnels that recapture warm prospects." },

  // Lifecycle & Automation
  { name: "Marketing Automation", category: "Lifecycle & Automation", demandScore: 87, color: "#7c5cff", description: "Automation platforms and workflows that scale campaigns, scoring and nurture journeys." },
  { name: "Email Marketing", category: "Lifecycle & Automation", demandScore: 85, color: "#8f71ff", description: "List building, segmentation, lifecycle campaigns and deliverability for owned-channel revenue." },
  { name: "Lead Generation", category: "Lifecycle & Automation", demandScore: 83, color: "#a087ff", description: "Demand capture systems — offers, forms, landing pages and pipelines built to convert." },
  { name: "CRM & HubSpot", category: "Lifecycle & Automation", demandScore: 81, color: "#b0a0ff", description: "Managing contacts, lifecycle stages, lead scoring and pipeline reporting in a CRM." },
  { name: "Lifecycle & Retention", category: "Lifecycle & Automation", demandScore: 78, color: "#c0b8ff", description: "Onboarding, win-back and loyalty strategies that maximize customer lifetime value." },
  { name: "Personalization & CRO", category: "Lifecycle & Automation", demandScore: 79, color: "#8fc0ff", description: "Conversion rate optimization and tailored experiences that turn visitors into customers." },

  // Content & Social
  { name: "SEO", category: "Content & Social", demandScore: 88, color: "#36d1dc", description: "Search-first content that earns rankings — technical, on-page and content SEO." },
  { name: "Content Marketing", category: "Content & Social", demandScore: 86, color: "#4fc9d9", description: "Planning and producing content that attracts, nurtures and converts across channels." },
  { name: "Social Media Management", category: "Content & Social", demandScore: 84, color: "#5fb6d9", description: "Running social channels as a growth engine — calendars, engagement and reporting." },
  { name: "Short-form Video", category: "Content & Social", demandScore: 82, color: "#78a5d9", description: "Reels, TikTok and Shorts — hooks, retention and packaging ideas that travel." },
  { name: "Copywriting", category: "Content & Social", demandScore: 79, color: "#8d95d9", description: "Writing that sells — ads, landing pages, emails and campaigns built to convert." },
  { name: "Video Content Creation", category: "Content & Social", demandScore: 77, color: "#a287d9", description: "Producing, shooting and editing video that performs across organic and paid surfaces." },
  { name: "Community Management", category: "Content & Social", demandScore: 68, color: "#b886d9", description: "Building engaged communities that compound loyalty and word of mouth." },
  { name: "Blogging & Long-form", category: "Content & Social", demandScore: 65, color: "#d082d9", description: "Long-form SEO and thought leadership that builds authority and organic reach." },

  // Strategy & Brand
  { name: "Growth Marketing", category: "Strategy & Brand", demandScore: 88, color: "#f4724c", description: "Experimental, metric-driven cross-channel growth grounded in compounding loops." },
  { name: "Marketing Strategy", category: "Strategy & Brand", demandScore: 86, color: "#f78a50", description: "Segmentation, positioning, planning and resource allocation that wins the market." },
  { name: "Product Marketing", category: "Strategy & Brand", demandScore: 84, color: "#faa259", description: "Go-to-market ownership — positioning, launch, messaging and enablement for products." },
  { name: "Brand Strategy", category: "Strategy & Brand", demandScore: 78, color: "#fdb96c", description: "Building differentiation, identity and reputation that compounds over time." },
  { name: "Go-To-Market", category: "Strategy & Brand", demandScore: 78, color: "#fecf7e", description: "Launching and scaling launches with aligned pricing, messaging and channel plans." },
  { name: "Customer Experience", category: "Strategy & Brand", demandScore: 79, color: "#e0d05f", description: "Mapping and improving every touchpoint that shapes how customers feel about your brand." },
  { name: "Storytelling & Brand Narrative", category: "Strategy & Brand", demandScore: 75, color: "#b8cd4f", description: "Crafting narratives that make products and brands memorable and shareable." },

  // Creative & Web
  { name: "UX for Marketers", category: "Creative & Web", demandScore: 72, color: "#5ce2c0", description: "Understanding usability, persuasion and intent to improve the experiences campaigns send people to." },
  { name: "Landing Pages & Web Design", category: "Creative & Web", demandScore: 71, color: "#5cd7e2", description: "Designing high-converting pages with clear hierarchy, proof and calls to action." },
  { name: "Visual Design & Canva", category: "Creative & Web", demandScore: 70, color: "#5cc5e2", description: "Producing on-brand visuals that stop the scroll across social and paid." },
  { name: "Launch Marketing", category: "Creative & Web", demandScore: 69, color: "#5fac9f", description: "Planning launches that create demand events and convert attention into buyers." },
  { name: "Affiliate & Partnerships", category: "Creative & Web", demandScore: 66, color: "#7c9fee", description: "Scaling distribution through affiliates, partners and strategic alliances." },
  { name: "Presentation Design", category: "Creative & Web", demandScore: 64, color: "#8e8bee", description: "Turning strategy into decks and demos that persuade, sell and inform." },
  { name: "PR & Communications", category: "Creative & Web", demandScore: 62, color: "#b48aff", description: "Earning media coverage and managing reputation through storytelling and relationships." },
  { name: "Podcasting & Audio", category: "Creative & Web", demandScore: 60, color: "#d082d9", description: "Using audio to build audience, authority and distribution." },
];

/* ------------------------------------------------------------------ */
/* Courses + lessons                                                   */
/* ------------------------------------------------------------------ */

type LessonSeed = {
  title: string;
  d: number; // duration min
  c: string; // content
};

type CourseSeed = {
  title: string;
  headline: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  category: string;
  skill: string;
  description: string;
  lessons: LessonSeed[];
};

const courses: CourseSeed[] = [
  {
    title: "Marketing Operations & RevOps",
    headline: "Make marketing measurable and repeatable with clean taxonomy, data and routing.",
    level: "Intermediate",
    category: "Lifecycle & Automation",
    skill: "Marketing Operations & RevOps",
    description:
      "Marketing operations is what turns a set of campaigns into a system: naming that survives contact with reality, a data model people trust, leads that reach the right owner, and reporting nobody has to argue about.\n\nThis course covers the operating layer between marketing, sales and data — taxonomy, lifecycle stages, routing, data quality and governance — and the documentation that makes it stick.",
    lessons: [
      { title: "What marketing operations actually owns", d: 8, c: "Marketing operations sits at the boundary of marketing, sales, data and technology. The remit is systems administration, campaign operations, lead and account process, data quality, integration, reporting and governance. The job is not configuring software — it is reducing friction and improving decision quality.\n\nThe clearest way to see the value is to look for the failures ops prevents: two teams reporting different numbers for the same campaign, leads sitting unworked for a week, a dashboard nobody trusts, a field that three people fill in three ways.\n\nStart by mapping your own stack: what systems hold customer data, which is the source of truth for each object, and where data crosses a boundary. Every integration point is a place quality can break.\n\nAction: draw your current stack on one page and mark the source of truth for contacts, accounts and campaigns." },
      { title: "Campaign taxonomy and naming", d: 23, c: "A campaign taxonomy is the naming and structure convention that makes reporting possible. Without one, spend cannot be rolled up, channels cannot be compared, and every analysis begins with manual cleanup.\n\nA workable convention has a small number of fixed dimensions — for example region, business unit, channel, objective, quarter and a short descriptor — each drawn from a controlled list rather than free text. Controlled lists matter more than clever names: the value comes from the fact that everyone picks from the same options.\n\nWrite it down, publish it, and add validation where the platform allows it. A taxonomy that lives in one person's head is not a taxonomy.\n\nAction: define your dimensions and their allowed values, then rename one live quarter of campaigns to match." },
      { title: "Lifecycle stages and lead routing", d: 12, c: "Lifecycle stages describe where a person or account is in the relationship — for instance subscriber, lead, qualified, opportunity, customer. They only work if each transition has an explicit, testable definition and a single owner.\n\nRouting then decides who picks the record up: by territory, segment, account ownership, product interest or round robin. Two rules prevent most pain — every record must have an owner, and every routing path must have a fallback for the cases your rules did not anticipate.\n\nInstrument the handoff. Time-to-first-touch and the proportion of records that never get worked are the two numbers that expose a broken process fastest.\n\nAction: write definitions for each of your lifecycle stages and trace one record end to end through your routing rules." },
      { title: "Data quality and the audit habit", d: 9, c: "Data quality is a process, not a cleanup project. The durable pattern is prevention plus a recurring audit: constrain input with picklists and required fields, normalise on entry, deduplicate on a defined match rule, and then check the same short list of conditions every month.\n\nUseful audit checks include records missing an owner, contacts with no account, invalid email formats, duplicates above a threshold, campaigns off-taxonomy and stages that skipped a transition. Keep the list small enough that it actually gets run.\n\nDocument the match rule and the merge precedence before you deduplicate anything. Merging is destructive and disagreements surface afterwards.\n\nAction: build a data dictionary for your five most-used fields and run your first monthly audit." },
      { title: "Reporting and change management", d: 11, c: "Reporting is where operations earns trust. Agree the metric definitions first, in writing, then build to them: one number, one definition, one owner. A dashboard that disagrees with the CRM will be abandoned no matter how well designed it is.\n\nThe harder half is change management. Systems only create value when people use them consistently, which means enablement, documentation and a channel for reporting problems. Announce changes before they land, explain what breaks, and keep a decision log so the reasoning survives staff turnover.\n\nBuild the portfolio evidence as you go: campaign taxonomy, data dictionary, routing workflow, dashboard specification, automation map and a quality-control checklist.\n\nAction: write a one-page dashboard specification with metric definitions and the owner for each." },
    ],
  },
  {
    title: "Campaign & Project Management",
    headline: "Turn a marketing goal into scope, milestones, owners and a plan that ships.",
    level: "Beginner",
    category: "Strategy & Brand",
    skill: "Campaign & Project Management",
    description:
      "Most marketing plans fail on delivery rather than strategy. This course covers the practical craft of converting a goal into scope, milestones, owners, dependencies and risks — then running the campaign to launch without the last-week scramble.\n\nYou will build the artefacts that make delivery visible: a brief, a plan with a critical path, a launch checklist and a retrospective.",
    lessons: [
      { title: "The brief is the plan's foundation", d: 6, c: "A campaign brief exists to make disagreement happen early, on paper, instead of late and expensively. A usable brief states the business objective, the audience, the single message, the channels, the constraints, the success metric and what is explicitly out of scope.\n\nThe out-of-scope line does more work than any other. Scope creep is rarely a decision; it is an accumulation of small unrefused requests. Naming exclusions up front gives you something to point at.\n\nGet the brief signed off by whoever can cancel the campaign. If that person has not read it, you do not have a brief.\n\nAction: write a one-page brief for your next campaign including three explicit exclusions." },
      { title: "Scope, milestones and the critical path", d: 25, c: "Decompose the campaign into deliverables, then sequence them. For each deliverable name an owner, a due date and what it depends on. The chain of dependencies with no slack is your critical path — the only part of the plan where a one-day slip costs you a day at launch.\n\nWork backwards from the launch date. Creative needs review time, review needs a reviewer who is not on leave, and anything involving legal, procurement or a third party takes longer than the optimistic estimate.\n\nDistinguish a milestone from a task: milestones are decision or handoff points where you can genuinely assess whether the plan is on track.\n\nAction: list your deliverables with owners and dependencies, then mark the critical path." },
      { title: "Risks, contingency and the pre-mortem", d: 6, c: "A risk register is a short list of what could go wrong, how likely it is, what it would cost, and what you will do about it. Keep it to the handful of risks that would genuinely change the outcome.\n\nThe pre-mortem is the fastest way to populate it: gather the team and ask them to imagine the campaign has failed, then explain why. People voice concerns in that frame that they will not raise in a status meeting.\n\nFor each significant risk decide in advance whether you will avoid, reduce, transfer or accept it — and who makes the call if it materialises mid-flight.\n\nAction: run a 30-minute pre-mortem and record the top five risks with an owner and a response for each." },
      { title: "Running the campaign to launch", d: 10, c: "In delivery, the job shifts from planning to unblocking. Keep a single source of truth for status, make progress visible without demanding status meetings, and escalate early — a problem raised three weeks out is a scheduling question, the same problem raised three days out is a crisis.\n\nUse a launch checklist rather than memory: tracking in place, links tagged, forms tested, routing confirmed, approvals recorded, rollback understood. Test the whole path as a customer would experience it, on a phone, before launch day.\n\nAgree what would make you delay a launch, before you are under pressure to ship.\n\nAction: build your launch checklist and dry-run the full customer path end to end." },
      { title: "Retrospectives that change behaviour", d: 10, c: "A retrospective is only worth running if something changes afterwards. Structure it around what you expected, what happened, what caused the gap and what you will do differently — then assign each change to an owner with a date.\n\nSeparate the outcome from the process. A campaign can hit its number with a chaotic process that will not survive being repeated, and a well-run campaign can miss its number because the strategy was wrong. Both need naming.\n\nKeep the record. A retrospective log across several campaigns reveals the pattern in your delivery that no single retrospective can.\n\nAction: run a retrospective on your last campaign and convert the findings into three dated actions." },
    ],
  },
  {
    title: "Marketing Finance & Budgeting",
    headline: "Speak the commercial language: budgets, CAC, lifetime value, payback and the business case.",
    level: "Intermediate",
    category: "Analytics & Data",
    skill: "Marketing Finance & Budgeting",
    description:
      "Career progression in marketing usually depends on explaining why an activity matters in commercial terms. This course covers the numbers marketers are expected to own — budget, acquisition cost, lifetime value, payback and margin — and how to assemble them into a business case that survives scrutiny.\n\nThe goal is not to become an accountant. It is to stop losing arguments you should win.",
    lessons: [
      { title: "The commercial vocabulary", d: 15, c: "A marketer needs working command of a small set of terms: revenue, gross margin, contribution, customer acquisition cost, lifetime value, conversion rate, pipeline and payback period. Precision matters because these words carry different meanings in different companies.\n\nCAC is total acquisition spend divided by customers acquired in the same period — and the argument is always about what counts as acquisition spend. Decide whether salaries, tooling and agency fees are in or out, write it down, and stay consistent.\n\nLifetime value is a forecast, not a fact. Any LTV figure is only as good as its retention assumption, so state the assumption whenever you quote the number.\n\nAction: write down your company's definitions for CAC and LTV and confirm them with someone in finance." },
      { title: "Building a marketing budget", d: 7, c: "A budget is a plan expressed in money. Build it bottom-up from activities — media, production, tooling, agencies, events, headcount — then sanity-check the total against revenue and against last year.\n\nSeparate committed costs from discretionary ones. Committed costs are contracts you cannot exit this quarter; discretionary spend is where you actually have optionality when the forecast changes. Leaders will ask what you would cut first, and a budget that cannot answer that question is not finished.\n\nHold a contingency line, and track commitment separately from actual spend. Most overspend is money already committed but not yet invoiced.\n\nAction: rebuild one quarter of your budget split into committed, discretionary and contingency." },
      { title: "Unit economics and payback", d: 7, c: "Unit economics ask whether one more customer is worth acquiring. The core comparison is contribution per customer against the cost to acquire them, and the timing of that recovery.\n\nPayback period is how long it takes contribution to repay acquisition cost. It matters more than an LTV-to-CAC ratio in a cash-constrained business: a healthy ratio with a three-year payback can still bankrupt you.\n\nSegment the analysis. Blended figures hide the truth — one channel or one customer segment is usually subsidising another, and that is the finding worth acting on.\n\nAction: calculate contribution, CAC and payback for your two largest acquisition channels separately." },
      { title: "The business case", d: 6, c: "A business case asks for resource and must therefore state what the organisation gets, what it costs, when it pays back, what could go wrong and what happens if you do nothing.\n\nShow your assumptions as a small explicit list rather than burying them in a spreadsheet. Reviewers trust a case with visible, arguable assumptions far more than one with a confident single number. Give a range, not a point estimate, and name the assumption the outcome is most sensitive to.\n\nInclude the do-nothing option honestly. Sometimes it is the right answer, and saying so builds the credibility you need for the cases that matter.\n\nAction: write a one-page business case with an assumption list, a range and a sensitivity note." },
      { title: "Reporting numbers to leadership", d: 10, c: "Executives read for decisions, not for activity. Lead with the number, the change, the cause and the recommendation — then keep the supporting detail available for anyone who asks.\n\nBe consistent about definitions across reports. A metric that shifts meaning between quarters destroys trust faster than a bad result honestly explained. When a number moves because you changed the definition, say so explicitly.\n\nReport misses early and with a plan. The credibility damage comes from the surprise, not the miss.\n\nAction: rewrite your last report so the first three lines carry the number, the cause and the recommendation." },
    ],
  },
  {
    title: "Privacy, Ethics & Governance",
    headline: "Use customer data lawfully and respectfully, and keep claims and disclosure defensible.",
    level: "Beginner",
    category: "Analytics & Data",
    skill: "Privacy, Ethics & Governance",
    description:
      "Marketers now handle regulated data, run automated decisions and publish sponsored content in a disclosure-conscious market. This course covers consent, data flows, retention, disclosure and claims review — the governance that keeps campaigns both legal and trusted.\n\nThis is practical marketing governance, not legal advice: the aim is to know what to control, what to document and when to escalate to counsel.",
    lessons: [
      { title: "The data you are actually holding", d: 20, c: "Governance starts with knowing what you hold. Build a data map: what personal data you collect, where it comes from, the lawful basis or consent behind it, which systems store it, who can access it, who you share it with and how long you keep it.\n\nMost marketing teams are surprised twice — by how many systems hold customer data, and by how much data they retain with no active purpose. Data you do not need is pure liability.\n\nPay attention to data crossing a boundary: to an agency, an ad platform, an enrichment vendor or another country. Those transfers are where obligations concentrate.\n\nAction: map the personal data in your two main marketing systems, including its source and retention period." },
      { title: "Consent, preferences and unsubscribes", d: 7, c: "Consent must be freely given, specific, informed and revocable — which in practice means unbundled checkboxes that are not pre-ticked, a record of what was agreed and when, and a withdrawal path at least as easy as the opt-in.\n\nPreference management is the mature version: let people choose topic and frequency instead of forcing a binary between everything and nothing. It reduces unsubscribes and improves engagement, so the compliant design is also the effective one.\n\nHonour suppression lists globally, not per campaign, and test that an unsubscribe actually propagates to every system that can send.\n\nAction: run the full unsubscribe journey on yourself and time how long it takes to take effect everywhere." },
      { title: "Disclosure and honest claims", d: 6, c: "Sponsored content, affiliate links, incentivised reviews and influencer partnerships must be disclosed clearly and prominently — in the content itself, not only in a bio or behind a 'more' link. Platform tags help but do not substitute for a plain statement.\n\nClaims need substantiation before publication. 'Fastest', 'number one', 'clinically proven' and any comparison against a competitor require evidence you can produce on request. Keep the substantiation with the asset so it survives the person who made it.\n\nBuild a lightweight claims review step into your approval flow rather than handling it case by case under deadline.\n\nAction: audit your last five published assets for disclosure and for any claim you cannot substantiate." },
      { title: "Automated decisions and AI governance", d: 25, c: "Scoring, segmentation, personalisation and generative tools all make or shape decisions about people, which brings obligations and reputational risk. Know what your models and prompts are doing and why.\n\nThree controls carry most of the weight: do not feed confidential or personal customer data into tools that are not approved for it; keep a human accountable for anything published or acted upon; and check outputs for bias and for fabricated claims before they ship.\n\nDocument which tools are approved for which data classes. Ambiguity here is how sensitive data ends up in a public model.\n\nAction: write a one-page acceptable-use note covering which AI tools may touch which categories of data." },
      { title: "The governance operating rhythm", d: 18, c: "Governance fails when it lives in a document nobody opens. Make it a rhythm: a recurring review of your data map and retention, a defined path for data subject requests, an owner for the suppression list, and a named escalation route to legal.\n\nKeep a risk register for privacy and claims alongside your campaign risks, and rehearse the incident path before you need it — who is told, in what order, within what timeframe.\n\nThe portfolio evidence for this discipline is a consent and data-flow map, a claims review checklist and an ethical risk register.\n\nAction: schedule a recurring quarterly review and name the owner for each governance artefact." },
    ],
  },
  {
    title: "Events & Field Marketing",
    headline: "Run events, sponsorships and field programmes from brief and budget through to pipeline.",
    level: "Beginner",
    category: "Creative & Web",
    skill: "Events & Field Marketing",
    description:
      "Events and field marketing create the in-person and partner-led experiences that generate relationships, pipeline and community. The work rewards preparation, contingency planning and calm execution under changing conditions.\n\nThis course covers event strategy, budget and logistics, promotion and registration, lead capture and follow-up, and the post-event analysis that proves value beyond attendance.",
    lessons: [
      { title: "Strategy before venue", d: 39, c: "The first decision is not the venue, it is the objective. Awareness, relationship depth, qualified pipeline, product feedback, community and customer retention each imply a different format, guest list and size.\n\nA 40-person dinner with the right accounts frequently outperforms a 400-person conference, and costs less. Field marketing exists because proximity to a specific set of accounts is worth more than reach.\n\nWrite the event brief: objective, audience, format, date, budget envelope, success metric and the single thing attendees should leave believing.\n\nAction: write an event brief and name the specific accounts or segments you need in the room." },
      { title: "Budget, vendors and logistics", d: 14, c: "Build the budget bottom-up: venue, catering, production, travel, staffing, collateral, technology and contingency. Hold back roughly ten per cent — something always changes.\n\nNegotiate on the terms that carry risk, not just the price: cancellation windows, minimum spend, attrition clauses and what happens if numbers fall short. Read the cancellation terms before you sign anything.\n\nBuild a run of show — a minute-by-minute schedule naming who does what — and share it with every vendor and staff member. Most event failures are handoff failures.\n\nAction: draft a run of show for your next event and identify the three moments most likely to slip." },
      { title: "Promotion and registration", d: 13, c: "Registration is a conversion funnel: invitation, landing page, form, confirmation, reminders and a calendar hold. Each step leaks, and the reminder sequence usually determines attendance more than the invitation does.\n\nPlan for the no-show rate rather than being surprised by it. Free virtual events routinely lose half their registrations; paid and in-person events hold far better. Model the number you need to register in order to get the room you want.\n\nKeep the form short and route the data cleanly into your CRM with the campaign taxonomy already applied, so follow-up is not a manual export.\n\nAction: map your registration funnel and add a reminder sequence at one week, one day and one hour." },
      { title: "Lead capture and follow-up", d: 14, c: "The value of an event is realised in the week afterwards. Decide before the event how conversations become records: who captures them, in what tool, with what qualifying detail, and who follows up within what timeframe.\n\nCapture the substance, not just the badge scan. A note about what the person actually cared about is worth more than a job title, and it is what makes follow-up feel like a continuation rather than a cold pitch.\n\nSegment follow-up by conversation quality. Sending everyone the same generic thank-you wastes the one moment when attention is highest.\n\nAction: write your lead-capture and follow-up plan with owners and a 48-hour first-touch commitment." },
      { title: "Measuring beyond attendance", d: 11, c: "Attendance is an input, not a result. Measure target-account attendance, qualified conversations, pipeline created and influenced, cost per qualified conversation, satisfaction and — for customer events — retention and expansion.\n\nAccept the attribution limits honestly. Events often influence deals they do not originate, so report both created and influenced pipeline and be explicit about which is which rather than quietly claiming the larger number.\n\nWrite the post-event report while the detail is fresh: what happened, what it cost, what it produced, and what you would change.\n\nAction: define your event scorecard before the event, and complete the post-event report within a week." },
    ],
  },
  {
    title: "Shopper & Channel Marketing",
    headline: "Win inside retail and distributor ecosystems, from category analysis to post-promotion review.",
    level: "Intermediate",
    category: "Strategy & Brand",
    skill: "Shopper & Channel Marketing",
    description:
      "Trade, shopper and channel marketing influence demand where the purchase actually happens — in retail, distributor and partner ecosystems. The discipline connects marketing to sales through commercial negotiation and in-store execution.\n\nThis course covers the three-audience model, category and channel economics, promotion design and evaluation, merchandising and the retailer conversation.",
    lessons: [
      { title: "Three audiences, not one", d: 12, c: "Channel marketing has to satisfy three distinct audiences at once: the consumer who eventually uses the product, the shopper making the purchase decision in the aisle or on the page, and the retailer or distributor deciding whether to stock and support it.\n\nThese are different people with different motivations, and consumer demand does not automatically produce retailer acceptance or actual sell-through. A campaign that delights consumers can still fail if the retailer will not give it space.\n\nLearn the distinction between sell-in (persuading the channel to stock) and sell-out or sell-through (the product actually leaving shelves). Confusing them is the classic error.\n\nAction: for one product, write what the consumer, the shopper and the retailer each need to believe." },
      { title: "Category and channel economics", d: 11, c: "Retailers think in categories, not brands. A category review looks at total category growth, share, penetration, frequency, basket size and where the incremental growth is coming from — then argues how your brand helps the category, not just itself.\n\nLearn the commercial arithmetic: trade margin, list versus net price, promotional allowances, distribution costs and the difference between gross and net revenue. Retail negotiation happens in this language.\n\nDifferent channels have genuinely different economics. The same product can be profitable in one channel and loss-making in another once you account for terms and cost to serve.\n\nAction: build a simple margin model for one product across two channels and compare net contribution." },
      { title: "Designing promotions that pay", d: 6, c: "A promotion is an investment with a return, not a discount reflex. Design it against a specific mechanism: trial for a new product, basket building, frequency, switching from a competitor, or clearing stock.\n\nThe question that decides value is incrementality — how much of the volume would have happened anyway. Deep, frequent discounting on an established line often subsidises existing buyers and trains the market to wait for a deal.\n\nModel the promotion before running it: expected uplift, funding split, margin impact at the promoted price, and the break-even volume you need.\n\nAction: build a business case for one promotion including its break-even volume and its incrementality assumption." },
      { title: "Merchandising and in-store execution", d: 9, c: "Execution is where channel plans succeed or quietly fail. Distribution, shelf position, facings, secondary displays, price accuracy and the presence of point-of-sale material all determine whether the plan you sold in actually exists in the store.\n\nCompliance is rarely complete. Field audits — photographs, checklists, spot visits — exist because agreed activity and executed activity diverge, and the gap is invisible from head office.\n\nThe same logic now applies to digital shelves: search placement, content completeness, imagery, reviews and out-of-stock rates are the online equivalent of shelf position.\n\nAction: audit five stores or product pages against what was agreed and quantify the compliance gap." },
      { title: "The retailer conversation and the review", d: 10, c: "A retailer presentation is a commercial argument. Lead with the category opportunity, evidence it with shopper insight, then show how your plan grows the category and what support you are bringing. Retailers fund growth for themselves, not favours for suppliers.\n\nPrepare for the questions you will actually be asked: what this does to category margin, what it displaces, why now, and what happens if it underperforms.\n\nAfterwards, run the post-promotion analysis: actual versus forecast volume, incrementality, margin delivered, compliance and what you would change. Bring that analysis to the next negotiation — a supplier who evaluates honestly is easier to trust.\n\nAction: build a retailer presentation and a post-promotion analysis template you can reuse each cycle." },
    ],
  },
  {
    title: "AI Marketing 101",
    headline: "Apply generative AI across strategy, creative and measurement in a structured workflow.",
    level: "Beginner",
    category: "AI Marketing",
    skill: "AI Marketing",
    description:
      "The AI Marketing course covers where generative AI fits in modern marketing, how to build a personal AI toolkit and how to run an AI-assisted campaign end-to-end — from strategy to creative to reporting.\n\nYou'll learn the workflow that separates effective AI marketers from casual users: define, generate, evaluate, refine.",
    lessons: [
      { title: "Why AI is now a core marketing skill", d: 11, c: "Watch the masterclass in the video panel above for a practitioner tour of AI marketing in action.\n\nThe market signal is unambiguous: AI is the single skill marketers expect to need most over the next five years, and job postings mentioning AI doubled in the past year. This is not a hype story — it's a hiring signal.\n\nIn this lesson we set the mental model you'll use the whole course: AI is not a replacement for judgment, it is a force multiplier on execution. Strategy, taste and quality control stay human. Generation, drafting, research and reporting get delegated to machines.\n\nAction: write down three marketing tasks you currently do by hand that an AI could draft the first version of by tomorrow." },
      { title: "Building your AI toolkit", d: 26, c: "A practical AI stack for marketers doesn't need a budget. Start with: a frontier chatbot (ChatGPT, Claude or Gemini) for copy, research and strategy; a design tool with generative features (Canva AI) for creative assets; and your CRM or automation platform's built-in AI for email and workflows.\n\nThe trick is not collecting tools — it's standardizing where each place in your workflow uses AI. Make a simple map:\n\n- Research → AI summarization + live web search\n- Strategy → AI structured prompts\n- Copy → AI drafts with your tone system\n- Creative → AI image/video generation\n- Reporting → AI summarized dashboards\n\nAction: build your toolkit map in a doc and stick to it for two weeks." },
      { title: "A repeatable AI workflow", d: 15, c: "Effective AI marketing follows a four-step loop that keeps output on-brand and on-strategy:\n\n1. DEFINE — write a tight brief: audience, goal, channel, constraints and success metric.\n2. GENERATE — ask the AI for multiple variations, not one answer.\n3. EVALUATE — score outputs against your brand voice and quality bar.\n4. REFINE — use a second prompt round, or human edits, until it clears the bar.\n\nThe failing pattern is asking AI for 'a good ad' with no brief and shipping the first draft. The winning pattern treats AI like a fast junior team member who needs context and feedback.\n\nAction: redo one campaign asset from last month using the full four-step loop." },
      { title: "AI for segmentation and insight", d: 12, c: "The highest-leverage AI use in marketing is understanding your audience. Use AI to cluster customer feedback, summarize interview transcripts, identify repeated phrases and surface pain points you were blind to.\n\nA classic exercise: paste reviews and support tickets into an AI, ask for a thematic breakdown, and compare it to your persona assumptions. The gap between assumptions and reality is where positioning opportunity hides.\n\nTreat AI output as a hypothesis generator, then validate with your own reading of the data before acting on it." },
      { title: "The right mix: AI + human workflow", d: 20, c: "Research consistently shows the best results come from humans owning judgment and AI absorbing execution. In practice: AI writes the first draft of every deliverable, humans own the final 20% of quality.\n\nBuild a quality bar (a short checklist like tone, clarity, specificity, proof points) and apply it to every AI output before it ships. This is the 'coach the AI' mindset hiring managers now look for.\n\nSet your personal operating principle: automate the predictable, scrutinize the important, and always know what your AI is doing and why." },
    ],
  },
  {
    title: "Prompt Engineering for Marketers",
    headline: "Write structured prompts that turn any AI into a reliable marketing collaborator.",
    level: "Beginner",
    category: "AI Marketing",
    skill: "Prompt Engineering",
    description:
      "Most marketers use AI at 20% of its potential because their prompts are vague. This course teaches a repeatable prompt framework — role, context, goal, constraints, format — and applies it to market research, copywriting, strategy and content systems.",
    lessons: [
      { title: "Why prompts fail", d: 20, c: "The most common prompt is 'write an ad about our product.' It fails because it gives the AI no role, audience, channel, tone or constraints — so you get generic sludge and blame the tool.\n\nPrompts are project briefs, not requests. The quality of the brief is the ceiling of the output. This lesson reframes prompting as delegating to a capable but literal-minded contractor.\n\nWatch for the three failure modes: missing context, missing format, and missing success criteria. All three are fixable with the framework in the next lesson." },
      { title: "The R-O-C-F-F framework", d: 11, c: "Use five components in every serious prompt:\n\n- ROLE: 'You are a senior performance marketer'\n- OBJECTIVE: 'Goal: maximize CTR on a Meta ad'\n- CONTEXT: the audience, product, past performance, constraints\n- FORMAT: 'Return 5 options, each with a hook + body + CTA'\n- FRAME: 'Score each against this brand voice rubric'\n\nWrite it as a paragraph or playbook — structure matters more than length. A 2-line prompt with these components beats a 200-word ramble.\n\nAction: rebuild one of yesterday's prompts using all five components." },
      { title: "Personas and tone systems", d: 17, c: "Consistent brand voice is the top complaint about AI output. Fix it by building a personal tone system, a short document that captures your brand's voice, do's, don'ts, and two sample rewrites.\n\nAttach it to every generation prompt, or feed it once and have each follow-up reference it. This is the same 'training the model' pattern editorial teams use.\n\nAction: draft a one-page tone system for your brand and use it for the next three prompts." },
      { title: "Evaluation and refinement loops", d: 6, c: "Single-shot prompting gets you 80%. The other 20% comes from a second loop: ask the AI to critique its own output, then regenerate with stricter constraints.\n\nEffective follow-up prompts:\n- 'Identify the three weakest parts and why'\n- 'Rewrite for a skeptical reader'\n- 'Cut 30% without losing the hook'\n- 'Make the proof point more specific'\n\nScript this loop and it stops being vague back-and-forth and starts being a reliable quality system." },
      { title: "Prompt systems, not prompt tips", d: 24, c: "The people getting outsized results don't collect clever prompts — they build repeatable prompt systems embedded in their work. A content brief playing field, a weekly trends digest prompt, a campaign scorecard.\n\nThe deliverable of this course is not clever phrases; it's a documented, reusable set of prompts wired into your regular marketing cadence, each with the ROCFF structure, a quality bar and an evaluation step.\n\nAction: pick one recurring task (weekly reporting, monthly content calendar) and build a prompt system for it." },
    ],
  },
  {
    title: "Marketing Analytics with GA4",
    headline: "Read GA4 with confidence and turn behavioral data into decisions.",
    level: "Beginner",
    category: "Analytics",
    skill: "Marketing Analytics (GA4)",
    description:
      "Analytics is the most universally required marketing skill — but most marketers 'look at dashboards' without extracting decisions. This course teaches GA4 fundamentals, event-based measurement, exploration reports and the reporting discipline that turns data into action.",
    lessons: [
      { title: "How GA4 thinks (events, not pageviews)", d: 23, c: "Watch the GA4 beginner tutorial in the video panel (start at the beginning) and follow along creating a property.\n\nGA4 is event-based: everything a user does on your site is an event with parameters, not a 'pageview.' This changes how you ask questions. Instead of 'how many visitors,' you ask 'what did people do.'\n\nThe core events to know: page_view, session_start, scroll, click, and conversions you define (purchase, lead, signup).\n\nAction: create a GA4 property for a test site and trigger your first custom event." },
      { title: "The reports you actually need", d: 16, c: "Ignore 80% of the menu. The three views that matter:\n\n1. Acquisition — where users come from and which channels convert.\n2. Engagement — pages users actually engage with (not bounce-counting).\n3. Monetization / Conversions — the events that equal business value.\n\nReport discipline: define your north-star metric first, then choose reports that speak to it. A dashboard without a metric is decoration.\n\nAction: define your north-star metric and pick the 3 reports that track it." },
      { title: "Custom events and conversions", d: 14, c: "Out-of-the-box events cover the basics, but product truth lives in custom events you define: 'download_whitepaper', 'viewed_pricing', 'started_checkout'.\n\nUse Google Tag Manager to fire event tags on the interactions that matter, send event parameters (link text, value, category), and mark the events that represent a completed goal as conversions.\n\nKeep event names lowercase and consistent — naming discipline is what makes analysis possible later.\n\nAction: instrument your three most important conversion events." },
      { title: "Explorations that answer questions", d: 15, c: "Explorations are where you do real analysis: segment users who converted vs didn't, compare device/campaign performance, and build funnels to find where users drop.\n\nThe discipline: start with a question ('why do mobile users underperform?'), pick an exploration type (funnel, segment overlap, cohort), and end with a decision.\n\nCohorts in particular reveal what standard reports hide — whether retention is improving. Use them in your recurring analysis.\n\nAction: build one funnel exploration and one cohort report this week." },
      { title: "From data to decisions", d: 23, c: "The final skill is communication. A good analytics report answers a question, shows the evidence, and proposes an action. Use the format: Q-E-A (Question, Evidence, Action).\n\nExample: Q 'Should we cut display?' E 'Display is 30% of sessions but 4% of conversions.' A 'Reallocate 20% of spend to search this quarter; re-measure after 4 weeks.'\n\nThe mark of a senior marketer is not reading numbers — it's the willingness to name a decision the numbers are pointing at.\n\nAction: take one recurring report and rewrite it in Q-E-A format." },
    ],
  },
  {
    title: "SEO Fundamentals",
    headline: "Earn compounding organic traffic with search-first content and solid technical foundations.",
    level: "Beginner",
    category: "SEO",
    skill: "SEO",
    description:
      "Organic search is compounding growth — but modern SEO is about intent, topical authority and content quality, not keyword stuffing. This course covers the on-page, technical and content systems that make sites rank and stay ranked (plus where AI search changes the game).",
    lessons: [
      { title: "How modern search works", d: 51, c: "Watch the Google Search Central office-hours session in the video panel to hear how Google's teams think about ranking signals.\n\nThe modern reality: search engines understand intent and measure experience. E-A-T (experience, expertise, authoritativeness, trust) and content relevance outperform tricks from a decade ago.\n\nYour job as an SEO marketer is to outperform the result that already exists — cover the topic more completely, more usefully and more credibly.\n\nAction: pick your buyers' single biggest question and audit the current top-3 results for gaps." },
      { title: "Keyword research that respects intent", d: 11, c: "You're not chasing search volume — you're matching intent. Map keywords to funnel stages: informational (learn), commercial (compare), transactional (buy).\n\nBuild your list from three sources: your own customer language (support tickets, sales calls), search console data, and a keyword tool (Keyword Planner, Ahrefs or Ubersuggest).\n\nCluster keywords into topics rather than scattering one page per keyword. Topical clusters build the authority Google rewards.\n\nAction: build one topic cluster with 5 supporting pages and their target intents." },
      { title: "On-page optimization that works", d: 15, c: "On-page is less about 'X% keyword density' and more about clear structure: one clear title tag per page, descriptive headings that match the search query, internal links to related pages, and a meta description that earns the click.\n\nThe page that answers the question fastest wins. Lead with the answer paragraph, use plain language, and let headings do the outlining work.\n\nApply also to images (alt text) and URL structure (short, readable, keyword-relevant slugs).\n\nAction: optimize your top 5 pages with the checklist above." },
      { title: "Technical SEO essentials", d: 41, c: "If Google can't crawl it, it can't rank it. The non-negotiables: fast page loads, mobile-friendly rendering, clean internal linking, an XML sitemap and a Google Search Console property watching for indexing issues.\n\nWalk a weekly loop: check Console for crawl and index coverage spikes, fix broken internal links, and confirm pages you care about are 'valid/with index'.\n\nMost technical wins are boring maintenance — and that's the point. Boring, consistent maintenance compounds.\n\nAction: connect Search Console and fix the top 3 indexation issues it surfaces." },
      { title: "SEO in the AI search era", d: 18, c: "AI overviews and large-language search are changing the click landscape. People still search, but more zero-click answers mean you must be present inside AI answers, not just top of the page.\n\nPractical levers: make your content structured and quotable (cite-able stats, clear definitions), earn mentions across trustworthy sites, and optimize for the conversational phrasings people ask AI assistants.\n\nThis crossover from SEO to GEO/AEO is exactly why 'Generative Engine Optimization' is a fast-rising skill. SEO isn't dying — it's evolving into answer-surface strategy.\n\nAction: answer the single biggest question in your niche with a clear, quotable definition page." },
    ],
  },
  {
    title: "Google Ads & PPC Search",
    headline: "Structured, profitable search campaigns: accounts, bidding and ad copy that performs.",
    level: "Intermediate",
    category: "Paid Media",
    skill: "Google Ads / PPC",
    description:
      "Google Ads remains the most commercially scalable acquisition channel when set up with structure, not hope. This course walks the anatomy of a working account: campaign structure, keyword and match types, auction dynamics, smart bidding, and the ad creative loop.",
    lessons: [
      { title: "Account and campaign architecture", d: 15, c: "Watch the Google Ads tutorial in the video panel to see a real campaign setup end-to-end.\n\nStructure follows strategy: separate campaigns by goal (brand, non-brand search, shopping, remarketing) and separate ad groups by intent clusters. One tight ad group = relevant ads = higher Quality Score = lower costs.\n\nApply the discipline: every ad group should match a single search theme with tightly related keywords and ads.\n\nAction: sketch your account structure before touching the UI — campaigns, ad groups, budget split." },
      { title: "Keywords and match types", d: 12, c: "Keywords are the intent you're buying. Use phrase and exact match for control, keep negative keywords aggressive, and review the search terms report weekly to prune spend.\n\nModern best practice: fewer, higher-intent keywords with good ads beat 10,000 broad keywords. Broad match makes sense only with strong conversion signals and smart bidding watching your goal.\n\nAction: mine the search terms report and add at least 10 new negatives this week." },
      { title: "Bidding and the auction", d: 20, c: "Understand the three things that decide your ad's position: max bid, Quality Score (expected CTR, ad relevance, landing page experience), and ad rank thresholds.\n\nBidding strategy: start with manual/maximize clicks to collect data, then move to Maximize Conversions once conversion volumes support the smart-bidding engine. Feed it conversion value for ROAS-focused bidding.\n\nAction: calculate how many conversions per week you need to switch to smart bidding confidently." },
      { title: "Ad creative and testing", d: 25, c: "Responsive Search Ads let Google assemble combinations of 15 headlines and 4 descriptions. Feed it variety: benefit-led, feature-led, urgency, social-proof and question hooks.\n\nTest deliberately — one variable at a time — and let assets run 2-3 weeks before judging. Add sitelinks, callouts, structured snippets and a display path that mirrors the user's search.\n\nCull what underperforms; the account that reviews assets every 30 days compounds.\n\nAction: write 15 headlines for your main product with 5 distinct angles." },
      { title: "Reporting and optimization rhythm", d: 14, c: "The PPC performance gap is almost always in the review cadence, not the setup. Run a weekly loop: spend vs plan, CPA/target progress, search terms, losing keywords, asset culling.\n\nOptimize for the decision, not the number: if CPA is below target, expand reach; if volume collapses, check auctions and competition (auction insights).\n\nSet a simple weekly reporting template now and never let a week pass without 30 focused minutes in the account.\n\nAction: build your weekly PPC review template." },
    ],
  },
  {
    title: "Social Media Marketing Foundations",
    headline: "Turn social channels into a real growth engine with strategy, calendars and measurement.",
    level: "Beginner",
    category: "Social Media",
    skill: "Social Media Management",
    description:
      "Posting without strategy is broadcasting. This course builds the operating system behind successful social channels: platform roles, content pillars and calendars, engagement loops, and the metrics that actually prove social's contribution.",
    lessons: [
      { title: "Strategy before posting", d: 14, c: "Watch the Simplilearn social media full course in the video panel for a broad tour of channels and strategy.\n\nStart with the job each platform does for you: LinkedIn for B2B authority, Instagram/TikTok for cultural reach, YouTube for searchable depth. One brand, many jobs — but you can't do all of them well at once.\n\nDefine your primary channel first, then one supporting channel. Clarity beats breadth.\n\nAction: write a one-line job description for TWO channels max, then delete the rest from this quarter's plan." },
      { title: "Content pillars and the calendar", d: 14, c: "Content pillars are the buckets your posts fall into — typically audience value, product/brand, and proof/social. A balanced pillar mix keeps you useful rather than promotional.\n\nA calendar is not a spreadsheet of slots; it's a plan that maps planned topics to the buyer journey and repurposes every idea across 2-3 formats.\n\nBatch-create in pillar batches so your voice stays consistent. Consistency compounds, frenetic posts don't.\n\nAction: define 3 pillars and draft 2 weeks of dated content against them." },
      { title: "Hooks, formats and the feed", d: 17, c: "The algorithm is a retention game — the first 1.5 seconds decide everything. Write hooks that name the outcome or the problem, use captions and subtitles (most watch muted), and package ideas in familiar, snackable formats.\n\nSteal better: screenshots of test results, 'setting bed while competitors sleep' micro-docs, voice-over charts with a beat, before/after proof. Formats that travel beat formats that feel safe.\n\nAction: rewrite your last 5 posts' opening lines as outcome-first hooks." },
      { title: "Engagement loops and community", d: 15, c: "Social is a two-way system. Engagement loops — replying quickly, DMs that start conversations, UGC reposts, polls and live sessions — feed both the algorithm and your relationship capital.\n\nSet a 'reply within X minutes' service standard and a weekly ask-your-audience rhythm. Communities out-perform audiences when it comes to retention and word of mouth.\n\nAction: schedule a weekly engagement block (30 min) in your calendar as non-negotiable." },
      { title: "Metrics that matter", d: 14, c: "Vanity metrics (followers, likes) don't survive a conversation with your CFO. Build social reporting around the funnel: reach → engagement → profile/website clicks → leads → customers.\n\nAttribution is hard, so triangulate: UTM traffic, promo codes, and link-in-bio tools with conversion tracking.\n\nA simple weekly report with reach, engagement rate, clicks and the one decision you're taking beats a monthly dashboard nobody reads.\n\nAction: define your social-to-revenue path and the 4 metrics that measure it." },
    ],
  },
  {
    title: "Email Marketing & Lifecycle",
    headline: "Build lists, segment smartly and turn email into your highest-ROI channel.",
    level: "Intermediate",
    category: "Email",
    skill: "Email Marketing",
    description:
      "Email consistently returns the highest ROI per dollar of any marketing channel — but only when deliverability, segmentation and lifecycle thinking are in place. This course builds an owned-audience engine from list growth to win-back automation.",
    lessons: [
      { title: "Why owned audiences win", d: 15, c: "Watch the email marketing course in the video panel for a practical tour of list building and tools.\n\nEvery passive channel can change the rules overnight; your email list is a channel you own. That's why sophisticated marketers trade reach for subscribers.\n\nOwned-audience strategy: each campaign's job includes adding value AND converting casual visitors into subscribers. The list is an asset that compounds.\n\nAction: audit your site and list one lead magnet + 3 places a subscribe prompt already exists." },
      { title: "List building that respects trust", d: 19, c: "Permission marketing: people join because they get something valuable. A focused lead magnet (checklist, template, mini-course), a clean opt-in, and a welcome email that over-delivers set the tone.\n\nQuality over quantity: purchased lists destroy deliverability and trust. The metric that matters is engaged active subscribers, not total.\n\nAction: design one lead magnet with a two-step promise — what you'll get, in what time, with what outcome." },
      { title: "Segmentation and personalization", d: 16, c: "Open rates tell you downstream performance. Segment on behavior and interest — not just demographics — so your sends feel written for one person: new signups, engaged, dormant, buyers, at-risk.\n\nPersonalization beyond first name: content and offer based on where they are in the journey. Dynamic blocks let one campaign serve each segment its relevant message.\n\nAction: define 5 segments and the trigger that should move a user into each." },
      { title: "Lifecycle automations", d: 15, c: "Your best campaigns run while you sleep: welcome series (the highest-open emails you'll ever send), onboarding, post-purchase, win-back for dormant subscribers, and cart recovery where relevant.\n\nBuild the map first — each trigger, its timing, its goal — then wire automations to match. Automations convert and compound; one-off blasts burn attention.\n\nAction: draft a 4-email welcome series with one job each." },
      { title: "Deliverability and getting read", d: 15, c: "Everyone's email skills don't matter if the inbox blocks you. Keep a hygiene loop: prune unengaged subscribers, keep complaint rates low with honest subject lines, authenticate (SPF/DKIM/DMARC), and watch bounces.\n\nSubject line craft: be specific and human; avoid spam-trigger words and excessive punctuation. Aim for the inbox, not the promotion tab.\n\nAction: run a dormant-segment win-back campaign to clean your list before your next big send." },
    ],
  },
  {
    title: "Copywriting That Converts",
    headline: "Learn the words that sell: from message mining to headlines, hooks and AIDA frameworks.",
    level: "Beginner",
    category: "Content",
    skill: "Copywriting",
    description:
      "Copywriting is the transferable core of nearly every marketing deliverable — ads, emails, landing pages, social posts. This course teaches the research-first method (find the exact words your customers use), the structures that keep people reading, and the frameworks that close.",
    lessons: [
      { title: "Mine the words your customers use", d: 20, c: "Watch Brian Dean's copywriting tutorial in the video panel — tip one is the most important habit in copywriting.\n\nGreat copy uses the customer's language, not yours. Mine Reddit, Quora, reviews and support tickets for the exact phrases people use to describe their problem.\n\nSave specific complaints and quotes. The 'you language' in those messages beats any adjective you can invent.\n\nAction: collect 20 customer-language phrases this week and file them where you write." },
      { title: "Headlines and super-specificity", d: 21, c: "Vague headlines lose like vague ads. Specifics create belief: numbers, timeframes, exact outcomes ('close 3 leads a day', 'a landing page in 2 hours').\n\nThe open loop — a headline that promises a payoff the reader must scroll to collect — carries people into your page. Combine an outcome with a curiosity gap.\n\nTest your headline against a brutal standard: would this make MY target customer stop?\n\nAction: rewrite your top landing page headline with a number and a timeframe." },
      { title: "Hooks, leads and the slippery slide", d: 10, c: "The paragraph after the headline decides whether anyone reads the rest. Keep leads to 6-8 sentences, open with a hook (a question, a stark result, a mini-story), and preview the payoff.\n\nThe slippery slide: structure the page so each line makes the next irresistible — story fragments, teased sections, questions answered two paragraphs down.\n\nReaders scroll until they stall. Design the page so they never stall.\n\nAction: add one open loop to your homepage and watch the scroll-depth change." },
      { title: "AIDA and benefit-first structure", d: 16, c: "AIDA — Attention, Interest, Desire, Action — is the skeleton of conversion copy. Attention with the headline, interest by proving relevance, desire with benefits and proof, action with a clear low-friction CTA.\n\nAlways write benefits, not features: '4GB RAM' is a feature; 'edits without lag' is a benefit. Show the after-state.\n\nMap an existing page (or this course's landing page) onto AIDA and see where people could stall.\n\nAction: convert your product features into benefits on your main offer." },
      { title: "Proof, FOMO and the testimonial formula", d: 11, c: "The social proof paradox: you need sales to show sales. Solve it with specific results, verifiable stats and a structured testimonial formula: who you were → what you tried → the obstacle → the result with the numbers.\n\nFOMO works when the scarcity is real (time-limited enrollment, limited slots). And honesty is a conversion tool: addressing the objection ('expensive, worth it for…') raises trust.\n\nAction: rewrite your top testimonial using the before/obstacle/after formula." },
    ],
  },
  {
    title: "Content Marketing Strategy",
    headline: "Build a content engine that attracts, converts and compounds.",
    level: "Intermediate",
    category: "Content",
    skill: "Content Marketing",
    description:
      "Content marketing is the long game: compound assets that attract search and social traffic while building authority. This course covers the strategy layer — topic selection, pillar-and-cluster structure, distribution and repurposing — that most 'content teams' skip.",
    lessons: [
      { title: "Content strategy, not content tasks", d: 19, c: "Watch the Simplilearn content marketing course in the video panel for the full landscape.\n\nMost teams produce content randomly and hope. Strategy means: define the audience outcome, choose topics that move the funnel, and commit to a cadence you can sustain.\n\nThe strategic question is not 'what should we publish' but 'what would we own if it ranked for a year.'\n\nAction: write down the ONE content outcome that matters most this quarter." },
      { title: "Choosing topics with intent", d: 11, c: "Every piece maps to a job: attract (informational), convert (commercial), retain (loyalty). Build a topic matrix against your funnel so content isn't just awareness soup.\n\nUse the cluster 'thin page → pillar' upgrade: recruit strong guides that earn links and rank, then support with cluster pages.\n\nBattle for one topic at a time: the page that legitimately answers the query better wins.\n\nAction: build a topic matrix with 3 attract + 3 convert ideas mapped to your funnel." },
      { title: "Production systems that scale", d: 10, c: "Consistency beats bursts. Set a sustainable publication rhythm (one strong pillar per month, two supporting posts per week).\n\nPre-production: a brief with the target query, angle, outline and CTA before any writing. This is where AI helps — briefs and first drafts via your prompt system, human judgment on edits.\n\nCreate once, then repurpose into 8+ assets: video script, social cutdowns, carousel, email, summary thread.\n\nAction: write a reusable one-page content brief template." },
      { title: "Distribution is 80% of the job", d: 11, c: "Publish-and-pray is not content marketing. The flagship piece plus its distribution echo — email to your list, social repurposes, digest roundups, seeding in communities — is what delivers the traffic.\n\nPlan distribution at creation time, not as an afterthought. Every piece names its primary channel and two secondary surfaces before publication.\n\nCross-post smart, not lazy: resize, re-cut, rewrite headlines for each surface.\n\nAction: for your next pillar post, plan the full distribution echo in the brief." },
      { title: "Measuring content ROI", d: 24, c: "Content ROI is compound and ugly early. Track the funnel, not just traffic: sessions to top topics, signups, and assisted conversions over 90 days.\n\nUse a simple model: content that captures search traffic (organic sessions by topic), content that converts (goal completions by topic), and the 'assist' value of top-funnel content.\n\nReport trends quarterly — content marketing is judged on a longer clock than paid.\n\nAction: set up topic-level tracking in GA4 with a 90-day lookback." },
    ],
  },
  {
    title: "Influencer Marketing Campaigns",
    headline: "Find the right creators, brief for authenticity and amplify for real ROI.",
    level: "Intermediate",
    category: "Social Media",
    skill: "Influencer Marketing",
    description:
      "Influencer marketing is the fastest-growing marketing job in the market — and the most mis-executed. This course replaces 'find an influencer and hope' with a real operating system: strategy, creator evaluation, briefs, and paid amplification.",
    lessons: [
      { title: "The strategy before the creator", d: 17, c: "Watch Jess Flack Wilson's 4-step influencer campaign masterclass in the video panel.\n\nThe single biggest mistake: choosing creators before choosing the GOAL. Awareness campaigns optimize reach; performance campaigns optimize CPA/ROAS — and structure everything differently.\n\nSet the goal first. It decides channel selection, creator tiers, budget mix and whether paid amplification is the centerpiece or an afterthought.\n\nAction: decide if your next campaign is awareness or performance, and write the metric it wins or loses on." },
      { title: "The 3-R framework for creators", d: 7, c: "Evaluate creators on RESONANCE, RELEVANCE and REACH, in that order.\n\nResonance: do they hold trust with the audience you need? Relevance: does their content live in the niche you sell into? Reach: is the audience real and engaged (not dead followers)?\n\nAudit engagement rates and last-9-posts performance rather than follower counts. A 10K creator with 8% engagement usually out-converts a 500K creator with 1%.\n\nAction: shortlist 5 candidates and score them on the 3-R framework." },
      { title: "Tier mix and pricing reality", d: 10, c: "A balanced program hedges bets: macro/celeb for reach, mid-tier for credibility, nano/micro + UGC for width at low cost — each tier serves a different funnel level.\n\nPricing reality: rates vary wildly by tier, platform and niche. Structure deals on deliverables and usage rights, not just posts. Secure contractual amplification rights on the content.\n\nAction: sketch your tier mix with a rough budget split before outreach." },
      { title: "Briefing creators (educate, don't script)", d: 28, c: "Scripted content is obvious and underperforms. Educate the creator on the goal, audience and proof points, then let them use their native style — they know what their audience responds to.\n\nGive them: the outcome, must-haves (offer disclosure, key message, CTA), creative freedom within guardrails, and clear usage + exclusivity terms.\n\nCreators are professionals; brief them like colleagues.\n\nAction: write a 1-page creator brief template that lists goals, must-haves and guardrails." },
      { title: "Amplification and measurement", d: 17, c: "Organic creator content builds credibility but rarely hits performance targets alone. Amplify winners with whitelisting: run paid ads directly from the creator's handle (Spark Ads on TikTok, branded content tools on Meta).\n\nWhitelisted content typically cuts CPA versus branded creative. Then optimize at the post level — concentrate budget on top performers mid-run, cut the tail early.\n\nRecycle learnings into the next brief: your ROI compounds when every campaign briefs better than the last.\n\nAction: define your measurement plan — tracking links, promo codes and the post-level review cadence." },
    ],
  },
  {
    title: "Performance Marketing Playbook",
    headline: "Full-funnel growth engineered around ROI, incrementality and scale.",
    level: "Advanced",
    category: "Paid Media",
    skill: "Performance Marketing",
    description:
      "Performance marketing is the discipline of spending marketing money where it provably works — and stopping where it doesn't. This advanced course covers channel mix, incrementality, budget allocation and the operating cadence of high-growth performance teams.",
    lessons: [
      { title: "The performance mindset", d: 22, c: "Performance marketing flips the creative-first world on its head: every decision is accountable to a number — CAC, ROAS, payback period.\n\nThe mental model: marketing as a buy-low-sell-high system. You acquire customers at a cost below their value, then compound. Scale is only interesting when efficiency holds.\n\nStart every analysis with unit economics: what can you afford to pay for a customer and still make money?\n\nAction: calculate your target CAC and LTV today, with your actual numbers." },
      { title: "Building a channel portfolio", d: 6, c: "No single channel scales forever. Build a portfolio: paid search (intent), paid social (discovery), affiliate/partnerships (incremental reach), email and lifecycle (retention, cheap revenue), and organic/SEO (compounding).\n\nEach channel has a job and a ceiling. Reserve budget for tested-and-proven channels while funding controlled experiments on new ones.\n\nDiversify spend so no algorithm change buries your business.\n\nAction: map your current channel portfolio with efficiency and scale limits for each." },
      { title: "Incrementality, not last-click", d: 17, c: "The trap of attribution: channels that get credit aren't always the ones driving outcomes. Incrementality asks: what happens WITHOUT this channel?\n\nRun geo or holdout experiments (pause a channel for a test group/region) to measure true lift. Whitelisting, brand search and influencer often look weak in dashboards but win geo-lift tests.\n\nWhere lift testing isn't practical, size programmatically with controlled budget phases.\n\nAction: choose one channel and design a 2-week GG experiment to measure its lift." },
      { title: "Budget allocation and scaling", d: 7, c: "Allocation should follow the efficiency frontier: spend until marginal return on a channel equals your blended target, then reallocate to the next-best opportunity.\n\nScale in controlled steps — 15-20% budget jumps at a time — while watching CPA drift and auction pressure. Scaling too fast is how accounts break.\n\nKeep a live budget-allocation model that reroutes weekly.\n\nAction: build a simple sheet that allocates budget by marginal efficiency." },
      { title: "The weekly performance ritual", d: 16, c: "Performance marketing is a cadence sport. Run a weekly engine room: results vs plan per channel, winning/losing creative, search terms, budget shifts, and next week's one experiment.\n\nDaily: check the guardrails (spend, delivery anomalies, CPA spikes). Weekly: deep review. Monthly: incrementality readout.\n\nConsistent cadence catches problems in days, not months — which is the whole edge.\n\nAction: schedule your weekly performance review block with a fixed agenda." },
    ],
  },
  {
    title: "Meta Ads & Paid Social",
    headline: "Run Facebook and Instagram campaigns with a creative-led, full-funnel approach.",
    level: "Intermediate",
    category: "Paid Media",
    skill: "Meta & Paid Social",
    description:
      "Meta advertising is creative-led and data-obsessed: the algorithm places your best creative in front of the audience most likely to convert. This course covers account structure, audience strategy, creative testing loops and the analytical reviews that make paid social work.",
    lessons: [
      { title: "How Meta decides wins", d: 19, c: "Meta's auction is driven by: estimated action rates (quality of creative + ad relevance) and advertiser value (bid). The best lever you control is creative — the algorithm amplifies what the audience responds to.\n\nUnderstand the CBO (campaign budget optimization) model: one campaign, multiple ad sets, budget shifts automatically toward winners.\n\nYour job is to feed the algorithm good creative and clean conversion signals.\n\nAction: define your conversion signal (pixel + CAPI where possible) before building ads." },
      { title: "Account and campaign structure", d: 12, c: "Structure for learning speed: fewer campaigns with distinct goals (prospecting, retargeting, engagement), ad sets by audience hypothesis, and ads by creative angle.\n\nDon't over-segment audiences in one campaign — let broad targeting + creative testing do the work. The algorithm needs volume to learn.\n\nMatch campaign objectives to real funnel steps: awareness → traffic/video → leads/sales.\n\nAction: sketch your Meta account map — campaigns, ad set hypotheses, creative angles." },
      { title: "Audiences that work", d: 16, c: "Modern Meta is shifting toward advantage+ (broad) audiences with strong creative and signals. But audience hypotheses still matter for testing.\n\nPlay the layers: warm (engagers, website visitors, customers/lookalikes) vs cold (broad, interest-based). Warm audiences convert; cold audiences discover.\n\nRule of thumb: let broad/advantage+ handle scaling, use smaller niches for message testing.\n\nAction: define your warm audience stack and your cold testing approach." },
      { title: "Creative testing loops", d: 15, c: "Creative is not a design task — it's a testing program. Always run multiple angles per product (benefit, feature, social proof, humorous, problem-agitate-solve) against the same audience.\n\nWatch for the north star: conversion events, not just CTR. Kill losers fast, double down on winners, and refresh creative regularly to fend off fatigue.\n\nKeep a creative library organized by angle and result. The account that tests constantly compounds learnings.\n\nAction: list 5 creative angles to test for your main product." },
      { title: "Reviews and the rhythm", d: 25, c: "Set the cadence: weekly ROAS/CPA review, new creative in constant motion, monthly structure audit.\n\nWire attribution with your analytics so you read social performance together with search and email — a full funnel speaks louder than any single-channel dashboard.\n\nAnd respect the reset: Meta performance decays; steady refresh of creative and audience structures is maintenance, not overhead.\n\nAction: book your weekly paid-social review block right now." },
    ],
  },
  {
    title: "Growth Marketing Playbook",
    headline: "Build compounding experiments and loops, not one-off campaigns.",
    level: "Advanced",
    category: "Growth",
    skill: "Growth Marketing",
    description:
      "Growth marketing is systematic experimentation across the whole funnel — acquisition, activation, retention, referral — measured by compounding loops rather than one-off campaigns. This course gives you the experiment engine most teams claim to have.",
    lessons: [
      { title: "Beyond funnel, think loops", d: 25, c: "Funnels leak; loops compound. A growth loop is a mechanism where output feeds input — referral programs, UGC flywheels, content that ranks then attracts more customers who create more content.\n\nMap one loop for your business with the four boxes: input → action → output → (feeds back to) input.\n\nFocus on loops that grow without proportional spend.\n\nAction: draw your acquisition loop on a page — where does output feed back into input?" },
      { title: "The experiment engine", d: 10, c: "Growth = volume of validated learning, run fast. An experiment engine has three parts:\n\n1. Idea backlog — every team member and every data signal drops hypotheses in.\n2. Prioritization — score by impact × confidence ÷ effort.\n3. Sprint cadence — run standards, measure consistently, kill without ego.\n\nShipping 3 small experiments a week beats one giant bet a quarter for learning velocity.\n\nAction: start a hypothesis backlog today; add three ideas." },
      { title: "Activation and the Aha moment", d: 11, c: "Acquisition is wasted if users never reach the Aha moment — the point where they experience core value. Map time-to-value for new buyers and remove every friction step.\n\nTrack activation rate (new users who hit the key milestone within day 1/7) as a north star. Terminal: onboarding emails, templates preloaded, a 'first win' in their first session.\n\nGrowth teams obsessed with activation find the cheapest wins on the board.\n\nAction: define your Aha moment and measure your current activation rate." },
      { title: "Retention and lifecycle economics", d: 8, c: "Retention is where growth compounds. Chart cohort retention (week 1, 4, 12 by signup cohort) and notice the shape: flat win, declining slide.\n\nImprove the curve with lifecycle actions: onboarding sequences, habit nudges, re-engagement campaigns, and win-back for slip.\n\nEvery 5-pt retention lift pays off repeatedly in LTV — often more than any acquisition fix.\n\nAction: run a week-1 retention analysis on your current customers." },
      { title: "Referral and the viral coefficient", d: 41, c: "Referral growth is earned — it scales your best customers' networks. Design referral incentives that reward the referrer and the referred with something genuinely valuable (not cheap discounts).\n\nMeasure the viral coefficient: average invites sent × conversion of invite → new user. Above 1, you're compounding without spend.\n\nMake sharing effortless and contextual — an invite worth sending inside an actual moment of value.\n\nAction: design one referral mechanism and its per-customer viral math." },
    ],
  },
  {
    title: "Marketing Automation Systems",
    headline: "Automate nurture, scoring and operations with platforms like HubSpot.",
    level: "Intermediate",
    category: "Automation",
    skill: "Marketing Automation",
    description:
      "Marketing automation manager roles grew 10% year-over-year for good reason: teams that automate outperform teams that manually chase. This course teaches workflow design, lead scoring, nurture journeys and the ops discipline behind scalable automation.",
    lessons: [
      { title: "From manual to automated", d: 7, c: "Automation is not about sending more — it's about sending smarter with less human effort. Start by inventorying your repetitive marketing actions: new-lead responses, nurture, onboarding, reporting.\n\nRank them by (time saved × frequency) to pick your first automations. The highest ROI is almost always the welcome/new-lead flow.\n\nDocument every automation's trigger, branches and 'what's the goal' so the system stays understandable.\n\nAction: list your top 5 repetitive marketing tasks and estimate their time cost." },
      { title: "Workflow design principles", d: 44, c: "Every workflow needs a clear trigger, audience, journey and exit. Map it before building: trigger event → condition → sequence of actions → branch or end.\n\nKeep flows simple enough that a colleague can read them. Add goal-based branching sparingly; automation that over-complicates is automation that breaks.\n\nWire time delays based on the buyer's journey — freshest intent moves fastest.\n\nAction: draw a 4-step welcome workflow on paper before touching the platform." },
      { title: "Lead scoring that predicts", d: 12, c: "Lead scoring ranks who to call and who to nurture. Combine firmographic fit (budget, role, industry) with engagement signals (opened, clicked, visited pricing, requested demo).\n\nStart simple — your CRM's default model, tuned to your sales follow-up data — then iterate. Review score-to-conversion outcomes monthly and adjust weights.\n\nA score is only useful if sales acts on it; align the threshold with what resourcing you actually have.\n\nAction: define your 'sales-ready' trigger and list the engagement events it should include." },
      { title: "Nurture journeys that close", d: 16, c: "Most leads aren't ready at first touch. Nurture is education-based: a timed sequence that moves a prospect from problem-aware to solution-aware to decision.\n\n3-email cadences separated by days beat daily blasts. Each email adds value — insight, proof, objection handling — rather than 'just checking in'.\n\nScore-driven exit: when a nurture contact hits the sales-ready threshold, route to sales and pause the drip.\n\nAction: outline a 6-email nurture journey around a real buyer persona." },
      { title: "Ops hygiene and reporting", d: 46, c: "Automation rots when data is dirty. Set a hygiene rhythm: duplicate-merge sweeps, form field limits, unsubscribe integrity, and source attribution cleanliness.\n\nReport on the business, not activity: leads nurtured → meetings booked → pipeline created from workflows. Show the revenue attributed to automation.\n\nRespect the unsubscribe and privacy rules everywhere — compliant automation is durable automation.\n\nAction: define the 3 outcomes your automation report tracks each month." },
    ],
  },
  {
    title: "Brand Strategy for Marketers",
    headline: "Differentiate, position and build a brand that compounds trust.",
    level: "Beginner",
    category: "Brand",
    skill: "Brand Strategy",
    description:
      "Brand is the asset that makes everything else cheaper and more effective. This course builds the strategic foundation — positioning, differentiation, identity and narrative — that companies hire brand strategists to create.",
    lessons: [
      { title: "Positioning: the strategic core", d: 13, c: "Positioning is the mental slot your brand owns in the buyer's mind. The classic formula: For [audience], [brand] is the [category] that [differentiating benefit] because [reason to believe].\n\nA strong position is specific enough that the opposite sounds wrong. Diffuse branding is the #1 reason marketing looks generic.\n\nWrite your positioning statement and pressure-test it against competitors — not your own features.\n\nAction: draft your positioning statement in the formula above." },
      { title: "Differentiation that matters", d: 31, c: "Differentiate on what the market buys: outcome, experience, price architecture, or identity (who it's for). Features are copied; meaning is not.\n\nFind your wedge in the customer's words — the phrase only you can credibly claim. 'Book a builder who catches what inspectors miss' beats 'we care about quality.'\n\nAudit your pages: if your brand swap-test (replace logo with a competitor) changes nothing, you haven't differentiated.\n\nAction: run the brand swap-test on your hero message today." },
      { title: "Brand identity and voice", d: 12, c: "Identify is behavior made visible: name, marks, color, typography — and the voice system behind every sentence. Consistency builds recognition; recognition builds trust.\n\nBuild a small brand kit (logo, palette, typography, tone of voice) and enforce it in every surface. Vibrandicide is doing things 'on the fly.'\n\nVoice is your personality in language — document the do's and don'ts like a person, not an adjective list.\n\nAction: draft a one-page voice guide with example rewrites." },
      { title: "Narrative and the hero's story", d: 30, c: "People remember stories, not slide decks. Brand narrative: the world as it was (problem), the change (your insight/catalyst), the world as it can be (outcome).\n\nMake your customer the hero and your brand the guide — the guide archetype sells better than the hero archetype.\n\nEvery web page, ad and opening slide should tap the same narrative spine. Repetition with variation is how narrative installs.\n\nAction: write your brand story in hero-and-guide form (5 sentences)." },
      { title: "Measuring brand health", d: 8, c: "Brand moves slowly; measure it on the right clock: aided/unaided awareness, consideration, preference and NPS-lite (how likely to recommend).\n\nTrack alongside a proxy for strength: branded search volume, direct traffic share, share of voice in your category.\n\nBrand is the multiplier on every other channel — report it quarterly, not weekly.\n\nAction: pick 3 brand-health metrics and a quarterly measurement rhythm." },
    ],
  },
  {
    title: "Product Marketing: Go-To-Market",
    headline: "Own positioning, launch, messaging and enablement for your product.",
    level: "Intermediate",
    category: "Product",
    skill: "Product Marketing",
    description:
      "Product marketing is the connective tissue between product, sales and marketing — and product marketing managers are some of the most-hired roles in marketing. This course covers the PMM operating loop from research to launch to enablement.",
    lessons: [
      { title: "The product marketing role", d: 16, c: "Product marketing owns the voice of the market at decision time: what the product is for, who it's for, and why they should buy — turned into messaging the whole company uses.\n\nOperating loop: research → position → message → launch → enable → measure → iterate.\n\nYou are the translator between customer problem, product capability and sales story.\n\nAction: write the one sentence of what your product does for whom, in customer words." },
      { title: "Buyer personas and jobs-to-be-done", d: 15, c: "People buy to get a job done. Define the JTBD: when [situation], I want to [job], so I can [outcome]. Dissatisfaction with the current solution is the buying fuel.\n\nResearch is the job: customer interviews, win/loss data, sales call transcripts, review mining. Personas without evidence are fiction.\n\nMap the buying committee — champion, economic buyer, technical evaluator — each with their own job.\n\nAction: write a JTBD statement and 3 interview questions that test it." },
      { title: "Messaging hierarchy and positioning", d: 23, c: "Build the messaging house: umbrella position → key benefit pillars → proof points. Everyone pulling from one hierarchy keeps sales, ads and web consistent.\n\nDifferentiation lives in the proof, not the adjective. 'Fast' is empty; 'cuts onboarding from 2 weeks to 2 hours' is provable.\n\nWrite a battlecard for sales: personas, objections, competitor responses.\n\nAction: draft a 3-pillar messaging house for your flagship offer." },
      { title: "Launching with a plan", d: 16, c: "A launch is a sequence, not an event. Work backwards from the goal: internal alignment → beta/early access → announcement → amplification (PR, influencers, email, paid) → post-launch optimization.\n\nDesign your launch for the buyer's journey, not the release date: teaser, launch moment, proof wave, adoption push.\n\nPrepare launch assets — page, demo, enablement deck, FAQ — before day one.\n\nAction: sketch a 6-week launch plan with weekly milestones." },
      { title: "Sales enablement", d: 45, c: "Great messaging dies without enablement. Build the sales toolkit: demo script, objection handling, competitive battlecards, one-pagers and a pricing narrative.\n\nObserve real sales calls; the objections that actually come up should rewrite your materials.\n\nMeasure adoption: if sales uses your content, messaging reaches market. If not, your enablement is theater.\n\nAction: record one sales objection pattern and build a response page." },
    ],
  },
  {
    title: "Short-form Video Marketing",
    headline: "Master Reels, TikTok and Shorts with hooks, retention and packaging.",
    level: "Beginner",
    category: "Content",
    skill: "Short-form Video",
    description:
      "Short-form video is the fastest path to reach for most brands — and the least diplomatically honest about quality: retention decides everything. This course breaks down hooks, pacing, packaging and repurposing for feeds that reward speed.",
    lessons: [
      { title: "The retention math", d: 11, c: "Vertical feeds are a retention game played in milliseconds. Algorithms reward videos that hold viewers; completion and replays compound distribution.\n\nThe first 1.5 seconds is a hook, not an introduction. Statistically, keeping 70%+ of viewers past 3 seconds is the banger threshold.\n\nWrite hooks as outcome promises with an open loop: 'The CRO mistake that costs 30% of signups…'\n\nAction: rewrite your last short as five different 1.5-second hooks." },
      { title: "Hooks that stop the scroll", d: 16, c: "Hook patterns that travel: startling result, mistake/anti-pattern, specific number, contrarian take, before/after, 'nobody tells you.'\n\nPair the hook with the visual text overlay — most watch muted. One idea per short; the algorithm rewards singleness.\n\nFront-load the payoff. The most engaging part of the video is the first 30%.\n\nAction: collect 10 hooks from top-performing creators in your niche and adapt 3." },
      { title: "Pacing and editing", d: 11, c: "Pacing is compression: cut the dead air, keep sentences tight, let cuts follow the thought. The 'eyes-closed test' — listen to your short without visuals — reveals pacing problems immediately.\n\nSubtitles (burned in), b-roll that matches the words, and a beat rhythm keep retention up. Comprehension is a decay curve; every confused second loses viewers.\n\nAction: apply the eyes-closed test to your last video and cut where you're bored." },
      { title: "Packaging for the feed", d: 25, c: "The package — thumbnail, first frame, caption, sound — decides whether the hook ever gets seen. On TikTok/Shorts, the trending sound and first three frames do heavy lifting.\n\nDescribe the payoff in the caption and put it above the fold of your analytics: save/comment velocity drives the algorithm.\n\nCraft a series hook: episodic formats (day 1/day 2, mistakes first, part 2 teasers) earn revisits.\n\nAction: redesign one post's first frame + caption as a package." },
      { title: "Repurposing as a system", d: 15, c: "Your best long-form becomes ten shorts. Build the slitter pipeline: pull the strongest 60-second moments, write a fresh hook for each, cut vertical, add subtitles and burn the brand treatment.\n\nNot every moment works vertical — selection is the skill. Track which repurposed cuts outperform original shorts.\n\nShort-form compounds through systems: one long-form asset a week feeding a daily short cadence is attainable.\n\nAction: cut a 60-second highlight from your last long video and ship it today." },
    ],
  },
  {
    title: "Marketing Strategy: Plans that Win",
    headline: "Segmentation, insight and allocation — the thinking behind great marketing.",
    level: "Advanced",
    category: "Strategy",
    skill: "Marketing Strategy",
    description:
      "Marketing strategy is the most future-proof marketing skill per the research — the work AI can't do yet. This course covers the strategist's toolkit: market analysis, segmentation and targeting, positioning, offensive planning and the judgment that turns data into direction.",
    lessons: [
      { title: "The strategist's mindset", d: 53, c: "Strategy is choosing what not to do as much as what to do. The strategist's output is a set of deliberate trade-offs that concentrate scarce resources on the biggest opportunity.\n\nDiagnosis → guiding policy → coherent action: pick the central challenge, the principle that addresses it, and the aligned moves.\n\nResist the Christmas tree plan (everything, everywhere) — it's a shopping list, not a strategy.\n\nAction: write the ONE marketing challenge that matters most right now." },
      { title: "Market and category analysis", d: 26, c: "Great plans start with a map: market size and growth, segments, competitors, substitutes and the forces shaping the category.\n\nUse the analysis to find where the market pulls — growing segments, underserved needs, structural tailwinds (AI, privacy, channel shifts).\n\nYour plan should bet on the trend lines, not the current state.\n\nAction: draw a 3x3 matrix of segments × market pull and circle your best cell." },
      { title: "Segmentation and targeting", d: 10, c: "Segments are groups with distinct needs you can serve differently. Segment on attitudes and behavior, then size who's worth targeting.\n\nThe beauty of tight targeting: messaging resonates, channel spend concentrates and positioning becomes possible. Marketing to 'everyone' markets to no one.\n\nAction: pick your primary and secondary target segments and write their one-line JTBD." },
      { title: "Positioning and the offer", d: 7, c: "Positioning = the promise a segment understands you for. Build it from the customer's problem and your credible proof — then construct the offer (value, price, packaging) that makes the position real.\n\nAlign offer to position: a 'premium' position with bargain pricing confuses; a 'simple' position with dense onboarding betrays it.\n\nStrategy is coherence: segment, position and offer must pull the same direction.\n\nAction: check the coherence of segment → position → offer for your plan." },
      { title: "Allocation, sequencing and the plan", d: 16, c: "A plan converts strategy into a budget and a sequence: which segments/channels get spend first, what builds, what funds growth.\n\nSequence for learning: small bets to validate, then pour into what works. Reserve a slice (10-15%) for experiments.\n\nWrite the plan in one page: challenge, choice, audience, position, channels, budget, metrics, next quarter's bet.\n\nAction: compress your current plan to one page with a single allocation decision." },
    ],
  },
  {
    title: "Generative Engine Optimization (GEO/AEO)",
    headline: "Get your brand cited when customers ask AI assistants.",
    level: "Intermediate",
    category: "SEO",
    skill: "GEO / AEO",
    description:
      "A growing share of discovery happens in AI answers — chatbots, AI overviews and answer engines that synthesize instead of link. GEO/AEO is the fast-rising discipline of earning presence in those answers. This course covers content, authority and citation strategies for the answer era.",
    lessons: [
      { title: "The answer-era shift", d: 32, c: "Half the queries that used to send clicks now end in an AI summary. That doesn't mean search died — it means the 'surface' changed from ten blue links to a synthesized answer.\n\nMarketers now compete for two prizes: being the source the answer is built from, and being the brand mentioned inside it.\n\nThe playbook shifts from ranking pages to being hard to ignore as an authority.\n\nAction: run 5 of your buyers' top questions in an AI assistant and note which brands get cited." },
      { title: "Being source-worthy", d: 22, c: "Answer engines prefer content that's verifiable, specific and citable: clear definitions, named data points, dated statistics, named experts and plain-language answers at the top.\n\nStructure so a machine can quote you: one clear answer up front, headings that are questions, facts with sources, and a consistent knowledge entity (consistent naming, authorship, citations).\n\nAction: rewrite your top page so a reader could lift its first paragraph as a standalone answer." },
      { title: "Authority and mentions", d: 18, c: "Answer engines infer trust from a brand's footprint: coverage in credible outlets, industry databases, review ecosystems and community mentions.\n\nEarn citations beyond your own site — directories, PR, interviews, guest content and digital-PR data stories pull the strongest reference links.\n\nTrack mention growth in your niche and feed it into GEO.\n\nAction: list 5 credible surfaces where you could earn a mention this quarter." },
      { title: "Entity and brand optimization", d: 12, c: "Search and answer systems understand entities — brands, people, products — and their relationships (owns, founded, reviews, alternatives).\n\nOptimize your entity: consistent naming across the web, structured data on your pages, author bios with credentials, and Wikipedia-like knowledge-base presence where earned.\n\nWhen asked 'best X', systems return the entities they know best. Become one.\n\nAction: audit name/logo/bio consistency across all your platforms." },
      { title: "Measuring answer presence", d: 42, c: "GEO metrics lag SEO: track your citation rate in AI answers (manually or with monitoring tools), branded mentions, and referral traffic from assistant links.\n\nSet a routine: monthly 'ask the assistant' audit on your top 10 queries, logging whether you're sourced, mentioned or absent.\n\nThis discipline compounds — presence in answers is becoming a measurable share-of-voice.\n\nAction: create a simple monthly AI-presence scorecard." },
    ],
  },
  {
    title: "Marketing Attribution & ROI",
    headline: "Model multi-touch impact and defend your budget with the right proof.",
    level: "Advanced",
    category: "Analytics",
    skill: "Marketing Attribution",
    description:
      "Every channel manager has a story; attribution is how you separate credit from fact. This course covers the attribution models, causal methods and reporting discipline that let marketers allocate budget on evidence instead of intuition.",
    lessons: [
      { title: "Why attribution is hard (and worth it)", d: 21, c: "Customers touch five channels before buying; each vendor wants full credit. Single-touch models (last-click, first-click) systematically distort where value comes from.\n\nAccept the hard truth: no model is perfect. The point is building one you can improve and using consistent logic to compare channels over time.\n\nAttribution is a budget-allocation tool, not a museum of truth.\n\nAction: write down the current model your team uses and its known blind spots." },
      { title: "Models from last-click to data-driven", d: 11, c: "The spectrum: last-click (cheap, distortionary), first-click (misses closing), linear/position-based (equal or weighted credit), and data-driven/time-decay models (credit weighted by proximity and statistical contribution).\n\nData-driven models (Google/Meta) crunch volumes you can't replicate by hand — but they still only see their own walled gardens.\n\nBlend platform signals with your own tracking to get a full-view.\n\nAction: review GA4's attribution models on one campaign and note where credit shifts." },
      { title: "Causal thinking: lift tests", d: 17, c: "Incrementality is the gold standard: what actually changes BECAUSE your channel ran? Geo holdouts and randomized experiments close the gap that even smart models leave open.\n\nRun GG experiments when budgets and risk allow; for smaller tests, use phased budget ramps against matched geos.\n\nThe number that matters: incremental ROAS — revenue that disappears without the channel.\n\nAction: design one geo-holdout test for your biggest non-brand channel." },
      { title: "Building a unified view", d: 28, c: "Paste platform data into one model: spend, revenue, and a consistent attribution rule across search, social, email, organic and partners.\n\nStart pragmatic — a spreadsheet with your chosen model — then automate. The goal is a defensible, explainable number per channel.\n\nMap brand vs non-brand separately; brand keywords are harvest, not acquisition.\n\nAction: build the unified table this week with the same rule for every channel." },
      { title: "Reporting that defends budget", d: 40, c: "The CFO asks 'is this channel making money?' Answer with efficiency, incrementality and trend — not 'we got impressions.'\n\nStructure the report: spend, revenue, ROAS by model, the incrementality read, and the recommendation ('shift 15% from X to Y based on incremental ROAS').\n\nConfidence in the numbers is a career skill; vagueness is how marketing budgets get cut.\n\nAction: rewrite your last channel report with explicit incremental ROAS and a recommendation." },
    ],
  },
  {
    title: "Conversion Rate Optimization",
    headline: "Turn a stalled audience into converts with research, tests and persuasion.",
    level: "Intermediate",
    category: "Growth",
    skill: "A/B Testing & Experimentation",
    description:
      "CRO is cheaper growth: maximizing the conversion of traffic you already paid for. This course runs the full optimization loop — research, hypothesis, experiment design, statistical judgment and the persuasion levers on the page.",
    lessons: [
      { title: "CRO = buying more from your traffic", d: 11, c: "If conversion is 2% and you lift it to 2.6%, that's 30% more revenue with zero extra traffic spend — usually the most efficient growth available.\n\nThe loop: identify friction (research) → hypothesize a fix → test → learn → scale.\n\nBeware the vanity test: tiny changes with zero statistical power that 'win' on noise.\n\nAction: compute your conversion rate and what a 1.3x lift is worth in revenue." },
      { title: "Research before redesign", d: 14, c: "Test ideas should come from evidence, not preference. Sources: session recordings (where do users stall/vibrate?), heatmaps and scroll depth, form analytics (drop-off fields), on-site polls and user interviews.\n\nRank friction by severity × frequency. The 'biggest visual change' is rarely the biggest win — fix the confusing button before the color.\n\nAction: watch 5 session recordings and document 3 stall points." },
      { title: "Hypotheses and experiment design", d: 15, c: "A proper hypothesis: Because [evidence], we expect that [change] will [metric effect] for [audience].\n\nDesign the experiment: isolate ONE variable, define the primary metric and guardrail metrics, and set the sample size before you start.\n\nRun long enough to reach significance — premature calls are the #1 CRO killer.\n\nAction: write 3 evidence-backed hypotheses with a primary metric each." },
      { title: "Persuasion levers that move the needle", d: 16, c: "The high-lift levers on any page: clarity of the offer (say what it is in one line), a single primary CTA, social proof positioned near decisions, objection handling, and reduced friction (fewer form fields, clearer next step).\n\nTest likely-to-win changes (clarity, proof, friction) over styling. Big statistical lifts come from removing confusion, not from color tests.\n\nAction: audit your main page against a 5-lever clarity checklist." },
      { title: "Scaling learnings across the funnel", d: 37, c: "One test teaches a family: the 'clarity + proof + trust' pattern that wins a landing page usually wins your email CTA, your pricing page and your ads.\n\nKeep an experiment library: hypothesis, result, why it worked (your read), and where else to apply it.\n\nMature CRO is a compounding system: every experiment improves the accuracy of the next.\n\nAction: add your last test result to a documented learnings log." },
    ],
  },
  {
    title: "Landing Pages That Convert",
    headline: "Design pages with hierarchy, proof and CTAs that actually convert.",
    level: "Beginner",
    category: "Web",
    skill: "Landing Pages & Web Design",
    description:
      "Traffic is only worth what the page it lands on can convert. This course covers the anatomy of high-converting landing pages — message-match, visual hierarchy, proof, and the technical basics of speed and mobile — plus a practical build workflow.",
    lessons: [
      { title: "Message match: the #1 factor", d: 15, c: "Message match is the overlap between the ad's promise and what the landing page delivers. Google and Meta both penalize mismatch — if the ad says 'free template' and the page sells software, quality collapses.\n\nMatch on three levels: promise (headline mirrors the ad), audience (language your segment uses), and outcome (the next step delivers what behavior expected).\n\nAction: open your ad and landing page side by side; list every mismatch." },
      { title: "Anatomy of a converting page", d: 14, c: "The reliable skeleton: headline with the promise → subhead with the mechanism → proof immediately (social proof, numbers, logos) → the core offer/highlight → objections addressed → one clear CTA, repeated.\n\nReaders scan: use benefit bullets over paragraphs, keep CTA above and below the fold, and show the 'after state.'\n\nEvery element earns its place or it's noise.\n\nAction: sketch your page against this skeleton and cut the noise." },
      { title: "Visual hierarchy and clarity", d: 17, c: "Design is where marketing decisions get executed: one primary CTA per screen, obvious contrast, generous whitespace, and the single sentence that explains the offer.\n\nThe 5-second test: viewers should instantly know what's offered, to whom, and what to do.\n\nClarity beats cleverness. If you must explain the design, it's already failing.\n\nAction: run the 5-second test on your page with 3 people." },
      { title: "Proof, trust and objection handling", d: 15, c: "Static trust badges convert less than specific proof. Use testimonials with names and outcomes, exact numbers ('2,300 PDF downloads'), before/after, guarantees and social-proof counts.\n\nAddress the top objection in copy ('It's more expensive than DIY — here's why it pays back in one deal').\n\nHonesty patterns raise conversion: transparent pricing and clear terms build the trust the CTA needs.\n\nAction: write a specific proof element for your page's decision point." },
      { title: "Speed, mobile and the build", d: 13, c: "Every extra second of load cuts conversion. Compress images, remove heavy scripts, and test on the 3G throttle. Mobile-first: your page must convert in one thumb.\n\nBuild with templates if time-starved, but customize the critical 20%: headline, offer copy, proof, CTA. A/B test after traffic exists.\n\nLaunch with analytics wired so you know your baseline before you touch anything.\n\nAction: run a mobile speed audit and fix the top 3 issues." },
    ],
  },
  {
    title: "Lead Generation Systems",
    headline: "Build demand-capture funnels that turn interest into pipeline.",
    level: "Intermediate",
    category: "Growth",
    skill: "Lead Generation",
    description:
      "Leads don't come from hoping; they come from systems — an offer worth exchanging an email for, a landing page that converts, and a follow-up that beats the market's average. This course wires those pieces together for B2B and B2C alike.",
    lessons: [
      { title: "The lead-gen machine", d: 8, c: "Lead generation is a sequence, not an event: attract (traffic), convert (offer + page), capture (form + handoff), qualify, and follow up fast.\n\nEverything improves when each stage has a number. Map your current pipeline: what traffic, at what conversion, to what handoff, followed up when?\n\nAction: draw your current lead machine with a number at every step." },
      { title: "Offers that earn emails", d: 24, c: "The offer is the lead magnet that converts attention into a contact: checklist, template, calculator, mini-course, assessment, or benchmark data.\n\nA strong offer is specific, immediately valuable and a natural step into your product. Match the promise to the traffic source for message match.\n\nGate only at the useful moment — friction kills conversion.\n\nAction: design one high-value offer with a two-step promise." },
      { title: "Forms and the captured value", d: 29, c: "Every extra form field cuts conversion meaningfully. Collect the minimum to qualify: usually email + name, adding firmographic fields only when the value provided justifies them.\n\nUse progressive profiling: ask one question per conversion across their journey.\n\nWire form trigger events into your analytics and CRM so capture is tracked, not assumed.\n\nAction: trim your form to the minimum viable fields." },
      { title: "Speed-to-lead and follow-up", d: 13, c: "Speed to lead decides outcomes: responding in minutes converts dramatically better than responding in hours. Auto-route captured leads to whoever can call fastest.\n\nBuild the follow-up ladder: instant confirmation → value email → call attempt → nurture sequence if not contacted.\n\nAutomation handles speed; humans handle warmth. Both are required.\n\nAction: map your follow-up ladder with timings and assign ownership." },
      { title: "Qualifying and pipeline quality", d: 48, c: "More leads isn't the goal; SALs and pipeline are. Use lead scoring + qualification questions so sales stops chasing tire-kickers.\n\nMeasure MQL→SAL→win rates, not just volume. A 2x lead volume with a 0.5x quality ratio achieves nothing.\n\nRefine sources by quality: the campaign that generates the most SQLs (not MQLs) wins budget.\n\nAction: define the qualification threshold and audit last quarter's leads against it." },
    ],
  },
  {
    title: "Video Content Creation Bootcamp",
    headline: "Produce, shoot and edit video that works across organic and paid.",
    level: "Beginner",
    category: "Content",
    skill: "Video Content Creation",
    description:
      "Video is the default format of modern marketing, but the plan-B monster — 'let's make a video' with no plan — wastes more budget than any other channel. This course takes you from concept through production to shipping YouTube, social and ad-ready video with the tools you already have.",
    lessons: [
      { title: "The video-first content plan", d: 9, c: "Before cameras: what job does the video do (teach, demo, entertain, convert)? Where does it live (YouTube search, feed, ad)? What does success look like?\n\nMatch format to job: tutorials for search, hooks for feeds, demos for ads, stories for brand.\n\nYour phone is a professional camera; discipline beats gear.\n\nAction: write a one-line brief for your next video: audience, job, surface, success metric." },
      { title: "Framing, light and sound", d: 14, c: "Three things make DIY video look professional: light on your face (window or ring light), sound that's clean (lav mic found in budget earbuds > camera mic), and a clean, uncluttered frame at eye level.\n\nShoot 4K at 24 or 30fps, keep the camera still or use intentional motion, and record 10+ seconds of room tone for editing.\n\nAction: set up and record a 60-second test video; fix the worst of light, sound, frame." },
      { title: "Scripting for retention", d: 20, c: "Retention-friendly scripts open with the outcome, front-load the hook, use the 'open loop' to keep viewers, and close with the one CTA.\n\nWrite for the ear: short sentences, plain words, no listicles read aloud. Speak like you're texting a smart friend.\n\n15 seconds of tight script beats 60 seconds of ramble.\n\nAction: script a 60-second video with hook, open loop and CTA before filming." },
      { title: "Editing that keeps attention", d: 15, c: "The edit is where retention is won: cut the dead air, use b-roll to cover cuts, keep subtitles on, and match visuals to the spoken meaning.\n\nApply the eyes-closed test to nail pacing, then tighten 20% more than feels natural.\n\nChapterize long videos and put the best 15 seconds where the algorithm can surface it.\n\nAction: edit your test video under 30 seconds, subtitles included." },
      { title: "Shipping loop: publish, measure, repeat", d: 11, c: "Volume compounds when paired with measurement: publish weekly, review retention graphs monthly, and feed learnings into the next brief.\n\nSteal your own best — the concept that holds 60%+ retention earns a series. Kill the videos that bounce.\n\nAction: set your weekly cadence and the retention number that decides 'series or stop.'" },
    ],
  },
  {
    title: "CRM & Marketing Ops with HubSpot",
    headline: "Run contacts, lifecycle stages, scoring and reporting like an operator.",
    level: "Intermediate",
    category: "Automation",
    skill: "CRM & HubSpot",
    description:
      "A healthy CRM is the operating system behind marketing, sales and support. This course teaches the ops layer: data hygiene, lifecycle stages, pipeline design, lead scoring and the reporting cadence that keeps teams coordinated.",
    lessons: [
      { title: "The CRM as source of truth", d: 20, c: "Marketing generates leads; the CRM makes them addressable. A single source of truth for contacts, companies and deals keeps marketing, sales and success aligned.\n\nThe state that matters: one canonical record per customer, lifecycle stage tracked, sources attributed.\n\nAction: audit your CRM's duplicate rate and field consistency today." },
      { title: "Lifecycle stages and pipelines", d: 10, c: "Define the stages — subscriber → lead → MQL → SAL → opportunity → customer → evangelist — and the transition criteria for each.\n\nPipeline discipline: a deal moves only when the criteria are met, not because someone clicked 'next.'\n\nStages with agreed definitions make the whole company speak one language.\n\nAction: document your lifecycle definitions and review a quarter of deals against them." },
      { title: "Lead scoring the honest way", d: 14, c: "Score on fit and engagement: firmographic fit · behavior (opened, clicked, visited pricing, requested demo) · recency.\n\nStart from sales' view of a great deal, then tune weights monthly against win rates.\n\nScore that sales doesn't act on is theater — align the threshold with capacity.\n\nAction: draft a scoring model weighted to last quarter's won deals." },
      { title: "Hygiene and deduplication", d: 51, c: "CRM rot is the silent tax on everyone: duplicate records, junk domains, stale contact roles. Automate dedup, validate emails, and standardize fields on entry.\n\nSet a monthly hygiene hour: merge, purge hard-bounced/marketing-unengaged per policy, and document the process.\n\nAction: schedule the hygiene hour and list the top 3 data rules to enforce." },
      { title: "Reporting to the business", d: 14, c: "Report the funnel in revenue language: pipeline created by source, conversion by stage, time-to-close, win rate.\n\nWeekly pipeline review, monthly funnel review, quarterly source mix. Tie CRM numbers back to spend and efficiency.\n\nThe mark of good ops: any executive can ask a question and the CRM answers it consistently.\n\nAction: create your weekly pipeline report template." },
    ],
  },
  {
    title: "Growth Data & Storytelling",
    headline: "Turn KPIs into narratives stakeholders remember.",
    level: "Intermediate",
    category: "Analytics",
    skill: "Data Visualization",
    description:
      "Visual storytelling is now the #1 fastest-growing marketing skill. This course is the bridge between analysis and influence: choosing the right chart, building a narrative with data, and presenting numbers so decisions actually happen.",
    lessons: [
      { title: "The chart you choose is an argument", d: 49, c: "Every chart implies a story. Bars compare magnitudes, lines show change over time, scatter shows relationships, and proportions warrant a bar or treemap, not a pie.\n\nMatch the question: 'which is biggest' → bar; 'what's the trend' → line; 'what drives what' → scatter.\n\nChoosing the wrong chart isn't aesthetics — it's a failed argument.\n\nAction: re-map your last report's data to the right chart type per question." },
      { title: "Design for the reader's 30 seconds", d: 10, c: "Dashboards are read in seconds. Lead with the answer: headline 'what you should know' above the charts, direct labels, and one takeaway per visual.\n\nDeclutter relentlessly: no gridlines without reason, no 3D, no rainbow palettes. Use one accent color for the point.\n\nTitles should state the takeaway, not the axes: 'Mobile converts 18% worse' beats 'Conversion by device.'\n\nAction: rewrite your last dashboard's titles as takeaways." },
      { title: "The narrative arc of a data story", d: 58, c: "Structure data presentations like stories: context → what we expected → what the data shows → what it means → what we should do.\n\nThe tension (expected vs actual) is what makes the story click. End every data share with a decision.\n\nAnchoring helps: compare to a benchmark, a goal or a prior period — standalone numbers have no meaning.\n\nAction: restructure your next report as story arc with an anchoring benchmark." },
      { title: "Craft in spreadsheets and decks", d: 25, c: "Most business data lives in spreadsheets. Learn the crafting layer: structured ranges, named metrics, conditional formatting for flags, and chart elements (data labels, clean legend, source notes).\n\nIn decks: one big claim per slide, a chart that proves it, and the 'so what' line.\n\nSource notes build the credibility that persuasion needs.\n\nAction: build a 3-slide KPI deck with one claim and one chart each." },
      { title: "Presenting numbers persuasively", d: 11, c: "Delivery decides uptake: open with the headline, keep the audience on the one slide, and turn numbers into implications (\u201c₹X per month of wasted budget\u201d beats a percentage alone).\n\nHandle pushback with evidence sourcing: 'here's the data, here's the assumption, here's what changes.'\n\nNumbers persuade only when combined with a narrative and a recommendation.\n\nAction: rehearse your next data share as a 90-second headline-first pitch." },
    ],
  },
  {
    title: "Lifecycle & Retention Marketing",
    headline: "Turn one-time buyers into compounding lifetime value.",
    level: "Intermediate",
    category: "Lifecycle",
    skill: "Lifecycle & Retention",
    description:
      "Acquisition wins new customers; retention makes them worth having. This course is the retention function: onboarding that sticks, engagement loops, re-engagement and win-back, measured by cohort curves and lifetime value.",
    lessons: [
      { title: "Retention is the growth multiplier", d: 13, c: "A 5% retention lift can mean 25%+ more profit — retention compounds like an asset while acquisition costs renew.\n\nMap the customer journey after purchase: value delivery timeline, moments of high engagement, moments of churn risk.\n\nYour retention job is to make sure buyers actually get the value they paid for.\n\nAction: draw the post-purchase journey to first value for a typical customer." },
      { title: "Onboarding that creates habit", d: 11, c: "The first hours decide lifetime: a fast, guided path to the Aha moment. Start with a post-purchase series that delivers quick wins immediately.\n\nSet up activation triggers: welcome email, first-use guide, template preload, short initial commitment, and a narrow 'next best step.'\n\nReduce friction to the first success, then expand.\n\nAction: map a day-1 activation path and remove 3 friction steps." },
      { title: "Engagement and loyalty loops", d: 6, c: "Build loops that pull users back: progress systems, community, content cadence, lifecycle nudges, and rewards for behaviors you want.\n\nThe loop: action → value → repeat. Each loop should make the next cycle cheaper.\n\nFrequency that adds value is retention; frequency that annoys is churn fuel.\n\nAction: design one engagement loop with a return trigger." },
      { title: "Re-engagement and win-back", d: 7, c: "Dormant segments need a different message than new customers: remind them of the stored value, not the features.\n\nWin-back sequencing: soft value touch → fresh offer/intent trigger → last-hurrah exit. Put escaped users through surveys to learn the real reason.\n\nTrack the win-back conversion and the re-churn rate of the recovered.\n\nAction: draft a win-back series for your dormant segment (with an exit survey)." },
      { title: "Measuring LTV and churn", d: 55, c: "LTV is the north star of retention: revenue per active customer × average lifetime. Churn is its shadow.\n\nTrack cohort retention curves every reporting period and watch the shape — the slope is the health indicator, not a single number.\n\nConnect retention KPIs to their lever: activation issues show in week-1 cohorts, product fatigue in month 3+.\n\nAction: build your cohort retention table this week." },
    ],
  },
  {
    title: "Personalization at Scale",
    headline: "Deliver the right message to the right customer at the right time.",
    level: "Advanced",
    category: "Growth",
    skill: "Personalization & CRO",
    description:
      "Personalization is the customer-experience shortfall employers keep flagging — and the lever modern consumers expect. This course covers the personalization stack: data foundations, segment-level journeys, on-site and in-app tailoring, and the experimentation that proves it out.",
    lessons: [
      { title: "The personalization mindset", d: 12, c: "Personalization is relevance at scale: using data to serve the right message, offer or experience to the right person.\n\nDon't boil the ocean — start with the highest-value moments: return visitors, cart abandoners, pricing-page viewers, high-intent segments.\n\nRelevance compounds; creepiness is a risk signal to calibrate.\n\nAction: list your top 5 'moments that matter' where relevance would change an outcome." },
      { title: "Data foundations first", d: 16, c: "No data, no personalization. Get the foundations: identity resolution, event tracking, consent state and a customer profile that unifies behavioral + demographic signals.\n\nClean, consented data is both the fuel and the compliance requirement.\n\nStart with rules-based segmentation (behavior, lifecycle stage, device/geo) before any ML.\n\nAction: audit your identity/consent/event data foundation and fix the gaps." },
      { title: "Segment-level journeys", d: 10, c: "Build journeys per segment, not per person-in-theory: new vs returning, category affinity, price sensitivity, lifecycle stage, churn risk.\n\nEach journey gets its own message, offer and timing. Incremental relevance: homepage headline for known segments, email cadence by lifecycle stage.\n\nDocument the matrix segment × moment × message.\n\nAction: define 4-6 segments and one personalized experience each." },
      { title: "On-site and dynamic experiences", d: 44, c: "Dynamic content tools let one page render dozens of variants: headlines by traffic source, offers by return status, social proof by geo, recommendations by affinity.\n\nHonor the golden rule: personalize only what you can genuinely tailor — fake personalization ('Welcome, {name}') is worse than none.\n\nTest every personalization against the baseline to prove incrementality.\n\nAction: choose one page and define 3 segment variants with a test plan." },
      { title: "Measuring and scaling personalization", d: 32, c: "Measure lift, not activity: personalized variant vs control conversion by segment, and incremental revenue per personalized touch.\n\nScale what proves out: the segments, moments and levers that moved the needle earn expansion; the ones that didn't get cut.\n\nMature personalization is a compounding experimentation program.\n\nAction: define the lift metric and rollout plan for your first three personalizations." },
    ],
  },
  {
    title: "HubSpot CRM Quickstart",
    headline: "Set up HubSpot properly: contacts, custom properties, pipelines and automation.",
    level: "Beginner",
    category: "Automation",
    skill: "CRM & HubSpot",
    description:
      "Most HubSpot setups are built wrong — duplicate records, missing properties, tangled workflows. This quickstart walks a clean, battle-tested HubSpot configuration for real marketing teams.",
    lessons: [
      { title: "Planning your HubSpot org", d: 20, c: "Before connection, plan the system: which contacts enter, what properties you actually need, and how records should route.\n\nToo many custom properties become data debt. Define the minimum viable property set.\n\nAction: list your required contact properties and their allowed values on one page." },
      { title: "Contacts, companies and dedup", d: 10, c: "HubSpot treats contacts, companies and deals as linked objects. Plan the hierarchy: person → company → deals.\n\nTurn on deduplication rules before import, standardize naming, and map imported data to your planned properties.\n\nClean import beats costly cleanup.\n\nAction: map your data fields to a dedup and import plan." },
      { title: "Pipelines and stages", d: 11, c: "Build pipeline(s) to match your sales process, with stage criteria documented. Keep stages minimal and meaningful.\n\nConnect lifecycle stage (sync property) so marketing reporting and sales funnels agree on definitions.\n\nAction: define 4-6 deal stages with one exit criterion each." },
      { title: "Scoring and workflow hygiene", d: 16, c: "Get lead scoring flowing: enroll scoring properties, tune weights against real wins, and build workflows that act on score thresholds (notify sales, pause nurture).\n\nKeep workflow names and owners documented — unowned automation rots.\n\nAction: configure 3 workflows: new-contact response, score-triggered alert, unsubscribe management." },
      { title: "Reporting basics", d: 14, c: "Turn the configured system into a reporting view: pipeline by source, conversion by stage, and top lead sources.\n\nAction: build a weekly HubSpot pipeline report using the views you configured." },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Auto-generated courses for skills with no course yet               */
/* ------------------------------------------------------------------ */

const generated: CourseSeed[] = [
  {
    title: "AI Workflow Automation",
    headline: "Design multi-step workflows that move leads, content and reporting on their own.",
    level: "Beginner",
    category: "AI & Emerging",
    skill: "AI Workflow Automation",
    description:
      "Automation turns repetitive marketing steps into systems that run without babysitting. This course builds the map-first approach: inventorying what to automate, designing trigger-branch-action workflows, and operating them with the hygiene that keeps automation reliable.",
    lessons: [
      { title: "Workflows that run on their own", d: 10, c: "Automation turns repeatable steps into systems that execute without babysitting: a new lead gets scored, routed and nurtured while you sleep. The starting point is the map, not the tool. Inventory every repetitive task, then ask which ones have a predictable trigger and a measurable outcome.\n\nAction: list five repetitive marketing tasks and rank them by time saved times frequency." },
      { title: "Trigger, branch, act", d: 17, c: "Every solid workflow has three parts: a trigger that starts it, branches that route based on conditions, and actions that do the work. Loose triggers cause loops and double-sends, so define strictly what must be true before a workflow fires. Build the decision tree on paper first, then translate it into the platform.\n\nAction: draw a trigger-branch-action map for your lead handoff." },
      { title: "Scoring, routing and the audit", d: 23, c: "The highest-value automations are the quiet ones: lead scoring that routes hot leads to sales, and reporting that assembles itself every Monday. Automations rot when nobody owns them, so document owner, trigger and goal, and audit monthly. Cap repeats and log every run to prevent the infinite-loop failure.\n\nAction: schedule a monthly automation audit and name an owner per workflow." },
    ],
  },
  {
    title: "Agentic Marketing",
    headline: "Supervise AI agents that execute campaign steps end to end.",
    level: "Intermediate",
    category: "AI & Emerging",
    skill: "Agentic Marketing",
    description:
      "Agentic marketing means AI agents execute campaign steps end to end under human supervision: gather data, draft and place content, report results, then propose the next move. This course covers where agents earn their keep, the guardrails that keep them useful, and how to evaluate their reliability.",
    lessons: [
      { title: "What agentic marketing is", d: 48, c: "Agentic marketing means AI agents execute campaign steps end to end under human supervision: gather data, draft and place content, report results, then propose the next move. The difference from classic automation is autonomy over multi-step goals in response to live conditions. Your role shifts from operator to supervisor of an agent roster.\n\nAction: list three campaign steps that could be delegated to an agent behind a check-and-approve gate." },
      { title: "Supervision and guardrails", d: 59, c: "Agents are productive exactly as far as their guardrails are tight. Define scope, budget and brand constraints before delegating, and require every output to pass a human approval gate. Audit logs are non-negotiable: know what each agent did and with what instructions.\n\nAction: write a one-page agent brief with scope, constraints and the approval flow." },
      { title: "Evaluating agent output", d: 16, c: "Judge agents the way you judge hires: by outcomes over effort. Track quality, spend and error rates per agent, and keep a kill-switch for anything that drifts. Start with a small pilot scope, then widen autonomy only as reliability earns it.\n\nAction: define success metrics for one pilot agent and its review cadence." },
    ],
  },
  {
    title: "Performance Analysis",
    headline: "Turn channel numbers into budget decisions with a disciplined review loop.",
    level: "Beginner",
    category: "Analytics & Data",
    skill: "Performance Analysis",
    description:
      "Performance analysis is judgment applied to numbers: spotting the campaign doing quietly nothing, finding the channel eating budget, and catching the week that changed the trend. This course builds the fixed review loop, the root-cause discipline and the decision habit that separate analysts from attendees.",
    lessons: [
      { title: "Reading performance, not reports", d: 5, c: "Performance analysis is judgment applied to numbers: spotting the campaign quietly doing nothing, finding the channel eating budget, and catching the week that changed the trend. The discipline is a fixed review loop with a fixed agenda, not random dashboard peeking. Anchor every number to a target or a prior period, or it carries no signal.\n\nAction: define three KPIs and a weekly review time that always happens." },
      { title: "Variance and root cause", d: 13, c: "A metric moving up or down is a symptom, not a story. Ask which segment, channel, campaign and date changed before you conclude anything. Seasonality, audience change and auction shifts all masquerade as your own performance.\n\nAction: decompose your last metric movement into its channel and segment parts." },
      { title: "Acting on the analysis", d: 12, c: "Analysis earns its keep in the decision: pause the losing line, scale the winner, reallocate budget on evidence. Put every read into a recommendation with an expected impact and a re-measure date. Analysis without action is reporting; analysis with action is a growth discipline.\n\nAction: convert your last read into one budget decision with a re-check date." },
    ],
  },
  {
    title: "Market Research & Insights",
    headline: "Replace strategy guesses with evidence about what customers actually believe.",
    level: "Beginner",
    category: "Analytics & Data",
    skill: "Market Research & Insights",
    description:
      "Strategy built on intuition is a guess; research replaces the guess with evidence about what customers believe, want and experience. This course covers the small toolkit that matters: surveys, interviews and secondary data, plus the synthesis that turns findings into decisions.",
    lessons: [
      { title: "Research that grounds strategy", d: 32, c: "Strategy built on intuition is a guess; research replaces the guess with evidence about what customers believe, want and experience. The toolkit is small: surveys, interviews, and the secondary data your category already publishes. Triangulate two or more methods before you trust a finding.\n\nAction: write the three questions you most need answered and pick a method for each." },
      { title: "Interviews and surveys that yield truth", d: 22, c: "The best insight questions ask about behavior, not opinion: the last time you solved this, what did you do outperforms would you use X. Keep surveys short, avoid leading language, and let interviewees talk in their own words. The answers that contradict your assumptions are the gold.\n\nAction: draft a 10-question interview guide with one behavior question per section." },
      { title: "Turning findings into insight", d: 13, c: "Data becomes insight when it changes a decision you were about to make. Synthesize findings into themes, then state the implication for positioning, messaging or product. Present the evidence trail so the team can trust and reuse it.\n\nAction: write three findings and the one decision each changes." },
    ],
  },
  {
    title: "Programmatic Advertising",
    headline: "Automate media buying across display and video with DSPs, data and bidding.",
    level: "Beginner",
    category: "Paid Media",
    skill: "Programmatic Advertising",
    description:
      "Programmatic is automated media buying: DSPs, data signals and real-time bidding place display and video impressions at scale. This course covers how the auction works, the data that drives it, and the measurement discipline that keeps programmatic from becoming a black box.",
    lessons: [
      { title: "How the programmatic auction works", d: 14, c: "Programmatic buys impressions through an automated auction in milliseconds: your bid meets the publisher's inventory and the user's context. TruX (transparency, relevance and outcome) drives decisions via data signals rather than human negotiation. The advertiser wins by bidding on the right audience and the right message moment.\n\nAction: write the three data signals that define your target audience." },
      { title: "Data, audiences and bidding", d: 40, c: "Programmatic is only as smart as the data you feed it: first-party audiences, contextual signals and lookalikes. Decide the bidding strategy by the goal, CPM for reach, CPA for performance, and let the DSP optimize within reason. Frequency capping and viewability floors are non-negotiable hygiene.\n\nAction: set your target CPM and CPA guardrails before your first campaign." },
      { title: "Placement, creative and measurement", d: 11, c: "Tell the DSP where quality matters: brand-safe placements, premium video and inventory you control. Static display underperforms rich and video creative, so vary format and message. Measure against brand-lift or conversion depending on the campaign job, and read the log-level data when numbers surprise you.\n\nAction: define the format mix and the primary metric for your next programmatic test." },
    ],
  },
  {
    title: "Paid Video Advertising",
    headline: "Plan, cut and measure video media buys across YouTube, CTV and feeds.",
    level: "Intermediate",
    category: "Paid Media",
    skill: "Paid Video Advertising",
    description:
      "Paid video is where attention performs, from intent-rich YouTube search to brand-building connected TV. This course covers the placement strategy, the three-second hook and the measurement that keeps video media buys honest.",
    lessons: [
      { title: "Video as a media buy", d: 19, c: "Paid video is a media buy, not a content expense: YouTube, connected TV and in-feed social video take the brand to viewers in the mood to watch. The buy is video-first, so the creative brief, not the media plan, decides the outcome. Match placement to intent, YouTube search captures people looking, CTV and feeds build reach.\n\nAction: define one video ad objective and the placement that serves it." },
      { title: "Hooks and the first three seconds", d: 16, c: "Skippable formats are won or lost in three seconds: the hook must stop the thumb or the rest is wasted spend. Open with the outcome, the problem or the contradiction, and front-load the brand. Design visuals that carry the message with the sound off.\n\nAction: write three hooks and storyboard the visuals that carry each one." },
      { title: "Placement strategy and measuring", d: 14, c: "Different placements want different cuts: a six-second bump, a thirty-second story, a long-form CTV ad. Allocate creative by placement and measure by brand lift or conversion depending on the job. Review true-view performance and creative fatigue monthly.\n\nAction: map your creative cuts to placements with a metric per placement." },
    ],
  },
  {
    title: "Display & Retargeting",
    headline: "Convert warm audiences with stage-matched display and retargeting funnels.",
    level: "Beginner",
    category: "Paid Media",
    skill: "Display & Retargeting",
    description:
      "Retargeting converts the audience you already paid to acquire: visitors who left, carts that stalled, readers who never returned. This course covers audience hygiene, frequency discipline and the stage-matched creative that makes retargeting a compounding rather than an annoying channel.",
    lessons: [
      { title: "Why retargeting earns its budget", d: 19, c: "Retargeting converts the audience you already paid to acquire: visitors who left, cart holders who stalled, readers who never returned. Because they are warm, retargeting typically converts at a fraction of cold-ad costs when the message matches the stage. The asset is the audience list, so pixel hygiene and consent tagging decide its quality.\n\nAction: map your warm audiences by stage and the message each one deserves." },
      { title: "Audience and frequency discipline", d: 43, c: "The list decays fast: cap frequency, prune stale segments, and exclude people who already converted. Done well, retargeting is timely interruption; done badly, it follows people around and burns the brand. Build exclusions at campaign level and review membership windows by category.\n\nAction: set frequency caps and exclusion lists for each warm segment." },
      { title: "Creative matching the stage", d: 15, c: "The right creative depends on how far the visitor travelled: product benefits for casual browsers, social proof and offers for engaged explorers, objection resolution for pricing-page viewers. A single come back and buy banner across all lists is the classic under-performer. Write creative per segment with one message each.\n\nAction: draft three stage-matched creatives for one audience." },
    ],
  },
  {
    title: "Community Management",
    headline: "Run a community that retains members, deflects support and compounds word of mouth.",
    level: "Beginner",
    category: "Content & Social",
    skill: "Community Management",
    description:
      "A community is a channel you own that compounds: members answer each other, validate the product and extend reach organically. This course builds the strategy layer, the rhythms that keep people coming back, and the health metrics that prove a community's business value.",
    lessons: [
      { title: "Community as an owned channel", d: 42, c: "A community is a channel you own that compounds: members answer each other, validate the product and extend reach organically. It out-performs broadcast social for retention and word of mouth precisely because it is two-way. Community strategy starts with the member promise, the reason people stay.\n\nAction: write the one-line promise your community exists to keep." },
      { title: "Rhythms that keep people coming back", d: 16, c: "Communities live on rhythm: welcome touches for new members, a weekly ask-engage-post cadence, and rituals people look forward to. Moderation is a product feature, so set clear rules and resolve conflict early and warmly. Leaders seed conversation; members grow it.\n\nAction: design a weekly community rhythm and a new-member welcome flow." },
      { title: "Measuring community health", d: 15, c: "Health metrics beat vanity counts: weekly active depth, questions answered by members, sentiment, and community-driven referrals. Track value to the business, support deflection, retention and word of mouth, and report it in business language. An active community is a growth loop when it feeds referral and retention numbers.\n\nAction: pick three community health metrics and a monthly readout." },
    ],
  },
  {
    title: "Blogging & Long-form",
    headline: "Build authoritative long-form assets that rank, earn links and fund a month of content.",
    level: "Beginner",
    category: "Content & Social",
    skill: "Blogging & Long-form",
    description:
      "Long-form is the asset that compounds: one thorough, authoritative page earns search traffic, links and repurposables for years. This course covers topic selection, answer-first structure and the repurposing system that turns every pillar into a content engine.",
    lessons: [
      { title: "Long-form that still gets read", d: 28, c: "Long-form is the asset that compounds: one thorough, authoritative page earns search traffic, links and repurposables for years. The form works when the piece owns a question completely, not when it pads keywords. Treat every pillar post as a small product with brief, outline, draft and edit.\n\nAction: pick one question your buyers ask and decide the complete answer you will own." },
      { title: "Structure, depth and source-ability", d: 12, c: "Winning long-form is scannable at twenty thousand feet and trustworthy at a glance: clean headings, a direct answer early, named sources and exact numbers. Quotable specificity is what earns AI-search citations and human shares. Cut any paragraph that does not advance a point.\n\nAction: outline a pillar post with an answer-first heading and three source-able stats." },
      { title: "Repurposing the asset", d: 11, c: "A pillar post funds a month of content: slides, video scripts, social cutdowns, a newsletter, a podcast episode. Note the strongest moments while you write. Measure the pillar by organic sessions and links, not first-week traffic.\n\nAction: plan the repurposing echo before you publish the next pillar." },
    ],
  },
  {
    title: "Go-To-Market",
    headline: "Plan the full system that takes a product to revenue, launch and scale.",
    level: "Intermediate",
    category: "Strategy & Brand",
    skill: "Go-To-Market",
    description:
      "Go-to-market is the full system that takes a product to revenue: target definition, positioning, pricing, channels and lifecycle, coordinated rather than bolted on. This course covers the beachhead bet, the pricing and proof stack, and the launch that earns retention.",
    lessons: [
      { title: "GTM as a system, not a launch", d: 30, c: "Go-to-market is the full system that takes a product to revenue: target definition, positioning, pricing, channels, lifecycle and the launch itself. Engineering-minded teams choose each layer coherently rather than bolt promotion onto a finished product. The GTM plan is a set of bets you can track and revise.\n\nAction: write the five layers of your GTM plan as testable bets." },
      { title: "Sizing the market you can win", d: 11, c: "Start from the segment you can reach and serve well, not the total addressable fantasy. Define your beachhead, the narrowest audience where the product clears a real job, then size budget and channels against it. A provable beachhead beats a persuasive slideshow market.\n\nAction: write your beachhead segment and the evidence they are reachable." },
      { title: "Pricing, packaging and proof", d: 29, c: "Pricing and packaging are GTM instruments: tier boundaries steer adoption and revenue, and the proof stack decides trust. Present price with the value frame and a transparent structure that supports upsell. Onboarding, support and time-to-value must be wired before day one.\n\nAction: sketch your pricing ladder and the proof elements under each rung." },
    ],
  },
  {
    title: "Customer Experience",
    headline: "Map and improve every touchpoint that decides how customers feel and stay.",
    level: "Beginner",
    category: "Strategy & Brand",
    skill: "Customer Experience",
    description:
      "Customer experience is the marketing vendors can't buy: word of mouth, renewals and share of wallet all track how the end-to-end journey feels. This course covers journey mapping, the moments that matter, and the feedback loops that turn friction into loyalty.",
    lessons: [
      { title: "Experience as a marketing lever", d: 23, c: "Customer experience is the marketing vendors can't buy: word of mouth, renewals and share of wallet all track how the end-to-end journey feels. Map the full journey from first impression to renewal, marking every touchpoint and every friction. The gaps between what you promise and what you deliver are your highest-leverage opportunities.\n\nAction: draw your customer journey with five stages and note the friction in each." },
      { title: "Journey mapping and moments that matter", d: 12, c: "Focus CX effort on the moments that determine outcomes: onboarding, first value, billing, support and win-back. Map the emotional curve alongside the process curve to see where delight and abandonment happen. Each moment deserves a design, not an accident.\n\nAction: choose one critical moment and design its ideal experience." },
      { title: "Feedback loops and recovery", d: 11, c: "Closed-loop feedback, measure, triage, fix and tell the customer, compounds trust, while silence after a complaint destroys it. Survey at the right moments with the right question, and close the loop on every negative signal. Complaint recovery, done visibly, builds more loyalty than a smooth day ever did.\n\nAction: define your closed-loop process for the next negative signal." },
    ],
  },
  {
    title: "Storytelling & Brand Narrative",
    headline: "Craft the change story that makes your brand memorable and repeatable.",
    level: "Beginner",
    category: "Strategy & Brand",
    skill: "Storytelling & Brand Narrative",
    description:
      "Story is how people remember and repeat brands: a coherent narrative holds every asset together, with the customer as hero and the brand as guide. This course covers the narrative spine, the guide archetype, and the proof and repetition that make stories believable.",
    lessons: [
      { title: "Narrative as connective tissue", d: 13, c: "Story is how people remember and repeat brands: a coherent narrative holds every asset together and makes each one feel inevitable. The core is a change story, who was stuck in what situation and what happens when your brand shows up. Narrative is strategy made memorable, not decoration.\n\nAction: write your brand's change story in five sentences: before, catalyst, after." },
      { title: "The customer as hero", d: 13, c: "In the story your brand is the guide and the customer is the hero: you provide the method and the stakes are theirs. Position your brand as the trusted guide, experienced and on the hero's side, never the hero itself. Every campaign re-enacts the same narrative spine with fresh scenes.\n\nAction: reframe one campaign asset so the customer is the protagonist." },
      { title: "Plot, proof and repetition", d: 9, c: "A narrative without proof is a claim; pair the story with evidence beats, results, numbers and customer transformations, that make it believable. Repetition with variation is how narrative installs, so echo the spine across every surface. Cut campaigns that contradict the story, they dilute the brand.\n\nAction: audit your last three campaigns for one consistent narrative spine." },
    ],
  },
  {
    title: "UX for Marketers",
    headline: "Read usability and persuasion so your campaigns end in conversion, not confusion.",
    level: "Beginner",
    category: "Creative & Web",
    skill: "UX for Marketers",
    description:
      "Every campaign ends on a page, and a page that confuses quietly destroys spend. This course gives marketers the UX lens: intent, clarity and the path to action, plus the analysis habits that turn stall points into fixes.",
    lessons: [
      { title: "Why marketers must read UX", d: 22, c: "Every campaign ends on a page, and a page that confuses quietly destroys spend. Marketers who understand usability, mental models and persuasion build campaigns that land where attention becomes action. UX for marketers is about intent and clarity, not pixel perfection.\n\nAction: test your main landing page for the 5-second answers: what it is, for whom, what to do." },
      { title: "Persuasion and the path to action", d: 12, c: "Conversion depends on clarity of offer, a single primary call, and proof near every decision. Reduce the number of decisions you ask for, and remove any step that lets hesitation win. Match the page's promise to the channel it came from.\n\nAction: list every friction step between your traffic source and the goal." },
      { title: "Designing for the user's context", d: 37, c: "Speak to where the user is: mobile first, one hand, half attention. Front-load the answer, keep forms minimal, and respect that every extra field and second costs conversion. Use analytics and recordings to find where people stall, then fix structure before styling.\n\nAction: run a mobile audit on your top page and fix the top three stalls." },
    ],
  },
  {
    title: "Visual Design & Canva",
    headline: "Build a small visual system that makes every asset look like it belongs.",
    level: "Beginner",
    category: "Creative & Web",
    skill: "Visual Design & Canva",
    description:
      "Consistent visuals signal a professional brand before anyone reads a word. This course covers the small visual system, grid-and-hierarchy discipline for the scroll, and the template system that keeps weekly output fast and on-brand.",
    lessons: [
      { title: "Visual consistency as brand trust", d: 18, c: "Consistent visuals signal a professional brand before anyone reads a word: a small visual system, palette, type and templates, makes every asset look like it belongs. Canva teams get this for free with brand kits and shared templates. The discipline is restraint: one focal point per asset and generous whitespace.\n\nAction: create a brand kit with palette, fonts and two reusable templates." },
      { title: "Grids, hierarchy and the scroll stop", d: 17, c: "Great social visuals are legible in half a second: a strong hierarchy with the headline first, a single dominant element, and contrast that survives the tiny feed thumbnail. Use grids for alignment and rules for look-at-me moments, not everything. Hold to a three-color maximum so the message never fights the palette.\n\nAction: redesign one post so its hierarchy is readable as a thumbnail." },
      { title: "Turning templates into a system", d: 12, c: "Templates compound: one structure, endlessly refilled with new messages, keeps output consistent and fast. Design templates that slot content easily, with placeholders and locked brand colors, so weekly output doesn't drift. Audit your feed monthly for platform rhythm and visual repetition.\n\nAction: build a three-layout template system for your weekly cadence." },
    ],
  },
  {
    title: "Launch Marketing",
    headline: "Engineer launches backwards from the goal so the reveal lands on a warm audience.",
    level: "Beginner",
    category: "Creative & Web",
    skill: "Launch Marketing",
    description:
      "A launch is a sequence engineered backwards from the goal: audience research, offer design, content schedule and partner waves, then the announcement and push. This course covers the countdown, the demand-ignition mechanics, and the post-launch plan that turns spikes into recurring revenue.",
    lessons: [
      { title: "A launch is a sequence, not a day", d: 12, c: "The launch is engineered backwards from the goal: audience research, offer design, content schedule, partner waves, then announcement and push. Each phase earns the next, so the reveal lands on a warm audience, not a cold one. Start the plan at least six weeks out.\n\nAction: pick your next launch and write the six-week countdown." },
      { title: "Igniting demand with scarcity and proof", d: 10, c: "Launch energy comes from specific scarcity and social proof: beta results, waitlist numbers, early-adopter testimonials and a deadline that is real. Sequence announcements so each one adds evidence to the last. Whatever you offer, sell the outcome, not the feature list.\n\nAction: write the proof stack you can show on day one of your launch." },
      { title: "The post-launch push", d: 14, c: "The announcement is the middle, not the end: post-launch review, customer stories, content wave and optimization decide how much the spike converts into recurring revenue. Measure fall-off and fix the offer mechanics before the next cycle. Harvest launch learnings into your GTM playbook.\n\nAction: define your day-eight launch review agenda." },
    ],
  },
  {
    title: "Affiliate & Partnerships",
    headline: "Scale distribution by renting trust from audiences you don't own.",
    level: "Intermediate",
    category: "Creative & Web",
    skill: "Affiliate & Partnerships",
    description:
      "Partnerships scale distribution by renting trust: affiliates, influencers and strategic partners already hold audiences that cost you nothing to reach directly. This course covers the partner fueled by performance, the pitch that earns loyalty, and the program hygiene that keeps quality up.",
    lessons: [
      { title: "Distribution through other people's audiences", d: 30, c: "Partnerships scale distribution by renting trust: affiliates, influencers and strategic partners already hold audiences that cost you nothing to reach directly. The math is simple, pay only for performance you can measure, commission, CPL or rev-share. The asset is the partner network, built one good relationship at a time.\n\nAction: list ten potential partners and the audience each one reaches." },
      { title: "Recruiting and onboarding partners", d: 5, c: "The pitch is about what the partner gains: cleaner earnings, a better offer for their audience and genuine conversions. Provide complete creative, tracking links and a smooth join flow, then treat partners like channels, not vendors. Keep the payout promise fast and reliable to earn loyalty.\n\nAction: draft your partner pitch and an onboarding packet." },
      { title: "Managing performance and piracy", d: 7, c: "Run partners on aligned incentives, higher commission for proven quality, review the partner mix monthly, and cut dead weight. Guard the brand with terms for content quality, disclosure and exclusivity. Track managed and affiliate programs separately for clean reporting.\n\nAction: define your partner quality thresholds and review cadence." },
    ],
  },
  {
    title: "Presentation Design",
    headline: "Build decks that make decisions happen, one claim per slide.",
    level: "Beginner",
    category: "Creative & Web",
    skill: "Presentation Design",
    description:
      "Presentations are persuasion tools: every slide advances one argument that moves the reader toward a decision. This course covers the story arc, the slide-as-interface craft, and the data and delivery discipline that makes decks persuasive instead of decorative.",
    lessons: [
      { title: "Decks that make decisions happen", d: 11, c: "Presentations are persuasion tools: every slide should advance one argument that moves the reader toward a decision. The format is editorial, one big claim per slide with evidence, not a document projected on a screen. Structure first, the story arc, then design the visuals that prove each claim.\n\nAction: outline your next deck as a five-claim story arc before touching slides." },
      { title: "Slides as interface", d: 14, c: "The slide is a contact point: the headline states the takeaway, the visual carries proof, and the speaker adds story. Kill bullet walls, use one chart per slide with direct labels, and let the audience read in seconds. White space is a tool, not empty space.\n\nAction: rebuild your densest slide with one claim, one chart and generous space." },
      { title: "Data and delivery craft", d: 11, c: "Charts persuade when they are honest, labeled and sourced; number formatting alone signals rigor. Practice the pacing: slow on the claim, fast on the mechanics, firm on the recommendation. Every deck closes with the decision you want, stated explicitly.\n\nAction: add a closing decision slide to your next deck." },
    ],
  },
  {
    title: "PR & Communications",
    headline: "Earn media coverage and build reputation through story, data and relationships.",
    level: "Intermediate",
    category: "Creative & Web",
    skill: "PR & Communications",
    description:
      "PR converts your work into earned attention: journalists and influencers amplify what is genuine, newsworthy and useful. This course covers the story-angle discipline, the pitch that gets replies, and the measurement that proves PR's contribution to the business.",
    lessons: [
      { title: "Earned media as reputation", d: 31, c: "PR converts your work into earned attention: journalists and influencers amplify what is genuine, newsworthy and useful. The pitch is an offer, a data story or an expert take that serves the outlet's audience, not a press release fishing for coverage. Consistency compounds reputation the way SEO compounds rankings.\n\nAction: list three genuine story angles you could pitch this quarter." },
      { title: "Pitching that gets replies", d: 33, c: "A good pitch is short, specific and audience-first: the hook, why it matters to their readers, what is available and the deadline. Build a media list from niche-and-tier relevance, personalize each pitch, and follow up once. Offer spokespeople and data, the substance reporters actually use.\n\nAction: write one pitch under a hundred words and send it to a niche writer." },
      { title: "Measuring PR like marketing", d: 6, c: "Measure PR against reputation and business goals: share of voice, message pull-through, press referral traffic, and the mentions that appear in sales conversations. Tie earned media into lead attribution so its value is visible. Report PR with the same discipline as paid media.\n\nAction: define three PR metrics and a monthly press readout." },
    ],
  },
  {
    title: "Podcasting & Audio",
    headline: "Use audio to build authority, relationship and compounding distribution.",
    level: "Beginner",
    category: "Creative & Web",
    skill: "Podcasting & Audio",
    description:
      "Podcasts build some of the deepest attention in media: listeners commit an hour to your voice and archive it forever. This course covers the format and angle, the episode-as-asset system, and the distribution and measurement loop that makes audio a real marketing channel.",
    lessons: [
      { title: "Audio as the trust medium", d: 54, c: "Podcasts build the deepest attention in media: listeners commit an hour to your voice and archive it forever. Audio suits marketing when the goal is authority, relationship and reach into specific niches. The format is the show and topic, not the gear and editing.\n\nAction: define your podcast's audience, angle and the promise of one episode." },
      { title: "The episode as an asset system", d: 14, c: "Every episode is a repurposing asset: show notes for SEO, short clips for social, newsletter pull-quotes, and one educational point per episode. A reliable cadence and consistent audio quality retain listeners faster than polish chasing. Plan episode titles that promise a specific takeaway.\n\nAction: write your first five episode titles as outcome promises." },
      { title: "Distribution and measurement", d: 8, c: "Audio compounds through distribution: a podcast network, guesting on other shows, and clips that point back to the full episode. Measure downloads by episode, listener retention and the leads that cite the show. Hold a quarterly content strategy meeting for the show like any other channel.\n\nAction: define your distribution loop and the three metrics you report." },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Seed                                                               */
/* ------------------------------------------------------------------ */

async function main() {
  console.log("Seeding SkillMap...");

  // Accounts
  const adminPassword = await bcrypt.hash("Admin@123", 12);
  const studentPassword = await bcrypt.hash("Student@123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@skillmap.io" },
    update: {},
    create: {
      email: "admin@skillmap.io",
      name: "Admin",
      role: "ADMIN",
      avatarColor: "#7c5cff",
      passwordHash: adminPassword,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@skillmap.io" },
    update: {},
    create: {
      email: "student@skillmap.io",
      name: "Student",
      role: "STUDENT",
      avatarColor: "#22d3ee",
      passwordHash: studentPassword,
    },
  });
  console.log("Users ready:", admin.email, "/", student.email);

  // Skills
  for (const s of skills) {
    await prisma.skill.upsert({
      where: { slug: slugify(s.name) },
      update: {
        demandScore: s.demandScore,
        category: s.category,
        color: s.color,
        description: s.description,
      },
      create: {
        name: s.name,
        slug: slugify(s.name),
        category: s.category,
        demandScore: s.demandScore,
        color: s.color,
        description: s.description,
      },
    });
  }
  console.log(`Skills ready: ${skills.length}`);

  // Courses + lessons
  async function createCourseAndLessons(c: CourseSeed, onlyIfEmpty = false) {
    const skill = await prisma.skill.findUnique({
      where: { slug: slugify(c.skill) },
      include: { _count: { select: { courses: true } } },
    });
    if (!skill) {
      console.warn(`  ! missing skill for course ${c.title}`);
      return null;
    }
    if (onlyIfEmpty && skill._count.courses > 0) return null;

    const slug = slugify(c.title);
    // Course length is the sum of its lessons, so the hero figure and the
    // curriculum subtotal can never disagree.
    const durationMin = c.lessons.reduce((t, l) => t + l.d, 0);
    const imageUrl = COURSE_IMAGES[slug] ?? null;

    // Secondary skills the course also teaches, so a skill is not limited to
    // the single course it happens to be filed under.
    const coveredNames = COURSE_COVERS[slug] ?? [];
    const covered = await prisma.skill.findMany({
      where: { slug: { in: coveredNames.map(slugify) } },
      select: { id: true },
    });
    if (coveredNames.length !== covered.length) {
      const found = new Set(covered.map((c) => c.id));
      console.warn(
        `  ! ${slug}: ${coveredNames.length - found.size} covered skill(s) did not resolve`,
      );
    }

    const course = await prisma.course.upsert({
      where: { slug },
      update: {
        durationMin,
        imageUrl,
        coveredSkills: { set: covered.map((c) => ({ id: c.id })) },
      },
      create: {
        title: c.title,
        slug,
        headline: c.headline,
        description: c.description,
        level: c.level,
        durationMin,
        imageUrl,
        category: c.category,
        skillId: skill.id,
        coveredSkills: { connect: covered.map((c) => ({ id: c.id })) },
      },
    });

    let lessonCount = 0;
    for (let i = 0; i < c.lessons.length; i++) {
      const l = c.lessons[i];
      // Every lesson has an explicit, audited entry — see VIDEO_AUDIT.md.
      const videoUrl = LESSON_VIDEOS[`${slug}|${i + 1}`] ?? null;
      await prisma.lesson.upsert({
        where: { courseId_order: { courseId: course.id, order: i + 1 } },
        // Lesson length tracks its video, so the stated duration and the
        // actual video length cannot drift apart.
        update: { videoUrl, durationMin: l.d, title: l.title, content: l.c },
        create: {
          courseId: course.id,
          title: l.title,
          durationMin: l.d,
          content: l.c,
          videoUrl,
          order: i + 1,
        },
      });
      lessonCount++;
    }
    return { course, lessonCount };
  }

  let courseCount = 0;
  let lessonCount = 0;
  for (const c of courses) {
    const created = await createCourseAndLessons(c);
    if (!created) continue;
    courseCount++;
    lessonCount += created.lessonCount;
    // give the admin a small batch of enrollments for realistic demo stats
    if (courseCount <= 3) {
      await prisma.enrollment.upsert({
        where: { userId_courseId: { userId: admin.id, courseId: created.course.id } },
        update: {},
        create: { userId: admin.id, courseId: created.course.id, progress: 100 },
      });
    }
  }
  console.log(`Courses ready: ${courseCount}, lessons: ${lessonCount}`);

  // Generated courses: keep any skill that has no course from sitting empty,
  // and always re-verify lessons (idempotent upserts backfill videos).
  let filledCount = 0;
  let filledLessons = 0;
  for (const c of generated) {
    const created = await createCourseAndLessons(c);
    if (!created) continue;
    filledCount++;
    filledLessons += created.lessonCount;
  }
  if (filledCount > 0) {
    console.log(`Generated courses ready: ${filledCount}, lessons: ${filledLessons}`);
  }

  // Seed a couple of reviews for popularity signals
  const seeded = await prisma.course.findMany({ take: 6 });
  for (let i = 0; i < seeded.length; i++) {
    await prisma.review.upsert({
      where: {
        userId_courseId: { userId: student.id, courseId: seeded[i].id },
      },
      update: {},
      create: {
        userId: student.id,
        courseId: seeded[i].id,
        rating: i === 1 ? 4 : 5,
        comment:
          i === 1
            ? "Solid content. The action items at the end of each lesson made it stick."
            : "Exactly the practical, no-fluff course I needed. Would recommend.",
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());