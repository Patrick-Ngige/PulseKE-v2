'use client'
import { useState, useRef, useEffect } from 'react'
import Sidebar   from '@/components/layout/Sidebar'
import Topbar    from '@/components/layout/Topbar'
import BottomNav from '@/components/layout/BottomNav'
import { INFLUENCERS } from '@/data/kenya'
import { Search, Plus, X, Send, Paperclip, Smile, Video, Info, Check, RefreshCw, Folder, FileText, Image, Film } from 'lucide-react'
import clsx from 'clsx'

type ConvStatus = 'review' | 'approved' | 'published' | 'draft'

interface Conversation {
  id:       string
  inf:      typeof INFLUENCERS[0]
  campaign: string
  status:   ConvStatus
  unread:   number
  online:   'online' | 'away' | 'offline'
  preview:  string
  time:     string
}

interface Message {
  id:     string
  from:   'me' | 'them' | 'system'
  text:   string
  time:   string
  attach?: { name: string; size: string }
}

const CONVS: Conversation[] = [
  { id:'c1', inf:INFLUENCERS[0], campaign:'Safaricom Nane Nane', status:'review',    unread:2, online:'online', preview:'Nimepload draft ya Reel…',          time:'2m'  },
  { id:'c2', inf:INFLUENCERS[1], campaign:'Equity Vijana Drive', status:'approved',  unread:0, online:'online', preview:'Asante! Nimeupdate bio link.',        time:'1h'  },
  { id:'c3', inf:INFLUENCERS[2], campaign:'Jumia 11.11',          status:'published', unread:0, online:'away',   preview:'Iko live! Check ig.me/p/fo03',       time:'4h'  },
  { id:'c4', inf:INFLUENCERS[3], campaign:'Tusker Oktobafest',    status:'review',    unread:1, online:'online', preview:'Nimeweka v2 na revised CTA…',        time:'5h'  },
  { id:'c5', inf:INFLUENCERS[4], campaign:'KCB Digital',          status:'draft',     unread:0, online:'offline',preview:'Nawork kwenye content sasa hivi.',   time:'1d'  },
]

const MSGS: Record<string, Message[]> = {
  c1: [
    { id:'m1', from:'them', text:'Habari James! Nimepload first draft ya Instagram Reel. Unafikiri nini kuhusu taa katika opening scene?', time:'10:42 AM' },
    { id:'m2', from:'me',   text:'Naangalia sasa. Brief ilisema brand reveal ya sekunde 5 mwishoni — umeweka?', time:'10:45 AM' },
    { id:'m3', from:'them', text:'Ndiyo, iko baada ya transition. Nilitumia logo asset kutoka brand kit.', time:'10:46 AM' },
    { id:'m4', from:'system', text:'Draft uploaded — Safaricom Reel v1', time:'' },
    { id:'m5', from:'them', text:'', time:'10:47 AM', attach:{ name:'Safaricom_Nane_Nane_Reel_v1.mp4', size:'148 MB' } },
    { id:'m6', from:'me',   text:'Nzuri sana overall. Taa katika scene ya kwanza ni giza kidogo — unaweza brightening by 20%?', time:'10:52 AM' },
    { id:'m7', from:'them', text:'Sawa! Nipe dakika 30 kuexport tena.', time:'10:53 AM' },
  ],
  c2: [
    { id:'m1', from:'them', text:'Swali moja — discount code inaweza kuingia caption au link in bio tu?', time:'Jana' },
    { id:'m2', from:'me',   text:'Zote mbili — caption kwa visibility, bio link kwa tracking.', time:'Jana' },
    { id:'m3', from:'system', text:'Post approved and scheduled', time:'' },
  ],
  c3: [
    { id:'m1', from:'me',   text:'Faith, uko on track kwa post ya Jumia weekend hii?', time:'4h ago' },
    { id:'m2', from:'them', text:'Iko live tayari! Likes 41K kwa saa moja tu. Kampuni ya Safaricom coverage great!', time:'4h ago' },
  ],
  c4: [
    { id:'m1', from:'them', text:'Nimeweka v2 na revised CTA uliyoomba. Hook pia nimefanya tighter.', time:'5h ago' },
    { id:'m4', from:'them', text:'', time:'5h ago', attach:{ name:'TuskerReel_v2_Final.mp4', size:'94 MB' } },
  ],
  c5: [
    { id:'m1', from:'me',   text:'David, content ya KCB itakuwa ready lini? Deadline Alhamisi.', time:'1d ago' },
    { id:'m2', from:'them', text:'Nawork kwenye sehemu ya Mombasa ferry. Itakuwa tayari Jumatano.', time:'1d ago' },
  ],
}

