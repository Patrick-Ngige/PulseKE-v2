# ✅ Pre-Deployment Checklist — PulseKE

> Use this checklist before pushing to production.

---

## 🔴 Critical (Must Pass)

- [ ] **TypeScript Strict Mode**
  ```bash
  npx tsc --noEmit
  # Must show 0 errors
  ```

- [ ] **Build Succeeds**
  ```bash
  npm run build
  # Must complete without errors
  ```

- [ ] **Linting Passes**
  ```bash
  npm run lint
  # Must show 0 errors
  ```

- [ ] **No `.env.local` in Git**
  ```bash
  git log --all --full-history -- .env.local
  # Must show nothing
  ```

- [ ] **`.gitignore` Working**
  ```bash
  git status
  # Must NOT show node_modules, .next, or .env files
  ```

- [ ] **Environment Variables**
  - [ ] `.env.example` exists with all required keys
  - [ ] All API keys documented
  - [ ] No secrets in source code

---

## 🟡 High Priority (Strongly Recommended)

- [ ] **Code Quality**
  - [ ] No `any` types used
  - [ ] All imports are valid
  - [ ] No unused variables
  - [ ] No console.log in production code

- [ ] **Performance**
  - [ ] Images use Next.js `<Image>` component
  - [ ] Large lists use pagination/virtualization
  - [ ] No N+1 API calls
  - [ ] CSS is minimized (Tailwind handles this)

- [ ] **Security**
  - [ ] No API keys in code
  - [ ] No hardcoded passwords
  - [ ] HTTPS configured (Vercel handles this)
  - [ ] CORS properly configured

- [ ] **Accessibility**
  - [ ] All images have `alt` text
  - [ ] All form inputs have labels
  - [ ] Color contrast adequate (WCAG AA)
  - [ ] Keyboard navigation works

- [ ] **GitHub**
  - [ ] All tests pass
  - [ ] No merge conflicts
  - [ ] PR has proper description
  - [ ] Code review approved

---

## 🟢 Medium Priority (Best Practices)

- [ ] **Documentation**
  - [ ] README.md is complete
  - [ ] CONTRIBUTING.md reviewed by team
  - [ ] API documentation exists
  - [ ] Complex code has comments

- [ ] **Testing**
  - [ ] Manual testing completed
  - [ ] Happy path scenarios work
  - [ ] Error cases handled
  - [ ] Mobile view tested

- [ ] **Browser Compatibility**
  - [ ] Works on Chrome (latest)
  - [ ] Works on Firefox (latest)
  - [ ] Works on Safari (latest)
  - [ ] Mobile browsers tested

- [ ] **Performance Metrics**
  - [ ] Lighthouse Performance >90
  - [ ] Lighthouse Accessibility >95
  - [ ] Lighthouse Best Practices >95
  - [ ] Lighthouse SEO >90

- [ ] **Monitoring Setup**
  - [ ] Error tracking enabled (Sentry, etc.)
  - [ ] Analytics configured
  - [ ] Performance monitoring enabled
  - [ ] Alert thresholds set

---

## 📋 Pre-Push Verification (Do This Now)

### **Step 1: Code Quality (5 min)**
```bash
npm run lint -- --fix      # Auto-fix what we can
npm run lint               # Check for remaining issues
npx tsc --noEmit          # Type checking
```

### **Step 2: Build Test (3 min)**
```bash
npm run build              # Build for production
npm run start              # Test production build locally
# Visit http://localhost:3000 and test manually
```

### **Step 3: Git Verification (2 min)**
```bash
git status                 # Check what's being committed
git diff --cached         # Review changes

# Verify .gitignore is working:
ls -la node_modules       # Should exist locally
git ls-files | grep node  # Should be empty (not in git)
```

### **Step 4: Environment Check (1 min)**
```bash
# Verify .env.example exists and has all keys
cat .env.example          # Review template

# Verify .env.local is NOT in git
git ls-files | grep .env  # Should only show .env.example
```

### **Step 5: Final Commit (2 min)**
```bash
git add .
git commit -m "feat: ready for deployment"
git push origin main
```

**Total Time: ~15 minutes** ⏱️

---

## 🚀 Deployment Commands

### **To Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel              # First time setup
vercel --prod       # Deploy to production
```

### **To Self-Hosted**
```bash
npm run build       # Build optimized bundle
npm run start       # Start production server
# Set NODE_ENV=production
# Configure environment variables on server
```

---

## 📊 After Deployment

- [ ] **Verify Live Site**
  - [ ] Homepage loads
  - [ ] Navigation works
  - [ ] API calls succeed
  - [ ] Images load correctly

- [ ] **Monitor Metrics**
  - [ ] Error rate normal
  - [ ] Performance acceptable
  - [ ] No spike in latency
  - [ ] User sessions working

- [ ] **Test Key Features**
  - [ ] User login works
  - [ ] Search functionality works
  - [ ] Payments process (if applicable)
  - [ ] Data displays correctly

- [ ] **Communication**
  - [ ] Team notified of deployment
  - [ ] Stakeholders informed
  - [ ] Status page updated
  - [ ] Changelog published

---

## 🚨 Rollback Plan

If something goes wrong post-deployment:

```bash
# Quick rollback to previous version
vercel --prod --yes       # Deploy to production again
# or
git revert <commit-hash>  # Revert to previous commit
git push origin main      # Push revert
```

---

## 📞 Support Contacts

**During Deployment Issues:**
- Backend Issue → Contact backend lead
- Database Issue → Contact DBA
- Deployment Issue → Contact DevOps
- UI Issue → Contact frontend lead

---

## ✨ Final Checklist

Before clicking "Deploy":

```
Code Quality
  ☐ npm run lint passes
  ☐ npx tsc --noEmit passes
  ☐ npm run build succeeds

Security
  ☐ No secrets in code
  ☐ .env.local not in git
  ☐ API keys configured

Documentation
  ☐ README updated
  ☐ CONTRIBUTING reviewed
  ☐ .env.example complete

Testing
  ☐ Manual testing done
  ☐ Mobile view tested
  ☐ Happy path works

GitHub
  ☐ PR approved
  ☐ No conflicts
  ☐ Ready to merge

Performance
  ☐ Lighthouse >90
  ☐ Load time acceptable
  ☐ Bundle size reasonable
```

---

## 🎉 You're Ready!

Once all checkboxes are checked, you're ready to deploy.

**Remember:** Deploy early and often. It's easier to roll back a small change than a big one.

Good luck! 🚀
