// ─── KENYAN INFLUENCER DATA ───────────────────────────────────────────────
// Shaped to mirror Instagram Graph API, TikTok Business API, YouTube Data API v3
// Replace with real API calls when credentials are ready

export type Platform = 'instagram' | 'tiktok' | 'youtube' | 'twitter'
export type Niche = 'Fashion' | 'Tech' | 'Fitness' | 'Food' | 'Travel' | 'Lifestyle' | 'Business' | 'Entertainment'

export interface SocialAccount {
  platform: Platform
  handle:   string
  followers: number
  avgLikes:  number
  avgViews?: number
  engRate:   number
}

export interface Influencer {
  id:         string
  initials:   string
  name:       string
  location:   string        // Kenyan city
  bio:        string
  niche:      Niche[]
  accounts:   SocialAccount[]
  reach:      string        // formatted e.g. "1.2M"
  engagement: number        // overall avg %
  aiScore:    number        // 0-100 match score
  rate:       number        // KES per post
  sentiment:  string
  gradient:   string
  verified:   boolean
}

export const INFLUENCERS: Influencer[] = [
  {
    id: 'inf-001',
    initials: 'AM',
    name: 'Amina Mwangi',
    location: 'Nairobi, Kenya',
    bio: 'Fashion & lifestyle creator based in Westlands. Brand ambassador for 20+ Kenyan and international labels.',
    niche: ['Fashion', 'Lifestyle'],
    accounts: [
      { platform: 'instagram', handle: '@aminamwangi_ke', followers: 284000, avgLikes: 12400, engRate: 4.4 },
      { platform: 'tiktok',    handle: '@aminamwangi',    followers: 156000, avgLikes: 28000, avgViews: 420000, engRate: 7.2 },
    ],
    reach: '440K', engagement: 5.8, aiScore: 97, rate: 45000, sentiment: 'Highly Positive',
    gradient: 'linear-gradient(135deg,#1a1060,#2f7cf6)', verified: true,
  },
  {
    id: 'inf-002',
    initials: 'BK',
    name: 'Brian Kamau',
    location: 'Nairobi, Kenya',
    bio: 'Tech reviewer & entrepreneur. Covers fintech, smartphones, and the Nairobi startup scene.',
    niche: ['Tech', 'Business'],
    accounts: [
      { platform: 'youtube',   handle: '@BrianKamauTech', followers: 198000, avgLikes: 8200, avgViews: 95000, engRate: 4.2 },
      { platform: 'instagram', handle: '@briankamau_tech', followers: 87000, avgLikes: 3100, engRate: 3.6 },
      { platform: 'tiktok',    handle: '@briankamautech', followers: 61000, avgLikes: 9400, avgViews: 180000, engRate: 6.8 },
    ],
    reach: '346K', engagement: 4.9, aiScore: 91, rate: 38000, sentiment: 'Positive',
    gradient: 'linear-gradient(135deg,#0f2027,#2c5364)', verified: true,
  },
  {
    id: 'inf-003',
    initials: 'FO',
    name: 'Faith Ochieng',
    location: 'Kisumu, Kenya',
    bio: 'Fitness coach & wellness advocate. Running the KE Fit movement across Kisumu, Nairobi & Mombasa.',
    niche: ['Fitness', 'Lifestyle'],
    accounts: [
      { platform: 'instagram', handle: '@faithochieng_fit', followers: 312000, avgLikes: 18600, engRate: 6.0 },
      { platform: 'tiktok',    handle: '@faithochiengfit', followers: 224000, avgLikes: 41000, avgViews: 680000, engRate: 9.2 },
    ],
    reach: '536K', engagement: 7.6, aiScore: 94, rate: 52000, sentiment: 'Highly Positive',
    gradient: 'linear-gradient(135deg,#0f3443,#34e89e)', verified: true,
  },
  {
    id: 'inf-004',
    initials: 'CW',
    name: 'Chef Wambui',
    location: 'Nairobi, Kenya',
    bio: 'Award-winning food creator. Kenyan cuisine meets global trends. Host of KitchenKE on YouTube.',
    niche: ['Food', 'Lifestyle'],
    accounts: [
      { platform: 'youtube',   handle: '@ChefWambui',     followers: 445000, avgLikes: 14200, avgViews: 220000, engRate: 3.2 },
      { platform: 'instagram', handle: '@chefwambui_ke',  followers: 198000, avgLikes: 14800, engRate: 7.5 },
      { platform: 'tiktok',    handle: '@chefwambui',     followers: 133000, avgLikes: 19700, avgViews: 390000, engRate: 8.1 },
    ],
    reach: '776K', engagement: 6.3, aiScore: 89, rate: 60000, sentiment: 'Highly Positive',
    gradient: 'linear-gradient(135deg,#8B4513,#f5a623)', verified: true,
  },
  {
    id: 'inf-005',
    initials: 'DM',
    name: 'David Mutua',
    location: 'Mombasa, Kenya',
    bio: 'Travel & coastal lifestyle. Documenting Kenya\'s coast, safari circuits, and hidden gems.',
    niche: ['Travel', 'Lifestyle'],
    accounts: [
      { platform: 'instagram', handle: '@davidmutua.ke',  followers: 167000, avgLikes: 8500, engRate: 5.1 },
      { platform: 'tiktok',    handle: '@davidmutuake',   followers: 98000, avgLikes: 12400, avgViews: 210000, engRate: 7.8 },
      { platform: 'youtube',   handle: '@DavidMutuaKE',   followers: 54000, avgLikes: 2100, avgViews: 38000, engRate: 3.9 },
    ],
    reach: '319K', engagement: 5.6, aiScore: 86, rate: 32000, sentiment: 'Positive',
    gradient: 'linear-gradient(135deg,#12100e,#2196f3)', verified: false,
  },
  {
    id: 'inf-006',
    initials: 'NJ',
    name: 'Njeri Kamau',
    location: 'Nairobi, Kenya',
    bio: 'Fashion week Kenya regular. Styling, beauty, and the intersection of African & global fashion.',
    niche: ['Fashion', 'Entertainment'],
    accounts: [
      { platform: 'instagram', handle: '@njerikamau_',    followers: 521000, avgLikes: 21900, engRate: 4.2 },
      { platform: 'tiktok',    handle: '@njerikamau',     followers: 387000, avgLikes: 58000, avgViews: 980000, engRate: 11.2 },
    ],
    reach: '908K', engagement: 7.7, aiScore: 95, rate: 75000, sentiment: 'Highly Positive',
    gradient: 'linear-gradient(135deg,#833ab4,#fd1d1d)', verified: true,
  },
  {
    id: 'inf-007',
    initials: 'PO',
    name: 'Peter Otieno',
    location: 'Nairobi, Kenya',
    bio: 'Business & entrepreneurship. Helping young Kenyans build wealth — personal finance meets hustle culture.',
    niche: ['Business', 'Lifestyle'],
    accounts: [
      { platform: 'tiktok',    handle: '@peterotienoke',  followers: 634000, avgLikes: 79200, avgViews: 1400000, engRate: 12.5 },
      { platform: 'instagram', handle: '@peter.otieno.ke', followers: 112000, avgLikes: 6700, engRate: 6.0 },
      { platform: 'youtube',   handle: '@PeterOtienoKE',  followers: 89000, avgLikes: 4100, avgViews: 62000, engRate: 4.6 },
    ],
    reach: '835K', engagement: 7.7, aiScore: 99, rate: 68000, sentiment: 'Highly Positive',
    gradient: 'linear-gradient(135deg,#1a1060,#7c3aed)', verified: true,
  },
  {
    id: 'inf-008',
    initials: 'SW',
    name: 'Sharon Waweru',
    location: 'Nakuru, Kenya',
    bio: 'Agriculture, rural lifestyle, and sustainable living. Connecting urban Kenya with its roots.',
    niche: ['Lifestyle', 'Food'],
    accounts: [
      { platform: 'tiktok',    handle: '@sharonwaweru',   followers: 289000, avgLikes: 34500, avgViews: 570000, engRate: 8.4 },
      { platform: 'instagram', handle: '@sharon.waweru',  followers: 94000, avgLikes: 5600, engRate: 6.0 },
    ],
    reach: '383K', engagement: 7.2, aiScore: 87, rate: 28000, sentiment: 'Positive',
    gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)', verified: false,
  },
]

