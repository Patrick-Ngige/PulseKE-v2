'use client'
import { useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import BottomNav from '@/components/layout/BottomNav'
import { PageShell } from '@/components/ui'
import { Bell, Lock, Users, Settings as SettingsIcon, ArrowLeft, Save, Copy, Check } from 'lucide-react'

type Tab = 'general' | 'notifications' | 'team' | 'security'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('general')
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const TABS = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'security', label: 'Security', icon: Lock },
  ] as const

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar title="Settings" subtitle="// Account preferences & configuration">
          <Link href="/dashboard" className="flex items-center gap-1 h-8 px-3 rounded-lg text-t2 hover:text-t1 transition-colors"
            style={{ border: '1px solid var(--bdr)' }}>
            <ArrowLeft size={14} /> Back
          </Link>
        </Topbar>

        <PageShell>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar tabs */}
            <div className="flex lg:flex-col gap-2 border-b lg:border-b-0 lg:border-r pb-4 lg:pb-0 lg:pr-6 lg:min-w-[180px]"
              style={{ borderColor: 'var(--bdr)' }}>
              {TABS.map(tab => {
                const Tab = tab.icon
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left"
                    style={{
                      background: activeTab === tab.id ? 'var(--blue-d)' : 'transparent',
                      color: activeTab === tab.id ? 'var(--blue)' : 'var(--t3)',
                      border: activeTab === tab.id ? '1px solid var(--blue)' : 'transparent',
                    }}>
                    <Tab size={16} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Content area */}
            <div className="flex-1">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-lg font-bold text-t1 mb-4">General Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-mono text-t2">Workspace Name</label>
                        <input type="text" defaultValue="PulseKE Agency" 
                          className="w-full h-9 px-3 rounded-lg text-t1 text-sm outline-none mt-1 transition-colors"
                          style={{ background: 'var(--card)', border: '1px solid var(--bdr)' }}/>
                      </div>
                      <div>
                        <label className="text-sm font-mono text-t2">Timezone</label>
                        <select className="w-full h-9 px-3 rounded-lg text-t1 text-sm outline-none mt-1 transition-colors cursor-pointer"
                          style={{ background: 'var(--card)', border: '1px solid var(--bdr)' }}>
                          <option>East Africa Time (EAT, UTC+3)</option>
                          <option>UTC</option>
                          <option>GMT</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-mono text-t2">Currency</label>
                        <select className="w-full h-9 px-3 rounded-lg text-t1 text-sm outline-none mt-1 transition-colors cursor-pointer"
                          style={{ background: 'var(--card)', border: '1px solid var(--bdr)' }}>
                          <option>KES (Kenyan Shilling)</option>
                          <option>USD</option>
                          <option>EUR</option>
                        </select>
                      </div>
                      <button onClick={handleSave}
                        className="flex items-center gap-2 h-9 px-4 rounded-lg text-white text-sm font-mono transition-all"
                        style={{ background: saved ? 'var(--green)' : 'var(--blue)' }}>
                        {saved ? <Check size={14} /> : <Save size={14} />}
                        {saved ? 'Saved!' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-lg font-bold text-t1 mb-4">Notification Preferences</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Campaign alerts', desc: 'Notify when content is submitted or approved' },
                        { label: 'Performance updates', desc: 'Daily engagement & reach summaries' },
                        { label: 'Payment confirmations', desc: 'M-Pesa & bank transfer receipts' },
                        { label: 'Team activity', desc: 'When team members take actions' },
                        { label: 'Contract updates', desc: 'New contracts & signature requests' },
                      ].map(item => (
                        <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg"
                          style={{ background: 'var(--card)', border: '1px solid var(--bdr)' }}>
                          <input type="checkbox" defaultChecked 
                            className="w-4 h-4 rounded cursor-pointer" />
                          <div className="flex-1">
                            <div className="text-sm font-mono text-t1">{item.label}</div>
                            <div className="text-xs font-mono text-t3 mt-0.5">{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Team Management */}
              {activeTab === 'team' && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display text-lg font-bold text-t1">Team Members</h3>
                      <button className="h-8 px-3 rounded-lg text-white text-sm font-mono"
                        style={{ background: 'var(--blue)' }}>
                        + Invite
                      </button>
                    </div>
                    <div className="space-y-2">
                      {[
                        { name: 'James Rotich', role: 'Owner', email: 'james@pulseke.io' },
                        { name: 'Amara Okonkwo', role: 'Editor', email: 'amara@pulseke.io' },
                        { name: 'David Kipchoge', role: 'Viewer', email: 'david@pulseke.io' },
                      ].map(member => (
                        <div key={member.email} className="flex items-center justify-between p-3 rounded-lg"
                          style={{ background: 'var(--card)', border: '1px solid var(--bdr)' }}>
                          <div>
                            <div className="text-sm font-mono text-t1">{member.name}</div>
                            <div className="text-xs font-mono text-t3">{member.email}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono px-2 py-1 rounded text-blue"
                              style={{ background: 'var(--blue-d)', border: '1px solid var(--blue)' }}>
                              {member.role}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-lg font-bold text-t1 mb-4">Security & API</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-mono text-t2 block mb-2">API Key</label>
                        <div className="flex gap-2">
                          <div className="flex-1 px-3 py-2 rounded-lg text-sm font-mono text-t2"
                            style={{ background: 'var(--card)', border: '1px solid var(--bdr)' }}>
                            pk_live_xxxxxxxxxxxxxxxxxxxxx
                          </div>
                          <button onClick={() => handleCopy('pk_live_xxxxxxxxxxxxxxxxxxxxx')}
                            className="h-9 px-3 rounded-lg transition-all"
                            style={{ 
                              background: copied ? 'var(--green)' : 'var(--card)',
                              border: `1px solid ${copied ? 'var(--green)' : 'var(--bdr)'}`,
                              color: copied ? 'white' : 'var(--t2)'
                            }}>
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                        </div>
                        <p className="text-xs font-mono text-t3 mt-2">Never share your API key. Rotate it regularly for security.</p>
                      </div>
                      <div>
                        <label className="text-sm font-mono text-t2">Change Password</label>
                        <button className="h-9 px-4 rounded-lg text-t2 text-sm font-mono border mt-2 transition-all hover:text-t1"
                          style={{ border: '1px solid var(--bdr)' }}>
                          Update Password
                        </button>
                      </div>
                      <div className="pt-4 border-t" style={{ borderColor: 'var(--bdr)' }}>
                        <label className="text-sm font-mono text-red block mb-2">Danger Zone</label>
                        <button className="h-9 px-4 rounded-lg text-red text-sm font-mono border transition-all"
                          style={{ border: '1px solid var(--red)', background: 'rgba(240, 69, 74, 0.06)' }}>
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </PageShell>
      </div>
      <BottomNav />
    </div>
  )
}
