'use client'
import Sidebar   from '@/components/layout/Sidebar'
import Topbar    from '@/components/layout/Topbar'
import BottomNav from '@/components/layout/BottomNav'
import { StatusBadge, PageShell } from '@/components/ui'
import { AI_INSIGHTS, INFLUENCERS, CAMPAIGNS, formatKES } from '@/data/kenya'
import { ShieldCheck, TrendingUp, AlertTriangle, Users, Sparkles, Download, Plus, BarChart2 } from 'lucide-react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

export default function AIInsightsPage() {
  const scoreColor = (s: number) => s >= 95 ? 'var(--green)' : s >= 88 ? 'var(--blue)' : 'var(--amber)'

  const forecastBarData = {
    labels: ['Jun','Jul','Aug','Sep','Oct'],
    datasets: [{
      data: [28, 42, 38, 65, 100],
      backgroundColor: ['rgba(47,124,246,.2)','rgba(47,124,246,.3)','rgba(47,124,246,.4)','rgba(47,124,246,.6)','rgba(47,124,246,1)'],
      borderRadius: 4,
      borderWidth: 0,
    }],
  }
  const forecastOpts = {
    responsive: true, maintainAspectRatio: false, animation: { duration: 800 },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background:'var(--bg)' }}>
      <Sidebar/>
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar title="AI Insights & Predictions" subtitle="// Neural analysis · Kenyan market intelligence">
          <button className="hidden md:flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11px] font-mono transition-all"
            style={{ background:'var(--card)', border:'1px solid var(--bdr)', color:'var(--t2)' }}>
            <Download size={12}/> Export Report
          </button>
          <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-white text-[11px] font-mono"
            style={{ background:'var(--blue)' }}>
            <Plus size={12}/> New Projection
          </button>
        </Topbar>

        <PageShell>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

            {/* LEFT: 8 columns */}
            <div className="lg:col-span-8 flex flex-col gap-4">

              {/* Predictive forecast */}
              <div className="rounded-xl p-4" style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 font-display text-[13px] font-bold text-t1">
                      <BarChart2 size={15} style={{ color:'var(--blue)' }}/>
                      Predictive Performance Forecast
                    </div>
                    <div className="text-[10px] font-mono text-t3 mt-0.5">// Next campaign · {CAMPAIGNS[0].name}</div>
                  </div>
                  <div className="text-[10px] font-mono text-t3 px-2 py-1 rounded"
                    style={{ background:'var(--hover)', border:'1px solid var(--bdr)' }}>
                    Confidence: {AI_INSIGHTS.forecast.confidence}%
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { l:'Estimated Reach',    v:AI_INSIGHTS.forecast.reach,      delta:'+12% vs avg',  up:true  },
                    { l:'Predicted Eng.',     v:AI_INSIGHTS.forecast.engagement,  delta:'+0.5% vs niche',up:true },
                    { l:'Projected ROI',      v:AI_INSIGHTS.forecast.roi,         delta:'Optimised KES', up:true },
                  ].map(s=>(
                    <div key={s.l} className="rounded-xl p-3" style={{ background:'var(--hover)', border:'1px solid var(--bdr)' }}>
                      <div className="text-[9px] font-mono text-t3 uppercase tracking-[.08em] mb-1">{s.l}</div>
                      <div className="font-display text-[15px] font-bold text-t1 mb-1" style={{ letterSpacing:'-.02em' }}>{s.v}</div>
                      <div className="flex items-center gap-1 text-[10px] font-mono" style={{ color:s.up?'var(--green)':'var(--red)' }}>
                        <TrendingUp size={10}/> {s.delta}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Forecast bar chart */}
                <div className="relative rounded-lg p-3" style={{ background:'var(--hover)' }}>
                  <div className="absolute top-2 right-3 text-[9px] font-mono font-bold text-blue">PEAK</div>
                  <div style={{ height:'80px' }}>
                    <Bar data={forecastBarData} options={forecastOpts}/>
                  </div>
                  <div className="flex justify-between mt-1">
                    {['Jun','Jul','Aug','Sep','Oct'].map(m=>(
                      <span key={m} className="text-[8px] font-mono text-t3 flex-1 text-center">{m}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Lookalike Recommendations */}
              <div className="rounded-xl p-4" style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 font-display text-[13px] font-bold text-t1">
                    <Users size={15} style={{ color:'var(--blue)' }}/>
                    AI Lookalike Recommendations
                  </div>
                  <button className="text-[11px] font-mono text-blue hover:opacity-70">View All</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {AI_INSIGHTS.lookalikes.map(l=>(
                    <div key={l.name} className="flex items-center gap-3 p-3 rounded-xl transition-all card-hover"
                      style={{ border:'1px solid var(--bdr)', background:'var(--hover)' }}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center font-display text-base font-bold text-white flex-shrink-0"
                        style={{ background:l.gradient }}>{l.initials}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-semibold text-t1 truncate">{l.name}</div>
                        <div className="text-[9px] font-mono mt-0.5" style={{ color:scoreColor(l.match) }}>{l.match}% match</div>
                        <div className="flex gap-1 flex-wrap mt-1.5">
                          {l.niche.map(n=>(
                            <span key={n} className="text-[8px] font-mono px-1.5 py-0.5 rounded"
                              style={{ background:'var(--blue-d)', color:'var(--blue)' }}>{n}</span>
                          ))}
                        </div>
                      </div>
                      <button className="flex-shrink-0 text-t3 hover:text-blue transition-colors">
                        <Plus size={16}/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="rounded-xl overflow-hidden" style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
                <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom:'1px solid var(--bdr)' }}>
                  <AlertTriangle size={14} style={{ color:'var(--amber)' }}/>
                  <div className="font-display text-[13px] font-bold text-t1">Influencer Risk Assessment</div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[460px]">
                    <thead style={{ background:'rgba(22,34,56,.4)', borderBottom:'1px solid var(--bdr)' }}>
                      <tr>
                        {['Influencer','Risk Factor','Sentiment Trend','Status'].map(h=>(
                          <th key={h} className="px-4 py-2.5 text-left text-[9px] font-mono uppercase tracking-[.09em] text-t3 font-normal last:text-right">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {AI_INSIGHTS.riskInfluencers.map((r,i)=>{
                        const inf = INFLUENCERS.find(x=>x.accounts.some(a=>a.handle===r.handle))
                        return (
                          <tr key={r.handle} className="border-b last:border-b-0 transition-colors hover:bg-[var(--hover)] cursor-pointer"
                            style={{ borderColor:'var(--bdr)' }}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {inf && (
                                  <div className="w-6 h-6 rounded-[6px] flex items-center justify-center font-display text-[8px] font-bold text-white flex-shrink-0"
                                    style={{ background:inf.gradient }}>{inf.initials}</div>
                                )}
                                <span className="text-[12px] font-mono text-t2">{r.handle}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-[11px] text-t3">{r.risk}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5 text-[11px] font-mono"
                                style={{ color:r.sentiment==='Declining'?'var(--red)':'var(--amber)' }}>
                                <TrendingUp size={12}/> {r.sentiment}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <StatusBadge status={r.status}/>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* RIGHT: 4 columns */}
            <div className="lg:col-span-4 flex flex-col gap-4">

              {/* Brand safety score */}
              <div className="rounded-xl p-4" style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
                <div className="flex items-center gap-2 mb-4 font-display text-[13px] font-bold text-t1">
                  <ShieldCheck size={15} style={{ color:'var(--green)' }}/>
                  AI Brand Safety Score
                </div>
                {/* Donut SVG */}
                <div className="flex flex-col items-center py-3">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 36 36" className="w-full h-full">
                      <path className="opacity-10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none" stroke="white" strokeDasharray="100,100" strokeWidth="3"/>
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none" stroke="#28d98d"
                        strokeDasharray={`${AI_INSIGHTS.brandSafetyScore},100`}
                        strokeLinecap="round" strokeWidth="3"/>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display text-3xl font-bold text-t1">{AI_INSIGHTS.brandSafetyScore}</span>
                      <span className="text-[9px] font-mono text-green uppercase tracking-[.08em]">Safe</span>
                    </div>
                  </div>
                  <p className="text-center text-[10px] font-mono text-t3 leading-relaxed mt-3 px-2">
                    Neural vision analysis confirmed 0% inappropriate content across 3,200+ indexed posts in Kenyan market.
                  </p>
                </div>
                <div className="flex flex-col gap-3 mt-2">
                  {[
                    { l:'Visual Integrity',    v:AI_INSIGHTS.visualIntegrity },
                    { l:'Caption Sentiment',   v:AI_INSIGHTS.captionSentiment },
                    { l:'Swahili Compliance',  v:96 },
                  ].map(s=>(
                    <div key={s.l}>
                      <div className="flex justify-between text-[10px] font-mono mb-1">
                        <span className="text-t3">{s.l}</span>
                        <span className="text-t1">{s.v}/100</span>
                      </div>
                      <div className="h-[3px] rounded-full overflow-hidden" style={{ background:'var(--bdr)' }}>
                        <div className="h-full rounded-full animate-bar-in" style={{ width:`${s.v}%`, background:'var(--green)' }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kenyan Trend Spotting */}
              <div className="rounded-xl p-4" style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
                <div className="flex items-center gap-2 mb-4 font-display text-[13px] font-bold text-t1">
                  <Sparkles size={15} style={{ color:'var(--blue)' }}/>
                  Kenya Trend Spotting
                </div>
                <div className="flex flex-col gap-3">
                  {AI_INSIGHTS.trends.map(t=>(
                    <div key={t.tag} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display text-[10px] font-bold text-blue flex-shrink-0"
                        style={{ background:'var(--blue-d)' }}>#{t.rank}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-semibold text-t1 truncate">{t.tag}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background:'var(--bdr)' }}>
                            <div className="h-full rounded-full animate-bar-in" style={{ width:`${t.bar}%`, background:'var(--blue)' }}/>
                          </div>
                          <span className="text-[10px] font-mono flex-shrink-0" style={{ color:'var(--green)' }}>{t.growth}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Topic cloud */}
                <div className="mt-4 pt-4" style={{ borderTop:'1px solid var(--bdr)' }}>
                  <div className="text-[9px] font-mono text-t3 uppercase tracking-[.1em] mb-2">Kenyan Topic Cloud</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['#MpesaFirst','#NairobiStartups','#SafaricomFibre','#KitchenKE','#FitKE','#Hustlers','#TechKE','#JumiaSale'].map(t=>(
                      <span key={t} className="text-[9px] font-mono px-2 py-1 rounded-full"
                        style={{ background:'var(--hover)', color:'var(--t3)', border:'1px solid var(--bdr)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Optimal posting times for Kenya */}
              <div className="rounded-xl p-4" style={{ background:'var(--card)', border:'1px solid var(--bdr)' }}>
                <div className="font-display text-[13px] font-bold text-t1 mb-1">Optimal Posting Times</div>
                <div className="text-[10px] font-mono text-t3 mb-4">// EAT (GMT+3) · Kenyan audience</div>
                <div className="flex flex-col gap-2.5">
                  {[
                    { plat:'TikTok',    time:'7:30 PM – 9:00 PM', day:'Mon–Thu', color:'#69c9d0', peak:true },
                    { plat:'Instagram', time:'12:00 PM – 1:00 PM', day:'Tue–Fri', color:'#f09433', peak:false },
                    { plat:'YouTube',   time:'8:00 AM – 10:00 AM',day:'Sat–Sun', color:'#ff5555', peak:false },
                  ].map(p=>(
                    <div key={p.plat} className="flex items-center gap-3 p-2.5 rounded-lg"
                      style={{ background:'var(--hover)', border:`1px solid ${p.peak?`${p.color}44`:'var(--bdr)'}` }}>
                      <div className="w-5 h-5 rounded-[5px] flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0"
                        style={{ background:p.color }}>{p.plat.slice(0,2).toUpperCase()}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-semibold text-t1">{p.time} EAT</div>
                        <div className="text-[9px] font-mono text-t3">{p.day}</div>
                      </div>
                      {p.peak && (
                        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded flex-shrink-0"
                          style={{ background:'rgba(40,217,141,.12)', color:'var(--green)' }}>PEAK</span>
                      )}
                    </div>
                  ))}
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
