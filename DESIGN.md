# DESIGN.md

Mercury's **dark** system, measured off `demo.mercury.com/dashboard` with `data-theme="dark"` on 2026-08-24. The nav follows Mercury's marketing bar; surfaces and controls follow the dashboard. Every value below came from computed styles, not from guessing.

## Two rules that override everything else

1. **The type floor is 14px.** Nothing on this page is smaller. The tracked all-caps micro-labels Mercury uses at 10px are not reproduced; they are illegible at real reading distance and they made the page look busier than it is.
2. **Copy states facts.** No metaphors, no "I build with a soldering iron", no "want to talk robots". If a sentence would embarrass him in an interview, it is out.

## Measured: dark theme

### Grounds
Dark elevation is a **lighter surface**, not a shadow. Mercury steps three grounds:

| Role | Mercury | Token |
|---|---|---|
| Page | `#171721` | `--ground` |
| Card face | `#272735` | `--card` |
| Wells, footer, media | `#10101A` | `--well` |

### The fill scale
One hue at four alphas does chips, active states, hovers, tracks, and hairlines. In light mode Mercury uses `rgba(112,115,147,α)`; in dark it flips to a light neutral:

```
rgba(180, 183, 200, 0.08)   faint wash
rgba(180, 183, 200, 0.12)   standard fill and hairline
rgba(180, 183, 200, 0.20)   hover
rgba(180, 183, 200, 0.36)   strongest
```

Hairlines are **0.8px**, never 1px. That sub-pixel value is a genuine Mercury signature.

### Text
`#FFFFFF` primary, `#DDDDE5` secondary, `#9D9DA8` tertiary, `#70707D` faintest. Light type on dark reads lighter than it measures, so body line-height goes to 1.65 rather than the 1.5 the light theme used.

### Accents lighten in dark mode
This is the part most dark themes get wrong, and Mercury gets right:

| Role | Light | Dark |
|---|---|---|
| Brand fill | `#5266EB` | `#5266EB` (unchanged) |
| **Link** | `#465BD1` | **`#8DA4F5`** |
| Positive | `#036E43` | `#77C599` |

The saturated brand indigo stays put as a *fill*; as *text* it would fail on a dark ground, so links and marks move to the lightened cut.

### Controls
| | Value |
|---|---|
| Nav | 72px tall, `16px var(--gutter)` padding, transparent until scrolled |
| Button | 40px tall, `0 20px` padding, pill radius, 16px text |
| Primary | fill `#5266EB` |
| Secondary | fill `rgba(180,183,200,0.12)`, **no border** |
| Radius census | 4px, 8px, 12px, 16px; pill on buttons and chips |
| Grid gap | 24px |

### Motion
Mercury's own two curves, copied:

```
--ease       cubic-bezier(0, 0, 0.2, 1)   0.28s   hovers, interactives
--ease-slow  cubic-bezier(0, 0, 0.6, 1)   0.5s    colour and surface shifts
```

No bounce, no elastic. Everything collapses to 0.01ms under `prefers-reduced-motion`.

## Tokens

```
--ground      oklch(20.5% 0.017 285)      page
--card        oklch(28.5% 0.021 285)      card face
--card-hi     oklch(31.5% 0.022 285)      card hover
--well        oklch(16.5% 0.018 285)      wells, footer
--ink         oklch(98%   0.004 285)
--ink-2       oklch(88.5% 0.008 285)
--ink-3       oklch(69%   0.011 285)
--ink-4       oklch(56%   0.012 285)
--fill-1..3   oklch(76% 0.02 285 / .08 | .12 | .20)
--line        oklch(76% 0.02 285 / .12)   the 0.8px hairline
--indigo      oklch(55.5% 0.196 272)      fill only
--indigo-lt   oklch(72%   0.125 272)      links and marks
--positive    oklch(75%   0.105 155)
--vermilion   oklch(72%   0.155 33)
```

**Colour is functional.** Indigo means interactive. Vermilion means still being built. Green means a measured result. Nothing is coloured for decoration.

## Type

Arcadia is proprietary, so the substitutes match the skeleton (variable, low contrast, tall x-height, two families from one visual world) and bring the Scandinavian pedigree the brief asked for:

- **Display: Familjen Grotesk** (Letters from Sweden), variable 400–700, used at 500.
- **Text: Schibsted Grotesk** (Norway), variable 400–700, used at 400–500.
- **Mono: JetBrains Mono**, only for measured values and identifiers. Never as "technical" costume.

Display tracking is negative (−0.014em to −0.028em), matching the dashboard's own treatment of large numbers. Prose caps at 68ch.

Scale, with the 14px floor enforced:

```
hero      clamp(42px, 5.4vw, 64px) / 1.08   -0.028em
h2        clamp(30px, 3.4vw, 42px) / 1.16   -0.024em
h3        19-24px
lede      19-21px / 1.5-1.6
body      17px / 1.65-1.7
row       16px
caption   15px
smallest  14px
```

## Layout

Top nav, one 1120px column, cards on a 24px grid. Section rhythm is `clamp(56px, 6.5vw, 88px)`. The rail experiment is gone; the hero's inner box subtracts the gutter so the h1 aligns with every section heading below it.
