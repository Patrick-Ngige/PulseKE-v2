'use client'
import { useState } from 'react'
import Sidebar   from '@/components/layout/Sidebar'
import Topbar    from '@/components/layout/Topbar'
import BottomNav from '@/components/layout/BottomNav'
import { StatusBadge, PageShell } from '@/components/ui'
import { PAYMENTS, formatKES } from '@/data/kenya'
import { Send, RefreshCw, MoreVertical, TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle, Smartphone } from 'lucide-react'
import clsx from 'clsx'

const METHOD_STYLE: Record<string, { bg: string; color: string; icon: string }> = {
  'M-Pesa':        { bg: 'rgba(0,158,73,.12)',  color: '#009e49', icon: '📱' },
  'Airtel Money':  { bg: 'rgba(226,0,26,.10)',   color: '#e2001a', icon: '📱' },
  'Bank Transfer': { bg: 'rgba(47,124,246,.12)', color: 'var(--blue)', icon: '🏦' },
}

export default function PaymentsPage() {
  const [filter, setFilter] = useState<'all'|'processing'|'scheduled'|'paid'|'failed'>('all')
  const [bulkMode, setBulkMode] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = PAYMENTS.filter(p => filter === 'all' || p.status === filter)

  const totalPaid      = PAYMENTS.filter(p=>p.status==='paid').reduce((s,p)=>s+p.amount,0)
  const totalPending   = PAYMENTS.filter(p=>['processing','scheduled'].includes(p.status)).reduce((s,p)=>s+p.amount,0)
  const totalFailed    = PAYMENTS.filter(p=>p.status==='failed').reduce((s,p)=>s+p.amount,0)
  const mpesaCount     = PAYMENTS.filter(p=>p.method==='M-Pesa').length

  const toggleSelect = (id: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(id)?n.delete(id):n.add(id); return n })
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background:'var(--bg)' }}>
      <Sidebar/>
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar title="Payments & Compliance" subtitle="// M-Pesa · Bank Transfer · Airtel Money · KES">
          <div className="hidden md:flex items-center gap-1.5 h-8 px-3 rounded-full text-[10px] font-mono"
            style={{ background:'rgba(0,158,73,.12)', border:'1px solid rgba(0,158,73,.25)', color:'#009e49' }}>
            <Smartphone size={12}/> M-Pesa Active
          </div>
          {bulkMode && selected.size > 0 && (
            <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-white text-[11px] font-mono"
              style={{ background:'var(--green)' }}>
              <Send size={12}/> Release {selected.size} Payments
            </button>
          )}
          <button onClick={()=>{setBulkMode(!bulkMode);setSelected(new Set())}}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11px] font-mono transition-all"
            style={{ background:bulkMode?'var(--blue-d)':'var(--card)', border:`1px solid ${bulkMode?'var(--blue)':'var(--bdr)'}`, color:bulkMode?'var(--blue)':'var(--t2)' }}>
            {bulkMode ? 'Cancel' : 'Bulk Release'}
          </button>
        </Topbar>

        <PageShell>
          {/* Overview cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            {[
              { label:'Total Paid Out',  value:formatKES(totalPaid),    delta:'5.8%', up:true,  color:'var(--green)',  icon:<CheckCircle size={13}/> },
              { label:'Pending Payouts', value:formatKES(totalPending), delta:'2.4%', up:false, color:'var(--amber)',  icon:<Clock size={13}/> },
              { label:'Failed Payments', value:formatKES(totalFailed),  delta:'Retry now', up:false, color:'var(--red)', icon:<AlertCircle size={13}/> },
              { label:'Via M-Pesa',      value:`${mpesaCount} of ${PAYMENTS.length}`, delta:'Kenya default', up:true, color:'#009e49', icon:<Smartphone size={13}/> },
            ].map((c,i)=>(
              <div key={i} className="rounded-xl p-4 animate-fade-up card-hover"
                style={{ background:'var(--card)', border:'1px solid var(--bdr)', animationDelay:`${i*0.05}s` }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background:`${c.color}22`, color:c.color }}>{c.icon}</div>
                  <div className="flex items-center gap-1 text-[10px] font-mono"
                    style={{ color:c.up?'var(--green)':'var(--red)' }}>
                    {c.up ? <TrendingUp size={10}/> : <TrendingDown size={10}/>} {c.delta}
                  </div>
                </div>
                <div className="text-[9px] font-mono text-t3 uppercase tracking-[.08em] mb-1">{c.label}</div>
                <div className="font-display text-lg font-bold text-t1" style={{ letterSpacing:'-.02em' }}>{c.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Main payout table */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Filter tabs */}
              <div className="flex gap-1 flex-shrink-0" style={{ borderBottom:'1px solid var(--bdr)' }}>
                {(['all','processing','scheduled','paid','failed'] as const).map(f=>(
                  <button key={f} onClick={()=>setFilter(f)}
                    className="px-3 py-2 text-[11px] font-mono capitalize border-b-2 transition-all"
                    style={{ borderColor:filter===f?'var(--blue)':'transparent', color:filter===f?'var(--blue)':'var(--t3)' }}>
                    {f} {f!=='all' && `(${PAYMENTS.filter(p=>p.status===f).length})`}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="rounded-xl overflow-hidden" style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px]">
                    <thead style={{ background:'rgba(22,34,56,.4)', borderBottom:'1px solid var(--bdr)' }}>
                      <tr>
                        {bulkMode && <th className="pl-4 py-3 w-8"/>}
                        {['Influencer','Campaign','Method','Amount','Status',''].map(h=>(
                          <th key={h} className="px-4 py-3 text-left text-[9px] font-mono uppercase tracking-[.1em] text-t3 font-normal last:text-right">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((p, i) => {
                        const ms = METHOD_STYLE[p.method]
                        const isSelected = selected.has(p.id)
                        return (
                          <tr key={p.id}
                            className={clsx('border-b last:border-b-0 transition-colors cursor-pointer animate-fade-up', isSelected?'bg-[var(--hover)]':'hover:bg-[var(--hover)]')}
                            style={{ borderColor:'var(--bdr)', animationDelay:`${i*0.04}s` }}
                            onClick={()=>bulkMode&&toggleSelect(p.id)}>
                            {bulkMode && (
                              <td className="pl-4 py-3 w-8">
                                <div className="w-4 h-4 rounded border flex items-center justify-center transition-all"
                                  style={{ background:isSelected?'var(--blue)':'transparent', borderColor:isSelected?'var(--blue)':'var(--bdr)' }}>
                                  {isSelected && <svg viewBox="0 0 10 10" className="w-2.5 h-2.5"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                                  </svg>}
                                </div>
                              </td>
                            )}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-[7px] flex items-center justify-center font-display text-[9px] font-bold text-white flex-shrink-0"
                                  style={{ background:p.gradient }}>{p.initials}</div>
                                <div>
                                  <div className="text-[12px] font-medium text-t1">{p.influencer}</div>
                                  {p.phone && <div className="text-[9px] font-mono text-t3">{p.phone}</div>}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-[11px] font-mono text-t3">{p.campaign}</td>
                            <td className="px-4 py-3">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 w-fit"
                                style={{ background:ms.bg, color:ms.color }}>
                                {ms.icon} {p.method}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-[12px] font-display font-bold text-t1">{formatKES(p.amount)}</td>
                            <td className="px-4 py-3"><StatusBadge status={p.status}/></td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                {p.status === 'failed' && (
                                  <button className="flex items-center gap-1 h-7 px-2 rounded-md text-[10px] font-mono transition-all"
                                    style={{ background:'var(--red-d)', border:'1px solid rgba(240,69,74,.3)', color:'var(--red)' }}>
                                    <RefreshCw size={10}/> Retry
                                  </button>
                                )}
                                {p.status === 'scheduled' && (
                                  <button className="flex items-center gap-1 h-7 px-2 rounded-md text-[10px] font-mono transition-all"
                                    style={{ background:'var(--blue-d)', border:'1px solid rgba(47,124,246,.25)', color:'var(--blue)' }}>
                                    <Send size={10}/> Release
                                  </button>
                                )}
                                <button className="w-7 h-7 rounded-md flex items-center justify-center text-t3 hover:text-t2 transition-colors border"
                                  style={{ borderColor:'var(--bdr)' }}><MoreVertical size={12}/></button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-center py-3" style={{ borderTop:'1px solid var(--bdr)' }}>
                  <button className="text-[11px] font-mono text-blue hover:opacity-70 transition-opacity">View All Transactions →</button>
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="flex flex-col gap-4">

              {/* KRA Tax Compliance */}
              <div className="rounded-xl overflow-hidden" style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
                <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom:'1px solid var(--bdr)', background:'rgba(22,34,56,.4)' }}>
                  <div className="text-[12px] font-semibold text-t1">KRA Tax Compliance</div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded"
                    style={{ background:'var(--red-d)', color:'var(--red)', border:'1px solid rgba(240,69,74,.3)' }}>
                    2 Alerts
                  </span>
                </div>
                <div className="p-3 flex flex-col gap-2">
                  {[
                    { name:'Amina Mwangi',   doc:'PIN Certificate', status:'ok',      pin:'A004••••2B' },
                    { name:'Faith Ochieng',  doc:'W-8BEN / KRA PIN', status:'missing', pin: null       },
                    { name:'Peter Otieno',   doc:'PIN Certificate', status:'ok',      pin:'A007••••5P' },
                  ].map(t=>(
                    <div key={t.name} className="p-3 rounded-lg"
                      style={{ background:'var(--hover)', border:`1px solid ${t.status==='missing'?'rgba(240,69,74,.25)':'var(--bdr)'}` }}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-[11px] font-semibold text-t1">{t.name}</div>
                        <div className="text-[8px] font-mono uppercase tracking-[.06em]"
                          style={{ color:t.status==='ok'?'var(--green)':'var(--red)' }}>
                          {t.doc}
                        </div>
                      </div>
                      {t.status === 'ok' ? (
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-t3">
                          <CheckCircle size={10} style={{ color:'var(--green)' }}/> KRA PIN: {t.pin}
                        </div>
                      ) : (
                        <button className="w-full mt-1.5 py-1.5 rounded-md text-white text-[10px] font-mono"
                          style={{ background:'var(--red)' }}>
                          Request Documents
                        </button>
                      )}
                    </div>
                  ))}
                  <button className="text-center text-[11px] font-mono text-blue hover:opacity-70 transition-opacity mt-1">
                    Manage all tax documents →
                  </button>
                </div>
              </div>

              {/* M-Pesa settings */}
              <div className="rounded-xl p-4" style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
                <div className="text-[12px] font-semibold text-t1 mb-4">Payment Settings</div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-[9px] font-mono font-bold px-2 py-1 rounded"
                        style={{ background:'rgba(0,158,73,.12)', color:'#009e49' }}>KES</div>
                      <span className="text-[12px] font-medium text-t1">Base Currency</span>
                    </div>
                    <div className="w-4 h-4 rounded-full border-4"
                      style={{ background:'var(--blue)', borderColor:'var(--hover)' }}/>
                  </div>
                  <div className="h-px" style={{ background:'var(--bdr)' }}/>
                  <div>
                    <div className="text-[9px] font-mono text-t3 uppercase tracking-[.08em] mb-2">Default Method</div>
                    <div className="flex flex-col gap-2">
                      {[
                        { method:'M-Pesa',       pct: 70, color:'#009e49' },
                        { method:'Bank Transfer', pct: 22, color:'var(--blue)' },
                        { method:'Airtel Money',  pct: 8,  color:'#e2001a' },
                      ].map(m=>(
                        <div key={m.method}>
                          <div className="flex justify-between text-[10px] font-mono mb-1">
                            <span className="text-t2">{m.method}</span>
                            <span style={{ color:m.color }}>{m.pct}%</span>
                          </div>
                          <div className="h-[3px] rounded-full overflow-hidden" style={{ background:'var(--bdr)' }}>
                            <div className="h-full rounded-full animate-bar-in" style={{ width:`${m.pct}%`, background:m.color }}/>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="h-px" style={{ background:'var(--bdr)' }}/>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative w-10 h-6 rounded-full flex-shrink-0" style={{ background:'var(--blue)' }}>
                      <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"/>
                    </div>
                    <span className="text-[12px] text-t1">Auto-release on approval</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative w-10 h-6 rounded-full flex-shrink-0" style={{ background:'var(--blue)' }}>
                      <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"/>
                    </div>
                    <span className="text-[12px] text-t1">KRA withholding tax (5%)</span>
                  </label>
                </div>
              </div>

            </div>
          </div>
        </PageShell>
      </div>
      <BottomNav/>
    </div>
  )
}
