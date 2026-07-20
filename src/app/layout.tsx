import type { Metadata } from 'next'
import React from 'react'
import './globals.css'


export const metadata: Metadata = {
  metadataBase: new URL("https://quote-flow-ten.vercel.app/"), 
  
  title: {
    default: "QuoteFlow // Operational Procurement Engine",
    template: "%s // QuoteFlow",
  },
  description: "Enterprise system portal for automated RFQ dispatch, supplier directory management, and real-time pricing analysis.",
  
  openGraph: {
    title: "QuoteFlow // Industrial Procurement",
    description: "Automate raw material sourcing, dispatch multi-vendor RFQs, and optimize supplier pipelines.",
    url: "https://quote-flow-ten.vercel.app/",
    siteName: "QuoteFlow",
    locale: "en_US",
    type: "website",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "QuoteFlow // Industrial Procurement",
    description: "Automate raw material sourcing, dispatch multi-vendor RFQs, and optimize supplier pipelines.",
    creator: "https://x.com/jatin02k", // Add your BIP handle here!
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