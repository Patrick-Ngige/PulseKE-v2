'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import Sidebar   from '@/components/layout/Sidebar'
import Topbar    from '@/components/layout/Topbar'
import BottomNav from '@/components/layout/BottomNav'
import { Breadcrumb } from '@/components/Breadcrumb'
import { DetailModal } from '@/components/DetailModal'
import { ComparisonView } from '@/components/ComparisonView'
import { StatusBadge, PageShell } from '@/components/ui'
import { INFLUENCERS, type Influencer, type Niche, formatKES } from '@/data/kenya'
import { Search, Grid, List, X, Heart, Plus, Check, ShieldCheck, Download } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import { exportInfluencersToCSV } from '@/lib/utils/export'
import clsx from 'clsx'

const NICHES: Niche[] = ['Fashion','Tech','Fitness','Food','Travel','Lifestyle','Business','Entertainment']
const PLAT_STYLE: Record<string,{bg:string,color:string}> = {
  instagram: { bg:'rgba(240,148,51,.1)', color:'#f09433' },
  tiktok:    { bg:'rgba(105,201,208,.1)',color:'#69c9d0' },
  youtube:   { bg:'rgba(255,85,85,.1)',  color:'#ff5555' },
  twitter:   { bg:'rgba(29,155,240,.1)', color:'#1d9bf0' },
}