const REVIEW_ITEMS = [
  { id:'r1', title:'Safaricom Nane Nane Reel v1', inf:INFLUENCERS[0], status:'review' as const,    grad:INFLUENCERS[0].gradient, plat:'Instagram Reel' },
  { id:'r2', title:'TuskerReel v2 Final',         inf:INFLUENCERS[3], status:'review' as const,    grad:INFLUENCERS[3].gradient, plat:'TikTok Video'   },
  { id:'r3', title:'Equity Vijana Story',         inf:INFLUENCERS[1], status:'approved' as const,  grad:INFLUENCERS[1].gradient, plat:'Instagram Story' },
  { id:'r4', title:'KCB Mombasa Vlog Draft',      inf:INFLUENCERS[4], status:'draft' as const,     grad:INFLUENCERS[4].gradient, plat:'YouTube Short'  },
]

const ASSETS = [
  { name:'Brand Kits',       sub:'Safaricom · EABL · KCB',       icon:<Folder size={17}/>,   color:'var(--blue)'   },
  { name:'Logo Packs',       sub:'PNG · SVG · Variations',        icon:<Image size={17}/>,    color:'#a855f7'       },
  { name:'Campaign Briefs',  sub:'Guidelines & KPIs',              icon:<FileText size={17}/>, color:'var(--green)'  },
  { name:'Video Footage',    sub:'Raw clips · Approved cuts',      icon:<Film size={17}/>,     color:'var(--amber)'  },
  { name:'Copy Decks',       sub:'Swahili + English captions',     icon:<FileText size={17}/>, color:'var(--blue)'   },
  { name:'Photo Library',    sub:'Product shots · 4.1 GB',         icon:<Image size={17}/>,    color:'var(--red)'    },
]

const STATUS_PILL: Record<ConvStatus, { cls: string; label: string }> = {
  review:    { cls:'text-amber border-amber/30 bg-amber/10',   label:'Review'    },
  approved:  { cls:'text-green border-green/30 bg-green/10',   label:'Approved'  },
  published: { cls:'text-blue border-blue/30 bg-blue/10',      label:'Published' },
  draft:     { cls:'text-t3 border-bdr bg-hover',              label:'Draft'     },
}

const ONLINE_COLOR = { online:'var(--green)', away:'var(--amber)', offline:'var(--t3)' }

