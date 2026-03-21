// ─────────────────────────────────────────────────────────────────────────────
// lib/auditPrompt.ts  — Ngige Growth Audit Framework v6.1
// Updated: March 2026
// Changes from v6:
//   - Auto-detects B2B agencies and switches to agency-specific framework
//   - SWOT analysis added to ALL audits (product and agency)
//   - Social data caveat — numbers flagged as "verify live" always
//   - Competitor intelligence deepened — find direct competitors not category giants
//   - Portfolio detection — check for dedicated case study pages before flagging modal
//   - Tech capabilities must be explicitly audited from full site navigation
//   - Agency dimensions replace consumer dimensions when agency detected
// ─────────────────────────────────────────────────────────────────────────────

import { IntelligenceContext, PageSpeedData } from './auditTypes';

interface PromptInput {
  url:          string;
  focus:        string;
  intelligence: IntelligenceContext;
  pageSpeed?:   PageSpeedData | null;
}

// ── Agency detection ──────────────────────────────────────────────────────────

const AGENCY_SIGNALS = [
  'advertising agency', 'marketing agency', 'creative agency', 'integrated agency',
  'communications agency', 'media agency', 'pr agency', 'digital agency',
  'brand agency', 'production house', 'content agency', 'design agency',
  'we are an agency', 'our agency', 'client work', 'campaign for', 'we created for',
];

export function isAgency(intelligence: IntelligenceContext): boolean {
  const combined = (
    intelligence.siteOverview + intelligence.socialProfiles + intelligence.competitors
  ).toLowerCase();
  return AGENCY_SIGNALS.some(s => combined.includes(s));
}

// ── PageSpeed section ─────────────────────────────────────────────────────────

function buildPageSpeedSection(ps: PageSpeedData): string {
  return `

REAL PAGESPEED DATA — use these exact numbers in the technical dimension:
Performance: ${ps.performance ?? 'N/A'}/100 | SEO: ${ps.seo ?? 'N/A'}/100 | Accessibility: ${ps.accessibility ?? 'N/A'}/100 | Best Practices: ${ps.bestPractices ?? 'N/A'}/100
LCP: ${ps.lcp ? (ps.lcp/1000).toFixed(1)+'s' : 'N/A'} | FCP: ${ps.fcp ? (ps.fcp/1000).toFixed(1)+'s' : 'N/A'} | TTFB: ${ps.ttfb ? (ps.ttfb/1000).toFixed(1)+'s' : 'N/A'} | CLS: ${ps.cls ?? 'N/A'}
Core Web Vitals: ${ps.assessment ?? 'unknown'}
Top opportunities: ${ps.opportunities?.map(o => `${o.title} (saves ${(o.savings/1000).toFixed(1)}s)`).join(', ') || 'none'}`;
}

// ── Main entry point ──────────────────────────────────────────────────────────

