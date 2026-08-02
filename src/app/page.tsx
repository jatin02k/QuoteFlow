import Link from 'next/link'
import IndustrialBackground from '@/components/landing/IndustrialBackground'

export default function Home() {
  return (
    <div className="relative min-h-screen font-body text-[#FFFFFF] antialiased selection:bg-accent selection:text-white">
      {/* Iron Gray Industrial Background with CAD Gears & Scattered Screws */}
      <IndustrialBackground />

      {/* 1. NAVBAR - Solid Opaque Bar */}
      <nav className="border-b border-white/15 bg-[#1E222A] sticky top-0 z-50 shadow-2xl">
        <div className="w-full px-6 sm:px-12 lg:px-16 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-xl tracking-tight text-white drop-shadow-md">
              RFQPilot
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider bg-white/10 border border-white/20 px-2 py-0.5 rounded-sm text-[#E2E8F0]">
              v1.0 (Beta)
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link 
              href="/login" 
              className="text-sm font-medium text-[#E2E8F0] hover:text-white transition-colors drop-shadow-sm"
            >
              Sign In
            </Link>
            <Link 
              href="/login?signup=true" 
              className="bg-accent hover:bg-accent-hover text-white text-sm font-bold px-4 py-2 rounded-md transition-colors border border-accent-hover shadow-xl"
              style={{ borderRadius: '6px' }}
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION - Full Viewport Height (100vh) & Uncropped Dashboard Image */}
      <header className="border-b border-white/10 bg-transparent relative overflow-hidden min-h-[calc(100vh-64px)] flex items-center py-8 lg:py-0">
        <div className="w-full px-6 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Integrated Hero Core Text */}
            <div className="lg:col-span-5 text-left space-y-6 z-10">
              <span className="text-xs uppercase font-heading font-bold tracking-widest text-[#F59E0B] block drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
                B2B Procurement Automation
              </span>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                Vendor quotes. <br />
                Compared. In minutes.
              </h1>

              <p className="text-base sm:text-lg text-[#E2E8F0] font-body leading-relaxed max-w-xl font-normal drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)]">
                Stop managing RFQs over email and Excel. Upload your requirement once, dispatch to all vendors in one click, and see quotes auto-generate into a unified dashboard.
              </p>

              {/* Action Button & Plan Subtext */}
              <div className="pt-2 space-y-4">
                <div>
                  <Link 
                    href="/login?signup=true" 
                    className="inline-block bg-accent hover:bg-accent-hover text-white text-base sm:text-lg font-bold px-8 py-4 rounded-md border border-accent-hover transition-colors shadow-2xl text-center"
                    style={{ borderRadius: '6px' }}
                  >
                    Start Free — No Credit Card Required
                  </Link>
                </div>
                
                <div className="pt-1">
                  <span className="text-xs font-mono text-[#CBD5E1] bg-[#1E222A]/90 px-4 py-2 rounded border border-[#475569] shadow-lg inline-block">
                    Free plan includes 3 RFQs/month • Max 10 vendors
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side Image: Fully Visible, Uncropped Dashboard Screenshot */}
            <div className="lg:col-span-7 w-full flex items-center justify-end z-10">
              <div className="w-full max-w-3xl bg-[#1E222A]/90 p-2 sm:p-3 border border-[#475569] rounded-xl shadow-2xl">
                <img
                  src="/hero-dashboard.png"
                  alt="RFQPilot Live Vendor Quote Comparison Dashboard"
                  className="w-full h-auto max-h-[78vh] object-contain rounded-lg border border-[#334155]"
                />
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* 3. HOW IT WORKS */}
      <section className="py-20 border-b border-white/10 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-heading font-bold tracking-widest text-[#F59E0B] mb-2 block drop-shadow-md">
              Workflow Engine
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-white drop-shadow-lg">
              How RFQPilot Automates Your RFQ Cycle
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="border border-[#475569] hover:border-accent/60 p-6 bg-[#1E222A]/80 backdrop-blur-xs shadow-2xl transition-all flex flex-col justify-between" style={{ borderRadius: '6px' }}>
              <div>
                <span className="font-mono text-sm text-[#F59E0B] font-bold block mb-4 drop-shadow-sm">STEP 01 // PARSE</span>
                <h3 className="font-heading text-xl font-bold text-white mb-3 drop-shadow-md">
                  1. Upload your requirement
                </h3>
                <p className="text-sm text-[#E2E8F0] leading-relaxed drop-shadow-sm">
                  Paste raw requirement text or upload a drawing PDF. Our built-in AI model parses it instantly into product lines, quantities, and strict technical specs.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="border border-[#475569] hover:border-accent/60 p-6 bg-[#1E222A]/80 backdrop-blur-xs shadow-2xl transition-all flex flex-col justify-between" style={{ borderRadius: '6px' }}>
              <div>
                <span className="font-mono text-sm text-[#F59E0B] font-bold block mb-4 drop-shadow-sm">STEP 02 // DISPATCH</span>
                <h3 className="font-heading text-xl font-bold text-white mb-3 drop-shadow-md">
                  2. We email all your vendors
                </h3>
                <p className="text-sm text-[#E2E8F0] leading-relaxed drop-shadow-sm">
                  Select matching vendors from your directory. We send professional emails containing unique, secure quote-submission links that bypass login barriers.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="border border-[#475569] hover:border-accent/60 p-6 bg-[#1E222A]/80 backdrop-blur-xs shadow-2xl transition-all flex flex-col justify-between" style={{ borderRadius: '6px' }}>
              <div>
                <span className="font-mono text-sm text-[#F59E0B] font-bold block mb-4 drop-shadow-sm">STEP 03 // COMPARE</span>
                <h3 className="font-heading text-xl font-bold text-white mb-3 drop-shadow-md">
                  3. Compare quotes in one table
                </h3>
                <p className="text-sm text-[#E2E8F0] leading-relaxed drop-shadow-sm">
                  As suppliers fill quotes on their phones or laptops, RFQPilot calculates total costs and organizes them into a clean matrix, auto-highlighting optimal matches.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROBLEM SECTION */}
      <section className="py-20 border-b border-white/10 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-heading font-bold tracking-widest text-status-warning mb-2 block drop-shadow-md">
              Operational Realities
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-white drop-shadow-lg">
              Still doing this the hard way?
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* The Old Way */}
            <div className="border border-status-error/50 bg-[#1E222A]/80 backdrop-blur-xs p-8 flex flex-col justify-between shadow-2xl" style={{ borderRadius: '6px' }}>
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/15 mb-6">
                  <h3 className="font-heading text-lg font-extrabold text-status-error uppercase tracking-wider drop-shadow-sm">
                    The Old Way
                  </h3>
                  <span className="text-xs font-mono text-status-error bg-status-error-bg/40 px-2.5 py-1 rounded-sm border border-status-error/50 font-bold">
                    3 Days Wasted
                  </span>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-status-error shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-[#E2E8F0] font-medium drop-shadow-sm">Emailing 20-30 suppliers one by one with heavy attachments.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-status-error shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-[#E2E8F0] font-medium drop-shadow-sm">Sifting through WhatsApp threads and scattered inbox replies.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-status-error shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-[#E2E8F0] font-medium drop-shadow-sm">Copy-pasting prices, lead times, and terms manually into Excel.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-status-error shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-[#E2E8F0] font-medium drop-shadow-sm">No historical data logs; pricing trends are locked in old spreadsheets.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-white/15 bg-transparent -mx-8 -mb-8 p-6 text-center" style={{ borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px' }}>
                <span className="text-xs font-mono text-[#E2E8F0] drop-shadow-sm">RESULT: High friction, delayed orders, lost negotiation leverage.</span>
              </div>
            </div>

            {/* The RFQPilot Way */}
            <div className="border-2 border-accent bg-[#1E222A]/80 backdrop-blur-xs p-8 flex flex-col justify-between shadow-2xl" style={{ borderRadius: '6px' }}>
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/15 mb-6">
                  <h3 className="font-heading text-lg font-extrabold text-[#F59E0B] uppercase tracking-wider drop-shadow-sm">
                    With RFQPilot
                  </h3>
                  <span className="text-xs font-mono text-status-success bg-status-success-bg/40 px-2.5 py-1 rounded-sm border border-status-success/50 font-bold">
                    20 Minutes Total
                  </span>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-status-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-white font-semibold drop-shadow-sm">Single upload; requirements parsed and structured instantly.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-status-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-white font-semibold drop-shadow-sm">One-click broadcast reaches 30+ vendors on email and mobile.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-status-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-white font-semibold drop-shadow-sm">Unified dashboard automatically highlights lowest unit costs.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-status-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-white font-semibold drop-shadow-sm">Auto follow-ups nag non-responders while you focus on production.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-accent/40 bg-transparent -mx-8 -mb-8 p-6 text-center" style={{ borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px' }}>
                <span className="text-xs font-mono text-[#F59E0B] font-bold drop-shadow-sm">RESULT: Maximized margins, clear supplier audit logs.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section className="py-20 border-b border-white/10 bg-transparent">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-heading font-bold tracking-widest text-[#F59E0B] mb-2 block drop-shadow-md">
              Transparent Pricing
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-white drop-shadow-lg">
              Simple plans for growing factories
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Free Tier */}
            <div className="border border-[#475569] hover:border-white/40 bg-[#1E222A]/80 backdrop-blur-xs p-8 flex flex-col justify-between shadow-2xl" style={{ borderRadius: '6px' }}>
              <div>
                <div className="mb-6">
                  <h3 className="font-heading text-lg font-bold text-[#E2E8F0] uppercase tracking-wider drop-shadow-sm">Free</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="font-mono text-4xl font-extrabold tracking-tight text-white drop-shadow-md">₹0</span>
                    <span className="ml-1 text-sm text-[#E2E8F0]/80">/ forever</span>
                  </div>
                  <p className="text-xs text-[#E2E8F0]/70 mt-2 font-mono">Suitable for testing or basic purchasing cycles</p>
                </div>
                
                <ul className="space-y-3 pt-6 border-t border-white/15">
                  <li className="flex items-center gap-2.5 text-sm text-[#E2E8F0]">
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full"></span>
                    <span>3 RFQs per month</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-[#E2E8F0]">
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full"></span>
                    <span>Up to 10 active vendors</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-[#E2E8F0]">
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full"></span>
                    <span>Standard comparison matrix</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-[#E2E8F0]">
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full"></span>
                    <span>Email dispatch notifications</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link 
                  href="/login?signup=true" 
                  className="block w-full text-center bg-white/10 hover:bg-white/20 text-white font-bold py-3 border border-white/20 transition-colors shadow-md"
                  style={{ borderRadius: '6px' }}
                >
                  Start Free
                </Link>
              </div>
            </div>

            {/* Pro Tier */}
            <div className="border-2 border-accent bg-[#1E222A]/80 backdrop-blur-xs p-8 flex flex-col justify-between relative shadow-2xl" style={{ borderRadius: '6px' }}>
              <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-accent text-white px-3 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-sm font-bold border border-accent-hover shadow-md">
                Recommended
              </div>
              <div>
                <div className="mb-6">
                  <h3 className="font-heading text-lg font-bold text-[#F59E0B] uppercase tracking-wider drop-shadow-sm">Pro</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="font-mono text-4xl font-extrabold tracking-tight text-white drop-shadow-md">₹xxx</span>
                    <span className="ml-1 text-sm text-[#E2E8F0]/80">/ month</span>
                  </div>
                  <p className="text-xs text-[#E2E8F0]/70 mt-2 font-mono">For factories running weekly procurement cycles</p>
                </div>
                
                <ul className="space-y-3 pt-6 border-t border-white/15">
                  <li className="flex items-center gap-2.5 text-sm text-[#E2E8F0]">
                    <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full"></span>
                    <span className="font-bold text-white">Unlimited RFQ dispatches</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-[#E2E8F0]">
                    <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full"></span>
                    <span className="font-bold text-white">Unlimited vendor directory</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-[#E2E8F0]">
                    <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full"></span>
                    <span>AI parsing (PDF & unstructured text)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-[#E2E8F0]">
                    <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full"></span>
                    <span>AI-powered vendor match recommendations</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-[#E2E8F0]">
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

          <div className="mt-8 p-4 border border-white/20 bg-[#1E222A]/80 text-center shadow-lg" style={{ borderRadius: '6px' }}>
            <span className="text-xs sm:text-sm text-[#E2E8F0] font-body">
              ⚡ <strong>Founding Member Discount:</strong> Get Pro for only <strong>₹xxx/month</strong>. Limited to the first 10 customers. Locked in forever.
            </span>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-[#1E222A] border-t border-white/15 py-12 relative z-10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="font-heading font-bold text-lg tracking-tight text-white drop-shadow-sm">
              RFQPilot
            </span>
            <p className="text-xs text-[#E2E8F0] mt-1 font-body">
              An RFQ Engine Built for Indian Manufacturers.
            </p>
          </div>
          <div className="text-center md:text-right">
            <span className="text-xs font-mono text-[#E2E8F0]/80">
              Made in Noida, India.
            </span>
            <p className="text-[10px] text-[#E2E8F0]/60 mt-1 font-mono">
              © {new Date().getFullYear()} RFQPilot. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
