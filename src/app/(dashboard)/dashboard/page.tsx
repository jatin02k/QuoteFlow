import React from "react";
import Link from "next/link";
import { getRFQs } from "@/actions/rfq";
import { getVendors } from "@/actions/vendor";
import { getCompanyName } from "@/actions/rfq";

export const metadata = {
  title: "Dashboard // RFQDeck",
  description: "Procurement control dashboard and active request statistics.",
};

export default async function DashboardPage() {
  const [rfqsRes, vendorsRes, companyName] = await Promise.all([
    getRFQs(),
    getVendors(),
    getCompanyName(),
  ]);

  const activeRFQs = rfqsRes.success && rfqsRes.data?.active ? rfqsRes.data.active : [];
  const vendors = vendorsRes.success && vendorsRes.data ? vendorsRes.data : [];

  const totalQuotesReceived = activeRFQs.reduce((acc, rfq) => acc + (rfq.quotes_received || 0), 0);
  const comparingRFQsCount = activeRFQs.filter((r) => r.status === "comparing").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-default">
        <div>
          <span className="font-mono text-[10px] text-accent font-bold tracking-widest uppercase block mb-1">
            CONTROL CENTER // {companyName.toUpperCase()}
          </span>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-text-primary">
            Procurement Overview
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/rfqs/new"
            className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 border border-accent-hover rounded-sm transition-colors shadow-xs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="square" d="M12 5v14M5 12h14" />
            </svg>
            <span>Create RFQ</span>
          </Link>
          <Link
            href="/vendors"
            className="inline-flex items-center justify-center gap-2 bg-bg-surface hover:bg-bg-sunken text-text-primary text-xs font-bold uppercase tracking-wider px-4 py-2.5 border border-border-default rounded-sm transition-colors"
          >
            <span>+ Add Supplier</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active RFQs */}
        <div className="bg-bg-surface border border-border-strong p-5 rounded-sm shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted uppercase">
            <span>ACTIVE REQUESTS</span>
            <span className="text-accent font-bold">● ONLINE</span>
          </div>
          <div className="font-mono text-3xl font-bold text-text-primary">
            {activeRFQs.length}
          </div>
          <p className="text-[11px] font-body text-text-secondary">
            Requests currently open for vendor quotations
          </p>
        </div>

        {/* Card 2: Quotes Received */}
        <div className="bg-bg-surface border border-border-strong p-5 rounded-sm shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted uppercase">
            <span>QUOTES RECEIVED</span>
            <span className="text-status-success font-bold">✓ INBOX</span>
          </div>
          <div className="font-mono text-3xl font-bold text-text-primary">
            {totalQuotesReceived}
          </div>
          <p className="text-[11px] font-body text-text-secondary">
            Total pricing responses returned by suppliers
          </p>
        </div>

        {/* Card 3: Ready for Comparison */}
        <div className="bg-bg-surface border border-border-strong p-5 rounded-sm shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted uppercase">
            <span>COMPARING STAGE</span>
            <span className="text-accent font-bold">★ AI EVAL</span>
          </div>
          <div className="font-mono text-3xl font-bold text-text-primary">
            {comparingRFQsCount}
          </div>
          <p className="text-[11px] font-body text-text-secondary">
            RFQs ready for price & delivery evaluation
          </p>
        </div>

        {/* Card 4: Registered Suppliers */}
        <div className="bg-bg-surface border border-border-strong p-5 rounded-sm shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted uppercase">
            <span>REGISTERED VENDORS</span>
            <span className="text-text-muted font-bold">DIRECT</span>
          </div>
          <div className="font-mono text-3xl font-bold text-text-primary">
            {vendors.length}
          </div>
          <p className="text-[11px] font-body text-text-secondary">
            Suppliers available in your operational directory
          </p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Recent RFQs */}
        <div className="lg:col-span-8 bg-bg-surface border border-border-strong rounded-sm p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-border-default">
            <div>
              <span className="font-mono text-[9px] text-accent font-bold tracking-widest uppercase block">
                RECENT ACTIVITY
              </span>
              <h2 className="font-heading text-lg font-bold text-text-primary mt-0.5">
                Active Requests for Quotation
              </h2>
            </div>
            <Link
              href="/rfqs"
              className="text-xs font-mono font-bold text-accent hover:underline uppercase tracking-wider"
            >
              View All →
            </Link>
          </div>

          {activeRFQs.length === 0 ? (
            <div className="p-8 bg-bg-base border border-border-default rounded-sm text-center space-y-3">
              <p className="text-xs text-text-secondary font-body">
                No active RFQs created yet. Create your first request to begin receiving vendor quotes.
              </p>
              <Link
                href="/rfqs/new"
                className="inline-flex items-center gap-2 bg-accent text-white text-xs font-bold px-4 py-2 rounded-sm border border-accent-hover uppercase"
              >
                + Create RFQ
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto border border-border-default rounded-sm bg-bg-base">
              <table className="w-full text-left text-xs font-body">
                <thead>
                  <tr className="border-b border-border-default bg-bg-sunken font-heading font-semibold text-[10px] text-text-secondary uppercase tracking-wider">
                    <th className="py-2.5 px-3">Title</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-center">Quotes</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {activeRFQs.slice(0, 5).map((rfq) => (
                    <tr key={rfq.id} className="hover:bg-bg-surface">
                      <td className="py-3 px-3 font-semibold text-text-primary max-w-xs truncate">
                        {rfq.title}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 rounded-sm font-mono text-[10px] font-bold uppercase bg-accent-light text-accent border border-accent-border">
                          {rfq.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-text-secondary">
                        {rfq.quotes_received || 0}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/rfqs/${rfq.id}`}
                          className="font-mono text-[11px] font-bold text-accent hover:underline uppercase"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Quick Navigation & System Status */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-bg-surface border border-border-strong p-6 rounded-sm space-y-4 shadow-xs">
            <div className="font-heading text-xs font-bold text-text-secondary uppercase tracking-wider pb-2 border-b border-border-default">
              Quick Operations
            </div>
            <div className="space-y-2.5">
              <Link
                href="/rfqs/new"
                className="flex items-center justify-between p-3 bg-bg-base hover:bg-bg-sunken border border-border-default rounded-sm transition-all text-xs font-mono font-semibold text-text-primary"
              >
                <div className="flex items-center gap-2">
                  <span className="text-accent font-bold">+</span>
                  <span>Create New RFQ</span>
                </div>
                <span className="text-text-muted">→</span>
              </Link>
              <Link
                href="/vendors"
                className="flex items-center justify-between p-3 bg-bg-base hover:bg-bg-sunken border border-border-default rounded-sm transition-all text-xs font-mono font-semibold text-text-primary"
              >
                <div className="flex items-center gap-2">
                  <span className="text-accent font-bold">📂</span>
                  <span>Manage Supplier Directory</span>
                </div>
                <span className="text-text-muted">→</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center justify-between p-3 bg-bg-base hover:bg-bg-sunken border border-border-default rounded-sm transition-all text-xs font-mono font-semibold text-text-primary"
              >
                <div className="flex items-center gap-2">
                  <span className="text-accent font-bold">⚙</span>
                  <span>System Preferences</span>
                </div>
                <span className="text-text-muted">→</span>
              </Link>
            </div>
          </div>

          {/* System Isolation Guarantee */}
          <div className="bg-bg-surface border border-border-default p-5 rounded-sm space-y-2 text-xs font-body">
            <div className="font-mono text-[10px] text-accent font-bold uppercase tracking-wider">
              MULTI-TENANT ISOLATION
            </div>
            <p className="text-text-secondary text-[11px] leading-relaxed">
              Strict token isolation guarantees competing suppliers never see each other&apos;s identities or pricing responses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}