export function buildAuditPrompt({ url, focus, intelligence, pageSpeed }: PromptInput): string {
  const ps        = pageSpeed ? buildPageSpeedSection(pageSpeed) : '';
  const agencyMode = isAgency(intelligence);
  return agencyMode
    ? buildAgencyPrompt({ url, focus, intelligence, ps })
    : buildProductPrompt({ url, focus, intelligence, ps });
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT / STARTUP / CONSUMER BRAND PROMPT  (v6 original, with SWOT added)
// ─────────────────────────────────────────────────────────────────────────────

function buildProductPrompt({ url, focus, intelligence, ps }: any): string {
  return `You are Patrick Ngige — a senior technical growth marketer based in Nairobi, Kenya. You specialise in full-funnel growth audits for African and MEA digital businesses. You are direct, specific, and always ground recommendations in commercial impact. You never give generic advice.

Audit URL: ${url}
Focus: ${focus}
${ps}

INTELLIGENCE GATHERED:
Site: ${intelligence.siteOverview}
Social: ${intelligence.socialProfiles}
Paid ads: ${intelligence.paidAds}
App store: ${intelligence.appStore}
Reputation: ${intelligence.reputation}
Competitors + benchmarks: ${intelligence.competitors}

CRITICAL INSTRUCTIONS — READ BEFORE GENERATING:

1. SOCIAL DATA ACCURACY:
   Social follower counts and post counts from search results are often weeks or months out of date.
   ALWAYS add this caveat when reporting social numbers: "(verify live — scraped data may be stale)"
   If you find conflicting numbers from different sources, use the most recent and note the discrepancy.
   Never present a social follower count as a definitive fact without this caveat.

2. COMPETITOR INTELLIGENCE:
   Do NOT default to the most obvious category leader as the primary competitive threat.
   Find the DIRECT competitors — companies of similar size, similar market, similar positioning
   that a prospect would actually compare this company to in a shortlist.
   For EACH competitor: what do they do DIFFERENTLY that makes them stand out?
   What is their specific competitive moat or differentiator? Generic "they are bigger" is useless.

3. PORTFOLIO / WORK SECTION:
   Before reporting that portfolio work opens only as modal overlays, explicitly check for:
   - A dedicated /our-work, /work, /portfolio, or /case-studies page
   - Individual case study URLs (e.g. /work/client-name, /case-studies/campaign)
   Report accurately. Only flag modal-only if no dedicated URLs exist for case studies.

4. TECH / DIGITAL DEPARTMENT:
   Explicitly check whether a technology, web development, or digital department exists.
   Review the full navigation, services pages, any sub-brands. If tech services exist,
   audit them as a separate capability: which clients, what quality, how prominently featured.

5. SWOT ANALYSIS:
   Every audit must include a comprehensive SWOT with named, specific entries — not generic ones.
   Strengths and weaknesses must cite evidence. Opportunities must include timing context.
   Threats must name the specific competitor or market force creating the threat.

Return ONLY valid JSON (no markdown, no explanation). Scores are 0-100 integers.
Set score to null for dimensions that genuinely don't apply (e.g. appStore for no-app company).

{
  "siteName": "Brand",
  "overallScore": 72,
  "overallLabel": "Performing — Room to Grow",
  "tagline": "One-sentence growth health summary",
  "intelligenceBanner": "2-3 sentences of live market context — competitor news, market data, recent events from intelligence gathered",
  "execSummary": "3 sentences: current state, biggest strength, biggest gap. Cite specific data.",
  "patricksPOV": "2-3 sentences first person. What surprised you. Single biggest lever. One contrarian observation.",
  "swot": {
    "strengths": [
      "Named strength with specific evidence",
      "Named strength with specific evidence",
      "Named strength with specific evidence"
    ],
    "weaknesses": [
      "Named weakness with specific evidence",
      "Named weakness with specific evidence",
      "Named weakness with specific evidence"
    ],
    "opportunities": [
      "Named opportunity with market context and timing",
      "Named opportunity with context",
      "Named opportunity with context"
    ],
    "threats": [
      "Named threat with specific competitor or market force",
      "Named threat with context",
      "Named threat with context"
    ]
  },
  "competitorIntelligence": [
    {
      "name": "Direct competitor name",
      "url": "https://...",
      "whatTheyDoBetter": "Specific differentiator with evidence",
      "whatTheyDoWorse": "Specific weakness vs this company",
      "recentMoves": "What they have done recently",
      "threat": "high|medium|low"
    }
  ],
  "dimensions": {
    "social":      {"score":60,"findings":[{"title":"...","detail":"...","severity":"high","impact":"...","recommendation":"..."}]},
    "paidMedia":   {"score":45,"findings":[{"title":"...","detail":"...","severity":"high","impact":"...","recommendation":"..."}]},
    "acquisition": {"score":65,"findings":[{"title":"...","detail":"...","severity":"high","impact":"...","recommendation":"..."}]},
    "messaging":   {"score":70,"findings":[{"title":"...","detail":"...","severity":"medium","impact":"...","recommendation":"..."}]},
    "conversion":  {"score":58,"findings":[{"title":"...","detail":"...","severity":"high","impact":"...","recommendation":"..."}]},
    "appStore":    {"score":55,"findings":[{"title":"...","detail":"...","severity":"medium","impact":"...","recommendation":"..."}]},
    "activation":  {"score":50,"findings":[{"title":"...","detail":"...","severity":"high","impact":"...","recommendation":"..."}]},
    "reputation":  {"score":68,"findings":[{"title":"...","detail":"...","severity":"medium","impact":"...","recommendation":"..."}]},
    "retention":   {"score":75,"findings":[{"title":"...","detail":"...","severity":"low","impact":"...","recommendation":"..."}]},
    "tracking":    {"score":52,"findings":[{"title":"...","detail":"...","severity":"high","impact":"...","recommendation":"..."}]},
    "technical":   {"score":70,"findings":[{"title":"...","detail":"...","severity":"medium","impact":"...","recommendation":"..."}]},
    "growthLoop":  {"score":62,"findings":[{"title":"...","detail":"...","severity":"medium","impact":"...","recommendation":"..."}]}
  },
  "growthLoops": [
    {
      "name": "Loop name",
      "nodes": [
        {"label":"Step 1","health":"strong"},
        {"label":"Step 2","health":"weak"},
        {"label":"Step 3","health":"broken"}
      ],
      "breakPoint": "Where and why the loop breaks",
      "recommendation": "Specific fix"
    }
  ],
  "magicMoments": [
    {
      "userType": "User type",
      "moment": "The specific magic moment",
      "currentPath": "Steps/friction before reaching it today",
      "friction": "The specific blocker",
      "recommendation": "Exact change to engineer the path"
    }
  ],
  "roadmap": {
    "week1":    [{"title":"Action","detail":"Specific steps — no code required","effort":"low"}],
    "month1":   [{"title":"Action","detail":"Specific build and result","effort":"medium"}],
    "quarter1": [{"title":"Action","detail":"Strategic initiative and scale","effort":"high"}]
  },
  "furtherReading": [
    {"title":"Resource title","why":"Why relevant to this company's specific gaps","url":"https://..."}
  ],
  "stitchPrompts": [
    {
      "target": "Page name",
      "description": "What needs redesigning and why",
      "prompt": "Full Stitch prompt — brand colours, problem, solution. Mobile-first."
    }
  ]
}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// B2B AGENCY / PROFESSIONAL SERVICES PROMPT
// Replaces consumer dimensions with agency new-business dimensions
// ─────────────────────────────────────────────────────────────────────────────

function buildAgencyPrompt({ url, focus, intelligence, ps }: any): string {
  return `You are Patrick Ngige — a senior technical growth marketer in Nairobi, Kenya. You are auditing a B2B marketing, advertising, creative, or communications agency.

AGENCY AUDIT FRAMEWORK — NOT a consumer product audit:
- Primary growth metric: NEW BUSINESS PIPELINE — qualified inbound leads from ideal clients
- Secondary metric: CLIENT RETENTION — long-term retainer and account expansion
- Social media = B2B new business channel, not consumer engagement
- Portfolio / case studies = primary conversion content, not hero CTAs
- The magic moment = a prospective CMO deciding "we want this agency specifically"
- Competitors = agencies a client would actually shortlist alongside this one, NOT category giants

Audit URL: ${url}
Focus: ${focus}
${ps}

INTELLIGENCE GATHERED:
Site: ${intelligence.siteOverview}
Social: ${intelligence.socialProfiles}
Paid ads: ${intelligence.paidAds}
App store: ${intelligence.appStore}
Reputation: ${intelligence.reputation}
Competitors + benchmarks: ${intelligence.competitors}

CRITICAL INSTRUCTIONS — READ ALL BEFORE GENERATING:

1. SOCIAL DATA ACCURACY:
   Social follower counts from search results are often weeks or months stale.
   ALWAYS note: "(verify live — scraped data may be stale. Screenshot or live check recommended)"
   Example: "2,569 Instagram followers (verify live — scraped data may be stale)"
   NEVER present a follower count as a confirmed fact.

2. COMPETITOR INTELLIGENCE — MOST IMPORTANT INSTRUCTION:
   Do NOT list WPP Scangroup or Ogilvy as the primary threat unless genuinely a direct competitor.
   Find the REAL direct competitors — agencies of SIMILAR SIZE, similar client tier, similar market.
   For example, for a 30-year Kenyan independent agency:
   - The Partnership Africa (founded Sept 2024, Publicis-affiliated, ex-WPP founders, winning same clients)
   - Right-Here Kenya (integrated agency, Golazo-affiliated)
   - Dentsu Creative Kenya
   - Smaller boutiques winning the same mid-market clients
   For EACH direct competitor you must answer:
   a) What do they do DIFFERENTLY that makes them stand out vs this agency?
   b) What specific recent moves have they made (new clients, partnerships, campaigns)?
   c) What is their competitive moat — why would a client pick them?
   d) Where are they weak compared to this agency?
   Generic competitor summaries are NOT acceptable.

