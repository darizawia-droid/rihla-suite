# Testing RIHLA Suite Frontend

## Overview
RIHLA Suite is a DMC (Destination Management Company) SaaS platform built with React + Vite + TypeScript + Tailwind CSS. The frontend runs on port 5173 via `npm run dev`. All new feature pages use inline mock data and do not require a backend.

## Devin Secrets Needed
No secrets required — the app uses mock auth injection for testing.

## Auth Bypass for Testing
The app uses Zustand for auth state with a persist middleware that stores `token` and `refreshToken` under the key `stours-auth` in localStorage. The AppShell redirects to `/login` if no user AND no `stours_token` in localStorage.

**To bypass auth**, use Playwright CDP to:
1. Set `stours_token` in localStorage
2. Set `stours-auth` Zustand persist state with mock token
3. Intercept `/api/auth/me` API call to return a mock user with the desired role

```javascript
const { chromium } = require('playwright');
const browser = await chromium.connectOverCDP('http://localhost:29229');
const page = browser.contexts()[0].pages()[0];

// Intercept auth endpoint
await page.route('**/api/auth/me', route => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      id: 'test-user-1',
      email: 'admin@test.com',
      full_name: 'Admin Test',
      role: { name: 'super_admin' },
      permissions: ['*']
    })
  });
});

// Set localStorage tokens
await page.evaluate(() => {
  localStorage.setItem('stours_token', 'mock-token');
  localStorage.setItem('stours-auth', JSON.stringify({
    state: { token: 'mock-token', refreshToken: 'mock-refresh' },
    version: 0
  }));
});
```

**Important**: The Playwright script must keep running (use `await new Promise(() => {})` or `setInterval`) to maintain the route interception. If the script exits, the mock is lost.

## Role-Based Navigation
The sidebar nav groups are defined in `roleConfig.ts`. Use `super_admin` role to see all groups:
- DIRECTION & STRATÉGIE
- CŒUR DE MÉTIER DMC
- STUDIO CRÉATIF (IA)
- OPÉRATIONS LIVE
- LOGISTIQUE & RESSOURCES
- GESTION & FINANCE
- EXTRAS — HAUTE VALEUR (4 items)
- EXTRAS — OPÉRATIONNEL (3 items)
- EXTRAS — INNOVATION (3 items)

## Routes for Feature Pages
| Route | Page | Key Elements |
|-------|------|--------------|
| `/client-portal` | Portail Client B2C | Day selector, comments, signature canvas |
| `/export-excel` | Export Excel Cotation | 4 model cards, PAX grid, CSV export |
| `/what-if` | Simulation What-If | PAX slider, guide toggle, price recalculation |
| `/projects/clone` | Dupliquer Projet | Project search, 2-step wizard |
| `/passengers` | Gestion Passagers | Passenger table, passport info, dietary filters |
| `/budget-tracker` | Budget Tracker | Estimé vs Réel bars, category breakdown |
| `/allotments` | Allotements | Timeline view, hotel cards, room counts |
| `/whatsapp` | WhatsApp Hub | Contact list, chat thread, alert messages |
| `/flight-search` | Recherche Vols | Search form, flight results, group pricing |
| `/supplier-scoring` | Scoring Fournisseurs | Supplier cards, metric bars, reviews |
| `/group-ops` | Coordination Groupe | Day timeline, incidents, multi-actor chat |

## Dark Mode
The dark mode toggle is a small Moon/Sun icon button in the sidebar footer with `title="Changer le thème"`. It might be difficult to click via computer-use — consider using Playwright to click it:
```javascript
await page.$eval('button[title="Changer le thème"]', btn => btn.click());
```
The toggle adds/removes the `dark` class on `<html>`. Note: many feature pages use explicit color classes and may not show dramatic visual changes in dark mode.

## Testing Tips
- All 11 feature pages use **inline mock data** — no backend API needed
- The **dashboard page will crash** without a backend (expects real API data) — this is expected
- Use Playwright for precise DOM interactions (small buttons, specific selectors)
- Use computer-use tool for visual verification and screenshots
- The theme toggle button is at the very bottom of the sidebar, hard to click with mouse coordinates
- The dev server runs on `http://localhost:5173` (Vite)
- Build: `npm run build` (tsc && vite build)
- Lint: `npm run lint`
- Language: French (primary UI language)
