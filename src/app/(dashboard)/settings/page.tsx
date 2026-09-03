import React from "react";
import { getCompanyName } from "@/actions/rfq";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Settings // RFQDeck",
  description: "Company profile, procurement preferences, and security settings.",
};

export default async function SettingsPage() {
  const companyName = await getCompanyName();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userEmail = user?.email || "operator@rfqdeck.in";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b border-border-default space-y-1">
        <span className="font-mono text-[10px] text-accent font-bold tracking-widest uppercase block">
          SYSTEM PREFERENCES // P2P CONFIGURATION
        </span>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-text-primary">
          Organization & Gateways Settings
        </h1>
      </div>

      <div className="space-y-6">
        {/* Company Profile Panel */}
        <div className="bg-bg-surface border border-border-strong rounded-sm p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-border-default">
            <div>
              <span className="font-mono text-[9px] text-accent font-semibold tracking-wider uppercase block">
                ORGANIZATION PROFILE
              </span>
              <h2 className="font-heading text-base font-bold text-text-primary mt-0.5">
                Company Details
              </h2>
            </div>
            <span className="font-mono text-[10px] text-status-success bg-status-success-bg px-2 py-0.5 border border-status-success/30 rounded-sm font-bold uppercase">
              ACTIVE SUBSCRIBER
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-body">
            <div>
              <label className="block font-heading text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                Company Name
              </label>
              <input
                type="text"
                readOnly
                value={companyName}
                className="w-full px-3 py-2 bg-bg-sunken border border-border-default rounded-sm font-semibold text-text-primary outline-hidden"
              />
            </div>

            <div>
              <label className="block font-heading text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                Primary Account Email
              </label>
              <input
                type="text"
                readOnly
                value={userEmail}
                className="w-full px-3 py-2 bg-bg-sunken border border-border-default rounded-sm font-mono text-text-primary outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Operational Categories & Settings */}
        <div className="bg-bg-surface border border-border-strong rounded-sm p-6 space-y-4 shadow-xs">
          <div className="pb-3 border-b border-border-default">
            <span className="font-mono text-[9px] text-accent font-semibold tracking-wider uppercase block">
              PROCUREMENT PARAMETERS
            </span>
            <h2 className="font-heading text-base font-bold text-text-primary mt-0.5">
              Default Terms & Currency
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-body">
            <div className="p-3 bg-bg-base border border-border-default rounded-sm space-y-1">
              <span className="text-[10px] font-mono text-text-muted uppercase">Default Currency</span>
              <div className="font-mono font-bold text-text-primary">INR (₹ / Rupee)</div>
            </div>
            <div className="p-3 bg-bg-base border border-border-default rounded-sm space-y-1">
              <span className="text-[10px] font-mono text-text-muted uppercase">Default Payment Terms</span>
              <div className="font-mono font-bold text-text-primary">Net 30 / Net 60</div>
            </div>
            <div className="p-3 bg-bg-base border border-border-default rounded-sm space-y-1">
              <span className="text-[10px] font-mono text-text-muted uppercase">Token Validity</span>
              <div className="font-mono font-bold text-text-primary">Single-Use Link Locked</div>
            </div>
          </div>
        </div>

        {/* Security & Multi-tenant Rules */}
        <div className="bg-bg-surface border border-border-strong rounded-sm p-6 space-y-4 shadow-xs">
          <div className="pb-3 border-b border-border-default">
            <span className="font-mono text-[9px] text-accent font-semibold tracking-wider uppercase block">
              SECURITY & COMPLIANCE
            </span>
            <h2 className="font-heading text-base font-bold text-text-primary mt-0.5">
              Data Isolation Protocol
            </h2>
          </div>

          <div className="space-y-2 text-xs font-body text-text-secondary leading-relaxed">
            <p>
              ✔ <strong>Vendor Insulation:</strong> External suppliers access quote entry forms exclusively via single-use encrypted token URLs (`/respond/[token]`).
            </p>
            <p>
              ✔ <strong>Cross-Supplier Leak Prevention:</strong> Competing suppliers cannot view each other&apos;s identity, pricing, or response status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}