export default function HubPage() {
  const [activeConv, setActiveConv]   = useState<Conversation>(CONVS[0])
  const [messages,   setMessages]     = useState<Message[]>(MSGS['c1'])
  const [tab,        setTab]          = useState<'msgs'|'review'|'assets'>('msgs')
  const [input,      setInput]        = useState('')
  const [mobView,    setMobView]      = useState<'list'|'chat'>('list')
  const [reviewSt,   setReviewSt]     = useState<Record<string,'review'|'approved'|'rejected'|'draft'>>({ r1:'review', r2:'review', r3:'approved', r4:'draft' })
  const msgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (msgRef.current) msgRef.current.scrollTop = msgRef.current.scrollHeight
  }, [messages])

  const selectConv = (c: Conversation) => {
    setActiveConv(c)
    setMessages(MSGS[c.id] || [])
    setMobView('chat')
  }

  const sendMsg = () => {
    if (!input.trim()) return
    const now = new Date().toLocaleTimeString('en-KE', { hour:'2-digit', minute:'2-digit', timeZone:'Africa/Nairobi' })
    setMessages(prev => [...prev, { id:`m${Date.now()}`, from:'me', text:input.trim(), time:now }])
    setInput('')
  }

  const handleKey = (e: React.KeyboardEvent) => { if (e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendMsg() } }

  const approveContent = (id: string) => setReviewSt(prev => ({ ...prev, [id]:'approved' }))
  const rejectContent  = (id: string) => setReviewSt(prev => ({ ...prev, [id]:'rejected' }))

  return (
    <div className="flex h-screen overflow-hidden" style={{ background:'var(--bg)' }}>
      <Sidebar/>
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar title="Collaboration Hub" subtitle="// Real-time · Nairobi EAT">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono"
            style={{ background:'var(--green-d)', border:'1px solid rgba(40,217,141,.2)', color:'var(--green)' }}>
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background:'var(--green)' }}/>
            12 Live Campaigns
          </div>
        </Topbar>

        {/* Secondary nav tabs */}
        <div className="flex border-b flex-shrink-0" style={{ borderColor:'var(--bdr)', background:'var(--panel)' }}>
          {[
            { key:'msgs',   label:'Messages', badge:CONVS.reduce((s,c)=>s+c.unread,0) },
            { key:'review', label:'Content Review', badge:Object.values(reviewSt).filter(v=>v==='review').length },
            { key:'assets', label:'Asset Library', badge:0 },
          ].map(t=>(
            <button key={t.key} onClick={()=>setTab(t.key as typeof tab)}
              className={clsx('flex items-center gap-2 px-4 py-2.5 text-[11px] font-mono border-b-2 transition-all cursor-pointer relative group', tab===t.key?'text-blue border-b-2':'text-t3 border-transparent hover:text-t2')}
              style={tab===t.key ? { borderBottomColor:'var(--blue)' } : undefined}>
              {t.label}
              {/* Hover indicator for inactive tabs */}
              {tab!==t.key && (
                <span className="absolute inset-0 border-b-2 border-transparent group-hover:border-blue/30 transition-all pointer-events-none rounded-sm" />
              )}
              {t.badge > 0 && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full min-w-[18px] text-center font-bold"
                  style={{ background: t.key==='review'?'var(--amber)':'var(--blue)', color: t.key==='review'?'#000':'#fff' }}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Three-pane body */}
        <div className="flex flex-1 overflow-hidden relative">

          {/* PANE 1: Conversation list */}
          <div className={clsx(
            'flex-col border-r overflow-hidden flex-shrink-0',
            'w-full lg:w-[240px]',
            mobView==='chat' ? 'hidden lg:flex' : 'flex'
          )} style={{ borderColor:'var(--bdr)', background:'var(--panel)' }}>
            <div className="flex items-center gap-2 p-3 border-b flex-shrink-0" style={{ borderColor:'var(--bdr)' }}>
              <div className="relative flex-1">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-t3 pointer-events-none"/>
                <input className="w-full h-8 pl-8 pr-2 rounded-lg text-t1 text-[12px] outline-none"
                  style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}
                  placeholder="Search…"/>
              </div>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-blue flex-shrink-0"
                style={{ background:'var(--blue-d)', border:'1px solid rgba(47,124,246,.25)' }}>
                <Plus size={14}/>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {CONVS.map(c=>{
                const sp = STATUS_PILL[c.status]
                const active = activeConv.id === c.id
                return (
                  <div key={c.id} onClick={()=>selectConv(c)}
                    className="flex items-start gap-2.5 px-3 py-3 cursor-pointer transition-all border-l-[3px]"
                    style={{
                      background: active ? 'var(--blue-d)' : 'transparent',
                      borderLeftColor: active ? 'var(--blue)' : 'transparent',
                    }}>
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-9 h-9 rounded-[9px] flex items-center justify-center font-display text-sm font-bold text-white"
                        style={{ background:c.inf.gradient }}>{c.inf.initials}</div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                        style={{ background:ONLINE_COLOR[c.online], borderColor:'var(--panel)' }}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="text-[12px] font-semibold text-t1 truncate flex-1">{c.inf.name}</div>
                        <div className="text-[9px] font-mono text-t3 flex-shrink-0 ml-1">{c.time}</div>
                      </div>
                      <div className="text-[10px] font-mono text-t3 truncate mb-1.5">{c.preview}</div>
                      <div className="flex items-center justify-between">
                        <span className={clsx('text-[8px] font-mono px-1.5 py-0.5 rounded border', sp.cls)}>{sp.label}</span>
                        {c.unread > 0 && (
                          <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono text-white"
                            style={{ background:'var(--blue)' }}>{c.unread}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* PANE 2: Chat */}
          <div className={clsx(
            'flex-col flex-1 overflow-hidden min-w-0',
            mobView==='list' ? 'hidden lg:flex' : 'flex'
          )} style={{ background:'var(--bg)' }}>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b flex-shrink-0"
              style={{ background:'var(--panel)', borderColor:'var(--bdr)' }}>
              <button onClick={()=>setMobView('list')}
                className="lg:hidden flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-md"
                style={{ background:'var(--blue-d)', color:'var(--blue)' }}>
                ← Back
              </button>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display text-[10px] font-bold text-white flex-shrink-0"
                style={{ background:activeConv.inf.gradient }}>{activeConv.inf.initials}</div>
              <div>
                <div className="font-display text-[13px] font-bold text-t1">{activeConv.inf.name}</div>
                <div className="text-[10px] font-mono text-t3">{activeConv.campaign}</div>
              </div>
              <div className="ml-auto flex gap-2">
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-t2 hover:text-blue transition-colors border"
                  style={{ borderColor:'var(--bdr)' }}><Video size={14}/></button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-t2 hover:text-blue transition-colors border"
                  style={{ borderColor:'var(--bdr)' }}><Info size={14}/></button>
              </div>
            </div>

            {/* Messages */}
            <div ref={msgRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {messages.map(m => {
                if (m.from === 'system') return (
                  <div key={m.id} className="self-center text-[10px] font-mono text-t3 px-3 py-1 rounded-full"
                    style={{ background:'var(--hover)', border:'1px solid var(--bdr)' }}>{m.text}</div>
                )
                const mine = m.from === 'me'
                return (
                  <div key={m.id} className={clsx('flex gap-2 max-w-[78%] animate-fade-up', mine&&'self-end flex-row-reverse')}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center font-display text-[9px] font-bold text-white flex-shrink-0 self-end"
                      style={{ background: mine ? 'linear-gradient(135deg,#2f7cf6,#7c3aed)' : activeConv.inf.gradient }}>
                      {mine ? 'AR' : activeConv.inf.initials}
                    </div>
                    <div>
                      <div className="rounded-xl px-3.5 py-2.5 text-[12px] leading-relaxed"
                        style={{
                          background: mine ? 'var(--blue)' : 'var(--card)',
                          border: mine ? 'none' : '1px solid var(--bdr)',
                          color: mine ? '#fff' : 'var(--t1)',
                          borderRadius: mine ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
                        }}>
                        {m.text}
                        {m.attach && (
                          <div className="flex items-center gap-2 mt-2 p-2 rounded-lg"
                            style={{ background: mine ? 'rgba(0,0,0,.2)' : 'var(--hover)', border:'1px solid rgba(255,255,255,.1)' }}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background:'var(--blue-d)' }}><Paperclip size={14} style={{ color:'var(--blue)' }}/></div>
                            <div>
                              <div className="text-[11px] font-medium">{m.attach.name}</div>
                              <div className="text-[9px] opacity-60">{m.attach.size}</div>
                            </div>
                          </div>
                        )}
                      </div>
                      {m.time && <div className="text-[9px] font-mono mt-1 px-1" style={{ color: mine?'var(--t3)':'var(--t3)' }}>{m.time} EAT</div>}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Input */}
            <div className="p-3 border-t flex-shrink-0" style={{ background:'var(--panel)', borderColor:'var(--bdr)' }}>
              <div className="flex items-center gap-2 p-2 rounded-xl" style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
                <button className="w-7 h-7 rounded-lg flex items-center justify-center text-t3 hover:text-t2 transition-colors flex-shrink-0">
                  <Paperclip size={14}/>
                </button>
                <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey}
                  className="flex-1 bg-transparent outline-none resize-none text-t1 text-[13px] leading-relaxed max-h-20"
                  placeholder="Andika ujumbe… (Swahili/English)"
                  rows={1}/>
                <button className="w-7 h-7 rounded-lg flex items-center justify-center text-t3 hover:text-t2 transition-colors flex-shrink-0">
                  <Smile size={14}/>
                </button>
                <button onClick={sendMsg}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0 transition-all"
                  style={{ background:'var(--blue)' }}>
                  <Send size={14}/>
                </button>
              </div>
            </div>
          </div>

          {/* PANE 3: Right panel */}
          <div className="hidden lg:flex flex-col border-l overflow-hidden flex-shrink-0 w-[280px]"
            style={{ borderColor:'var(--bdr)', background:'var(--panel)' }}>

            {tab === 'assets' ? (
              <>
                <div className="p-3 border-b flex-shrink-0" style={{ borderColor:'var(--bdr)' }}>
                  <div className="font-display text-[12px] font-bold text-t1">Campaign Assets</div>
                </div>
                <div className="flex-1 overflow-y-auto p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {ASSETS.map(a=>(
                      <div key={a.name} className="p-3 rounded-xl cursor-pointer transition-all card-hover flex flex-col gap-2"
                        style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ background:`${a.color}22`, color:a.color }}>{a.icon}</div>
                        <div className="text-[11px] font-semibold text-t1 leading-tight">{a.name}</div>
                        <div className="text-[9px] font-mono text-t3">{a.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 border-b flex-shrink-0" style={{ borderColor:'var(--bdr)' }}>
                  <div className="font-display text-[12px] font-bold text-t1">
                    {tab==='review' ? 'Content Review' : 'Pending Review'}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                  {REVIEW_ITEMS.map(r=>{
                    const st = reviewSt[r.id] ?? r.status
                    const stColor = { review:'var(--amber)', approved:'var(--green)', rejected:'var(--red)', draft:'var(--t3)' }[st]
                    return (
                      <div key={r.id} className="rounded-xl overflow-hidden transition-all"
                        style={{ background:'var(--card)', border:`1px solid ${st==='approved'?'rgba(40,217,141,.3)':st==='rejected'?'rgba(240,69,74,.3)':'var(--bdr)'}` }}>
                        {/* Preview */}
                        <div className="h-24 relative cursor-pointer" style={{ background:r.grad }}>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center"
                              style={{ background:'rgba(0,0,0,.4)', backdropFilter:'blur(4px)' }}>
                              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4 ml-0.5"><path d="M8 5v14l11-7z"/></svg>
                            </div>
                          </div>
                          <div className="absolute top-2 left-2 text-[8px] font-mono px-1.5 py-0.5 rounded"
                            style={{ background:'rgba(0,0,0,.5)', color:'#fff' }}>{r.plat}</div>
                          <div className="absolute top-2 right-2 text-[8px] font-mono font-medium px-1.5 py-0.5 rounded uppercase"
                            style={{ background:stColor, color: st==='rejected'?'#fff':'#000' }}>{st}</div>
                        </div>
                        {/* Body */}
                        <div className="p-2.5">
                          <div className="text-[11px] font-semibold text-t1 mb-0.5">{r.title}</div>
                          <div className="text-[9px] font-mono text-t3 mb-2">{r.inf.name}</div>
                          {st === 'review' && (
                            <div className="flex gap-1.5">
                              <button onClick={()=>approveContent(r.id)}
                                className="flex-1 h-7 rounded-lg text-[10px] font-mono flex items-center justify-center gap-1 transition-all"
                                style={{ background:'var(--green-d)', border:'1px solid rgba(40,217,141,.3)', color:'var(--green)' }}>
                                <Check size={10}/> Approve
                              </button>
                              <button onClick={()=>rejectContent(r.id)}
                                className="flex-1 h-7 rounded-lg text-[10px] font-mono flex items-center justify-center gap-1 transition-all"
                                style={{ background:'var(--red-d)', border:'1px solid rgba(240,69,74,.3)', color:'var(--red)' }}>
                                <X size={10}/> Reject
                              </button>
                            </div>
                          )}
                          {st !== 'review' && (
                            <div className="text-[9px] font-mono" style={{ color:stColor }}>
                              {st==='approved'?'✓ Approved — ready to publish':st==='rejected'?'✗ Changes requested':'● Draft in progress'}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                {/* Schedule strip */}
                <div className="m-3 p-3 rounded-xl flex-shrink-0" style={{ background:'var(--blue)' }}>
                  <div className="text-[8px] font-mono text-white/60 uppercase mb-0.5">Next Scheduled Post</div>
                  <div className="text-[12px] font-semibold text-white">Safaricom Nane Nane Reel</div>
                  <div className="text-[10px] font-mono text-white/70">Aug 8, 2024 · 7:30 PM EAT</div>
                  <div className="flex -space-x-1.5 mt-2">
                    {INFLUENCERS.slice(0,4).map(inf=>(
                      <div key={inf.id} className="w-6 h-6 rounded-lg border-2 flex items-center justify-center font-display text-[7px] font-bold text-white"
                        style={{ background:inf.gradient, borderColor:'var(--blue)' }}>{inf.initials}</div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
      <BottomNav/>
    </div>
  )
}
