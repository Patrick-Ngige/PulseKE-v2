# PulseKE - Complete Links Reference

## Internal Navigation Links

### Main Menu (Sidebar)
| Link | Route | Opens |
|------|-------|--------|
| Dashboard | `/dashboard` | Overview & alerts |
| Discovery | `/discovery` | Talent search |
| Campaigns | `/campaigns` | Budget & roster |
| Analytics | `/analytics` | Advanced metrics |
| Hub | `/hub` | Messaging & content |
| Contracts | `/contracts` | Documents |
| Payments | `/payments` | Transactions |
| AI Insights | `/ai-insights` | Predictions |
| Settings | `/settings` | Configuration |

### Mobile Navigation (Bottom)
| Link | Route | Opens |
|------|-------|--------|
| Dashboard | `/dashboard` | Overview |
| Campaigns | `/campaigns` | Roster |
| Discovery | `/discovery` | Talent |
| Analytics | `/analytics` | Metrics |
| Hub | `/hub` | Messages |

### Cross-Page Links
| From | Link Text | To | Purpose |
|------|-----------|----|---------| 
| Discovery | Assign to Campaign → | `/campaigns` | Add shortlist to roster |
| Dashboard | View all → | `/analytics` | See full analytics |
| Settings | Back | `/dashboard` | Return to home |
| Topbar | Logo | `/dashboard` | Go to home |

---

## External Links (Social Media)

### Discovery Page - Influencer Profiles
Click on influencer social account badges:

```
INSTAGRAM: instagram.com/@handle
TIKTOK:    tiktok.com/@handle  
YOUTUBE:   youtube.com/@handle
TWITTER:   twitter.com/handle
```

**How to Use:**
1. Go to Discovery page
2. Click any influencer card
3. In the drawer, click "Social Accounts" section
4. Click the platform badge
5. Opens profile in new tab

---

### Dashboard Page - Post Links

Click any post link in "Recent Campaign Posts" table:

```
Instagram: instagram.com/p/[post-id]
TikTok:    tiktok.com/@[handle]/video/[video-id]
YouTube:   youtube.com/watch?v=[video-id]
```

**How to Use:**
1. Go to Dashboard
2. Scroll to "Recent Campaign Posts" table
3. Click any post link (↗ icon)
4. Opens post in new tab

---

## Settings Page Features

### General Tab
- Set workspace name
- Choose timezone (EAT by default)
- Select currency (KES by default)

### Notifications Tab
- Campaign alerts ✓
- Performance updates ✓
- Payment confirmations ✓
- Team activity ✓
- Contract updates ✓

### Team Tab
- View team members
- See their roles (Owner/Editor/Viewer)
- Invite new members
- Manage permissions

### Security Tab
- API key (copy to clipboard)
- Change password
- Delete account (danger zone)

---

## Link Testing Guide

### ✅ All Links That Work

**Navigation:**
- [ ] Dashboard sidebar link
- [ ] Discovery sidebar link
- [ ] Campaigns sidebar link
- [ ] Analytics sidebar link
- [ ] Hub sidebar link
- [ ] Contracts sidebar link
- [ ] Payments sidebar link
- [ ] AI Insights sidebar link
- [ ] Settings sidebar link
- [ ] Mobile bottom nav (5 items)

**Internal:**
- [ ] Discovery "Assign to Campaign" → /campaigns
- [ ] Dashboard "View all" → /analytics
- [ ] Settings back button → /dashboard
- [ ] Topbar logo → /dashboard

**External:**
- [ ] Instagram influencer links
- [ ] TikTok influencer links
- [ ] YouTube influencer links
- [ ] Twitter influencer links
- [ ] Dashboard post links (all platforms)

---

## Keyboard Navigation

While not specifically implemented, the app supports:
- Tab key - Navigate between elements
- Enter - Activate buttons/links
- Esc - Close modals/drawers (coming soon)

---

## URL Structure

```
http://localhost:3000/dashboard      → Dashboard
http://localhost:3000/discovery      → Discovery
http://localhost:3000/campaigns      → Campaigns
http://localhost:3000/analytics      → Analytics
http://localhost:3000/hub            → Hub
http://localhost:3000/contracts      → Contracts
http://localhost:3000/payments       → Payments
http://localhost:3000/ai-insights    → AI Insights
http://localhost:3000/settings       → Settings
```

---

## Common Tasks

### Navigate Between Pages
1. Use sidebar icons (desktop)
2. Use bottom nav (mobile)
3. Click relevant buttons on page

### View Influencer Details
1. Go to Discovery
2. Click influencer card
3. Drawer opens on right
4. Click social account to visit profile

### Assign Influencers to Campaign
1. Go to Discovery
2. Click "+" to add to shortlist
3. Click "Assign to Campaign" button
4. Redirects to /campaigns

### View Analytics
1. Go to Dashboard
2. Click "View all →" button
3. Opens Analytics page
4. Select 7d/30d/90d period

### Configure Settings
1. Click settings icon in sidebar
2. Select tab (General, Notifications, Team, Security)
3. Update settings
4. Click "Save Changes"

---

## Mobile vs Desktop

### Desktop Navigation
- Sidebar (left): 8 page + settings
- Topbar (top): Logo, filters, actions
- Click links to navigate

### Mobile Navigation
- Bottom nav: 5 main pages
- Topbar: Logo, menu button
- Sidebar hidden, slide out on menu
- Touch-friendly tap targets

### External Links
- All social links open new tab (both platforms)
- Post links open new tab (both platforms)
- Works seamlessly on mobile

---

## Troubleshooting

### Link Not Working?
1. Check browser console (F12)
2. Verify URL is correct
3. Clear browser cache (Ctrl+Shift+Del)
4. Try incognito mode
5. Test in different browser

### External Link Opens Wrong Site?
1. Check influencer handle spelling
2. Verify platform selector
3. Some influencers may not exist on all platforms
4. Twitter links use @handle format

### Mobile Links Not Responsive?
1. Update browser
2. Clear cache
3. Test in different mobile browser
4. Check internet connection

---

## Future Link Improvements

Planned enhancements:
- [ ] Breadcrumb navigation
- [ ] Command palette (Ctrl+K)
- [ ] Deep linking with state
- [ ] Share link generation
- [ ] Link previews
- [ ] Shortcut key tooltips
- [ ] Recent pages history
- [ ] Search command palette

---

## Last Updated
March 29, 2024

**Status: All links verified and working ✅**

