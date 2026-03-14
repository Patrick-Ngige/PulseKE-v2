import { IntelligenceContext, PageSpeedData } from './auditTypes';

interface PromptInput {
  url:          string;
  focus:        string;
  intelligence: IntelligenceContext;
  pageSpeed?:   PageSpeedData | null;
}

export function buildAuditPrompt({ url, focus, intelligence, pageSpeed }: PromptInput): string {
  const ps = pageSpeed ? `

REAL PAGESPEED DATA — use these exact numbers in the technical dimension:
Performance: ${pageSpeed.performance ?? 'N/A'}/100 | SEO: ${pageSpeed.seo ?? 'N/A'}/100 | Accessibility: ${pageSpeed.accessibility ?? 'N/A'}/100 | Best Practices: ${pageSpeed.bestPractices ?? 'N/A'}/100
LCP: ${pageSpeed.lcp ? (pageSpeed.lcp/1000).toFixed(1)+'s' : 'N/A'} | FCP: ${pageSpeed.fcp ? (pageSpeed.fcp/1000).toFixed(1)+'s' : 'N/A'} | TTFB: ${pageSpeed.ttfb ? (pageSpeed.ttfb/1000).toFixed(1)+'s' : 'N/A'} | CLS: ${pageSpeed.cls ?? 'N/A'}
Core Web Vitals: ${pageSpeed.assessment ?? 'unknown'}
Top opportunities: ${pageSpeed.opportunities?.map(o => `${o.title} (saves ${(o.savings/1000).toFixed(1)}s)`).join(', ') || 'none'}` : '';

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

Return ONLY valid JSON (no markdown, no explanation) matching this exact structure. Every finding must cite specific evidence. Scores are 0-100 integers.

{
  "siteName": "Brand",
  "overallScore": 72,
  "overallLabel": "Performing — Room to Grow",
  "tagline": "One-sentence growth health summary",
  "intelligenceBanner": "2-3 sentences of live market context — competitor news, recent launches, market data from intelligence gathered",
  "execSummary": "3 sentences: current state, biggest strength, biggest gap. Cite specifics.",
  "patricksPOV": "2-3 sentences first person as Patrick Ngige. What surprised you. Single biggest lever. One contrarian observation.",
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
        {"label":"Step 2","health":"strong"},
        {"label":"Step 3","health":"weak"},
        {"label":"Step 4","health":"broken"}
      ],
      "breakPoint": "Where and why the loop breaks",
      "recommendation": "Specific action to close or strengthen it"
    }
  ],
  "magicMoments": [
    {
      "userType": "Consumer",
      "moment": "The first time [specific action] happens",
      "currentPath": "Steps/friction before reaching it today",
      "friction": "The specific thing blocking users",
      "recommendation": "Exact change to engineer the path"
    }
  ],
  "roadmap": {
    "week1":    [{"title":"Action","detail":"Specific steps and expected result — no code required","effort":"low"}],
    "month1":   [{"title":"Action","detail":"Specific build and expected result","effort":"medium"}],
    "quarter1": [{"title":"Action","detail":"Strategic initiative and scale result","effort":"high"}]
  },
  "furtherReading": [
    {"title":"Resource","why":"Why specifically relevant to this company's gaps","url":"https://..."}
  ],
  "stitchPrompts": [
    {
      "target": "Homepage hero",
      "description": "What needs redesigning and why",
      "prompt": "Full Stitch prompt with brand colours (#hex), specific problem, recommended headline, CTAs, trust signals, layout. Mobile-first."
    },
    {
      "target": "Key product page",
      "description": "What needs redesigning and why",
      "prompt": "Full Stitch prompt..."
    },
    {
      "target": "Onboarding flow",
      "description": "What needs redesigning and why",
      "prompt": "Full Stitch prompt..."
    }
  ]
}`;
}

export const intelligencePrompts = {
  siteOverview: (url: string) =>
    `Browse ${url}. Extract: main headline, subheadline, value proposition, all CTAs and placement, target audience signals, pricing if visible, trust signals (testimonials, logos, user counts, credentials), navigation structure, blog/content section, technology signals. Be thorough and specific.`,

  socialProfiles: (url: string, brand: string) =>
    `Find all active social media profiles for ${brand} (${url}). For each platform (Instagram, LinkedIn, Twitter/X, TikTok, Facebook, YouTube): URL, follower count, posting frequency, content style, engagement quality, bio clarity, link destination. Be specific.`,

  paidAds: (brand: string) =>
    `Search for ${brand} on the Meta Ads Library (facebook.com/ads/library). Also search "${brand} Meta ads active" and "${brand} Google ads". Report: are they running ads? How many? What formats, offers, and messages? How long have ads been running?`,

  appStore: (brand: string) =>
    `Find the ${brand} app on App Store and Google Play. Report: rating, review count, last update, install count, description quality. Most importantly — what do the most recent reviews say? Extract 3-5 specific user quotes revealing product and onboarding experience. What are recurring complaints and praises?`,

  reputation: (brand: string) =>
    `Search "${brand} reviews", "${brand} complaints", "${brand} Reddit", "${brand} Twitter". Report: overall sentiment, recurring complaint themes, recurring praise themes, whether brand responds to reviews, any notable incidents in the past 6 months. Quote actual review text where possible.`,

  competitors: (url: string, brand: string) =>
    `Identify top 3 competitors to ${brand} (${url}). For each: recent news (launches, campaigns, funding), website positioning comparison, what they do better, what they do worse. Also find the most recent industry benchmarks for ${brand}'s sector: average conversion rates, CAC benchmarks, retention rates, any 2025/2026 industry reports.`,
};
