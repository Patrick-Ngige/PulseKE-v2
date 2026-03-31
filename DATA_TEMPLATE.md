# Data Structure Template for /data/kenya.ts

This file contains the complete TypeScript interfaces and structure needed for your data file.

## Create `/data/kenya.ts`

```typescript
// Type definitions
export interface Account {
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter'
  handle: string
  followers: number
  engRate: number
}

export interface Influencer {
  id: string
  name: string
  initials: string
  gradient: string
  bio: string
  location: string
  niche: string[]
  accounts: Account[]
  reach: string
  engagement: number
  rate: number
  aiScore: number
  sentiment: string
}

export interface Campaign {
  id: string
  name: string
  brand: string
  status: 'active' | 'completed' | 'paused'
  progress: number
}

export interface AnalyticsSeries {
  labels: string[]
  reach: number[]
  eng: number[]
}

export interface Platform {
  code: string
  name: string
  color: string
  barColor: string
  reach: string
  eng: number
  pct: number
}

export interface Analytics {
  totalReach: string
  avgEngagement: number
  totalSpend: number
  conversions: number
  avgCPA: number
  brandLift: number
  sentiment: {
    positive: number
    neutral: number
    negative: number
  }
  demographics: {
    age: Array<{ range: string; pct: number }>
    gender: Array<{ label: string; pct: number; color: string }>
    locations: Array<{ city: string; pct: number }>
  }
  platforms: Platform[]
  engagementSeries: {
    '7d': AnalyticsSeries
    '30d': AnalyticsSeries
    '90d': AnalyticsSeries
  }
}

export interface Payment {
  id: string
  influencer: string
  campaign: string
  amount: number
  method: 'M-Pesa' | 'Bank Transfer' | 'Airtel Money'
  status: 'processing' | 'scheduled' | 'paid' | 'failed'
  phone?: string
  gradient: string
  initials: string
}

export interface Contract {
  id: string
  influencer: string
  campaign: string
  type: string
  status: 'signed' | 'sent' | 'draft' | 'expired'
  value: number
  updatedAt: string
  gradient: string
  initials: string
}

export interface Alert {
  id: string
  name: string
  platform: string
  severity: 'critical' | 'warning'
  current: number
  quota: number
  daysLeft: number
  gradient: string
  initials: string
}

export interface AILookalike {
  name: string
  initials: string
  gradient: string
  niche: string[]
  match: number
}

export interface AITrend {
  rank: number
  tag: string
  bar: number
  growth: string
}

export interface AIRiskInfluencer {
  handle: string
  risk: string
  sentiment: string
  status: 'critical' | 'warning' | 'monitoring'
}

export interface AIInsights {
  forecast: {
    reach: string
    engagement: string
    roi: string
    confidence: number
  }
  lookalikes: AILookalike[]
  riskInfluencers: AIRiskInfluencer[]
  brandSafetyScore: number
  visualIntegrity: number
  captionSentiment: number
  trends: AITrend[]
}

// Sample data - REPLACE WITH YOUR DATA
export const INFLUENCERS: Influencer[] = [
  {
    id: 'amina-mwangi',
    name: 'Amina Mwangi',
    initials: 'AM',
    gradient: 'linear-gradient(135deg,#833ab4,#fd1d1d)',
    bio: 'Fashion & lifestyle influencer. Passionate about sustainable fashion in Kenya.',
    location: 'Nairobi, KE',
    niche: ['Fashion', 'Lifestyle'],
    accounts: [
      { platform: 'instagram', handle: '@aminamwangi', followers: 145000, engRate: 7.2 },
      { platform: 'tiktok', handle: '@aminamwangi', followers: 89000, engRate: 8.5 }
    ],
    reach: '234K',
    engagement: 7.2,
    rate: 25000,
    aiScore: 94,
    sentiment: 'Very Positive'
  },
  // Add more influencers...
]

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'safaricom-nane-nane',
    name: 'Safaricom Nane Nane',
    brand: 'Safaricom Limited',
    status: 'active',
    progress: 65
  },
  // Add more campaigns...
]

export const ANALYTICS: Analytics = {
  totalReach: '1.2M',
  avgEngagement: 6.8,
  totalSpend: 2450000,
  conversions: 18500,
  avgCPA: 132.43,
  brandLift: 24,
  sentiment: {
    positive: 68,
    neutral: 22,
    negative: 10
  },
  demographics: {
    age: [
      { range: '18-24', pct: 32 },
      { range: '25-34', pct: 38 },
      { range: '35-44', pct: 20 },
      { range: '45+', pct: 10 }
    ],
    gender: [
      { label: 'Female', pct: 62, color: '#f09433' },
      { label: 'Male', pct: 38, color: '#2f7cf6' }
    ],
    locations: [
      { city: 'Nairobi', pct: 42 },
      { city: 'Mombasa', pct: 18 },
      { city: 'Kisumu', pct: 14 }
    ]
  },
  platforms: [
    {
      code: 'IG',
      name: 'Instagram',
      color: '#f09433',
      barColor: '#f09433',
      reach: '520K',
      eng: 6.8,
      pct: 45
    },
    // Add more platforms...
  ],
  engagementSeries: {
    '7d': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      reach: [145, 152, 148, 165, 172, 185, 192],
      eng: [5.2, 5.8, 5.5, 6.1, 6.8, 7.2, 7.5]
    },
    '30d': {
      labels: ['W1', 'W2', 'W3', 'W4'],
      reach: [1050, 1120, 1180, 1240],
      eng: [5.8, 6.2, 6.5, 6.8]
    },
    '90d': {
      labels: ['May', 'Jun', 'Jul', 'Aug'],
      reach: [980, 1050, 1150, 1240],
      eng: [5.2, 5.8, 6.2, 6.8]
    }
  }
}

export const PAYMENTS: Payment[] = [
  {
    id: 'pmt-001',
    influencer: 'Amina Mwangi',
    campaign: 'Safaricom Nane Nane',
    amount: 75000,
    method: 'M-Pesa',
    status: 'paid',
    phone: '+254 712 345 678',
    gradient: 'linear-gradient(135deg,#833ab4,#fd1d1d)',
    initials: 'AM'
  },
  // Add more payments...
]

export const CONTRACTS: Contract[] = [
  {
    id: 'contract-001',
    influencer: 'Amina Mwangi',
    campaign: 'Safaricom Nane Nane',
    type: 'Campaign Agreement',
    status: 'signed',
    value: 150000,
    updatedAt: '2 days ago',
    gradient: 'linear-gradient(135deg,#833ab4,#fd1d1d)',
    initials: 'AM'
  },
  // Add more contracts...
]

export const ALERTS: Alert[] = [
  {
    id: 'alert-001',
    name: 'Amina Mwangi',
    platform: 'Instagram',
    severity: 'critical',
    current: 28,
    quota: 30,
    daysLeft: 2,
    gradient: 'linear-gradient(135deg,#833ab4,#fd1d1d)',
    initials: 'AM'
  },
  // Add more alerts...
]

export const AI_INSIGHTS: AIInsights = {
  forecast: {
    reach: '1.5M',
    engagement: '7.8%',
    roi: '2.8×',
    confidence: 92
  },
  lookalikes: [
    {
      name: 'Sarah Kimani',
      initials: 'SK',
      gradient: 'linear-gradient(135deg,#667eea,#764ba2)',
      niche: ['Fashion', 'Lifestyle'],
      match: 96
    },
    // Add more lookalikes...
  ],
  riskInfluencers: [
    {
      handle: '@influencer_handle',
      risk: 'Audience authenticity',
      sentiment: 'Declining',
      status: 'critical'
    },
    // Add more risks...
  ],
  brandSafetyScore: 96,
  visualIntegrity: 98,
  captionSentiment: 91,
  trends: [
    { rank: 1, tag: '#MpesaFirst', bar: 94, growth: '+18%' },
    { rank: 2, tag: '#NairobiStartups', bar: 87, growth: '+12%' },
    // Add more trends...
  ]
}

// Utility function
export const formatKES = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Export type for Contract component
export type { Contract }
```

