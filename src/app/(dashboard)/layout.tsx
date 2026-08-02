import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SidebarNav from '@/components/layout/SidebarNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const userEmail = user.email || 'operator@rfqpilot.in'

  return (
    <div className="flex min-h-screen bg-bg-base font-body text-text-primary antialiased">
      {/* Sidebar Navigation */}
      <SidebarNav userEmail={userEmail} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar / Control Panel Header */}
        <header className="h-16 border-b border-border-default flex items-center px-8 justify-between bg-bg-base">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-heading font-semibold tracking-wider text-text-secondary">
              MANUFACTURING PORTAL
            </span>
            <div className="w-1.5 h-1.5 bg-status-success rounded-full animate-pulse" title="System Online"></div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-text-muted">
            <span>SECURE GATEWAY</span>
            <span>•</span>
            <span>AUTO-SYNC ENABLED</span>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-bg-base p-8">
          {children}
        </main>
      </div>
    </div>
  )
}