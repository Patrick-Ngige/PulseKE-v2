import clsx from 'clsx'
import type { ReactNode } from 'react'

// ── KPI CARD ──────────────────────────────────────────────────────────────
interface KpiCardProps {
  label:     string
  value:     string
  delta?:    string
  deltaUp?:  boolean
  progress?: number
  accent:    'blue' | 'green' | 'amber' | 'red'
  icon?:     ReactNode
  delay?:    number
}

const ACCENT = {
  blue:  { bar: 'var(--blue)',  glow: 'var(--blue-g)',  dim: 'var(--blue-d)'  },
  green: { bar: 'var(--green)', glow: 'var(--green-d)', dim: 'var(--green-d)' },
  amber: { bar: 'var(--amber)', glow: 'var(--amber-g)', dim: 'var(--amber-d)' },
  red:   { bar: 'var(--red)',   glow: 'var(--red-d)',   dim: 'var(--red-d)'   },
}

export function KpiCard({ label, value, delta, deltaUp, progress, accent, icon, delay = 0 }: KpiCardProps) {
  const a = ACCENT[accent]
  return (
    <div className="rounded-xl p-4 card-hover animate-fade-up"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--bdr)',
        animationDelay: `${delay}s`,
      }}>
      <div className="flex items-start justify-between mb-2">
        {icon && (
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: a.dim, color: a.bar }}>
            {icon}
          </div>
        )}
        {delta && (
          <span className={clsx(
            'text-[10px] font-mono px-2 py-0.5 rounded-full ml-auto',
            deltaUp ? 'text-green' : 'text-red'
          )}
            style={{ background: deltaUp ? 'var(--green-d)' : 'var(--red-d)' }}>
            {deltaUp ? '↑' : '↓'} {delta}
          </span>
        )}
      </div>
      <div className="text-[9px] font-mono uppercase tracking-[.08em] text-t3 mb-1.5">{label}</div>
      <div className="font-display font-bold text-t1 mb-2"
        style={{ fontSize: 'clamp(20px,3.5vw,28px)', letterSpacing: '-.02em' }}>
        {value}
      </div>
      {progress !== undefined && (
        <div className="h-[2px] rounded-full overflow-hidden" style={{ background: 'var(--bdr)' }}>
          <div className="h-full rounded-full animate-bar-in"
            style={{ width: `${progress}%`, background: a.bar, boxShadow: `0 0 6px ${a.glow}` }}/>
        </div>
      )}
    </div>
  )
}

// ── STATUS BADGE ──────────────────────────────────────────────────────────
type BadgeVariant = 'signed' | 'sent' | 'draft' | 'expired' | 'active' | 'completed' | 'paused' |
                   'processing' | 'scheduled' | 'paid' | 'failed' | 'review' | 'approved' | 'published' |
                   'critical' | 'warning' | 'monitoring'

const BADGE_STYLES: Record<BadgeVariant, { bg: string; text: string; dot?: string }> = {
  signed:     { bg: 'var(--green-d)', text: 'var(--green)',  dot: 'var(--green)'  },
  paid:       { bg: 'var(--green-d)', text: 'var(--green)',  dot: 'var(--green)'  },
  active:     { bg: 'var(--green-d)', text: 'var(--green)',  dot: 'var(--green)'  },
  approved:   { bg: 'var(--green-d)', text: 'var(--green)',  dot: 'var(--green)'  },
  published:  { bg: 'var(--blue-d)',  text: 'var(--blue)',   dot: 'var(--blue)'   },
  sent:       { bg: 'var(--amber-d)', text: 'var(--amber)',  dot: 'var(--amber)'  },
  processing: { bg: 'var(--blue-d)',  text: 'var(--blue)',   dot: 'var(--blue)'   },
  scheduled:  { bg: 'var(--amber-d)', text: 'var(--amber)',  dot: 'var(--amber)'  },
  warning:    { bg: 'var(--amber-d)', text: 'var(--amber)'  },
  monitoring: { bg: 'var(--amber-d)', text: 'var(--amber)'  },
  draft:      { bg: 'var(--hover)',   text: 'var(--t3)',     dot: 'var(--t3)'     },
  review:     { bg: 'var(--amber-d)', text: 'var(--amber)',  dot: 'var(--amber)'  },
  expired:    { bg: 'var(--red-d)',   text: 'var(--red)',    dot: 'var(--red)'    },
  failed:     { bg: 'var(--red-d)',   text: 'var(--red)',    dot: 'var(--red)'    },
  paused:     { bg: 'var(--hover)',   text: 'var(--t3)'     },
  completed:  { bg: 'var(--blue-d)',  text: 'var(--blue)'   },
  critical:   { bg: 'var(--red-d)',   text: 'var(--red)'    },
}

export function StatusBadge({ status }: { status: BadgeVariant }) {
  const s = BADGE_STYLES[status] ?? BADGE_STYLES.draft
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-mono font-medium uppercase tracking-[.05em] px-2 py-0.5 rounded"
      style={{ background: s.bg, color: s.text }}>
      {s.dot && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }}/>}
      {status}
    </span>
  )
}

// ── ALERT ITEM ────────────────────────────────────────────────────────────
interface AlertItemProps {
  name:     string
  platform: string
  severity: 'critical' | 'warning'
  current:  number
  quota:    number
  daysLeft: number
  gradient: string
  initials: string
  onNotify?: () => void
}

export function AlertItem({ name, platform, severity, current, quota, daysLeft, gradient, initials, onNotify }: AlertItemProps) {
  const pct    = Math.round((current / quota) * 100)
  const isCrit = severity === 'critical'
  return (
    <div className="rounded-[10px] p-3 relative overflow-hidden"
      style={{
        background: 'var(--card)',
        border: `1px solid ${isCrit ? 'rgba(240,69,74,.2)' : 'rgba(245,166,35,.2)'}`,
      }}>
      {/* left stripe */}
      <span className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r"
        style={{ background: isCrit ? 'var(--red)' : 'var(--amber)' }}/>

      <div className="flex items-center gap-2 mb-2 pl-1">
        <div className="w-7 h-7 rounded-[7px] flex items-center justify-center font-display text-[10px] font-bold text-white flex-shrink-0"
          style={{ background: gradient }}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-semibold text-t1 truncate">{name}</div>
          <div className="text-[9px] font-mono text-t3">{platform}</div>
        </div>
        <StatusBadge status={severity} />
      </div>

      {/* Quota bar */}
      <div className="flex items-center gap-2 pl-1">
        <div className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: 'var(--bdr)' }}>
          <div className="h-full rounded-full animate-bar-in"
            style={{
              width: `${pct}%`,
              background: isCrit ? 'var(--red)' : 'var(--amber)',
              boxShadow: `0 0 5px ${isCrit ? 'rgba(240,69,74,.5)' : 'rgba(245,166,35,.5)'}`,
            }}/>
        </div>
        <span className="text-[10px] font-mono text-t2 flex-shrink-0">
          <strong className="text-t1">{current}</strong>/{quota} posts
        </span>
      </div>

      <div className="flex items-center justify-between mt-2 pl-1">
        <span className="text-[9px] font-mono text-t3">{daysLeft} day{daysLeft !== 1 ? 's' : ''} left</span>
        <button onClick={onNotify}
          className="text-[10px] font-mono px-2 py-1 rounded text-blue transition-all"
          style={{ background: 'var(--blue-d)' }}>
          Notify →
        </button>
      </div>
    </div>
  )
}

// ── PAGE SHELL ────────────────────────────────────────────────────────────
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-[80px] lg:pb-6">
      {children}
    </div>
  )
}
