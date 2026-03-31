# 🤝 Contributing to PulseKE

Thank you for contributing to **PulseKE** — Kenya's leading influencer management platform! 

This guide will help you set up your development environment and follow our code standards.

---

## 🚀 Getting Started

### **1. Clone the Repository**
```bash
git clone https://github.com/your-org/pulse-ke.git
cd pulse-ke
```

### **2. Install Dependencies**
```bash
npm install
# or with pnpm:
# pnpm install
```

### **3. Setup Environment Variables**
```bash
cp .env.example .env.local
# Edit .env.local with your API keys (see docs for each service)
```

### **4. Run Development Server**
```bash
npm run dev
# Open http://localhost:3000
```

### **5. Create a Feature Branch**
```bash
git checkout -b feature/your-feature-name
# or for bug fixes:
git checkout -b fix/bug-description
```

---

## 📝 Code Standards

### **TypeScript**
- **Always use TypeScript** — no `.js` files unless absolutely necessary
- Enable strict mode: `strict: true` in `tsconfig.json`
- Use proper types, avoid `any`

```typescript
// ❌ Don't
function processData(data: any) {
  return data.value;
}

// ✅ Do
interface DataPayload {
  value: string;
  timestamp: Date;
}

function processData(data: DataPayload): string {
  return data.value;
}
```

### **React Components**
- Use functional components with hooks
- Separate UI components into reusable pieces
- Use shadcn/ui components from `@/components/ui`

```typescript
// ✅ Good component structure
export function InfluencerCard({ influencer }: InfluencerCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{influencer.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Component content */}
      </CardContent>
    </Card>
  );
}
```

### **Naming Conventions**
- **Components**: `PascalCase` — `InfluencerSearch.tsx`
- **Hooks**: `camelCase` with `use` prefix — `useInfluencers.ts`
- **Utils/Helpers**: `camelCase` — `formatKES.ts`
- **Constants**: `UPPER_SNAKE_CASE` — `API_ENDPOINTS.ts`

### **File Organization**
```
├── app/                  # App Router pages
│   ├── dashboard/
│   ├── discovery/
│   ├── campaigns/
│   └── layout.tsx
├── components/           # Reusable React components
│   ├── ui/              # shadcn/ui components
│   ├── InfluencerCard.tsx
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useInfluencers.ts
│   └── ...
├── lib/                 # Utilities & helpers
│   ├── api.ts           # API calls
│   ├── formatters.ts    # Formatting functions
│   └── utils.ts         # General utilities
├── types/               # TypeScript type definitions
│   └── influencer.ts
├── .env.example         # Environment variable template
└── package.json
```

### **Styling**
- Use **Tailwind CSS** exclusively
- Use utility classes from tailwind
- Avoid custom CSS files
- Follow Tailwind best practices:

```typescript
// ✅ Good
<div className="bg-card rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
  {/* Content */}
</div>

// ❌ Avoid custom CSS when possible
<div style={{ backgroundColor: '#111c30', padding: '16px' }}>
  {/* Content */}
</div>
```

---

## ✅ Testing Your Code

### **Lint Your Code**
```bash
npm run lint
# Fix automatically:
npm run lint -- --fix
```

### **Type Check**
```bash
npx tsc --noEmit
```

### **Build Locally**
```bash
npm run build
```

### **Run Dev Server**
```bash
npm run dev
```

---

## 📤 Submitting Changes

### **1. Commit Messages**
Follow conventional commits:

```bash
git commit -m "feat: add influencer search filter"
git commit -m "fix: resolve M-Pesa payment timeout"
git commit -m "docs: update API setup instructions"
```

**Format:** `<type>: <description>`

**Types:**
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Code style (formatting, semicolons, etc.)
- `refactor:` — Code restructuring without behavior changes
- `perf:` — Performance improvements
- `test:` — Adding or updating tests
- `chore:` — Dependencies, configs, etc.

### **2. Create a Pull Request**
```bash
git push origin feature/your-feature-name
# Then create PR on GitHub
```

**PR Title Format:** Same as commits  
`feat: add influencer search filter`

**PR Description Template:**
```markdown
## Description
Brief description of what this PR does.

## Related Issue
Closes #123

## Changes
- Change 1
- Change 2
- Change 3

## Testing
How to test these changes.

## Screenshots (if applicable)
Before/after images.
```

### **3. Code Review**
- All PRs require at least 1 approval
- Address review comments and push updates
- Keep commits clean and rebased

---

## 🌍 Adding New Pages

### **Example: Adding `/influencers` Page**

**1. Create page structure:**
```
app/influencers/
├── page.tsx          # Main page
├── layout.tsx        # Page layout
└── components/
    ├── InfluencerList.tsx
    └── InfluencerFilters.tsx
```

**2. Create the page:**
```typescript
// app/influencers/page.tsx
import { InfluencerList } from './components/InfluencerList';
import { InfluencerFilters } from './components/InfluencerFilters';

export const metadata = {
  title: 'Influencers | PulseKE',
  description: 'Search and discover Kenyan influencers',
};

export default function InfluencersPage() {
  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Influencer Directory</h1>
      <InfluencerFilters />
      <InfluencerList />
    </main>
  );
}
```

**3. Add to navigation:**
```typescript
// Update your navigation component with new link
<Link href="/influencers">Influencers</Link>
```

---

## 🔌 Integrating New APIs

### **1. Create API wrapper in `lib/api.ts`:**
```typescript
// lib/api.ts
export async function fetchInfluencers(query: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/influencers?q=${query}`
  );
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}
```

**2. Use in components:**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { fetchInfluencers } from '@/lib/api';

export function InfluencerSearch() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchInfluencers('nairobi').then(setData);
  }, []);
  
  return <div>{/* Component content */}</div>;
}
```

---

## 🚫 What NOT to Do

- ❌ Don't commit `.env.local` or any secrets
- ❌ Don't use `any` type in TypeScript
- ❌ Don't create inline styles (use Tailwind)
- ❌ Don't use `<img>` without `alt` text
- ❌ Don't make large commits — split into logical chunks
- ❌ Don't ignore TypeScript errors
- ❌ Don't use deprecated React patterns (e.g., class components)

---

## 📚 Resources

- **Next.js Docs:** https://nextjs.org/docs
- **React Docs:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com
- **TypeScript:** https://www.typescriptlang.org/docs
- **Zod Validation:** https://zod.dev

---

## 💬 Questions?

- Open an issue on GitHub
- Start a discussion
- Reach out to the team

---

**Happy coding! 🚀**
