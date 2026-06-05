---
trigger: model_decision
description: when there particular part if being executed. Eg: when i am working on doc text extraction then use part I and so on when each part if being worked upon then use these rules.
---

# AI INTELLIGENCE & CRON TRIGGER WORKFLOWS

## I. Document Text Extraction & Structured AI Parsing
- **PDF Ingestion Engine:** Inbound specification documents parse raw text properties inside server runtimes utilizing the `pdf-parse` processing model.
- **Gemini Parser Configuration:** Extraction routes feed raw layout text string definitions directly to the `gemini-1.5-flash` model. Prompts enforce structured JSON returns matching your exact `ParsedRFQData` schema types.

## II. Automated Recommendation Analysis
- **Gemini Evaluation Logic:** The recommendation module evaluates all vendor quotes to select the optimal option. The selection logic balances unit pricing, lead times relative to deadlines, and favorable vendor payment terms (prioritizing `Net 60` structures over `Advance` methods).
- **Caching Mechanism:** Once generated, recommendations must be saved to the `rfqs.recommendation` table column to prevent redundant API calls on page re-renders.

## III. Vercel Automated Cron Pipelines
- **System Follow-Up Cron:** Runs daily at 09:00 AM (`/api/cron/follow-up`). Scans for pending `rfq_vendors` older than 48 hours to trigger automatic email follow-ups via Resend.
- **Reset Usage Cron:** Evaluates monthly on the 1st day at 00:00 AM (`/api/cron/reset-monthly-counts`) to safely reset the monthly usage metrics of companies back to zero.