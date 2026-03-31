'use client'
import { useState, useCallback } from 'react'
import Sidebar   from '@/components/layout/Sidebar'
import Topbar    from '@/components/layout/Topbar'
import BottomNav from '@/components/layout/BottomNav'
import { Breadcrumb } from '@/components/Breadcrumb'
import { ActivityTimeline } from '@/components/ActivityTimeline'
import { PageShell } from '@/components/ui'
import { INFLUENCERS, CAMPAIGNS, formatKES } from '@/data/kenya'
import { ChevronDown, ChevronUp, X, Check, AlertCircle, ArrowLeft, Users, Download } from 'lucide-react'
import { exportCampaignsToCSV } from '@/lib/utils/export'
import clsx from 'clsx'

interface RowConfig {
  influencerId: string
  quota:        number
  rate:         number        // KES per post
  platforms:    string[]
  contentType:  string
  startDate:    string
  endDate:      string
  confirmed:    boolean
}

const BUDGET_CAP = 2_800_000  // KES — Safaricom Nane Nane budget

const DEFAULT_ROSTER = INFLUENCERS.slice(0, 5).map(inf => ({
  influencerId: inf.id,
  quota:        3,
  rate:         inf.rate,
  platforms:    [inf.accounts[0].platform],
  contentType:  'Reels / Short Video',
  startDate:    '2024-08-01',
  endDate:      '2024-08-31',
  confirmed:    false,
}))

const TIMELINE_COLORS = ['#2f7cf6','#28d98d','#f5a623','#a855f7','#f0454a']
const MONTHS = ['Aug','Sep','Oct','Nov']

