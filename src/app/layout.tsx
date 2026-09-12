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
    default: "RFQDeck | B2B Procure-to-Pay Engine for Indian Manufacturers",
    template: "%s | RFQDeck",
  },
  description: "Automate raw material sourcing, dispatch multi-vendor RFQs with single-use tokens, and compare landed costs in unified matrices.",
  
  // Fixes: Missing canonical URL warning
  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Fixes: Favicon, Apple Touch Icon, and SVG alerts completely
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" }
    ],
    shortcut: "/favicon.svg",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },

  // Fixes: Missing web app manifest for PWA/Android capabilities
  manifest: "/site.webmanifest",

  // Core Open Graph Data Mapping
  openGraph: {
    title: "RFQDeck | B2B Procure-to-Pay Engine for Indian Manufacturers",
    description: "Automate raw material sourcing, dispatch multi-vendor RFQs with single-use tokens, and compare landed costs in unified matrices.",
    url: "https://rfqdeck.com",
    siteName: "RFQDeck",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/landing.png", // Routed path to your landing page preview
        width: 1200,         // Exact 1200x630 dimension
        height: 630,            
        type: "image/png",
        alt: "RFQDeck Operational RFQ Engine Preview",
      },
    ],
  },
  
  // Core Twitter/X Rich Card Protocol
  twitter: {
    card: "summary_large_image",
    title: "RFQDeck | B2B Procure-to-Pay Engine for Indian Manufacturers",
    description: "Automate raw material sourcing, dispatch multi-vendor RFQs with single-use tokens, and compare landed costs in unified matrices.",
    images: ["/landing.png"],
    site: "@jatin02k",
    creator: "@jatin02k",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://rfqdeck.com/#website",
      "url": "https://rfqdeck.com",
      "name": "RFQDeck",
      "description": "B2B Procure-to-Pay Engine for Indian Manufacturers",
      "publisher": {
        "@id": "https://rfqdeck.com/#organization"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://rfqdeck.com/#organization",
      "name": "RFQDeck",
      "url": "https://rfqdeck.com",
      "logo": "https://rfqdeck.com/favicon-32x32.png",
      "sameAs": [
        "https://twitter.com/jatin02k"
      ]
    },
    {
      "@type": ["SoftwareApplication", "WebApplication"],
      "@id": "https://rfqdeck.com/#software",
      "name": "RFQDeck",
      "url": "https://rfqdeck.com",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description": "Automate raw material sourcing, dispatch multi-vendor RFQs with single-use tokens, and compare landed costs in unified matrices.",
      "image": "https://rfqdeck.com/landing.png",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": "Free tier includes 3 active RFQs, landed cost matrix, and vendor quote portals"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://rfqdeck.com/#webpage",
      "url": "https://rfqdeck.com",
      "name": "RFQDeck | B2B Procure-to-Pay Engine for Indian Manufacturers",
      "description": "Automate raw material sourcing, dispatch multi-vendor RFQs with single-use tokens, and compare landed costs in unified matrices.",
      "isPartOf": {
        "@id": "https://rfqdeck.com/#website"
      },
      "about": {
        "@id": "https://rfqdeck.com/#software"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}