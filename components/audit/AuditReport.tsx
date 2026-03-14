'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuditResult, AuditFinding, AuditDimension, GrowthLoop, MagicMoment } from '@/lib/auditTypes';
import { cn, scoreColor, fmtMs } from '@/lib/utils';
import ScoreRing from './ScoreRing';

// ── Sub-components ────────────────────────────────────────────────────────────

function Finding({ f }: { f: AuditFinding }) {
  const [open, setOpen] = useState(false);
  const badgeCls = f.severity === 'high' ? 'badge-poor' : f.severity === 'medium' ? 'badge-warn' : 'badge-good';
  return (
    <div className="card overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-3 p-4 text-left hover:bg-[var(--bg-subtle)] transition-colors">
        <div className="flex items-start gap-2.5 min-w-0">
          <span className={badgeCls}>{f.severity}</span>
          <span className="text-sm font-medium text-[var(--text)] leading-snug">{f.title}</span>
        </div>
        <svg className={cn('w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--text-3)] transition-transform', open && 'rotate-180')}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            transition={{ duration: 0.18 }} className="overflow-hidden">
            <div className="px-4 pb-4 pt-3 border-t border-[var(--border)] space-y-2.5">
              <p className="text-sm text-[var(--text-2)] leading-relaxed">{f.detail}</p>
              {f.impact && (
                <div className="text-xs bg-[var(--bg-subtle)] rounded-lg px-3 py-2">
                  <span className="font-medium text-[var(--text)]">Commercial impact: </span>
                  <span className="text-[var(--text-2)]">{f.impact}</span>
                </div>
              )}
              {f.recommendation && (
                <div className="text-xs bg-[var(--good-bg)] rounded-lg px-3 py-2 text-[var(--good)]">
                  <span className="font-medium">Do this: </span>{f.recommendation}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DimSection({ dim, label }: { dim?: AuditDimension; label: string }) {
  if (!dim) return <p className="text-sm text-[var(--text-3)] py-4">No data.</p>;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[var(--text)]">{label}</h3>
        <ScoreRing score={dim.score} size={44} />
      </div>
      {dim.findings?.length
        ? dim.findings.map((f, i) => <Finding key={i} f={f} />)
        : <p className="text-sm text-[var(--text-3)]">No findings.</p>}
    </div>
  );
}

function LoopDiagram({ loop }: { loop: GrowthLoop }) {
  const styles: Record<string, string> = {
    strong: 'bg-[var(--good-bg)] text-[var(--good)] border-[var(--good)]/20',
    weak:   'bg-[var(--warn-bg)] text-[var(--warn)] border-[var(--warn)]/20 border-dashed',
    broken: 'bg-[var(--poor-bg)] text-[var(--poor)] border-[var(--poor)]/20 border-dashed',
    absent: 'bg-[var(--bg-subtle)] text-[var(--text-3)] border-[var(--border)] border-dashed',
  };
  return (
    <div className="card p-4 space-y-3">
      <h4 className="text-sm font-medium text-[var(--text)]">{loop.name}</h4>
      <div className="flex flex-wrap items-center gap-2">
        {loop.nodes.map((n, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={cn('px-2.5 py-1 rounded-lg text-xs font-medium border', styles[n.health])}>{n.label}</div>
            {i < loop.nodes.length - 1
              ? <span className="text-[var(--text-3)] text-sm">→</span>
              : <span className="text-[var(--text-3)] text-sm">↺</span>}
          </div>
        ))}
      </div>
      {loop.breakPoint && (
        <p className="text-xs text-[var(--text-2)]">
          <span className="font-medium text-[var(--poor)]">Break point: </span>{loop.breakPoint}
        </p>
      )}
      <p className="text-xs text-[var(--good)]">→ {loop.recommendation}</p>
    </div>
  );
}

function MomentCard({ m }: { m: MagicMoment }) {
  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="badge-new">{m.userType}</span>
        <h4 className="text-sm font-medium text-[var(--text)]">Magic moment</h4>
      </div>
      <p className="text-sm font-medium text-[var(--text)]">{m.moment}</p>
      <div className="grid sm:grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg bg-[var(--bg-subtle)] p-3">
          <div className="font-medium text-[var(--text)] mb-1">Current friction</div>
          <div className="text-[var(--text-2)] leading-relaxed">{m.currentPath}</div>
          {m.friction && <div className="text-[var(--poor)] mt-1">{m.friction}</div>}
        </div>
        <div className="rounded-lg bg-[var(--good-bg)] p-3">
          <div className="font-medium text-[var(--good)] mb-1">Fix</div>
          <div className="text-[var(--text-2)] leading-relaxed">{m.recommendation}</div>
        </div>
      </div>
    </div>
  );
}

function PagespeedPanel({ ps }: { ps: NonNullable<AuditResult['pageSpeed']> }) {
  const metrics = [
    { label: 'LCP',  val: ps.lcp,  t: [2500,4000]  },
    { label: 'FCP',  val: ps.fcp,  t: [1800,3000]  },
    { label: 'TTFB', val: ps.ttfb, t: [800,1800]   },
    { label: 'CLS',  val: ps.cls != null ? ps.cls * 1000 : null,  t: [100,250], isCls: true },
    { label: 'TBT',  val: ps.fid,  t: [200,600]    },
  ];
  function st(v: number | null | undefined, t: number[]) {
    if (v == null) return 'unknown';
    return v <= t[0] ? 'good' : v <= t[1] ? 'warn' : 'poor';
  }
  const scores = [
    { l: 'Performance',    v: ps.performance },
    { l: 'SEO',            v: ps.seo },
    { l: 'Accessibility',  v: ps.accessibility },
    { l: 'Best Practices', v: ps.bestPractices },
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <span className={ps.assessment === 'passed' ? 'badge-good' : 'badge-poor'}>
          Core Web Vitals: {ps.assessment === 'passed' ? 'Passed ✓' : 'Failed ✗'}
        </span>
        <span className="text-xs text-[var(--text-3)]">Real user data · Google CrUX</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {scores.map(({ l, v }) => {
          const col = scoreColor(v ?? 0);
          return (
            <div key={l} className={cn('rounded-xl p-3 text-center', v != null ? col.bg : 'bg-[var(--bg-subtle)]')}>
              <div className={cn('text-xl font-mono font-bold', v != null ? col.text : 'text-[var(--text-3)]')}>{v ?? 'N/A'}</div>
              <div className="text-xs text-[var(--text-3)] mt-0.5">{l}</div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {metrics.map(({ label, val, t, isCls }: any) => {
          const s   = st(val, t);
          const disp = val != null ? (isCls ? (val/1000).toFixed(3) : fmtMs(val)) : 'N/A';
          const cls  = s === 'good' ? 'bg-[var(--good-bg)] text-[var(--good)]'
                     : s === 'warn' ? 'bg-[var(--warn-bg)] text-[var(--warn)]'
                     : s === 'poor' ? 'bg-[var(--poor-bg)] text-[var(--poor)]'
                     : 'bg-[var(--bg-subtle)] text-[var(--text-3)]';
          return (
            <div key={label} className={cn('rounded-xl p-3 text-center', cls.split(' ')[0])}>
              <div className={cn('text-lg font-mono font-bold', cls.split(' ')[1])}>{disp}</div>
              <div className="text-xs text-[var(--text-3)] mt-0.5">{label}</div>
            </div>
          );
        })}
      </div>
      {(ps.opportunities?.length ?? 0) > 0 && (
        <div className="space-y-2">
          <p className="label">Top opportunities</p>
          {ps.opportunities?.map((o, i) => (
            <div key={i} className="flex items-center justify-between card-sm text-sm">
              <span className="text-[var(--text-2)]">{o.title}</span>
              {o.savings > 0 && <span className="badge-warn">−{(o.savings/1000).toFixed(1)}s</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RoadmapPanel({ roadmap }: { roadmap: AuditResult['roadmap'] }) {
  const sections = [
    { label: 'Week 1 — quick wins (no code)', items: roadmap.week1,    border: 'border-l-[var(--good)]',  bg: 'bg-[var(--good-bg)]'  },
    { label: 'Month 1 — build & optimise',    items: roadmap.month1,   border: 'border-l-[var(--new)]',   bg: 'bg-[var(--new-bg)]'   },
    { label: 'Quarter 1 — test & scale',      items: roadmap.quarter1, border: 'border-l-[var(--warn)]',  bg: 'bg-[var(--warn-bg)]'  },
  ];
  return (
    <div className="space-y-7">
      {sections.map(({ label, items, border, bg }) => items?.length ? (
        <div key={label}>
          <p className="label mb-3">{label}</p>
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className={cn('border-l-2 pl-4 py-3 pr-3 rounded-r-xl', border, bg)}>
                <div className="text-sm font-medium text-[var(--text)] mb-1">{item.title}</div>
                <div className="text-xs text-[var(--text-2)] leading-relaxed">{item.detail}</div>
                {item.effort && (
                  <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded font-mono bg-[var(--bg)]/50 text-[var(--text-3)]">
                    effort: {item.effort}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null)}
    </div>
  );
}

function StitchPanel({ prompts }: { prompts: AuditResult['stitchPrompts'] }) {
  const [copied, setCopied] = useState<number | null>(null);
  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-[var(--new-bg)] border border-[var(--new)]/20 p-4 text-sm text-[var(--text-2)]">
        Paste these prompts into{' '}
        <a href="https://stitch.withgoogle.com" target="_blank" rel="noopener noreferrer" className="text-[var(--new)] hover:underline">
          stitch.withgoogle.com
        </a>
        {' '}to generate redesigns of the highest-impact pages.
      </div>
      {prompts.map((p, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="flex items-start justify-between gap-3 p-4 bg-[var(--bg-subtle)]">
            <div>
              <div className="text-sm font-medium text-[var(--text)]">{p.target}</div>
              <div className="text-xs text-[var(--text-3)] mt-0.5">{p.description}</div>
            </div>
            <button onClick={() => { navigator.clipboard.writeText(p.prompt); setCopied(i); setTimeout(() => setCopied(null), 2000); }}
              className="badge-new cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0">
              {copied === i ? '✓ Copied' : 'Copy prompt'}
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-[var(--text-2)] leading-relaxed whitespace-pre-wrap bg-[var(--bg)] max-h-44 overflow-y-auto no-scrollbar">
            {p.prompt}
          </pre>
        </div>
      ))}
    </div>
  );
}

// ── Dimension tab definitions ─────────────────────────────────────────────────

const TABS = [
  { key: 'overview',    label: 'Overview'        },
  { key: 'social',      label: 'Social'          },
  { key: 'paidMedia',   label: 'Paid ads'        },
  { key: 'acquisition', label: 'Acquisition'     },
  { key: 'messaging',   label: 'Messaging'       },
  { key: 'conversion',  label: 'Conversion'      },
  { key: 'appStore',    label: 'App store'       },
  { key: 'activation',  label: 'Activation'      },
  { key: 'reputation',  label: 'Reputation'      },
  { key: 'retention',   label: 'Retention'       },
  { key: 'tracking',    label: 'Tracking'        },
  { key: 'technical',   label: 'Technical'       },
  { key: 'loops',       label: 'Growth loops ✦'  },
  { key: 'moments',     label: 'Magic moment ✦'  },
  { key: 'roadmap',     label: '90-day plan'     },
  { key: 'stitch',      label: 'Redesign ✦'      },
  { key: 'reading',     label: 'Further reading' },
];

const DIM_LABELS: Record<string, string> = {
  social: 'Social media presence', paidMedia: 'Paid media intelligence',
  acquisition: 'Acquisition & SEO', messaging: 'Messaging & positioning',
  conversion: 'Conversion architecture', appStore: 'App store & ASO',
  activation: 'Activation & onboarding', reputation: 'Reputation & social listening',
  retention: 'Retention & engagement', tracking: 'Analytics & tracking',
  technical: 'Technical performance', growthLoop: 'Growth loop diagnosis',
};

const NEW_TABS = new Set(['social','paidMedia','appStore','reputation','loops','moments','stitch']);

// ── Main Report ───────────────────────────────────────────────────────────────

interface Props { result: AuditResult; onReset?: () => void; }

export default function AuditReport({ result, onReset }: Props) {
  const [tab, setTab] = useState('overview');
  const dims = result.dimensions as any;

  const dimList = Object.keys(DIM_LABELS).map(k => ({
    key: k, label: DIM_LABELS[k], score: dims[k]?.score ?? 0,
  })).sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="label mb-1">Ngige Growth Audit · v6</p>
          <h2 className="text-xl font-semibold text-[var(--text)]">{result.siteName}</h2>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[var(--text-3)]">
            <span>{result.url}</span>
            <span>·</span>
            <span>{new Date(result.createdAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</span>
            {result.pageSpeed && <><span>·</span><span className="badge-good">Real PageSpeed</span></>}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()}
            className="btn-outline text-xs px-3 py-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
            </svg>
            Export PDF
          </button>
          {onReset && (
            <button onClick={onReset} className="btn-outline text-xs px-3 py-1.5">New audit</button>
          )}
        </div>
      </div>

      {/* Intelligence banner */}
      {result.intelligenceBanner && (
        <div className="rounded-xl bg-technical/10 border border-technical/20 p-4">
          <p className="text-sm text-[var(--text-2)] leading-relaxed">
            <span className="font-medium text-technical">Live intelligence: </span>
            {result.intelligenceBanner}
          </p>
        </div>
      )}

      {/* Score + POV */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-4 border-2 border-[var(--brand)]/20">
          <ScoreRing score={result.overallScore} size={68} />
          <div>
            <p className="label mb-1">Overall score</p>
            <p className="text-sm font-medium text-[var(--text)]">{result.overallLabel}</p>
            <p className="text-xs text-[var(--text-3)] mt-0.5 leading-snug">{result.tagline}</p>
          </div>
        </div>
        <div className="sm:col-span-2 rounded-xl border border-[var(--brand)]/20 bg-[var(--brand-bg)] p-4">
          <p className="label mb-2">Patrick&apos;s take</p>
          <p className="text-sm text-[var(--text-2)] leading-relaxed italic">&ldquo;{result.patricksPOV}&rdquo;</p>
        </div>
      </div>

      {/* Top 3 */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Strongest',   d: dimList[0] },
          { label: 'Needs work',  d: dimList[Math.floor(dimList.length/2)] },
          { label: 'Biggest gap', d: dimList[dimList.length-1] },
        ].map(({ label, d }) => d && (
          <div key={label} className="card-sm text-center">
            <ScoreRing score={d.score} size={40} className="mx-auto mb-1.5" />
            <p className="text-[10px] text-[var(--text-3)]">{label}</p>
            <p className="text-[11px] text-[var(--text)] mt-0.5 leading-tight">{d.label.split('&')[0].trim()}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto no-scrollbar -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="flex gap-1 min-w-max pb-1">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors',
                tab === t.key
                  ? 'bg-[var(--brand)] text-white'
                  : NEW_TABS.has(t.key)
                    ? 'text-[var(--brand)]/70 hover:text-[var(--brand)] hover:bg-[var(--brand-bg)]'
                    : 'text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[var(--bg-subtle)]'
              )}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.15 }}>

          {tab === 'overview' && (
            <div className="space-y-5">
              <div className="space-y-2.5">
                <p className="label">13-dimension scorecard</p>
                {dimList.map(({ key, label, score }) => {
                  const col = scoreColor(score);
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <div className="w-44 flex-shrink-0 flex items-center gap-1.5">
                        <span className="text-xs text-[var(--text-3)] truncate">{label}</span>
                        {NEW_TABS.has(key) && <span className="badge-new text-[9px] px-1 py-0">NEW</span>}
                      </div>
                      <div className="flex-1 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full', col.bar)} style={{ width: `${score}%`, transition: 'width 0.6s ease-out' }} />
                      </div>
                      <span className={cn('w-7 text-right text-xs font-mono font-medium', col.text)}>{score}</span>
                    </div>
                  );
                })}
              </div>
              <div className="card p-4">
                <p className="label mb-2">Executive summary</p>
                <p className="text-sm text-[var(--text-2)] leading-relaxed">{result.execSummary}</p>
              </div>
            </div>
          )}

          {Object.keys(DIM_LABELS).map(k =>
            tab === k && k !== 'technical' ? <DimSection key={k} dim={dims[k]} label={DIM_LABELS[k]} /> : null
          )}

          {tab === 'technical' && (
            <div className="space-y-5">
              {result.pageSpeed && <PagespeedPanel ps={result.pageSpeed} />}
              {dims.technical?.findings?.length > 0 && (
                <div className="space-y-3">
                  <p className="label">Strategic findings</p>
                  {dims.technical.findings.map((f: AuditFinding, i: number) => <Finding key={i} f={f} />)}
                </div>
              )}
              {!result.pageSpeed && <DimSection dim={dims.technical} label={DIM_LABELS.technical} />}
            </div>
          )}

          {tab === 'loops' && (
            <div className="space-y-4">
              <div className="rounded-xl bg-[var(--new-bg)] border border-[var(--new)]/20 p-3 text-xs text-[var(--text-2)]">
                A growth loop is a self-reinforcing cycle where one user&apos;s actions bring in more users automatically. Inspired by Brian Balfour.
              </div>
              {result.growthLoops?.length
                ? result.growthLoops.map((l, i) => <LoopDiagram key={i} loop={l} />)
                : <p className="text-sm text-[var(--text-3)]">No growth loop data.</p>}
            </div>
          )}

          {tab === 'moments' && (
            <div className="space-y-4">
              <div className="rounded-xl bg-[var(--new-bg)] border border-[var(--new)]/20 p-3 text-xs text-[var(--text-2)]">
                The magic moment is the single action a user takes in their first 24–48 hours that predicts whether they stay forever. Inspired by Josh Elman.
              </div>
              {result.magicMoments?.length
                ? result.magicMoments.map((m, i) => <MomentCard key={i} m={m} />)
                : <p className="text-sm text-[var(--text-3)]">No magic moment data.</p>}
            </div>
          )}

          {tab === 'roadmap' && <RoadmapPanel roadmap={result.roadmap} />}

          {tab === 'stitch' && (
            result.stitchPrompts?.length
              ? <StitchPanel prompts={result.stitchPrompts} />
              : <p className="text-sm text-[var(--text-3)]">No redesign prompts generated.</p>
          )}

          {tab === 'reading' && (
            <div className="space-y-3">
              {result.furtherReading?.length
                ? result.furtherReading.map((r, i) => (
                    <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                      className="card p-4 block hover:border-[var(--brand)]/40 transition-colors group">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium text-[var(--text)] group-hover:text-[var(--brand)] transition-colors">{r.title}</div>
                          <div className="text-xs text-[var(--text-3)] mt-1 leading-relaxed">{r.why}</div>
                          <div className="text-xs text-technical/60 mt-1.5 font-mono truncate">{r.url}</div>
                        </div>
                        <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--text-3)] group-hover:text-[var(--brand)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                      </div>
                    </a>
                  ))
                : <p className="text-sm text-[var(--text-3)]">No further reading available.</p>}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* CTA */}
      <div className="card p-6 text-center">
        <h3 className="text-base font-semibold text-[var(--text)] mb-2">Want this implemented?</h3>
        <p className="text-sm text-[var(--text-2)] mb-4 max-w-sm mx-auto">
          Book a free 30-min strategy call with Patrick. We&apos;ll prioritise your roadmap and scope the work.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <a href="https://calendly.com/patrick-ngige/growth-audit" target="_blank" rel="noopener noreferrer"
            className="btn-brand">Book strategy call</a>
          <a href="/services" className="btn-outline">View pricing</a>
        </div>
      </div>
    </div>
  );
}