3. PORTFOLIO / CASE STUDIES:
   BEFORE reporting portfolio issues, explicitly verify:
   - Does a /our-work or /work page exist with individual project links?
   - Do individual case study pages exist at unique URLs? (e.g. /our-work/safaricom)
   - Are there separate campaign landing pages?
   Report accurately. If dedicated case study URLs exist, this is a STRENGTH, not a gap.
   Only flag modal-only portfolio if truly no dedicated pages exist.

4. TECH / DIGITAL DEPARTMENT:
   Explicitly audit technology and web development services if they exist.
   Look at full navigation, sub-brands (e.g. a "digital" or "tech" sub-brand).
   If found, list: named client websites built, quality assessment, how prominently featured,
   whether it's a revenue differentiator vs competitors.
   This is often a hidden strength that gets missed in agency audits.

5. SWOT ANALYSIS — MUST BE COMPREHENSIVE:
   Strengths: Named, specific, with evidence. Not generic.
   Weaknesses: Named, specific, with evidence.
   Opportunities: Named, with timing context. Why is this opportunity available NOW?
   Threats: Named competitor or market force. Why are they threatening THIS agency specifically NOW?
   The SWOT must tell a story about this agency's competitive position that a new business
   director could use in a strategy meeting tomorrow.

Return ONLY valid JSON (no markdown, no explanation):

