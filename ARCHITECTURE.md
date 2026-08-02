# RFQPilot — Architecture & Tech Stack

---

## Tech Stack

| Layer | Tool | Why |
|-------|------|-----|
| Framework | Next.js 14 (App Router) | Server components, server actions, file-based routing |
| Language | TypeScript | Type safety, better debugging |
| Database | Supabase (PostgreSQL) | Auth + DB + RLS in one, generous free tier |
| AI Parsing | Gemini 1.5 Flash API | Free tier, fast, good structured output |
| Email | Resend | Simple API, reliable delivery, free tier |
| Payments | Razorpay Subscriptions | India-first, easy integration |
| Styling | Tailwind CSS + shadcn/ui | Utility-first, consistent components |
| Hosting | Vercel | Free tier, automatic deploys, cron jobs |
| PDF Parsing | pdf-parse (npm) | Extract text from uploaded PDFs |

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│              Browser (Client)            │
│  Next.js Client Components               │
│  shadcn/ui components                    │
│  Tailwind CSS                            │
└──────────────┬──────────────────────────┘
               │ HTTP / Server Actions
┌──────────────▼──────────────────────────┐
│            Next.js Server                │
│  App Router (Server Components)          │
│  Server Actions (mutations)              │
│  API Routes (webhooks, cron)             │
│  Middleware (auth protection)            │
└──┬──────────┬──────────┬────────────────┘
   │          │          │
┌──▼──┐  ┌───▼──┐  ┌────▼────┐
│Supa-│  │Gemini│  │ Resend  │
│base │  │  AI  │  │ Email   │
│     │  │      │  │         │
│Auth │  │Parse │  │Dispatch │
│DB   │  │RFQ   │  │Follow-up│
│RLS  │  │Reco. │  │Notify   │
└─────┘  └──────┘  └─────────┘
                         │
                   ┌─────▼─────┐
                   │ Razorpay  │
                   │Subscript. │
                   │ Webhook   │
                   └───────────┘
```

---

## Key Architecture Decisions

### Server Actions for All Mutations
All database writes happen in Server Actions — never from client components directly. This keeps API keys server-side and prevents client-side manipulation.

### Supabase RLS (Row Level Security)
Every table has policies so Company A can never see Company B's data. This is enforced at the database level — not just in application code.

### Token-Based Vendor Access
Vendors don't need accounts. Each vendor gets a unique UUID token in their email link. The token maps to a specific vendor+RFQ combination in the database. Secure enough for quote submission.

### Gemini for AI Features
Two AI calls in the entire app:
1. Parse RFQ text → structured JSON
2. Analyse quotes → recommendation + reasoning
Both use Gemini 1.5 Flash (free tier).

---

## File Structure

```
rfqpilot/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx          # Email input
│   │   │   └── verify/
│   │   │       └── page.tsx          # OTP input
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx            # Sidebar + nav
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # Stats overview
│   │   │   ├── rfqs/
│   │   │   │   ├── page.tsx          # RFQ list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx      # Create RFQ
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx      # RFQ detail + quotes
│   │   │   │       └── select-vendors/
│   │   │   │           └── page.tsx  # Vendor selection
│   │   │   ├── vendors/
│   │   │   │   └── page.tsx          # Vendor directory
│   │   │   └── settings/
│   │   │       └── page.tsx          # Plan + billing
│   │   ├── respond/
│   │   │   └── [token]/
│   │   │       └── page.tsx          # Public vendor form
│   │   └── api/
│   │       ├── parse-rfq/
│   │       │   └── route.ts          # Gemini parsing endpoint
│   │       ├── recommend/
│   │       │   └── route.ts          # Gemini recommendation
│   │       └── webhooks/
│   │           └── razorpay/
│   │               └── route.ts      # Payment webhook
│   ├── actions/
│   │   ├── auth.ts                   # Login, logout, session
│   │   ├── rfq.ts                    # Create, send, close RFQ
│   │   ├── vendor.ts                 # CRUD vendors
│   │   └── quote.ts                  # Submit quote
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser Supabase client
│   │   │   └── server.ts             # Server Supabase client
│   │   ├── gemini.ts                 # AI parsing + recommendation
│   │   ├── resend.ts                 # Email templates + dispatch
│   │   └── razorpay.ts               # Subscription + webhook verify
│   ├── components/
│   │   ├── ui/                       # shadcn components
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopBar.tsx
│   │   ├── rfq/
│   │   │   ├── RFQList.tsx
│   │   │   ├── RFQCreateForm.tsx
│   │   │   ├── VendorSelector.tsx
│   │   │   └── QuoteComparison.tsx
│   │   └── vendor/
│   │       ├── VendorList.tsx
│   │       └── VendorForm.tsx
│   ├── types/
│   │   └── index.ts                  # Shared TypeScript types
│   └── middleware.ts                  # Auth route protection
├── supabase/
│   └── migrations/
│       └── 001_initial.sql           # Complete DB schema
├── public/
│   └── logo.svg
├── .env.local                        # API keys (never commit)
├── CLAUDE.md                         # AI agent context file
├── .agent                            # Antigravity agent config
└── vercel.json                       # Cron job config
```

---

## Data Flow Examples

### RFQ Creation Flow
```
User pastes text
→ Client sends to /api/parse-rfq
→ Server calls Gemini API
→ Gemini returns JSON
→ Server returns to client
→ Client shows editable fields
→ User clicks Save Draft
→ Server Action: rfq.ts createRFQ()
→ Supabase INSERT into rfqs table
→ Redirect to vendor selection
```

### Quote Submission Flow
```
Vendor clicks email link (/respond/[token])
→ Server looks up token in rfq_vendors
→ Joins rfqs + vendors to get details
→ Renders public form
→ Vendor submits form
→ Server Action: quote.ts submitQuote()
→ Verify token valid + not expired
→ Supabase INSERT into quotes
→ UPDATE rfq_vendors status = 'submitted'
→ Resend notification email to owner
```

### Auto Follow-up Flow
```
Vercel Cron fires daily at 9am
→ GET /api/cron/follow-up
→ Verify CRON_SECRET header
→ Query: rfq_vendors where status=pending
         AND email_sent_at < now()-48hrs
         AND followup_sent_at IS NULL
→ For each: send reminder email via Resend
→ UPDATE followup_sent_at = now()
```

---

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Gemini AI
GEMINI_API_KEY=

# Resend Email
RESEND_API_KEY=
RESEND_FROM_EMAIL=rfq@yourdomain.com

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Cron Security
CRON_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