export default function DiscoveryPage() {
  const { addToast } = useToast()
  const [query,        setQuery]        = useState('')
  const [niche,        setNiche]        = useState<Niche | 'all'>('all')
  const [viewMode,     setViewMode]     = useState<'grid'|'list'>('grid')
  const [shortlist,    setShortlist]    = useState<Set<string>>(new Set())
  const [favs,         setFavs]         = useState<Set<string>>(new Set())
  const [drawer,       setDrawer]       = useState<Influencer | null>(null)
  const [detailId,     setDetailId]     = useState<string | null>(null)
  const [compareOpen,  setCompareOpen]  = useState(false)

  const filtered = useMemo(() => INFLUENCERS.filter(inf => {
    const q = query.toLowerCase()
    const matchQ = !q || inf.name.toLowerCase().includes(q) ||
      inf.accounts.some(a => a.handle.toLowerCase().includes(q)) ||
      inf.niche.some(n => n.toLowerCase().includes(q))
    const matchN = niche === 'all' || inf.niche.includes(niche)
    return matchQ && matchN
  }), [query, niche])

  const toggle = (id: string) => {
    setShortlist(prev => {
      const n = new Set(prev)
      const isAdding = !n.has(id)
      isAdding ? n.add(id) : n.delete(id)
      const name = INFLUENCERS.find(i => i.id === id)?.name
      addToast(
        isAdding ? `${name} added to shortlist` : `${name} removed from shortlist`,
        isAdding ? 'success' : 'info'
      )
      return n
    })
  }
  const toggleFav = (id: string) => {
    setFavs(prev => {
      const n = new Set(prev)
      const isAdding = !n.has(id)
      isAdding ? n.add(id) : n.delete(id)
      return n
    })
  }

  const scoreColor = (s:number) => s>=95?'var(--green)':s>=88?'var(--blue)':'var(--amber)'

  const selectedInfluencer = detailId ? INFLUENCERS.find(i => i.id === detailId) : null

  return (
    <div className="flex h-screen overflow-hidden" style={{ background:'var(--bg)' }}>
      <Sidebar/>
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar title="Talent Discovery" subtitle="// Kenyan Influencer Database">
          <button onClick={() => exportInfluencersToCSV(filtered)}
            className="hidden md:flex items-center gap-2 h-8 px-3 rounded-lg text-t1 text-[11px] font-mono transition-all hover:bg-slate-light cursor-pointer"
            style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}
            title="Export to CSV">
            <Download size={14}/>
            Export
          </button>
          <button onClick={() => shortlist.size > 0 && setCompareOpen(true)}
            disabled={shortlist.size === 0}
            className="hidden md:flex items-center gap-2 h-8 px-3 rounded-lg text-white text-[11px] font-mono transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background:'var(--blue)' }}>
            Compare
            <span className="bg-white/20 rounded px-1 text-[10px]">{shortlist.size}</span>
          </button>
        </Topbar>

        <Breadcrumb items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Talent Discovery', active: true },
        ]} />

        {/* Search + filter bar */}
        <div className="flex-shrink-0 p-3 flex flex-col gap-2.5" style={{ background:'var(--panel)', borderBottom:'1px solid var(--bdr)' }}>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-t3 pointer-events-none"/>
              <input value={query} onChange={e=>setQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg text-t1 text-[13px] outline-none transition-colors"
                style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}
                placeholder="Search by name, handle, or niche…"/>
            </div>
            <div className="flex rounded-lg overflow-hidden" style={{ border:'1px solid var(--bdr)', background:'var(--card)' }}>
              <button onClick={()=>setViewMode('grid')}
                className={clsx('w-9 h-9 flex items-center justify-center transition-colors', viewMode==='grid'?'text-blue':'text-t3')}>
                <Grid size={15}/>
              </button>
              <button onClick={()=>setViewMode('list')}
                className={clsx('w-9 h-9 flex items-center justify-center transition-colors', viewMode==='list'?'text-blue':'text-t3')}>
                <List size={15}/>
              </button>
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap items-center">
            {(['all',...NICHES] as (Niche|'all')[]).map(n => (
              <button key={n} onClick={()=>setNiche(n)}
                className="h-7 px-2.5 rounded-full text-[11px] font-mono transition-all"
                style={{
                  background: niche===n ? 'var(--blue-d)' : 'var(--card)',
                  border:     `1px solid ${niche===n ? 'var(--blue)' : 'var(--bdr)'}`,
                  color:      niche===n ? 'var(--blue)' : 'var(--t3)',
                }}>
                {n==='all'?'All niches':n}
              </button>
            ))}
            <span className="ml-auto text-[11px] font-mono text-t3">{filtered.length} results</span>
          </div>
        </div>

        <PageShell>
          {viewMode==='grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
              {filtered.map((inf,i) => (
                <div key={inf.id}
                  className={clsx('rounded-2xl overflow-hidden cursor-pointer transition-all animate-fade-up card-hover',
                    shortlist.has(inf.id) && 'ring-1 ring-blue')}
                  style={{ background:'var(--card)', border:`1px solid ${shortlist.has(inf.id)?'var(--blue)':'var(--bdr)'}`, animationDelay:`${i*0.04}s` }}
                  onClick={()=>setDrawer(inf)}>
                  {/* Header */}
                  <div className="h-16 relative" style={{ background:inf.gradient }}>
                    <button onClick={e=>{e.stopPropagation();toggle(inf.id)}}
                      className="absolute top-2 right-2 w-6 h-6 rounded-md flex items-center justify-center transition-all"
                      style={{ background: shortlist.has(inf.id)?'var(--blue)':'rgba(0,0,0,.35)', backdropFilter:'blur(4px)', border:'1px solid rgba(255,255,255,.2)' }}>
                      {shortlist.has(inf.id) ? <Check size={12} className="text-white"/> : <Plus size={12} className="text-white"/>}
                    </button>
                  </div>
                  {/* Avatar overlap */}
                  <div className="px-4 pb-3 relative">
                    <div className="absolute -top-5 left-4 w-10 h-10 rounded-[10px] flex items-center justify-center font-display text-sm font-bold text-white"
                      style={{ background:inf.gradient, border:'2.5px solid var(--card)' }}>
                      {inf.initials}
                    </div>
                    {/* AI score */}
                    <div className="absolute -top-5 right-4 flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium"
                      style={{ background:'var(--panel)', border:'1px solid var(--bdr)', color:scoreColor(inf.aiScore) }}>
                      <ShieldCheck size={10}/> {inf.aiScore}%
                    </div>

                    <div className="pt-7 mb-2.5">
                      <div className="font-display text-[14px] font-bold text-t1">{inf.name}</div>
                      <div className="text-[10px] font-mono text-blue">{inf.accounts[0].handle}</div>
                      <div className="flex gap-1 flex-wrap mt-1.5">
                        {inf.niche.map(n=>(
                          <span key={n} className="text-[9px] font-mono px-1.5 py-0.5 rounded text-blue"
                            style={{ background:'var(--blue-d)', border:'1px solid rgba(47,124,246,.2)' }}>{n}</span>
                        ))}
                        {inf.accounts.map(a=>(
                          <span key={a.platform} className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                            style={{ ...PLAT_STYLE[a.platform], border:`1px solid ${PLAT_STYLE[a.platform]?.color}44` }}>
                            {a.platform.slice(0,2).toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-0 pt-2.5" style={{ borderTop:'1px solid var(--bdr)' }}>
                      {[{lbl:'Reach',val:inf.reach},{lbl:'Engagement',val:`${inf.engagement}%`,green:true},{lbl:'Rate/Post',val:formatKES(inf.rate)}].map(s=>(
                        <div key={s.lbl} className="px-1">
                          <div className="text-[8px] font-mono uppercase tracking-[.08em] text-t3">{s.lbl}</div>
                          <div className={clsx('text-[11px] font-mono font-medium', s.green?'text-green':'text-t1')}>{s.val}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-1.5 mt-2.5">
                      <button onClick={e=>{e.stopPropagation();setDetailId(inf.id)}}
                        className="flex-1 py-1.5 rounded-lg text-[10px] font-mono font-medium transition-all text-white cursor-pointer hover:opacity-90"
                        style={{ background:'var(--blue)', border:'1px solid var(--blue)' }}>
                        View Details
                      </button>
                      <button onClick={e=>{e.stopPropagation();toggleFav(inf.id)}}
                        className={clsx('w-8 h-8 rounded-lg flex items-center justify-center transition-all border', favs.has(inf.id)?'text-red':'text-t3 hover:text-red')}
                        style={{ background:'transparent', borderColor: favs.has(inf.id)?'var(--red)':'var(--bdr)' }}>
                        <Heart size={13} fill={favs.has(inf.id)?'currentColor':'none'}/>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((inf,i)=>(
                <div key={inf.id}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all animate-fade-up hover:shadow-md"
                  style={{ background:'var(--card)', border:`1px solid ${shortlist.has(inf.id)?'var(--blue)':'var(--bdr)'}`, animationDelay:`${i*0.03}s` }}
                  onClick={()=>setDetailId(inf.id)}>
                  <div className="w-9 h-9 rounded-[9px] flex items-center justify-center font-display text-sm font-bold text-white flex-shrink-0"
                    style={{ background:inf.gradient }}>{inf.initials}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-t1 truncate">{inf.name}</div>
                    <div className="text-[10px] font-mono text-t3">{inf.location} · {inf.accounts.map(a=>a.handle).join(', ')}</div>
                  </div>
                  <div className="hidden md:flex gap-4">
                    {[{l:'Reach',v:inf.reach},{l:'Eng',v:`${inf.engagement}%`,g:true},{l:'Match',v:`${inf.aiScore}%`,g:true}].map(s=>(
                      <div key={s.l} className="flex flex-col items-end">
                        <div className="text-[8px] font-mono text-t3 uppercase">{s.l}</div>
                        <div className={clsx('text-[11px] font-mono font-medium', s.g?'text-green':'text-t1')}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                  <button onClick={e=>{e.stopPropagation();toggle(inf.id)}}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-all border flex-shrink-0"
                    style={{ background:shortlist.has(inf.id)?'var(--blue)':'transparent', borderColor:shortlist.has(inf.id)?'var(--blue)':'var(--bdr)' }}>
                    {shortlist.has(inf.id)?<Check size={13} className="text-white"/>:<Plus size={13} className="text-t3"/>}
                  </button>
                </div>
              ))}
            </div>
          )}
        </PageShell>
      </div>
      <BottomNav/>

      {/* Comparison Modal */}
      {compareOpen && (
        <ComparisonView
          influencers={Array.from(shortlist).map(id => INFLUENCERS.find(i => i.id === id)!).filter(Boolean)}
          onClose={() => setCompareOpen(false)}
        />
      )}

      {/* Detail Modal */}
      <DetailModal
        open={!!selectedInfluencer}
        onClose={() => setDetailId(null)}
        title={selectedInfluencer?.name || ''}
        subtitle={selectedInfluencer?.accounts[0]?.handle}
        width="lg">
        {selectedInfluencer && (
          <div className="space-y-6">
            {/* Header card */}
            <div className="p-4 rounded-xl" style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
              <div className="flex gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center font-display text-xl font-bold text-white flex-shrink-0"
                  style={{ background: selectedInfluencer.gradient }}>
                  {selectedInfluencer.initials}
                </div>
                <div>
                  <div className="text-[12px] font-mono text-t3 mb-1">AI Safety Score</div>
                  <div className="text-2xl font-bold" style={{ color: selectedInfluencer.aiScore >= 95 ? 'var(--green)' : selectedInfluencer.aiScore >= 88 ? 'var(--blue)' : 'var(--amber)' }}>
                    {selectedInfluencer.aiScore}%
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedInfluencer.niche.map(n => (
                  <span key={n} className="text-[10px] font-mono px-2 py-1 rounded" style={{ background:'var(--blue-light)', color:'var(--blue)' }}>
                    {n}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg" style={{ background:'var(--blue-light)' }}>
                <div className="text-[10px] font-mono text-blue font-semibold">Total Reach</div>
                <div className="text-lg font-bold text-blue">{(selectedInfluencer.totalFollowers / 1000000).toFixed(1)}M</div>
              </div>
              <div className="p-3 rounded-lg" style={{ background:'var(--amber-light)' }}>
                <div className="text-[10px] font-mono text-amber font-semibold">Avg Engagement</div>
                <div className="text-lg font-bold text-amber">{selectedInfluencer.accounts[0]?.engRate || 0}%</div>
              </div>
            </div>

            {/* Social accounts detailed */}
            <div>
              <h3 className="text-[11px] font-mono font-bold text-t3 mb-3 uppercase">Social Accounts</h3>
              <div className="space-y-2">
                {selectedInfluencer.accounts.map(acc => (
                  <a key={acc.platform}
                    href={acc.platform === 'instagram' ? `https://instagram.com/${acc.handle}` :
                          acc.platform === 'tiktok' ? `https://tiktok.com/@${acc.handle}` :
                          acc.platform === 'youtube' ? `https://youtube.com/@${acc.handle}` :
                          `https://twitter.com/${acc.handle}`}
                    target="_blank" rel="noopener noreferrer"
                    className="p-3 rounded-lg flex justify-between items-center cursor-pointer transition-all hover:shadow-md"
                    style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
                    <div className="flex-1">
                      <div className="text-[11px] font-mono font-bold text-t1">{acc.platform.toUpperCase()}</div>
                      <div className="text-[10px] font-mono text-t3">@{acc.handle}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-mono font-bold text-t1">{(acc.followers/1000).toFixed(0)}K</div>
                      <div className="text-[10px] font-mono text-green">{acc.engRate}% eng</div>
                    </div>
                    <span className="text-blue ml-2">↗</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  toggle(selectedInfluencer.id)
                  addToast(`${selectedInfluencer.name} ${shortlist.has(selectedInfluencer.id) ? 'removed from' : 'added to'} shortlist`, 'success')
                }}
                className="flex-1 py-2.5 rounded-lg text-white text-[11px] font-mono font-bold cursor-pointer transition-all"
                style={{ background: shortlist.has(selectedInfluencer.id) ? 'var(--green)' : 'var(--blue)' }}>
                {shortlist.has(selectedInfluencer.id) ? '✓ In Shortlist' : '+ Add to Shortlist'}
              </button>
            </div>
          </div>
        )}
      </DetailModal>
    </div>
  )
}
