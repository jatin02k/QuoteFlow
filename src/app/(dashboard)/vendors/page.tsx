import React from "react";
import { getVendors } from "@/actions/vendor";
import VendorList from "@/components/vendor/VendorList";
import { Vendor } from "@/types";

export const metadata = {
  title: "Supplier Directory : RFQDeck",
  description:
    "System portal for listing, filtering, provisioning, and managing company vendors and suppliers.",
};

export default async function VendorsPage() {
  const result = await getVendors();

  if (!result.success) {
    return (
      <div className="max-w-2xl mx-auto my-12 border border-status-error bg-status-error-bg p-6 rounded-sm shadow-xs" style={{ borderRadius: "4px" }}>
        <div className="flex items-start gap-4">
          <div className="p-2 bg-status-error text-white rounded-sm shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="square" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <span className="font-mono text-[9px] text-status-error font-semibold tracking-wider uppercase block">
              PORTAL GATEWAY ERROR // DB.CONN.FAIL
            </span>
            <h2 className="font-heading text-lg font-bold text-text-primary mt-0.5">
              Data Synchronization Failure
            </h2>
            <p className="text-sm text-text-secondary mt-1.5 font-body leading-relaxed">
              {result.error || "An error occurred while loading your supplier records. Please check your secure connection, verify your session status, or contact system support."}
            </p>
            <div className="mt-4 pt-3 border-t border-border-default flex gap-3">
              <a
                href="/vendors"
                className="text-xs font-mono font-bold text-accent hover:text-accent-hover transition-colors uppercase tracking-wider"
              >
                // Force Reconnect
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cast vendor data to match client component type expectations
  const vendors = (result.data || []) as Vendor[];

  return <VendorList initialVendors={vendors} />;
}