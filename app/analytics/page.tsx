'use client'
import { useState } from 'react'
import Sidebar   from '@/components/layout/Sidebar'
import Topbar    from '@/components/layout/Topbar'
import BottomNav from '@/components/layout/BottomNav'
import { PageShell } from '@/components/ui'
import { ANALYTICS, INFLUENCERS, CAMPAIGNS, formatKES } from '@/data/kenya'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Tooltip, Filler
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Download, TrendingUp, TrendingDown, ShoppingCart, DollarSign, Smile, Rocket } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Filler)

type Period = '7d' | '30d' | '90d'

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30d')
  const series = ANALYTICS.engagementSeries[period]

  const barData = {
    labels: series.labels,
    datasets: [
      { label:'Reach (K)', data:series.reach, backgroundColor:'rgba(47,124,246,0.25)', borderColor:'#2f7cf6', borderWidth:1.5, borderRadius:4, yAxisID:'y', order:2, type:'bar' as const },
      { label:'Eng %',    data:series.eng,   borderColor:'#28d98d', borderWidth:2, pointRadius:3, tension:0.4, fill:false, yAxisID:'y1', order:1, type:'line' as const, pointBackgroundColor:'#28d98d' },
    ],
  }

  const chartOpts = {
    responsive:true, maintainAspectRatio:false, animation:{ duration:500 },
    plugins:{ legend:{ display:false }, tooltip:{ backgroundColor:'#0d1524', borderColor:'#1e3050', borderWidth:1, titleFont:{family:'DM Mono',size:10}, bodyFont:{family:'DM Mono',size:10}, titleColor:'#8ba3c4', bodyColor:'#e8eef8' }},
    scales:{
      x:{ grid:{color:'rgba(30,48,80,.4)'}, ticks:{font:{family:'DM Mono',size:9},color:'#4d6585'}, border:{display:false} },
      y:{ position:'left' as const, grid:{color:'rgba(30,48,80,.4)'}, ticks:{font:{family:'DM Mono',size:9},color:'#4d6585'}, border:{display:false} },
      y1:{ position:'right' as const, grid:{display:false}, ticks:{font:{family:'DM Mono',size:9},color:'#4d6585', callback:(v:number|string)=>`${v}%`}, border:{display:false} },
    },
  }

  const genderData = {
    labels: ANALYTICS.demographics.gender.map(g=>g.label),
    datasets:[{ data:ANALYTICS.demographics.gender.map(g=>g.pct), backgroundColor:ANALYTICS.demographics.gender.map(g=>g.color), borderWidth:0, hoverOffset:3 }],
  }
  const genderOpts = { responsive:false, cutout:'70%', plugins:{ legend:{display:false}, tooltip:{ backgroundColor:'#0d1524', borderColor:'#1e3050', borderWidth:1 } }, animation:{ duration:800 } }

  const ROI_CARDS = [
    { label:'Campaign Spend',   value:formatKES(ANALYTICS.totalSpend), delta:'12% under cap', up:true,  accent:'var(--blue)',   icon:<DollarSign size={13}/> },
    { label:'Conversions',      value:ANALYTICS.conversions.toLocaleString(), delta:'8.4% vs prior', up:true, accent:'var(--green)', icon:<ShoppingCart size={13}/> },
    { label:'Avg CPA',          value:formatKES(ANALYTICS.avgCPA),  delta:'4.1% optimised', up:true,  accent:'var(--amber)',  icon:<TrendingDown size={13}/> },
    { label:'Brand Lift',       value:`+${ANALYTICS.brandLift}%`,   delta:'Significant',    up:true,  accent:'var(--purple)', icon:<Rocket size={13}/> },
  ]

  return (
    <div className="flex h-screen overflow-hidden" style={{ background:'var(--bg)' }}>
      <Sidebar/>
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar title="Advanced Analytics" subtitle="// Campaign intelligence · EAT timezone">
          <select className="hidden md:block h-8 px-2 rounded-lg text-t1 text-[11px] font-mono outline-none cursor-pointer appearance-none"
            style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
            {CAMPAIGNS.filter(c=>c.status==='active').map(c=><option key={c.id}>{c.name}</option>)}
          </select>
          {(['7d','30d','90d'] as Period[]).map(p=>(
            <button key={p} onClick={()=>setPeriod(p)}
              className="hidden md:block h-8 px-2.5 rounded-lg text-[10px] font-mono transition-all"
              style={{ background:period===p?'var(--blue-d)':'transparent', border:`1px solid ${period===p?'var(--blue)':'var(--bdr)'}`, color:period===p?'var(--blue)':'var(--t3)' }}>
              {p.toUpperCase()}
            </button>
          ))}
          <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-white text-[11px] font-mono" style={{ background:'var(--blue)' }}>
            <Download size={12}/> Export
          </button>
        </Topbar>

        <PageShell>
          {/* ROI cards */}
          <div className="text-[9px] font-mono text-t3 uppercase tracking-[.1em] mb-2">Campaign ROI Overview</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {ROI_CARDS.map((c,i)=>(
              <div key={i} className="rounded-xl p-4 card-hover animate-fade-up"
                style={{ background:'var(--card)', border:'1px solid var(--bdr)', animationDelay:`${i*0.05}s` }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-3"
                  style={{ background:`${c.accent}22`, color:c.accent }}>{c.icon}</div>
                <div className="text-[9px] font-mono text-t3 uppercase tracking-[.08em] mb-1">{c.label}</div>
                <div className="font-display text-xl font-bold text-t1 mb-1.5" style={{ letterSpacing:'-.02em' }}>{c.value}</div>
                <div className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full w-fit"
                  style={{ background:c.up?'var(--green-d)':'var(--red-d)', color:c.up?'var(--green)':'var(--red)' }}>
                  {c.up ? <TrendingUp size={10}/> : <TrendingDown size={10}/>} {c.delta}
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Engagement chart */}
            <div className="rounded-xl overflow-hidden" style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
              <div className="flex items-start justify-between p-4 pb-0">
                <div>
                  <div className="font-display text-[13px] font-bold text-t1">True Engagement Metrics</div>
                  <div className="text-[10px] font-mono text-t3">// Reach × Engagement rate</div>
                </div>
                <div className="flex gap-2">
                  {(['7d','30d','90d'] as Period[]).map(p=>(
                    <button key={p} onClick={()=>setPeriod(p)}
                      className="h-6 px-2 rounded text-[9px] font-mono transition-all"
                      style={{ background:period===p?'var(--blue-d)':'transparent', border:`1px solid ${period===p?'var(--blue)':'var(--bdr)'}`, color:period===p?'var(--blue)':'var(--t3)' }}>
                      {p.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4" style={{ height:'200px' }}>
                <Bar data={barData} options={chartOpts}/>
              </div>
              <div className="flex gap-4 px-4 pb-3">
                {[{c:'var(--blue)',l:'Reach'},{c:'var(--green)',l:'Engagement'}].map(x=>(
                  <div key={x.l} className="flex items-center gap-1.5 text-[10px] font-mono text-t3">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background:x.c }}/>{x.l}
                  </div>
                ))}
              </div>
            </div>

            {/* Sentiment */}
            <div className="rounded-xl p-4" style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
              <div className="font-display text-[13px] font-bold text-t1 mb-0.5">AI Sentiment Analysis</div>
              <div className="text-[10px] font-mono text-t3 mb-4">// Audience comment analysis · Swahili + English</div>
              <div className="flex flex-col gap-3">
                {[
                  { label:'Positive', pct:ANALYTICS.sentiment.positive, color:'var(--green)' },
                  { label:'Neutral',  pct:ANALYTICS.sentiment.neutral,  color:'var(--t3)'   },
                  { label:'Negative', pct:ANALYTICS.sentiment.negative,  color:'var(--red)'  },
                ].map(s=>(
                  <div key={s.label}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-t2">{s.label}</span>
                      <span className="font-mono font-medium" style={{ color:s.color }}>{s.pct}%</span>
                    </div>
                    <div className="h-[5px] rounded-full overflow-hidden" style={{ background:'var(--bdr)' }}>
                      <div className="h-full rounded-full animate-bar-in" style={{ width:`${s.pct}%`, background:s.color }}/>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg" style={{ background:'var(--hover)', border:'1px solid var(--bdr)' }}>
                <div className="text-[9px] font-mono text-blue uppercase mb-1">Top Insight</div>
                <div className="text-[11px] text-t2 italic leading-relaxed">"Audiences frequently cite M-Pesa integration as a key purchase driver — 4.1× more than product price."</div>
              </div>
              <div className="mt-2 p-3 rounded-lg" style={{ background:'var(--hover)', border:'1px solid rgba(245,166,35,.25)' }}>
                <div className="text-[9px] font-mono text-amber uppercase mb-1">Watch</div>
                <div className="text-[11px] text-t2 italic leading-relaxed">"Delivery time to Mombasa and Kisumu cited in 18% of negative comments — escalate to logistics team."</div>
              </div>
            </div>
          </div>

          {/* Demographics */}
          <div className="rounded-xl p-4 mb-4" style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
            <div className="font-display text-[13px] font-bold text-t1 mb-0.5">Audience Demographics</div>
            <div className="text-[10px] font-mono text-t3 mb-4">// Combined audience across all assigned influencers</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Age */}
              <div className="rounded-lg p-3" style={{ background:'var(--hover)', border:'1px solid var(--bdr)' }}>
                <div className="text-[9px] font-mono text-t3 uppercase mb-3">Age Distribution</div>
                <div className="flex flex-col gap-2">
                  {ANALYTICS.demographics.age.map(a=>(
                    <div key={a.range} className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-t3 w-8 flex-shrink-0">{a.range}</span>
                      <div className="flex-1 h-[4px] rounded-full overflow-hidden" style={{ background:'var(--bdr)' }}>
                        <div className="h-full rounded-full animate-bar-in" style={{ width:`${a.pct}%`, background:'var(--blue)' }}/>
                      </div>
                      <span className="text-[9px] font-mono text-t2 w-6 text-right">{a.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div className="rounded-lg p-3" style={{ background:'var(--hover)', border:'1px solid var(--bdr)' }}>
                <div className="text-[9px] font-mono text-t3 uppercase mb-3">Gender Split</div>
                <div className="flex items-center gap-4 justify-center">
                  <Doughnut data={genderData} options={genderOpts} width={80} height={80}/>
                  <div className="flex flex-col gap-2">
                    {ANALYTICS.demographics.gender.map(g=>(
                      <div key={g.label} className="flex items-center gap-2 text-[11px] font-mono">
                        <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background:g.color }}/>
                        <span className="text-t1 font-medium">{g.pct}%</span>
                        <span className="text-t3">{g.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Geography */}
              <div className="rounded-lg p-3" style={{ background:'var(--hover)', border:'1px solid var(--bdr)' }}>
                <div className="text-[9px] font-mono text-t3 uppercase mb-3">Top Locations (Kenya)</div>
                <div className="flex flex-col gap-2">
                  {ANALYTICS.demographics.locations.map(l=>(
                    <div key={l.city}>
                      <div className="flex justify-between text-[10px] font-mono mb-1">
                        <span className="text-t2">{l.city}</span>
                        <span className="text-blue font-medium">{l.pct}%</span>
                      </div>
                      <div className="h-[3px] rounded-full overflow-hidden" style={{ background:'var(--bdr)' }}>
                        <div className="h-full rounded-full animate-bar-in" style={{ width:`${l.pct}%`, background:'var(--blue)' }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top performers */}
          <div className="rounded-xl overflow-hidden" style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
            <div className="flex items-center justify-between p-4" style={{ borderBottom:'1px solid var(--bdr)' }}>
              <div>
                <div className="font-display text-[13px] font-bold text-t1">Top Performing Influencers</div>
                <div className="text-[10px] font-mono text-t3">// Ranked by ROI · Kenyan market</div>
              </div>
              <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-white text-[11px] font-mono" style={{ background:'var(--blue)' }}>
                <Download size={12}/> Export
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <thead style={{ borderBottom:'1px solid var(--bdr)', background:'rgba(22,34,56,.4)' }}>
                  <tr>
                    {['Influencer','Location','Reach','Eng. Rate','Sentiment','ROI'].map(h=>(
                      <th key={h} className="px-4 py-2.5 text-left text-[9px] font-mono uppercase tracking-[.09em] text-t3 font-normal last:text-right">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {INFLUENCERS.slice(0,5).sort((a,b)=>b.aiScore-a.aiScore).map((inf,i)=>(
                    <tr key={inf.id} className="border-b last:border-b-0 cursor-pointer transition-colors hover:bg-[var(--hover)]"
                      style={{ borderColor:'var(--bdr)' }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-[7px] flex items-center justify-center font-display text-[9px] font-bold text-white flex-shrink-0"
                            style={{ background:inf.gradient }}>{inf.initials}</div>
                          <div>
                            <div className="text-[12px] font-medium text-t1">{inf.name}</div>
                            <div className="text-[9px] font-mono text-t3">{inf.accounts[0].handle}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[11px] font-mono text-t3">{inf.location}</td>
                      <td className="px-4 py-3 text-[11px] font-mono text-t1">{inf.reach}</td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded"
                          style={{ background:inf.engagement>=7?'var(--green-d)':inf.engagement>=5?'var(--blue-d)':'var(--amber-d)', color:inf.engagement>=7?'var(--green)':inf.engagement>=5?'var(--blue)':'var(--amber)', border:`1px solid ${inf.engagement>=7?'rgba(40,217,141,.2)':inf.engagement>=5?'rgba(47,124,246,.2)':'rgba(245,166,35,.2)'}` }}>
                          {inf.engagement}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-t2">{inf.sentiment}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-display text-[14px] font-bold text-blue">{(2.0 + i*0.4).toFixed(1)}×</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </PageShell>
      </div>
      <BottomNav/>
    </div>
  )
}
