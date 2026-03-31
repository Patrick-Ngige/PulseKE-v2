'use client'

import { useEffect, useState, useRef } from 'react'

interface RealTimeDataOptions {
  interval?: number // milliseconds between updates
  enabled?: boolean
}

/**
 * Hook for simulating real-time data updates
 * In production, this would connect to WebSocket or Server-Sent Events
 */
export function useRealTimeData<T>(
  initialData: T,
  updateFn: (prev: T) => T,
  options: RealTimeDataOptions = {}
) {
  const { interval = 30000, enabled = true } = options
  const [data, setData] = useState<T>(initialData)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!enabled) return

    // Simulate real-time updates
    intervalRef.current = setInterval(() => {
      setData(prev => {
        const updated = updateFn(prev)
        console.log('[v0] Real-time data updated')
        return updated
      })
    }, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [interval, enabled, updateFn])

  return data
}

/**
 * Simulate metric changes for demo purposes
 */
export function simulateMetricChange(value: number, variance = 0.05): number {
  const change = (Math.random() - 0.5) * 2 * (value * variance)
  return Math.max(0, Math.round((value + change) * 100) / 100)
}

/**
 * Generate trending indicator
 */
export function getTrendingDirection(
  current: number,
  previous: number
): 'up' | 'down' | 'flat' {
  const diff = current - previous
  if (Math.abs(diff) < 0.1) return 'flat'
  return diff > 0 ? 'up' : 'down'
}
