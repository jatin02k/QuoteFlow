---
trigger: always_on
---

# MANUFACTURING PROCURE-TO-PAY DOMAIN LOGIC

## I. Relational Domain Entities
1. **Companies (SME Customers):** The account base. Tracks structural parameters like operational payment tiers (`free`, `pro`, `founding`), subscription limits, and ongoing transaction volumes.
2. **Vendors (Suppliers):** Directory profiles mapped under business operational categories (`Raw Material`, `Components`, `Packaging`, `Electrical`, `Chemicals`, `Machinery`, `Other`).
3. **RFQs (Requests for Quote):** Central procurement demands containing structured properties parsed by the AI engine. Formats map strict phase progression variables: `draft` ➔ `sent` ➔ `comparing` ➔ `closed`.
4. **RFQ Vendors (Dispatch Tracking):** Intersection vectors connecting unique RFQs to specific targeted Vendors. Generates single-use access credentials (`token` strings) allowing secure external access without requiring login steps.
5. **Quotes (Vendor Form Response):** Financial and timeline metrics returned by suppliers tracking unit pricing, lead times, specific payment conditions (`Advance`, `Net 30`, `Net 45`, `Net 60`), and expiration dates.

## II. Multi-Tenant Safety & Operational Rules
- **Total Vendor Isolation:** Suppliers parsing details via public routes (`/respond/[token]`) must remain completely insulated from adjacent supplier activity. Leakage of vendor identities or pricing across tokens violates safety compliance rules.
- **Mathematical Total Cost Rules:** Material evaluation modules must dynamically scale unit parameters to compute comprehensive values: 
  `Total Cost = Unit Price * Requested RFQ Quantity`.