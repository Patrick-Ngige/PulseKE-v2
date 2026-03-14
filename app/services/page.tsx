import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services & Pricing | Ngige Growth Audit',
  description: 'Outcome-based growth marketing services from Patrick Ngige. Free audits to full implementation retainers.',
};

const SERVICES = [
  {
    name:      'Free Audit',
    price:     'Free',
    note:      'No signup required',
    desc:      'Full 13-dimension growth audit across your website, social, app store, paid media, and reputation. Patrick\'s POV + 90-day roadmap.',
    includes:  ['13-dimension scored report','Live market intelligence','Growth loop diagnosis','Magic moment identification','90-day prioritised roadmap','3 curated further reading resources','Stitch redesign prompts'],
    cta:       'Run free audit',
    href:      '/',
    featured:  false,
  },
  {
    name:      'Premium Audit',
    price:     '$149',
    note:      'One-time',
    desc:      'Everything in the free audit plus 3 Stitch redesign mockups, Figma export, HTML/CSS code, and a 30-min implementation call.',
    includes:  ['Full free audit +','3 Stitch redesign mockups','Figma file export','HTML/CSS implementation code','30-min strategy call','Priority 24hr turnaround'],
    cta:       'Book premium audit',
    href:      'https://calendly.com/patrick-ngige/growth-audit',
    featured:  true,
  },
  {
    name:      'Implementation',
    price:     '$499',
    note:      'Per engagement',
    desc:      'Full audit + all redesigns + Patrick implements the top 3 conversion fixes in your Next.js/React codebase.',
    includes:  ['Full premium audit +','Top 3 fixes implemented','Core Web Vitals optimisation','GA4 + Clarity tracking setup','30-day performance check-in','Delivered to your GitHub repo'],
    cta:       'Start engagement',
    href:      'https://calendly.com/patrick-ngige/growth-audit',
    featured:  false,
  },
  {
    name:      'Growth Retainer',
    price:     '$1,500',
    note:      'Per month',
    desc:      'Monthly audits, continuous redesign iteration, implementation, and reporting. For teams serious about compounding growth.',
    includes:  ['Monthly full-funnel audit','Weekly growth insights','Continuous A/B test design','Top wins implemented','Paid media strategy review','Direct Slack access'],
    cta:       'Apply for retainer',
    href:      'https://calendly.com/patrick-ngige/growth-audit',
    featured:  false,
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container">

        <div className="max-w-xl mb-12">
          <p className="label mb-3">Services & Pricing</p>
          <h1 className="text-3xl font-bold text-[var(--text)] mb-4">
            Growth systems built to compound
          </h1>
          <p className="text-base text-[var(--text-2)] leading-relaxed">
            Every engagement starts with a free audit. From there, you choose your level.
            All work is scoped to outcomes — not hours.
          </p>
        </div>

        {/* Pricing grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {SERVICES.map((s) => (
            <div key={s.name}
              className={`card p-5 flex flex-col relative ${s.featured ? 'border-[var(--brand)]/40 bg-[var(--brand-bg)]/30' : ''}`}>
              {s.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 text-xs font-medium text-white bg-[var(--brand)] rounded-full">Most popular</span>
                </div>
              )}

              <div className="mb-4">
                <h2 className="text-sm font-semibold text-[var(--text)] mb-2">{s.name}</h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-mono font-bold text-[var(--brand)]">{s.price}</span>
                  <span className="text-xs text-[var(--text-3)]">{s.note}</span>
                </div>
              </div>

              <p className="text-xs text-[var(--text-2)] leading-relaxed mb-5">{s.desc}</p>

              <ul className="space-y-2 mb-6 flex-1">
                {s.includes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[var(--good)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                    </svg>
                    <span className="text-[var(--text-2)]">{item}</span>
                  </li>
                ))}
              </ul>

              {s.href.startsWith('http') ? (
                <a href={s.href} target="_blank" rel="noopener noreferrer"
                  className={s.featured ? 'btn-brand text-xs py-2' : 'btn-outline text-xs py-2'}>
                  {s.cta}
                </a>
              ) : (
                <Link href={s.href}
                  className={s.featured ? 'btn-brand text-xs py-2' : 'btn-outline text-xs py-2'}>
                  {s.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-[var(--text)] mb-6 text-center">How every engagement works</h2>
          <div className="space-y-3">
            {[
              { n: '01', t: 'Free audit first',         d: 'Every engagement starts with a full 13-dimension growth audit. No commitment. You see Patrick\'s thinking before spending a penny.' },
              { n: '02', t: 'Scoped to outcomes',        d: 'We agree on specific, measurable outcomes before work begins. Not "deliver Y hours" — "increase sign-up conversion by X%."' },
              { n: '03', t: 'Strategy + execution',      d: 'Patrick writes the strategy and implements it. No handoffs, no delays, no agency markup. You get a growth marketer who codes.' },
              { n: '04', t: 'Measured and iterated',     d: 'Every change is tracked against baselines. If it doesn\'t move the metric, we iterate until it does.' },
            ].map(({ n, t, d }) => (
              <div key={n} className="flex gap-5 card p-5">
                <div className="text-2xl font-mono font-bold text-[var(--brand)]/30 flex-shrink-0 w-8">{n}</div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text)] mb-1">{t}</h3>
                  <p className="text-sm text-[var(--text-2)] leading-relaxed">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-[var(--text-3)] mb-5">Not sure where to start? Run the free audit first — 90 seconds.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/" className="btn-brand">Run free audit</Link>
            <a href="https://calendly.com/patrick-ngige/growth-audit" target="_blank" rel="noopener noreferrer"
              className="btn-outline">Book a call</a>
          </div>
        </div>
      </div>
    </div>
  );
}
