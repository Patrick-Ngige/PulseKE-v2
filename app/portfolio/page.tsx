import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Growth Audit Portfolio | Ngige Audit',
  description: 'Full-funnel growth audits across African and MEA digital businesses by Patrick Ngige.',
};

const AUDITS = [
  {
    slug: 'safaricom',
    siteName: 'Safaricom',
    url: 'https://safaricom.co.ke',
    overallScore: 69,
    overallLabel: 'Category king — website behind',
    tagline: "Africa's most powerful digital platform, invisible on its own website",
    industry: 'Telecom / Fintech',
    market: 'Kenya',
    createdAt: '2026-03-14',
    topFindings: ['No Ziidi Trader landing page', 'Technical dimension: CWV failing', 'Activation gap at 45/100'],
  },
  {
    slug: 'piggyvest',
    siteName: 'PiggyVest',
    url: 'https://piggyvest.com',
    overallScore: 74,
    overallLabel: 'Good — undermarketing a great product',
    tagline: 'Strong product, underserved funnel',
    industry: 'Savings / Fintech',
    market: 'Nigeria',
    createdAt: '2026-03-14',
    topFindings: ['200K+ users not above fold', 'Growth loop breaks at sharing', 'First-investment nudge missing'],
  },
  {
    slug: 'cowrywise',
    siteName: 'Cowrywise',
    url: 'https://cowrywise.com',
    overallScore: 68,
    overallLabel: 'Investment-led — lost in a crowded race',
    tagline: 'A sophisticated product losing the narrative war',
    industry: 'Wealthtech / Fintech',
    market: 'Nigeria',
    createdAt: '2026-03-14',
    topFindings: ['Homepage indistinguishable from PiggyVest', 'Dollar savings not the hero CTA', 'No paid acquisition visible'],
  },
  {
    slug: 'network-international',
    siteName: 'Network International',
    url: 'https://network.ae',
    overallScore: 66,
    overallLabel: 'Enterprise brand, consumer-grade website',
    tagline: 'A payments giant hiding behind a corporate brochure',
    industry: 'Payments / B2B',
    market: 'UAE / MEA',
    createdAt: '2026-03-14',
    topFindings: ['LCP 5.6s mobile — Core Web Vitals failing', 'No Arabic SEO strategy', 'No SME self-serve path'],
  },
  {
    slug: 'paystack',
    siteName: 'Paystack',
    url: 'https://paystack.com',
    overallScore: 71,
    overallLabel: 'Performing — Room to Grow',
    tagline: 'Strong brand recognition, marketing infrastructure behind the product',
    industry: 'Payments / Fintech',
    market: 'Nigeria / Africa',
    createdAt: '2026-03-14',
    topFindings: ['No content marketing engine', '200K+ businesses buried below fold', 'No heatmap tool detected'],
  },
];

function scoreStyle(n: number) {
  if (n >= 75) return 'bg-[var(--good-bg)] text-[var(--good)]';
  if (n >= 50) return 'bg-[var(--warn-bg)] text-[var(--warn)]';
  return 'bg-[var(--poor-bg)] text-[var(--poor)]';
}

export default function PortfolioPage() {
  const avg = Math.round(AUDITS.reduce((a, b) => a + b.overallScore, 0) / AUDITS.length);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <p className="label mb-3">Audit portfolio</p>
            <h1 className="text-3xl font-bold text-[var(--text)] mb-3">
              Growth intelligence across Africa &amp; MEA
            </h1>
            <p className="text-base text-[var(--text-2)] leading-relaxed">
              Every audit Patrick runs becomes a published case study. Real brands, real data,
              full-funnel analysis across 13 dimensions.
            </p>
          </div>
          <Link href="/" className="btn-brand flex-shrink-0">
            Audit your site
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10 card p-5">
          {[
            { value: AUDITS.length.toString(), label: 'Audits published' },
            { value: `${avg}/100`,             label: 'Average score'    },
            { value: '13',                     label: 'Dimensions each'  },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-mono font-bold text-[var(--brand)]">{value}</div>
              <div className="label mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AUDITS.map((a) => (
            <Link key={a.slug} href={`/portfolio/${a.slug}`}
              className="card p-5 block hover:border-[var(--brand)]/40 hover:-translate-y-0.5 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-mono font-bold ${scoreStyle(a.overallScore)}`}>
                  {a.overallScore}
                </div>
                <div className="text-right">
                  <div className="text-xs text-[var(--text-3)]">{a.market}</div>
                  <div className="text-xs text-[var(--text-3)] mt-0.5">{a.industry}</div>
                </div>
              </div>

              <h2 className="text-base font-semibold text-[var(--text)] mb-1 group-hover:text-[var(--brand)] transition-colors">
                {a.siteName}
              </h2>
              <p className="text-xs text-[var(--text-3)] mb-1">{a.overallLabel}</p>
              <p className="text-xs text-[var(--text-2)] italic leading-relaxed mb-4">
                &ldquo;{a.tagline}&rdquo;
              </p>

              <ul className="space-y-1 mb-4">
                {a.topFindings.map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-[var(--text-3)]">
                    <span className="text-[var(--brand)] mt-0.5 flex-shrink-0">·</span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                <span className="text-xs text-[var(--text-3)]">
                  {new Date(a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="text-xs text-[var(--brand)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Read audit
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}

          {/* CTA card */}
          <Link href="/"
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[var(--brand)]/40 p-6 text-center transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-bg)] flex items-center justify-center mb-3 group-hover:bg-[var(--brand)]/20 transition-colors">
              <svg className="w-5 h-5 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
            </div>
            <h3 className="text-sm font-medium text-[var(--text)] mb-1">Audit your website</h3>
            <p className="text-xs text-[var(--text-3)]">Free · 90 seconds · No signup</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