{
  "siteName": "Agency Name",
  "agencyType": "Integrated / Creative / Digital / PR / Media",
  "overallScore": 70,
  "overallLabel": "Strong work, quiet brand",
  "tagline": "One-sentence positioning health summary",
  "intelligenceBanner": "2-3 sentences live market context — specific competitor moves, market opportunity, industry news from intelligence",
  "execSummary": "3 sentences: current positioning, biggest strength, biggest new business gap. Cite specific evidence.",
  "patricksPOV": "2-3 sentences first person. What surprised me. Single biggest new business lever. One contrarian observation.",
  "swot": {
    "strengths": [
      "Specific named strength with evidence (e.g. 'FCB/IPG network affiliation — Kenya's only FCB agency, access to 8,000 creatives in 120 countries')",
      "Specific named strength",
      "Specific named strength",
      "Specific named strength"
    ],
    "weaknesses": [
      "Specific named weakness with evidence (e.g. 'Instagram: 2,569 followers (verify live) — for agency running Safaricom and Unilever social campaigns')",
      "Specific named weakness",
      "Specific named weakness"
    ],
    "opportunities": [
      "Named opportunity with timing (e.g. 'WPP Scangroup leadership instability — new CEO appointment after client exits creates switching window for mid-market clients in 2026')",
      "Named opportunity",
      "Named opportunity"
    ],
    "threats": [
      "Named threat with specific competitor (e.g. 'The Partnership Africa — founded Sept 2024 by ex-WPP veterans, Publicis-affiliated, won major local and international brands in first 12 months, directly targeting Creative Edge's client tier')",
      "Named threat",
      "Named threat"
    ]
  },
  "competitorIntelligence": [
    {
      "name": "Direct competitor — same client tier, same geography, same service mix",
      "url": "https://...",
      "networkAffiliation": "Publicis / Dentsu / Independent / etc",
      "whatTheyDoBetter": "Specific differentiator with evidence — their moat",
      "whatTheyDoWorse": "Specific weakness vs this agency",
      "recentMoves": "Specific recent move — new client, partnership, campaign, hire, award",
      "threat": "high|medium|low",
      "threatReason": "Why specifically they threaten this agency right now"
    }
  ],
  "dimensions": {
    "new_business_funnel":   {"score":45,"findings":[{"title":"...","detail":"...","severity":"high","impact":"...","recommendation":"..."}]},
    "portfolio_strength":    {"score":72,"findings":[{"title":"...","detail":"...","severity":"medium","impact":"...","recommendation":"..."}]},
    "thought_leadership":    {"score":35,"findings":[{"title":"...","detail":"...","severity":"high","impact":"...","recommendation":"..."}]},
    "tech_capabilities":     {"score":65,"findings":[{"title":"...","detail":"...","severity":"medium","impact":"...","recommendation":"..."}]},
    "brand_positioning":     {"score":62,"findings":[{"title":"...","detail":"...","severity":"high","impact":"...","recommendation":"..."}]},
    "social_presence":       {"score":28,"findings":[{"title":"...","detail":"...","severity":"high","impact":"...","recommendation":"..."}]},
    "reputation_awards":     {"score":78,"findings":[{"title":"...","detail":"...","severity":"low","impact":"...","recommendation":"..."}]},
    "client_retention":      {"score":70,"findings":[{"title":"...","detail":"...","severity":"low","impact":"...","recommendation":"..."}]},
    "paid_acquisition":      {"score":25,"findings":[{"title":"...","detail":"...","severity":"high","impact":"...","recommendation":"..."}]},
    "seo_visibility":        {"score":38,"findings":[{"title":"...","detail":"...","severity":"high","impact":"...","recommendation":"..."}]},
    "technical_performance": {"score":60,"findings":[{"title":"...","detail":"...","severity":"medium","impact":"...","recommendation":"..."}]},
    "tracking":              {"score":55,"findings":[{"title":"...","detail":"...","severity":"medium","impact":"...","recommendation":"..."}]}
  },
  "growthLoops": [
    {
      "name": "Agency-specific loop (e.g. Award-to-referral, Case study flywheel, Tech client expansion)",
      "nodes": [{"label":"Step","health":"strong|weak|broken|absent"}],
      "breakPoint": "Where and why the loop breaks",
      "recommendation": "Specific fix for this agency"
    }
  ],
  "magicMoments": [
    {
      "userType": "e.g. CMO at enterprise brand / Marketing Manager at growing SME",
      "moment": "The moment they transition from 'considering several agencies' to 'we want them specifically'",
      "currentPath": "What the current evaluation path looks like — how they find the agency, what they see",
      "friction": "What prevents the magic moment from happening",
      "recommendation": "Exact intervention to engineer this moment"
    }
  ],
  "roadmap": {
    "week1":    [{"title":"Action","detail":"No budget, no code. CEO post, quick credential update, immediate win.","effort":"low"}],
    "month1":   [{"title":"Action","detail":"Build or fix — specific deliverable and expected new business outcome.","effort":"medium"}],
    "quarter1": [{"title":"Action","detail":"Strategic — SEO content hub, LinkedIn campaign, tech showcase, Africanvas page.","effort":"high"}]
  },
  "furtherReading": [
    {"title":"Resource title","why":"Why relevant to this agency's specific gaps","url":"https://..."}
  ],
  "stitchPrompts": [
    {
      "target": "Page (homepage, case study template, brief form, tech services)",
      "description": "What needs redesigning for new business conversion",
      "prompt": "Full Stitch prompt — premium agency aesthetic, brand colours, specific problem and solution. Mobile-first."
    }
  ]
}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// INTELLIGENCE PROMPTS — updated with better instructions
// ─────────────────────────────────────────────────────────────────────────────

