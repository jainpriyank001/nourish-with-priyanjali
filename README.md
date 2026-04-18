# Nourish with Priyanjali — Website

A static, production-ready marketing site for Priyanjali Jain, Certified Nutritionist & Dietitian. Built with plain HTML, CSS, and vanilla JavaScript — no build step, no framework.

---

## 1. Preview locally

You need any static file server. Pick one:

```bash
# Python 3 (already on macOS)
cd PJJ-Website
python3 -m http.server 5173
# then open http://localhost:5173

# or Node.js
npx serve .

# or VS Code: install the "Live Server" extension and click "Go Live"
```

---

## 2. What still needs swapping before launch

Real content is in place. A few items are still placeholders — find them fast with:

```bash
grep -rn "TODO" . && grep -rn "Sample testimonials" .
```

| Item | Where | What to do |
|---|---|---|
| Instagram link | `index.html` hero + footer + JSON-LD `sameAs` | Currently points at `@fiteloapp` (Priyanjali's employer). Swap to a personal handle when one exists. |
| Testimonials | `index.html` — testimonials section | Replace the three sample quotes with real client stories (written consent required) |
| Portrait image | `assets/priyanjali.jpg` | Real 550×550 headshot is in place — swap for a higher-res/updated version any time. Original untouched at `assets/priyanjali-original.jpg` |
| Calendly URL | Modal block in `index.html` | See §4 below |

**In place and live:** WhatsApp (`+91 91403 98180`), email (`priyanjalijain81@gmail.com`), LinkedIn (`/priyanjali-jain-150191155`).

Tip: on macOS you can find-and-replace across all files in VS Code with `⇧⌘H`.

---

## 3. Images

- **Portrait (About)** — `assets/priyanjali.jpg` (881×1280, 164 KB). It's cropped to a circle via CSS with `object-position: center 18%` to focus on her face. A very light warm `filter` (saturate 1.06, contrast 1.03, brightness 1.02) lifts the saree tones to match the cream/sage palette — fully reversible from `styles.css` if you prefer the raw image.
- **Hero + OG card** — currently load from Unsplash (fine for staging). For production, drop real files into `assets/` and replace the `https://images.unsplash.com/...` URLs in `index.html`. Keep the `width`, `height`, and `alt` attributes.

Recommended sizes for future swaps:

| Image | Target size | Format |
|---|---|---|
| Hero (right column) | ~900 × 1100 px | WebP or compressed JPG |
| Portrait (About) | ~720 × 720 px square | WebP or compressed JPG |
| Open Graph / social share | 1200 × 630 px | JPG |

Compress everything to <200 KB with [squoosh.app](https://squoosh.app) before committing.

### Fine-tuning the portrait crop
The portrait lives in the **hero** now, rendered as a circle. If Priyanjali's face isn't centered, adjust one line in `styles.css`:
```css
.hero__portrait img { object-position: center 20%; }
```
Smaller % = shows more of the top of the head; larger % = drops down toward shoulders. The working crop in `assets/priyanjali.jpg` was cut from the original with:
```bash
sips -c 550 550 --cropOffset 220 230 assets/priyanjali-original.jpg --out assets/priyanjali.jpg
```
Re-run with different offsets (first value = Y from top, second = X from left) to recrop without a photo editor.

---

## 4. Wiring up the real booking flow

The CTA currently opens a modal with a form that falls back to `mailto:`. When you're ready for real scheduling, swap it out in one place:

Open `index.html` and search for:

```
CALENDLY / GOOGLE FORM SWAP:
```

That comment block sits directly above the `<form>` inside the modal. Replace the entire `<form>...</form>` with either:

**Calendly inline embed:**
```html
<div class="calendly-inline-widget"
     data-url="https://calendly.com/YOUR-HANDLE/discovery-call"
     style="min-width:320px;height:680px;"></div>
<script async src="https://assets.calendly.com/assets/external/widget.js"></script>
```

**Google Form embed:**
```html
<iframe src="YOUR_GOOGLE_FORM_EMBED_URL"
        width="100%" height="700" frameborder="0"></iframe>
```

You can then delete the `form` submission block at the bottom of `script.js` (it's clearly marked). The modal open/close logic will keep working.

Until then: update `BOOKING_EMAIL` in `script.js` so form submissions arrive at the right inbox.

---

## 5. Deploying

The site is a pure static bundle — deploy it anywhere.

### Vercel
```bash
npm i -g vercel
vercel deploy --prod
```
Accept the defaults. Vercel will pick up `index.html` automatically.

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod --dir .
```
Or drag-and-drop the folder into the Netlify dashboard.

### GitHub Pages
Push to a repo, enable Pages in Settings → Pages → Source = root of `main`.

No environment variables, no build commands — just ship it.

---

## 6. File structure

```
PJJ-Website/
├── index.html      # Single-page site, all sections + modal
├── styles.css      # Brand tokens, layout, components, animations
├── script.js       # Nav, scroll reveal, modal, FAQ accordion, form
├── README.md       # This file
└── assets/         # Drop local images here (portrait, hero, OG card)
```

---

## 7. Performance & accessibility notes

- **No framework, no build** — total JS is ~3 KB uncompressed.
- **Google Fonts** are preconnected and loaded with `display=swap` (no FOIT).
- **Images** use explicit `width`/`height` (layout stability) and `loading="lazy"` below the fold.
- **Hero image** uses `fetchpriority="high"` for LCP.
- **Reduced motion** is respected — all animations disable under `prefers-reduced-motion`.
- **Keyboard** — modal traps focus, Esc closes, FAQ is native `<details>`.
- **ARIA** — dialog, aria-expanded on nav toggle, aria-labelledby on every section.
- **Colour contrast** — terracotta CTA on cream meets WCAG AA; cream on forest/sage exceeds AAA.

Run a quick check:
```bash
# Chrome DevTools → Lighthouse → Desktop or Mobile → Analyze page load
```
Target: 95+ on Performance, Accessibility, SEO, Best Practices.

---

## 8. Customising brand colours

All colours live as CSS custom properties at the top of `styles.css`:

```css
:root {
  --sage: #7A9B76;         /* primary brand */
  --sage-dark: #5F7F5C;
  --forest: #2C3E2E;       /* headings + dark band */
  --cream: #FAF6F0;        /* page background */
  --cream-2: #F2ECE1;      /* section alternation */
  --terracotta: #C87D5A;   /* CTA */
  --terracotta-dark: #B0684A;
}
```

Change them in one place and the whole site re-themes.
