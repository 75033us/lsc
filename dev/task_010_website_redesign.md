# Task 010: Website Redesign (lsc.church)

## Status: Active

## Description
Replace the current Google Sites site at `lsc.church` with a static Astro site, styled consistently with the mother church (`fsllc.org.tw` — 鳳山活泉靈糧堂), bilingual (zh-TW default + English), deployed to Cloudflare Pages from a separate GitHub repo (`lsc-web`).

The current site is on Google Sites and is hard to fetch programmatically (ECONNREFUSED on automated requests). Migration content will be inventoried manually before scaffolding pages.

---

## Goals

1. Visual + structural consistency with mother church `fsllc.org.tw`.
2. Bilingual: **zh-TW default**, English at `/en/` — congregation is US-based, so English must be first-class.
3. Editable by non-engineers — content in MD/MDX, not JSX.
4. Auto-deploy on `git push` to `main`; preview deploys on PRs.
5. Apex domain `lsc.church` served from Cloudflare with HTTPS.
6. Lighthouse 90+ on mobile (static site, should be trivial).

---

## Tech Stack

- **Framework**: Astro (SSG mode)
- **Styling**: Tailwind CSS
- **Content**: Astro Content Collections (Markdown / MDX), one folder per locale
- **i18n**: Astro built-in routing — `defaultLocale: 'zh-TW'`, locales `['zh-TW', 'en']`
- **Hosting**: Cloudflare Pages (Git integration)
- **Domain**: `lsc.church` (already owned; assumed on Cloudflare DNS — confirm)
- **Repo**: `lsc-web` (separate from this `lsc` repo, since Cloudflare Pages watches a single repo)

---

## Repo Layout

```
lsc-web/
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   ├── favicon.svg
│   ├── logo/
│   └── photos/
├── src/
│   ├── content/
│   │   ├── config.ts          # collection schemas
│   │   ├── pages/
│   │   │   ├── zh-TW/         # about.md, beliefs.md, giving.md, ...
│   │   │   └── en/
│   │   ├── news/
│   │   │   ├── zh-TW/
│   │   │   └── en/
│   │   ├── sermons/
│   │   │   ├── zh-TW/
│   │   │   └── en/
│   │   └── stories/
│   │       ├── zh-TW/
│   │       └── en/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── LanguageToggle.astro
│   │   ├── HeroCarousel.astro
│   │   ├── ServiceTimesCard.astro
│   │   ├── NewsList.astro
│   │   ├── SermonCard.astro
│   │   └── CTA.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── PageLayout.astro
│   ├── i18n/
│   │   ├── ui.ts              # nav labels, button text per locale
│   │   └── utils.ts           # getLocale(), translatePath()
│   ├── pages/
│   │   ├── index.astro                  # zh-TW homepage (default)
│   │   ├── about.astro
│   │   ├── giving.astro
│   │   ├── news/[...slug].astro
│   │   ├── sermons/[...slug].astro
│   │   └── en/
│   │       ├── index.astro
│   │       ├── about.astro
│   │       └── ...
│   └── styles/
│       └── global.css
└── README.md
```

---

## Information Architecture

Derived from `fsllc.org.tw`, slimmed for a US plant:

| Section (zh-TW) | Section (en) | Source | Notes |
|---|---|---|---|
| 首頁 | Home | hand-built | Hero, service times, latest news, giving CTA |
| 關於我們 | About | content/pages | Beliefs, vision, history, statement of faith |
| 主日聚會 | Sunday Service | content/pages | Times, location, what to expect, kids |
| 小組 | Small Groups | content/pages or DB later | List + contact |
| 最新消息 | News | content/news | MD posts with frontmatter date |
| 信息 | Sermons | content/sermons | Title, date, speaker, scripture, audio/video link |
| 見證 | Stories / Testimonies | content/stories | |
| 奉獻 | Giving | content/pages | Online + mailing address; ties to `task_009` (accounting) for receipt language |
| 代禱 | Prayer | content/pages + form | Form posts to LINE bot endpoint (`task_008`) |
| 同工 | Staff | content/pages | Photo, name, role, brief bio |
| 聯絡我們 | Contact | content/pages | Address, email, map embed, social links |

