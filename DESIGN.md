# QuoteFlow — Design System

## Design Philosophy

**Aesthetic: Industrial Utilitarian**

QuoteFlow is used by factory owners and procurement managers — people who work in physical, real-world environments. The interface should feel like a precision tool, not a startup app.

Think: a well-made gauge on a machine panel. Clean. Legible. Functional. Trustworthy.

**What we are NOT:**
- Not a generic AI SaaS (no purple gradients, no rounded bubbly cards)
- Not a consumer app (no playful illustrations, no bright colors)
- Not enterprise bloatware (no cluttered dashboards, no unnecessary complexity)

**What we ARE:**
- Solid and precise
- Data-forward (tables, not cards)
- Warm neutral palette (not cold blue-grey)
- Typographically clear
- Immediately legible for someone opening it between production runs

---

## Color Palette

```css
:root {
  /* Backgrounds */
  --bg-base: #FAFAF8;        /* Warm white — main background */
  --bg-surface: #F4F3F0;     /* Slightly darker — cards, sidebar */
  --bg-sunken: #ECEAE5;      /* Inputs, table rows alt */
  
  /* Borders */
  --border-default: #D4D0C8; /* Standard borders */
  --border-strong: #B8B4AA;  /* Emphasized borders, table headers */
  --border-subtle: #E8E6E1;  /* Subtle dividers */
  
  /* Text */
  --text-primary: #1A1917;   /* Near black — headings, important data */
  --text-secondary: #4A4845; /* Dark gray — body text */
  --text-muted: #8B8780;     /* Light gray — labels, hints */
  --text-disabled: #C0BDB8;  /* Disabled state */
  
  /* Accent — Amber/Gold (manufacturing warmth) */
  --accent: #C17F24;         /* Primary CTA color */
  --accent-hover: #A86E1C;   /* Hover state */
  --accent-light: #FDF3E3;   /* Accent backgrounds */
  --accent-border: #E8C07A;  /* Accent borders */
  
  /* Status Colors */
  --status-success: #2D6A4F;       /* Submitted, completed */
  --status-success-bg: #EAF4EF;
  --status-warning: #B45309;       /* Pending, needs attention */
  --status-warning-bg: #FEF3C7;
  --status-error: #9B1C1C;         /* Failed, error */
  --status-error-bg: #FEE2E2;
  --status-neutral: #4A4845;       /* Draft, inactive */
  --status-neutral-bg: #F4F3F0;
  
  /* Steel — for data and technical elements */
  --steel-light: #C8CDD6;
  --steel-mid: #8B9099;
  --steel-dark: #4A5058;
}
```

---

## Typography

```css
/* Import in globals.css */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

:root {
  --font-heading: 'Space Grotesk', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --font-mono: 'DM Mono', monospace;
}
```

### Type Scale

| Element | Font | Size | Weight | Usage |
|---------|------|------|--------|-------|
| Page Title | Space Grotesk | 24px | 600 | Dashboard headings |
| Section Title | Space Grotesk | 18px | 600 | Card titles |
| Table Header | Space Grotesk | 12px | 600 | All caps, tracked |
| Body | DM Sans | 14px | 400 | Standard text |
| Body Strong | DM Sans | 14px | 500 | Emphasized body |
| Small | DM Sans | 12px | 400 | Labels, captions |
| Data | DM Mono | 14px | 400 | Prices, quantities, dates |
| Data Large | DM Mono | 18px | 500 | Key metrics |

### Table Headers
Always uppercase, letter-spacing: 0.05em, 12px Space Grotesk 600.
Creates clear visual hierarchy between header and data rows.

### Prices and Numbers
Always use DM Mono. Prices right-aligned in tables.
Format: ₹1,24,500 (Indian number formatting)

---

## Spacing System

Based on 4px grid.

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

---

## Border Radius

Minimal. Industrial.

```css
--radius-sm: 3px;   /* Badges, small elements */
--radius-md: 6px;   /* Cards, inputs, buttons */
--radius-lg: 8px;   /* Modals only */
```

