# PulseKE Application Architecture

## High-Level System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                           │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Next.js 16 App Router                    │ │
│  │                                                              │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌────────────┐ │ │
│  │  │   Sidebar       │  │   Topbar        │  │ BottomNav  │ │ │
│  │  │                 │  │                 │  │            │ │ │
│  │  │ • Dashboard     │  │ • Title         │  │ • 5 Routes │ │ │
│  │  │ • Discovery     │  │ • Actions       │  │   (Mobile) │ │ │
│  │  │ • Campaigns     │  │ • Notifications │  │            │ │ │
│  │  │ • Analytics     │  │ • User Menu     │  │            │ │ │
│  │  │ • Hub           │  │                 │  │            │ │ │
│  │  │ • Contracts     │  └─────────────────┘  └────────────┘ │ │
│  │  │ • Payments      │                                        │ │
│  │  │ • AI Insights   │                                        │ │
│  │  └─────────────────┘                                        │ │
│  │                                                              │ │
│  │  ┌─────────────────────────────────────────────────────┐   │ │
│  │  │           Page Content (PageShell)                   │   │ │
│  │  │                                                       │   │ │
│  │  │  Current Page:                                       │   │ │
│  │  │  • /dashboard    → Dashboard Page                    │   │ │
│  │  │  • /discovery    → Discovery Page                    │   │ │
│  │  │  • /campaigns    → Campaigns Page                    │   │ │
│  │  │  • /analytics    → Analytics Page                    │   │ │
│  │  │  • /hub          → Hub Page                          │   │ │
│  │  │  • /contracts    → Contracts Page                    │   │ │
│  │  │  • /payments     → Payments Page                     │   │ │
│  │  │  • /ai-insights  → AI Insights Page                  │   │ │
│  │  │                                                       │   │ │
│  │  │  Sub-Components:                                     │   │ │
│  │  │  • KpiCard, StatusBadge, AlertItem                   │   │ │
│  │  │  • Charts (Chart.js)                                 │   │ │
│  │  │  • Tables (shadcn/ui)                                │   │ │
│  │  │  • Forms & Inputs                                    │   │ │
│  │  └─────────────────────────────────────────────────────┘   │ │
│  │                                                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │
                    Data Binding & State
                              │
                              ▼
        ┌────────────────────────────────────────┐
        │   TypeScript Data Layer (/data)         │
        │                                          │
        │   /data/kenya.ts (USER MUST CREATE)    │
        │   ├─ INFLUENCERS: Influencer[]         │
        │   ├─ CAMPAIGNS: Campaign[]             │
        │   ├─ ANALYTICS: Analytics              │
        │   ├─ PAYMENTS: Payment[]               │
        │   ├─ CONTRACTS: Contract[]             │
        │   ├─ ALERTS: Alert[]                   │
        │   ├─ AI_INSIGHTS: AIInsights           │
        │   └─ formatKES(): string               │
        │                                          │
        └────────────────────────────────────────┘