// ─── CAMPAIGNS ────────────────────────────────────────────────────────────
export interface Campaign {
  id:          string
  name:        string
  brand:       string
  status:      'active' | 'draft' | 'completed' | 'paused'
  budget:      number   // KES
  spent:       number   // KES
  startDate:   string
  endDate:     string
  influencers: number
  reach:       string
  engagement:  number
  progress:    number   // 0-100
}

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-001', name: 'Safaricom Nane Nane Launch', brand: 'Safaricom',
    status: 'active', budget: 2800000, spent: 1904000,
    startDate: '2024-08-01', endDate: '2024-08-31',
    influencers: 12, reach: '4.2M', engagement: 6.1, progress: 68,
  },
  {
    id: 'camp-002', name: 'Equity Bank Vijana Drive', brand: 'Equity Bank',
    status: 'active', budget: 1500000, spent: 612000,
    startDate: '2024-07-15', endDate: '2024-09-15',
    influencers: 8, reach: '2.8M', engagement: 5.4, progress: 41,
  },
  {
    id: 'camp-003', name: 'Tusker Oktobafest KE', brand: 'EABL / Tusker',
    status: 'draft', budget: 3200000, spent: 0,
    startDate: '2024-09-01', endDate: '2024-10-31',
    influencers: 0, reach: '—', engagement: 0, progress: 0,
  },
  {
    id: 'camp-004', name: 'Jumia 11.11 Sale', brand: 'Jumia Kenya',
    status: 'active', budget: 980000, spent: 784000,
    startDate: '2024-10-20', endDate: '2024-11-15',
    influencers: 6, reach: '1.9M', engagement: 7.8, progress: 80,
  },
  {
    id: 'camp-005', name: 'KCB Digital Banking', brand: 'KCB Group',
    status: 'completed', budget: 1200000, spent: 1148000,
    startDate: '2024-05-01', endDate: '2024-07-01',
    influencers: 9, reach: '3.1M', engagement: 4.9, progress: 100,
  },
]