## Guidelines

### Gradient Format
Use CSS linear gradients for avatar backgrounds:
```typescript
gradient: 'linear-gradient(135deg,#833ab4,#fd1d1d)'
```

### Initials
Must be 1-2 characters:
```typescript
initials: 'AM'  // Amina Mwangi
initials: 'PO'  // Peter Otieno
```

### Dates
Use human-readable format:
```typescript
'2 days ago'
'1 week ago'
'2024-01-15'
```

### Money
Always use numbers, formatting handled by `formatKES()`:
```typescript
amount: 150000  // Will display as "KES 150,000"
```

### Niche Categories
Use these standard categories:
- Fashion, Tech, Fitness, Food, Travel, Lifestyle, Business, Entertainment

### Platform Types
Use only these platform values:
- `instagram`, `tiktok`, `youtube`, `twitter`

### Status Values
Use exact status strings as defined in interfaces:
- Campaign status: `'active' | 'completed' | 'paused'`
- Payment status: `'processing' | 'scheduled' | 'paid' | 'failed'`
- Contract status: `'signed' | 'sent' | 'draft' | 'expired'`
- Alert severity: `'critical' | 'warning'`

---

## Data Validation Checklist

Before your app works, ensure:

- [ ] All 8 pages have data to display
- [ ] `INFLUENCERS` array has at least 5 entries
- [ ] `CAMPAIGNS` array has at least 3 entries
- [ ] `PAYMENTS` array has at least 10 entries
- [ ] `CONTRACTS` array has at least 5 entries
- [ ] `ALERTS` array has at least 3 entries
- [ ] All gradients use valid CSS format
- [ ] All initials are 1-2 characters
- [ ] All amounts are numbers (not strings)
- [ ] All follower counts are numbers
- [ ] All percentages are 0-100
- [ ] All platform values match enum
- [ ] All status values match enums

---

**Next**: Create this file and populate with your data, then your app will be fully functional!
