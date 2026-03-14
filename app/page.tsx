'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuditLauncher from '@/components/audit/AuditLauncher';
import AuditReport   from '@/components/audit/AuditReport';
import { AuditResult } from '@/lib/auditTypes';

const EXAMPLE_AUDITS = [
  { name: 'Safaricom',    score: 69, desc: 'Category king — website behind'     },
  { name: 'PiggyVest',    score: 74, desc: 'Strong product, quiet marketing'    },
  { name: 'Cowrywise',    score: 68, desc: 'Losing the narrative war'            },
  { name: 'Paystack',     score: 71, desc: 'Product ahead of its marketing'     },
  { name: 'Network Intl', score: 66, desc: 'Enterprise brand, slow website'     },
];

function ScoreBadge({ score }: { score: number }) {
  const cls = score >= 75 ? 'bg-[var(--good-bg)] text-[var(--good)]'
            : score >= 50 ? 'bg-[var(--warn-bg)] text-[var(--warn)]'
            :                'bg-[var(--poor-bg)] text-[var(--poor)]';
  return (
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-mono font-bold flex-shrink-0 ${cls}`}>
      {score}
    </div>
  );
}

export default function Home() {
  const [result, setResult] = useState<AuditResult | null>(null);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container">
        {/* Hero */}
        {!result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mb-12">
            <p className="label mb-3">Ngige Growth Audit Framework · v6</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)] leading-tight mb-4">
              Free full-funnel growth audit
              <span className="text-[var(--brand)]">.</span>
            </h1>
            <p className="text-base text-[var(--text-2)] leading-relaxed">
              Consultant-grade audit across 13 dimensions — social presence, app store, paid media,
              reputation, conversion, technical performance, and more. With Patrick&apos;s strategic POV
              and a 90-day roadmap. Free. No signup.
            </p>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left — Launcher */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="card p-5">
                {result && (
                  <p className="label mb-4">Run another audit</p>
                )}
                <AuditLauncher
                  onResult={(r) => {
                    setResult(r);
                    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                  }}
                  compact={!!result}
                />
              </div>

              {/* Example audits */}
              {!result && (
                <div className="mt-5 space-y-2">
                  <p className="label">Example audits</p>
                  {EXAMPLE_AUDITS.map(({ name, score, desc }) => (
                    <div key={name} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-subtle)]">
                      <ScoreBadge score={score} />
                      <div>
                        <p className="text-sm font-medium text-[var(--text)]">{name}</p>
                        <p className="text-xs text-[var(--text-3)]">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right — Report / Empty state */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div key="report"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <AuditReport result={result} onReset={() => setResult(null)} />
                </motion.div>
              ) : (
                <motion.div key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center min-h-[400px] rounded-2xl border-2 border-dashed border-[var(--border)] text-center p-10">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--brand-bg)] flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-[var(--text)] mb-2">Your audit report appears here</h2>
                  <p className="text-sm text-[var(--text-3)] max-w-xs">
                    Enter any URL and click &ldquo;Run growth audit&rdquo; — 13 dimensions, Patrick&apos;s POV, 90-day roadmap.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