```

---

## Directory Structure

```
/vercel/share/v0-project/
│
├── app/                              ← Next.js App Router
│   ├── dashboard/
│   │   └── page.tsx                  ← Dashboard (KPIs, alerts, charts)
│   │
│   ├── discovery/
│   │   └── page.tsx                  ← Talent discovery (search, filters)
│   │
│   ├── campaigns/
│   │   └── page.tsx                  ← Campaign assignment (roster, budget)
│   │
│   ├── analytics/
│   │   └── page.tsx                  ← Advanced analytics (charts, metrics)
│   │
│   ├── hub/
│   │   └── page.tsx                  ← Collaboration (messages, review)
│   │
│   ├── contracts/
│   │   └── page.tsx                  ← Legal documents (contracts)
│   │
│   ├── payments/
│   │   └── page.tsx                  ← Payment processing (M-Pesa, bank)
│   │
│   ├── ai-insights/
│   │   └── page.tsx                  ← AI predictions (forecast, trends)
│   │
│   ├── layout.tsx                    ← Root layout (fonts, metadata)
│   ├── page.tsx                      ← Home redirect
│   └── globals.css                   ← Theme variables, Tailwind config
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx               ← Desktop navigation (8 routes)
│   │   ├── Topbar.tsx                ← Header with title & actions
│   │   └── BottomNav.tsx             ← Mobile navigation (5 routes)
│   │
│   ├── ui/
│   │   ├── index.tsx                 ← Custom components
│   │   │   ├─ KpiCard
│   │   │   ├─ StatusBadge
│   │   │   ├─ AlertItem
│   │   │   └─ PageShell
│   │   │
│   │   └── [50+ shadcn components]   ← Pre-installed
│   │
│   └── [other components]            ← User-created as needed
│
├── data/
│   └── kenya.ts                      ← ⚠️ USER MUST CREATE
│       ├─ Influencer database
│       ├─ Campaign data
│       ├─ Analytics data
│       ├─ Payment records
│       ├─ Contracts
│       ├─ Alerts
│       ├─ AI insights
│       └─ Utility functions
│
├── public/                           ← Static assets
│   ├── images/
│   └── icons/
│
├── node_modules/                     ← Dependencies (50+ packages)
│
├── Configuration Files
│   ├── package.json                  ← Dependencies & scripts
│   ├── tsconfig.json                 ← TypeScript config
│   ├── next.config.mjs               ← Next.js config
│   ├── tailwind.config.ts            ← Tailwind config (v4)
│   └── postcss.config.js             ← PostCSS config
│
├── Documentation Files
│   ├── INTEGRATION_COMPLETE.md        ← Full project overview
│   ├── DATA_TEMPLATE.md              ← Data structure & examples
│   ├── SETUP_INSTRUCTIONS.md         ← Setup guide
│   ├── PROJECT_STATUS.txt            ← Status report
│   ├── ARCHITECTURE.md               ← This file
│   ├── QA_REPORT.md                  ← Quality assessment
│   ├── GITHUB_SETUP.md               ← Git workflow
│   ├── CONTRIBUTING.md               ← Developer guide
│   └── PRE_DEPLOYMENT_CHECKLIST.md   ← Production checklist
│
└── Git Files
    ├── .gitignore                    ← Ignore patterns
    ├── .env.example                  ← Environment variables
    └── .eslintrc.json                ← ESLint config
```

---

## Data Flow Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     Page Component Lifecycle                      │
└──────────────────────────────────────────────────────────────────┘

1. USER NAVIGATES TO PAGE
   ▼
   /dashboard → Dashboard Component

2. COMPONENT RENDERS
   ▼
   ┌─────────────────────────────────────┐
   │ 'use client'                         │
   │ import { INFLUENCERS, ... } from ... │
   │                                      │
   │ export default function Page() { ... │
   └─────────────────────────────────────┘

3. DATA IS IMPORTED
   ▼
   ┌──────────────────────────────────┐
   │  /data/kenya.ts                  │
   │  ├─ INFLUENCERS                  │
   │  ├─ CAMPAIGNS                    │
   │  ├─ ANALYTICS                    │
   │  └─ ... other exports            │
   └──────────────────────────────────┘

4. DATA IS RENDERED
   ▼
   ┌──────────────────────────────────────────┐
   │ Sidebar → Shows navigation               │
   │ Topbar  → Shows title & actions          │
   │ Content → Shows page-specific UI         │
   │ BottomNav → Shows mobile navigation      │
   └──────────────────────────────────────────┘

5. USER INTERACTS
   ▼
   ┌──────────────────────────────────────┐
   │ Clicks, forms, filters trigger:       │
   │ • useState() updates                  │
   │ • Component re-renders                │
   │ • UI updates reactively               │
   └──────────────────────────────────────┘

6. NAVIGATION
   ▼
   Next.js App Router handles navigation
   to other pages (same flow repeats)
```

---

## Component Hierarchy

