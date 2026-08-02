---
trigger: model_decision
description: Use this rule only when creating or designing frontend UI/UX code.
---

# DESIGN SPECIFICATION: RFQPILOT (INDIAN SME INDUSTRIAL UTILITARIAN)
**Version:** 1.0 (The 'Industrial Hardware' Release)
**Oriented To:** Indian Factory Owners, Managing Directors, & Procurement Managers

---

## I. Narrative Vibe & Aesthetic Emulation
The "RFQPilot" aesthetic is engineered to mirror rugged, premium **Industrial Automation Hardware** (like Siemens or Rockwell control modules). It is designed to look highly professional to a 55-year-old factory owner in Noida, Pune, or Ludhiana. 
- **Core Principle:** Data-forward, robust layout structures. Absolutely NO bubbly corners, neon purple highlights, or generic AI startup gradients.
- **Visual Feel:** A physical precision panel gauge. Sharp lines, clear typography, and immediate scannability between manufacturing floor runs.

---

## II. Color Grading Palette (Strict System Colors)

### A. Foundations (Base Layers)
- **Background Base:** `#FAFAF8` | `Warm Oxide Base` (The primary application backdrop. Soft warm white; never cold digital `#FFFFFF`)
- **Background Surface:** `#F4F3F0` | `Diecast Surface` (Slightly deeper tone for panels, sidebars, and component containers)
- **Background Sunken:** `#ECEAE5` | `Sunken Panel` (Specifically reserved for input fields and alternating table row matrices)

### B. Structural Borders
- **Border Default:** `#D4D0C8` | `Steel Wire Wireframe` (Standard component bounding rules)
- **Border Strong:** `#B8B4AA` | `Iron Rule` (Emphasized grid dividers and structural headers)
- **Border Subtle:** `#E8E6E1` | `Muted Seam` (Soft inner-container dividers)

### C. Branding & Interactive Accents
- **Primary Accent CTA:** `#C17F24` | `Industrial Amber` (The only primary action tint. Solid color used for main buttons and active states)
- **Accent Hover:** `#A86E1C` | `Deep Amber` (Pressed state color adjustment)
- **Accent Light:** `#FDF3E3` | `Amber Bleed` (Subtle tint for highlighted active rows or panels)
- **Accent Border:** `#E8C07A` | `Anodized Brass` (Border framing for active highlights)

### D. System Typography Colors
- **Text Primary:** `#1A1917` | `Technical Carbon` (Near-black charcoal for primary text, critical figures, and section titles)
- **Text Secondary:** `#4A4845` | `Muted Lead` (Dark gray for general descriptive copy and body copy)
- **Text Muted:** `#8B8780` | `Oxidized Silver` (Light gray exclusively for inline metadata labels and technical hint notes)

---

## III. Layout & Component Styling Rules

### 1. Geometric Framing Constraints
- **Corner Radii:** Strictly limited to preserve geometric structure. Badges and tags use `3px` (`--radius-sm`). Buttons, inputs, and primary metric cards use a maximum of `6px` (`--radius-md`). Modal overlays max out at `8px` (`--radius-lg`).
- **Shadow Elimination:** Cards and buttons must rely on crisp, solid borders (`1px solid var(--border-default)`) instead of standard drop shadows. Shadows are completely banned across general interfaces, except for deep overlay dropdown panels and modals.

### 2. Tabular Grid Rules (The Comparison Engine)
- **Header Formatting:** Grid headers must be formatted in all-caps, utilizing a font size of `11px` to `12px` via `Space Grotesk 600`, with tracking explicitly configured to `letter-spacing: 0.06em`.
- **Numerical Financial Data:** All financial parameters and quote quantity metrics must be compiled utilizing `DM Mono` to force strict vertical columnar digit alignment. Prices must sit flush right-aligned and utilize correct Indian standard placement styling (`₹1,24,500`).
- **Recommended AI Match Row:** The matrix item highlighted by Gemini as the optimal variant must dynamically apply the background property `var(--accent-light)` and a prominent left-hand structural border defined as `3px solid var(--accent)`.

### 3. Reference Prototype
- **Link** - https://v0.app/chat/saas-procurement-dashboard-f5LPXA0g4OJ?ref=5KMX2T. Follow this link to get structural, UX reference. 
- **NOTE:** Do not follow this link ui. just follow ux and working flow. make sure ui and overall feel of website is like not generic AI website. The working flow of RFQPilot should be easy for user to follow and use. So always recommend me best options when i make wrong decision.

## IV. UX Prototype Structural Reference Integration

### 1. Information Architecture Source
- **Reference Workspace Structure:** Derived directly from the `saas-procurement-dashboard` blueprint.
- **Strict Implementation Constraint:** Extract *only* the user journeys, step-by-step wizard paths, form field inputs, and tabular layouts. Completely reject the visual CSS variables, background radial gradients, rounded aesthetics, or card shadows present in the prototype.

### 2. Guardrails for Core Interactive Flows
- **The Vendor Onboarding Flow:** Keep the table columns and data collection fields from the reference, but render them inside a clean, alternating-color grid (`Cool Oxide` and `Matte Diecast`).
- **The RFQ Creation Flow:** Maintain the multi-column layout for parsing text, but display the finalized data using the industrial technical forms system.
- **The Comparison Matrix Layout:** Emulate the dense layout of the prototype comparison panel, but force absolute contrast and precision spacing based on a strict 4px grid system.