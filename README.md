# RFQDeck

RFQ automation for Indian manufacturing SMEs.

Stop managing vendor quotes over email and Excel.
RFQDeck lets you send RFQs to all your vendors in one click,
collect quotes automatically, and compare them in one place.

## What It Does

- Create RFQs with AI-assisted parsing
- Send to multiple vendors simultaneously
- Vendors respond via a unique link — no account needed
- Compare all quotes in one table
- Auto follow-up reminders for non-responding vendors
- Attach technical drawings and PDFs to RFQs

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Supabase (PostgreSQL + Auth)
- Gemini AI (RFQ parsing)
- Resend (email dispatch)
- Tailwind CSS

## Status

Currently in beta. Working with initial manufacturers
in the Noida/NCR region.

## Local Development

```bash
pnpm install
pnpm dev
```

Requires environment variables - see `.env.example`.

## Contact

Built by Jatin Kumar - [@jatin02k](https://x.com/jatin02k)
