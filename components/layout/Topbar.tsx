'use client'
import Link from 'next/link'
import { Bell, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
interface TopbarProps {
  title:    string
  subtitle?: string
  children?: React.ReactNode
}

export default function Topbar({ title, subtitle, children }: TopbarProps) {
  const { theme, toggleTheme, mounted } = useTheme()

  return (
    <header className="h-[54px] flex items-center gap-3 px-4 flex-shrink-0"
      style={{ background: 'var(--panel)', borderBottom: '1px solid var(--bdr)' }}>

      {/* Mobile brand */}
      <Link href="/dashboard" className="lg:hidden flex items-center gap-2 flex-shrink-0">
        <div className="w-7 h-7 rounded-[7px] flex items-center justify-center"
          style={{ background: 'var(--blue)' }}>
          <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
          </svg>
        </div>
        <span className="font-display text-sm font-bold tracking-tight text-t1">PulseKE</span>
      </Link>

      <div className="hidden lg:block w-px h-5 flex-shrink-0" style={{ background: 'var(--bdr)' }}/>

      <div className="flex flex-col min-w-0">
        <span className="font-display text-[13px] font-bold tracking-tight text-t1 leading-tight">{title}</span>
        {subtitle && <span className="text-[10px] font-mono text-t3 leading-tight">{subtitle}</span>}
      </div>

      <div className="ml-auto flex items-center gap-2">
        {children}
        {mounted && (
          <button 
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-t2 hover:text-blue transition-colors cursor-pointer"
            style={{ background: 'var(--card)', border: '1px solid var(--bdr)' }}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        )}
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-t2 hover:text-blue transition-colors relative cursor-pointer"
          style={{ background: 'var(--card)', border: '1px solid var(--bdr)' }}>
          <Bell size={14} />
          <span className="absolute top-[5px] right-[5px] w-[7px] h-[7px] rounded-full border-2"
            style={{ background: 'var(--amber)', borderColor: 'var(--panel)', boxShadow: '0 0 5px var(--amber-g)' }}/>
        </button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center font-display text-[10px] font-bold text-white cursor-pointer"
          style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}>
          AR
        </div>
      </div>
    </header>
  )
}