// ─── ANALYTICS ────────────────────────────────────────────────────────────
export const ANALYTICS = {
  totalSpend:    1904000,   // KES
  conversions:   3284,
  avgCPA:        580,       // KES
  brandLift:     18.4,
  totalReach:    '4.2M',
  avgEngagement: 6.1,

  engagementSeries: {
    '7d': {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      reach:  [84, 112, 96, 134, 158, 121, 167],
      eng:    [5.1, 5.8, 5.4, 6.3, 7.2, 6.0, 7.9],
    },
    '30d': {
      labels: ['W1','W2','W3','W4'],
      reach:  [320, 410, 380, 540],
      eng:    [5.0, 5.7, 5.4, 6.5],
    },
    '90d': {
      labels: ['Aug','Sep','Oct'],
      reach:  [1240, 1580, 1380],
      eng:    [4.8, 5.9, 6.4],
    },
  },

  sentiment: { positive: 82, neutral: 12, negative: 6 },

  demographics: {
    age: [
      { range: '13–17', pct: 6 },
      { range: '18–24', pct: 38 },
      { range: '25–34', pct: 44 },
      { range: '35–44', pct: 9 },
      { range: '45+',   pct: 3 },
    ],
    gender: [
      { label: 'Female', pct: 58, color: '#2f7cf6' },
      { label: 'Male',   pct: 38, color: '#4d6585' },
      { label: 'Other',  pct: 4,  color: '#1e3050' },
    ],
    locations: [
      { city: 'Nairobi',  pct: 52 },
      { city: 'Mombasa',  pct: 14 },
      { city: 'Kisumu',   pct: 9 },
      { city: 'Nakuru',   pct: 7 },
      { city: 'Eldoret',  pct: 5 },
    ],
  },

  platforms: [
    { name: 'TikTok',    code: 'tt', reach: '2.1M', eng: 8.4, conv: 1680, color: '#69c9d0', barColor: 'linear-gradient(90deg,#69c9d0,#ee1d52)', pct: 50 },
    { name: 'Instagram', code: 'ig', reach: '1.6M', eng: 5.1, conv: 1120, color: '#f09433', barColor: 'linear-gradient(90deg,#f09433,#dc2743)',  pct: 38 },
    { name: 'YouTube',   code: 'yt', reach: '0.5M', eng: 2.9, conv: 484,  color: '#ff5555', barColor: '#ff5555', pct: 12 },
  ],
}

