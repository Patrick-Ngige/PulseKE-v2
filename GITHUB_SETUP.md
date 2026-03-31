# 📦 GitHub Setup Guide — Large Files Solution

## Problem
Your files are too large to push to GitHub (GitHub's limit is 100MB per file, 2GB per repository).

## Why This Happens
- `node_modules/` folder (can be 500MB+)
- `.next/` build folder (can be 200MB+)
- `package-lock.json` (can be 100MB+)
- Large media files

## ✅ Solution (Already Configured)

Your `.gitignore` file already excludes the problematic directories:

```
/node_modules
/.next/
/out/
/build
.env*
```

**This prevents large files from being committed.**

---

## 🚀 Setup Steps

### **1. Clone/Initialize Your Project**
```bash
# Option A: Clone existing repo
git clone <your-repo-url>
cd pulse-ke

# Option B: Initialize new repo
git init
git remote add origin <your-repo-url>
```

### **2. Install Dependencies (NOT Committed)**
```bash
npm install
# This creates node_modules/ locally (ignored by .gitignore)
```

### **3. Create Environment Variables**
```bash
cp .env.example .env.local
# Edit .env.local with your actual API keys
```

### **4. Verify .gitignore is Working**
```bash
# Check what would be committed
git status

# Should show ONLY:
# - src/
# - components/
# - app/
# - hooks/
# - lib/
# - package.json
# - tsconfig.json
# - tailwind.config.ts
# - .eslintrc.json
# - .env.example
# - README.md
# - etc.

# Should NOT show:
# - node_modules/
# - .next/
# - .env.local
```

### **5. First Commit**
```bash
git add .
git commit -m "Initial commit: PulseKE influencer platform"
git push origin main
```

---

## 🧹 If You Already Have Large Files in Git

If you've already committed node_modules or .next, remove them:

```bash
# Remove large files from git history (but keep locally)
git rm -r --cached node_modules
git rm -r --cached .next
git rm -r --cached .env.local

# Update .gitignore if needed
# (already done in this project)

# Commit the cleanup
git commit -m "Remove large files from Git tracking"
git push origin main
```

**Note:** If your repo is >1GB, you may need to use `git filter-branch` or `BFG Repo-Cleaner` to fully clean history.

---

## 📋 Typical File Size Reference

| What | Size | Status |
|---|---|---|
| `node_modules/` | 500MB-2GB | ✓ Ignored |
| `.next/` (build) | 100-500MB | ✓ Ignored |
| `package-lock.json` | 10-50MB | ✓ OK to commit |
| `.env.local` (secrets) | <1MB | ✓ Ignored (security!) |
| Source code | 1-20MB | ✓ Committed |

---

## 🔒 Security Best Practices

**NEVER commit:**
```
.env.local          # Local secrets (Stripe keys, API tokens)
.env.production     # Production secrets
.env.test           # Test database credentials
```

**ALWAYS commit:**
```
.env.example        # Template with placeholder values
```

**How to use:**
```bash
# Developer 1
cp .env.example .env.local
# Edit with own keys...

# Developer 2
cp .env.example .env.local
# Edit with own keys...

# Both use own credentials, .env.local is ignored ✓
```

---

## 🚦 CI/CD Integration (GitHub Actions)

When ready, create `.github/workflows/build.yml`:

```yaml
name: Build & Test
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci  # Use npm ci, not npm install
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npx tsc --noEmit
      
      - name: Build
        run: npm run build
```

---

## 💡 Pro Tips

### **Use `npm ci` in CI/CD**
```bash
# Local development
npm install

# GitHub Actions / Production
npm ci  # Cleaner, faster, uses exact versions from package-lock.json
```

### **Keep .env.example Updated**
Whenever you add a new API key or secret:
```bash
# Update template
# .env.example
STRIPE_API_KEY=your_stripe_key_here
CLAUDE_API_KEY=your_claude_key_here

# Commit template
git add .env.example
git commit -m "Add new API keys to .env.example"
```

### **Large Media Assets**
Use **Vercel Blob** for images/videos:

```javascript
// app/api/upload/route.ts
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  const file = await request.blob();
  const blob = await put(file.name, file, { access: 'public' });
  return Response.json(blob);
}
```

---

## ✅ Checklist Before Pushing

- [ ] `.gitignore` exists and has `/node_modules` and `/.next/`
- [ ] No `.env.local` in git history (`git log --all --full-history -- .env.local`)
- [ ] `package-lock.json` is <100MB (`du -h package-lock.json`)
- [ ] All source files are committed
- [ ] `.env.example` has all required keys as templates
- [ ] CI/CD will `npm ci` to install clean dependencies

---

**All set!** Your repo should push cleanly to GitHub now. 🎉