export const intelligencePrompts = {

  siteOverview: (url: string) =>
    `Browse ${url} and ALL key subpages (check /services, /about, /work, /our-work, /team, /portfolio, /case-studies, and any sub-brand URLs). Extract: main headline, value proposition, all CTAs and their placement, target audience signals, pricing if visible, trust signals (testimonials, client logos, awards), full navigation structure, blog or content section, any technology or web development department or sub-brand, awards or certifications, network affiliations (e.g. global agency network). List every sub-brand you find. Be thorough.`,

  socialProfiles: (url: string, brand: string) =>
    `Find all active social media profiles for ${brand} (${url}). For each platform (Instagram, LinkedIn, Twitter/X, Facebook, YouTube, TikTok): URL, follower count, post count, most recent post date, posting frequency, content quality and mix, engagement level, bio clarity. IMPORTANT: For every follower count you find, note the approximate date of that data — search results are often stale by weeks or months. Flag clearly if the data appears to be from more than 2 weeks ago.`,

  paidAds: (brand: string) =>
    `Search the Meta Ads Library for "${brand}": https://www.facebook.com/ads/library/?q=${encodeURIComponent(brand)}. Also search Google Ads Transparency for ${brand}. Report: are they running ads? How many active ads? What formats, messages, offers? How long running? For B2B agencies specifically: are they running new business acquisition ads targeting CMOs or marketing directors?`,

  appStore: (brand: string) =>
    `Search for any ${brand} app on App Store and Google Play. If no app exists, state clearly: "No mobile app found for ${brand}." This is a valid finding. If an app exists: rating, review count, last update, install count (Play Store), description quality, and what do the most recent reviews reveal about user experience?`,

  reputation: (brand: string) =>
    `Search "${brand} reviews", "${brand} Kenya reputation", "${brand} clients", "${brand} awards", "${brand} Cannes Lions", "${brand} APA awards", "${brand} case studies results". For agencies: also search Clutch.co for a profile, Ads of the World for published work, industry directories. Report: overall industry reputation, named award wins with years, press mentions, any client testimonials visible online, any controversies or negative coverage.`,

  competitors: (url: string, brand: string) =>
    `Find the 3 most relevant DIRECT competitors to ${brand} (${url}). Direct means: similar size, similar market position, similar geography, similar client tier — companies a client would actually shortlist ALONGSIDE ${brand}. Do NOT just name the largest companies in the category. Research each competitor thoroughly: (1) What do they do DIFFERENTLY that makes them stand out — their specific competitive differentiator or moat? (2) What recent moves have they made in 2025–2026 (new partnerships, client wins, rebrands, technology)? (3) What is their weakness compared to ${brand}? Also: find the most current industry benchmarks for ${brand}'s sector (conversion rates, market size, growth rates, any 2025–2026 industry reports).`,
};