// ─── CONTRACTS ────────────────────────────────────────────────────────────
export interface Contract {
  id:           string
  influencer:   string
  initials:     string
  campaign:     string
  type:         'Agreement' | 'NDA' | 'Partnership' | 'Service'
  status:       'signed' | 'sent' | 'draft' | 'expired'
  updatedAt:    string
  value:        number  // KES
  gradient:     string
}

export const CONTRACTS: Contract[] = [
  { id: 'con-001', influencer: 'Amina Mwangi',  initials: 'AM', campaign: 'Safaricom Nane Nane', type: 'Agreement',   status: 'signed',  updatedAt: '14 Oct 2024', value: 45000,  gradient: 'linear-gradient(135deg,#1a1060,#2f7cf6)' },
  { id: 'con-002', influencer: 'Brian Kamau',   initials: 'BK', campaign: 'Equity Vijana Drive', type: 'NDA',         status: 'sent',    updatedAt: '18 Oct 2024', value: 38000,  gradient: 'linear-gradient(135deg,#0f2027,#2c5364)' },
  { id: 'con-003', influencer: 'Faith Ochieng', initials: 'FO', campaign: 'Jumia 11.11 Sale',    type: 'Partnership', status: 'draft',   updatedAt: '2 hours ago', value: 52000,  gradient: 'linear-gradient(135deg,#0f3443,#34e89e)' },
  { id: 'con-004', influencer: 'Chef Wambui',   initials: 'CW', campaign: 'Tusker Oktobafest',   type: 'Agreement',   status: 'expired', updatedAt: '5 Oct 2024',  value: 60000,  gradient: 'linear-gradient(135deg,#8B4513,#f5a623)' },
  { id: 'con-005', influencer: 'Njeri Kamau',   initials: 'NJ', campaign: 'KCB Digital Banking', type: 'Service',     status: 'signed',  updatedAt: '1 Sep 2024',  value: 75000,  gradient: 'linear-gradient(135deg,#833ab4,#fd1d1d)' },
  { id: 'con-006', influencer: 'Peter Otieno',  initials: 'PO', campaign: 'Safaricom Nane Nane', type: 'Partnership', status: 'signed',  updatedAt: '12 Oct 2024', value: 68000,  gradient: 'linear-gradient(135deg,#1a1060,#7c3aed)' },
]

// ─── PAYMENTS ─────────────────────────────────────────────────────────────
export interface Payment {
  id:          string
  influencer:  string
  initials:    string
  campaign:    string
  amount:      number   // KES
  currency:    'KES'
  status:      'processing' | 'scheduled' | 'paid' | 'failed'
  method:      'M-Pesa' | 'Bank Transfer' | 'Airtel Money'
  phone?:      string
  updatedAt:   string
  gradient:    string
}

export const PAYMENTS: Payment[] = [
  { id: 'pay-001', influencer: 'Amina Mwangi',  initials: 'AM', campaign: 'Safaricom Nane Nane', amount: 45000, currency: 'KES', status: 'processing', method: 'M-Pesa',        phone: '0712 ••• •34', updatedAt: 'Today',      gradient: 'linear-gradient(135deg,#1a1060,#2f7cf6)' },
  { id: 'pay-002', influencer: 'Faith Ochieng', initials: 'FO', campaign: 'Jumia 11.11',         amount: 52000, currency: 'KES', status: 'scheduled',  method: 'M-Pesa',        phone: '0722 ••• •91', updatedAt: 'Tomorrow',   gradient: 'linear-gradient(135deg,#0f3443,#34e89e)' },
  { id: 'pay-003', influencer: 'Njeri Kamau',   initials: 'NJ', campaign: 'KCB Digital',         amount: 75000, currency: 'KES', status: 'paid',       method: 'Bank Transfer', phone: undefined,      updatedAt: '14 Oct',     gradient: 'linear-gradient(135deg,#833ab4,#fd1d1d)' },
  { id: 'pay-004', influencer: 'Peter Otieno',  initials: 'PO', campaign: 'Safaricom Nane Nane', amount: 68000, currency: 'KES', status: 'paid',       method: 'M-Pesa',        phone: '0798 ••• •55', updatedAt: '12 Oct',     gradient: 'linear-gradient(135deg,#1a1060,#7c3aed)' },
  { id: 'pay-005', influencer: 'Brian Kamau',   initials: 'BK', campaign: 'Equity Vijana',       amount: 38000, currency: 'KES', status: 'scheduled',  method: 'Airtel Money',  phone: '0100 ••• •23', updatedAt: 'Next week',  gradient: 'linear-gradient(135deg,#0f2027,#2c5364)' },
  { id: 'pay-006', influencer: 'Chef Wambui',   initials: 'CW', campaign: 'Tusker Oktobafest',   amount: 60000, currency: 'KES', status: 'failed',     method: 'M-Pesa',        phone: '0733 ••• •77', updatedAt: 'Retry now',  gradient: 'linear-gradient(135deg,#8B4513,#f5a623)' },
]

