import type { Metadata } from 'next'
import React from 'react'
import './globals.css'

export const metadata: Metadata = {

  metadataBase: new URL("https://quote-flow-ten.vercel.app"), 
  
  title: {
    default: "QuoteFlow // Operational Procurement Engine",
    template: "%s // QuoteFlow", // Child pages will auto-append this
  },
  description: "Automate raw material sourcing, dispatch multi-vendor RFQs, and optimize supplier pipelines.",
  
  // 2. Open Graph Protocol (WhatsApp, Discord, LinkedIn)
  openGraph: {
    title: "QuoteFlow // Industrial Procurement",
    description: "Automate raw material sourcing, dispatch multi-vendor RFQs, and optimize supplier pipelines.",
    url: "https://quote-flow-ten.vercel.app",
    siteName: "QuoteFlow",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/landingPage.png", // Next.js maps this to your asset folder
        width: 1200,
        height: 630,
        alt: "QuoteFlow Industrial Procurement Interface Preview",
      },
    ],
  },
  
  // 3. Twitter/X Card Preview Setup
  twitter: {
    card: "summary_large_image", // Forces a large clickable photo preview
    title: "QuoteFlow // Industrial Procurement",
    description: "Automate raw material sourcing, dispatch multi-vendor RFQs, and optimize supplier pipelines.",
    images: ["/landingPage.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}