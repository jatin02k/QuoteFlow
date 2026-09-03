# RFQDeck — Product Requirements Document
Version 1.0 | For Indian Manufacturing SMEs

---

## 1. Product Overview

**Name:** RFQDeck  
**Tagline:** Vendor quotes. Compared. In minutes.  
**Type:** B2B SaaS — Procurement Automation Tool

### What It Is
RFQDeck eliminates the email and Excel chaos that Indian manufacturing companies face when collecting and comparing vendor quotes. Instead of manually emailing 20 vendors, waiting for scattered replies, and copying prices into a spreadsheet — the owner uploads their requirement once, the system handles everything, and they see a clean comparison table when vendors respond.

### The Problem
Manufacturing companies with 50–200 employees run 15–30 procurement cycles every month. Each cycle:
- Requires manually emailing 20–40 vendors one by one
- Produces replies scattered across an inbox
- Requires copying quotes into Excel manually
- Takes 3–4 days of a senior person's time per cycle
- Has no visibility for the owner into status

### The Solution
Owner uploads requirement → AI parses it → System emails all vendors → Vendors respond via link → Comparison table auto-generates → AI recommends best vendor.

What took 3 days now takes 20 minutes.

### Positioning
Not replacing negotiation. Eliminating the paperwork before negotiation.
"Too small for SAP. Too big for email and Excel."

---

## 2. Target Customer

| Attribute | Detail |
|-----------|--------|
| Role | Owner, MD, Managing Director, Proprietor |
| Company size | 20–200 employees |
| Company type | Manufacturer — makes a physical product |
| Industries | Auto components, packaging, garments, pharma components, electronics assembly |
| Geography (Phase 1) | Noida, Greater Noida, Ghaziabad |
| Geography (Phase 2) | Pune, Ludhiana, Faridabad, Coimbatore |
| Current method | Email + Excel + WhatsApp calls |
| Vendors managed | 15–80 active vendors |
| RFQ volume | 10–30 per month |
| Tech level | Uses laptop and email. Not using procurement software. |
| Willingness to pay | High — if demo shows time saved |

### NOT the customer
- Factory under 10 people (owner calls vendors personally)
- Pure trading company (no manufacturing)
- Enterprise 500+ employees (has SAP/Oracle)
- Service businesses (no physical procurement)
- Salaried purchase manager employee (no budget authority)

---

## 3. Core User Flows

### Flow 1 — Onboarding
```
Homepage → "Start Free" → Enter email → OTP sent
→ Enter OTP → Enter company name → Dashboard
```

### Flow 2 — Add Vendors
```
Vendors page → Add Vendor → Fill: name, email, 
phone, category → Save → Appears in list
```

### Flow 3 — Create and Send RFQ
```
New RFQ → Enter title → Paste text OR upload PDF
→ Parse with AI → Review/edit extracted fields
→ Select vendors → Send → Confirmation
```

### Flow 4 — Vendor Responds
```
Vendor receives email → Clicks unique link
→ Sees RFQ details (no login) → Fills quote form
→ Submits → Owner notified
```

### Flow 5 — Compare Quotes
```
Open RFQ → See vendor status (submitted/pending)
→ View comparison table → See AI recommendation
→ Call top 2–3 vendors → Negotiate → Close RFQ
```

### Flow 6 — Auto Follow-up
```
48 hours after send → System checks non-responders
→ Sends reminder email automatically
→ Logs follow-up sent
```

---

## 4. Feature List — MVP Only

### Auth
- Email OTP login via Supabase (no password)
- One account per company
- Session persists across browser sessions

### Vendor Directory
- Add vendor: name, email, phone, category
- Edit / delete vendor
- Filter by category
- Search by name
- Free plan: max 10 vendors

### RFQ Creation
- Title input
- Paste raw text OR upload PDF (max 5MB)
- Gemini API parses into structured fields:
  - Product name
  - Quantity + unit
  - Specifications (list)
  - Delivery deadline
  - Delivery location
  - Special requirements
- All fields editable after parsing
- Save as draft

### Vendor Selection & Dispatch
- Select vendors by category or individually
- Shows count: "Sending to 12 vendors"
- One-click dispatch via Resend
- Each vendor gets unique token link
- Auto follow-up after 48 hours (toggle)
- Free plan: max 3 RFQs/month

### Vendor Response Form
- Public page — no login needed
- Shows RFQ details clearly
- Quote fields: unit price, quantity, lead time, payment terms, valid until, notes
- Mobile responsive (vendors open on phone)
- Handles: already submitted, expired, invalid token

### Quote Comparison
- All quotes in one table
- Columns: vendor, price, lead time, payment terms, valid until, notes, total cost
- Highlight: lowest price (green), fastest delivery (blue)
- Vendor status: submitted / pending / no response
- AI recommendation with reasoning
- Close RFQ action

### Dashboard
- Stats: RFQs this month, active RFQs, vendors, quotes received
- Recent RFQs list with status

### Settings & Billing
- Current plan display
- Usage: RFQs used, vendors added
- Upgrade to Pro via Razorpay
- Plan: Free (3 RFQs, 10 vendors) | Pro ₹999/month unlimited

---

## 5. What Is NOT In MVP
- Mobile app
- ERP integration
- Multi-user / team accounts
- Vendor rating system
- Order tracking post-RFQ
- WhatsApp vendor dispatch
- Analytics dashboard
- Negotiation features
- CSV import for vendors
- Purchase order generation

These are Phase 2 features, added based on customer feedback.

---

## 6. Pricing

| Plan | Price | Limits |
|------|-------|--------|
| Free | ₹0 | 3 RFQs/month, 10 vendors max |
| Pro | ₹999/month | Unlimited RFQs, vendors, auto follow-ups |
| Founding | ₹599/month (locked) | Same as Pro — first 10 customers only |

---

## 7. Success Metrics

| Metric | Month 1 | Month 2 | Month 3 |
|--------|---------|---------|---------|
| Paying customers | 2 | 10 | 50 |
| MRR | ₹1,200 | ₹10,000 | ₹50,000 |
| Avg RFQs/customer/month | — | 8 | 12 |
| Vendor response rate | — | >60% | >70% |