export default function CampaignsPage() {
  const [roster,    setRoster]    = useState<RowConfig[]>(DEFAULT_ROSTER)
  const [expanded,  setExpanded]  = useState<string | null>(null)
  const [campaign,  setCampaign]  = useState(CAMPAIGNS[0].id)
  const [success,   setSuccess]   = useState(false)
  const [mobTab,    setMobTab]    = useState<'roster'|'summary'>('roster')

  const totalSpend    = roster.reduce((s,r) => s + r.quota * r.rate, 0)
  const confirmedCount= roster.filter(r => r.confirmed).length
  const allConfirmed  = confirmedCount === roster.length && roster.length > 0
  const budgetPct     = Math.min(100, Math.round((totalSpend / BUDGET_CAP) * 100))
  const remaining     = BUDGET_CAP - totalSpend
  const selectedCamp  = CAMPAIGNS.find(c => c.id === campaign) ?? CAMPAIGNS[0]

  const updateRow = useCallback((id: string, patch: Partial<RowConfig>) => {
    setRoster(prev => prev.map(r => r.influencerId === id ? { ...r, ...patch, confirmed: false } : r))
  }, [])

  const confirmRow = (id: string) => {
    setRoster(prev => prev.map(r => r.influencerId === id ? { ...r, confirmed: true } : r))
    setExpanded(null)
  }

  const removeRow = (id: string) => {
    setRoster(prev => prev.filter(r => r.influencerId !== id))
    if (expanded === id) setExpanded(null)
  }

  const handleConfirm = () => {
    if (!allConfirmed) return
    setSuccess(true)
  }

  // ── SUMMARY PANEL JSX ─────────────────────────────────────────────────
  const SummaryPanel = () => (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto flex-1">
      {/* Budget meter */}
      <div>
        <div className="text-[9px] font-mono text-t3 uppercase tracking-[.1em] mb-2">Budget Tracker</div>
        <div className="rounded-xl p-4" style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
          <div className="flex items-baseline justify-between mb-2">
            <div className="font-display text-xl font-bold text-t1">{formatKES(totalSpend)}</div>
            <div className="text-[10px] font-mono text-t3">of {formatKES(BUDGET_CAP)}</div>
          </div>
          <div className="h-[5px] rounded-full overflow-hidden mb-2" style={{ background:'var(--bdr)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{
                width:`${budgetPct}%`,
                background: budgetPct>100?'var(--red)':budgetPct>85?'var(--amber)':'var(--blue)',
                boxShadow: budgetPct>85?`0 0 8px var(--${budgetPct>100?'red':'amber'})`:undefined,
              }}/>
          </div>
          <div className={clsx('text-[11px] font-mono', remaining>=0?'text-green':'text-red')}>
            {remaining>=0 ? `${formatKES(remaining)} remaining` : `${formatKES(-remaining)} over budget`}
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div>
        <ActivityTimeline
          events={[
            { id: '1', timestamp: new Date(Date.now() - 2*24*60*60*1000), type: 'milestone', title: 'Campaign Launched', description: 'Safaricom Nane Nane campaign went live', metadata: { influencers: roster.length, status: 'active' } },
            { id: '2', timestamp: new Date(Date.now() - 1*24*60*60*1000), type: 'milestone', title: 'First Content Posted', description: 'Initial campaign content published by shortlisted influencers', metadata: { posts: confirmedCount, reach: '2.4M' } },
            { id: '3', timestamp: new Date(), type: 'pending', title: 'Awaiting Confirmations', description: `${roster.length - confirmedCount} influencers pending assignment confirmation`, metadata: { pending: roster.length - confirmedCount } },
          ]}
          title="Campaign Progress"
        />
      </div>

      {/* Stats */}
      <div>
        <div className="text-[9px] font-mono text-t3 uppercase tracking-[.1em] mb-2">Campaign Stats</div>
        <div className="grid grid-cols-2 gap-2">
          {[
            {l:'Influencers', v:`${roster.length}`, c:'var(--blue)'},
            {l:'Confirmed',   v:`${confirmedCount}/${roster.length}`, c: confirmedCount===roster.length?'var(--green)':'var(--t1)'},
            {l:'Posts/wk',   v:`${roster.reduce((s,r)=>s+r.quota,0)}`, c:'var(--t1)'},
            {l:'Avg Eng',    v:'6.8%', c:'var(--green)'},
          ].map(s=>(
            <div key={s.l} className="rounded-lg p-3" style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
              <div className="text-[8px] font-mono text-t3 uppercase mb-1">{s.l}</div>
              <div className="font-display text-base font-bold" style={{ color:s.c }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Roster summary */}
      <div>
        <div className="text-[9px] font-mono text-t3 uppercase tracking-[.1em] mb-2">Roster</div>
        <div className="flex flex-col gap-2">
          {roster.map((r,i)=>{
            const inf=INFLUENCERS.find(x=>x.id===r.influencerId)!
            return (
              <div key={r.influencerId} className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
                <div className="w-6 h-6 rounded-[6px] flex items-center justify-center font-display text-[8px] font-bold text-white flex-shrink-0"
                  style={{ background:inf.gradient }}>{inf.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold text-t1 truncate">{inf.name}</div>
                  <div className="text-[9px] font-mono text-t3">{r.quota} posts/wk · {r.platforms.map(p=>p.slice(0,2).toUpperCase()).join(', ')}</div>
                </div>
                <div className="text-[11px] font-mono text-t1">{formatKES(r.quota*r.rate)}</div>
                <div className="w-5 h-5 rounded-[5px] flex items-center justify-center flex-shrink-0"
                  style={{ background:r.confirmed?'var(--green-d)':'var(--amber-d)' }}>
                  {r.confirmed
                    ? <Check size={10} style={{ color:'var(--green)' }}/>
                    : <AlertCircle size={10} style={{ color:'var(--amber)' }}/>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <div className="text-[9px] font-mono text-t3 uppercase tracking-[.1em] mb-2">Timeline</div>
        <div className="flex ml-14 mb-1">
          {MONTHS.map(m=><div key={m} className="flex-1 text-center text-[8px] font-mono text-t3">{m}</div>)}
        </div>
        <div className="flex flex-col gap-1.5">
          {roster.map((r,i)=>{
            const inf=INFLUENCERS.find(x=>x.id===r.influencerId)!
            const left = (i % 2) * 25
            const width= 50 + (i % 3) * 15
            return (
              <div key={r.influencerId} className="flex items-center gap-2">
                <div className="text-[9px] font-mono text-t2 w-12 flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap">{inf.initials}</div>
                <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background:'var(--bdr)' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ marginLeft:`${left}%`, width:`${width}%`, background:TIMELINE_COLORS[i%5], opacity:r.confirmed?1:0.45 }}/>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ background:'var(--bg)' }}>
      <Sidebar/>
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar title="Campaign Assignment" subtitle="// Roster & Budget">
          <button onClick={() => exportCampaignsToCSV(CAMPAIGNS)}
            className="hidden md:flex items-center gap-2 h-8 px-3 rounded-lg text-t1 text-[11px] font-mono transition-all cursor-pointer hover:bg-slate-light"
            style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}
            title="Export to CSV">
            <Download size={14}/>
            Export
          </button>
          <button className="hidden md:block px-3 h-8 rounded-lg text-[11px] font-mono text-white transition-all cursor-pointer"
            style={{ background: allConfirmed?'var(--green)':'var(--t3)' }}>
            {allConfirmed ? '✓ Ready to Deploy' : 'Confirm All'}
          </button>
        </Topbar>

        <Breadcrumb items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Campaigns', active: true },
        ]}/>

        {/* Campaign bar */}
        <div className="flex items-center gap-3 px-4 py-2.5 flex-shrink-0 flex-wrap gap-y-2" style={{ background:'var(--panel)', borderBottom:'1px solid var(--bdr)' }}>
          <span className="text-[10px] font-mono text-t3 uppercase tracking-[.08em]">Assigning to</span>
          <select value={campaign} onChange={e=>setCampaign(e.target.value)}
            className="flex-1 min-w-[180px] h-8 rounded-lg text-t1 text-[12px] font-mono px-2.5 outline-none cursor-pointer appearance-none"
            style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
            {CAMPAIGNS.map(c=><option key={c.id} value={c.id}>{c.name} — {c.brand}</option>)}
          </select>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono"
            style={{ background:'var(--green-d)', border:'1px solid rgba(40,217,141,.2)', color:'var(--green)' }}>
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background:'var(--green)' }}/>
            Active Campaign
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="flex border-b lg:hidden flex-shrink-0" style={{ borderColor:'var(--bdr)', background:'var(--panel)' }}>
          {(['roster','summary'] as const).map(t=>(
            <button key={t} onClick={()=>setMobTab(t)}
              className={clsx('flex-1 py-2.5 text-[11px] font-mono capitalize transition-all border-b-2', mobTab===t?'text-blue border-blue':'text-t3 border-transparent')}>
              {t} {t==='roster' && `(${confirmedCount}/${roster.length})`}
            </button>
          ))}
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* LEFT: Roster */}
          <div className={clsx('flex flex-col flex-1 overflow-hidden', mobTab==='summary'?'hidden lg:flex':'flex')}>
            <div className="flex items-center justify-between px-4 py-2 flex-shrink-0">
              <div className="font-display text-[11px] font-bold text-t2 uppercase tracking-[.05em]">Shortlisted Talent</div>
              <div className="text-[10px] font-mono text-t3">{confirmedCount} of {roster.length} confirmed</div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-2">
              {roster.map((r,i)=>{
                const inf    = INFLUENCERS.find(x=>x.id===r.influencerId)!
                const isOpen = expanded === r.influencerId
                const rowTotal = r.quota * r.rate

                return (
                  <div key={r.influencerId} className={clsx('rounded-xl overflow-hidden animate-fade-up transition-all')}
                    style={{
                      background:'var(--card)',
                      border:`1px solid ${r.confirmed?'rgba(40,217,141,.25)':isOpen?'var(--bdr-hi)':'var(--bdr)'}`,
                      animationDelay:`${i*0.05}s`,
                    }}>
                    {/* Row head */}
                    <div className="flex items-center gap-2.5 px-3.5 py-3 cursor-pointer"
                      onClick={()=>setExpanded(isOpen?null:r.influencerId)}>
                      <div className="w-9 h-9 rounded-[9px] flex items-center justify-center font-display text-sm font-bold text-white flex-shrink-0"
                        style={{ background:inf.gradient }}>{inf.initials}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-t1 truncate">{inf.name}</div>
                        <div className="text-[10px] font-mono text-t3">{inf.accounts[0].handle} · {inf.niche[0]}</div>
                      </div>
                      {/* Quick stats - hidden on mobile */}
                      <div className="hidden xl:flex gap-3">
                        {[
                          {l:'Reach',v:inf.reach},
                          {l:'Eng',v:`${inf.engagement}%`,g:true},
                          {l:'Quota',v:`${r.quota}/wk`},
                          {l:'Rate',v:formatKES(r.rate)},
                        ].map(s=>(
                          <div key={s.l} className="flex flex-col items-end gap-0.5">
                            <div className="text-[8px] font-mono text-t3 uppercase">{s.l}</div>
                            <div className={clsx('text-[11px] font-mono font-medium', (s as {g?:boolean}).g?'text-green':'text-t1')}>{s.v}</div>
                          </div>
                        ))}
                      </div>
                      {/* Status icon */}
                      <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                        style={{ background:r.confirmed?'var(--green-d)':'var(--hover)', border:`1px solid ${r.confirmed?'rgba(40,217,141,.3)':'var(--bdr)'}` }}>
                        {r.confirmed
                          ? <Check size={11} style={{ color:'var(--green)' }}/>
                          : <AlertCircle size={11} className="text-t3"/>}
                      </div>
                      {isOpen ? <ChevronUp size={15} className="text-t3 flex-shrink-0"/> : <ChevronDown size={15} className="text-t3 flex-shrink-0"/>}
                      <button onClick={e=>{e.stopPropagation();removeRow(r.influencerId)}}
                        className="w-5 h-5 rounded-md flex items-center justify-center text-t3 hover:text-red transition-colors flex-shrink-0 border"
                        style={{ borderColor:'var(--bdr)' }}><X size={11}/></button>
                    </div>

                    {/* Config panel */}
                    {isOpen && (
                      <div className="px-3.5 pb-3.5 border-t" style={{ borderColor:'var(--bdr)' }}>
                        <div className="grid grid-cols-2 gap-2.5 mt-3">
                          {/* Quota stepper */}
                          <div>
                            <div className="text-[9px] font-mono text-t3 uppercase tracking-[.08em] mb-1.5">Weekly Post Quota</div>
                            <div className="flex items-center rounded-lg overflow-hidden h-9" style={{ background:'var(--hover)', border:'1px solid var(--bdr)' }}>
                              <button onClick={()=>updateRow(r.influencerId,{quota:Math.max(1,r.quota-1)})}
                                className="w-9 h-full flex items-center justify-center text-t2 hover:text-t1 hover:bg-[var(--bdr)] transition-colors text-lg flex-shrink-0">−</button>
                              <div className="flex-1 text-center font-mono text-[13px] font-medium text-t1">{r.quota}</div>
                              <button onClick={()=>updateRow(r.influencerId,{quota:Math.min(14,r.quota+1)})}
                                className="w-9 h-full flex items-center justify-center text-t2 hover:text-t1 hover:bg-[var(--bdr)] transition-colors text-lg flex-shrink-0">+</button>
                              <span className="text-[9px] font-mono text-t3 pr-3 whitespace-nowrap">posts/wk</span>
                            </div>
                          </div>

                          {/* Rate */}
                          <div>
                            <div className="text-[9px] font-mono text-t3 uppercase tracking-[.08em] mb-1.5">Fee per Post (KES)</div>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-t3 pointer-events-none">KES</span>
                              <input type="number" value={r.rate} onChange={e=>updateRow(r.influencerId,{rate:parseInt(e.target.value)||0})}
                                className="w-full h-9 pl-9 pr-2 rounded-lg text-t1 font-mono text-[12px] outline-none transition-colors"
                                style={{ background:'var(--hover)', border:'1px solid var(--bdr)' }}/>
                            </div>
                          </div>

                          {/* Dates */}
                          <div>
                            <div className="text-[9px] font-mono text-t3 uppercase tracking-[.08em] mb-1.5">Start Date</div>
                            <input type="date" value={r.startDate} onChange={e=>updateRow(r.influencerId,{startDate:e.target.value})}
                              className="w-full h-9 px-2.5 rounded-lg text-t1 font-mono text-[11px] outline-none"
                              style={{ background:'var(--hover)', border:'1px solid var(--bdr)' }}/>
                          </div>
                          <div>
                            <div className="text-[9px] font-mono text-t3 uppercase tracking-[.08em] mb-1.5">End Date</div>
                            <input type="date" value={r.endDate} onChange={e=>updateRow(r.influencerId,{endDate:e.target.value})}
                              className="w-full h-9 px-2.5 rounded-lg text-t1 font-mono text-[11px] outline-none"
                              style={{ background:'var(--hover)', border:'1px solid var(--bdr)' }}/>
                          </div>

                          {/* Platforms */}
                          <div className="col-span-2">
                            <div className="text-[9px] font-mono text-t3 uppercase tracking-[.08em] mb-1.5">Platforms</div>
                            <div className="flex gap-2 flex-wrap">
                              {inf.accounts.map(a=>{
                                const on = r.platforms.includes(a.platform)
                                return (
                                  <button key={a.platform}
                                    onClick={()=>{
                                      const plats = on && r.platforms.length > 1
                                        ? r.platforms.filter(p=>p!==a.platform)
                                        : on ? r.platforms : [...r.platforms, a.platform]
                                      updateRow(r.influencerId,{platforms:plats})
                                    }}
                                    className="h-8 px-3 rounded-lg text-[10px] font-mono font-medium transition-all"
                                    style={{
                                      background: on ? 'var(--blue-d)' : 'transparent',
                                      border: `1px solid ${on ? 'var(--blue)' : 'var(--bdr)'}`,
                                      color: on ? 'var(--blue)' : 'var(--t3)',
                                    }}>
                                    {a.platform.toUpperCase()} · {a.handle}
                                  </button>
                                )
                              })}
                            </div>
                          </div>

                          {/* Content type */}
                          <div className="col-span-2">
                            <div className="text-[9px] font-mono text-t3 uppercase tracking-[.08em] mb-1.5">Content Type</div>
                            <select value={r.contentType} onChange={e=>updateRow(r.influencerId,{contentType:e.target.value})}
                              className="w-full h-9 px-2.5 rounded-lg text-t1 font-mono text-[11px] outline-none appearance-none cursor-pointer"
                              style={{ background:'var(--hover)', border:'1px solid var(--bdr)' }}>
                              {['Reels / Short Video','Static Posts','Stories','Long-form Video','Mixed Formats'].map(o=><option key={o}>{o}</option>)}
                            </select>
                          </div>
                        </div>

                        {/* Row footer */}
                        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop:'1px solid var(--bdr)' }}>
                          <div className="text-[10px] font-mono text-t3">
                            Row total: <strong className="text-t1">{formatKES(rowTotal)}</strong> · {r.quota} posts/wk
                          </div>
                          <button onClick={()=>confirmRow(r.influencerId)}
                            className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-[10px] font-mono font-medium transition-all"
                            style={{ background:r.confirmed?'var(--green-d)':'var(--hover)', border:`1px solid ${r.confirmed?'rgba(40,217,141,.3)':'var(--bdr)'}`, color:r.confirmed?'var(--green)':'var(--t2)' }}>
                            <Check size={11}/> {r.confirmed?'Confirmed ✓':'Confirm Row'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* RIGHT: Summary panel */}
          <div className={clsx(
            'border-l flex-col overflow-hidden',
            'hidden lg:flex',
            mobTab==='summary' ? 'flex w-full lg:w-[300px]' : 'w-[300px]'
          )}
            style={{ borderColor:'var(--bdr)', background:'var(--panel)' }}>
            <div className="p-4 pb-3 border-b flex-shrink-0" style={{ borderColor:'var(--bdr)' }}>
              <div className="font-display text-[13px] font-bold text-t1">Assignment Summary</div>
              <div className="text-[10px] font-mono text-t3 mt-0.5">// {selectedCamp.name}</div>
            </div>
            <SummaryPanel/>
            <div className="p-3 border-t flex-shrink-0" style={{ borderColor:'var(--bdr)' }}>
              <button onClick={handleConfirm} disabled={!allConfirmed}
                className={clsx('w-full py-3 rounded-xl text-white text-[11px] font-mono font-medium flex items-center justify-center gap-2 transition-all', !allConfirmed&&'opacity-40 cursor-not-allowed')}
                style={{ background: allConfirmed ? 'var(--green)' : 'var(--blue)', boxShadow: allConfirmed ? '0 0 20px rgba(40,217,141,.3)' : undefined }}>
                <Check size={14}/> Confirm & Send Briefs
              </button>
            </div>
          </div>

          {/* Mobile summary tab */}
          {mobTab === 'summary' && (
            <div className="flex flex-col flex-1 overflow-hidden lg:hidden">
              <SummaryPanel/>
              <div className="p-3 border-t flex-shrink-0 pb-20" style={{ borderColor:'var(--bdr)' }}>
                <button onClick={handleConfirm} disabled={!allConfirmed}
                  className={clsx('w-full py-3 rounded-xl text-white text-[11px] font-mono font-medium flex items-center justify-center gap-2', !allConfirmed&&'opacity-40 cursor-not-allowed')}
                  style={{ background: allConfirmed?'var(--green)':'var(--blue)' }}>
                  <Check size={14}/> Confirm & Send Briefs
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success overlay */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5" style={{ background:'rgba(8,13,22,.85)', backdropFilter:'blur(6px)' }}>
          <div className="max-w-sm w-full rounded-2xl p-8 text-center animate-fade-up"
            style={{ background:'var(--panel)', border:'1px solid var(--green)', boxShadow:'0 0 40px rgba(40,217,141,.15)' }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background:'var(--green-d)', border:'2px solid rgba(40,217,141,.3)' }}>
              <Check size={28} style={{ color:'var(--green)' }}/>
            </div>
            <div className="font-display text-xl font-bold text-t1 mb-2">Assignment Confirmed</div>
            <div className="text-[12px] font-mono text-t3 mb-6 leading-relaxed">
              {roster.length} influencers assigned to <strong className="text-t1">{selectedCamp.name}</strong>.<br/>
              Campaign briefs are being dispatched via M-Pesa + email.
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                {l:'Influencers',v:`${roster.length}`},
                {l:'Total Budget',v:formatKES(totalSpend)},
                {l:'Posts/Week',  v:`${roster.reduce((s,r)=>s+r.quota,0)}`},
              ].map(s=>(
                <div key={s.l} className="rounded-lg p-3" style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
                  <div className="font-display text-[15px] font-bold text-blue">{s.v}</div>
                  <div className="text-[9px] font-mono text-t3 mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <a href="/dashboard" className="flex-1 h-10 rounded-xl flex items-center justify-center text-white text-[11px] font-mono"
                style={{ background:'var(--blue)' }}>View Campaign</a>
              <button onClick={()=>setSuccess(false)}
                className="flex-1 h-10 rounded-xl text-t2 text-[11px] font-mono border hover:text-t1 transition-colors"
                style={{ border:'1px solid var(--bdr)' }}>Done</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav/>
    </div>
  )
}
