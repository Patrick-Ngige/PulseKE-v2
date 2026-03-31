'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Megaphone, Search, BarChart2, MessageSquare } from 'lucide-react'
import clsx from 'clsx'

const MOBILE_NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/campaigns', icon: Megaphone,       label: 'Campaigns' },
  { href: '/discovery', icon: Search,          label: 'Discover'  },
  { href: '/analytics', icon: BarChart2,       label: 'Analytics' },
  { href: '/hub',       icon: MessageSquare,   label: 'Hub'       },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-[70px] flex z-30"
      style={{ background: 'var(--panel)', borderTop: '1px solid var(--bdr)' }}>
      {MOBILE_NAV.map(item => {
        const active = pathname.startsWith(item.href)
        const Icon   = item.icon
        return (
          <Link key={item.href} href={item.href}
            className={clsx(
              'flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-150 relative cursor-pointer active:scale-95',
              active ? 'text-blue' : 'text-t3 hover:text-t2'
            )}>
            {active && (
              <span className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-b-lg bg-blue" />
            )}
            <div className={clsx(
              'p-2 rounded-lg transition-colors',
              active ? 'bg-blue-light' : 'hover:bg-slate-light dark:hover:bg-slate-dark'
            )}>
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            </div>
            <span className="text-[8px] font-mono font-semibold px-1 text-center">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
