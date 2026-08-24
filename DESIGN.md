# DESIGN.md

Mercury's **demo dashboard** system (demo.mercury.com/dashboard), measured off computed styles on 2026-08-23, rebuilt on a warm Danish-modern ground. Marketing-site values from mercury.com/about are noted where they differ.

## The concept

The site is an **operator dashboard for one person's work**. Persistent left rail, a single 968px content column, cards that hold readouts. That is the honest reading of "form follows function": a hardware portfolio should look like the instrument panel for the hardware, not like a brochure about it. Bauhaus and Danish modern show up as the strict grid, visible ordering, warm paper, and color that encodes meaning instead of mood.

## What was measured on the demo page

### Layout
| Property | Mercury's value |
|---|---|
| Sidebar | 220px wide, ground `#FBFCFD`, no shadow, hairline right edge |
| Main area | `#FFFFFF`, content column **968px** |
| Row-group gap | 40px |
| Card grids | `472px 472px` gap 24px (2-up); `306.66px × 3` gap 24px (3-up) |
| Sidebar item | 30px tall, radius **8px**, padding `2px 8px 2px 2px`, gap 6px |
| Sidebar item, active | fill `rgba(112,115,147,0.10)`, text colour unchanged |
| Sidebar group label | padding `8px 16px` |

### The neutral fill scale
One hue at four alphas does nearly all the work — chips, active states, hovers, tracks, hairlines:

```
rgba(112, 115, 147, 0.02)   faintest wash
rgba(112, 115, 147, 0.10)   standard fill: chips, active nav, tracks
rgba(112, 115, 147, 0.16)   hover, progress track
rgba(112, 115, 147, 0.22)   hairline on the marketing site
rgba(112, 115, 147, 0.10)   hairline on the dashboard (softer)
```

Hairlines are **0.8px**, never 1px. That sub-pixel value is a real Mercury signature.

### Elevation
The marketing site has zero shadows. The dashboard has exactly one, on 18 elements, four layers and tinted lavender rather than grey:

```
rgba(183,187,219,0.14) 0  1px  4px,
rgba(175,178,206,0.90) 0  0    1px,
rgba( 14, 14, 45,0.08) 0  8px 12px,
rgba(  4,  4, 52,0.02) 0 14px 20px
```

Copied verbatim, in Mercury's own rgba, because translating four layers to OKLCH risks drift and fidelity is the point. Nothing else on the page gets a shadow.

### Chips and buttons
| | Value |
|---|---|
| Height | 32px |
| Radius | 16px (pill) |
| Padding | `4px 16px 4px 12px` — asymmetric, tighter on the icon side |
| Primary | fill `#5266EB`, text white |
| Secondary | fill `rgba(112,115,147,0.10)`, text `#363644`, **no border** |
| Type | 16px, weight 360 |

### Color
| Role | Value |
|---|---|
| Primary ink | `#1E1E2A` (dashboard) / `#272735` (marketing) |
| Secondary ink | `#363644` |
| Tertiary ink | `#70707D` |
| Brand indigo | `#5266EB` |
| **Link indigo** | `#465BD1` — darker than the brand colour |
| Indigo wash | `rgba(82,102,235,0.10)` |
| Positive | `#036E43` |
| Lavender | `#A7B6F8` |
| Teal | `#CCE8EA` |
| Dark strip | `#1E1E2A` |

### Type
| Step | Value |
|---|---|
| Text face | `Arcadia Text`, variable 360–500 |
| Display face | `Arcadia Display`, variable 320–480 |
| Big readout | Display, **28px / 36px, weight 380, tracking −0.03em** |
| Card title | 15px / 24px, weight 400, in `#363644` |
| Body | 16px / 16px, weight 360 |
| Row text | 13px / 20px and 14px / 20px, weight 400 |
| Caption | 12px / 20px, weight 400 |
| Micro label | 10px / 24px, weight 480 |

Note the big readout's **negative** tracking (−0.84px at 28px) — the dashboard tightens numbers, while the marketing site's headings use slightly *positive* tracking (+0.24px at 48px). Both are copied to the surface they belong on.

### Other components
- Progress bar: 8px tall, radius 4px, track `rgba(112,115,147,0.16)`
- Icon button: 24px, radius 4px, transparent until hover
- Radius census: 4px (106 uses), 8px (63), 16px (32), 50% (29), 12px (10)

### Motion
```
--ease       cubic-bezier(0, 0, 0.2, 1)   0.28s   hovers, interactives
--ease-slow  cubic-bezier(0, 0, 0.6, 1)   0.5s    colour and surface shifts
```
Mercury's own two curves. No bounce, no elastic.

## Where this site departs, and why

Arcadia is proprietary. The substitutes match the skeleton — variable, low contrast, tall x-height, two families from one visual world — and add the Scandinavian pedigree the Danish-modern brief asks for:

- **Display: Familjen Grotesk** (Letters from Sweden), variable 400–700, used at 500.
- **Text: Schibsted Grotesk** (Norway), variable 400–900, used at 400–500.
- **Mono: JetBrains Mono**, restricted to measured values, identifiers, and the section indices. Never as "technical" costume.

Mercury's ground is a cool white. This site's is **warm bone**, hue 85, while the inks stay on Mercury's cool purple hue 285. That warm-paper / cool-ink tension is the whole palette, and it is what keeps this from being a Mercury clone.

## Tokens

Color strategy: **Committed**. Indigo carries interaction across the page; the paper carries the warmth.

```
--shell        oklch(97.2% 0.007 85)       sidebar ground
--paper        oklch(98.8% 0.004 85)       main area
--card         oklch(99.5% 0.002 85)       card face
--ink          oklch(24.5% 0.026 285)      ≈ #1E1E2A
--ink-2        oklch(34.5% 0.022 285)      ≈ #363644
--ink-3        oklch(55%   0.012 285)      ≈ #70707D
--fill-1       oklch(52% 0.03 285 / 0.02)
--fill-2       oklch(52% 0.03 285 / 0.10)  chips, active nav
--fill-3       oklch(52% 0.03 285 / 0.16)  hover, tracks
--line         oklch(52% 0.03 285 / 0.12)  the 0.8px hairline
--line-strong  oklch(52% 0.03 285 / 0.22)
--indigo       oklch(55.5% 0.196 272)      ≈ #5266EB
--indigo-link  oklch(50%   0.185 272)      ≈ #465BD1
--vermilion    oklch(58%   0.185 33)       live / in-progress only
--positive     oklch(46%   0.115 158)      ≈ #036E43
--deep         oklch(24.5% 0.026 285)      closing block and footer
```

**Color is functional, and that is the Bauhaus part.** Indigo means "you can interact with this." Vermilion means "still being built." Positive green means a measured result. Nothing is coloured to look nice.

## Structure

Sidebar items and section heads are numbered by CSS counter, in mono. Ordering information doing visible work is the Bauhaus tell, and on a dashboard it is also just useful. Section padding is `56px 40px` inside a 968px column — dashboard rhythm, not brochure rhythm.

The page closes on a full-bleed `--deep` contact block and footer, which is Mercury's own ending move.
