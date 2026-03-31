'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Sidebar   from '@/components/layout/Sidebar'
import Topbar    from '@/components/layout/Topbar'
import BottomNav from '@/components/layout/BottomNav'
import { Breadcrumb } from '@/components/Breadcrumb'
import { KeyboardShortcutsModal } from '@/components/KeyboardShortcutsModal'
import { KpiCard, AlertItem, PageShell } from '@/components/ui'
import { ALERTS, CAMPAIGNS, ANALYTICS, formatKES } from '@/data/kenya'
import { Users, Globe, Heart, CheckCircle, Mail, AlertTriangle } from 'lucide-react'
import { useKeyboardShortcuts, type Shortcut } from '@/hooks/useKeyboardShortcuts'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler)

type Period = '7d' | '30d' | '90d'

export default function DashboardPage() {
  const router = useRouter()
  const [period, setPeriod] = useState<Period>('7d')
  const [alertsOpen, setAlertsOpen] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const series = ANALYTICS.engagementSeries[period]

  const shortcuts: Shortcut[] = [
    { key: 'd', ctrl: true, label: 'Cmd+D', description: 'Dashboard (current)', handler: () => {} },
    { key: 'e', ctrl: true, label: 'Cmd+E', description: 'Discovery', handler: () => router.push('/discovery') },
    { key: 'c', ctrl: true, label: 'Cmd+C', description: 'Campaigns', handler: () => router.push('/campaigns') },
    { key: 'a', ctrl: true, label: 'Cmd+A', description: 'Analytics', handler: () => router.push('/analytics') },
    { key: '?', shift: true, label: 'Shift+?', description: 'Show shortcuts', handler: () => setShowShortcuts(true) },
  ]

  useKeyboardShortcuts(shortcuts)

  const chartData = {
    labels: series.labels,
    datasets: [
      {
        label: 'Reach (K)',
        data: series.reach,
        backgroundColor: 'rgba(47,124,246,0.25)',
        borderColor: '#2f7cf6',
        borderWidth: 1.5,
        borderRadius: 4,
        yAxisID: 'y',
        order: 2,
        type: 'bar' as const,
      },
      {
        label: 'Engagement %',
        data: series.eng,
        borderColor: '#28d98d',
        borderWidth: 2,
        pointBackgroundColor: '#28d98d',
        pointRadius: 3,
        tension: 0.4,
        fill: false,
        yAxisID: 'y1',
        order: 1,
        type: 'line' as const,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0d1524',
        borderColor: '#1e3050',
        borderWidth: 1,
        titleFont: { family: 'DM Mono', size: 10 },
        bodyFont:  { family: 'DM Mono', size: 10 },
        titleColor: '#8ba3c4',
        bodyColor:  '#e8eef8',
      },
    },
    scales: {
      x:  { grid: { color: 'rgba(30,48,80,.4)' }, ticks: { font: { family: 'DM Mono', size: 9 }, color: '#4d6585' }, border: { display: false } },
      y:  { position: 'left'  as const, grid: { color: 'rgba(30,48,80,.4)' }, ticks: { font: { family: 'DM Mono', size: 9 }, color: '#4d6585' }, border: { display: false } },
      y1: { position: 'right' as const, grid: { display: false }, ticks: { font: { family: 'DM Mono', size: 9 }, color: '#4d6585', callback: (v: number|string) => `${v}%` }, border: { display: false } },
    },
  }

  const activeCampaign = CAMPAIGNS[0]

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar title="Campaign Dashboard" subtitle={`// ${activeCampaign.name} · Nairobi, KE`}>
          {/* Campaign selector */}
          <select className="hidden md:block h-8 px-3 rounded-lg text-t1 text-[11px] font-mono outline-none cursor-pointer"
            style={{ background: 'var(--card)', border: '1px solid var(--bdr)' }}>
            {CAMPAIGNS.filter(c => c.status === 'active').map(c => (
              <option key={c.id}>{c.name}</option>
            ))}
          </select>
          {/* Period tabs */}
          {(['7d','30d','90d'] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className="h-8 px-3 rounded-lg text-[10px] font-mono transition-all cursor-pointer"
              style={{
                background: period === p ? 'var(--blue)' : 'transparent',
                border: `1px solid ${period === p ? 'var(--blue)' : 'var(--bdr)'}`,
                color: period === p ? 'white' : 'var(--t3)',
              }}>
              {p.toUpperCase()}
            </button>
          ))}
        </Topbar>

        <Breadcrumb items={[
          { label: 'Dashboard', active: true },
        ]}/>

        {/* Alerts bar (mobile) */}
        <button onClick={() => setAlertsOpen(!alertsOpen)}
          className="flex items-center gap-3 px-4 py-2 text-left w-full transition-all lg:hidden flex-shrink-0"
          style={{ background: 'rgba(245,166,35,.08)', borderBottom: '1px solid rgba(245,166,35,.2)' }}>
          <span className="w-2 h-2 rounded-full pulse-dot flex-shrink-0" style={{ background: 'var(--amber)' }}/>
          <span className="text-[12px] font-mono text-amber flex-1">{ALERTS.length} threshold breaches — tap to view</span>
          <span className="text-[10px] font-mono text-amber">{alertsOpen ? '▲' : '▼'}</span>
        </button>

        {/* Mobile alerts drawer */}
        {alertsOpen && (
          <div className="lg:hidden flex-shrink-0 grid grid-cols-1 gap-2 p-3 overflow-y-auto max-h-52"
            style={{ background: 'var(--panel)', borderBottom: '1px solid var(--bdr)' }}>
            {ALERTS.map(a => (
              <AlertItem key={a.id} {...a} onNotify={() => alert(`Notifying ${a.name}…`)} />
            ))}
            <button className="w-full py-2 text-[11px] font-mono rounded-lg transition-all"
              style={{ background: 'var(--amber-d)', border: '1px solid var(--amber)', color: 'var(--amber)' }}>
              Notify All Pending
            </button>
          </div>
        )}

        <PageShell>
          {/* Desktop alerts strip */}
          <div className="hidden lg:block mb-4 rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(245,166,35,.25)', background: 'rgba(245,166,35,.06)' }}>
            <div className="flex items-center gap-3 px-4 py-2.5 border-b" style={{ borderColor: 'rgba(245,166,35,.15)' }}>
              <AlertTriangle size={14} style={{ color: 'var(--amber)' }} />
              <span className="text-[11px] font-mono font-medium" style={{ color: 'var(--amber)' }}>
                THRESHOLD BREACH — {ALERTS.length} ALERTS
              </span>
              <button className="ml-auto text-[10px] font-mono px-3 py-1 rounded-lg transition-all"
                style={{ background: 'var(--amber-d)', border: '1px solid var(--amber)', color: 'var(--amber)' }}>
                Notify All
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2.5 p-3">
              {ALERTS.map(a => (
                <AlertItem key={a.id} {...a} onNotify={() => {}} />
              ))}
            </div>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <KpiCard label="Active Influencers" value="8" delta="2 this month" deltaUp accent="blue"
              progress={80} icon={<Users size={14}/>} delay={0.04} />
            <KpiCard label="Total Reach" value={ANALYTICS.totalReach} delta="5.2% this week" deltaUp accent="green"
              progress={84} icon={<Globe size={14}/>} delay={0.08} />
            <KpiCard label="Avg Engagement" value={`${ANALYTICS.avgEngagement}%`} delta="0.4% drop" deltaUp={false} accent="amber"
              progress={61} icon={<Heart size={14}/>} delay={0.12} />
            <KpiCard label="Campaign Progress" value={`${activeCampaign.progress}%`} delta="On track" deltaUp accent="blue"
              progress={activeCampaign.progress} icon={<CheckCircle size={14}/>} delay={0.16} />
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Engagement chart */}
            <div className="lg:col-span-2 rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--bdr)' }}>
              <div className="flex items-center justify-between p-4 pb-0">
                <div>
                  <div className="font-display text-[13px] font-bold text-t1">Engagement Over Time</div>
                  <div className="text-[10px] font-mono text-t3">// Reach × Engagement · Nairobi EAT</div>
                </div>
                <div className="flex gap-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-t3">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--blue)' }}/>Reach
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-t3">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--green)' }}/>Eng
                  </div>
                </div>
              </div>
              <div className="p-4" style={{ height: '220px' }}>
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Platform split */}
            <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--bdr)' }}>
              <div className="p-4 pb-2">
                <div className="font-display text-[13px] font-bold text-t1">Platform Split</div>
                <div className="text-[10px] font-mono text-t3">// Content distribution</div>
              </div>
              <div className="p-4 pt-2 flex flex-col gap-3">
                {ANALYTICS.platforms.map(p => (
                  <div key={p.code}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-[5px] flex items-center justify-center text-white text-[8px] font-bold"
                          style={{ background: p.color }}>{p.code.toUpperCase()}</div>
                        <span className="text-[12px] font-medium text-t1">{p.name}</span>
                      </div>
                      <div className="flex gap-3 text-[10px] font-mono text-t3">
                        <span>Reach <span className="text-t2">{p.reach}</span></span>
                        <span>Eng <span className="text-green">{p.eng}%</span></span>
                      </div>
                    </div>
                    <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'var(--bdr)' }}>
                      <div className="h-full rounded-full animate-bar-in" style={{ width: `${p.pct}%`, background: p.barColor }}/>
                    </div>
                    <div className="text-[9px] font-mono text-t3 text-right mt-0.5">{p.pct}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent posts */}
            <div className="lg:col-span-3 rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--bdr)' }}>
              <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--bdr)' }}>
                <div>
                  <div className="font-display text-[13px] font-bold text-t1">Recent Campaign Posts</div>
                  <div className="text-[10px] font-mono text-t3">// Live activity feed · EAT timezone</div>
                </div>
                <Link href="/analytics" className="text-[11px] font-mono text-blue hover:opacity-70 transition-opacity">View all →</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead style={{ borderBottom: '1px solid var(--bdr)', background: 'rgba(22,34,56,.4)' }}>
                    <tr>
                      {['Influencer','Platform','Post','Likes','Engagement'].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left text-[9px] font-mono uppercase tracking-[.09em] text-t3 font-normal last:text-right">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name:'Amina Mwangi',  init:'AM', plat:'IG', grad:'linear-gradient(135deg,#1a1060,#2f7cf6)', link:'ig.me/p/am01',  likes:'18.4K', eng:6.5, engColor:'var(--green)' },
                      { name:'Peter Otieno',  init:'PO', plat:'TT', grad:'linear-gradient(135deg,#1a1060,#7c3aed)', link:'tt.com/v/po07',  likes:'94.2K', eng:12.5,engColor:'var(--green)' },
                      { name:'Faith Ochieng', init:'FO', plat:'TT', grad:'linear-gradient(135deg,#0f3443,#34e89e)', link:'tt.com/v/fo03',  likes:'41.0K', eng:9.2, engColor:'var(--green)' },
                      { name:'Brian Kamau',   init:'BK', plat:'YT', grad:'linear-gradient(135deg,#0f2027,#2c5364)', link:'yt.com/w/bk02',  likes:'8.2K',  eng:4.2, engColor:'var(--t2)'    },
                      { name:'Njeri Kamau',   init:'NJ', plat:'IG', grad:'linear-gradient(135deg,#833ab4,#fd1d1d)', link:'ig.me/p/nj05',  likes:'21.9K', eng:4.2, engColor:'var(--t2)'    },
                    ].map((r, i) => (
                      <tr key={i} className="border-b last:border-b-0 transition-colors hover:bg-[var(--hover)] cursor-pointer"
                        style={{ borderColor: 'var(--bdr)' }}>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-[7px] flex items-center justify-center font-display text-[9px] font-bold text-white flex-shrink-0"
                              style={{ background: r.grad }}>{r.init}</div>
                            <span className="text-[12px] font-medium text-t1">{r.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded"
                            style={{
                              background: r.plat==='IG' ? 'rgba(240,148,51,.1)' : r.plat==='TT' ? 'rgba(105,201,208,.1)' : 'rgba(255,85,85,.1)',
                              color: r.plat==='IG' ? '#f09433' : r.plat==='TT' ? '#69c9d0' : '#ff5555',
                              border: `1px solid ${r.plat==='IG' ? 'rgba(240,148,51,.3)' : r.plat==='TT' ? 'rgba(105,201,208,.3)' : 'rgba(255,85,85,.3)'}`,
                            }}>
                            {r.plat}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <a href={`https://${r.link.replace('ig.me/', 'instagram.com/').replace('tt.com/v/', 'tiktok.com/@').replace('yt.com/w/', 'youtube.com/watch?v=')}`} 
                            target="_blank" rel="noopener noreferrer"
                            className="text-[11px] font-mono text-blue hover:underline flex items-center gap-1">
                            ↗ {r.link}…
                          </a>
                        </td>
                        <td className="px-4 py-2.5 text-right text-[11px] font-mono text-t1">{r.likes}</td>
                        <td className="px-4 py-2.5 text-right text-[11px] font-mono font-medium" style={{ color: r.engColor }}>{r.eng}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </PageShell>
      </div>
      <BottomNav />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        open={showShortcuts}
        onClose={() => setShowShortcuts(false)}
        shortcuts={shortcuts}
      />
    </div>
  )
}
