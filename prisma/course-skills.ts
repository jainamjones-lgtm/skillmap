/**
 * Secondary skills each course also teaches, keyed by course slug.
 *
 * A course is *filed under* one primary skill (`CourseSeed.skill`), but most
 * teach several. Without this map every skill shows exactly one course, which
 * makes the skill map look broken and hides genuinely relevant material from
 * learners. Only real overlaps are listed — a course appears against a skill
 * only if it actually teaches a meaningful part of it.
 *
 * Values are skill NAMES as declared in the `skills` array in seed.ts. The
 * primary skill is added automatically and must not be repeated here.
 */
export const COURSE_COVERS: Readonly<Record<string, readonly string[]>> = {
  // AI & Emerging
  "ai-marketing-101": ["Prompt Engineering", "AI Workflow Automation", "Marketing Strategy"],
  "prompt-engineering-for-marketers": ["AI Marketing", "Copywriting", "Content Marketing"],
  "ai-workflow-automation": ["AI Marketing", "Marketing Automation", "Marketing Operations & RevOps"],
  "agentic-marketing": ["AI Marketing", "AI Workflow Automation", "Privacy, Ethics & Governance", "Performance Analysis"],
  "generative-engine-optimization-geo-aeo": ["SEO", "AI Marketing", "Content Marketing"],

  // Analytics & Data
  "marketing-analytics-with-ga4": ["Performance Analysis", "Data Visualization", "Marketing Attribution"],
  "performance-analysis": ["Marketing Analytics (GA4)", "Data Visualization", "Marketing Finance & Budgeting"],
  "growth-data-storytelling": ["Performance Analysis", "Presentation Design", "Marketing Analytics (GA4)"],
  "conversion-rate-optimization": ["Personalization & CRO", "Landing Pages & Web Design", "UX for Marketers", "Performance Analysis"],
  "marketing-attribution-roi": ["Marketing Analytics (GA4)", "Performance Analysis", "Marketing Finance & Budgeting"],
  "market-research-insights": ["Brand Strategy", "Product Marketing", "Customer Experience"],
  "marketing-finance-budgeting": ["Marketing Strategy", "Performance Analysis", "Marketing Attribution"],
  "privacy-ethics-governance": ["Email Marketing", "Marketing Operations & RevOps", "AI Marketing", "CRM & HubSpot"],

  // Paid Media
  "performance-marketing-playbook": ["Google Ads / PPC", "Meta & Paid Social", "Marketing Attribution", "Marketing Finance & Budgeting"],
  "google-ads-ppc-search": ["Performance Marketing", "SEO", "Landing Pages & Web Design"],
  "meta-ads-paid-social": ["Performance Marketing", "Social Media Management", "Display & Retargeting"],
  "programmatic-advertising": ["Performance Marketing", "Display & Retargeting", "Privacy, Ethics & Governance"],
  "paid-video-advertising": ["Performance Marketing", "Video Content Creation", "Short-form Video"],
  "display-retargeting": ["Performance Marketing", "Programmatic Advertising", "Personalization & CRO"],
  "influencer-marketing-campaigns": ["Social Media Management", "Community Management", "Short-form Video", "Marketing Finance & Budgeting"],

  // Lifecycle & Automation
  "marketing-automation-systems": ["Email Marketing", "CRM & HubSpot", "Marketing Operations & RevOps", "Lifecycle & Retention"],
  "email-marketing-lifecycle": ["Marketing Automation", "Lifecycle & Retention", "Copywriting", "Privacy, Ethics & Governance"],
  "lead-generation-systems": ["Marketing Automation", "Landing Pages & Web Design", "Marketing Operations & RevOps", "Performance Marketing"],
  "crm-marketing-ops-with-hubspot": ["Marketing Automation", "Marketing Operations & RevOps", "Lead Generation"],
  "hubspot-crm-quickstart": ["Marketing Automation", "Lead Generation", "Marketing Operations & RevOps"],
  "lifecycle-retention-marketing": ["Email Marketing", "Customer Experience", "Personalization & CRO", "Marketing Finance & Budgeting"],
  "personalization-at-scale": ["Personalization & CRO", "Lifecycle & Retention", "UX for Marketers", "Privacy, Ethics & Governance"],
  "marketing-operations-revops": ["Marketing Automation", "CRM & HubSpot", "Data Visualization", "Campaign & Project Management"],

  // Content & Social
  "seo-fundamentals": ["Content Marketing", "Blogging & Long-form", "GEO / AEO"],
  "content-marketing-strategy": ["SEO", "Copywriting", "Blogging & Long-form", "Marketing Strategy"],
  "social-media-marketing-foundations": ["Short-form Video", "Community Management", "Content Marketing"],
  "short-form-video-marketing": ["Video Content Creation", "Social Media Management", "Storytelling & Brand Narrative"],
  "copywriting-that-converts": ["Content Marketing", "Landing Pages & Web Design", "Email Marketing", "Storytelling & Brand Narrative"],
  "video-content-creation-bootcamp": ["Short-form Video", "Storytelling & Brand Narrative", "Visual Design & Canva"],
  "community-management": ["Social Media Management", "Customer Experience", "Lifecycle & Retention"],
  "blogging-long-form": ["SEO", "Content Marketing", "Copywriting"],

  // Strategy & Brand
  "marketing-strategy-plans-that-win": ["Brand Strategy", "Market Research & Insights", "Marketing Finance & Budgeting", "Campaign & Project Management"],
  "growth-marketing-playbook": ["A/B Testing & Experimentation", "Personalization & CRO", "Performance Analysis", "Lifecycle & Retention"],
  "product-marketing-go-to-market": ["Go-To-Market", "Market Research & Insights", "Launch Marketing", "Brand Strategy"],
  "brand-strategy-for-marketers": ["Storytelling & Brand Narrative", "Market Research & Insights", "Marketing Strategy"],
  "go-to-market": ["Product Marketing", "Launch Marketing", "Marketing Strategy", "Campaign & Project Management"],
  "customer-experience": ["Lifecycle & Retention", "UX for Marketers", "Market Research & Insights"],
  "storytelling-brand-narrative": ["Brand Strategy", "Copywriting", "Content Marketing", "Presentation Design"],
  "campaign-project-management": ["Marketing Strategy", "Marketing Operations & RevOps", "Events & Field Marketing"],
  "shopper-channel-marketing": ["Marketing Finance & Budgeting", "Brand Strategy", "Marketing Strategy"],

  // Creative & Web
  "ux-for-marketers": ["Landing Pages & Web Design", "Personalization & CRO", "A/B Testing & Experimentation"],
  "landing-pages-that-convert": ["UX for Marketers", "Copywriting", "A/B Testing & Experimentation", "Personalization & CRO"],
  "visual-design-canva": ["Presentation Design", "Social Media Management", "Content Marketing"],
  "launch-marketing": ["Go-To-Market", "Product Marketing", "Campaign & Project Management", "PR & Communications"],
  "affiliate-partnerships": ["Performance Marketing", "Influencer Marketing", "Events & Field Marketing"],
  "presentation-design": ["Data Visualization", "Storytelling & Brand Narrative", "Visual Design & Canva"],
  "pr-communications": ["Brand Strategy", "Storytelling & Brand Narrative", "Events & Field Marketing"],
  "podcasting-audio": ["Content Marketing", "Storytelling & Brand Narrative", "Community Management"],
  "events-field-marketing": ["Campaign & Project Management", "Lead Generation", "Affiliate & Partnerships", "PR & Communications"],
};