// ─── ALERTS ───────────────────────────────────────────────────────────────
export interface Alert {
  id:       string
  name:     string
  initials: string
  platform: string
  severity: 'critical' | 'warning'
  current:  number
  quota:    number
  daysLeft: number
  gradient: string
}

export const ALERTS: Alert[] = [
  { id: 'alt-001', name: 'Faith Ochieng', initials: 'FO', platform: 'TikTok · Fitness',      severity: 'critical', current: 1, quota: 3, daysLeft: 2, gradient: 'linear-gradient(135deg,#0f3443,#34e89e)' },
  { id: 'alt-002', name: 'Brian Kamau',   initials: 'BK', platform: 'YouTube · Tech',         severity: 'critical', current: 0, quota: 1, daysLeft: 3, gradient: 'linear-gradient(135deg,#0f2027,#2c5364)' },
  { id: 'alt-003', name: 'Amina Mwangi', initials: 'AM', platform: 'Instagram · Fashion',     severity: 'warning',  current: 1, quota: 2, daysLeft: 4, gradient: 'linear-gradient(135deg,#1a1060,#2f7cf6)' },
  { id: 'alt-004', name: 'David Mutua',  initials: 'DM', platform: 'TikTok · Travel',         severity: 'warning',  current: 2, quota: 5, daysLeft: 5, gradient: 'linear-gradient(135deg,#12100e,#2196f3)' },
  { id: 'alt-005', name: 'Sharon Waweru',initials: 'SW', platform: 'Instagram · Lifestyle',   severity: 'warning',  current: 2, quota: 3, daysLeft: 1, gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)' },
]

// ─── AI INSIGHTS ──────────────────────────────────────────────────────────
export const AI_INSIGHTS = {
  brandSafetyScore: 94,
  visualIntegrity:  98,
  captionSentiment: 89,
  riskInfluencers: [
    { handle: '@davidmutua.ke',  risk: 'Inconsistent engagement pattern', sentiment: 'Stable', status: 'monitoring' as const },
    { handle: '@sharon.waweru',  risk: 'Follower growth anomaly (+22%)',   sentiment: 'Declining', status: 'critical' as const },
  ],
  trends: [
    { rank: 1, tag: '#SafaricomFibre', growth: '+68%', bar: 88 },
    { rank: 2, tag: '#NairobiTech',    growth: '+41%', bar: 65 },
    { rank: 3, tag: '#KitchenKE',      growth: '+29%', bar: 48 },
    { rank: 4, tag: '#FitKE',          growth: '+18%', bar: 34 },
  ],
  lookalikes: [
    { initials: 'KN', name: 'Kendi Ndinda',  match: 97, niche: ['Fashion','Beauty'], gradient: 'linear-gradient(135deg,#cc2b5e,#753a88)' },
    { initials: 'JO', name: 'James Opiyo',   match: 93, niche: ['Tech','Business'],  gradient: 'linear-gradient(135deg,#0f2027,#203a43)' },
    { initials: 'GW', name: 'Grace Wanjiru', match: 89, niche: ['Food','Travel'],    gradient: 'linear-gradient(135deg,#11998e,#38ef7d)' },
  ],
  forecast: {
    reach:      '4.8M–5.4M',
    engagement: '6.8%',
    roi:        '3.6×',
    confidence: 92,
  },
}

// ─── UTILS ────────────────────────────────────────────────────────────────
export function formatKES(amount: number): string {
  if (amount >= 1_000_000) return `KES ${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000)     return `KES ${(amount / 1_000).toFixed(0)}K`
  return `KES ${amount.toLocaleString()}`
}

export function getNairobiTime(): string {
  return new Date().toLocaleTimeString('en-KE', {
    timeZone: 'Africa/Nairobi',
    hour: '2-digit', minute: '2-digit',
    hour12: true,
  })
}
