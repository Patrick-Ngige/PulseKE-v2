'use client'

import { ReactNode } from 'react'
import { X } from 'lucide-react'

interface DetailModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  width?: 'sm' | 'md' | 'lg' | 'xl'
}

export function DetailModal({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = 'md',
}: DetailModalProps) {
  if (!open) return null

  const widthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  }[width]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className={`relative ${widthClass} max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl`}
        style={{ background: 'var(--panel)', border: '1px solid var(--bdr)' }}>
        
        {/* Header */}
        <div className="sticky top-0 flex items-start justify-between gap-4 p-6 border-b flex-shrink-0"
          style={{ borderColor: 'var(--bdr)', background: 'var(--panel)' }}>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-lg font-bold text-t1">{title}</h2>
            {subtitle && <p className="text-[11px] font-mono text-t3 mt-1">{subtitle}</p>}
          </div>
          <button onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-t3 hover:text-t1 transition-colors cursor-pointer"
            style={{ background: 'var(--card)', border: '1px solid var(--bdr)' }}>
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
