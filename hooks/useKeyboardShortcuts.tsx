'use client'

import { useEffect } from 'react'

export interface Shortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  label: string
  description: string
  handler: () => void
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const matches =
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          !!e.ctrlKey === !!shortcut.ctrl &&
          !!e.shiftKey === !!shortcut.shift &&
          !!e.altKey === !!shortcut.alt &&
          !!e.metaKey === !!shortcut.meta

        if (matches) {
          e.preventDefault()
          shortcut.handler()
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

export const COMMON_SHORTCUTS = {
  search: { key: 'k', ctrl: true, label: 'Cmd+K', description: 'Open search' },
  escape: { key: 'Escape', label: 'Esc', description: 'Close dialog' },
  help: { key: '?', shift: true, label: '⇧+?', description: 'Show help' },
  dashboard: { key: 'd', ctrl: true, label: 'Cmd+D', description: 'Go to dashboard' },
  discovery: { key: 'e', ctrl: true, label: 'Cmd+E', description: 'Go to discovery' },
  campaigns: { key: 'c', ctrl: true, label: 'Cmd+C', description: 'Go to campaigns' },
}
