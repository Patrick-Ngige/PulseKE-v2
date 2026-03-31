'use client'

import { Influencer } from '@/data/kenya'
import { X, TrendingUp } from 'lucide-react'

interface ComparisonViewProps {
  influencers: Influencer[]
  onClose: () => void
}

export function ComparisonView({ influencers, onClose }: ComparisonViewProps) {
  if (influencers.length === 0) return null

  const metrics = [
    { label: 'Total Followers', key: 'totalFollowers', format: (v: number) => `${(v/1000000).toFixed(1)}M` },
    { label: 'Avg Engagement', key: 'avgEngagement', format: (v: number) => `${v.toFixed(1)}%` },
    { label: 'AI Safety Score', key: 'aiScore', format: (v: number) => `${v}%` },
    { label: 'Active Campaigns', key: 'activeCampaigns', format: (v: number) => v },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-auto" style={{ background: 'var(--panel)' }}>
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--bdr)' }}>
          <div>
            <h2 className="text-xl font-bold text-t1">Influencer Comparison</h2>
            <p className="text-[12px] font-mono text-t3 mt-1">Side-by-side metrics analysis</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-light rounded-lg transition-colors">
            <X size={20} className="text-t3 hover:text-t1" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--bdr)', background: 'var(--blue-light)' }}>
                <th className="p-4 text-left text-[11px] font-mono font-bold text-t1">Metric</th>
                {influencers.map(inf => (
                  <th key={inf.id} className="p-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold text-white text-sm" style={{ background: inf.gradient }}>
                        {inf.initials}
                      </div>
                      <div className="text-[11px] font-mono font-bold text-t1">{inf.name}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, idx) => {
                const values = influencers.map(inf => {
                  const val = (inf as any)[metric.key]
                  return val
                })
                const maxVal = Math.max(...values.filter(v => typeof v === 'number'))

                return (
                  <tr key={metric.key} style={{ borderBottom: '1px solid var(--bdr)' }}>
                    <td className="p-4 text-[11px] font-mono font-semibold text-t2">{metric.label}</td>
                    {influencers.map((inf, i) => {
                      const val = values[i]
                      const isMax = val === maxVal && typeof val === 'number'
                      const formatted = typeof val === 'number' ? metric.format(val) : val

                      return (
                        <td key={inf.id} className="p-4 text-center">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold ${isMax ? 'bg-green/20 text-green' : ''}`}>
                            {formatted}
                            {isMax && <TrendingUp size={12} />}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t" style={{ borderColor: 'var(--bdr)', background: 'var(--blue-light)' }}>
          <p className="text-[10px] font-mono text-blue">
            💡 Tip: The highest value in each metric is highlighted in green. Use this data to make informed decisions about influencer partnerships.
          </p>
        </div>
      </div>
    </div>
  )
}
