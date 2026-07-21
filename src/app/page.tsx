import Link from 'next/link'
import IndustrialBackground from '@/components/landing/IndustrialBackground'

export default function Home() {
  return (
    <div className="relative min-h-screen font-body text-[#FFFFFF] antialiased selection:bg-accent selection:text-white">
      {/* Industrial Rugged Background with Pipelines, Bolts & Center Gears */}
      <IndustrialBackground />

      {/* 1. NAVBAR - Glass Header */}
      <nav className="border-b border-[#2D313E] bg-[#121316]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-xl tracking-tight text-white">
              QuoteFlow
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider bg-[#222530] border border-[#374151] px-2 py-0.5 rounded-sm text-[#E5E7EB]">
              v1.0 (Beta)
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link 
              href="/login" 
              className="text-sm font-medium text-[#E5E7EB] hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/login?signup=true" 
              className="bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors border border-accent-hover shadow-md"
              style={{ borderRadius: '6px' }}
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <header className="border-b border-[#2D313E]/50 bg-[#121316]/50 backdrop-blur-xs py-20 lg:py-28">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase font-heading font-bold tracking-widest text-[#F59E0B] mb-4 block">
            B2B Procurement Automation
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight drop-shadow-md">
            Vendor quotes. Compared. <br className="hidden sm:inline" />In minutes.
          </h1>
          <p className="text-lg sm:text-xl text-[#E5E7EB] max-w-2xl mx-auto mb-10 leading-relaxed font-body font-normal">
            Stop managing RFQs over email and Excel. Upload your requirement once, dispatch to all vendors in one click, and see quotes auto-generate into a unified dashboard.
          </p>
          <div className="flex flex-col items-center justify-center gap-3">
            <Link 
              href="/login?signup=true" 
              className="bg-accent hover:bg-accent-hover text-white text-base font-bold px-8 py-3.5 rounded-md border border-accent-hover transition-colors w-full sm:w-auto shadow-xl"
              style={{ borderRadius: '6px' }}
            >
              Start Free — No Credit Card Required
            </Link>
            <span className="text-xs font-mono text-[#D1D5DB] bg-[#1F2430]/90 px-3.5 py-1.5 rounded-sm border border-[#374151]">
              Free plan includes 3 RFQs/month • Max 10 vendors
            </span>
          </div>
        </div>
      </header>

      {/* 3. HOW IT WORKS - Glass Cards for Crisp Reading */}
      <section className="py-20 border-b border-[#2D313E]/50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-heading font-bold tracking-widest text-[#F59E0B] mb-2 block">
              Workflow Engine
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-white">
              How QuoteFlow Automates Your RFQ Cycle
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="border border-[#333742] p-6 bg-[#16181F]/85 hover:bg-[#1C1F29]/90 backdrop-blur-md shadow-2xl transition-all flex flex-col justify-between" style={{ borderRadius: '6px' }}>
              <div>
                <span className="font-mono text-sm text-[#F59E0B] font-bold block mb-4">STEP 01 // PARSE</span>
                <h3 className="font-heading text-xl font-bold text-white mb-3">
                  1. Upload your requirement
                </h3>
                <p className="text-sm text-[#E5E7EB] leading-relaxed">
                  Paste raw requirement text or upload a drawing PDF. Our built-in AI model parses it instantly into product lines, quantities, and strict technical specs.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="border border-[#333742] p-6 bg-[#16181F]/85 hover:bg-[#1C1F29]/90 backdrop-blur-md shadow-2xl transition-all flex flex-col justify-between" style={{ borderRadius: '6px' }}>
              <div>
                <span className="font-mono text-sm text-[#F59E0B] font-bold block mb-4">STEP 02 // DISPATCH</span>
                <h3 className="font-heading text-xl font-bold text-white mb-3">
                  2. We email all your vendors
                </h3>
                <p className="text-sm text-[#E5E7EB] leading-relaxed">
                  Select matching vendors from your directory. We send professional emails containing unique, secure quote-submission links that bypass login barriers.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="border border-[#333742] p-6 bg-[#16181F]/85 hover:bg-[#1C1F29]/90 backdrop-blur-md shadow-2xl transition-all flex flex-col justify-between" style={{ borderRadius: '6px' }}>
              <div>
                <span className="font-mono text-sm text-[#F59E0B] font-bold block mb-4">STEP 03 // COMPARE</span>
                <h3 className="font-heading text-xl font-bold text-white mb-3">
                  3. Compare quotes in one table
                </h3>
                <p className="text-sm text-[#E5E7EB] leading-relaxed">
                  As suppliers fill quotes on their phones or laptops, QuoteFlow calculates total costs and organizes them into a clean matrix, auto-highlighting optimal matches.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROBLEM SECTION */}
      <section className="py-20 border-b border-[#2D313E]/50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-heading font-bold tracking-widest text-status-warning mb-2 block">
              Operational Realities
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-white">
              Still doing this the hard way?
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* The Old Way */}
            <div className="border border-status-error/50 bg-[#16181F]/85 backdrop-blur-md p-8 flex flex-col justify-between shadow-2xl" style={{ borderRadius: '6px' }}>
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#374151] mb-6">
                  <h3 className="font-heading text-lg font-extrabold text-status-error uppercase tracking-wider">
                    The Old Way
                  </h3>
                  <span className="text-xs font-mono text-status-error bg-status-error-bg/30 px-2.5 py-1 rounded-sm border border-status-error/50 font-bold">
                    3 Days Wasted
                  </span>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-status-error shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-[#E5E7EB] font-medium">Emailing 20-30 suppliers one by one with heavy attachments.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-status-error shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-[#E5E7EB] font-medium">Sifting through WhatsApp threads and scattered inbox replies.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-status-error shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-[#E5E7EB] font-medium">Copy-pasting prices, lead times, and terms manually into Excel.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-status-error shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-[#E5E7EB] font-medium">No historical data logs; pricing trends are locked in old spreadsheets.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-[#374151] bg-[#111318] -mx-8 -mb-8 p-6 text-center" style={{ borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px' }}>
                <span className="text-xs font-mono text-[#D1D5DB]">RESULT: High friction, delayed orders, lost negotiation leverage.</span>
              </div>
            </div>

            {/* The QuoteFlow Way */}
            <div className="border-2 border-accent bg-[#16181F]/90 backdrop-blur-md p-8 flex flex-col justify-between shadow-2xl" style={{ borderRadius: '6px' }}>
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#374151] mb-6">
                  <h3 className="font-heading text-lg font-extrabold text-[#F59E0B] uppercase tracking-wider">
                    With QuoteFlow
                  </h3>
                  <span className="text-xs font-mono text-status-success bg-status-success-bg/30 px-2.5 py-1 rounded-sm border border-status-success/50 font-bold">
                    20 Minutes Total
                  </span>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-status-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-white font-semibold">Single upload; requirements parsed and structured instantly.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-status-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-white font-semibold">One-click broadcast reaches 30+ vendors on email and mobile.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-status-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-white font-semibold">Unified dashboard automatically highlights lowest unit costs.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-status-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-white font-semibold">Auto follow-ups nag non-responders while you focus on production.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-accent/40 bg-[#1F2430] -mx-8 -mb-8 p-6 text-center" style={{ borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px' }}>
                <span className="text-xs font-mono text-[#F59E0B] font-bold">RESULT: Maximized margins, clear supplier audit logs.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section className="py-20 border-b border-[#2D313E]/50 bg-transparent">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-heading font-bold tracking-widest text-[#F59E0B] mb-2 block">
              Transparent Pricing
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-white">
              Simple plans for growing factories
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Free Tier */}
            <div className="border border-[#333742] bg-[#16181F]/85 backdrop-blur-md p-8 flex flex-col justify-between shadow-2xl" style={{ borderRadius: '6px' }}>
              <div>
                <div className="mb-6">
                  <h3 className="font-heading text-lg font-bold text-[#E5E7EB] uppercase tracking-wider">Free</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="font-mono text-4xl font-extrabold tracking-tight text-white">₹0</span>
                    <span className="ml-1 text-sm text-[#D1D5DB]">/ forever</span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] mt-2 font-mono">Suitable for testing or basic purchasing cycles</p>
                </div>
                
                <ul className="space-y-3 pt-6 border-t border-[#374151]">
                  <li className="flex items-center gap-2.5 text-sm text-[#E5E7EB]">
                    <span className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full"></span>
                    <span>3 RFQs per month</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-[#E5E7EB]">
                    <span className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full"></span>
                    <span>Up to 10 active vendors</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-[#E5E7EB]">
                    <span className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full"></span>
                    <span>Standard comparison matrix</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-[#E5E7EB]">
                    <span className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full"></span>
                    <span>Email dispatch notifications</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link 
                  href="/login?signup=true" 
                  className="block w-full text-center bg-[#252834] hover:bg-[#2F3342] text-white font-bold py-3 border border-[#374151] transition-colors shadow-md"
                  style={{ borderRadius: '6px' }}
                >
                  Start Free
                </Link>
              </div>
            </div>

            {/* Pro Tier */}
            <div className="border-2 border-accent bg-[#16181F]/90 backdrop-blur-md p-8 flex flex-col justify-between relative shadow-2xl" style={{ borderRadius: '6px' }}>
              <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-accent text-white px-3 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-sm font-bold border border-accent-hover shadow-md">
                Recommended
              </div>
              <div>
                <div className="mb-6">
                  <h3 className="font-heading text-lg font-bold text-[#F59E0B] uppercase tracking-wider">Pro</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="font-mono text-4xl font-extrabold tracking-tight text-white">₹xxx</span>
                    <span className="ml-1 text-sm text-[#D1D5DB]">/ month</span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] mt-2 font-mono">For factories running weekly procurement cycles</p>
                </div>
                
                <ul className="space-y-3 pt-6 border-t border-[#374151]">
                  <li className="flex items-center gap-2.5 text-sm text-[#E5E7EB]">
                    <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full"></span>
                    <span className="font-bold text-white">Unlimited RFQ dispatches</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-[#E5E7EB]">
                    <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full"></span>
                    <span className="font-bold text-white">Unlimited vendor directory</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-[#E5E7EB]">
                    <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full"></span>
                    <span>AI parsing (PDF & unstructured text)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-[#E5E7EB]">
                    <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full"></span>
                    <span>AI-powered vendor match recommendations</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-[#E5E7EB]">
                    <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full"></span>
                    <span>Automated follow-ups (48h reminder triggers)</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link 
                  href="/login?signup=true&plan=pro" 
                  className="block w-full text-center bg-accent hover:bg-accent-hover text-white font-bold py-3 border border-accent-hover transition-colors shadow-lg"
                  style={{ borderRadius: '6px' }}
                >
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 border border-[#333742] bg-[#16181F]/90 backdrop-blur-md text-center shadow-lg" style={{ borderRadius: '6px' }}>
            <span className="text-xs sm:text-sm text-[#E5E7EB] font-body">
              ⚡ <strong>Founding Member Discount:</strong> Get Pro for only <strong>₹xxx/month</strong>. Limited to the first 10 customers. Locked in forever.
            </span>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-[#121316]/95 border-t border-[#2D313E] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="font-heading font-bold text-lg tracking-tight text-white">
              QuoteFlow
            </span>
            <p className="text-xs text-[#D1D5DB] mt-1 font-body">
              An RFQ Engine Built for Indian Manufacturers.
            </p>
          </div>
          <div className="text-center md:text-right">
            <span className="text-xs font-mono text-[#9CA3AF]">
              Made in Noida, India.
            </span>
            <p className="text-[10px] text-[#6B7280] mt-1 font-mono">
              © {new Date().getFullYear()} QuoteFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
