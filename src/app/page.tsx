import React from 'react'
import Link from 'next/link'
import InteractiveDemo from '@/components/landing/InteractiveDemo'

export const metadata = {
  title: 'RFQDeck // B2B Procure-to-Pay Engine for Indian Manufacturers',
  description: 'Automate raw material sourcing, dispatch multi-vendor RFQs with single-use tokens, and compare landed costs in unified matrices.',
}

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-base font-body text-text-primary antialiased selection:bg-accent selection:text-white">
      {/* 1. TOP NAVIGATION BAR */}
      <nav className="border-b border-border-default bg-bg-base sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-heading font-extrabold text-xl tracking-tight text-text-primary">
              RFQDeck
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider bg-bg-sunken border border-border-default px-2 py-0.5 rounded-sm text-text-secondary">
              v1.0 // B2B PROCURE-TO-PAY ENGINE
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="#how-it-works"
              className="hidden md:inline-block text-xs font-mono text-text-secondary hover:text-text-primary transition-colors uppercase tracking-wide"
            >
              Workflow
            </Link>
            <Link
              href="#matrix-demo"
              className="hidden md:inline-block text-xs font-mono text-text-secondary hover:text-text-primary transition-colors uppercase tracking-wide"
            >
              Live Demo
            </Link>
            <Link
              href="#pricing"
              className="hidden md:inline-block text-xs font-mono text-text-secondary hover:text-text-primary transition-colors uppercase tracking-wide"
            >
              Pricing
            </Link>
            <Link 
              href="/login" 
              className="text-xs font-mono text-text-secondary hover:text-text-primary transition-colors border border-border-default hover:border-border-strong px-3 py-1.5 rounded-sm bg-bg-surface"
            >
              Sign In
            </Link>
            <Link 
              href="/login?signup=true" 
              className="bg-accent hover:bg-accent-hover text-white text-xs font-mono font-bold px-4 py-2 rounded-md transition-colors border border-accent-hover"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION - Fills 100% of the viewport height below top navbar */}
      <header className="border-b border-border-default bg-bg-base min-h-[calc(100vh-64px)] flex items-center py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Hero Text & Call to Actions */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider bg-accent-light border border-accent-border px-3 py-1 rounded-sm inline-block mb-3">
                  INDUSTRIAL B2B PROCUREMENT ENGINE
                </span>
                <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
                  Compare Vendor Quotes in Minutes.
                </h1>
              </div>

              <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-normal">
                Replace endless email chains, WhatsApp messages and manual Excel data entry. Upload your engineering spec once, dispatch to 30+ suppliers and evaluate side-by-side total landed cost matrices automatically.
              </p>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap items-center gap-3">
                  <Link 
                    href="/login?signup=true" 
                    className="bg-accent hover:bg-accent-hover text-white text-sm sm:text-base font-bold px-6 py-3 rounded-md border border-accent-hover transition-colors"
                  >
                    Start Free — 3 RFQs Included
                  </Link>
                  <Link 
                    href="#matrix-demo" 
                    className="bg-bg-surface hover:bg-bg-sunken text-text-primary text-sm sm:text-base font-medium px-6 py-3 rounded-md border border-border-strong transition-colors"
                  >
                    View Live Matrix
                  </Link>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-text-muted pt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success inline-block"></span>
                  <span>No credit card required</span>
                  <span>•</span>
                  <span>Zero supplier login friction</span>
                  <span>•</span>
                  <span>Made for Indian SMEs</span>
                </div>
              </div>

              {/* Key Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border-subtle font-mono text-xs">
                <div>
                  <span className="block text-text-muted text-[10px] uppercase">AVG TIME SAVED</span>
                  <span className="font-bold text-text-primary text-sm sm:text-base">85% Faster</span>
                </div>
                <div>
                  <span className="block text-text-muted text-[10px] uppercase">SUPPLIER ACCESS</span>
                  <span className="font-bold text-text-primary text-sm sm:text-base">0 Passwords</span>
                </div>
                <div>
                  <span className="block text-text-muted text-[10px] uppercase">LANDED COST MATH</span>
                  <span className="font-bold text-text-primary text-sm sm:text-base">100% Auto</span>
                </div>
              </div>
            </div>

            {/* Right Side: Interactive Technical System Preview */}
            <div id="matrix-demo" className="lg:col-span-6 w-full">
              <InteractiveDemo />
            </div>

          </div>
        </div>
      </header>

      {/* 3. OPERATIONAL REALITY COMPARISON (BEFORE vs AFTER) */}
      <section className="py-16 border-b border-border-default bg-bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-mono text-xs font-bold text-text-muted uppercase tracking-wider block mb-1">
              OPERATIONAL COMPARISON
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
              Built for Factory Owners & Procurement Heads
            </h2>
            <p className="text-sm text-text-secondary mt-2">
              Designed specifically for metal fabricators, auto component units, plastic molders, and machinery builders in Noida, Pune, Ludhiana, Rajkot & Gujarat.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* The Manual Way */}
            <div className="bg-status-error-bg/30 border border-status-error/40 rounded-md p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-status-error/30 mb-5">
                  <h3 className="font-heading text-base font-bold text-status-error uppercase tracking-wider flex items-center gap-2">
                    <span>The Manual RFQ Chaos</span>
                  </h3>
                  <span className="text-[11px] font-mono text-status-error bg-status-error-bg px-2.5 py-0.5 rounded-sm border border-status-error/40 font-bold">
                    3 DAYS WASTED PER RFQ
                  </span>
                </div>

                <ul className="space-y-3.5 text-xs sm:text-sm text-text-secondary font-body">
                  <li className="flex items-start gap-2.5">
                    <span className="text-status-error font-bold font-mono mt-0.5">✕</span>
                    <span>Emailing 20–30 vendors individually with heavy drawing PDF attachments.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-status-error font-bold font-mono mt-0.5">✕</span>
                    <span>Sifting through messy WhatsApp threads and phone notes to find quote prices.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-status-error font-bold font-mono mt-0.5">✕</span>
                    <span>Manually copy-pasting unit rates, lead times, and payment terms into Excel.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-status-error font-bold font-mono mt-0.5">✕</span>
                    <span>Zero historical price audit trail; losing negotiation leverage with raw material suppliers.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-status-error/30 text-xs font-mono text-status-error font-bold">
                RESULT: Delayed production schedules & hidden margin leakage.
              </div>
            </div>

            {/* The RFQDeck Way */}
            <div className="bg-accent-light border-2 border-accent rounded-md p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-accent-border mb-5">
                  <h3 className="font-heading text-base font-bold text-accent uppercase tracking-wider flex items-center gap-2">
                    <span>With RFQDeck Engine</span>
                  </h3>
                  <span className="text-[11px] font-mono text-status-success bg-status-success-bg px-2.5 py-0.5 rounded-sm border border-status-success/40 font-bold">
                    20 MINUTES TOTAL
                  </span>
                </div>

                <ul className="space-y-3.5 text-xs sm:text-sm text-text-primary font-body">
                  <li className="flex items-start gap-2.5">
                    <span className="text-status-success font-bold font-mono mt-0.5">✓</span>
                    <span className="font-semibold">Single upload:</span> AI parses specifications into structured product line items automatically.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-status-success font-bold font-mono mt-0.5">✓</span>
                    <span className="font-semibold">1-Click Token Broadcast:</span> Emails passwordless access links directly to targeted suppliers.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-status-success font-bold font-mono mt-0.5">✓</span>
                    <span className="font-semibold">Side-by-Side Matrix:</span> Computes Total Cost = Unit Price × Quantity and highlights optimal options.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-status-success font-bold font-mono mt-0.5">✓</span>
                    <span className="font-semibold">Automated Reminders:</span> Follows up with pending suppliers while your plant stays focused on production.
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-accent-border text-xs font-mono text-accent font-bold">
                RESULT: Maximized procurement margins & full audit accountability.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (3-STEP WORKFLOW ENGINE) */}
      <section id="how-it-works" className="py-16 border-b border-border-default bg-bg-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider block mb-1">
              WORKFLOW ARCHITECTURE
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
              How RFQDeck Automates Your Procurement Cycle
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-bg-surface border border-border-default p-6 rounded-md space-y-4 hover:border-border-strong transition-colors">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <span className="font-mono text-xs font-bold text-accent">STEP 01 // PARSE</span>
                <span className="font-mono text-[10px] bg-bg-sunken border border-border-default px-2 py-0.5 rounded-sm text-text-muted">
                  INTAKE
                </span>
              </div>
              <h3 className="font-heading font-bold text-lg text-text-primary">
                1. Upload Requirement
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-body">
                Paste raw requirement text or upload a drawing PDF. The built-in AI parser extracts product categories, quantities, unit specs, and target lead times into clean line items.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-bg-surface border border-border-default p-6 rounded-md space-y-4 hover:border-border-strong transition-colors">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <span className="font-mono text-xs font-bold text-accent">STEP 02 // DISPATCH</span>
                <span className="font-mono text-[10px] bg-bg-sunken border border-border-default px-2 py-0.5 rounded-sm text-text-muted">
                  TOKEN LINKS
                </span>
              </div>
              <h3 className="font-heading font-bold text-lg text-text-primary">
                2. Passwordless Vendor Dispatch
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-body">
                Select targeted suppliers from your directory. RFQDeck dispatches professional emails with isolated token links. Suppliers submit prices directly on mobile or desktop without logging in.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-bg-surface border border-border-default p-6 rounded-md space-y-4 hover:border-border-strong transition-colors">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <span className="font-mono text-xs font-bold text-accent">STEP 03 // COMPARE</span>
                <span className="font-mono text-[10px] bg-bg-sunken border border-border-default px-2 py-0.5 rounded-sm text-text-muted">
                  LANDED COST
                </span>
              </div>
              <h3 className="font-heading font-bold text-lg text-text-primary">
                3. Compare Total Landed Costs
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-body">
                As supplier responses arrive, RFQDeck automatically calculates total order values, formats payment terms (Advance, Net 30, Net 45, Net 60), and highlights the optimal supplier option.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INDUSTRIAL FEATURES GRID */}
      <section className="py-16 border-b border-border-default bg-bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-mono text-xs font-bold text-text-muted uppercase tracking-wider block mb-1">
              SYSTEM CAPABILITIES
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
              Engineered for Industrial Hardware Precision
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-bg-base border border-border-default p-5 rounded-md space-y-2">
              <div className="font-mono text-xs text-accent font-bold">01 // ZERO SUPPLIER FRICTION</div>
              <h4 className="font-heading font-bold text-base text-text-primary">Passwordless Quote Forms</h4>
              <p className="text-xs text-text-secondary leading-relaxed font-body">
                Suppliers respond in under 60 seconds via secure token links on WhatsApp or email. No account creation needed.
              </p>
            </div>

            <div className="bg-bg-base border border-border-default p-5 rounded-md space-y-2">
              <div className="font-mono text-xs text-accent font-bold">02 // SECURE ISOLATION</div>
              <div className="font-heading font-bold text-base text-text-primary">Multi-Tenant Vendor Safety</div>
              <p className="text-xs text-text-secondary leading-relaxed font-body">
                Strict data isolation ensures competing suppliers never see each other's quotes or identities.
              </p>
            </div>

            <div className="bg-bg-base border border-border-default p-5 rounded-md space-y-2">
              <div className="font-mono text-xs text-accent font-bold">03 // LANDED COST CALCULATOR</div>
              <div className="font-heading font-bold text-base text-text-primary">Total Price & Terms Math</div>
              <p className="text-xs text-text-secondary leading-relaxed font-body">
                Automatically calculates order totals (`Unit Rate × Quantity`) alongside credit terms (`Advance`, `Net 30`, `Net 45`, `Net 60`).
              </p>
            </div>

            <div className="bg-bg-base border border-border-default p-5 rounded-md space-y-2">
              <div className="font-mono text-xs text-accent font-bold">04 // CATEGORY DIRECTORY</div>
              <div className="font-heading font-bold text-base text-text-primary">Manufacturing Vendor Profiles</div>
              <p className="text-xs text-text-secondary leading-relaxed font-body">
                Tag suppliers by operational category: Raw Material, Electrical, Components, Chemical, Machinery, Packaging.
              </p>
            </div>

            <div className="bg-bg-base border border-border-default p-5 rounded-md space-y-2">
              <div className="font-mono text-xs text-accent font-bold">05 // FOLLOW-UP TRIGGERS</div>
              <div className="font-heading font-bold text-base text-text-primary">Automated Reminders</div>
              <p className="text-xs text-text-secondary leading-relaxed font-body">
                System automatically sends subtle reminder triggers to vendors who haven't responded within 24–48 hours.
              </p>
            </div>

            <div className="bg-bg-base border border-border-default p-5 rounded-md space-y-2">
              <div className="font-mono text-xs text-accent font-bold">06 // AUDIT ARCHIVE</div>
              <div className="font-heading font-bold text-base text-text-primary">Historical Quotation Logs</div>
              <p className="text-xs text-text-secondary leading-relaxed font-body">
                Access past supplier quotes anytime to track raw material price fluctuations and leverage annual contract renewals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRANSPARENT PRICING TIERS */}
      <section id="pricing" className="py-16 border-b border-border-default bg-bg-base">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider block mb-1">
              TRANSPARENT PRICING
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
              Simple Plans for Growing Indian Factories
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              No hidden fees. Start free and upgrade when your procurement volume scales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Free Tier */}
            <div className="bg-bg-surface border border-border-default p-6 sm:p-8 rounded-md flex flex-col justify-between space-y-6">
              <div>
                <div className="mb-6 pb-6 border-b border-border-subtle">
                  <h3 className="font-heading font-bold text-base text-text-primary uppercase tracking-wider">Free Plan</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="font-mono text-4xl font-extrabold text-text-primary">₹0</span>
                    <span className="text-xs text-text-muted font-mono">/ forever</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-2 font-mono">Ideal for testing or initial purchasing runs</p>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-text-secondary font-body">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-border-strong"></span>
                    <span>3 Active RFQ Dispatches / month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-border-strong"></span>
                    <span>Up to 10 Vendors in Directory</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-border-strong"></span>
                    <span>Full Comparison Matrix Engine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-border-strong"></span>
                    <span>Passwordless Token Link Dispatches</span>
                  </li>
                </ul>
              </div>

              <div>
                <Link 
                  href="/login?signup=true" 
                  className="block w-full text-center bg-bg-base hover:bg-bg-sunken text-text-primary font-mono text-xs font-bold py-3 border border-border-strong rounded-md transition-colors"
                >
                  Start Free Account
                </Link>
              </div>
            </div>

            {/* Pro Tier */}
            <div className="bg-accent-light border-2 border-accent p-6 sm:p-8 rounded-md flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-3 right-6 bg-accent text-white px-3 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-sm font-bold border border-accent-hover">
                RECOMMENDED FOR FACTORIES
              </div>

              <div>
                <div className="mb-6 pb-6 border-b border-accent-border">
                  <h3 className="font-heading font-bold text-base text-accent uppercase tracking-wider">Pro Plan</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="font-mono text-4xl font-extrabold text-text-primary">₹1,999</span>
                    <span className="text-xs text-text-muted font-mono">/ month</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-2 font-mono">For plants running weekly procurement cycles</p>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-text-primary font-body">
                  <li className="flex items-center gap-2 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <span>Unlimited RFQs & Vendor Dispatches</span>
                  </li>
                  <li className="flex items-center gap-2 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <span>Unlimited Vendor Directory Management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <span>AI Drawing PDF & Text Specification Parsing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <span>Gemini AI Vendor Match Recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <span>Automated Vendor Follow-up Reminders</span>
                  </li>
                </ul>
              </div>

              <div>
                <Link 
                  href="/login?signup=true&plan=pro" 
                  className="block w-full text-center bg-accent hover:bg-accent-hover text-white font-mono text-xs font-bold py-3 border border-accent-hover rounded-md transition-colors"
                >
                  Upgrade to Pro Tier
                </Link>
              </div>
            </div>
          </div>

          {/* Founding Callout */}
          <div className="mt-8 p-4 bg-bg-surface border border-border-default rounded-md text-center text-xs font-mono text-text-secondary">
            ⚡ <strong className="text-text-primary">Founding Tier Offer:</strong> First 10 Indian manufacturing units lock in Pro features at <strong className="text-accent">₹999/month</strong> forever.
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 border-b border-border-default bg-bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-mono text-xs font-bold text-text-muted uppercase tracking-wider block mb-1">
              SECURITY & FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-bg-base border border-border-default p-5 rounded-md space-y-2">
              <h4 className="font-heading font-bold text-sm sm:text-base text-text-primary flex items-center gap-2">
                <span className="text-accent font-mono">Q.</span>
                <span>Do our vendors need to create an account or install software?</span>
              </h4>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-body pl-5">
                No. Vendors receive a single-use token URL via email. They open the link on mobile or desktop and submit unit rates, lead times, and payment terms in seconds without any account setup.
              </p>
            </div>

            <div className="bg-bg-base border border-border-default p-5 rounded-md space-y-2">
              <h4 className="font-heading font-bold text-sm sm:text-base text-text-primary flex items-center gap-2">
                <span className="text-accent font-mono">Q.</span>
                <span>Can competing suppliers see each other's quotes or identities?</span>
              </h4>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-body pl-5">
                Never. RFQDeck enforces strict multi-tenant supplier isolation. Each token link is isolated so suppliers only see the items requested and can never access competitor identities or pricing.
              </p>
            </div>

            <div className="bg-bg-base border border-border-default p-5 rounded-md space-y-2">
              <h4 className="font-heading font-bold text-sm sm:text-base text-text-primary flex items-center gap-2">
                <span className="text-accent font-mono">Q.</span>
                <span>How does the AI PDF & engineering spec parser work?</span>
              </h4>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-body pl-5">
                Our embedded Gemini AI parses raw text, table rows, and drawing PDFs to extract part numbers, raw materials (e.g. SS 304, MS Plate, Brass), quantities, and target lead times automatically.
              </p>
            </div>

            <div className="bg-bg-base border border-border-default p-5 rounded-md space-y-2">
              <h4 className="font-heading font-bold text-sm sm:text-base text-text-primary flex items-center gap-2">
                <span className="text-accent font-mono">Q.</span>
                <span>How is landed cost calculated across different payment terms?</span>
              </h4>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-body pl-5">
                RFQDeck scales unit pricing by requested RFQ quantities (`Total Cost = Unit Rate × Quantity`) and displays payment terms (`Advance`, `Net 30`, `Net 45`, `Net 60`) side-by-side for quick financial comparison.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION BANNER */}
      <section className="py-16 bg-bg-base border-b border-border-default">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="bg-bg-sunken border border-border-strong p-8 sm:p-12 rounded-md space-y-6">
            <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider bg-accent-light border border-accent-border px-3 py-1 rounded-sm inline-block">
              READY TO DISPATCH YOUR NEXT RFQ?
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary">
              Eliminate Manual RFQ Friction Today
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto">
              Join Indian manufacturing teams in Noida, Pune, Ludhiana, and Rajkot saving hours on every raw material procurement cycle.
            </p>

            <div>
              <Link 
                href="/login?signup=true" 
                className="inline-block bg-accent hover:bg-accent-hover text-white text-sm sm:text-base font-mono font-bold px-8 py-3.5 rounded-md border border-accent-hover transition-colors"
              >
                Create Free Account — Start Instantly
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-bg-sunken border-t border-border-default py-10 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <span className="font-heading font-extrabold text-base text-text-primary tracking-tight">
              RFQDeck
            </span>
            <p className="text-text-muted font-body text-xs">
              Industrial Procure-to-Pay Engine for Indian SME Manufacturers
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-text-secondary">
            <Link href="#how-it-works" className="hover:text-text-primary transition-colors">
              Workflow
            </Link>
            <Link href="#matrix-demo" className="hover:text-text-primary transition-colors">
              Live Demo
            </Link>
            <Link href="#pricing" className="hover:text-text-primary transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="hover:text-text-primary transition-colors">
              Sign In
            </Link>
          </div>

          <div className="text-center md:text-right space-y-1 text-text-muted">
            <div>Built for Indian SMEs • Noida, UP, India</div>
            <div className="text-[10px]">
              © {new Date().getFullYear()} RFQDeck. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