```
<RootLayout>
  ├─ <Sidebar>
  │   ├─ Logo Link
  │   ├─ Nav Items (map over NAV array)
  │   │   └─ Each with active state indicator
  │   └─ Settings + User Profile
  │
  ├─ Main Content Wrapper
  │   ├─ <Topbar>
  │   │   ├─ Title & Subtitle
  │   │   ├─ Children (action buttons from page)
  │   │   ├─ Notification Bell
  │   │   └─ User Avatar
  │   │
  │   └─ <PageShell>
  │       └─ Page-Specific Components
  │           ├─ <KpiCard> x 4 (dashboard)
  │           ├─ <Charts> (analytics)
  │           ├─ Tables (contracts, payments)
  │           ├─ Forms (campaigns)
  │           ├─ Cards (discovery)
  │           ├─ Drawers (modals)
  │           └─ Custom Content
  │
  └─ <BottomNav> (mobile only)
      └─ 5 Main Navigation Items

```

---

## Data Typing System

```
TypeScript Interfaces (/data/kenya.ts)
│
├─ Influencer Interface
│   ├─ id: string
│   ├─ name: string
│   ├─ gradient: string (for avatar background)
│   ├─ accounts: Account[]
│   │   ├─ platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter'
│   │   ├─ handle: string
│   │   ├─ followers: number
│   │   └─ engRate: number
│   ├─ reach: string
│   ├─ engagement: number
│   ├─ rate: number (KES)
│   └─ aiScore: number
│
├─ Campaign Interface
│   ├─ id: string
│   ├─ name: string
│   ├─ brand: string
│   ├─ status: 'active' | 'completed' | 'paused'
│   └─ progress: number
│
├─ Analytics Interface
│   ├─ totalReach: string
│   ├─ avgEngagement: number
│   ├─ sentiment: { positive, neutral, negative }
│   ├─ demographics: { age, gender, locations }
│   ├─ platforms: Platform[]
│   └─ engagementSeries: { '7d', '30d', '90d' }
│
├─ Payment Interface
│   ├─ id: string
│   ├─ influencer: string
│   ├─ campaign: string
│   ├─ amount: number
│   ├─ method: 'M-Pesa' | 'Bank Transfer' | 'Airtel Money'
│   └─ status: 'processing' | 'scheduled' | 'paid' | 'failed'
│
├─ Contract Interface
│   ├─ id: string
│   ├─ influencer: string
│   ├─ status: 'signed' | 'sent' | 'draft' | 'expired'
│   └─ value: number
│
└─ Utility Functions
    ├─ formatKES(amount: number) → string
    └─ [other helpers as needed]
```

---

## State Management Pattern

Each page uses **React Hooks** for state:

```tsx
export default function PageName() {
  // State for data/filters
  const [activeTab, setActiveTab] = useState<'all' | 'active'>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  
  // Computed values
  const filtered = useMemo(() => {
    return data.filter(item => {
      // Filtering logic
    })
  }, [search, activeTab])
  
  // Event handlers
  const handleClick = (id: string) => {
    setSelected(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }
  
  // Render
  return (
    <div>
      {filtered.map(item => (
        <Component
          key={item.id}
          {...item}
          onClick={() => handleClick(item.id)}
        />
      ))}
    </div>
  )
}
```

**No global state management needed** (Redux, Zustand, etc.) unless you add:
- Authentication
- Real-time updates
- Complex cross-page state
- API integration

---

## Styling Architecture

```
Tailwind CSS v4 + CSS Custom Properties
│
├─ Design Tokens (/app/globals.css)
│   ├─ Colors
│   │   ├─ --bg (background)
│   │   ├─ --card (card background)
│   │   ├─ --blue (primary)
│   │   ├─ --green (success)
│   │   ├─ --amber (warning)
│   │   ├─ --red (error)
│   │   └─ Various -d (dim) and -g (glow) variants
│   │
│   ├─ Typography
│   │   ├─ --font-sans (Plus Jakarta Sans)
│   │   ├─ --font-display (Clash Display)
│   │   └─ --font-mono (DM Mono)
│   │
│   └─ Spacing & Size
│       └─ Tailwind scale (4px base unit)
│
├─ Component Styles
│   └─ Inline Tailwind classes
│       ├─ flex, grid, gap-X
│       ├─ px-X, py-X, p-X (padding)
│       ├─ text-SIZE, text-COLOR
│       ├─ rounded-X, border
│       └─ hover:, md:, lg: (responsive)
│
└─ Animations
    ├─ animate-fade-up (opacity, transform)
    ├─ animate-bar-in (bar fills)
    ├─ pulse-dot (blinking indicator)
    └─ transition-all (smooth changes)
```

