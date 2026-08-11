# Aiaru Site DS — conventions

A small, editorial personal-site kit: warm-beige/near-black palette, Montserrat throughout, generous letter-spacing on labels, hairline borders instead of shadows. 7 components: `Nav`, `Footer`, `Eyebrow`, `Portrait`, `ProjectRow`, `StatBlock`, `BigNumber`.

## Setup

No provider/wrapper needed — none of these components read from React context. Just import and use:

```tsx
import { Nav, ProjectRow, Footer } from '@aiaru/site-ds';
import '@aiaru/site-ds/styles.css';
```

`Montserrat` loads via a remote `@font-face` (`fonts.googleapis.com`, weights 400/500/600/700) already wired into `styles.css` — nothing to self-host.

## Styling idiom

This is **not** a utility-class system — each component owns its own hand-written class (`.nav`, `.proj`, `.stat-block`, etc.), and `<Name>Props` is the entire style surface: no `className` variant props exist except `Nav`'s passthrough `className`. Don't invent new utility classes (no `bg-*`/`gap-*` vocabulary here) — compose pages by placing these 7 components inside plain flex/grid layout `div`s, styled with the design tokens below, not by adding classes onto the components themselves.

**Tokens** (`var(--*)`, defined in `:root`):

| Token | Value | Use |
|---|---|---|
| `--bg` | `#F5F2EA` | page/component background |
| `--bg-2` | `#EDEADF` | secondary background |
| `--text` | `#161616` | primary text, headings |
| `--body` | `#2C2A26` | body copy |
| `--muted` | `#6E6A60` | labels, metadata, secondary links |
| `--dim` | `#C5BEB4` | borders, dividers, disabled-ish accents |
| `--line` | `#E2DDD2` | hairline rules (nav border, footer rule, card dividers) |
| `--sans` | `"Montserrat", system-ui, sans-serif` | the only font family used anywhere |
| `--max` | `1160px` | max content width (pair with `.shell`) |
| `--pad` | `clamp(24px, 6vw, 80px)` | horizontal page padding (pair with `.shell`) |

`.shell` (max-width + centered + responsive padding) is the page-width container every component that needs one already applies internally (`Nav`, `Footer`) — wrap your own page content in a `<div className="shell">` too, for the same width/padding as the shipped components.

## Where the truth lives

- `styles.css` → `@import "./_ds_bundle.css"` — read `_ds_bundle.css` for the real compiled selectors before styling anything new; it's the actual source of truth, this file is a summary.
- Each component's `.prompt.md` under `components/general/<Name>/` documents its exact props.

## Idiomatic composition example

A "things I've shipped" style page — `Nav` + a numbered section + a row of projects + `Footer`, using only real components and token-styled glue:

```tsx
import { Nav, Eyebrow, ProjectRow, Footer } from '@aiaru/site-ds';

export function WorkPage() {
  return (
    <>
      <Nav active="work" />
      <main className="shell" style={{ paddingTop: 'clamp(28px, 6vh, 64px)' }}>
        <Eyebrow num="02">Projects</Eyebrow>
        <div className="projects">
          <ProjectRow
            index="01"
            title="Example Co"
            description="What it does, in one or two sentences."
            tag="Category · Timeframe"
            href="https://example.com"
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
```