No radius above 8px. No "pill" buttons except status badges.

---

## Shadows

Use borders, not shadows. When shadow needed:

```css
--shadow-sm: 0 1px 2px rgba(26, 25, 23, 0.06);
--shadow-md: 0 2px 8px rgba(26, 25, 23, 0.08);
```

Dropdowns and modals only. Never on cards or buttons.

---

## Components

### Buttons

```css
/* Primary — Amber */
.btn-primary {
  background: var(--accent);
  color: white;
  border: 1px solid var(--accent-hover);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  transition: background 150ms;
}
.btn-primary:hover {
  background: var(--accent-hover);
}

/* Secondary — Outlined */
.btn-secondary {
  background: var(--bg-base);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
}
.btn-secondary:hover {
  background: var(--bg-surface);
  border-color: var(--border-strong);
}

/* Ghost */
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: none;
  padding: 8px 12px;
}
.btn-ghost:hover {
  background: var(--bg-surface);
  color: var(--text-primary);
}

/* Destructive */
.btn-destructive {
  background: var(--bg-base);
  color: var(--status-error);
  border: 1px solid var(--border-default);
}
.btn-destructive:hover {
  background: var(--status-error-bg);
  border-color: var(--status-error);
}
```

### Status Badges

```css
/* Submitted / Success */
.badge-success {
  background: var(--status-success-bg);
  color: var(--status-success);
  border: 1px solid #A3D9BC;
  font-size: 11px;
  font-weight: 600;
  font-family: var(--font-body);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* Pending / Warning */
.badge-warning {
  background: var(--status-warning-bg);
  color: var(--status-warning);
  border: 1px solid #F6C874;
}

/* Draft / Neutral */
.badge-neutral {
  background: var(--status-neutral-bg);
  color: var(--status-neutral);
  border: 1px solid var(--border-default);
}
```

### Tables

The most important component. Manufacturers live in tables.

```css
.table-wrapper {
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table thead {
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-strong);
}

.table thead th {
  font-family: var(--font-heading);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  padding: 10px 16px;
  text-align: left;
}

.table thead th.numeric {
  text-align: right;
}

.table tbody tr {
  border-bottom: 1px solid var(--border-subtle);
  transition: background 100ms;
}

.table tbody tr:hover {
  background: var(--bg-surface);
}

.table tbody tr:last-child {
  border-bottom: none;
}

.table tbody td {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text-secondary);
  padding: 12px 16px;
}

.table tbody td.numeric {
  font-family: var(--font-mono);
  text-align: right;
  color: var(--text-primary);
}

/* Highlighted row — best vendor */
.table tbody tr.highlight-best {
  background: var(--accent-light);
  border-left: 3px solid var(--accent);
}

.table tbody tr.highlight-best td {
  color: var(--text-primary);
}
```

### Cards

```css
.card {
  background: var(--bg-base);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-6);
}

.card-header {
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: var(--space-4);
  margin-bottom: var(--space-4);
}

.card-title {
  font-family: var(--font-heading);
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}
```

### Inputs

```css
.input {
  background: var(--bg-base);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text-primary);
  padding: 8px 12px;
  width: 100%;
  transition: border-color 150ms;
}

.input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--accent-light);
}

.input::placeholder {
  color: var(--text-disabled);
}

.input-label {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 6px;
  display: block;
}
```

### Sidebar

```css
.sidebar {
  width: 240px;
  background: var(--bg-surface);
  border-right: 1px solid var(--border-default);
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: var(--space-4) 0;
}

.sidebar-logo {
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--border-subtle);
  margin-bottom: var(--space-2);
}

.sidebar-logo-text {
  font-family: var(--font-heading);
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-5);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 400;
  color: var(--text-secondary);
  border-radius: 0;
  transition: all 150ms;
  border-left: 2px solid transparent;
}

.sidebar-nav-item:hover {
  background: var(--bg-sunken);
  color: var(--text-primary);
}

.sidebar-nav-item.active {
  background: var(--accent-light);
  color: var(--accent);
  border-left-color: var(--accent);
  font-weight: 500;
}
```

