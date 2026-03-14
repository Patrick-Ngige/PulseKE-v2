'use client';
import { useState } from 'react';
import { AuditResult } from '@/lib/auditTypes';

const SAMPLES = [
  'https://piggyvest.com', 'https://cowrywise.com',
  'https://safaricom.co.ke', 'https://paystack.com', 'https://flutterwave.com',
];

const STEPS = [
  'Fetching real PageSpeed data',
  'Reading website content',
  'Analysing social profiles',
  'Checking Meta Ads Library',
  'Mining app store reviews',
  'Auditing reputation & reviews',
  'Researching competitor landscape',
  'Running 13-dimension analysis',
  'Writing 90-day roadmap',
  'Generating Stitch redesign prompts',
];

const FOCUS = ['Full audit', 'More traffic', 'Better conversion', 'Retention', 'Lower CAC'];

interface Props { onResult: (r: AuditResult) => void; compact?: boolean; }

export default function AuditLauncher({ onResult, compact = false }: Props) {
  const [url,     setUrl]     = useState('');
  const [focus,   setFocus]   = useState('Full audit');
  const [loading, setLoading] = useState(false);
  const [step,    setStep]    = useState(0);
  const [error,   setError]   = useState('');

  async function run() {
    if (!url.trim() || !url.startsWith('http')) {
      setError('Please enter a valid URL starting with https://');
      return;
    }
    setError('');
    setLoading(true);
    setStep(0);

    const iv = setInterval(() => setStep(s => Math.min(s + 1, STEPS.length - 1)), 3800);

    try {
      const res = await fetch('/api/audit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ url: url.trim(), focus }),
      });
      clearInterval(iv);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? 'Audit failed'); }
      const result: AuditResult = await res.json();
      onResult(result);
    } catch (e: any) {
      clearInterval(iv);
      setError(e.message);
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center gap-5 py-10 text-center">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-[var(--border)]" />
        <div className="absolute inset-0 rounded-full border-4 border-t-[var(--brand)] animate-spin" />
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--text)] mb-1">
          Analysing {(() => { try { return new URL(url).hostname; } catch { return url; } })()}
        </p>
        <p className="text-xs text-[var(--text-3)] transition-all">{STEPS[step]}…</p>
      </div>
      <div className="flex flex-wrap justify-center gap-1 max-w-xs">
        {STEPS.map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
            i < step ? 'bg-[var(--good)]' : i === step ? 'bg-[var(--brand)]' : 'bg-[var(--border)]'
          }`} />
        ))}
      </div>
      <p className="text-xs text-[var(--text-3)]">Full 13-dimension audit · 60–90 seconds</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* URL */}
      <div>
        {!compact && <label className="label block mb-2">Website URL</label>}
        <input
          type="url" value={url}
          onChange={e => { setUrl(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && run()}
          placeholder="https://yourcompany.com"
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text)] placeholder-[var(--text-3)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition-colors"
        />
        {/* Sample pills */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className="text-[10px] text-[var(--text-3)] self-center font-mono">Try:</span>
          {SAMPLES.map(s => (
            <button key={s} onClick={() => setUrl(s)}
              className="text-[10px] font-mono px-2 py-1 rounded-md bg-[var(--bg-subtle)] text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[var(--border)] transition-colors">
              {new URL(s).hostname.replace('www.','')}
            </button>
          ))}
        </div>
      </div>

      {/* Focus */}
      {!compact && (
        <div>
          <label className="label block mb-2">Audit focus</label>
          <div className="flex flex-wrap gap-2">
            {FOCUS.map(f => (
              <button key={f} onClick={() => setFocus(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  focus === f
                    ? 'bg-[var(--brand-bg)] border-[var(--brand)]/40 text-[var(--brand)]'
                    : 'border-[var(--border)] text-[var(--text-2)] hover:border-[var(--text-3)]'
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-[var(--poor)] bg-[var(--poor-bg)] rounded-lg px-3 py-2">{error}</p>
      )}

      {/* Submit */}
      <button onClick={run} className="btn-brand w-full py-3 text-sm">
        Run growth audit
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>

      {/* What's included */}
      {!compact && (
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-1">
          {[
            '13 dimensions scored','Real PageSpeed data',
            'Social media audit','App store analysis',
            'Paid ads intelligence','Reputation & reviews',
            'Growth loop diagnosis','Magic moment analysis',
            '90-day roadmap','Stitch redesign prompts',
            "Patrick's POV",'Further reading',
          ].map(item => (
            <div key={item} className="flex items-center gap-1.5 text-xs text-[var(--text-3)]">
              <svg className="w-3 h-3 text-[var(--good)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