Defer to v2: Member-only area (auth), event registration (handoff to LINE bot).

---

## i18n Strategy

- **Default locale**: `zh-TW` at `/`
- **English**: `/en/`
- Astro config:
  ```js
  i18n: {
    defaultLocale: 'zh-TW',
    locales: ['zh-TW', 'en'],
    routing: { prefixDefaultLocale: false }  // zh-TW at root
  }
  ```
- Language toggle in header, persists across routes via path mapping.
- UI strings (nav labels, button text) in `src/i18n/ui.ts`.
- Page content lives in `src/content/<collection>/<locale>/<slug>.md` — same slug across locales for clean toggling.
- Default `<html lang>` to zh-TW; switches to en on `/en/*`.

---

## Cloudflare Pages Setup

1. Create GitHub repo `lsc-web` (private or public — TBD with Board).
2. Push initial scaffold to `main`.
3. Cloudflare dashboard → Pages → Connect to Git → select `lsc-web`.
4. Build config:
   - Build command: `npm run build`
   - Build output: `dist`
   - Node version: 20
5. Production branch: `main`.
6. Custom domain: `lsc.church` (apex) + `www.lsc.church` (redirect to apex).
7. Confirm DNS — if `lsc.church` is on Cloudflare DNS, Pages binds automatically; otherwise update nameservers first.

---

## Phased Implementation

### Phase 1 — Scaffold
- [ ] Create local repo at `/Users/xlj/workspace/75033us/lsc-web/`
- [ ] `npm create astro@latest` (minimal template) + Tailwind integration
- [ ] Configure i18n (zh-TW default, en at `/en/`)
- [ ] Base layout + Header + Footer + Language toggle
- [ ] Push to GitHub `lsc-web`

### Phase 2 — Content Inventory & Migration
- [ ] Inventory current `lsc.church` Google Sites content (manual — automated fetch fails)
- [ ] Define content collection schemas (`src/content/config.ts`)
- [ ] Migrate Home, About, Service Times, Giving, Contact to MD/MDX (zh-TW first)
- [ ] English translations for the same set

### Phase 3 — Visual Polish
- [ ] Reference `fsllc.org.tw` for color, typography, section rhythm
- [ ] Hero carousel component
- [ ] Service times card, latest news block, sermon archive list
- [ ] Mobile-first responsive pass
- [ ] Photos / logo assets

### Phase 4 — Deploy
- [ ] Cloudflare Pages connect → first deploy on `*.pages.dev` preview URL
- [ ] Verify build, i18n routing, language toggle
- [ ] Bind `lsc.church` apex + `www` redirect
- [ ] Verify HTTPS + redirect

### Phase 5 — Beyond v1
- [ ] Sermon archive with audio/video embeds
- [ ] News RSS feed
- [ ] Prayer-request form → LINE bot webhook (cross with `task_008`)
- [ ] Event registration (cross with `task_008`)
- [ ] Sitemap + analytics (Cloudflare Web Analytics, no cookies)

---

## Open Questions

- [ ] GitHub repo owner — personal account `75033us` or a GitHub org for the church?
- [ ] Repo visibility — public or private?
- [ ] Is `lsc.church` already on Cloudflare DNS, or at another registrar?
- [ ] Logo / brand assets — do we have vector files, or pull from Google Sites?
- [ ] Photo library — who curates? Where stored?
- [ ] Sermon media hosting — YouTube embeds, or self-hosted via R2?

---

## Cross-References

- **`task_008` LINE bot**: prayer + event-registration forms on the website may post to bot webhooks.
- **`task_009` accounting**: Giving page must use IRS-compliant receipt language ("No goods or services were provided in exchange for this contribution.").
