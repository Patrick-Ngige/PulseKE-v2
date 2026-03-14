import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

// Static audit data — will be replaced by KV lookups once persistence is configured
const AUDIT_SUMMARIES: Record<string, {
  siteName: string; url: string; overallScore: number; overallLabel: string;
  tagline: string; patricksPOV: string; execSummary: string; industry: string;
  market: string; createdAt: string;
  dimensions: Array<{ label: string; score: number }>;
  roadmapHighlights: string[];
  furtherReading: Array<{ title: string; url: string }>;
}> = {
  safaricom: {
    siteName: 'Safaricom', url: 'https://safaricom.co.ke',
    overallScore: 69, overallLabel: 'Category king — website behind',
    tagline: "Africa's most powerful digital platform — invisible on its own website",
    industry: 'Telecom / Fintech', market: 'Kenya', createdAt: '2026-03-14',
    patricksPOV: "I've lived and worked in Nairobi. I use M-PESA every single day. And when I look at safaricom.co.ke, it tells me products and prices but doesn't tell me why Safaricom has changed Kenya's economy. The Ziidi Trader launch is a historic moment — M-PESA users can now buy Safaricom's own stock through M-PESA. That story should be on every page. Instead it's buried in a news ticker.",
    execSummary: "Safaricom processes Sh38.3 trillion annually, supports 8% of Kenya's GDP, and just became a full investment platform with Ziidi Trader. The product is extraordinary — the website is a telecom catalogue from 2019. The critical gap is entirely in how they present themselves digitally.",
    dimensions: [
      { label: 'Retention',   score: 85 },
      { label: 'Technical',   score: 70 },
      { label: 'Tracking',    score: 65 },
      { label: 'Acquisition', score: 62 },
      { label: 'Conversion',  score: 60 },
      { label: 'Messaging',   score: 58 },
      { label: 'Reputation',  score: 55 },
      { label: 'App Store',   score: 52 },
      { label: 'Activation',  score: 45 },
    ],
    roadmapHighlights: [
      'Build a dedicated Ziidi Trader landing page (week 1)',
      'Add 40M user metrics bar to homepage hero (week 1)',
      'Add shareable milestone card to Ziidi MMF (week 1)',
      'Launch 30-day new subscriber onboarding journey (month 1)',
      'Build "Hello Daraja" developer quickstart — 15 min to first API call (month 1)',
      'Launch "Invest with M-PESA" full campaign (quarter 1)',
    ],
    furtherReading: [
      { title: 'Safaricom Innovation Strategy 2026', url: 'https://www.techinafrica.com/safaricom-innovation-strategy-2026-ai-m-pesa-kenya-startup-growth/' },
      { title: '2026 Telecommunications Industry Outlook — Deloitte', url: 'https://www.deloitte.com/us/en/insights/industry/technology/technology-media-telecom-outlooks/telecommunications-industry-outlook.html' },
      { title: 'Airtel Kenya aggressive expansion pressures Safaricom — TechCabal', url: 'https://techcabal.com/2025/02/21/airtel-kenya-aggressive-expansion-pressures-safaricom/' },
    ],
  },
  piggyvest: {
    siteName: 'PiggyVest', url: 'https://piggyvest.com',
    overallScore: 74, overallLabel: 'Good — undermarketing a great product',
    tagline: 'Strong product, underserved funnel',
    industry: 'Savings / Fintech', market: 'Nigeria', createdAt: '2026-03-14',
    patricksPOV: "What struck me most about PiggyVest is the gap between how powerful their community is and how little of it shows up on their website. Their 'Grown Ups' comic series drove 40,000 app downloads — that's a conversion machine — yet a first-time visitor would never know it exists. The single biggest lever here isn't paid acquisition. It's surfacing the emotional proof they've already built.",
    execSummary: "PiggyVest is Nigeria's most trusted savings and investment platform, with 6 million users and over ₦2 trillion saved — a remarkable achievement. Their content marketing is genuinely world-class for Africa. The critical gap is execution on the website funnel: social proof buried, activation flow creating unnecessary friction, and tracking too immature to run data-driven experiments.",
    dimensions: [
      { label: 'Retention',   score: 80 },
      { label: 'Messaging',   score: 78 },
      { label: 'Conversion',  score: 67 },
      { label: 'SEO',         score: 68 },
      { label: 'Technical',   score: 72 },
      { label: 'Tracking',    score: 58 },
      { label: 'Activation',  score: 52 },
    ],
    roadmapHighlights: [
      'Move "200,000+ businesses" to hero section (week 1)',
      'Install Microsoft Clarity — free heatmap (week 1)',
      'Add UTM parameters to all blog CTAs (week 1)',
      'A/B test rate-led hero headline (month 1)',
      'Launch 24-hour activation email (month 1)',
      'Build shareable milestone cards year-round (quarter 1)',
    ],
    furtherReading: [
      { title: 'Evolution of Nigerian Fintech 2026', url: 'https://www.techcrier.com/2026/02/the-evolution-of-nigerian-fintech-2026.html' },
      { title: 'Fintech Marketing Benchmarks 2026 — Promodo', url: 'https://www.promodo.com/blog/fintech-marketing-benchmarks' },
      { title: 'Nigeria Fintech Marketing Outlook — Africa Fintech Summit', url: 'https://afrifintechsummit.gumroad.com/l/fintechmarketingoutlooknigeria2024' },
    ],
  },
  cowrywise: {
    siteName: 'Cowrywise', url: 'https://cowrywise.com',
    overallScore: 68, overallLabel: 'Investment-led — lost in a crowded race',
    tagline: 'A sophisticated product losing the narrative war',
    industry: 'Wealthtech / Fintech', market: 'Nigeria', createdAt: '2026-03-14',
    patricksPOV: "Cowrywise is the most investment-serious platform in Nigerian wealthtech — SEC-licensed, mutual funds, NSE stocks, dollar savings. But I had to dig to figure that out. Their homepage says 'Plan, Save and Invest' — identical to PiggyVest. Meanwhile PiggyVest just doubled its AUM and is launching PiggyVest Kids. The window to own the 'serious investor' narrative is closing.",
    execSummary: "Cowrywise has a genuinely differentiated proposition — SEC-licensed, mutual fund access, dollar-denominated savings, NSE stock access — and an exceptionally clean product. The problem is entirely marketing execution: homepage undersells the sophistication, the blog is the best asset on the site but barely discoverable, and there is no clear answer to 'Why Cowrywise over PiggyVest?'",
    dimensions: [
      { label: 'Retention',   score: 79 },
      { label: 'Technical',   score: 71 },
      { label: 'Conversion',  score: 65 },
      { label: 'Activation',  score: 62 },
      { label: 'Messaging',   score: 60 },
      { label: 'Tracking',    score: 58 },
      { label: 'Acquisition', score: 48 },
    ],
    roadmapHighlights: [
      'Rewrite homepage hero: "Nigeria\'s most complete investment platform" (week 1)',
      'Create dedicated "Save in dollars" landing page (week 1)',
      'Add UTM parameters to all blog CTAs (week 1)',
      'Build investment returns calculator for homepage (month 1)',
      'Launch first-investment nudge email (1hr post-KYC) (month 1)',
      'Own the "serious investor" content category with 12 SEO posts (quarter 1)',
    ],
    furtherReading: [
      { title: 'Evolution of Nigerian Fintech 2026', url: 'https://www.techcrier.com/2026/02/the-evolution-of-nigerian-fintech-2026.html' },
      { title: 'Fintech Marketing Benchmarks 2026', url: 'https://www.promodo.com/blog/fintech-marketing-benchmarks' },
      { title: 'Nigeria Fintech Marketing Outlook', url: 'https://afrifintechsummit.gumroad.com/l/fintechmarketingoutlooknigeria2024' },
    ],
  },
  'network-international': {
    siteName: 'Network International', url: 'https://network.ae',
    overallScore: 66, overallLabel: 'Enterprise brand, consumer-grade website',
    tagline: 'A payments giant hiding behind a corporate brochure',
    industry: 'Payments / B2B', market: 'UAE / MEA', createdAt: '2026-03-14',
    patricksPOV: "Network International processes $59B annually across 50+ markets. That's a story worth telling loudly. But the website feels designed to impress a boardroom, not convert a CFO who landed via Google. Their Core Web Vitals are failing — LCP of 5.6s on mobile, CLS of 0.28 on desktop. For a company selling payment infrastructure credibility, a slow jumpy website is a brand liability.",
    execSummary: "Network International is the MEA region's leading payments infrastructure company — $59B+ annual transaction volume, 130K merchants, 50+ markets, and a newly completed Magnati merger. Real user data shows Core Web Vitals failing on both mobile and desktop. The growth gap is entirely in marketing execution: no content engine, no self-serve SME path, messaging that broadcasts to everyone rather than converting anyone.",
    dimensions: [
      { label: 'Technical (desktop)', score: 80 },
      { label: 'Retention',           score: 62 },
      { label: 'Tracking',            score: 60 },
      { label: 'Messaging',           score: 63 },
      { label: 'Conversion',          score: 58 },
      { label: 'Acquisition',         score: 55 },
      { label: 'Technical (mobile)',  score: 38 },
      { label: 'Activation',          score: 48 },
    ],
    roadmapHighlights: [
      'Add "$59B+ processed · 130K+ merchants · 30 years" to hero (week 1)',
      'Install LinkedIn Insight Tag for ABM intelligence (week 1)',
      'Fix Core Web Vitals: LCP 5.6s → target <2.5s (month 1)',
      'Build persona-segmented entry points: Merchant / Bank / Fintech (month 1)',
      'Launch "Payments Intelligence" content engine in English + Arabic (quarter 1)',
      'Build SME self-serve onboarding path (quarter 1)',
    ],
    furtherReading: [
      { title: '2026 Telecommunications Industry Outlook — Deloitte', url: 'https://www.deloitte.com/us/en/insights/industry/technology/technology-media-telecom-outlooks/telecommunications-industry-outlook.html' },
      { title: 'ABM Benchmarks Report — ITSMA', url: 'https://www.itsma.com/abm-benchmark-report/' },
      { title: 'B2B Content Marketing 2026 — Content Marketing Institute', url: 'https://contentmarketinginstitute.com/research/' },
    ],
  },
  paystack: {
    siteName: 'Paystack', url: 'https://paystack.com',
    overallScore: 71, overallLabel: 'Performing — Room to Grow',
    tagline: 'Strong brand recognition, marketing infrastructure behind the product',
    industry: 'Payments / Fintech', market: 'Nigeria / Africa', createdAt: '2026-03-14',
    patricksPOV: "Paystack has built one of Africa's most recognised fintech brands. But the site is losing organic traffic to competitors on high-intent keywords, their tracking score is 55/100, and 200,000+ businesses — a massive trust signal — is buried below the fold. The product is excellent. The marketing hasn't caught up.",
    execSummary: "Paystack has strong brand recognition and a dominant position in African payments, but its homepage underinvests in conversion clarity, misses SEO opportunities on competitive keywords, and under-showcases social proof. Their 'only makes money when you do' positioning is sharp. The tracking and content gaps are where the growth is being left on the table.",
    dimensions: [
      { label: 'Messaging',   score: 78 },
      { label: 'Technical',   score: 73 },
      { label: 'SEO',         score: 68 },
      { label: 'Conversion',  score: 65 },
      { label: 'Tracking',    score: 55 },
      { label: 'Activation',  score: 58 },
    ],
    roadmapHighlights: [
      'Move 200K+ businesses social proof to hero (week 1)',
      'Write keyword-targeted meta descriptions (week 1)',
      'Install Microsoft Clarity (week 1)',
      'Add sandbox / demo CTA alongside sign-up (month 1)',
      'Implement GA4 funnel event tracking (month 1)',
      'Build content marketing engine for African SMBs (quarter 1)',
    ],
    furtherReading: [
      { title: 'Fintech Marketing Benchmarks 2026', url: 'https://www.promodo.com/blog/fintech-marketing-benchmarks' },
      { title: 'CRO Benchmarks — CXL Institute', url: 'https://cxl.com/conversion-rate-optimization/' },
      { title: 'Nigeria Fintech Marketing Outlook', url: 'https://afrifintechsummit.gumroad.com/l/fintechmarketingoutlooknigeria2024' },
    ],
  },
};