---

## Navigation Flow

```
Entry Point: /dashboard (default page)
│
├─ /dashboard
│   └─ Campaign KPI dashboard
│       └─ Link to /discovery
│
├─ /discovery
│   └─ Talent search
│       └─ Link to /campaigns
│
├─ /campaigns
│   └─ Campaign roster
│       └─ Link to /analytics
│
├─ /analytics
│   └─ Advanced metrics
│       └─ Link back to /dashboard
│
├─ /hub
│   └─ Collaboration hub
│
├─ /contracts
│   └─ Legal documents
│
├─ /payments
│   └─ Payment processing
│
└─ /ai-insights
    └─ AI predictions
```

**Navigation Methods:**
1. **Sidebar** (desktop) - 8 main routes + settings
2. **BottomNav** (mobile) - 5 main routes
3. **Links** - Within page content
4. **Router** - Programmatic navigation via Next.js

---

## Performance Optimization

```
Image Optimization
├─ Next.js Image component (automatic)
├─ Lazy loading enabled
└─ Format optimization (WebP)

Code Splitting
├─ Per-page code splitting (automatic)
├─ Dynamic imports where needed
└─ Tree-shaking removes unused code

Caching
├─ Client-side React state
├─ Browser caching headers
└─ Next.js ISR (if backend connected)

Rendering Strategy
├─ Client-side rendering (all pages 'use client')
├─ Can switch to SSR if needed
└─ Hydration optimized

Bundle Size
├─ Minified JavaScript
├─ CSS optimization
└─ Icon optimization (lucide-react)
```

---

## Security Considerations

```
Current Implementation
├─ ✅ Type-safe (TypeScript)
├─ ✅ CORS not needed (same origin)
├─ ✅ Input validation ready
└─ ✅ XSS protection via React

When Adding Backend:
├─ Add environment variables (.env)
├─ Implement API authentication
├─ Add CSRF protection
├─ Validate all inputs server-side
└─ Use HTTPS only

When Adding Auth:
├─ Hash passwords (bcrypt)
├─ Secure session management
├─ HTTP-only cookies
└─ RBAC implementation
```

---

## Deployment Architecture

```
Local Development
├─ npm run dev
└─ http://localhost:3000

Production Build
├─ npm run build
├─ Next.js optimizes bundle
└─ Ready for deployment

Hosting Options
├─ Vercel (recommended - automatic)
├─ Self-hosted Node.js
├─ Docker container
├─ Serverless (AWS Lambda, etc.)
└─ Static export (if no SSR needed)
```

---

## Technology Stack Rationale

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | React 19 | Latest features, performance |
| Framework | Next.js 16 | App Router, built-in optimizations |
| Language | TypeScript | Type safety, better DX |
| Styling | Tailwind CSS v4 | Utility-first, zero-runtime CSS |
| UI Components | shadcn/ui | Headless, customizable, 50+ components |
| Charts | Chart.js | Lightweight, flexible, performant |
| Icons | Lucide React | Consistent, tree-shakeable |
| State | React Hooks | Simple, sufficient for this scope |

---

## Future Extension Points

```
Auth Layer
└─ Add authentication with Auth.js or similar
   ├─ Login/signup pages
   ├─ Protected routes
   └─ User context

API Integration
└─ Connect to backend REST/GraphQL API
   ├─ Replace mock data with API calls
   ├─ Add error handling
   └─ Implement caching

Real-time Features
└─ Add WebSocket or SSE
   ├─ Live notifications
   ├─ Chat updates
   └─ Activity feeds

Database
└─ Add backend database
   ├─ PostgreSQL/MongoDB
   ├─ ORM (Prisma, Drizzle)
   └─ API routes

Advanced State
└─ Add state management if needed
   ├─ Zustand (recommended, minimal)
   ├─ Redux (if very complex)
   └─ TanStack Query (for async data)
```

---

**This architecture is production-ready and scalable. All layers are modular and can be extended as needed.**
