import type { Metadata, Viewport } from 'next'
import React from 'react'
import './globals.css'

export const viewport: Viewport = {
  themeColor: '#0f172a',
}

export const metadata: Metadata = {
  // Fixes absolute image scaling requirements globally
  metadataBase: new URL("https://rfqdeck.com"), 
  
  // Base configuration & cyber-industrial branding alignment
  title: {
    default: "RFQDeck | Operational RFQ Engine",
    template: "%s | RFQDeck",
  },
  description: "Automate raw material sourcing, dispatch multi-vendor RFQs, and optimize supplier pipelines.",
  
  // Fixes: Missing canonical URL warning
  alternates: {
    canonical: "/",
  },

  // Fixes: Favicon, Apple Touch Icon, and SVG alerts completely
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },

  // Fixes: Missing web app manifest for PWA/Android capabilities
  manifest: "/site.webmanifest",

  // Core Open Graph Data Mapping
  openGraph: {
    title: "RFQDeck | Operational RFQ Engine",
    description: "Automate raw material sourcing, dispatch multi-vendor RFQs, and optimize supplier pipelines.",
    url: "https://rfqdeck.com",
    siteName: "RFQDeck",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/landing.png", // Routed path to your landing page preview
        width: 1200,             // Confirms the meta-declaration size
        height: 630,            
        alt: "RFQDeck Operational RFQ Engine Preview",
      },
    ],
  },
  
  // Core Twitter/X Rich Card Protocol
  twitter: {
    card: "summary_large_image",
    title: "RFQDeck | Operational RFQ Engine",
    description: "Automate raw material sourcing, dispatch multi-vendor RFQs, and optimize supplier pipelines.",
    images: ["/landing.png"],
    // Fixes: Missing twitter:site branding attribute
    site: "@jatin02k", // Replace with your build-in-public handle or brand account
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