# Hidden Directive — Site Integration Kit

Everything here is ready to drop into your GitHub Pages repo
(`mrabousakho/mrabousakho.github.io`). It matches your existing theme
(`style.css` / `script.js`, JetBrains Mono, your `card` / `badge` / `phase-strip`
classes) — no restyling needed.

## What's in this folder (`site/`)

```
site/
├─ hidden-directive-report.html      ← NEW page (the case file)
├─ index.html                        ← UPDATED homepage (adds Hidden Directive)
├─ case-files.html                   ← UPDATED case list (links the tile)
└─ hidden-directive/                 ← NEW media + downloads folder
   ├─ explainer.html                 (narrated 13-stage walkthrough)
   ├─ teaser.html                    (60-second loop)
   ├─ incident-report.pdf
   ├─ walkthrough.pdf
   ├─ kql-cheatsheet.pdf
   └─ deck.pptx
```

## How to publish (copy → commit → push)

1. Copy the **contents** of this `site/` folder into the **root** of your repo
   (same level as your current `index.html` / `style.css`). Keep the
   `hidden-directive/` folder as a folder.
   - It's safe to overwrite `index.html` and `case-files.html` — these are your
     current live files with only the Hidden Directive additions (see below).
2. Commit & push (or drag-drop in the GitHub web UI → "Commit changes").
3. Wait ~1 minute for GitHub Pages to rebuild, then open
   `https://mrabousakho.github.io/hidden-directive-report.html`.

> Prefer to hand-edit instead of overwriting? See "Exact changes" below — it's
> literally one card per page.

## What changed (if you'd rather edit by hand)

**`case-files.html`** — the "Hidden Directive" tile (was `IN PROGRESS`, no link)
is now a linked card:

```html
<a href="hidden-directive-report.html" class="card">
  <div class="top-row"><h3>Hidden Directive</h3><span class="badge critical">DOMAIN BREACH</span></div>
  <div class="meta">GF-INC-2026-0704 · Live Microsoft Sentinel · Dual-SIEM</div>
  <p class="desc">A weaponised AI page-summariser to a forged Kerberos Golden Ticket — full Active Directory domain compromise reconstructed across two SIEMs, with a narrated 13-stage walkthrough and downloadable report kit.</p>
  <div class="tags"><span class="tag">Dual SIEM</span><span class="tag">Golden Ticket</span><span class="tag">AI Abuse</span></div>
  <div class="view-repo">Read the full report →</div>
</a>
```

**`index.html`** — two additions:
1. The hero terminal (`hidden_directive.kql`) is now a clickable link to the report.
2. A "Hidden Directive" card was added to the **Featured Work** and **Full Reports** grids.

## Notes

- The narrated explainer uses each visitor's **browser speech engine**, so the
  voice varies by device (best in Chrome/Edge). For a *consistent* experience,
  consider screen-recording it once and hosting that MP4 as the hero instead —
  the live HTML still works as an interactive bonus.
- The KQL in the report/cheat sheet is **teaching-grade** — the page notes that
  readers should verify field names against their own schema.
- Optional polish: add an Open Graph preview image at
  `hidden-directive/og.png` and point this page's `og:image` at it for a nicer
  LinkedIn/X card.
