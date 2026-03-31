'use client'
import { useState } from 'react'
import Sidebar   from '@/components/layout/Sidebar'
import Topbar    from '@/components/layout/Topbar'
import BottomNav from '@/components/layout/BottomNav'
import { StatusBadge, PageShell } from '@/components/ui'
import { CONTRACTS, formatKES } from '@/data/kenya'
import { Plus, Eye, Download, RefreshCw, Edit, Trash2, FileText, ShieldCheck, Pen } from 'lucide-react'
import type { Contract } from '@/data/kenya'

export default function ContractsPage() {
  const [filter, setFilter] = useState<'all'|'signed'|'sent'|'draft'|'expired'>('all')
  const [search, setSearch]  = useState('')

  const filtered = CONTRACTS.filter(c => {
    const matchF = filter === 'all' || c.status === filter
    const q = search.toLowerCase()
    const matchS = !q || c.influencer.toLowerCase().includes(q) || c.campaign.toLowerCase().includes(q)
    return matchF && matchS
  })

  const stats = {
    total:    CONTRACTS.length,
    signed:   CONTRACTS.filter(c=>c.status==='signed').length,
    pending:  CONTRACTS.filter(c=>c.status==='sent').length,
    expiring: CONTRACTS.filter(c=>c.status==='expired').length,
    rate:     Math.round((CONTRACTS.filter(c=>c.status==='signed').length / CONTRACTS.length) * 100),
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background:'var(--bg)' }}>
      <Sidebar/>
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar title="Contracts & Agreements" subtitle="// Legal document management · Kenyan law">
          <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-white text-[11px] font-mono transition-all"
            style={{ background:'var(--blue)' }}>
            <Plus size={13}/> New Contract
          </button>
        </Topbar>

        <PageShell>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Main table */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Filter tabs + search */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex gap-1" style={{ borderBottom:'1px solid var(--bdr)' }}>
                  {(['all','signed','sent','draft','expired'] as const).map(f=>(
                    <button key={f} onClick={()=>setFilter(f)}
                      className="px-3 py-2 text-[11px] font-mono capitalize border-b-2 transition-all"
                      style={{ borderColor:filter===f?'var(--blue)':'transparent', color:filter===f?'var(--blue)':'var(--t3)' }}>
                      {f==='all'?'All':f}
                    </button>
                  ))}
                </div>
                <input value={search} onChange={e=>setSearch(e.target.value)}
                  className="h-8 px-3 rounded-lg text-t1 text-[12px] font-mono outline-none"
                  style={{ background:'var(--card)', border:'1px solid var(--bdr)', minWidth:'200px' }}
                  placeholder="Search contracts…"/>
              </div>

              {/* Table */}
              <div className="rounded-xl overflow-hidden" style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px]">
                    <thead style={{ background:'rgba(22,34,56,.4)', borderBottom:'1px solid var(--bdr)' }}>
                      <tr>
                        {['Influencer','Campaign','Type','Status','Value','Updated','Actions'].map(h=>(
                          <th key={h} className="px-4 py-3 text-left text-[9px] font-mono uppercase tracking-[.1em] text-t3 font-normal last:text-right">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((c, i) => (
                        <ContractRow key={c.id} contract={c} index={i}/>
                      ))}
                      {filtered.length === 0 && (
                        <tr><td colSpan={7} className="px-4 py-8 text-center text-[12px] font-mono text-t3">No contracts found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between px-4 py-3" style={{ borderTop:'1px solid var(--bdr)' }}>
                  <div className="text-[10px] font-mono text-t3">Showing {filtered.length} of {CONTRACTS.length} contracts</div>
                  <div className="flex gap-2">
                    <button className="h-7 px-3 rounded text-[10px] font-mono text-t2 border" style={{ border:'1px solid var(--bdr)' }}>Previous</button>
                    <button className="h-7 px-3 rounded text-[10px] font-mono text-t2 border" style={{ border:'1px solid var(--bdr)' }}>Next</button>
                  </div>
                </div>
              </div>

              {/* Templates */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="font-display text-[13px] font-bold text-t1">Contract Templates</div>
                  <button className="text-[11px] font-mono text-blue hover:opacity-70 transition-opacity">Manage All →</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon:'📄', title:'Standard NDA (v2.4)',    sub:'General non-disclosure for all influencers', color:'var(--blue)' },
                    { icon:'🤝', title:'Campaign Agreement',      sub:'Deliverables & M-Pesa payment terms',       color:'var(--purple)' },
                    { icon:'⚖️', title:'Kenyan Commercial Agreement', sub:'Compliant with Kenya Commercial Law',   color:'var(--green)' },
                    { icon:'📋', title:'Brand Partnership',        sub:'Long-term brand ambassador terms',          color:'var(--amber)' },
                  ].map(t=>(
                    <div key={t.title} className="flex items-start justify-between p-3.5 rounded-xl cursor-pointer transition-all card-hover"
                      style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
                      <div className="flex gap-3">
                        <div className="text-lg leading-none mt-0.5">{t.icon}</div>
                        <div>
                          <div className="text-[12px] font-semibold text-t1">{t.title}</div>
                          <div className="text-[10px] text-t3 mt-0.5">{t.sub}</div>
                        </div>
                      </div>
                      <button className="text-blue hover:opacity-70 transition-opacity flex-shrink-0 ml-2">
                        <Plus size={16}/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar: stats + pending signatures */}
            <div className="flex flex-col gap-4">
              {/* Signing rate */}
              <div className="rounded-xl p-4" style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
                <div className="font-display text-[13px] font-bold text-t1 mb-4">Contract Insights</div>
                <div className="mb-4">
                  <div className="flex justify-between text-[11px] font-mono mb-1.5">
                    <span className="text-t2">Signing Rate</span>
                    <span className="font-medium text-t1">{stats.rate}%</span>
                  </div>
                  <div className="h-[5px] rounded-full overflow-hidden" style={{ background:'var(--bdr)' }}>
                    <div className="h-full rounded-full animate-bar-in" style={{ width:`${stats.rate}%`, background:'var(--blue)' }}/>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    {l:'Pending',  v:stats.pending,  c:'var(--amber)'},
                    {l:'Expiring', v:stats.expiring, c:'var(--red)'  },
                    {l:'Signed',   v:stats.signed,   c:'var(--green)'},
                    {l:'Total',    v:stats.total,    c:'var(--t1)'   },
                  ].map(s=>(
                    <div key={s.l} className="rounded-lg p-3" style={{ background:'var(--hover)' }}>
                      <div className="text-[8px] font-mono text-t3 uppercase">{s.l}</div>
                      <div className="font-display text-xl font-bold mt-0.5" style={{ color:s.c }}>{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Awaiting signature */}
              <div className="rounded-xl overflow-hidden" style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
                <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom:'1px solid var(--bdr)', background:'rgba(22,34,56,.4)' }}>
                  <Pen size={13} style={{ color:'var(--blue)' }}/>
                  <span className="text-[12px] font-semibold text-t1">Awaiting Your Signature</span>
                </div>
                <div className="p-3 flex flex-col gap-2">
                  {[
                    { name:'Safaricom Ltd.', doc:'Master Service Agreement', badge:'Brand' },
                    { name:'Faith Ochieng',  doc:'Fitness Campaign NDA',     badge:'Contractor' },
                  ].map(s=>(
                    <div key={s.name} className="p-3 rounded-lg" style={{ background:'var(--hover)', border:'1px solid var(--bdr)' }}>
                      <div className="text-[9px] font-mono text-t3 uppercase mb-0.5">{s.badge}: {s.name}</div>
                      <div className="text-[12px] font-semibold text-t1 mb-2">{s.doc}</div>
                      <button className="w-full py-2 rounded-lg text-white text-[10px] font-mono transition-all"
                        style={{ background:'var(--blue)' }}>
                        Sign Document
                      </button>
                    </div>
                  ))}
                  <div className="text-center text-[10px] font-mono text-t3 italic">2 pending signatures</div>
                </div>
              </div>

              {/* Legal support */}
              <div className="rounded-xl p-4" style={{ background:'var(--blue-d)', border:'1px solid rgba(47,124,246,.2)' }}>
                <ShieldCheck size={18} style={{ color:'var(--blue)' }} className="mb-2"/>
                <div className="font-display text-[13px] font-bold text-blue mb-1">Legal Support</div>
                <div className="text-[11px] text-t2 mb-3 leading-relaxed">Need a contract reviewed under Kenyan commercial law? Our legal team is available.</div>
                <button className="text-[11px] font-mono text-blue hover:underline">Contact Support →</button>
              </div>
            </div>

          </div>
        </PageShell>
      </div>
      <BottomNav/>
    </div>
  )
}

function ContractRow({ contract: c, index: i }: { contract: Contract; index: number }) {
  const actions: Record<Contract['status'], React.ReactNode> = {
    signed: <>
      <ActionBtn icon={<Eye size={12}/>} label="View"/>
      <ActionBtn icon={<Download size={12}/>} label="Download"/>
    </>,
    sent: <>
      <ActionBtn icon={<RefreshCw size={12}/>} label="Remind"/>
      <ActionBtn icon={<Eye size={12}/>} label="View"/>
    </>,
    draft: <>
      <ActionBtn icon={<Edit size={12}/>} label="Edit"/>
      <ActionBtn icon={<Trash2 size={12}/>} label="Delete" danger/>
    </>,
    expired: <>
      <ActionBtn icon={<Eye size={12}/>} label="View"/>
      <ActionBtn icon={<RefreshCw size={12}/>} label="Renew"/>
    </>,
  }

  return (
    <tr className="border-b last:border-b-0 cursor-pointer transition-colors hover:bg-[var(--hover)] animate-fade-up"
      style={{ borderColor:'var(--bdr)', animationDelay:`${i*0.04}s` }}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[7px] flex items-center justify-center font-display text-[9px] font-bold text-white flex-shrink-0"
            style={{ background:c.gradient }}>{c.initials}</div>
          <span className="text-[12px] font-semibold text-t1">{c.influencer}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-[11px] font-mono text-t2">{c.campaign}</td>
      <td className="px-4 py-3">
        <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background:'var(--hover)', color:'var(--t2)', border:'1px solid var(--bdr)' }}>{c.type}</span>
      </td>
      <td className="px-4 py-3"><StatusBadge status={c.status}/></td>
      <td className="px-4 py-3 text-[11px] font-mono text-t1">{formatKES(c.value)}</td>
      <td className="px-4 py-3 text-[11px] font-mono text-t3">{c.updatedAt}</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">{actions[c.status]}</div>
      </td>
    </tr>
  )
}

function ActionBtn({ icon, label, danger }: { icon: React.ReactNode; label: string; danger?: boolean }) {
  return (
    <button title={label}
      className={`w-7 h-7 rounded-md flex items-center justify-center transition-all border ${danger ? 'text-t3 hover:text-red hover:border-red hover:bg-[var(--red-d)]' : 'text-t3 hover:text-blue hover:border-[var(--blue)] hover:bg-[var(--blue-d)]'}`}
      style={{ borderColor:'var(--bdr)', background:'transparent' }}>
      {icon}
    </button>
  )
}
