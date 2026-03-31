# ⚡ Quick Start Guide — PulseKE

> **Just want to get coding?** Follow these 5 steps.

---

## 🚀 Setup (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env.local

# 3. Edit .env.local with your API keys
# (Open in your editor and add your credentials)

# 4. Start development server
npm run dev

# 5. Open browser
open http://localhost:3000
```

Done! Your dev server is running.

---

## 📁 Project Structure

```
components/          ← Reusable React components
├── ui/             ← shadcn/ui pre-built components
├── InfluencerCard.tsx
└── ...

app/                ← Next.js pages & routes
├── dashboard/
├── discovery/
├── campaigns/
└── layout.tsx

hooks/              ← Custom React hooks
lib/                ← Utilities & helpers
types/              ← TypeScript type definitions
```

---

## 💻 Common Commands

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Check code quality
npm run lint --fix  # Auto-fix code style
```

---

## 🎨 Adding a New Component

```typescript
// components/MyComponent.tsx
export function MyComponent() {
  return (
    <div className="p-4 bg-card rounded-lg">
      <h2 className="text-lg font-bold">Hello</h2>
    </div>
  );
}
```

Use it:
```typescript
// app/page.tsx
import { MyComponent } from '@/components/MyComponent';

export default function Page() {
  return <MyComponent />;
}
```

---

## 🌐 Using UI Components

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

export function MyCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello</CardTitle>
      </CardHeader>
      <Button>Click me</Button>
    </Card>
  );
}
```

[Browse all components →](https://ui.shadcn.com)

---

## 🎯 Adding a New Page

```bash
# Create new route
mkdir -p app/my-feature

# Create page file
# app/my-feature/page.tsx
export default function Page() {
  return <div>My Feature Page</div>;
}

# Visit: http://localhost:3000/my-feature
```

---

## 🔌 Calling an API

```typescript
// lib/api.ts
export async function fetchData(id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/data/${id}`
  );
  return response.json();
}
```

```typescript
// components/DataDisplay.tsx
'use client';

import { useEffect, useState } from 'react';
import { fetchData } from '@/lib/api';

export function DataDisplay({ id }: { id: string }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData(id).then(setData);
  }, [id]);

  return <div>{/* Display data */}</div>;
}
```

---

## 🐛 Debugging

```typescript
// Use console.log (logs appear in browser console)
console.log('[Debug]', myData);

// Type checking without running
npx tsc --noEmit

// Lint your code
npm run lint
```

---

## 📤 Pushing to GitHub

```bash
# 1. Check your changes
git status

# 2. Fix any lint issues
npm run lint -- --fix

# 3. Add & commit
git add .
git commit -m "feat: add new feature"

# 4. Push
git push origin main
```

---

## ⚠️ Common Mistakes

| Don't ❌ | Do ✅ |
|----------|-------|
| `<img src="...">` | `<Image src="..." alt="description" />` |
| `<div onClick={...}>` | `<Button onClick={...}>` |
| `style={{color: 'red'}}` | `className="text-red-500"` |
| Commit `.env.local` | Use `.env.example` template |
| Commit `node_modules/` | Already ignored in `.gitignore` |
| Use `any` type | Use proper types |

---

## 📚 Learn More

- **Framework:** [Next.js Docs](https://nextjs.org/docs)
- **Styling:** [Tailwind Docs](https://tailwindcss.com/docs)
- **Components:** [shadcn/ui](https://ui.shadcn.com)
- **Code Quality:** Read `CONTRIBUTING.md`
- **Full Details:** Read `QA_REPORT.md`

---

## 🆘 Help

1. **Setup issue?** → See `GITHUB_SETUP.md`
2. **Code standards?** → See `CONTRIBUTING.md`
3. **Technical details?** → See `QA_REPORT.md`
4. **Full onboarding?** → See `README_IMPROVEMENTS.md`

---

**Ready?** Type `npm run dev` and start building! 🚀
