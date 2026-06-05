---
trigger: always_on
---

# TECH STACK, DATA ARCHITECTURE, & COMPILER CONSTRAINTS

## I. Core Framework Environment
- **Runtime Environment:** Next.js 15+ (Production Stable) utilizing the modular App Router and React 19 hooks.
- **Language Compiler:** TypeScript configured under strict parsing mode definitions globally.
- **Storage Layer:** Supabase Managed PostgreSQL Instance interacting via Prisma ORM integrations.
- **Styling Architecture:** Utility-first Tailwind CSS syncing tightly with customized shadcn/ui components.

## II. Relational Database Writing Constraints
- **Mutation Pattern Execution:** All persistence layer operations (database inserts, updates, and deletes) must process securely inside Next.js Server Actions. Direct pipeline invocations from client-side component loops are forbidden.
- **Security Validation Checks:** Every Server Action intercept must validate user authentication sessions and context company IDs to ensure total cross-company isolation before processing database writes.
- **Input Validation Guardrails:** Inbound network bodies and state payloads must register schema-level parsing checks using `Zod` before touching database queries.

## III. Component Configuration
- Avoid compiling raw custom color declarations inside layout styles. Code elements must explicitly call your customized semantic color classes (`bg-bg-base`, `border-border-strong`, `text-text-primary`, `bg-accent-DEFAULT`).