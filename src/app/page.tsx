import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-base font-body text-text-primary antialiased">
      {/* 1. NAVBAR */}
      <nav className="border-b border-border-default bg-bg-base sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-xl tracking-tight text-text-primary">
              QuoteFlow
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider bg-bg-sunken border border-border-default px-1.5 py-0.5 rounded-sm text-text-secondary">
              v1.0 (Beta)
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link 
              href="/login" 
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/login?signup=true" 
              className="bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-2 rounded-md transition-colors border border-accent-hover"
              style={{ borderRadius: '6px' }}
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO */}
      <header className="border-b border-border-default bg-bg-surface py-20 lg:py-28">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase font-heading font-semibold tracking-widest text-accent mb-4 block">
            B2B Procurement Automation
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary mb-6 leading-tight">
            Vendor quotes. Compared. <br className="hidden sm:inline" />In minutes.
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed font-body">
            Stop managing RFQs over email and Excel. Upload your requirement once, dispatch to all vendors in one click, and see quotes auto-generate into a unified dashboard.
          </p>
          <div className="flex flex-col items-center justify-center gap-3">
            <Link 
              href="/login?signup=true" 
              className="bg-accent hover:bg-accent-hover text-white text-base font-semibold px-8 py-3.5 rounded-md border border-accent-hover transition-colors w-full sm:w-auto"
              style={{ borderRadius: '6px' }}
            >
              Start Free — No Credit Card Required
            </Link>
            <span className="text-xs font-mono text-text-muted">
              Free plan includes 3 RFQs/month • Max 10 vendors
            </span>
          </div>
        </div>
      </header>

      {/* 3. HOW IT WORKS */}
      <section className="py-20 border-b border-border-default bg-bg-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-heading font-semibold tracking-widest text-text-muted mb-2 block">
              Workflow Engine
            </span>
            <h2 className="font-heading text-3xl font-bold text-text-primary">
              How QuoteFlow Automates Your RFQ Cycle
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="border border-border-default p-6 bg-bg-surface flex flex-col justify-between" style={{ borderRadius: '6px' }}>
              <div>
                <span className="font-mono text-sm text-accent font-semibold block mb-4">STEP 01 // PARSE</span>
                <h3 className="font-heading text-lg font-bold text-text-primary mb-3">
                  1. Upload your requirement
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Paste raw requirement text or upload a drawing PDF. Our built-in AI model parses it instantly into product lines, quantities, and strict technical specs.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="border border-border-default p-6 bg-bg-surface flex flex-col justify-between" style={{ borderRadius: '6px' }}>
              <div>
                <span className="font-mono text-sm text-accent font-semibold block mb-4">STEP 02 // DISPATCH</span>
                <h3 className="font-heading text-lg font-bold text-text-primary mb-3">
                  2. We email all your vendors
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Select matching vendors from your directory. We send professional emails containing unique, secure quote-submission links that bypass login barriers.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="border border-border-default p-6 bg-bg-surface flex flex-col justify-between" style={{ borderRadius: '6px' }}>
              <div>
                <span className="font-mono text-sm text-accent font-semibold block mb-4">STEP 03 // COMPARE</span>
                <h3 className="font-heading text-lg font-bold text-text-primary mb-3">
                  3. Compare quotes in one table
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  As suppliers fill quotes on their phones or laptops, QuoteFlow calculates total costs and organizes them into a clean matrix, auto-highlighting optimal matches.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROBLEM SECTION */}
      <section className="py-20 border-b border-border-default bg-bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-heading font-semibold tracking-widest text-status-warning mb-2 block">
              Operational Realities
            </span>
            <h2 className="font-heading text-3xl font-bold text-text-primary">
              Still doing this the hard way?
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* The Old Way */}
            <div className="border border-border-default bg-bg-base p-8 flex flex-col justify-between" style={{ borderRadius: '6px' }}>
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-6">
                  <h3 className="font-heading text-lg font-bold text-status-error uppercase tracking-wider">
                    The Old Way
                  </h3>
                  <span className="text-xs font-mono text-status-error bg-status-error-bg px-2.5 py-1 rounded-sm border border-status-error/20 font-medium">
                    3 Days Wasted
                  </span>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-status-error shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-text-secondary">Emailing 20-30 suppliers one by one with heavy attachments.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-status-error shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-text-secondary">Sifting through WhatsApp threads and scattered inbox replies.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-status-error shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-text-secondary">Copy-pasting prices, lead times, and terms manually into Excel.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-status-error shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-text-secondary">No historical data logs; pricing trends are locked in old spreadsheets.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-border-subtle bg-bg-sunken -mx-8 -mb-8 p-6 text-center" style={{ borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px' }}>
                <span className="text-xs font-mono text-text-muted">RESULT: High friction, delayed orders, lost negotiation leverage.</span>
              </div>
            </div>

            {/* The QuoteFlow Way */}
            <div className="border-2 border-accent bg-bg-base p-8 flex flex-col justify-between" style={{ borderRadius: '6px' }}>
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-border-default mb-6">
                  <h3 className="font-heading text-lg font-bold text-accent uppercase tracking-wider">
                    With QuoteFlow
                  </h3>
                  <span className="text-xs font-mono text-status-success bg-status-success-bg px-2.5 py-1 rounded-sm border border-status-success/20 font-medium">
                    20 Minutes Total
                  </span>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-status-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-text-secondary font-medium">Single upload; requirements parsed and structured instantly.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-status-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-text-secondary font-medium">One-click broadcast reaches 30+ vendors on email and mobile.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-status-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-text-secondary font-medium">Unified dashboard automatically highlights lowest unit costs.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-status-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-text-secondary font-medium">Auto follow-ups nag non-responders while you focus on production.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-border-default bg-accent-light -mx-8 -mb-8 p-6 text-center" style={{ borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px' }}>
                <span className="text-xs font-mono text-accent font-semibold">RESULT: Maximized margins, clear supplier audit logs.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING */}
      <section className="py-20 border-b border-border-default bg-bg-base">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-heading font-semibold tracking-widest text-accent mb-2 block">
              Transparent Pricing
            </span>
            <h2 className="font-heading text-3xl font-bold text-text-primary">
              Simple plans for growing factories
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Free Tier */}
            <div className="border border-border-default bg-bg-base p-8 flex flex-col justify-between" style={{ borderRadius: '6px' }}>
              <div>
                <div className="mb-6">
                  <h3 className="font-heading text-lg font-bold text-text-secondary uppercase tracking-wider">Free</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="font-mono text-4xl font-semibold tracking-tight text-text-primary">₹0</span>
                    <span className="ml-1 text-sm text-text-muted">/ forever</span>
                  </div>
                  <p className="text-xs text-text-muted mt-2 font-mono">Suitable for testing or basic purchasing cycles</p>
                </div>
                
                <ul className="space-y-3 pt-6 border-t border-border-subtle">
                  <li className="flex items-center gap-2.5 text-sm text-text-secondary">
                    <span className="w-1.5 h-1.5 bg-border-strong rounded-full"></span>
                    <span>3 RFQs per month</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-text-secondary">
                    <span className="w-1.5 h-1.5 bg-border-strong rounded-full"></span>
                    <span>Up to 10 active vendors</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-text-secondary">
                    <span className="w-1.5 h-1.5 bg-border-strong rounded-full"></span>
                    <span>Standard comparison matrix</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-text-secondary">
                    <span className="w-1.5 h-1.5 bg-border-strong rounded-full"></span>
                    <span>Email dispatch notifications</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link 
                  href="/login?signup=true" 
                  className="block w-full text-center bg-bg-surface hover:bg-bg-sunken text-text-primary font-semibold py-3 border border-border-default hover:border-border-strong transition-colors"
                  style={{ borderRadius: '6px' }}
                >
                  Start Free
                </Link>
              </div>
            </div>

            {/* Pro Tier */}
            <div className="border border-accent bg-bg-surface p-8 flex flex-col justify-between relative" style={{ borderRadius: '6px' }}>
              <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-accent text-white px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-sm font-semibold border border-accent-hover">
                Recommended
              </div>
              <div>
                <div className="mb-6">
                  <h3 className="font-heading text-lg font-bold text-accent uppercase tracking-wider">Pro</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="font-mono text-4xl font-semibold tracking-tight text-text-primary">₹999</span>
                    <span className="ml-1 text-sm text-text-muted">/ month</span>
                  </div>
                  <p className="text-xs text-text-muted mt-2 font-mono">For factories running weekly procurement cycles</p>
                </div>
                
                <ul className="space-y-3 pt-6 border-t border-border-default">
                  <li className="flex items-center gap-2.5 text-sm text-text-secondary">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                    <span className="font-medium text-text-primary">Unlimited RFQ dispatches</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-text-secondary">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                    <span className="font-medium text-text-primary">Unlimited vendor directory</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-text-secondary">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                    <span>AI parsing (PDF & unstructured text)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-text-secondary">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                    <span>AI-powered vendor match recommendations</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-text-secondary">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                    <span>Automated follow-ups (48h reminder triggers)</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link 
                  href="/login?signup=true&plan=pro" 
                  className="block w-full text-center bg-accent hover:bg-accent-hover text-white font-semibold py-3 border border-accent-hover transition-colors"
                  style={{ borderRadius: '6px' }}
                >
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 border border-border-default bg-accent-light text-center" style={{ borderRadius: '6px' }}>
            <span className="text-xs sm:text-sm text-text-secondary font-body">
              ⚡ <strong>Founding Member Discount:</strong> Get Pro for only <strong>₹599/month</strong>. Limited to the first 10 customers. Locked in forever.
            </span>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-bg-surface border-t border-border-default py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="font-heading font-bold text-lg tracking-tight text-text-primary">
              QuoteFlow
            </span>
            <p className="text-xs text-text-secondary mt-1 font-body">
              An RFQ Engine Built for Indian Manufacturers.
            </p>
          </div>
          <div className="text-center md:text-right">
            <span className="text-xs font-mono text-text-muted">
              Made in Noida, India.
            </span>
            <p className="text-[10px] text-text-muted mt-1 font-mono">
              © {new Date().getFullYear()} QuoteFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