---

## Page Layouts

### Dashboard Shell
```
┌─────────────────────────────────────────────┐
│ SIDEBAR (240px)   │  TOP BAR                │
│                   │─────────────────────────│
│ Logo              │  PAGE CONTENT           │
│                   │                         │
│ Dashboard         │  Page Title             │
│ RFQs              │  ─────────────────────  │
│ Vendors           │  Content area           │
│ Settings          │                         │
│                   │                         │
│ ─────────────────│                         │
│ User email        │                         │
│ Sign out          │                         │
└─────────────────────────────────────────────┘
```

### Page Header
```
Page Title (24px Space Grotesk 600)
Subtitle / description (14px DM Sans muted)
                              [Action Button]
────────────────────────────────────────────
```

### Stats Cards (Dashboard)
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ LABEL        │  │ LABEL        │  │ LABEL        │
│              │  │              │  │              │
│ 24           │  │ 8            │  │ 127          │
│ DM Mono 28px │  │              │  │              │
│              │  │              │  │              │
│ ↑ vs last mo │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## Email Design

Vendor emails should feel professional and clear. Plain HTML, no fancy design.

```
Subject: RFQ from [Company Name] — [Product Name]

─────────────────────────────────
QuoteFlow
─────────────────────────────────

[Company Name] has requested a quote from you.

PRODUCT DETAILS
───────────────
Product:    MS Steel Rods, 12mm diameter
Quantity:   500 units
Deadline:   15 March 2026
Location:   Noida, UP

SPECIFICATIONS
──────────────
• Grade: IS 2062
• Length: 6 meters
• Surface finish: mill scale

[SUBMIT YOUR QUOTE →]

This link is unique to you. Quote deadline: 15 March 2026.
─────────────────────────────────
QuoteFlow — Procurement made simple
```

---

## Tailwind Config

```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#FAFAF8',
          surface: '#F4F3F0',
          sunken: '#ECEAE5',
        },
        border: {
          DEFAULT: '#D4D0C8',
          strong: '#B8B4AA',
          subtle: '#E8E6E1',
        },
        text: {
          primary: '#1A1917',
          secondary: '#4A4845',
          muted: '#8B8780',
          disabled: '#C0BDB8',
        },
        accent: {
          DEFAULT: '#C17F24',
          hover: '#A86E1C',
          light: '#FDF3E3',
          border: '#E8C07A',
        },
        success: {
          DEFAULT: '#2D6A4F',
          bg: '#EAF4EF',
        },
        warning: {
          DEFAULT: '#B45309',
          bg: '#FEF3C7',
        },
        error: {
          DEFAULT: '#9B1C1C',
          bg: '#FEE2E2',
        },
        steel: {
          light: '#C8CDD6',
          mid: '#8B9099',
          dark: '#4A5058',
        },
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      borderRadius: {
        sm: '3px',
        DEFAULT: '6px',
        md: '6px',
        lg: '8px',
      },
    },
  },
}
```

---

## What Good Looks Like (Reference Points)

When designing screens, ask: does this look like a tool a factory owner would trust with their procurement data?

**Good references (not to copy, just for feel):**
- Linear.app — precise, data-dense, no fluff
- Clerk dashboard — clean tables, subtle colors
- Railway.app — warm neutrals, clear hierarchy
- Traditional Indian business software aesthetic — functional over decorative

**Bad references (avoid this direction):**
- Any AI startup with purple gradients
- Consumer apps with big rounded corners
- Dashboard templates with colorful chart widgets everywhere
- Anything that looks like it was generated by an AI design tool

The test: would a 55-year-old factory owner in Noida look at this and think "this looks like professional software" or "this looks like something a student made"? It should always feel like professional software.
