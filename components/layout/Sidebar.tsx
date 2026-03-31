'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Megaphone, Search, BarChart2, MessageSquare, FileText, CreditCard, Sparkles, Settings } from 'lucide-react'
import clsx from 'clsx'

const NAV = [
  { href: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard'  },
  { href: '/campaigns',   icon: Megaphone,       label: 'Campaigns'  },
  { href: '/discovery',   icon: Search,          label: 'Discovery'  },
  { href: '/analytics',   icon: BarChart2,       label: 'Analytics'  },
  { href: '/hub',         icon: MessageSquare,   label: 'Hub'        },
  { href: '/contracts',   icon: FileText,        label: 'Contracts'  },
  { href: '/payments',    icon: CreditCard,      label: 'Payments'   },
  { href: '/ai-insights', icon: Sparkles,        label: 'AI Insights'},
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex w-[60px] flex-col items-center py-5 gap-1.5 flex-shrink-0 z-20"
      style={{ background: 'var(--panel)', borderRight: '1px solid var(--bdr)' }}>

      {/* Logo */}
      <Link href="/dashboard" className="w-[34px] h-[34px] rounded-lg flex items-center justify-center mb-5 flex-shrink-0"
        style={{ background: 'var(--blue)', boxShadow: '0 0 16px var(--blue-g)' }}>
        <svg viewBox="0 0 24 24" fill="white" className="w-[18px] h-[18px]">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
        </svg>
      </Link>

      {/* Nav items */}
      {NAV.map(item => {
        const active = pathname.startsWith(item.href)
        const Icon   = item.icon
        return (
          <Link key={item.href} href={item.href} title={item.label}
            className={clsx(
              'w-[38px] h-[38px] rounded-lg flex items-center justify-center transition-all duration-150 relative flex-shrink-0 cursor-pointer group',
              active
                ? 'text-white'
                : 'text-t3 hover:text-white hover:scale-110'
            )}
            style={active ? { background: 'var(--blue)' } : { background: 'transparent', borderRadius: '8px' }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.background = 'var(--blue-light)'
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            {active && (
              <span className="absolute left-[-1px] w-[3px] h-[18px] rounded-r bg-white" />
            )}
            <Icon size={17} />
            {/* Link indicator for non-active items */}
            {!active && (
              <span className="absolute inset-0 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ border: '1px solid var(--blue)' }} />
            )}
          </Link>
        )
      })}

      {/* Bottom */}
      <div className="mt-auto flex flex-col items-center gap-2">
        <Link href="/settings" title="Settings"
          className="w-[38px] h-[38px] rounded-lg flex items-center justify-center text-t3 hover:text-t2 transition-colors"
          style={{ background: 'transparent' }}>
          <Settings size={17} />
        </Link>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-display text-[10px] font-bold cursor-pointer"
          style={{ background: 'linear-gradient(135deg,#2f7cf6,#7c3aed)' }}>
          AR
        </div>
      </div>
    </aside>
  )
}