interface Props { params: { slug: string } }

export function generateStaticParams() {
  return Object.keys(AUDIT_SUMMARIES).map(slug => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const a = AUDIT_SUMMARIES[params.slug];
  if (!a) return { title: 'Not found' };
  return {
    title: `${a.siteName} Growth Audit (${a.overallScore}/100) | Ngige Audit`,
    description: a.execSummary.slice(0, 155),
  };
}

function scoreStyle(n: number) {
  if (n >= 75) return { bg: 'bg-[var(--good-bg)]', text: 'text-[var(--good)]', bar: 'bg-[var(--good)]' };
  if (n >= 50) return { bg: 'bg-[var(--warn-bg)]', text: 'text-[var(--warn)]', bar: 'bg-[var(--warn)]' };
  return { bg: 'bg-[var(--poor-bg)]', text: 'text-[var(--poor)]', bar: 'bg-[var(--poor)]' };
}

export default function AuditCaseStudy({ params }: Props) {
  const a = AUDIT_SUMMARIES[params.slug];
  if (!a) notFound();
  const sc = scoreStyle(a.overallScore);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-3xl">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[var(--text-3)] mb-8">
          <Link href="/portfolio" className="hover:text-[var(--brand)] transition-colors">Portfolio</Link>
          <span>/</span>
          <span className="text-[var(--text)]">{a.siteName}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-mono font-bold ${sc.bg} ${sc.text}`}>
              {a.overallScore}
            </div>
            <div>
              <p className="label">{a.market} · {a.industry}</p>
              <h1 className="text-2xl font-bold text-[var(--text)]">{a.siteName}</h1>
            </div>
          </div>
          <p className="text-base text-[var(--text-2)] leading-relaxed">{a.overallLabel}</p>
        </div>

        {/* Executive summary */}
        <div className="card p-5 mb-6">
          <p className="label mb-3">Executive summary</p>
          <p className="text-sm text-[var(--text-2)] leading-relaxed">{a.execSummary}</p>
        </div>

        {/* Patrick's POV */}
        <div className="rounded-xl border border-[var(--brand)]/20 bg-[var(--brand-bg)] p-5 mb-6">
          <p className="label mb-2 text-[var(--brand)]">Patrick&apos;s take</p>
          <p className="text-sm text-[var(--text-2)] leading-relaxed italic">&ldquo;{a.patricksPOV}&rdquo;</p>
          <p className="text-xs text-[var(--text-3)] mt-2 not-italic">— Patrick Ngige, Technical Growth Marketer</p>
        </div>

        {/* Scorecard */}
        <div className="mb-6">
          <p className="label mb-4">Dimension scores</p>
          <div className="space-y-2.5">
            {a.dimensions.map(({ label, score }) => {
              const c = scoreStyle(score);
              return (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-36 flex-shrink-0 text-xs text-[var(--text-3)] truncate">{label}</div>
                  <div className="flex-1 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${score}%` }} />
                  </div>
                  <span className={`w-6 text-right text-xs font-mono font-medium ${c.text}`}>{score}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Roadmap highlights */}
        <div className="mb-6">
          <p className="label mb-4">90-day roadmap highlights</p>
          <ul className="space-y-2">
            {a.roadmapHighlights.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-2)]">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--good)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Further reading */}
        {a.furtherReading.length > 0 && (
          <div className="mb-10">
            <p className="label mb-4">Further reading</p>
            <div className="space-y-2">
              {a.furtherReading.map((r, i) => (
                <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between card p-3 hover:border-[var(--brand)]/40 transition-colors group text-sm">
                  <span className="text-[var(--text-2)] group-hover:text-[var(--brand)] transition-colors">{r.title}</span>
                  <svg className="w-3.5 h-3.5 flex-shrink-0 text-[var(--text-3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="card p-6 text-center">
          <h3 className="text-base font-semibold text-[var(--text)] mb-2">Want a growth audit for your business?</h3>
          <p className="text-sm text-[var(--text-2)] mb-5 max-w-md mx-auto">
            Run a free 13-dimension audit now — no signup required. Or book a strategy call with Patrick directly.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/" className="btn-brand">Run free audit</Link>
            <a href="https://calendly.com/patrick-ngige/growth-audit" target="_blank" rel="noopener noreferrer"
              className="btn-outline">Book a call</a>
          </div>
        </div>

        {/* Back */}
        <div className="mt-8 text-center">
          <Link href="/portfolio" className="text-sm text-[var(--text-3)] hover:text-[var(--brand)] transition-colors">
            ← All audits
          </Link>
        </div>
      </div>
    </div>
  );
}
