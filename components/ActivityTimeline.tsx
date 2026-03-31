'use client'

import { CheckCircle, AlertCircle, Clock, Users, Camera, FileText } from 'lucide-react'

interface TimelineEvent {
  id: string
  timestamp: Date
  type: 'milestone' | 'alert' | 'pending'
  title: string
  description: string
  metadata?: Record<string, any>
}

interface ActivityTimelineProps {
  events: TimelineEvent[]
  title?: string
}

export function ActivityTimeline({ events, title = 'Campaign Timeline' }: ActivityTimelineProps) {
  const sortedEvents = [...events].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  const getIcon = (type: string) => {
    switch (type) {
      case 'milestone': return <CheckCircle size={18} className="text-green" />
      case 'alert': return <AlertCircle size={18} className="text-amber" />
      case 'pending': return <Clock size={18} className="text-blue" />
      default: return <Clock size={18} className="text-t3" />
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'milestone': return 'var(--green)'
      case 'alert': return 'var(--amber)'
      case 'pending': return 'var(--blue)'
      default: return 'var(--t3)'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[13px] font-bold text-t1 mb-1">{title}</h3>
        <p className="text-[11px] font-mono text-t3">{events.length} events</p>
      </div>

      <div className="space-y-4">
        {sortedEvents.map((event, idx) => (
          <div key={event.id} className="relative flex gap-4">
            {/* Timeline line */}
            {idx < sortedEvents.length - 1 && (
              <div className="absolute left-[8.5px] top-[40px] bottom-0 w-px" style={{ background: 'var(--bdr)' }} />
            )}

            {/* Timeline dot and icon */}
            <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full relative z-10" style={{ background: 'var(--panel)', border: `2px solid ${getColor(event.type)}` }}>
              {getIcon(event.type)}
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex items-baseline gap-2 mb-1">
                <h4 className="text-[11px] font-mono font-bold text-t1">{event.title}</h4>
                <span className="text-[9px] font-mono text-t3">
                  {event.timestamp.toLocaleDateString()} {event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-[10px] font-mono text-t2 mb-2">{event.description}</p>

              {event.metadata && Object.keys(event.metadata).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(event.metadata).map(([key, value]) => (
                    <span key={key} className="text-[9px] font-mono px-2 py-1 rounded" style={{ background: 'var(--blue-light)', color: 'var(--blue)' }}>
                      {key}: {String(value)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
