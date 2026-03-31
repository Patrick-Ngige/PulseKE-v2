'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
  active?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 px-4 py-3 text-[11px] font-mono flex-shrink-0"
      style={{ background: 'var(--panel)', borderBottom: '1px solid var(--bdr)' }}>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          {item.href && !item.active ? (
            <Link href={item.href}
              className="text-blue hover:underline cursor-pointer transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className={item.active ? 'text-t1 font-semibold' : 'text-t3'}>
              {item.label}
            </span>
          )}
          {idx < items.length - 1 && (
            <ChevronRight size={12} className="text-t3" strokeWidth={3} />
          )}
        </div>
      ))}
    </nav>
  )
}
