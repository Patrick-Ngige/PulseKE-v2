'use client'

import { X } from 'lucide-react'
import { Shortcut } from '@/hooks/useKeyboardShortcuts'

interface KeyboardShortcutsModalProps {
  open: boolean
  onClose: () => void
  shortcuts: Shortcut[]
}

export function KeyboardShortcutsModal({ open, onClose, shortcuts }: KeyboardShortcutsModalProps) {
  if (!open) return null

  const groupedShortcuts = {
    'Navigation': shortcuts.filter(s => ['dashboard', 'discovery', 'campaigns', 'analytics'].some(x => s.label.includes(x))),
    'General': shortcuts.filter(s => !['dashboard', 'discovery', 'campaigns', 'analytics'].some(x => s.label.includes(x))),
  }

  const formatKey = (shortcut: Shortcut) => {
    const parts = []
    if (shortcut.ctrl) parts.push('Ctrl')
    if (shortcut.shift) parts.push('Shift')
    if (shortcut.alt) parts.push('Alt')
    if (shortcut.meta) parts.push('Cmd')
    if (shortcut.key !== 'Escape') parts.push(shortcut.key.toUpperCase())
    else parts.push('Esc')
    return parts.join(' + ')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto" style={{ background: 'var(--panel)' }}>
        <div className="flex items-center justify-between p-6 border-b sticky top-0" style={{ borderColor: 'var(--bdr)', background: 'var(--panel)' }}>
          <div>
            <h2 className="text-xl font-bold text-t1">Keyboard Shortcuts</h2>
            <p className="text-[12px] font-mono text-t3 mt-1">Power user features for faster navigation</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-light rounded-lg transition-colors cursor-pointer">
            <X size={20} className="text-t3 hover:text-t1" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {Object.entries(groupedShortcuts).map(([group, items]) => (
            items.length > 0 && (
              <div key={group}>
                <h3 className="text-[11px] font-mono font-bold text-t3 uppercase mb-3">{group}</h3>
                <div className="space-y-2">
                  {items.map((shortcut) => (
                    <div key={shortcut.label} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--blue-light)' }}>
                      <div>
                        <p className="text-[11px] font-mono font-bold text-t1">{shortcut.description}</p>
                        <p className="text-[10px] font-mono text-t3">{shortcut.label}</p>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded font-mono text-[10px] font-bold" style={{ background: 'var(--card)', border: '1px solid var(--bdr)', color: 'var(--blue)' }}>
                        {formatKey(shortcut)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>

        <div className="p-4 border-t" style={{ borderColor: 'var(--bdr)', background: 'var(--amber-light)' }}>
          <p className="text-[10px] font-mono text-amber font-semibold">
            💡 Tip: Press ? anywhere to show these shortcuts
          </p>
        </div>
      </div>
    </div>
  )
}
